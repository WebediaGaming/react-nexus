import _ from 'lodash';
import Promise from 'bluebird';
import React from 'react';

import isExtensionOf from './util/isExtensionOf';
import preparable from './preparable';
const { $preparable } = preparable;

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
 * @param {Object?} context React Context in which to satisfy the deps
 * @return {Promise} Promise for the settlement of the elements' dependencies.
 */
function satisfy(element, context) {
  const { type, props } = element;
  if(type[$preparable]) {
    return type[$preparable](props, context);
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
 * @return {Promise} Promise for the childContext of the rendered tree
 */
function prepare(element, context = {}) {
  return Promise.try(() => {
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
    let inst = null;
    return satisfy(element, context)
    .then(() => {
      inst = create(type, props, context);
      return render(inst, context);
    })
    .catch((err) => {
      if(inst !== null) {
        dispose(inst);
      }
      throw err;
    });
  })
  .then(([children, childContext]) =>
    Promise.all(_.values(React.Children.map(children, (child) => prepare(child, childContext))))
    .then(() => childContext)
  );
}

export default prepare;
