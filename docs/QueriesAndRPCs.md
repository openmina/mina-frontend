# OPEN MINA - FRONTEND
# USED GRAPHQL QUERIES & RPCS

## GraphQL queries & mutations:
### Benchmarks
* query getAccounts { account(publicKey: "${wallet.publicKey}") { nonce balance { liquid } } }
* query pooledUserCommands { pooledUserCommands { ... on UserCommandPayment {  nonce memoVerbatim from } } }
* **Mutation** - sendPayment:
($fee:UInt64!, $amount:UInt64!,
$to: PublicKey!, $from: PublicKey!, $nonce:UInt32, $memo: String,
$validUntil: UInt32,$scalar: String!, $field: String!
) {
sendPayment(
input: {
fee: $fee,
amount: $amount,
to: $to,
from: $from,
memo: $memo,
nonce: $nonce,
validUntil: $validUntil
},
signature: {
field: $field, scalar: $scalar
}) {
payment {
amount
fee
feeToken
from
hash
id
isDelegation
memo
memoVerbatim
nonce
kind
to
}
}
}
### Dashboard
* query latestBlockHeight {
bestChain(maxLength: 1) {
protocolState {
consensusState {
slotSinceGenesis
}
}
}
}
* query BestChain {
bestChain(maxLength: ${maxLength}) {
stateHash
protocolState {
consensusState {
blockHeight
}
previousStateHash
}
}
}
* query traces { blockTraces(global_slot: ${height}) }
* query vanillaStatus {
daemonStatus {
blockchainLength
addrsAndPorts {
bindIp
clientPort
externalIp
libp2pPort
}
syncStatus
metrics {
transactionPoolSize
transactionsAddedToPool
}
}
}
* query blockStructuredTrace { blockStructuredTrace(block_identifier: "${hash}") }
* query status {
daemonStatus {
blockchainLength
addrsAndPorts {
bindIp
clientPort
externalIp
libp2pPort
}
syncStatus
metrics {
transactionPoolSize
transactionsAddedToPool
transactionPoolDiffBroadcasted
transactionPoolDiffReceived
snarkPoolDiffBroadcasted
snarkPoolDiffReceived
snarkPoolSize
pendingSnarkWork
}
}
}
* query Peers {
daemonStatus {
addrsAndPorts {
peer {
peerId
}
externalIp
libp2pPort
}
}
getPeers {
host
libp2pPort
peerId
}
}

### Explorer
* query getBlocks {
bestChain {
protocolState {
blockchainState {
snarkedLedgerHash
stagedLedgerHash
date
}
consensusState {
blockHeight
slotSinceGenesis
}
}
transactions {
userCommands {
nonce
}
feeTransfer {
fee
}
zkappCommands {
hash
}
}
stateHash
snarkJobs
}
}
* query getTxs { block(height: ${height}) {
transactions {
userCommands {
to
from
amount
fee
id
hash
memo
nonce
}
}
}}
* query getZkApps { block(height: ${height}) {
transactions {
zkappCommands {
id
hash
zkappCommand {
memo
feePayer {
authorization
body {publicKey validUntil nonce fee}
}
accountUpdates {
body {
callDepth
callData
actions
events
implicitAccountCreationFee
incrementNonce
tokenId
publicKey
useFullCommitment
update {
appState
delegate
zkappUri
votingFor
verificationKey {hash data}
timing {
vestingIncrement
vestingPeriod
initialMinimumBalance
cliffTime
cliffAmount
}
tokenSymbol
permissions {
setZkappUri
setVotingFor
setVerificationKey
setTokenSymbol
setTiming
setPermissions
setDelegate
send
receive
incrementNonce
editState
editActionState
access
}
}
preconditions {
validWhile {upper lower}
network {
nextEpochData {
startCheckpoint
seed
lockCheckpoint
ledger {hash totalCurrency {upper lower}}
epochLength {upper lower}
}
minWindowDensity {upper lower}
globalSlotSinceGenesis {upper lower}
blockchainLength {upper lower}
totalCurrency {upper lower}
stakingEpochData {
seed
startCheckpoint
lockCheckpoint
epochLength {upper lower}
ledger {hash totalCurrency {upper lower}}
}
snarkedLedgerHash
}
account {
actionState
provedState
receiptChainHash
state
isNew
delegate
nonce {upper lower}
balance {upper lower}
}
}
mayUseToken {parentsOwnToken inheritFromParent}
balanceChange {sgn magnitude}
authorizationKind {verificationKeyHash isSigned isProved}
}
authorization {signature proof}
}
}
failureReason {index failures}
}
}
}}
* query getScanState {
blockScanState(height: ${height})
block(height: ${height}) {
snarkJobs
transactions {
userCommands {
nonce
}
feeTransfer {
fee
}
zkappCommands {
id
}
}
}
bestChain(maxLength: 1) {
protocolState {
consensusState {
blockHeight
}
}
}
}
* query getSnarkPool { snarkPool { workIds prover fee }}
* query pooledUserCommands { pooledUserCommands {
... on UserCommandPayment {
id
hash
fee
amount
kind
nonce
to
memo
memoVerbatim
from } } }
* **Mutation** - sendPayment:
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
}

