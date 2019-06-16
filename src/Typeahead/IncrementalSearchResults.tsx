import * as React from 'react';

interface Props {
  showResults: boolean;
}
const IncrementalSearchResults = (props: Props) => {
  const { showResults, selection, maxVisible, onOptionSelected, displayOption, allowCustomValues, resultsTruncatedMessage, customClasses, selectionIndex, defaultClassNames } = props;
    // Nothing has been entered into the textbox
    if (!showResults) {
      return null;
    }

    // Something was just selected
    if (selection) {
      return null;
    }

    const searchResults = searchOptions();
    const truncated: boolean = Boolean(
      maxVisible && searchResults.length > maxVisible
    );

    return (
      <TypeaheadSelector
        options={
          maxVisible ? searchResults.slice(0, maxVisible) : searchResults
        }
        areResultsTruncated={truncated}
        onOptionSelected={onOptionSelected}
        customValue={getCustomValue()}
        displayOption={Accessor.generateOptionToStringFor(displayOption)}
        {...{
          allowCustomValues,
          resultsTruncatedMessage,
          customClasses,
          selectionIndex,
          defaultClassNames,
        }}
      />
    );
  }

}

export default React.memo(IncrementalSearchResults)