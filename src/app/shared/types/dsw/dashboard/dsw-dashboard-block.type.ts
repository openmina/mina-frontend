export interface DswDashboardBlock {
  globalSlot: number;
  height: number;
  hash: string;
  predHash: string;
  status: DswDashboardNodeBlockStatus;
  fetchStart: number;
  fetchEnd: number;
  applyStart: number;
  applyEnd: number;
  fetchDuration: number;
  applyDuration: number;
  isBestTip?: boolean;
}

export enum DswDashboardNodeBlockStatus {
  APPLIED = 'Applied',
  APPLYING = 'Applying',
  FETCHED = 'Fetched',
  FETCHING = 'Fetching',
  MISSING = 'Missing',
}