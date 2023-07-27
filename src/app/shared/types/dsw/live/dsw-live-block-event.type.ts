export interface DswLiveBlockEvent {
  datetime: string;
  timestamp: number;
  height: number;
  message: string;
  status: string;
  elapsed: number;
  isBestTip: boolean;
}
