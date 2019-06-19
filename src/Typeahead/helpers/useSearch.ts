import { useMemo } from 'react';
import fuzzy, { FilterOptions } from 'fuzzy';
import { Option } from '../../types';
import Accessor from '../../accessor';

interface Props<Opt extends Option> {
  entryValue: string;
  filterOption: string | ((value: string, option: Opt) => boolean) | undefined;
  searchOptionsFunction: ((value: string, options: Opt[]) => Opt[]) | undefined;
  shouldSkipSearch: (value: string) => boolean;
  options: Opt[];
}

const useSearch = <T extends Option>(props: Props<T>) => {
  const {
    searchOptionsFunction,
    filterOption,
    shouldSkipSearch,
    entryValue,
    options,
  } = props;

  const searchFunction = useMemo((): ((value: string, opt?: T[]) => T[]) => {
    if (typeof searchOptionsFunction === 'function') {
      if (filterOption !== undefined) {
        // eslint-disable-next-line no-console
        console.warn(
          'searchOptions prop is being used, filterOption prop will be ignored'
        );
      }
      return (value: string, opt?: T[]) =>
        searchOptionsFunction(value, opt || options);
    } else if (typeof filterOption === 'function') {
      return (value: string, opt?: T[]): T[] =>
        (opt || options).filter(o => filterOption(value, o)).map(a => a as T);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mapper: (input: any) => string;
    if (typeof filterOption === 'string') {
      mapper = Accessor.generateAccessor(filterOption);
    } else {
      mapper = Accessor.IDENTITY_FN;
    }

    return (value: string, opt?: T[]) => {
      const fuzzyOpt: FilterOptions<T> = { extract: mapper };
      return fuzzy
        .filter(value, opt || options, fuzzyOpt)
        .map((res: { index: number }) => (opt || options)[res.index] as any);
    };
  }, [filterOption, searchOptionsFunction, options]);

  const filteredOptions = useMemo((): T[] => {
    if (shouldSkipSearch(entryValue)) {
      return [];
    }

    return searchFunction(entryValue, options);
  }, [entryValue, shouldSkipSearch, searchFunction, options]);

  return {
    filteredOptions,
    searchFunction,
  };
};

export default useSearch;
