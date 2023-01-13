export interface ExplorerBlock {
  height: number;
  hash: string;
  txCount: number;
  snarkCount: number;
  date: string;
  timestamp: number;
  snarkedLedgerHash: string;
  stagedLedgerHash: string;
}
