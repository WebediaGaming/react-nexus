/**
 * @class VirtualMethodInvocation
 * @extends Error
 * @description Error thrown when a method marked with `virtual` is invoked
 */
class VirtualMethodInvocation extends Error {}

/**
 * Virtual method decorator.
 * @param {Function} target Original class
 * @param {String|Symbol} name Original method property name
 * @param {Object} descriptor Original method property descriptor
 * @return {Object} Decorated method property descriptor
 */
function virtual(target, name, descriptor) {
  const value = descriptor.value;
  if(typeof value !== 'function') {
    throw new TypeError('@virtual should only be applied to methods.');
  }
  return Object.assign(descriptor, {
    value() {
      throw new VirtualMethodInvocation('This method is virtual and should not be invoked.');
    },
  });
}

export default virtual;
