'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createDecoratedClass = require('babel-runtime/helpers/create-decorated-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _Flux2 = require('./Flux');

var _Flux3 = _interopRequireDefault(_Flux2);

var _utilsTypes = require('../utils/types');

var __DEV__ = process.env.NODE_ENV === 'development';

var paramsType = _typecheckDecorator2['default'].String();

var LocalFlux = (function (_Flux) {
  _inherits(LocalFlux, _Flux);

  _createDecoratedClass(LocalFlux, null, [{
    key: 'unserialize',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].instanceOf(LocalFlux)), _typecheckDecorator.takes(_typecheckDecorator2['default'].shape({
      data: _typecheckDecorator2['default'].Object({ type: _utilsTypes.versions })
    }))],
    value: function unserialize(_ref) {
      var data = _ref.data;

      return new LocalFlux(data);
    }
  }, {
    key: 'keyFor',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].String()), _typecheckDecorator.takes(paramsType)],
    value: function keyFor(params) {
      return params;
    }
  }, {
    key: 'displayName',
    value: 'LocalFlux',
    enumerable: true
  }]);

  function LocalFlux() {
    var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, LocalFlux);

    _Flux.call(this);
    if (__DEV__) {
      _typecheckDecorator2['default'].Object({ type: _utilsTypes.versions })(data);
    }
    this.data = data;
    this.observers = {};
  }

  _createDecoratedClass(LocalFlux, [{
    key: 'serialize',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].shape({
      data: _typecheckDecorator2['default'].Object({ type: _utilsTypes.version })
    }))],
    value: function serialize() {
      var data = this.data;

      return { data: data };
    }
  }, {
    key: 'versions',
    decorators: [_typecheckDecorator.returns(_utilsTypes.versions), _typecheckDecorator.takes(paramsType)],
    value: function versions(params) {
      var key = this.constructor.keyFor(params);
      if (!_lodash2['default'].has(this.data, key)) {
        this.data[key] = [];
      }
      return this.data[key];
    }
  }, {
    key: 'pushVersion',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].instanceOf(LocalFlux)), _typecheckDecorator.takes(_typecheckDecorator2['default'].String(), _utilsTypes.version)],
    value: function pushVersion(key, _ref2) {
      var err = _ref2[0];
      var val = _ref2[1];

      var version = [err, val, new Date()];
      this.data[key] = (this.data[key] || []).concat([version]);
      if (_lodash2['default'].has(this.observers, key)) {
        _lodash2['default'].each(this.observers[key], function (fn) {
          return fn(version);
        });
      }
      return this;
    }
  }, {
    key: 'populate',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Promise()), _typecheckDecorator.takes(paramsType)],
    value: function populate() {
      return _Promise.resolve();
    }
  }, {
    key: 'get',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].shape({
      flux: _typecheckDecorator2['default'].instanceOf(LocalFlux),
      params: paramsType
    })), _typecheckDecorator.takes(_typecheckDecorator2['default'].String())],
    value: function get(path) {
      return {
        flux: this,
        params: path
      };
    }
  }, {
    key: 'observe',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Function()), _typecheckDecorator.takes(paramsType, _typecheckDecorator2['default'].Function())],
    value: function observe(params, fn) {
      var _this = this;

      var key = this.constructor.keyFor(params);
      if (!_lodash2['default'].has(this.observers, key)) {
        this.observers[key] = [];
      }
      this.observers[key].push(fn);
      _lodash2['default'].defer(function () {
        return _lodash2['default'].each(_this.versions(params), function (_ref3) {
          var err = _ref3[0];
          var val = _ref3[1];
          var date = _ref3[2];
          return fn([err, val, date]);
        });
      });
      return function () {
        _this.observers[key].splice(_this.observers[key].indexOf(fn), 1);
        if (_this.observers[key].length === 0) {
          delete _this.observers[key];
          delete _this.data[key];
        }
      };
    }
  }, {
    key: 'set',
    decorators: [_typecheckDecorator.takes(paramsType, _typecheckDecorator2['default'].any())],
    value: function set(params, val) {
      return this.pushVersion(params, [void 0, val]);
    }
  }]);

  return LocalFlux;
})(_Flux3['default']);

