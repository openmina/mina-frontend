export interface ExplorerSignedTransaction {
  input: {
    fee: string;
    amount: string;
    to: string;
    from: string;
    nonce: string;
    memo: string;
    validUntil: string;
  };
  signature: {
    scalar: string;
    field: string;
  };
}
