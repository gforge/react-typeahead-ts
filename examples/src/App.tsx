import * as React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import { Typeahead, Tokenizer } from '@gforge/react-typeahead-ts';
import FormikExample from './FormikExample';
import Code from './Code';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-title">
          A simple typeahead (e.g. autocomplete) component
        </h1>
        <p className="App-intro">
          This is a rewrite of the the <a href="https://github.com/fmoo/react-typeahead">
            react-typeahead
          </a> component that seems to have a somewhat old code-base by with 
          {' '}<code>
            create-react-class
          </code>.
        </p>
        <Card>
          <CardHeader>Formik</CardHeader>
          <CardBody>
            <FormikExample />
          </CardBody>
        </Card>
        <br />

        <Card>
          <CardHeader>Simple test</CardHeader>
          <Code>
            {`
              <Typeahead
                options={['John', 'Paul', 'George', 'Ringo']}
              />`}
          </Code>
          <CardBody>
            <Typeahead
              options={['John', 'Paul', 'George', 'Ringo']}
            />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Simple tokenizer test</CardHeader>
          <Code>
            {`
              <Tokenizer
                options={['John', 'Paul', 'George', 'Ringo']}
                defaultSelected={['John']}
              />`}
          </Code>
          <CardBody>
            <Tokenizer
              options={['John', 'Paul', 'George', 'Ringo']}
              defaultSelected={['John']}
            />
          </CardBody>
        </Card>
        <br />
        <Card>
          <CardHeader>Always show with Bootstrap classes</CardHeader>
          <Code>
            {`
            <Typeahead
              options={['John', 'Paul', 'George', 'Ringo']}
              showOptionsWhenEmpty={true}
              className="inputStyle"
              customClasses={{
                results: 'list-group',
                listItem: 'list-group-item'
              }}
            />`}
          </Code>
          <CardBody>
            <Typeahead
              options={['John', 'Paul', 'George', 'Ringo']}
              showOptionsWhenEmpty={true}
              className="inputStyle"
              customClasses={{
                results: 'list-group',
                listItem: 'list-group-item',
              }}
            />
          </CardBody>
        </Card>

        <br />
        <Card>
          <CardHeader>Pass object array as option</CardHeader>
          <Code>
            {`
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
          </Code>
          <CardBody>
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
          </CardBody>
        </Card>

    </div>);
  }
}

export default App;
