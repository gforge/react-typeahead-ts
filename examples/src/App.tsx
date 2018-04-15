import * as React from 'react';
import { Typeahead } from 'react-typeahead-ts';
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
          </a> component that seems to have a somewhat old code-base by with <code
          >
            create-react-class
          </code>.
        </p>
        <Typeahead options={['John', 'Paul', 'George', 'Ringo']} maxVisible={2} />
    </div>);
  }
}

export default App;
