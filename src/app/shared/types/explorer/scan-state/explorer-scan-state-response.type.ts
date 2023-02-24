import { ExplorerScanStateTree } from '@shared/types/explorer/scan-state/explorer-scan-state-tree.type';

export interface ExplorerScanStateResponse {
  scanState: ExplorerScanStateTree[];
  txCount: number;
  snarksCount: number;
  firstBlock: number;
  userCommandsCount: number;
  feeTransferCount: number;
  zkappCommandsCount: number;
}
