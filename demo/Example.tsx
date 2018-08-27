import * as React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import SyntaxHighlighter, { light } from 'react-syntax-highlighter/prism';

export interface Props {
  title: React.ReactNode;
  code?: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export default class Example extends React.PureComponent<Props> {
  state = { hasError: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.warn(error, info);
  }

  render () {
    const { hasError } = this.state;
    if (hasError) {
      return (
        <Card>
          Sorry but an error occurred. Check console for details.
        </Card>
      );
    }

    const { title, code, children } = this.props;
    return (
      <Card>
        <CardHeader>{title}</CardHeader>
        {code && (
          <SyntaxHighlighter language="javascript" style={light}>
            {code}
          </SyntaxHighlighter>
        )}
        <CardBody>
          {children}
        </CardBody>
      </Card>);
  }
}
