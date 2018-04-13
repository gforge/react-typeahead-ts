export default class Accessor {
  // tslint:disable-next-line
  static IDENTITY_FN<T>(input: T): T { return input; }

  static generateAccessor(field: string) {
    return (object: { [propName: string]: any }) => object[field];
  }

  static generateOptionToStringFor(prop?: string | Function) {
    if (typeof prop === 'string') {
      return Accessor.generateAccessor(prop);
    } 
    
    if (typeof prop === 'function') {
      return prop;
    }
    
    return Accessor.IDENTITY_FN;
  }

  static valueForOption<T>(
    option: string | ((arg: T) => string), 
    object: T,
  ): string | void {
    if (typeof option === 'string') {
      if (typeof object !== 'object') throw new Error(`Invalid object type ${typeof object}`);
      // @ts-ignore
      return object[option];
    } 
    
    if (typeof option === 'function') {
      return option(object);
    }

    if (typeof object === 'string') {
      return object;
    }
    
    throw new Error(`Invalid object type ${typeof object}`);
  }
}
