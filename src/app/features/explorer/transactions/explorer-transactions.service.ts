import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { GraphQLService } from '@core/services/graph-ql.service';
import { ExplorerTransaction } from '@shared/types/explorer/transactions/explorer-transaction.type';
import { ExplorerSignedTransaction } from '@shared/types/explorer/transactions/explorer-signed-transaction.type';
import { ExplorerZkAppTransaction } from '@shared/types/explorer/transactions/explorer-zk-app-transaction.type';

type FlatObject = {
  [key: string]: unknown;
};

@Injectable({
  providedIn: 'root',
})
export class ExplorerTransactionsService {

  constructor(private graphQL: GraphQLService) { }

  getTransactions(): Observable<ExplorerTransaction[]> {
    return this.graphQL.query('pooledUserCommands',
      `{ pooledUserCommands { ... on UserCommandPayment {
            id
            hash
            fee
            amount
            kind
            nonce
            to
            memo
            memoVerbatim
            from } } }`)
      .pipe(
        map((data: any) => data.pooledUserCommands
          .map((tx: any) => ({
            ...tx,
            memo: tx.memoVerbatim || tx.memo,
            amount: Number(tx.amount),
            status: 'pending',
          } as ExplorerTransaction)),
        ),
      );
  }

  sendSignedTx(tx: ExplorerSignedTransaction): Observable<any> {
    const txBody: string = sendTxGraphQLMutationBody();
    const flat = this.flattenObject(tx);
    return this.graphQL.mutation('sendTx', txBody, flat);
  }

  sendZkAppTx(tx: ExplorerZkAppTransaction): Observable<any> {
    const txBody: string = sendZkAppTxMutationBody2(tx);
    const flat = this.flattenObject(tx);
    return this.graphQL.mutation('sendZkapp', txBody, flat);
  }

  private flattenObject(obj: object, prefix: string = ''): FlatObject {
    const result: FlatObject = {};

    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        const childObj = this.flattenObject(obj[key] as Record<string, unknown>, prefix + key + '_');
        Object.assign(result, childObj);
      } else {
        result[prefix + key] = obj[key];
      }
    }

    return result;
  }
}

function sendZkAppTxMutationBody2(tx: ExplorerZkAppTransaction): string {
  const inputVariables: string[] = [];
  const objectStructure: string[] = [];

  const path: string[] = [];
  const structure = getStructure(tx.input.zkappCommand, path);
  objectStructure.push(structure);

  const traverse = (obj: any, path: string[]) => {
    for (const key in obj) {
      const newPath = [...path, key];
      const value = obj[key];
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, newPath);
      } else {
        const variableName = newPath.join('_');
        const variableType = getVariableType(newPath);
        inputVariables.push(`$input_zkappCommand_${variableName}: ${variableType}`);
      }
    }
  };

  traverse(tx.input.zkappCommand, path);

  const inputVariablesString = inputVariables.join(',');
  const objectStructureString = objectStructure.join(',\n');

  return `(${inputVariablesString}) {
    sendZkapp(input: {
      zkappCommand: {
        ${objectStructureString}
      }
    }) {
      zkapp {id}
    }
  }`;
}


function getVariableType(path: string[]): string {
  const pathStr = path.join('_');

  const typeMap: { [key: string]: string } = {
    feePayer_body_publicKey: 'PublicKey!',
    feePayer_body_fee: 'Fee!',
    feePayer_body_nonce: 'UInt32!',
    feePayer_authorization: 'Signature!',
    accountUpdates_body_publicKey: 'PublicKey!',
    accountUpdates_body_tokenId: 'TokenId!',
    accountUpdates_body_update_appState: '[Field]!',
    accountUpdates_body_balanceChange_magnitude: 'CurrencyAmount!',
    accountUpdates_body_balanceChange_sgn: 'Sign!',
    accountUpdates_body_incrementNonce: 'Boolean!',
    accountUpdates_body_events: '[[Field!]!]!',
    accountUpdates_body_actions: '[[Field!]!]!',
    accountUpdates_body_callData: 'Field!',
    accountUpdates_body_callDepth: 'Int!',
    accountUpdates_body_preconditions_network_stakingEpochLedger: 'EpochLedgerPreconditionInput!',
    accountUpdates_body_preconditions_network_nextEpochLedger: 'EpochLedgerPreconditionInput!',
    accountUpdates_body_preconditions_accountState: 'AccountPreconditionInput!',
    accountUpdates_body_useFullCommitment: 'Boolean!',
    accountUpdates_body_implicitAccountCreationFee: 'Boolean!',
    accountUpdates_body_mayUseToken_parentsOwnToken: 'Boolean!',
    accountUpdates_body_mayUseToken_inheritFromParent: 'Boolean!',
    accountUpdates_body_authorizationKind_isSigned: 'Boolean!',
    accountUpdates_body_authorizationKind_isProved: 'Boolean!',
    accountUpdates_body_authorizationKind_verificationKeyHash: 'String!',
    accountUpdates_authorization: 'ControlInput!',
    memo: 'Memo!',
  };

  return typeMap[pathStr] || 'String';
}

function getStructure(obj: any, path: string[] = []): string {
  const prefix = '$input_zkappCommand_';
  const objectStructure: string[] = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      const structure = getStructure(obj[key], [...path, key]);
      if (structure) {
        objectStructure.push(key + ': ' + structure);
      }
    } else {
      objectStructure.push(`${key}: ${prefix + path.join('_') + '_' + key}`);
    }
  }
  return `{\n${objectStructure.join(',\n')}\n}`;
}

