from typing import Dict, Tuple, List
import cudf
import cugraph
import numpy as np
from datetime import datetime, timedelta

class GraphModel:
    def __init__(self, device_id: int = 0):
        self.g = None
        self.device_id = device_id
        self._init_gpu()
        self._cache = {}
        self.cache_ttl = timedelta(minutes=5)

    def get_node_metrics(self, node_id: str) -> Dict:
        """Get all graph metrics for a node"""
        return {
            'cycles': self._detect_cycles(node_id),
            'community': self._analyze_community(node_id),
            'temporal': self._get_temporal_patterns(node_id)
    }
    
    def get_fraud_signature(self, node_id: str) -> Dict:
        if not self.is_ready:
            raise RuntimeError("Graph not initialized")
            
        # Check cache
        if node_id in self._cache:
            if datetime.now() - self._cache[node_id]['timestamp'] < self.cache_ttl:
                return self._cache[node_id]['signature']

        try:
            # Get basic metrics
            centrality = self._get_centrality(node_id)
            cycles = self._detect_cycles(node_id)
            community = self._analyze_community(node_id)
            temporal = self._get_temporal_patterns(node_id)
            
            # Determine fraud patterns
            fraud_patterns = []
            risk_vector = {}
            
            # Check for circular fund flow
            if cycles['is_in_cycle']:
                fraud_patterns.append(f"Part of {cycles['cycle_length']}-node circular fund flow")
                risk_vector['circular_flow_risk'] = cycles['cycle_risk']
            
            # Check for suspicious community patterns
            if community['density'] > 0.7:
                fraud_patterns.append("High-density transaction cluster detected")
                risk_vector['community_risk'] = community['risk_score']
            
            # Check temporal patterns
            if temporal['high_velocity']:
                fraud_patterns.append(f"Abnormal transaction velocity: {temporal['tx_per_hour']} tx/hour")
                risk_vector['velocity_risk'] = temporal['velocity_score']
            
            signature = {
                "fraud_tag": self._determine_primary_pattern(risk_vector),
                "risk_vector": risk_vector,
                "contributing_factors": fraud_patterns[:3],
                "timestamp": datetime.utcnow().isoformat()
            }
            
            # Cache result
            self._cache[node_id] = {
                'timestamp': datetime.now(),
                'signature': signature
            }
            
            return signature
            
        except Exception as e:
            logger.error(f"Signature generation failed: {str(e)}")
            return self._get_default_signature()

    def _detect_cycles(self, node_id: str) -> Dict:
        """Detect circular fund flows using Strongly Connected Components"""
        scc = cugraph.strongly_connected_components(self.g)
        cycles = cugraph.utils.get_traversed_path(self.g, node_id)
        
        return {
            'is_in_cycle': len(cycles) > 2,
            'cycle_length': len(cycles),
            'cycle_risk': self._calculate_cycle_risk(cycles)
        }

    def _analyze_community(self, node_id: str) -> Dict:
        """Analyze community patterns"""
        communities = cugraph.community.louvain(self.g)
        community_id = communities[node_id]
        members = communities[communities == community_id]
        
        density = self._calculate_community_density(members)
        risk_score = self._assess_community_risk(members)
        
        return {
            'density': density,
            'size': len(members),
            'risk_score': risk_score
        }

    def _get_temporal_patterns(self, node_id: str) -> Dict:
        """Analyze temporal transaction patterns"""
        edges = self.g.edges
        node_edges = edges[edges['source'] == node_id]
        
        # Group by time windows
        hourly_counts = self._calculate_hourly_frequencies(node_edges)
        velocity_score = self._calculate_velocity_anomaly(hourly_counts)
        
        return {
            'tx_per_hour': float(hourly_counts.mean()),
            'high_velocity': velocity_score > 0.8,
            'velocity_score': velocity_score
        }

    def _determine_primary_pattern(self, risk_vector: Dict) -> str:
        """Determine primary fraud pattern based on risk scores"""
        if not risk_vector:
            return "Unknown Pattern"
            
        max_risk = max(risk_vector.items(), key=lambda x: x[1])
        
        patterns = {
            'circular_flow_risk': 'Circular Fund Flow',
            'community_risk': 'Suspicious Network Cluster',
            'velocity_risk': 'Velocity Anomaly'
        }
        
        return patterns.get(max_risk[0], 'Complex Fraud Pattern')