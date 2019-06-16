import { OptionToStrFn, Option, OptionsObject, SelectorType } from './types';

export default class Accessor {
  // tslint:disable-next-line
  static IDENTITY_FN<T>(input: T): T { return input; }

  static generateAccessor<T extends OptionsObject>(field: string): OptionToStrFn<T> {
    return (object: T) => {
      const value = object[field]
      if (typeof value !== 'string') {
        console.warn('Bad field', field, value, 'on', object)
        throw new Error(`The field ${field} does not result in a string on object, see console`)
      }
      return value;
    };
  }

  static generateOptionToStringFor<T extends OptionsObject>(prop?: string | OptionToStrFn<T>): OptionToStrFn<T> {
    if (typeof prop === 'string') {
      return Accessor.generateAccessor(prop);
    }

    if (typeof prop === 'function') {
      return prop;
    }

    return function (input: any) { return (input as string); };
  }

  static valueForOption<T extends Option>(object: T, selector?: SelectorType<T>): string | void
  static valueForOption<T extends Option>(
    object: T,
    selector?: OptionToStrFn<OptionsObject> | string,
  ): string | void {
    if (typeof object !== 'string') {
      if (typeof object === 'string') throw new Error(`Invalid object type ${typeof object}`);
      if (!selector) throw new Error('Selector is required with object');

      if (typeof selector === 'string') {
        const value = (object as OptionsObject)[selector];
        if (typeof value !== 'string') {
          console.warn('Bad field', selector, value, 'on', object)
          throw new Error(`The field ${selector} does not result in a string on object, see console`)
        }
        return value;
      }

      return selector(object as OptionsObject);
    }

    if (typeof object === 'string') {
      return object;
    }

    throw new Error(`Invalid object type ${typeof object}`);
  }
}
