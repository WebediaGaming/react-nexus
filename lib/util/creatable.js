/**
 * Creatable class decorator.
 * Adds a static `create` method which as a static factory, taking the same params as the constructor.
 * @param {Function} Class The Class to be marked as abstract
 * @returns {Function} Class The decorated Class
 */
function creatable(Class) {
  if(typeof Class !== 'function') {
    throw new TypeError('@creatable should only be applied to classes.');
  }
  return class CreatableClass extends Class {
    static create(...args) {
      return new this(...args);
    }
  };
}

export default creatable;