//
// function sendZkAppTxMutationBody(): string {
//   return `(
//     $input_zkappCommand_feePayer_body_publicKey: PublicKey!,
//     $input_zkappCommand_feePayer_body_fee: Fee!,
//     $input_zkappCommand_feePayer_body_nonce: UInt32!,
//     $input_zkappCommand_feePayer_authorization: Signature!,
//     $input_zkappCommand_accountUpdates_body_publicKey: PublicKey!,
//     $input_zkappCommand_accountUpdates_body_tokenId: TokenId!,
//     $input_zkappCommand_accountUpdates_body_update_appState: [Field]!,
//     $input_zkappCommand_accountUpdates_body_balanceChange_magnitude: CurrencyAmount!,
//     $input_zkappCommand_accountUpdates_body_balanceChange_sgn: Sign!,
//     $input_zkappCommand_accountUpdates_body_incrementNonce: Boolean!,
//     $input_zkappCommand_accountUpdates_body_events: [[Field!]!]!,
//     $input_zkappCommand_accountUpdates_body_actions: [[Field!]!]!,
//     $input_zkappCommand_accountUpdates_body_callData: Field!,
//     $input_zkappCommand_accountUpdates_body_callDepth: Int!,
//     $input_zkappCommand_accountUpdates_body_preconditions_network_stakingEpochLedger: EpochLedgerPreconditionInput!,
//     $input_zkappCommand_accountUpdates_body_preconditions_network_nextEpochLedger: EpochLedgerPreconditionInput!,
//     $input_zkappCommand_accountUpdates_body_preconditions_accountState: AccountPreconditionInput!,
//     $input_zkappCommand_accountUpdates_body_useFullCommitment: Boolean!,
//     $input_zkappCommand_accountUpdates_body_implicitAccountCreationFee: Boolean!,
//     $input_zkappCommand_accountUpdates_body_mayUseToken_parentsOwnToken: Boolean!,
//     $input_zkappCommand_accountUpdates_body_mayUseToken_inheritFromParent: Boolean!,
//     $input_zkappCommand_accountUpdates_body_authorizationKind_isSigned: Boolean!,
//     $input_zkappCommand_accountUpdates_body_authorizationKind_isProved: Boolean!,
//     $input_zkappCommand_accountUpdates_body_authorizationKind_verificationKeyHash: String!,
//     $input_zkappCommand_accountUpdates_authorization: ControlInput!,
//     $input_zkappCommand_memo: Memo!
//   ) {
//     sendZkapp(input: {
//       zkappCommand: {
//         feePayer: {
//           body: {
//             publicKey: $input_zkappCommand_feePayer_body_publicKey,
//             fee: $input_zkappCommand_feePayer_body_fee,
//             nonce: $input_zkappCommand_feePayer_body_nonce
//           },
//           authorization: $input_zkappCommand_feePayer_authorization
//         },
//         accountUpdates: {
//           body: {
//             publicKey: $input_zkappCommand_accountUpdates_body_publicKey,
//             tokenId: $input_zkappCommand_accountUpdates_body_tokenId,
//             update: { appState: $input_zkappCommand_accountUpdates_body_update_appState },
//             balanceChange: { magnitude: $input_zkappCommand_accountUpdates_body_balanceChange_magnitude, sgn: $input_zkappCommand_accountUpdates_body_balanceChange_sgn },
//             incrementNonce: $input_zkappCommand_accountUpdates_body_incrementNonce,
//             events: $input_zkappCommand_accountUpdates_body_events,
//             actions: $input_zkappCommand_accountUpdates_body_actions,
//             callData: $input_zkappCommand_accountUpdates_body_callData,
//             callDepth: $input_zkappCommand_accountUpdates_body_callDepth,
//             preconditions: {
//               network: {
//                 stakingEpochData: { ledger: $input_zkappCommand_accountUpdates_body_preconditions_network_stakingEpochLedger },
//                 nextEpochData: { ledger: $input_zkappCommand_accountUpdates_body_preconditions_network_nextEpochLedger }
//               },
//               account: { state: $input_zkappCommand_accountUpdates_body_preconditions_accountState }
//             },
//             useFullCommitment: $input_zkappCommand_accountUpdates_body_useFullCommitment,
//             implicitAccountCreationFee: $input_zkappCommand_accountUpdates_body_implicitAccountCreationFee,
//             mayUseToken: {
//               parentsOwnToken: $input_zkappCommand_accountUpdates_body_mayUseToken_parentsOwnToken,
//               inheritFromParent: $input_zkappCommand_accountUpdates_body_mayUseToken_inheritFromParent
//             },
//             authorizationKind: {
//               isSigned: $input_zkappCommand_accountUpdates_body_authorizationKind_isSigned,
//               isProved: $input_zkappCommand_accountUpdates_body_authorizationKind_isProved,
//               verificationKeyHash: $input_zkappCommand_accountUpdates_body_authorizationKind_verificationKeyHash
//             }
//           },
//           authorization: $input_zkappCommand_accountUpdates_authorization
//         },
//         memo: $input_zkappCommand_memo
//       }
//     }) {
//       zkapp {id}
//     }
//   }`;
// }

function sendTxGraphQLMutationBody(): string {
  return `
    ($input_fee:UInt64!, $input_amount:UInt64!, $input_to: PublicKey!, $input_from: PublicKey!, $input_nonce:UInt32 = null, $input_memo: String = null, $input_validUntil: UInt32 = null,
     $signature_scalar: String!, $signature_field: String!) {
      sendPayment(
        input: {
          fee: $input_fee,
          amount: $input_amount,
          to: $input_to,
          from: $input_from,
          memo: $input_memo,
          nonce: $input_nonce,
          validUntil: $input_validUntil
        }, 
        signature: {
          field: $signature_field, scalar: $signature_scalar
        }) {
        payment { from }
        }
    }`;
}
