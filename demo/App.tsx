import * as React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { Typeahead, Tokenizer } from '../src';
import FormikExample from './FormikExample';
import Example from './Example';
import './App.css';

class App extends React.Component {
  renderFormikExample() {
    return (
      <Example title="Formik example">
        <FormikExample />
      </Example>
    );
  }

  renderSimple() {
    return (
      <Example
        title="Simple typeahead"
        code={`
          <Typeahead
            options={['John', 'Paul', 'George', 'Ringo']}
          />`}
      >
        <Typeahead options={['John', 'Paul', 'George', 'Ringo']} />
      </Example>
    );
  }

  renderSimpleTokenizer() {
    return (
      <Example
        title="Simple tokenizer"
        code={`
              <Tokenizer
                options={['John', 'Paul', 'George', 'Ringo']}
                defaultSelected={['John']}
              />`}
      >
        <Tokenizer
          options={['John', 'Paul', 'George', 'Ringo']}
          defaultSelected={['John']}
        />
      </Example>
    );
  }

  renderBootstrapClasses() {
    return (
      <Example
        title="Always show with Bootstrap classes"
        code={`
            <Typeahead
              options={['John', 'Paul', 'George', 'Ringo']}
              showOptionsWhenEmpty={true}
              className="inputStyle"
              customClasses={{
                results: 'list-group',
                listItem: 'list-group-item'
              }}
            />`}
      >
        <Typeahead
          options={['John', 'Paul', 'George', 'Ringo']}
          showOptionsWhenEmpty={true}
          className="inputStyle"
          customClasses={{
            results: 'list-group',
            listItem: 'list-group-item',
          }}
        />
      </Example>
    );
  }

  renderArrayOptions() {
    return (
      <Example
        title="Pass object array as option"
        code={`
              <Typeahead
                options={[
                  { id: 1, name: 'John' },
                  { id: 2, name: 'Paul' },
                  { id: 3, name: 'George' },
                  { id: 4, name: 'Ringo' },
                ]}
                filterOption="name"
                displayOption="name"
                maxVisible={2}
                showOptionsWhenEmpty={true}
              />`}
      >
        <Typeahead
          options={[
            { id: 1, name: 'John' },
            { id: 2, name: 'Paul' },
            { id: 3, name: 'George' },
            { id: 4, name: 'Ringo' },
          ]}
          filterOption="name"
          displayOption="name"
          maxVisible={2}
          showOptionsWhenEmpty={true}
        />
      </Example>
    );
  }

  render() {
    return (
      <div className="App">
        <h1 className="App-title">
          A simple typeahead (e.g. autocomplete) component
        </h1>
        <p className="App-intro">
          This is a rewrite of the the{' '}
          <a href="https://github.com/fmoo/react-typeahead">react-typeahead</a>{' '}
          component that seems to have a somewhat old code-base by with{' '}
          <code>create-react-class</code>.
        </p>
        {this.renderFormikExample()}
        <br />
        {this.renderSimple()}
        <br />
        {this.renderSimpleTokenizer()}
        <br />
        {this.renderBootstrapClasses()}
        <br />
        {this.renderArrayOptions()}
      </div>
    );
  }
}

export default App;
