export interface BenchmarksWallet {
  publicKey: string;
  privateKey: string;
  minaTokens: number;
  nonce: number;
  mempoolNonce: number;
  lastTxTime: string;
  lastTxMemo: string;
  lastTxStatus: string;
  successTx: number;
  failedTx: number;
  errorReason: string;
}
