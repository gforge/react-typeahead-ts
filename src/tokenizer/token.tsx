import * as React from 'react';
import classNames from 'classnames';

export interface Props {
  className?: string;
  name?: string;
  children: React.ReactNode | string;
  object: string | object;
  onRemove: Function;
  value: string;
  key: string | number;
}

/**
 * Encapsulates the rendering of an option that has been "selected" in a
 * TypeaheadTokenizer
 */ 
class Token extends React.Component<Props> {
  
  render() {
    const className = classNames([
      'typeahead-token',
      this.props.className,
    ]);

    return (
      <div className={className} key={this.props.key}>
        {this.renderHiddenInput()}
        {this.props.children}
        {this.renderCloseButton()}
      </div>
    );
  }

  private renderHiddenInput() {
    const { name, value, object } = this.props;
    // If no name was set, don't create a hidden input
    if (!name) {
      return null;
    }

    const hiddenValue = value || object;
    if (typeof hiddenValue !== 'string') {
      throw new Error('Expected either string value or string object');
    }
    return (
      <input
        type="hidden"
        name={name + '[]'}
        value={hiddenValue}
      />
    );
  }

  renderCloseButton() {
    if (!this.props.onRemove) {
      return '';
    }

    return (
      <a
        className={this.props.className || 'typeahead-token-close'} 
        href="#" 
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
          this.props.onRemove(this.props.object);
          event.preventDefault();
        }}
      >
        &#x00d7;
      </a>);
  }
}

export default Token;
