/// <reference types="react" />
import * as React from 'react';
import { TokenCustomClasses, Option, OptionToStrFn } from '../types';
export interface Props<Opt extends Option> extends React.InputHTMLAttributes<HTMLInputElement> {
    name?: string;
    options: Opt[];
    customClasses?: TokenCustomClasses;
    allowCustomValues?: number;
    defaultSelected: any[];
    initialValue?: string;
    placeholder?: string;
    disabled?: boolean;
    inputProps: object;
    onTokenRemove?: Function;
    onTokenAdd?: Function;
    filterOption?: string | Function;
    searchOptions?: Function;
    displayOption?: string | OptionToStrFn<Opt>;
    formInputOption?: string | OptionToStrFn<Opt>;
    maxVisible?: number;
    resultsTruncatedMessage?: string;
    defaultClassNames?: boolean;
    showOptionsWhenEmpty?: boolean;
    innerRef?: (c: HTMLInputElement) => any;
}
export interface State<Opt extends Option> {
    selected: Opt[];
}
declare class TypeaheadTokenizer<T> extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>);
    private getProps();
    private inputMapper?;
    private getInputOptionToStringMapper();
    componentWillReceiveProps(nextProps: Props<T>): void;
    typeaheadElement?: HTMLInputElement;
    focus(): void;
    getSelectedTokens(): T[];
    private renderTokens();
    private getOptionsForTypeahead();
    private onKeyDown(event);
    private handleBackspace(event);
    private getSelectedIndex(value);
    private removeTokenForValue(value);
    private addTokenForValue(value);
    render(): JSX.Element;
}
export default TypeaheadTokenizer;
