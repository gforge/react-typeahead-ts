/// <reference types="react" />
import * as React from 'react';
import { InputProps } from 'reactstrap';
import { TokenCustomClasses } from '../types';
export interface Props extends InputProps {
    name?: string;
    options: any[];
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
    displayOption?: string | ((arg: any) => string);
    formInputOption?: string | ((arg: any) => string);
    maxVisible?: number;
    resultsTruncatedMessage?: string;
    defaultClassNames?: boolean;
    showOptionsWhenEmpty?: boolean;
}
export interface State {
    selected: string[];
}
declare class TypeaheadTokenizer extends React.Component<Props, State> {
    constructor(props: Props);
    private getProps();
    componentWillReceiveProps(nextProps: Props): void;
    typeaheadElement?: HTMLInputElement;
    focus(): void;
    getSelectedTokens(): string[];
    private renderTokens();
    private getOptionsForTypeahead();
    private onKeyDown(event);
    private handleBackspace(event);
    private removeTokenForValue(value);
    private addTokenForValue(value);
    render(): JSX.Element;
}
export default TypeaheadTokenizer;
