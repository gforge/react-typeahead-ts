import { OptionToStrFn, Option } from './types';
export default class Accessor {
    static IDENTITY_FN<T>(input: T): T;
    static generateAccessor(field: string): (object: {
        [propName: string]: string;
    }) => string;
    static generateOptionToStringFor<T>(prop?: string | Function): OptionToStrFn<T>;
    static valueForOption<T extends Option>(object: T, selector?: string | OptionToStrFn<T> | undefined): string | void;
}
