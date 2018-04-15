/// <reference types="react" />
import * as React from 'react';
import { CustomClasses, OptionSelector, Option } from '../types';
export interface Props<Opt extends Option> {
    options: Opt[];
    allowCustomValues?: number;
    customClasses?: CustomClasses;
    customValue?: string;
    selectionIndex?: number;
    onOptionSelected?: OptionSelector;
    displayOption: Function;
    defaultClassNames?: boolean;
    areResultsTruncated?: boolean;
    resultsTruncatedMessage?: string;
    innerRef?: ((c: HTMLElement) => void);
}
declare class TypeaheadSelector<T> extends React.Component<Props<T>> {
    private getProps();
    render(): false | JSX.Element;
    private onClick(result, event);
}
export default TypeaheadSelector;
