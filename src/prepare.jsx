import _ from 'lodash';
import Promise from 'bluebird';
import React from 'react';

import isExtensionOf from './utils/isExtensionOf';
import Injector from './components/Injector';
import MultiInjector from './components/MultiInjector';

/**
 * Recursively flattens a React.Children hierarchy tree into a React.Element Array.
 * @param  {React.Children} children Hierarchy roots
 * @param  {Array<React.Element>} [acc=[]] Accumulator in which to push new elements
 * @return {Array<React.Element>} Flattened hierarchy
 */
function flattenChildren(children, acc = []) {
  React.Children.forEach(children, (element) => {
    acc.push(element);
    if(typeof element === 'object' && element.props && element.props.children) {
      return flattenChildren(element.props.children);
    }
  });
  return acc;
}

/**
 * Given a React.Component class, its props, and a context, create a new React.Component
 * instance and apply its componentWillMount method, if present.
 * @param  {Function} Component Component class to instanciate
 * @param  {Object} [props={}] props for the instance
 * @param  {Object} [context={}] context for the instance
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
 * Given a React.Component instance and a context, returns a pair containing:
 * - The React.Children resulting from rendering it,
 * - The child context to be passed to its descendants.
 * @param  {React.Component} inst Component instance
 * @param  {Object} context context
 * @return {Array} Pair containing the rendered children and the child context
 */
function render(inst, context = {}) {
  return [inst.render(), inst.getChildContext ? inst.getChildContext() : context];
}

function dispose(inst) {
  if(inst.componentWillUnmount) {
    inst.componentWillUnmount();
  }
  return inst;
}

function populate(deps) {
  return Promise.all(_.map(deps, ({ flux, params }) => flux.populate(params)));
}

function satisfy({ props, type }) {
  if(isExtensionOf(type, Injector)) {
    return populate([props]);
  }
  if(isExtensionOf(type, MultiInjector)) {
    return populate(_.values(MultiInjector.destructureProps(props).bindings));
  }
  return populate([]);
}

function prepare(element, context = {}) {
  if(typeof element !== 'object') {
    return Promise.resolve();
  }
  const { type, props } = element;
  if(typeof type === 'string') {
    return Promise.resolve();
  }

  return satisfy(element)
  .then(() => {
    const inst = create(type, props, context);
    const [childrenElements, childContext] = render(inst, context);
    return Promise.all(_.map(flattenChildren(childrenElements), (descendantElement) =>
      // There is a caveat here: an elements' context should be its parents', not its owners'.
      // See https://github.com/facebook/react/issues/2112
      prepare(descendantElement, childContext)
    ))
    .catch((err) => {
      dispose(err);
      throw err;
    })
    .then((...args) => {
      dispose(inst);
      return args;
    });
  });
}

export default prepare;
