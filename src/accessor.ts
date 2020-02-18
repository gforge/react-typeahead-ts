/* eslint-disable no-console */
import { OptionToStrFn, Option, OptionsObject, SelectorType } from './types';

export default class Accessor {
  // tslint:disable-next-line
  static IDENTITY_FN<T>(input: T): T {
    return input;
  }

  static generateAccessor<T extends OptionsObject>(
    field: string
  ): OptionToStrFn<T> {
    return (object: T) => {
      const value = object[field];
      if (typeof value !== 'string' && typeof value !== 'number') {
        console.warn('Bad field', field, value, 'on', object);
        throw new Error(
          `The field ${field} does not result in a string on object, see console`
        );
      }
      return value;
    };
  }

  static generateOptionToStringFor(
    prop?: string | OptionToStrFn<any>
  ): (opt: Option) => string | number {
    if (typeof prop === 'string') {
      return Accessor.generateAccessor(prop) as (opt: Option) => string;
    }

    if (typeof prop === 'function') {
      return prop as (opt: Option) => string;
    }

    return function identityFunction(input: Option) {
      return input as string;
    };
  }

  static valueForOption<T extends Option>(
    object: T,
    selector?: SelectorType<T>
  ): string | number | void;

  // eslint-disable-next-line no-dupe-class-members
  static valueForOption<T extends Option>(
    object: T,
    selector?: OptionToStrFn<OptionsObject> | string
  ): string | number | void {
    if (typeof object !== 'string') {
      if (typeof object === 'string')
        throw new Error(`Invalid object type ${typeof object}`);
      if (!selector) throw new Error('Selector is required with object');

      if (typeof selector === 'string') {
        const value = (object as OptionsObject)[selector];
        if (!['string', 'number'].includes(typeof value)) {
          console.warn('Bad field', selector, value, 'on', object);
          throw new Error(
            `The field ${selector} does not result in a string on object, see console`
          );
        }
        return value as string | number;
      }

      return selector(object as OptionsObject);
    }

    if (typeof object === 'string') {
      return object;
    }

    throw new Error(`Invalid object type ${typeof object}`);
  }
}
