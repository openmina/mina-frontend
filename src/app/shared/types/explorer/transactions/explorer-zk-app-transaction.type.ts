export interface ExplorerZkAppTransaction {
  input: {
    zkappCommand: {
      feePayer: {
        body: {
          publicKey: string;
          fee: string;
          nonce: string;
        };
        authorization: string;
      };
      accountUpdates: {
        body: {
          publicKey: string;
          tokenId: string;
          update: {
            appState: string;
          };
          balanceChange: {
            magnitude: string;
            sgn: string;
          };
          incrementNonce: boolean;
          events: string[][];
          actions: string[][];
          callData: string;
          callDepth: number;
          preconditions: {
            network: {
              stakingEpochData: {
                ledger: {};
              };
              nextEpochData: {
                ledger: {};
              };
            };
            account: {
              state: string;
            };
          };
          useFullCommitment: boolean;
          implicitAccountCreationFee: boolean;
          mayUseToken: {
            parentsOwnToken: boolean;
            inheritFromParent: boolean;
          };
          authorizationKind: {
            isSigned: boolean;
            isProved: boolean;
            verificationKeyHash: string;
          };
        };
        authorization: {};
      };
      memo: string;
    }
  };
}
