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

export type EventType =
  | React.MouseEvent<HTMLLIElement>
  | React.KeyboardEvent<HTMLInputElement>;

export type SelectorOptionSelector<Opt extends Option> = (
  result: Opt,
  event: EventType
) => void;

export type OptionSelect<T extends Option> = (
  option: T | undefined,
  event?: EventType
) => void;

export type HandleOnOptionSelectArg = (
  option?: Option | string | undefined,
  event?: EventType
) => void;

export interface OptionsObject {
  [propName: string]: unknown;
}

export type Option = string | number | OptionsObject;

export type OptionToStrFn<T extends Option> = (
  option: T,
  index?: number
) => string | number;

export type SelectorType<T extends Option> = string | OptionToStrFn<T>;

// TODO: in future typescript versions we want to use
// OptionsProps<T extends Option> = TrueOptionProp<T> | FalseOptionProp<T>
// but this isn't possible at the moment
export interface TrueOptionProp<Opt extends Option> {
  options: Opt[];
  allowCustomValues: true;
  onOptionSelected?: OptionSelect<string | number>;
}

export interface FalseOptionProp<Opt extends Option> {
  options: Opt[];
  allowCustomValues?: false;
  onOptionSelected?: OptionSelect<Opt>;
}

export interface OptionsProps<Opt extends Option> {
  options: Opt[];
  allowCustomValues?: boolean;
  onOptionSelected?: OptionSelect<string | number>;
}
