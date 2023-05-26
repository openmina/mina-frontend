export interface StorageAccount {
  publicKey: string;
  balance: { total: string };
  nonce: number;
  tokenId: string;
}
