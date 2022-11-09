export interface NetworkConnection {
  connectionId: number;
  addr: string;
  pid: number;
  fd: number;
  incoming: string;
  date: string;
  alias: string;
  stats_in: any;
  stats_out: any;
}
