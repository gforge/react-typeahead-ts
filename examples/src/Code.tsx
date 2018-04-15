import * as React from 'react';

const Code = ({ children }: { children: string }) => {
  const lines = children
    .split('\n')
    .filter(l => l !== '');
  
  const indentation = lines[0].length - lines[0].replace(/^[ ]+/, '').length;
  const formattedCode = lines.map(l => l.substr(indentation)).join('\n');

  return (
    <React.Fragment>
      <p style={{ fontWeight: 'bold' }}>The code:</p>
      <code 
        style={{ 
          border: '1px solid gray', 
          margin: 'auto', 
          minWidth: '400px', 
          paddingLeft: '20px',
          paddingTop: '10px',
          textAlign: 'left',
          backgroundColor: '#FCFCFF'
        }}
      >
        <pre>
          {formattedCode}
        </pre>
      </code>
    </React.Fragment>);
};

export default Code;
