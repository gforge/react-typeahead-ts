import * as React from 'react';
import { Typeahead } from 'reactstrap-typeahead';
import './App.css';

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <h1 className="App-title">A simple typeahead (e.g. autocomplete) component</h1>
        <p className="App-intro">
          This is an update to the react-typeahead component that seems to have been
          a little stale lately.
        </p>
        <Typeahead
          options={['John', 'Paul', 'George', 'Ringo']}
          maxVisible={2}
        />
      </div>
    );
  }
}

export default App;
