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
}
declare class TypeaheadSelector extends React.Component<Props> {
    private getDefaultProps();
    render(): false | JSX.Element;
    private onClick(result, event);
}
export default TypeaheadSelector;
