export interface NetworkConnection {
  address: string;
  pid: number;
  fd: number;
  incoming: boolean;
  timestamp: string;
}
