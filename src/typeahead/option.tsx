import * as React from 'react';
import classNames from 'classnames';

export interface CustomClasses {
  listItem?: string;
  hover?: string;
  customAdd?: string;
  listAnchor?: string;
}

export interface Props {
  customClasses?: CustomClasses;
  customValue?: string;
  onClick: Function;
  children: React.ReactNode;
  hover?: boolean;
}

/**
 * A single option within the TypeaheadSelector
 */
class TypeaheadOption extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  private getDefaultProps() {
    const customClasses: CustomClasses = { hover: 'hover' };
    return {
      customClasses,
      onClick: (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
      },
      hover: false,
    };
  }

  render() {
    const { 
      customClasses, hover,
      children, customValue,
     } = { ...this.getDefaultProps(), ...this.props };

    const classes: any = {};
    const { listItem, hover: hoverClass = 'hover', customAdd } = customClasses;
    classes[hoverClass] = Boolean(hover);
    if (listItem) {
      classes[listItem] = Boolean(listItem);
    }

    if (customValue && customAdd) {
      classes[customAdd] = Boolean(customAdd);
    }

    const classList = classNames(classes);

    // For some reason onClick is not fired when clicked on an option
    // onMouseDown is used here as a workaround of #205 and other
    // related tickets
    return (
      <li className={classList} onClick={this.onClick} onMouseDown={this.onClick}>
        <a 
          href="javascript: void 0;" 
          className={this.getClasses()} 
          // tslint:disable-next-line:jsx-no-string-ref
          ref="anchor"
        >
          {children}
        </a>
      </li>
    );
  }

  getClasses() {
    const { customClasses } = { ...this.getDefaultProps(), ...this.props };
    const classes: any = {
      'typeahead-option': true,
    };
    const { listAnchor } = customClasses;
    if (listAnchor) {
      classes[listAnchor] = true;
    }

    return classNames(classes);
  }

  onClick(event: React.MouseEvent<HTMLLIElement>) {
    event.preventDefault();
    return this.props.onClick(event);
  }
}

export default TypeaheadOption;
