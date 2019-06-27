import * as React from 'react';
import { OptionToStrFn, HandleOnOptionSelectArg, Option } from '../types';
import { CustomClasses } from './TypeaheadOption';
import Accessor from '../accessor';
import TypeaheadSelector from './TypeaheadSelector';

interface Props<Opt extends Option> {
  showResults: boolean;
  selection: string | number | undefined;
  maxVisible: number | undefined;
  handleOptionSelected: HandleOnOptionSelectArg;
  displayOption: string | OptionToStrFn<any> | undefined;
  allowCustomValues: boolean | undefined;
  resultsTruncatedMessage: string | undefined;
  customClasses: CustomClasses | undefined;
  selectionIndex: number | undefined;
  defaultClassNames: boolean | undefined;
  filteredOptions: Opt[];
  hasCustomValue: boolean | undefined;
  entryValue: string;
}

const IncrementalSearchResults = <T extends Option>(props: Props<T>) => {
  const {
    showResults,
    selection,
    maxVisible,
    handleOptionSelected,
    displayOption,
    allowCustomValues,
    resultsTruncatedMessage,
    customClasses,
    selectionIndex,
    defaultClassNames,
    filteredOptions,
    hasCustomValue,
    entryValue,
  } = props;
  // Nothing has been entered into the textbox
  if (!showResults) {
    return null;
  }

  // Something was just selected
  if (selection) {
    return null;
  }

  const truncated = Boolean(maxVisible && filteredOptions.length > maxVisible);

  return (
    <TypeaheadSelector
      options={
        maxVisible ? filteredOptions.slice(0, maxVisible) : filteredOptions
      }
      areResultsTruncated={truncated}
      handleOptionSelected={handleOptionSelected}
      customValue={(hasCustomValue && entryValue) || undefined}
      displayOption={Accessor.generateOptionToStringFor(displayOption)}
      allowCustomValues={!!allowCustomValues}
      {...{
        resultsTruncatedMessage,
        customClasses,
        selectionIndex,
        defaultClassNames,
      }}
    />
  );
};

export default React.memo(IncrementalSearchResults);
