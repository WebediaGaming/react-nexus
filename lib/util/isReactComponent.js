export default function isReactCompositeComponent(component) {
  if(typeof component.prototype === 'object' && component.prototype.isReactComponent) {
    return true;
  }
  return false;
}
