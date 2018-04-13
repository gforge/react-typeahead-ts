import * as React from 'react';
import classNames from 'classnames';
import TypeaheadOption from './option';
import { CustomClasses, OptionSelector } from '../types';

export interface Props {
  options: string[];
  allowCustomValues?: number;
  customClasses?: CustomClasses;
  customValue?: string;
  selectionIndex?: number;
  onOptionSelected?: OptionSelector;
  displayOption: Function;
  defaultClassNames?: boolean;
  areResultsTruncated?: boolean;
  resultsTruncatedMessage?: string;
}

/**
 * Container for the options rendered as part of the autocompletion process
 * of the typeahead
 */
class TypeaheadSelector extends React.Component<Props> {
  private getDefaultProps() {
    const customClasses: CustomClasses = {};
    return {
      customClasses,
      allowCustomValues: 0,
      onOptionSelected: () => {},
      defaultClassNames: true,
    };
  }

  render() {
    const { 
      options, customClasses, customValue, displayOption,
      defaultClassNames, allowCustomValues, selectionIndex,
      areResultsTruncated, resultsTruncatedMessage,
    } = 
      { ...this.getDefaultProps(), ...this.props };
    // Don't render if there are no options to display
    if (!options.length && allowCustomValues <= 0) {
      return false;
    }

    const classes: any = {
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
      customValueComponent = (
        <TypeaheadOption 
          ref={customValue} 
          key={customValue}
          hover={selectionIndex === 0}
          customClasses={customClasses}
          customValue={customValue}
          onClick={this.onClick.bind(this, customValue)}
        >
          {customValue}
        </TypeaheadOption>
      );
    }

    const results = options.map((result, i) => {
      const displayString = displayOption(result, i);
      const uniqueKey = displayString + '_' + i;
      return (
        <TypeaheadOption 
          ref={uniqueKey} 
          key={uniqueKey}
          hover={selectionIndex === i + customValueOffset}
          customClasses={customClasses}
          onClick={this.onClick.bind(this, result)}
        >
          {displayString}
        </TypeaheadOption>
      );
    });

    if (areResultsTruncated && resultsTruncatedMessage) {
      const resultsTruncatedClasses: any = {
        'results-truncated': defaultClassNames,
      };
      const { resultsTruncated } = customClasses;
      if (resultsTruncated) {
        resultsTruncatedClasses[resultsTruncated] = true;
      }
      const resultsTruncatedClassList = classNames(resultsTruncatedClasses);

      results.push(
        <li key="results-truncated" className={resultsTruncatedClassList}>
          {this.props.resultsTruncatedMessage}
        </li>);
    }

    return (
      <ul className={classList}>
        {customValueComponent}
        {results}
      </ul>
    );
  }

  private onClick(result: string, event: React.MouseEvent<HTMLDivElement>) {
    const { onOptionSelected } = this.props;
    if (!onOptionSelected) return;

    return onOptionSelected(result, event);
  }
}

export default TypeaheadSelector;
