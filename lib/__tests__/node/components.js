import PropTypes from 'prop-types';
import React, { Component } from 'react';
import stores from '../../stores';
import Store from '../../Store';
import MemoryStore from '../../MemoryStore';
import Flux from '../../Flux';
import root from '../../root';
import { mount } from 'enzyme';
import should from 'should/as-function';

const { describe, it } = global;

describe('stores', () => {
  it('should set state to undefined when binding is removed', () => {
    const fooStore = new MemoryStore('/foo').set({}, 'foo');
    const flux = Flux.create({
      stores: [fooStore],
    });
    class Bar extends Component {
      static displayName = 'Bar';
      static propTypes = {
        foo: Store.State.propType(PropTypes.string),
      };
      render() {
        const { foo } = this.props;
        if(foo === void 0) {
          return <span>{'foo is undefined'}</span>;
        }
        return <span>{'foo is not undefined'}</span>;
      }
    }
    const DecoratedBar = root()(
      stores(({ bindFoo }) => {
        if(bindFoo) {
          return { foo: '/foo' };
        }
        return {};
      })(Bar)
    );
    const mounted = mount(<DecoratedBar bindFoo flux={flux} />);
    should(mounted.html()).be.exactly('<span>foo is not undefined</span>');
    mounted.setProps({ bindFoo: false });
    should(mounted.html()).be.exactly('<span>foo is undefined</span>');
  });
});
