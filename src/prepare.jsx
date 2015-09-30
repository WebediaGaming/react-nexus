import _ from 'lodash';
import Promise from 'bluebird';
import React from 'react';

import { $prepare } from './decorators/preparable';

/**
 * Recursively flattens a React.Children hierarchy tree into a `React.Element` array.
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
 * Create a new `React.Component` instance on which {render} can then be called.
 * Should be disposed of using {dispose}.
 * It will apply the instances' `componentWillMount` lifecycle  method, if present.
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
 * Renders a given `React.Component` instance previously created by `create`, computes its child context,
 * and returns both.
 * @param  {React.Component} inst Component instance
 * @param  {Object} context Default context
 * @return {Array} Pair containing the rendered children and the child context
 */
function render(inst, context = {}) {
  return [inst.render(), inst.getChildContext ? inst.getChildContext() : context];
}

/**
 * Dispose of a given `React.Component` instance created using `create`.
 * It will call its `componentWillUnmount` lifecycle method, if present.
 * @param  {React.Component} inst Instance to dipose of
 * @returns {undefined}
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
 * @return {Promise} Promise for the settlement of the elements' dependencies.
 */
function satisfy({ props, type }) {
  if(type[$prepare]) {
    return type[$prepare](props);
  }
  return Promise.resolve();
}

/**
 * Asynchronously and recursively prepare a context for rendering element.
 * Namely, it will recursively satisfy the deps of the element (which can induce
 * side-effects on the context, eg. populate Flux instances), then render its children.
 * One the returned promise resolves, React `render*` can safely be called and won't need
 * additional data.
 * @param {React.Element} element Element whose rendering will be prepared
 * @param {Object} context = {} Context in which to render/apply side effects
 * @return {Promise} Promise for the settlement of the preparation
 */
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
