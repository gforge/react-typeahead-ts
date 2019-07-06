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
  option2primitive: (opt: Opt) => string | number;
}

const useSearch = <T extends Option>(props: Props<T>) => {
  const {
    searchOptionsFunction,
    filterOption,
    shouldSkipSearch,
    entryValue,
    options,
    option2primitive,
  } = props;

  const searchFunction = useMemo((): ((value: string, opt?: T[]) => T[]) => {
    // The search function can reorder everything compared to filter
    if (typeof searchOptionsFunction === 'function') {
      if (filterOption !== undefined) {
        // eslint-disable-next-line no-console
        console.warn(
          'searchOptions prop is being used, filterOption prop will be ignored'
        );
      }
      return (value: string, opt?: T[]) =>
        searchOptionsFunction(value, opt || options);
    }

    if (typeof filterOption === 'function') {
      return (value: string, opt?: T[]): T[] =>
        (opt || options).filter(o => filterOption(value, o)).map(a => a as T);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let mapper: (input: any) => string;
    if (typeof filterOption === 'string') {
      // @ts-ignore
      mapper = Accessor.generateAccessor(filterOption);
    } else {
      mapper = (opt: T) => `${option2primitive(opt)}`;
    }

    return (value: string, opt?: T[]) => {
      const fuzzyOpt: FilterOptions<T> = { extract: mapper };
      return fuzzy
        .filter(value, opt || options, fuzzyOpt)
        .map((res: { index: number }) => (opt || options)[res.index] as T);
    };
  }, [searchOptionsFunction, filterOption, options, option2primitive]);

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
