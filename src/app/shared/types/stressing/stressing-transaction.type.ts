import { WebNodeTransaction } from '@shared/types/web-node/wallet/web-node-transaction.type';

export interface StressingTransaction extends Omit<WebNodeTransaction, 'priv_key'> {
}
