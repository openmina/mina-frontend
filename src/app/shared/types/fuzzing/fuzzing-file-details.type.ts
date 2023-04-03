import { FuzzingLine } from '@shared/types/fuzzing/fuzzing-line.type';

export interface FuzzingFileDetails {
  filename: string;
  lines: FuzzingLine[];
  executedLines: number;
}
