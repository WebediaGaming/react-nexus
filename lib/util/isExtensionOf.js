/**
 * Determines whether a class A is an extension (direct or indirect) of another ancestor class B, by recursively
 * walking up the proto chain.
 * @param {Function} A Class that could be an extension
 * @param {Function} B Class that could be an ancestor
 * @return {Boolean} True if A is an extension of B, false otherwise.
 */
function isExtensionOf(A, B) {
  if(A === B) {
    return true;
  }
  if(typeof A !== 'function') {
    return false;
  }
  const protoOfA = Reflect.getPrototypeOf(A);
  if(typeof B !== 'function') {
    return protoOfA === B;
  }
  return isExtensionOf(protoOfA, B);
}

export default isExtensionOf;
