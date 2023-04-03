import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { MinaState } from '@app/app.setup';
import { FuzzingFile } from '@shared/types/fuzzing/fuzzing-file.type';
import { FuzzingFileDetails } from '@shared/types/fuzzing/fuzzing-file-details.type';
import { TableSort } from '@shared/types/shared/table-sort.type';
import { ExplorerBlock } from '@shared/types/explorer/blocks/explorer-block.type';

export interface FuzzingState {
  files: FuzzingFile[];
  activeFile: FuzzingFile;
  activeFileDetails: FuzzingFileDetails;
  sort: TableSort<FuzzingFile>;
}

const select = <T>(selector: (state: FuzzingState) => T): MemoizedSelector<MinaState, T> => createSelector(
  selectFuzzingState,
  selector,
);

export const selectFuzzingState = createFeatureSelector<FuzzingState>('fuzzing');
export const selectFuzzingFiles = select((state: FuzzingState): FuzzingFile[] => state.files);
export const selectFuzzingActiveFile = select((state: FuzzingState): FuzzingFile => state.activeFile);
export const selectFuzzingActiveFileDetails = select((state: FuzzingState): FuzzingFileDetails => state.activeFileDetails);
export const selectFuzzingFilesSorting = select((state: FuzzingState): TableSort<FuzzingFile> => state.sort);
