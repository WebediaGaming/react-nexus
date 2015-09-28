import _ from 'lodash';
import Promise from 'bluebird';
import React from 'react';

import isExtensionOf from './utils/isExtensionOf';
import Injector from './components/Injector';
import MultiInjector from './components/MultiInjector';

function flattenChildren(children, acc = []) {
  React.Children.forEach(children, (element) => {
    acc.push(element);
    if(typeof element === 'object' && element.props && element.props.children) {
      return flattenChildren(element.props.children);
    }
  });
  return acc;
}

function create(Component, props, context) {
  const inst = new Component(props, context);
  if(inst.componentWillMount) {
    inst.componentWillMount();
  }
  return inst;
}

function render(inst, context) {
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
    // There is a caveat here: an elements' context should be its parents', not itw owners'.
    return Promise.all(_.map(flattenChildren(childrenElements), (descendantElement) =>
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
