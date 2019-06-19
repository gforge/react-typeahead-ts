import * as React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import Code from './Code';

export interface Props {
  title: React.ReactNode;
  code?: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class Example extends React.PureComponent<Props, State> {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.warn(error, info);
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <Card>Sorry but an error occurred. Check console for details.</Card>
      );
    }

    const { title, code, children } = this.props;
    return (
      <Card>
        <CardHeader>{title}</CardHeader>
        <Code>{code}</Code>
        <CardBody>{children}</CardBody>
      </Card>
    );
  }
}
