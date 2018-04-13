/// <reference types="react" />
import * as React from 'react';
import { CustomClasses, OptionSelector } from '../types';
export interface Props {
    options: string[];
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
declare class TypeaheadSelector extends React.Component<Props> {
    private getProps();
    render(): false | JSX.Element;
    private onClick(result, event);
}
export default TypeaheadSelector;