* **Mutation** - sendZkapp:
(
$input_zkappCommand_feePayer_body_publicKey: PublicKey!,
$input_zkappCommand_feePayer_body_fee: Fee!,
$input_zkappCommand_feePayer_body_nonce: UInt32!,
$input_zkappCommand_feePayer_authorization: Signature!,
$input_zkappCommand_accountUpdates_body_publicKey: PublicKey!,
$input_zkappCommand_accountUpdates_body_tokenId: TokenId!,
$input_zkappCommand_accountUpdates_body_update_appState: [Field]!,
$input_zkappCommand_accountUpdates_body_balanceChange_magnitude: CurrencyAmount!,
$input_zkappCommand_accountUpdates_body_balanceChange_sgn: Sign!,
$input_zkappCommand_accountUpdates_body_incrementNonce: Boolean!,
$input_zkappCommand_accountUpdates_body_events: [[Field!]!]!,
$input_zkappCommand_accountUpdates_body_actions: [[Field!]!]!,
$input_zkappCommand_accountUpdates_body_callData: Field!,
$input_zkappCommand_accountUpdates_body_callDepth: Int!,
$input_zkappCommand_accountUpdates_body_preconditions_network_stakingEpochLedger: EpochLedgerPreconditionInput!,
$input_zkappCommand_accountUpdates_body_preconditions_network_nextEpochLedger: EpochLedgerPreconditionInput!,
$input_zkappCommand_accountUpdates_body_preconditions_accountState: AccountPreconditionInput!,
$input_zkappCommand_accountUpdates_body_useFullCommitment: Boolean!,
$input_zkappCommand_accountUpdates_body_implicitAccountCreationFee: Boolean!,
$input_zkappCommand_accountUpdates_body_mayUseToken_parentsOwnToken: Boolean!,
$input_zkappCommand_accountUpdates_body_mayUseToken_inheritFromParent: Boolean!,
$input_zkappCommand_accountUpdates_body_authorizationKind_isSigned: Boolean!,
$input_zkappCommand_accountUpdates_body_authorizationKind_isProved: Boolean!,
$input_zkappCommand_accountUpdates_body_authorizationKind_verificationKeyHash: String!,
$input_zkappCommand_accountUpdates_authorization: ControlInput!,
$input_zkappCommand_memo: Memo!
) {
sendZkapp(input: {
zkappCommand: {
feePayer: {
body: {
publicKey: $input_zkappCommand_feePayer_body_publicKey,
fee: $input_zkappCommand_feePayer_body_fee,
nonce: $input_zkappCommand_feePayer_body_nonce
},
authorization: $input_zkappCommand_feePayer_authorization
},
accountUpdates: {
body: {
publicKey: $input_zkappCommand_accountUpdates_body_publicKey,
tokenId: $input_zkappCommand_accountUpdates_body_tokenId,
update: { appState: $input_zkappCommand_accountUpdates_body_update_appState },
balanceChange: { magnitude: $input_zkappCommand_accountUpdates_body_balanceChange_magnitude, sgn: $input_zkappCommand_accountUpdates_body_balanceChange_sgn },
incrementNonce: $input_zkappCommand_accountUpdates_body_incrementNonce,
events: $input_zkappCommand_accountUpdates_body_events,
actions: $input_zkappCommand_accountUpdates_body_actions,
callData: $input_zkappCommand_accountUpdates_body_callData,
callDepth: $input_zkappCommand_accountUpdates_body_callDepth,
preconditions: {
network: {
stakingEpochData: { ledger: $input_zkappCommand_accountUpdates_body_preconditions_network_stakingEpochLedger },
nextEpochData: { ledger: $input_zkappCommand_accountUpdates_body_preconditions_network_nextEpochLedger }
},
account: { state: $input_zkappCommand_accountUpdates_body_preconditions_accountState }
},
useFullCommitment: $input_zkappCommand_accountUpdates_body_useFullCommitment,
implicitAccountCreationFee: $input_zkappCommand_accountUpdates_body_implicitAccountCreationFee,
mayUseToken: {
parentsOwnToken: $input_zkappCommand_accountUpdates_body_mayUseToken_parentsOwnToken,
inheritFromParent: $input_zkappCommand_accountUpdates_body_mayUseToken_inheritFromParent
},
authorizationKind: {
isSigned: $input_zkappCommand_accountUpdates_body_authorizationKind_isSigned,
isProved: $input_zkappCommand_accountUpdates_body_authorizationKind_isProved,
verificationKeyHash: $input_zkappCommand_accountUpdates_body_authorizationKind_verificationKeyHash
}
},
authorization: $input_zkappCommand_accountUpdates_authorization
},
memo: $input_zkappCommand_memo
}
}) {
zkapp {id}
}
}
### Storage:
* query getAccounts { account(publicKey: "${wallet.publicKey}") {
tokenId
tokenSymbol
balance {
total
}
nonce
timing {
vestingPeriod
vestingIncrement
cliffTime
initialMinimumBalance
cliffAmount
}
votingFor
zkappUri
zkappState
permissions {
access
send
} }
}

### Tracing:
* query getTraces { blockTraces }
* query blockStructuredTrace { blockStructuredTrace(block_identifier: "${hash}") }
* query blockTracesDistribution { blockTracesDistribution }

### Web Node:
* query transactionStatus { transactionStatus(payment: "${id}") }
* query pooledUserCommands { pooledUserCommands {
... on UserCommandPayment {
id
hash
fee
amount
kind
nonce
to
memo
from
feeToken
failureReason
token
validUntil } } }

### Toolbar:
* query status {
daemonStatus {
blockchainLength
syncStatus
consensusTimeNow {
startTime
}
}}


## RPCS

### DEBUGGER
- /firewall/whitelist/enable
- /firewall/whitelist/enable
- /block/123
- /block/latest
- /libp2p_ipc/block/123
- /libp2p_ipc/block/latest
- /connections
- /messages
- /message/123
- /connection/123
- /message_hex/123
- /version
### SNARKER COORDINATOR
- /snarker-http-coordinator/workers
- /snarker-http-coordinator/worker-stats
### RESOURCES
- /resources


