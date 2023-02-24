export type ExplorerScanStateLeaf = [
  number, // index
  string, // type
  number[], // work ids(we assume they are 2)
  number, // seqNumber
  'Todo' | 'Done', // status
  boolean, // highlighting snarks
];
