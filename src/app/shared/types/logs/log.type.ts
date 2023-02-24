import { LogType } from '@shared/types/logs/log-type.enum';
import { LogMetadata } from '@shared/types/logs/log-metadata.type';

export interface Log {
  timestamp: number,
  date: string;
  level: LogType;
  sourceModule: string;
  location: string;
  metadata: LogMetadata;
  message: string;
}
