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
