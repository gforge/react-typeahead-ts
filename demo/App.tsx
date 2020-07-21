/* eslint-disable react/jsx-one-expression-per-line */
import * as React from 'react';
import './App.css';
import {
  FormikExample,
  SimpleTokenizer,
  SimpleTypeahead,
  BootstrapTypaheadClass,
  ArrayOptions,
} from './Examples';

const App = () => (
  <div className="App" style={{ marginBottom: '100px' }}>
    <h1 className="App-title">
      A simple typeahead (e.g. autocomplete) component
    </h1>
    <p className="App-intro">
      This is a{' '}
      <a href="https://github.com/gforge/react-typeahead-ts">rewrite</a> of the
      the original{' '}
      <a href="https://github.com/fmoo/react-typeahead">react-typeahead</a>{' '}
      package.
    </p>
    <p>
      If you&rsquo;re not getting the same layout it is most likely due to lack
      of proper css-styles. Check out the <code>App.css</code> in the demo
      section at GitHub to see how to set the appropriate styles.
    </p>
    <FormikExample />
    <br />
    <SimpleTypeahead />
    <br />
    <SimpleTokenizer />
    <br />
    <BootstrapTypaheadClass />
    <br />
    <ArrayOptions />
  </div>
);

export default App;
