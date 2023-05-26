import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { StoreDispatcher } from '@shared/base-classes/store-dispatcher.class';
import { selectStorageAccountsActiveFilters, selectStorageAccountsRevisionIds } from '@storage/accounts/storage-accounts.state';
import { StorageAccountsToggleFilter } from '@storage/accounts/storage-accounts.actions';

export type StorageAccountsFilterGroup = {
  name: string;
  filters: StorageAccountsFilter[];
}

export type StorageAccountsFilter = {
  value: string;
  display?: string;
}

export const filters: StorageAccountsFilterGroup[][] = [
  [
    {
      name: 'Permissions',
      filters: [
        { value: 'editState' },
        { value: 'send' },
        { value: 'receive' },
        { value: 'setDelegate' },
        { value: 'setPermissions' },
        { value: 'setVerificationKey' },
        { value: 'setZkappUri' },
        { value: 'editActionsState' },
        { value: 'setTokenSymbol' },
        { value: 'incrementNonce' },
        { value: 'setVotingFor' },
        { value: 'access' },
        { value: 'setTiming' },
      ],
    },
  ],
  [
    {
      name: 'Authorization',
      filters: [
        { value: 'none' },
        { value: 'impossible' },
        { value: 'proof' },
        { value: 'proofOfSignature' },
      ],
    },
  ],
];

@Component({
  selector: 'mina-storage-accounts-filter',
  templateUrl: './storage-accounts-filter.component.html',
  styleUrls: ['./storage-accounts-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'w-100' },
})
export class StorageAccountsFilterComponent extends StoreDispatcher implements OnInit {

  activeFilters: StorageAccountsFilter[] = [];
  availableFilters: StorageAccountsFilterGroup[][];
  filtersOpen: boolean;

  private elementHeight: number;

  constructor(private elementRef: ElementRef<HTMLElement>) { super(); }

  ngOnInit(): void {
    this.listenToFiltersChanging();
    this.listenToRevisionIds();
  }

  toggleFilerPanel(): void {
    this.filtersOpen = !this.filtersOpen;
  }

  onResize(): void {
    if (this.elementHeight !== this.elementRef.nativeElement.offsetHeight) {
      this.elementHeight = this.elementRef.nativeElement.offsetHeight;
    }
  }

  toggleFilter(filter: StorageAccountsFilter): void {
    const type = this.activeFilters.includes(filter) ? 'remove' : 'add';
    const filters = [filter];
    this.dispatch(StorageAccountsToggleFilter, { filters, type });
  }

  filterByCategory(category: StorageAccountsFilterGroup): void {
    const filters = category.filters;
    const type = filters.every(f => this.activeFilters.includes(f)) ? 'remove' : 'add';
    this.dispatch(StorageAccountsToggleFilter, { filters, type });
  }

  private listenToFiltersChanging(): void {
    this.select(selectStorageAccountsActiveFilters, (activeFilters: StorageAccountsFilter[]) => {
      this.activeFilters = activeFilters;
      this.detect();
    });
  }

  private listenToRevisionIds(): void {
    this.select(selectStorageAccountsRevisionIds, (revisions: string[]) => {
      this.availableFilters = [
        ...[[{ name: 'Revisions', filters: revisions.map(r => ({ value: r })) }]],
        ...filters,
      ];
      this.detect();
    });
  }
}
