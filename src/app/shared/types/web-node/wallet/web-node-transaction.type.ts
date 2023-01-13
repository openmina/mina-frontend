export interface WebNodeTransaction {
  id: string;
  priv_key: string;
  to: string;
  amount: number;
  fee: string;
  nonce: string;
  memo: string;
  from: string;
  blockHeight: number;
  kind: string;
  blockStateHash: string;
  dateTime: string;
  hash: string;
  status: string;
  isInMempool: boolean;
}
