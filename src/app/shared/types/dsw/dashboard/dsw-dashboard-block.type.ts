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
}

export enum DswDashboardNodeBlockStatus {
  APPLIED = 'Applied',
  APPLYING = 'Applying',
  FETCHED = 'Fetched',
  FETCHING = 'Fetching',
  MISSING = 'Missing',
}