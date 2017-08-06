import Promise from 'bluebird';
import React from 'react';
import _ from 'lodash';

import isExtensionOf from './util/isExtensionOf';
import preparable from './preparable';
const { $prepare } = preparable;

const NULL_CHILD_REACT_ELEMENT = React.createElement(() => null);

/**
 * Create a new `React.Component` instance on which {render} can then be called.
 * Should be disposed of using {dispose}.
 * It will apply the instances' `componentWillMount` lifecycle  method, if present.
 * @param {Function} Component Component class to instanciate
 * @param {Object} [props={}] props for the instance
 * @param {Object} [context={}] context for the instance
 * @return {React.Component} Instantiated component
 */
function create(Component, props = {}, context = {}) {
  const inst = new Component(props, context);
  if(inst.componentWillMount) {
    inst.componentWillMount();
  }
  return inst;
}

/**
 * Renders a given `React.Component` instance previously created by `create`, computes its child context,
 * and returns both.
 * @param {React.Component} inst Component instance
 * @param {Object} context Default context
 * @return {Array} Pair containing the rendered children and the child context
 */
function render(inst, context = {}) {
  return [inst.render(), inst.getChildContext ? inst.getChildContext() : context];
}

/**
 * Dispose of a given `React.Component` instance created using `create`.
 * It will call its `componentWillUnmount` lifecycle method, if present.
 * @param {React.Component} inst Instance to dipose of
 * @return {undefined}
 */
function dispose(inst) {
  if(inst.componentWillUnmount) {
    inst.componentWillUnmount();
  }
}

/**
 * Asynchronously satisfy the dependencies of a React.Element: if it decorated with {@preparable},
 * and otherwise immediatly resolves.
 * @param {React.Element} element Element whose deps must be satisfied
 * @param {Object?} context React Context in which to satisfy the deps
 * @return {Promise} Promise for the settlement of the elements' dependencies.
 */
async function satisfy(element, context) {
  const { type, props } = element;
  if(type[$prepare]) {
    await type[$prepare](props, context);
  }
}

/**
 * Asynchronously satisfies the own deps of an element (i.e. not including its children's).
 * This can induce side effects in the context, depending of the implementation of the `[$prepare]` method of this
 * element. Once the deps are satisfied, renders the children of this element and returns them (render can now safely be
 * called on the element since its own deps have been resolved).
 * @param {React.Element} element Element whose own deps will be satisfied and which will be rendered
 * @param {Object} context Context in which to apply side effects/render
 * @return {Promise} Promise for an Array containing the rendered children and the child rendering context.
 */
async function prepareElement(element, context) {
  // Plain value child element
  if(element === null || typeof element !== 'object') {
    return [null, context];
  }
  const { type, props } = element;
  // Native element
  if(typeof type === 'string') {
    return [props.children, context];
  }
  // Function component (new in react 0.14.x)
  if(!isExtensionOf(type, React.Component)) {
    return [type(props), context];
  }
  // Composite element
  await satisfy(element, context);
  let inst = null;
  try {
    inst = create(type, props, context);
    return render(inst, context);
  }
  finally {
    if(inst !== null) {
      dispose(inst);
    }
  }
}

/**
 * Asynchronously and recursively prepare a context for rendering an element.
 * Namely, it will recursively satisfy the deps of the element (which can induce
 * side-effects on the context, eg. populate Flux instances), then render its children.
 * When the returned promise resolves, React `render*` can safely be called and won't need
 * additional data.
 * @param {React.Element} element Element whose rendering will be prepared
 * @param {Object} context = {} Context in which to render/apply side effects
 * @return {Promise} Promise for a prepared react elements tree which will produce
 * the same output as the original tree when rendered as html by renderToString, but much faster.
 */
async function prepare(element, context = {}) {
  // When prepare is called with an array of elements, pass them through prepare to manage them individually.
  if(Array.isArray(element)) {
    return Promise.map(element, (children) => prepare(children, context));
  }
  // If the element is null or a primitive value, nothing special to do.
  if(element === null || typeof element !== 'object') {
    return element;
  }
  // Satisfy and then get the childrens of the element.
  const [children, childContext] = await prepareElement(element, context);
  // Recursively prepare the children.
  const preparedChildren = await prepare(children, childContext);
  // When the element is native,
  if(typeof element.type === 'string') {
    // prepare the new elements props, without the original element's children,
    const filteredProps = _.omit(element.props, 'children');
    // if the original element has children, add the prepared children to the new props.
    if(preparedChildren !== null) {
      Object.assign(filteredProps, { children: preparedChildren });
    }
    // Return a new native element, with the new prepared props.
    return React.createElement(element.type, filteredProps);
  }
  // If the element is not native but its child is null or false,
  // a dummy component element must replace it (for react-empty comment tags).
  if(preparedChildren === null || preparedChildren === false) {
    return NULL_CHILD_REACT_ELEMENT;
  }
  // For other cases, simply return the prepared children to skip a tree level.
  return preparedChildren;
}

export default prepare;
