import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

const Code = (props: { children: string | undefined }) => {
  const { children: code } = props;
  if (!code) return null;
  const [open, setOpen] = React.useState(false);
  const toggle = React.useCallback(() => setOpen(!open), [setOpen, open]);
  const formattedCode = React.useMemo(() => {
    let lines = code.split(/\n/);
    const firstNonEmpty = lines.findIndex(l => l.search(/[^ ]/) >= 0);
    if (firstNonEmpty < 0) return;
    lines = lines.slice(firstNonEmpty);

    const indentation = lines[0].search(/[^ ]/);
    if (indentation <= 0) return lines.join('\n').trim();

    lines = lines.map(line => {
      const currInd = line.search(/[^ ]/);
      if (currInd < indentation) return line;

      return line.substr(indentation);
    });
    return lines.join('\n').trim();
  }, [code]);

  if (code.split('\n').length < 15) {
    return (
      <pre style={{ textAlign: 'left', paddingLeft: '2cm' }}>
        {formattedCode}
      </pre>
    );
  }

  // TODO: add SyntaxHighlighter language="javascript" once the refractor issue is resolved
  // https://github.com/conorhastings/react-syntax-highlighter/issues/180
  return (
    <>
      <Button onClick={toggle} color="info">
        View code
      </Button>
      <Modal
        isOpen={open}
        target="CodeHighlight"
        toggle={toggle}
        size="lg"
        style={{ width: '90%' }}
      >
        <ModalHeader>Code</ModalHeader>
        <ModalBody>
          <pre>{formattedCode}</pre>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Code;
