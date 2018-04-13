/// <reference types="react" />
import * as React from 'react';
export interface Props {
    className?: string;
    name: string;
    children: React.ReactNode | string;
    object: string | object;
    onRemove: Function;
    value: string;
    key?: string | number;
}
declare class Token extends React.Component<Props> {
    render(): JSX.Element;
    private renderHiddenInput();
    renderCloseButton(): "" | JSX.Element;
}
export default Token;