exports['default'] = LocalFlux;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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UUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFVBQUMsS0FBZ0I7Y0FBZixHQUFHLEdBQUosS0FBZ0I7Y0FBVixHQUFHLEdBQVQsS0FBZ0I7Y0FBTCxJQUFJLEdBQWYsS0FBZ0I7aUJBQUssRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUFBLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDekYsYUFBTyxZQUFNO0FBQ1gsY0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvRCxZQUFHLE1BQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDbkMsaUJBQU8sTUFBSyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsaUJBQU8sTUFBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkI7T0FDRixDQUFDO0tBQ0g7OztpQkFFQSwwQkFBUyxVQUFVLEVBQUUsZ0NBQUUsR0FBRyxFQUFFLENBQUM7V0FDM0IsYUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ2YsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDaEQ7OztTQTlGRyxTQUFTOzs7cUJBaUdBLFNBQVMiLCJmaWxlIjoiZmx1eGVzL0xvY2FsRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBULCB7IHRha2VzIGFzIGRldlRha2VzLCByZXR1cm5zIGFzIGRldlJldHVybnMgfSBmcm9tICd0eXBlY2hlY2stZGVjb3JhdG9yJztcclxuY29uc3QgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxuaW1wb3J0IEZsdXggZnJvbSAnLi9GbHV4JztcclxuaW1wb3J0IHsgdmVyc2lvbiBhcyB2ZXJzaW9uVHlwZSwgdmVyc2lvbnMgYXMgdmVyc2lvbnNUeXBlIH0gZnJvbSAnLi4vdXRpbHMvdHlwZXMnO1xyXG5cclxuY29uc3QgcGFyYW1zVHlwZSA9IFQuU3RyaW5nKCk7XHJcblxyXG5jbGFzcyBMb2NhbEZsdXggZXh0ZW5kcyBGbHV4IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnTG9jYWxGbHV4JztcclxuXHJcbiAgQGRldlRha2VzKFQuc2hhcGUoe1xyXG4gICAgZGF0YTogVC5PYmplY3QoeyB0eXBlOiB2ZXJzaW9uc1R5cGUgfSksXHJcbiAgfSkpXHJcbiAgQGRldlJldHVybnMoVC5pbnN0YW5jZU9mKExvY2FsRmx1eCkpXHJcbiAgc3RhdGljIHVuc2VyaWFsaXplKHsgZGF0YSB9KSB7XHJcbiAgICByZXR1cm4gbmV3IExvY2FsRmx1eChkYXRhKTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhwYXJhbXNUeXBlKVxyXG4gIEBkZXZSZXR1cm5zKFQuU3RyaW5nKCkpXHJcbiAgc3RhdGljIGtleUZvcihwYXJhbXMpIHtcclxuICAgIHJldHVybiBwYXJhbXM7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihkYXRhID0ge30pIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIFQuT2JqZWN0KHsgdHlwZTogdmVyc2lvbnNUeXBlIH0pKGRhdGEpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMub2JzZXJ2ZXJzID0ge307XHJcbiAgfVxyXG5cclxuICBAZGV2UmV0dXJucyhULnNoYXBlKHtcclxuICAgIGRhdGE6IFQuT2JqZWN0KHsgdHlwZTogdmVyc2lvblR5cGUgfSksXHJcbiAgfSkpXHJcbiAgc2VyaWFsaXplKCkge1xyXG4gICAgY29uc3QgeyBkYXRhIH0gPSB0aGlzO1xyXG4gICAgcmV0dXJuIHsgZGF0YSB9O1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1R5cGUpXHJcbiAgQGRldlJldHVybnModmVyc2lvbnNUeXBlKVxyXG4gIHZlcnNpb25zKHBhcmFtcykge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5rZXlGb3IocGFyYW1zKTtcclxuICAgIGlmKCFfLmhhcyh0aGlzLmRhdGEsIGtleSkpIHtcclxuICAgICAgdGhpcy5kYXRhW2tleV0gPSBbXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmRhdGFba2V5XTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhULlN0cmluZygpLCB2ZXJzaW9uVHlwZSlcclxuICBAZGV2UmV0dXJucyhULmluc3RhbmNlT2YoTG9jYWxGbHV4KSlcclxuICBwdXNoVmVyc2lvbihrZXksIFtlcnIsIHZhbF0pIHtcclxuICAgIGNvbnN0IHZlcnNpb24gPSBbZXJyLCB2YWwsIG5ldyBEYXRlKCldO1xyXG4gICAgdGhpcy5kYXRhW2tleV0gPSAodGhpcy5kYXRhW2tleV0gfHwgW10pLmNvbmNhdChbdmVyc2lvbl0pO1xyXG4gICAgaWYoXy5oYXModGhpcy5vYnNlcnZlcnMsIGtleSkpIHtcclxuICAgICAgXy5lYWNoKHRoaXMub2JzZXJ2ZXJzW2tleV0sIChmbikgPT4gZm4odmVyc2lvbikpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMocGFyYW1zVHlwZSlcclxuICBAZGV2UmV0dXJucyhULlByb21pc2UoKSlcclxuICBwb3B1bGF0ZSgpIHtcclxuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhULlN0cmluZygpKVxyXG4gIEBkZXZSZXR1cm5zKFQuc2hhcGUoe1xyXG4gICAgZmx1eDogVC5pbnN0YW5jZU9mKExvY2FsRmx1eCksXHJcbiAgICBwYXJhbXM6IHBhcmFtc1R5cGUsXHJcbiAgfSkpXHJcbiAgZ2V0KHBhdGgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZsdXg6IHRoaXMsXHJcbiAgICAgIHBhcmFtczogcGF0aCxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMocGFyYW1zVHlwZSwgVC5GdW5jdGlvbigpKVxyXG4gIEBkZXZSZXR1cm5zKFQuRnVuY3Rpb24oKSlcclxuICBvYnNlcnZlKHBhcmFtcywgZm4pIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuY29uc3RydWN0b3Iua2V5Rm9yKHBhcmFtcyk7XHJcbiAgICBpZighXy5oYXModGhpcy5vYnNlcnZlcnMsIGtleSkpIHtcclxuICAgICAgdGhpcy5vYnNlcnZlcnNba2V5XSA9IFtdO1xyXG4gICAgfVxyXG4gICAgdGhpcy5vYnNlcnZlcnNba2V5XS5wdXNoKGZuKTtcclxuICAgIF8uZGVmZXIoKCkgPT4gXy5lYWNoKHRoaXMudmVyc2lvbnMocGFyYW1zKSwgKFtlcnIsIHZhbCwgZGF0ZV0pID0+IGZuKFtlcnIsIHZhbCwgZGF0ZV0pKSk7XHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICB0aGlzLm9ic2VydmVyc1trZXldLnNwbGljZSh0aGlzLm9ic2VydmVyc1trZXldLmluZGV4T2YoZm4pLCAxKTtcclxuICAgICAgaWYodGhpcy5vYnNlcnZlcnNba2V5XS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlcnNba2V5XTtcclxuICAgICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV07XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMocGFyYW1zVHlwZSwgVC5hbnkoKSlcclxuICBzZXQocGFyYW1zLCB2YWwpIHtcclxuICAgIHJldHVybiB0aGlzLnB1c2hWZXJzaW9uKHBhcmFtcywgW3ZvaWQgMCwgdmFsXSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMb2NhbEZsdXg7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
