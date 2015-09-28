export default function isExtensionOf(A, B) {
  return B.prototype.isPrototypeOf(A);
}
