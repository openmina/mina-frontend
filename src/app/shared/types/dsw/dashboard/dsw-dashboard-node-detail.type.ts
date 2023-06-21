export interface DswDashboardNodeDetail {
  syncStakingLedger: string;
  syncEpochLedger: string;
  syncRootLedger: string;
  bestTipReceived: number;
  missingBlocks: number;
  downloadingBlocks: number;
  applyingBlocks: number;
  appliedBlocks: number;
}
