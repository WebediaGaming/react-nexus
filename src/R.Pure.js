module.exports = function(R) {
  const _ = R._;

  function shouldComponentUpdate(props, state) {
    return !(_.isEqual(this.props, props) && _.isEqual(this.state, state));
  }

  const Pure = {
    shouldComponentUpdate,

    Mixin: {
      _PureMixin: true,
      shouldComponentUpdate,
    },
  };

  return Pure;
};
