module.exports = function(R) {
  const _ = R._;
  const should = R.should;
  const React = R.React;

  class $ {
    constructor(component) {
      this._subject = component;
    }

    get() {
      return this._subject;
    }

    type(optType) {
      if(optType) {
        this._subject = optType(this._subject.props);
        return this;
      }
      else {
        return this._subject.type;
      }
    }

    prop(key, optVal) {
      if(optVal) {
        this._subject = this._subject.type(this._subject.props);
        this._subject.props[key] = optVal;
        return this;
      }
      else {
        return this._subject.props[key];
      }
    }

    props(arg) {
      if(_.isArray(arg)) {
        return _.object(arg.map((val, key) => [key, this._subject.props[key]]));
      }
      else {
        this._subject = this._subject.type(this._subject.props);
        arg.forEach((val, key) => this._subject.props[key] = val);
        return this;
      }
    }

    classNameList(optVal) {
      if(optVal) {
        return this.prop('className', optVal.join(' '));
      }
      else {
        return (this.prop('className') || '').split(' ');
      }
    }

    addClassName(className) {
      let cx = this.classNameList();
      cx.push(className);
      return this.prop('className', _.uniq(cx));
    }

    removeClassName(className) {
      let cx = this.classNameList();
      cx = _.without(cx, className);
      return this.prop('className', cx);
    }

    hasClassName(className) {
      let cx = this.classNameList();
      return _.contains(cx, className);
    }

    toggleClassName(className, optVal) {
      if(!_.isUndefined(optVal)) {
        if(optVal) {
          return this.addClassName(className);
        }
        else {
          return this.removeClassName(className);
        }
      }
      else {
        return this.toggleClassName(className, !this.hasClassName(className));
      }
    }

    append(component) {
      let children = ReactChildren.getChildrenList(this._subject);
      children.push(component);
      return this.prop('children', children);
    }

    prepend(component) {
      let children = ReactChildren.getChildrenList(this._subject);
      children.unshift(component);
      return this.prop('children', children);
    }

    transformTree(fn) {
      this._subject = ReactChildren.transformTree(this._subject, fn);
      return this;
    }

    tap(fn) {
      fn(this._subject);
      return this;
    }

    walkTree(fn) {
      let tree = ReactChildren.mapTree(this._subject, _.identity);
      tree.forEach(fn);
      return this;
    }

    endend() {
      let _subject = this._subject;
      this._subject = null;
      return _subject;
    }
  }

  _.extend($.prototype, /** @lends $.prototype */{
    _subject: null,
  });

  return $;
};
