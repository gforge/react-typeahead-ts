export interface CustomClasses { 
  results?: string;
  hover?: string;
  input?: string;
  resultsTruncated?: string;
  listItem?: string;
  customAdd?: string;
  listAnchor?: string;
  nav?: string;
}

export interface TokenCustomClasses extends CustomClasses {
  token?: string;
  typeahead?: string;
}

export type SelectorOptionSelector<Opt extends Option> = 
  (result: Opt, event: React.MouseEvent<HTMLDivElement>) => any;

export type OnOptionSelectArg<Opt extends Option> = 
  ((option?: Opt | string, event?: React.SyntheticEvent<any>) => any);

export type Option = string | { [propName: string]: any };

export type OptionToStrFn<T> = (option: T, index?: number) => string;
