/// <reference types="react" />
import * as React from 'react';
export interface CustomClasses {
    listItem?: string;
    hover?: string;
    customAdd?: string;
    listAnchor?: string;
}
export interface Props {
    customClasses?: CustomClasses;
    customValue?: string;
    onClick: Function;
    children: React.ReactNode;
    hover?: boolean;
}
declare class TypeaheadOption extends React.Component<Props> {
    constructor(props: Props);
    private getProps();
    render(): JSX.Element;
    getClasses(): string;
    onClick(event: React.MouseEvent<HTMLLIElement>): any;
}
export default TypeaheadOption;
