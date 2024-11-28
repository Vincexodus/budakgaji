export interface configTabProps {
  activeBank: {
    name: string;
    riskThreshold: number;
    enableML: boolean;
    autoEscalation: boolean;
  };
  setActiveBank: React.Dispatch<
    React.SetStateAction<{
      name: string;
      riskThreshold: number;
      enableML: boolean;
      autoEscalation: boolean;
    }>
  >;
}
