/**
 * Check if class A is derived (directly or indirectly) from class B by recursively walking up the prototype chain.
 * @param {Function} A Potential derived class
 * @param {Function} B Potential parent class
 * @return {Boolean} Whether A derives from B or not
 */
export default function isExtensionOf(A, B) {
  if(A === B) {
    return true;
  }
  if(typeof A !== 'function') {
    return false;
  }
  const prototypeOfA = Object.getPrototypeOf(A);
  if(typeof B !== 'function') {
    return prototypeOfA === B;
  }
  return isExtensionOf(prototypeOfA, B);
}
