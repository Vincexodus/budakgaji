# risk_engine/engine.py
class RiskEngine:
    def __init__(
        self,
        network_generator: NetworkSignatureGenerator,
        config: Dict[str, float]
    ):
        self.network_generator = network_generator
        self.config = config
        
    def evaluate_risk(self, account_id: str) -> Dict:
        # Get signatures
        network_sig = self.network_generator.generate(account_id)
        
        # Calculate risk scores
        network_risk = (
            network_sig.centrality * self.config['centrality_weight'] +
            network_sig.cycle_score * self.config['cycle_weight'] +
            network_sig.community_score * self.config['community_weight']
        )
        
        return {
            "fraud_tag": self._determine_tag(network_risk),
            "risk_vector": {
                "network_risk": float(network_risk)
            },
            "contributing_factors": self._get_factors(network_sig),
            "timestamp": datetime.utcnow().isoformat()
        }