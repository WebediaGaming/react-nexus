/**
 * @class AbstractClassInstantiationError
 * @extends Error
 * @description Error thrown when a class marked with `abstract` is instantiated
 */
class AbstractClassInstantiationError extends Error {}

/**
 * Abstract class decorator. A class decorated with this can not be directly instantiated: it must be extended first.
 * @param {Function} Class The Class to be marked as abstract
 * @return {Function} A class derived from Class which throws when instantiated directly
 */
function abstract(Class) {
  return class AbstractClass extends Class {
    constructor(...args) {
      super(...args);
      if(this.constructor === AbstractClass || this.constructor === Class) {
        throw new AbstractClassInstantiationError('This class is abstract and should not be instantiated.');
      }
    }
  };
}

export default abstract;
