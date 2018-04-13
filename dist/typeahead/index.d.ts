/// <reference types="react" />
import * as React from 'react';
import TypeaheadSelector, { Props as TypelistProps } from './selector';
import { CustomClasses } from '../types';
import { InputProps } from 'reactstrap';
export interface Props extends InputProps {
    name?: string;
    customClasses: CustomClasses;
    maxVisible?: number;
    resultsTruncatedMessage?: string;
    options: string[];
    allowCustomValues?: number;
    initialValue?: string;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    textarea?: boolean;
    inputProps: object;
    onOptionSelected?: Function;
    filterOption?: string | Function;
    searchOptions?: Function;
    displayOption?: string | Function;
    inputDisplayOption?: string | Function;
    formInputOption?: string | Function;
    defaultClassNames?: boolean;
    customListComponent?: React.Component<TypelistProps>;
    showOptionsWhenEmpty?: boolean;
    innerRef?: (c: HTMLInputElement) => any;
}
export interface State {
    searchResults: string[];
    entryValue: string;
    selection?: string;
    selectionIndex?: number;
    isFocused: boolean;
    showResults: boolean;
}
declare class Typeahead extends React.Component<Props, State> {
    constructor(props: Props);
    inputElement?: HTMLInputElement;
    getDefaultProps(): {
        allowCustomValues: number;
        initialValue: string;
        value: string;
        disabled: boolean;
        textarea: boolean;
        customListComponent: typeof TypeaheadSelector;
        showOptionsWhenEmpty: boolean;
        resultsTruncatedMessage: null;
    };
    private shouldSkipSearch(input?);
    getOptionsForValue(value?: string, options?: string[]): any;
    setEntryText(value: string): void;
    focus(): void;
    private hasCustomValue();
    private getCustomValue();
    selectElement?: HTMLElement;
    private renderIncrementalSearchResults();
    getSelection(): string;
    private onOptionSelected(option, event);
    private onTextEntryUpdated();
    private onEnter(event);
    private onEscape();
    private onTab(event);
    eventMap(): any;
    private nav(delta);
    navDown(): void;
    navUp(): void;
    private onChange(event);
    private onKeyDown(event);
    componentWillReceiveProps(nextProps: Props): void;
    render(): JSX.Element;
    private onFocus(event);
    private onBlur(event);
    private renderHiddenInput();
    private generateSearchFunction();
    private hasHint();
}
export default Typeahead;
