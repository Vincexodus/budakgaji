# # signatures/generators.py
# from dataclasses import dataclass
# from datetime import datetime, timedelta
# from typing import Dict, List

# @dataclass
# class FraudSignature:
#     fraud_tag: str
#     risk_vector: Dict[str, float]
#     contributing_factors: List[str]
#     timestamp: datetime

# class NetworkSignatureGenerator:
#     def __init__(self, model: GraphModel):
#         self.model = model
#         self._cache = {}
#         self.cache_ttl = timedelta(minutes=5)
    
#     def generate(self, account_id: str) -> FraudSignature:
#         # Check cache
#         if account_id in self._cache:
#             if datetime.now() - self._cache[account_id]['timestamp'] < self.cache_ttl:
#                 return self._cache[account_id]['signature']

#         # Get metrics from GPU model
#         metrics = self.model.get_node_metrics(account_id)
        
#         # Build fraud patterns and risk vectors
#         fraud_patterns = []
#         risk_vector = {}
        
#         # Analyze cycles
#         if metrics['cycles']['is_in_cycle']:
#             fraud_patterns.append(f"Part of {metrics['cycles']['cycle_length']}-node circular fund flow")
#             risk_vector['circular_flow_risk'] = metrics['cycles']['cycle_risk']
        
#         # Analyze community
#         if metrics['community']['density'] > 0.7:
#             fraud_patterns.append("High-density transaction cluster detected")
#             risk_vector['community_risk'] = metrics['community']['risk_score']
        
#         # Analyze temporal
#         if metrics['temporal']['high_velocity']:
#             fraud_patterns.append(f"Abnormal transaction velocity: {metrics['temporal']['tx_per_hour']} tx/hour")
#             risk_vector['velocity_risk'] = metrics['temporal']['velocity_score']

#         signature = FraudSignature(
#             fraud_tag=self._determine_primary_pattern(risk_vector),
#             risk_vector=risk_vector,
#             contributing_factors=fraud_patterns[:3],
#             timestamp=datetime.now()
#         )

#         # Cache result
#         self._cache[account_id] = {
#             'timestamp': datetime.now(),
#             'signature': signature
#         }
        
#         return signature

#     def _determine_primary_pattern(self, risk_vector: Dict[str, float]) -> str:
#         if not risk_vector:
#             return "Unknown Pattern"
            
#         max_risk = max(risk_vector.items(), key=lambda x: x[1])
#         patterns = {
#             'circular_flow_risk': 'Circular Fund Flow',
#             'community_risk': 'Suspicious Network Cluster',
#             'velocity_risk': 'Velocity Anomaly'
#         }
#         return patterns.get(max_risk[0], 'Complex Fraud Pattern')



import shap
import xgboost as xgb
from typing import Dict, List

class NetworkSignatureGenerator:
    def __init__(self, model: xgb.XGBClassifier, graph_model: GraphModel):
        self.model = model
        self.graph_model = graph_model
        self.explainer = shap.TreeExplainer(model)
        self.feature_names = [
            'centrality', 'cycle_length', 'community_density',
            'tx_velocity', 'avg_amount', 'geo_distance'
        ]
    
    def generate_signature(self, features: np.ndarray) -> Dict:
        # Get SHAP values
        shap_values = self.explainer.shap_values(features)
        
        # Get prediction and probabilities
        pred_proba = self.model.predict_proba(features)[0]
        
        # Map SHAP values to risk factors
        risk_vector = self._get_risk_vector(shap_values[1])  # Class 1 = fraud
        contributing_factors = self._get_contributing_factors(shap_values[1])
        
        # Get graph metrics for additional context
        graph_metrics = self.graph_model.get_node_metrics(features['account_id'])
        
        return {
            "fraud_tag": self._determine_fraud_tag(risk_vector, graph_metrics),
            "risk_vector": risk_vector,
            "contributing_factors": contributing_factors,
            "timestamp": datetime.utcnow().isoformat()
        }
    
    def _get_risk_vector(self, shap_values: np.ndarray) -> Dict[str, float]:
        """Convert SHAP values to risk scores"""
        return {
            name: abs(float(value))  # Normalize to [0,1]
            for name, value in zip(self.feature_names, shap_values)
            if abs(value) > 0.1  # Filter low impact features
        }
    
    def _get_contributing_factors(self, shap_values: np.ndarray) -> List[str]:
        """Generate human-readable factors from top SHAP values"""
        factors = []
        
        # Map high SHAP values to explanations
        feature_impacts = list(zip(self.feature_names, shap_values))
        sorted_impacts = sorted(feature_impacts, key=lambda x: abs(x[1]), reverse=True)
        
        for feature, impact in sorted_impacts[:3]:
            if feature == 'tx_velocity' and impact > 0:
                factors.append("High transaction frequency within 1 minute")
            elif feature == 'community_density' and impact > 0:
                factors.append("Part of a dense transaction cluster")
            elif feature == 'cycle_length' and impact > 0:
                factors.append("Part of a circular fund flow pattern")
                
        return factors
    
    def _determine_fraud_tag(self, risk_vector: Dict, graph_metrics: Dict) -> str:
        """Determine primary fraud pattern"""
        max_risk = max(risk_vector.items(), key=lambda x: x[1])
        
        patterns = {
            'tx_velocity': 'Velocity Anomaly',
            'community_density': 'Suspicious Network Cluster',
            'cycle_length': 'Circular Fund Flow'
        }
        
        return patterns.get(max_risk[0], 'Complex Fraud Pattern')