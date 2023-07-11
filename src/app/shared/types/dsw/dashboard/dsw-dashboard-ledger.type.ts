export interface DswDashboardLedger {
  root?: DswDashboardLedgerStep;
  stakingEpoch?: DswDashboardLedgerStep;
  nextEpoch?: DswDashboardLedgerStep;
}

export interface DswDashboardLedgerStep {
  state: DswDashboardLedgerStepState;
  snarked: DswDashboardLedgerStepSnarked;
  staged: DswDashboardLedgerStepStaged;
  totalTime: number;
}

export enum DswDashboardLedgerStepState {
  PENDING = 'pending',
  LOADING = 'loading',
  SUCCESS = 'success',
}

export interface DswDashboardLedgerStepSnarked {
  fetchHashesStart: number;
  fetchHashesEnd: number;
  fetchAccountsStart: number;
  fetchAccountsEnd: number;
  fetchHashesDuration: number;
  fetchAccountsDuration: number;
}

export interface DswDashboardLedgerStepStaged {
  fetchPartsStart: number;
  fetchPartsEnd: number;
  reconstructStart: number;
  reconstructEnd: number;
  fetchPartsDuration: number;
  reconstructDuration: number;
}