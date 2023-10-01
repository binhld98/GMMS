import {
  NzTableFilterFn,
  NzTableFilterList,
  NzTableSortFn,
  NzTableSortOrder,
} from 'ng-zorro-antd/table';
import { TAG_COLOR } from '../constants/common.constant';

export type Tag = {
  text: string;
  color: TAG_COLOR;
};

export type ColumnFilterSorterConfig<T> = {
  [key: string]: {
    showFilter: boolean;
    multiFilter: boolean;
    filterOpts: NzTableFilterList;
    filterFn: NzTableFilterFn<T> | null;
    showSort: boolean;
    sortPriority: number;
    sortOrder: NzTableSortOrder | null;
    sortFn: NzTableSortFn<T> | null;
    sortDirections: NzTableSortOrder[];
  };
};
