export interface ExplorerBlockZkAppFullData {
  id: string;
  hash: string;
  zkappCommand: {
    memo: string;
    feePayer: {
      authorization: string;
      body: {
        publicKey: string;
        validUntil: any;
        nonce: string;
        fee: string;
      }
    };
    accountUpdates: {
      body: {
        callDepth: number;
        callData: string;
        actions: any[];
        events: any[];
        implicitAccountCreationFee: boolean;
        incrementNonce: boolean;
        tokenId: string;
        publicKey: string;
        useFullCommitment: boolean;
        update: {
          appState: any[];
          delegate: any;
          zkappUri: any;
          votingFor: any;
          verificationKey: any;
          timing: any;
          tokenSymbol: any;
          permissions: any;
        }
        preconditions: {
          validWhile: any;
          network: {
            nextEpochData: {
              startCheckpoint: any;
              seed: any;
              lockCheckpoint: any;
              ledger: {
                hash: any;
                totalCurrency: any;
              }
              epochLength: any;
            }
            minWindowDensity: any;
            globalSlotSinceGenesis: any;
            blockchainLength: any;
            totalCurrency: any;
            stakingEpochData: {
              seed: any;
              startCheckpoint: any;
              lockCheckpoint: any;
              epochLength: any;
              ledger: {
                hash: any;
                totalCurrency: any;
              }
            }
            snarkedLedgerHash: any;
          }
          account: {
            actionState: any;
            provedState: any;
            receiptChainHash: any;
            state: any[];
            isNew: any;
            delegate: any;
            nonce: any;
            balance: any;
          }
        }
        mayUseToken: {
          parentsOwnToken: boolean;
          inheritFromParent: boolean;
        }
        balanceChange: {
          sgn: string;
          magnitude: string;
        }
        authorizationKind: {
          verificationKeyHash: string;
          isSigned: boolean;
          isProved: boolean;
        }
      }
      authorization: {
        signature?: string;
        proof: any;
      }
    }[];
  };
  failureReason: {
    index: string;
    failures: string[];
  }[];
}
