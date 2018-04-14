import { OptionToStrFn, Option } from './types';

export default class Accessor {
  // tslint:disable-next-line
  static IDENTITY_FN<T>(input: T): T { return input; }

  static generateAccessor(field: string) {
    return (object: { [propName: string]: string }) => object[field];
  }

  static generateOptionToStringFor<T>(prop?: string | Function): OptionToStrFn<T> {
    if (typeof prop === 'string') {
      // @ts-ignore
      return Accessor.generateAccessor(prop);
    } 
    
    if (typeof prop === 'function') {
      return (prop as any);
    }
    
    return function (input: any) { return (input as string); };
  }

  static valueForOption<T extends Option>(
    object: T,
    selector?: string | OptionToStrFn<T> | undefined, 
  ): string | void {
    if (typeof selector === 'string') {
      if (typeof object !== 'object') throw new Error(`Invalid object type ${typeof object}`);
      // @ts-ignore
      return object[selector];
    } 
    
    if (typeof selector === 'function') {
      return selector(object);
    }

    if (typeof object === 'string') {
      return object;
    }
    
    throw new Error(`Invalid object type ${typeof object}`);
  }
}
