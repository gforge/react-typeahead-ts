import * as React from 'react';
import Accessor from '../accessor';
import Typeahead, { Props as TypeaheadProps } from '../Typeahead';
import classNames from 'classnames';
import { TokenCustomClasses, Option, OptionsProps } from '../types';
import Tokens from './Tokens';
import useTokenManager from './helpers/useTokenManager';

export interface Props<Opt extends Option>
  extends Pick<
      TypeaheadProps<Opt>,
      | 'onChange'
      | 'className'
      | 'onBlur'
      | 'onFocus'
      | 'onKeyPress'
      | 'onKeyUp'
      | 'onKeyDown'
      | 'name'
      | 'initialValue'
      | 'disabled'
      | 'placeholder'
      | 'filterOption'
      | 'searchOptions'
      | 'displayOption'
      | 'formInputOption'
      | 'innerRef'
      | 'defaultClassNames'
      | 'showOptionsWhenEmpty'
      | 'maxVisible'
      | 'inputProps'
    >,
    OptionsProps<Opt> {
  customClasses?: TokenCustomClasses;
  defaultSelected?: Opt[];
  onTokenRemove?: (value: Opt) => any;
  onTokenAdd?: (value: Opt) => any;
  resultsTruncatedMessage?: string;
  renderAbove?: boolean;
}

/**
 * A typeahead that, when an option is selected, instead of simply filling
 * the text entry widget, prepends a renderable "token", that may be deleted
 * by pressing backspace on the beginning of the line with the keyboard.
 */
const TypeaheadTokenizer = <T extends Option>(props: Props<T>) => {
  const {
    // We rename these values and set default using useMemo in order to avoid
    // invalid object comparisons
    defaultSelected: ds,
    customClasses: cs,
    inputProps: ip,
    allowCustomValues,
    disabled = false,
    defaultClassNames = true,
    showOptionsWhenEmpty = false,
    formInputOption,
    displayOption,
    options,
    onKeyDown,
    onTokenAdd,
    onTokenRemove,
    className,
    initialValue = '',
    maxVisible,
    resultsTruncatedMessage,
    placeholder,
    onKeyPress,
    onKeyUp,
    onFocus,
    onBlur,
    filterOption,
    searchOptions,
    renderAbove,
    name,
  } = props;

  // Memo section
  // First section gets default values
  const defaultSelected = React.useMemo(() => ds || [], [ds]);
  const customClasses = React.useMemo(() => cs || {}, [cs]);
  const inputProps = React.useMemo(() => ip || {}, [ip]);

  // Contains the selected values
  const [selected, setSelected] = React.useState<T[]>(defaultSelected);

  // More complex memo
  const getInputOptionToStringMapper = React.useMemo(() => {
    if (typeof options[0] === 'string') return Accessor.IDENTITY_FN;
    const anyToStrFn = formInputOption || displayOption;
    return Accessor.generateOptionToStringFor(anyToStrFn);
  }, [formInputOption, displayOption, options]) as (arg: T) => string;
  const cleanOptions = React.useMemo(() => {
    return options.filter((opt: T) => {
      const value: string = getInputOptionToStringMapper(opt);
      return !selected.map(getInputOptionToStringMapper).includes(value);
    });
  }, [getInputOptionToStringMapper, selected, options]);

  const typeaheadElement = React.useRef<HTMLInputElement>();

  const { removeTokenForValue, addTokenForValue } = useTokenManager({
    selectedOptions: selected,
    typeaheadElement,
    onKeyDown,
    setSelected,
    onTokenAdd,
    onTokenRemove,
    getInputOptionToStringMapper,
  });
  const classList = React.useMemo(() => {
    const ret: { [key: string]: boolean } = {};
    const { typeahead } = customClasses;
    if (typeahead) {
      ret[typeahead] = true;
    }
    return classNames(ret);
  }, [customClasses]);

  const tokenizerClassList = React.useMemo(() => {
    const tokenizerClasses: string[] = [];
    if (defaultClassNames) {
      tokenizerClasses.push('typeahead-tokenizer');
    }
    if (className) {
      tokenizerClasses.push(className);
    }
    return classNames(tokenizerClasses);
  }, [customClasses]);

  const args2Pass = {
    placeholder,
    disabled,
    inputProps,
    customClasses,
    allowCustomValues,
    initialValue,
    maxVisible,
    resultsTruncatedMessage,
    onKeyPress,
    onKeyUp,
    onFocus,
    onBlur,
    displayOption,
    formInputOption,
    defaultClassNames,
    filterOption,
    searchOptions,
    showOptionsWhenEmpty,
  };

  return (
    <div className={tokenizerClassList}>
      {renderAbove && (
        <Tokens
          name={name}
          selectedOptions={selected}
          token={customClasses.token}
          // @ts-ignore
          formInputOption={formInputOption}
          // @ts-ignore
          displayOption={displayOption}
          removeTokenForValue={removeTokenForValue}
        />
      )}
      {
        <Typeahead
          innerRef={typeaheadElement}
          className={classList}
          {...args2Pass}
          options={cleanOptions}
          // @ts-ignore - onOptionSelect is impossible to match in 3.5.2
          onOptionSelected={addTokenForValue}
          onKeyDown={onKeyDown}
          clearOnSelection
        />
      }
      {!renderAbove && (
        <Tokens
          name={name}
          selectedOptions={selected}
          token={customClasses.token}
          // @ts-ignore
          formInputOption={formInputOption}
          // @ts-ignore
          displayOption={displayOption}
          removeTokenForValue={removeTokenForValue}
        />
      )}
    </div>
  );
};

interface MemoHelper {
  <T extends Option>(arg: Props<T>): JSX.Element;
}

// @ts-ignore - complains string != Option
const MemoTypeaheadTokenizer: MemoHelper = React.memo(TypeaheadTokenizer);

export default MemoTypeaheadTokenizer;
