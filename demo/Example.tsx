import * as React from 'react';
import {
  Card, CardHeader, CardBody, Button,
  Modal, ModalHeader, ModalBody,
} from 'reactstrap';
import SyntaxHighlighter, { light } from 'react-syntax-highlighter/prism';

export interface Props {
  title: React.ReactNode;
  code?: string;
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  popoverOpen: boolean;
}

export default class Example extends React.PureComponent<Props, State> {
  state = { hasError: false, popoverOpen: false };

  componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.warn(error, info);
  }

  toggle = () => this.setState({ popoverOpen: !this.state.popoverOpen });

  getCleanCode(): string | void {
    const { code } = this.props;
    if (!code) return;
    let lines = code.split(/\n/);
    const firstNonEmpty = lines.findIndex(l => l.search(/[^ ]/) >= 0);
    if (firstNonEmpty < 0) return;
    lines = lines.slice(firstNonEmpty);

    const indentation = lines[0].search(/[^ ]/);
    if (indentation <= 0) return lines.join('\n').trim();

    lines = lines.map((line) => {
      const currInd = line.search(/[^ ]/);
      if (currInd < indentation) return line;

      return line.substr(indentation);
    });
    return lines.join('\n').trim();
  }

  renderCode() {
    const code = this.getCleanCode();
    if (!code) return;

    const highlightedCode = (
      <SyntaxHighlighter language="javascript" style={light}>
        {code}
      </SyntaxHighlighter>);

    if (code.split('\n').length < 15) {
      return highlightedCode;
    }

    return (
      <React.Fragment>
        <Button onClick={this.toggle} color="info">
          View code
        </Button>
        <Modal
          isOpen={this.state.popoverOpen}
          target="CodeHighlight"
          toggle={this.toggle}
          size="lg"
          style={{ width: '90%' }}
        >
          <ModalHeader>Code</ModalHeader>
          <ModalBody>{highlightedCode}</ModalBody>
        </Modal>
      </React.Fragment>);
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

    const { title, children } = this.props;
    const code = this.getCleanCode();
    return (
      <Card>
        <CardHeader>{title}</CardHeader>
        {this.renderCode()}
        <CardBody>
          {children}
        </CardBody>
      </Card>);
  }
}
