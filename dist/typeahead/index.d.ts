/// <reference types="react" />
import * as React from 'react';
import { Props as TypelistProps } from './selector';
import { CustomClasses, Option, OptionToStrFn } from '../types';
import { InputProps } from 'reactstrap';
export declare type OnOptionSelectArg<Opt extends Option> = ((option: Opt | string, event?: React.SyntheticEvent<HTMLAnchorElement>) => any);
export declare type AnyReactWithProps<Opt extends Option> = React.Component<TypelistProps<Opt>> | React.PureComponent<TypelistProps<Opt>> | React.SFC<TypelistProps<Opt>>;
export interface Props<Opt extends Option, Mapped> extends InputProps {
    name?: string;
    customClasses?: CustomClasses;
    maxVisible?: number;
    resultsTruncatedMessage?: string;
    options: Opt[];
    allowCustomValues?: number;
    initialValue?: string;
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    textarea?: boolean;
    inputProps?: object;
    onOptionSelected?: OnOptionSelectArg<Mapped>;
    filterOption?: string | ((value: string, option: Opt) => boolean);
    searchOptions?: ((value: string, option: Opt[]) => Mapped[]);
    displayOption?: string | OptionToStrFn<Mapped>;
    inputDisplayOption?: string | OptionToStrFn<Mapped>;
    formInputOption?: string | OptionToStrFn<Mapped>;
    defaultClassNames?: boolean;
    customListComponent?: AnyReactWithProps<Opt>;
    showOptionsWhenEmpty?: boolean;
    innerRef?: (c: HTMLInputElement) => any;
}
export interface State<Mapped> {
    searchResults: Mapped[];
    entryValue: string;
    selection?: string;
    selectionIndex?: number;
    isFocused: boolean;
    showResults: boolean;
}
declare class Typeahead<T extends Option, Mapped> extends React.Component<Props<T, Mapped>, State<Mapped>> {
    constructor(props: Props<T, Mapped>);
    inputElement?: HTMLInputElement;
    private getProps();
    private shouldSkipSearch(input?);
    getOptionsForValue(value?: string, options?: T[]): Mapped[];
    setEntryText(value: string): void;
    focus(): void;
    private hasCustomValue();
    private getCustomValue();
    private renderIncrementalSearchResults();
    getSelection(): Mapped | string | undefined;
    private inputMapper?;
    private getInputOptionToStringMapper();
    private displayMapper?;
    private getDisplayOptionToStringMapper();
    private onOptionSelected(option, event);
    private onTextEntryUpdated(newValue?);
    private onEnter(event);
    private onEscape();
    private onTab(event);
    eventMap(): any;
    private nav(delta);
    navDown(): void;
    navUp(): void;
    private onChange(event);
    private onKeyDown(event);
    componentWillReceiveProps(nextProps: Props<T, Mapped>): void;
    render(): JSX.Element;
    private onFocus(event);
    private onBlur(event);
    private renderHiddenInput();
    private searchFunction?;
    private generateSearchFunction();
    private hasHint();
}
export default Typeahead;
