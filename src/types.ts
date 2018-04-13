export interface CustomClasses { 
  results?: string;
  hover?: string;
  input?: string;
  resultsTruncated?: string;
  listItem?: string;
  customAdd?: string;
  listAnchor?: string;
}

export interface TokenCustomClasses extends CustomClasses {
  token?: string;
  typeahead?: string;
}

export type OptionSelector = (result: string, event: React.MouseEvent<HTMLDivElement>) => any;
