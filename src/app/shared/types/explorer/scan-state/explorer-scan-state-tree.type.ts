import { ExplorerScanStateLeaf } from '@shared/types/explorer/scan-state/explorer-scan-state-leaf.type';

export interface ExplorerScanStateTree {
  leafs: ExplorerScanStateLeaf[];
  empty: number;
  todo: number;
  done: number;
}
