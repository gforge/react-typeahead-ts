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

export type SelectorOptionSelector<Opt extends Option> = (
  result: Opt,
  event: React.MouseEvent<HTMLLIElement>
) => any;

export type OnOptionSelectArg<Opt extends Option> = (
  option?: Opt | string,
  event?: React.SyntheticEvent<any>
) => void;

export type OptionsObject = { [propName: string]: unknown };
export type Option = string | OptionsObject;

export type OptionToStrFn<T extends OptionsObject> = (
  option: T,
  index?: number
) => string;

export type SelectorType<T extends Option> = T extends string
  ? string
  : OptionToStrFn<OptionsObject>;

// type StringOrObject = string | { [key: string]: string };

// function test<T extends StringOrObject>(
//   arg: T,
//   selector?: T extends string ? never : (string | ((obj: T) => string))
// ): string | void;

// function test(
//   arg: StringOrObject,
//   selector?: ((obj: OptionsObject) => string) | string
// ): string | void {
//   if (typeof arg === 'string') {
//     return arg;
//   }

//   if (!selector) throw new Error('No selector?');

//   if (typeof selector === 'string') {
//     return arg[selector];
//   }

//   return selector(arg);
// }

// test('test');
// test({ var: 'value' }, 'var');
// test({ var: 'value' }, (arg: { [key: string]: string }) => arg.var);
// test('value', (arg: { [key: string]: string }) => arg.var);
// test('value', (arg: { [key: string]: string }) => arg.var);

// interface Props<T = unknown> {
//   apa: T;
//   a: T extends number ? number : string;
// }

// function test2<T>(args: Props<T>): Props<T>;
// function test2(args: Props) {
//   if (typeof args.apa === 'string') {
//     const test: string = args.a;
//     alert(test);
//   }
//   return args;
// }

// test2({ apa: '2', a: 'a' });
