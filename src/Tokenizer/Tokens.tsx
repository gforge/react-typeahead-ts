import * as React from 'react';
import classNames from 'classnames';
import { TokenCustomClasses, Option, SelectorType } from '../types';
import Accessor from '../accessor';
import Token from './Token';

export interface Props<Opt extends Option>
  extends React.InputHTMLAttributes<HTMLInputElement> {
  name?: string;
  selectedOptions: Opt[];
  token?: TokenCustomClasses['token'];
  displayOption?: SelectorType;
  formInputOption?: SelectorType;
  removeTokenForValue: (value: any) => void;
}

const Tokens = <T extends Option>(props: Props<T>) => {
  const {
    name,
    selectedOptions,
    token,
    displayOption,
    formInputOption,
    removeTokenForValue,
  } = props;

  const tokenClasses: any = {};
  if (token) tokenClasses[token] = true;
  const classList: string = classNames(tokenClasses);

  return (
    <>
      {selectedOptions.map(option => {
        const displayString = Accessor.valueForOption(option, displayOption);
        const value = Accessor.valueForOption(
          option,
          formInputOption || displayOption
        );
        if (!displayString || !value)
          throw new Error('Expected string and value to exist');

        const key: string = `Token: ${displayString}`;
        return (
          <Token
            key={key}
            className={classList}
            onRemove={removeTokenForValue}
            object={option}
            value={value}
            name={name}
          >
            {displayString}
          </Token>
        );
      })}
    </>
  );
};

export default React.memo(Tokens);
