import * as React from 'react';
import classNames from 'classnames';
import TypeaheadOption from './TypeaheadOption';
import { CustomClasses, SelectorOptionSelector, Option } from '../types';

export interface Props<Opt extends Option> {
  options: Opt[];
  allowCustomValues: boolean | undefined;
  customClasses?: CustomClasses;
  customValue: string | undefined;
  selectionIndex: number | undefined;
  handleOptionSelected: SelectorOptionSelector<Opt | string>;
  displayOption: Function;
  defaultClassNames: boolean | undefined;
  areResultsTruncated: boolean | undefined;
  resultsTruncatedMessage: string | undefined;
}

/**
 * Container for the options rendered as part of the autocompletion process
 * of the typeahead
 */
const TypeaheadSelector = <T extends Option>(props: Props<T>) => {
  const {
    options,
    customClasses = {},
    customValue,
    displayOption,
    defaultClassNames = true,
    allowCustomValues,
    selectionIndex,
    areResultsTruncated,
    resultsTruncatedMessage,
    handleOptionSelected,
  } = props;
  // Don't render if there are no options to display
  if (!options.length && !allowCustomValues) {
    return null;
  }

  const classes: { [key: string]: boolean } = {
    'typeahead-selector': defaultClassNames,
  };
  const { results: resClass } = customClasses;
  if (resClass) {
    classes[resClass] = true;
  }
  const classList = classNames(classes);

  // CustomValue should be added to top of results list with different class name
  let customValueComponent;
  let customValueOffset = 0;
  if (customValue) {
    customValueOffset += 1;
    // TODO: needed ref? ref={customValue}
    customValueComponent = (
      <TypeaheadOption
        key={customValue}
        hover={selectionIndex === 0}
        customClasses={customClasses}
        customValue={customValue}
        handleOptionSelected={handleOptionSelected}
      >
        {customValue}
      </TypeaheadOption>
    );
  }

  const results = options.map((result, i) => {
    const displayString = displayOption(result, i);
    const uniqueKey = displayString + '_' + i;
    // TODO: needed ref? ref={uniqueKey}
    return (
      <TypeaheadOption
        key={uniqueKey}
        hover={selectionIndex === i + customValueOffset}
        customClasses={customClasses}
        handleOptionSelected={handleOptionSelected}
        result={result}
      >
        {displayString}
      </TypeaheadOption>
    );
  });

  if (areResultsTruncated && resultsTruncatedMessage) {
    const resultsTruncatedClasses: { [key: string]: boolean } = {
      'results-truncated': true,
    };
    const { resultsTruncated } = customClasses;
    if (resultsTruncated) {
      resultsTruncatedClasses[resultsTruncated] = true;
    }
    const resultsTruncatedClassList = classNames(resultsTruncatedClasses);

    results.push(
      <li key="results-truncated" className={resultsTruncatedClassList}>
        {resultsTruncatedMessage}
      </li>
    );
  }

  return (
    <ul className={classList}>
      {customValueComponent}
      {results}
    </ul>
  );
};

export default TypeaheadSelector;
