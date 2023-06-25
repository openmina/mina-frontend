export interface DswFrontierLog {
  id: number;
  date: string;
  level: DswFrontierLogLevels;
  message: string;
}

export enum DswFrontierLogLevels {
  BEST_TIP = 'Best tip',
  MISSING = 'Missing',
  DOWNLOADING = 'Downloading',
  APPLYING = 'Applying',
  APPLIED = 'Applied',
}