export default class Accessor {
    static IDENTITY_FN<T>(input: T): T;
    static generateAccessor(field: string): (object: {
        [propName: string]: any;
    }) => any;
    static generateOptionToStringFor(prop?: string | Function): Function;
    static valueForOption<T>(option: string | ((arg: T) => string), object: T): string | void;
}
