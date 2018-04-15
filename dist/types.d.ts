/// <reference types="react" />
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
export declare type OptionSelector = (result: string, event: React.MouseEvent<HTMLDivElement>) => any;
export declare type Option = string | {
    [propName: string]: any;
};
export declare type OptionToStrFn<T> = (option: T, index?: number) => string;
