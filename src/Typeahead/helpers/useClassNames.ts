import { useMemo } from 'react';
import classNames from 'classnames';

import { CustomClasses } from '../../types';

interface ClassName { [className: string]: boolean }
interface Props {
  customClasses: CustomClasses | undefined;
  className: string | undefined;
  defaultClassNames: boolean | undefined;
}

export default (props: Props) => {
  const { className, defaultClassNames, customClasses } = props;

  return useMemo(() => {
    const inputClasses: ClassName = {};
    const { input } = customClasses;
    if (input) {
      inputClasses[input] = true;
    }
    const inputClassNames = classNames(inputClasses);

    const classes: { [className: string]: boolean } = {
      typeahead: !!defaultClassNames,
    };
    if (className) {
      classes[className] = true;
    }
    const classList = classNames(classes);

  return {
    mainClassNames,
    inputClassNames,
  }
}, [className, defaultClassNames, customClasses])
}