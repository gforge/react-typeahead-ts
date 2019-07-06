import * as React from 'react';
import { mount } from 'enzyme';
import Typeahead from '../../src/Typeahead';
import simulateTextInput from '../helpers/simulateTextInput';
import { BEATLES } from '../helpers/data';

describe('Typeahead Component props searchOptions', () => {
  test('Simplesearch example', () => {
    const component = mount(
      <Typeahead
        options={BEATLES}
        searchOptions={(value: string, opts: string[]) =>
          opts.filter(o => o.match(RegExp(value, 'i')))
        }
        displayOption={o => `Score: ${o.length} ${o}`}
        inputDisplayOption={o => o}
      />
    );

    simulateTextInput(component, 'john');
    expect(component.text()).toEqual('Score: 4 John');
  });

  test('can sort displayed items when specified with map function wrapped with sort', () => {
    const component = mount(
      <Typeahead
        options={BEATLES}
        searchOptions={(value, opts) =>
          opts.sort().filter(o => o.match(RegExp(value, 'i')))
        }
        displayOption={o => `Score: ${o.length} ${o}`}
      />
    );

    simulateTextInput(component, 'orgE');
    expect(component.text()).toEqual('Score: 6 George');
  });
});
