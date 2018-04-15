import * as React from 'react';
import classNames from 'classnames';
import TypeaheadOption from './option';
import { CustomClasses, SelectorOptionSelector, Option } from '../types';

export interface Props<Opt extends Option> {
  options: Opt[];
  allowCustomValues?: number;
  customClasses?: CustomClasses;
  customValue?: string;
  selectionIndex?: number;
  onOptionSelected: SelectorOptionSelector<Opt>;
  displayOption: Function;
  defaultClassNames?: boolean;
  areResultsTruncated?: boolean;
  resultsTruncatedMessage?: string;
  innerRef?: ((c: HTMLElement) => void);
}

/**
 * Container for the options rendered as part of the autocompletion process
 * of the typeahead
 */
class TypeaheadSelector<T> extends React.Component<Props<T>> {
  // Hack to handle the buggy typescript defaultProps
  private getProps() {
    const customClasses: CustomClasses = {};
    return {
      ...{
        customClasses,
        allowCustomValues: 0,
        defaultClassNames: true,
      },
      ...this.props,
    };
  }

  render() {
    const { 
      options, customClasses, customValue, displayOption,
      defaultClassNames, allowCustomValues, selectionIndex,
      areResultsTruncated, resultsTruncatedMessage,
    } = this.getProps();
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
      // TODO: needed ref? ref={customValue} 
      customValueComponent = (
        <TypeaheadOption 
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
      // TODO: needed ref? ref={uniqueKey} 
      return (
        <TypeaheadOption 
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
        'results-truncated': true,
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

  private onClick(result: T, event: React.MouseEvent<HTMLDivElement>) {
    const { onOptionSelected } = this.props;
    if (!onOptionSelected) return;

    return onOptionSelected(result, event);
  }
}

export default TypeaheadSelector;
