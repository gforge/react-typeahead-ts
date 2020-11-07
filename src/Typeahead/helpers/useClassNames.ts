import { useMemo } from 'react';
import classNames from 'classnames';

import { CustomClasses } from '../../types';

interface ClassName {
  [className: string]: boolean;
}
interface Props {
  customClasses?: CustomClasses;
  className?: string;
  defaultClassNames?: boolean;
  hover?: boolean;
  customValue?: string;
}

export default (props: Props) => {
  const {
    className,
    defaultClassNames,
    customClasses,
    hover,
    customValue,
  } = props;

  const inputClassNames = useMemo(() => {
    const clss: ClassName = {};
    const { input } = customClasses || { input: undefined };
    if (input) {
      clss[input] = true;
    }
    return classNames(clss);
  }, [customClasses]);

  const mainClassNames = useMemo(() => {
    const clss: ClassName = {
      typeahead: !!defaultClassNames,
    };
    if (className) {
      clss[className] = true;
    }

    return classNames(clss);
  }, [defaultClassNames, className]);

  const optionClassNames = useMemo(() => {
    const clss: ClassName = {};

    const { listItem, hover: hoverClass, customAdd } = customClasses || {};
    clss[hoverClass || 'hover'] = !!hover;
    if (listItem) {
      clss[listItem] = true;
    }
    if (customValue && customAdd) {
      clss[customAdd] = true;
    }

    return classNames(clss);
  }, [customClasses, hover, customValue]);

  return useMemo(
    () => ({
      mainClassNames,
      inputClassNames,
      optionClassNames,
    }),
    [mainClassNames, inputClassNames, optionClassNames]
  );
};
