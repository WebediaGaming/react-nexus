'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createDecoratedClass = require('babel-runtime/helpers/create-decorated-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _2 = require('../../..');

var __DEV__ = process.env.NODE_ENV === 'development';

var optNumber = _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].Number());

var valueShape = _typecheckDecorator2['default'].shape([_typecheckDecorator2['default'].option(_typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].instanceOf(Error), _typecheckDecorator2['default'].String())), _typecheckDecorator2['default'].any(), _typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].instanceOf(Date), _typecheckDecorator2['default'].String())]);
var valuesType = _typecheckDecorator2['default'].Array(valueShape);

var optionsShape = _typecheckDecorator2['default'].shape({
  maxRequestDuration: optNumber,
  maxAgents: optNumber
});
var defaultOptions = {
  maxRequestDuration: 30000,
  maxAgents: 1000
};

var paramsShape = _typecheckDecorator2['default'].shape({
  path: _typecheckDecorator2['default'].String(),
  query: _typecheckDecorator2['default'].Object(),
  refreshEvery: optNumber
});
var defaultParams = {
  refreshEvery: null,
  authToken: null
};

var HTTPFlux = (function (_Flux) {
  _inherits(HTTPFlux, _Flux);

  _createDecoratedClass(HTTPFlux, null, [{
    key: 'unserialize',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].instanceOf(HTTPFlux)), _typecheckDecorator.takes(_typecheckDecorator2['default'].shape({
      baseUrl: _typecheckDecorator2['default'].String(),
      options: optionsShape,
      data: _typecheckDecorator2['default'].Object(valuesType)
    }))],
    value: function unserialize(_ref) {
      var baseUrl = _ref.baseUrl;
      var options = _ref.options;
      var data = _ref.data;

      return new HTTPFlux(baseUrl, options, data);
    }
  }, {
    key: 'keyFor',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].String()), _typecheckDecorator.takes(paramsShape)],
    value: function keyFor(params) {
      return JSON.stringify(params);
    }
  }, {
    key: 'displayName',
    value: 'HTTPFlux',
    enumerable: true
  }]);

  function HTTPFlux(baseUrl, options, data) {
    _classCallCheck(this, HTTPFlux);

    _Flux.call(this);
    if (__DEV__) {
      _typecheckDecorator2['default'].String()(baseUrl);
      optionsShape(options);
      _typecheckDecorator2['default'].Object(valuesType)(data);
    }
    this.originalOptions = options;
    this.options = _lodash2['default'].defaults({}, options, defaultOptions);
    this.baseUrl = baseUrl;
    this.data = data;
    this.promises = _lodash2['default'].mapValues(data, function (_ref2) {
      var err = _ref2[0];
      var res = _ref2[1];
      return _bluebird2['default'].resolve([err, res]);
    });
    this.observers = {};
    this.refreshers = {};
  }

  _createDecoratedClass(HTTPFlux, [{
    key: 'serialize',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].shape({
      baseUrl: _typecheckDecorator2['default'].String(),
      options: optionsShape,
      data: _typecheckDecorator2['default'].Object(valuesType)
    }))],
    value: function serialize() {
      return {
        baseUrl: this.baseUrl,
        options: this.originalOptions,
        data: this.data
      };
    }
  }, {
    key: 'pushValue',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].instanceOf(HTTPFlux)), _typecheckDecorator.takes(_typecheckDecorator2['default'].String(), valueShape)],
    value: function pushValue(params, _ref3) {
      var err = _ref3[0];
      var res = _ref3[1];

      var key = this.constructor.keyFor(params);
      var value = [err, res, new Date()];
      this.data[key] = (this.data[key] || []).concat(value);
      if (_lodash2['default'].has(this.observers, key)) {
        _lodash2['default'].each(this.observers[key], function (fn) {
          return fn(value);
        });
      }
      return this;
    }
  }, {
    key: 'get',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].shape({
      flux: _typecheckDecorator2['default'].instanceOf(HTTPFlux),
      params: paramsShape
    })), _typecheckDecorator.takes(_typecheckDecorator2['default'].String(), paramsShape)],
    value: function get(path) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return {
        flux: this,
        params: _Object$assign({}, _lodash2['default'].defaults({}, params, defaultParams), { path: path })
      };
    }
  }, {
    key: 'values',
    decorators: [_typecheckDecorator.returns(valuesType), _typecheckDecorator.takes(paramsShape)],
    value: function values(params) {
      var key = this.constructor.keyFor(params);
      if (__DEV__) {
        _shouldAsFunction2['default'](this.data).have.property(key);
      }
      return this.data[key];
    }
  }, {
    key: 'request',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Promise()), _typecheckDecorator.takes(_typecheckDecorator2['default'].String(), _typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].exactly('get'), _typecheckDecorator2['default'].exactly('post')), _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].Object()))],
    value: function request(path, method) {
      var _this = this;

      var opts = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

      var req = undefined;
      return new _bluebird2['default'](function (resolve, reject) {
        req = _superagent2['default'][method](_url2['default'].resolve(_this.baseUrl, path)).accept('json').timeout(_this.options.maxRequestDuration);
        if (opts.query) {
          req = req.query(opts.query);
        }
        if (opts.body) {
          req = req.send(opts.body);
        }
        req.end(function (err, res) {
          if (err) {
            return reject(err);
          }
          return resolve(res.body);
        });
      }).cancellable()['catch'](_bluebird2['default'].CancellationError, function (err) {
        req.abort();
        throw err;
      }).then(function (res) {
        return [void 0, res];
      })['catch'](function (err) {
        return [err.toString(), void 0];
      });
    }
  }, {
    key: 'populate',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Promise()), _typecheckDecorator.takes(paramsShape)],
    value: function populate(params) {
      var _this2 = this;

      var key = this.constructor.keyFor(params);
      var path = params.path;
      var query = params.query;

      if (!_lodash2['default'].has(this.promises, key)) {
        this.promises[key] = this.fetch(path, 'get', { query: query }).then(function (_ref4) {
          var err = _ref4[0];
          var res = _ref4[1];
          return _this2.pushValue(key, [err, res]);
        });
      }
      return this.promises[key];
    }
  }, {
    key: 'post',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Promise()), _typecheckDecorator.takes(_typecheckDecorator2['default'].shape({
      path: _typecheckDecorator2['default'].String(),
      query: _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].any()),
      body: _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].any())
    }))],
    value: function post(_ref5) {
      var path = _ref5.path;
      var query = _ref5.query;
      var body = _ref5.body;

      return this.fetch(path, 'post', { query: query, body: body }).then(function (_ref6) {
        var err = _ref6[1];
        var res = _ref6[2];

        if (err) {
          throw err;
        }
        return res.body;
      });
    }
  }, {
    key: 'observe',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Function()), _typecheckDecorator.takes(paramsShape, _typecheckDecorator2['default'].Function())],
    value: function observe(params, fn) {
      var _this3 = this;

      var key = this.constructor.keyFor(params);
      if (!_lodash2['default'].has(this.observers, key)) {
        (function () {
          _this3.observers[key] = [];
          var path = params.path;
          var query = params.query;
          var refreshEvery = params.refreshEvery;

          if (refreshEvery) {
            _this3.refreshers[key] = setInterval(function () {
              return _this3.fetch(path, 'get', { query: query }).then(function (_ref7) {
                var err = _ref7[0];
                var res = _ref7[1];
                return _this3.pushValue(key, [err, res]);
              });
            }, refreshEvery);
          }
        })();
      }
      this.observers[key].push(fn);
      if (this.promises[key]) {
        _lodash2['default'].defer(function () {
          return _lodash2['default'].each(_this3.data[key], function (_ref8) {
            var err = _ref8[0];
            var res = _ref8[1];
            return fn([err, res]);
          });
        });
      } else {
        this.populate(params);
      }
      return function () {
        _this3.observers[key].splice(_this3.observers[key].indexOf(fn), 1);
        if (_this3.observers[key].length === 0) {
          if (_lodash2['default'].has(_this3.refreshers, key)) {
            clearInterval(_this3.refreshers[key]);
            delete _this3.refreshers[key];
          }
          delete _this3.observers[key];
          delete _this3.data[key];
          delete _this3.promises[key];
        }
      };
    }
  }]);

  return HTTPFlux;
})(_2.Flux);

exports['default'] = HTTPFlux;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9mbHV4ZXMvSFRUUEZsdXguanN4Il0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUFjLFFBQVE7Ozs7Z0NBQ0gsb0JBQW9COzs7OzBCQUNoQixZQUFZOzs7O21CQUNuQixLQUFLOzs7O3dCQUNELFVBQVU7Ozs7a0NBQzhCLHFCQUFxQjs7OztpQkFFNUQsVUFBVTs7QUFFL0IsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssYUFBYSxDQUFDOztBQUV2RCxJQUFNLFNBQVMsR0FBRyxnQ0FBRSxNQUFNLENBQUMsZ0NBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzs7QUFFdkMsSUFBTSxVQUFVLEdBQUcsZ0NBQUUsS0FBSyxDQUFDLENBQ3pCLGdDQUFFLE1BQU0sQ0FBQyxnQ0FBRSxLQUFLLENBQUMsZ0NBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLGdDQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFDbEQsZ0NBQUUsR0FBRyxFQUFFLEVBQ1AsZ0NBQUUsS0FBSyxDQUFDLGdDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxnQ0FBRSxNQUFNLEVBQUUsQ0FBQyxDQUN4QyxDQUFDLENBQUM7QUFDSCxJQUFNLFVBQVUsR0FBRyxnQ0FBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXZDLElBQU0sWUFBWSxHQUFHLGdDQUFFLEtBQUssQ0FBQztBQUMzQixvQkFBa0IsRUFBRSxTQUFTO0FBQzdCLFdBQVMsRUFBRSxTQUFTO0NBQ3JCLENBQUMsQ0FBQztBQUNILElBQU0sY0FBYyxHQUFHO0FBQ3JCLG9CQUFrQixFQUFFLEtBQUs7QUFDekIsV0FBUyxFQUFFLElBQUk7Q0FDaEIsQ0FBQzs7QUFFRixJQUFNLFdBQVcsR0FBRyxnQ0FBRSxLQUFLLENBQUM7QUFDMUIsTUFBSSxFQUFFLGdDQUFFLE1BQU0sRUFBRTtBQUNoQixPQUFLLEVBQUUsZ0NBQUUsTUFBTSxFQUFF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QUFDLENBQUMsTUFBTSxDQUFDLE9BQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUMvRCxZQUFHLE9BQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7QUFDbkMsY0FBRyxvQkFBRSxHQUFHLENBQUMsT0FBSyxVQUFVLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDOUIseUJBQWEsQ0FBQyxPQUFLLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ3BDLG1CQUFPLE9BQUssVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1dBQzdCO0FBQ0QsaUJBQU8sT0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDM0IsaUJBQU8sT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdEIsaUJBQU8sT0FBSyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDM0I7T0FDRixDQUFDO0tBQ0g7OztTQWpMRyxRQUFROzs7cUJBb0xDLFFBQVEiLCJmaWxlIjoiX190ZXN0c19fL2ZpeHR1cmVzL2ZsdXhlcy9IVFRQRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgc2hvdWxkIGZyb20gJ3Nob3VsZC9hcy1mdW5jdGlvbic7XG5pbXBvcnQgc3VwZXJhZ2VudCBmcm9tICdzdXBlcmFnZW50JztcbmltcG9ydCB1cmwgZnJvbSAndXJsJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBULCB7IHRha2VzIGFzIGRldlRha2VzLCByZXR1cm5zIGFzIGRldlJldHVybnMgfSBmcm9tICd0eXBlY2hlY2stZGVjb3JhdG9yJztcblxuaW1wb3J0IHsgRmx1eCB9IGZyb20gJy4uLy4uLy4uJztcblxuY29uc3QgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxuY29uc3Qgb3B0TnVtYmVyID0gVC5vcHRpb24oVC5OdW1iZXIoKSk7XHJcblxyXG5jb25zdCB2YWx1ZVNoYXBlID0gVC5zaGFwZShbXHJcbiAgVC5vcHRpb24oVC5vbmVPZihULmluc3RhbmNlT2YoRXJyb3IpLCBULlN0cmluZygpKSksXHJcbiAgVC5hbnkoKSxcclxuICBULm9uZU9mKFQuaW5zdGFuY2VPZihEYXRlKSwgVC5TdHJpbmcoKSksXHJcbl0pO1xyXG5jb25zdCB2YWx1ZXNUeXBlID0gVC5BcnJheSh2YWx1ZVNoYXBlKTtcclxuXHJcbmNvbnN0IG9wdGlvbnNTaGFwZSA9IFQuc2hhcGUoe1xyXG4gIG1heFJlcXVlc3REdXJhdGlvbjogb3B0TnVtYmVyLFxyXG4gIG1heEFnZW50czogb3B0TnVtYmVyLFxyXG59KTtcclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgbWF4UmVxdWVzdER1cmF0aW9uOiAzMDAwMCxcclxuICBtYXhBZ2VudHM6IDEwMDAsXHJcbn07XHJcblxyXG5jb25zdCBwYXJhbXNTaGFwZSA9IFQuc2hhcGUoe1xyXG4gIHBhdGg6IFQuU3RyaW5nKCksXHJcbiAgcXVlcnk6IFQuT2JqZWN0KCksXHJcbiAgcmVmcmVzaEV2ZXJ5OiBvcHROdW1iZXIsXHJcbn0pO1xyXG5jb25zdCBkZWZhdWx0UGFyYW1zID0ge1xyXG4gIHJlZnJlc2hFdmVyeTogbnVsbCxcclxuICBhdXRoVG9rZW46IG51bGwsXHJcbn07XHJcblxyXG5jbGFzcyBIVFRQRmx1eCBleHRlbmRzIEZsdXgge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdIVFRQRmx1eCc7XHJcblxyXG4gIEBkZXZUYWtlcyhULnNoYXBlKHtcclxuICAgIGJhc2VVcmw6IFQuU3RyaW5nKCksXHJcbiAgICBvcHRpb25zOiBvcHRpb25zU2hhcGUsXHJcbiAgICBkYXRhOiBULk9iamVjdCh2YWx1ZXNUeXBlKSxcclxuICB9KSlcclxuICBAZGV2UmV0dXJucyhULmluc3RhbmNlT2YoSFRUUEZsdXgpKVxyXG4gIHN0YXRpYyB1bnNlcmlhbGl6ZSh7IGJhc2VVcmwsIG9wdGlvbnMsIGRhdGEgfSkge1xyXG4gICAgcmV0dXJuIG5ldyBIVFRQRmx1eChiYXNlVXJsLCBvcHRpb25zLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhwYXJhbXNTaGFwZSlcclxuICBAZGV2UmV0dXJucyhULlN0cmluZygpKVxyXG4gIHN0YXRpYyBrZXlGb3IocGFyYW1zKSB7XHJcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocGFyYW1zKTtcclxuICB9XHJcblxyXG4gIGNvbnN0cnVjdG9yKGJhc2VVcmwsIG9wdGlvbnMsIGRhdGEpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIFQuU3RyaW5nKCkoYmFzZVVybCk7XHJcbiAgICAgIG9wdGlvbnNTaGFwZShvcHRpb25zKTtcclxuICAgICAgVC5PYmplY3QodmFsdWVzVHlwZSkoZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9yaWdpbmFsT3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBfLmRlZmF1bHRzKHt9LCBvcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XHJcbiAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsO1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMucHJvbWlzZXMgPSBfLm1hcFZhbHVlcyhkYXRhLCAoW2VyciwgcmVzXSkgPT4gUHJvbWlzZS5yZXNvbHZlKFtlcnIsIHJlc10pKTtcclxuICAgIHRoaXMub2JzZXJ2ZXJzID0ge307XHJcbiAgICB0aGlzLnJlZnJlc2hlcnMgPSB7fTtcclxuICB9XHJcblxyXG4gIEBkZXZSZXR1cm5zKFQuc2hhcGUoe1xyXG4gICAgYmFzZVVybDogVC5TdHJpbmcoKSxcclxuICAgIG9wdGlvbnM6IG9wdGlvbnNTaGFwZSxcclxuICAgIGRhdGE6IFQuT2JqZWN0KHZhbHVlc1R5cGUpLFxyXG4gIH0pKVxyXG4gIHNlcmlhbGl6ZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGJhc2VVcmw6IHRoaXMuYmFzZVVybCxcclxuICAgICAgb3B0aW9uczogdGhpcy5vcmlnaW5hbE9wdGlvbnMsXHJcbiAgICAgIGRhdGE6IHRoaXMuZGF0YSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMoVC5TdHJpbmcoKSwgdmFsdWVTaGFwZSlcclxuICBAZGV2UmV0dXJucyhULmluc3RhbmNlT2YoSFRUUEZsdXgpKVxyXG4gIHB1c2hWYWx1ZShwYXJhbXMsIFtlcnIsIHJlc10pIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuY29uc3RydWN0b3Iua2V5Rm9yKHBhcmFtcyk7XHJcbiAgICBjb25zdCB2YWx1ZSA9IFtlcnIsIHJlcywgbmV3IERhdGUoKV07XHJcbiAgICB0aGlzLmRhdGFba2V5XSA9ICh0aGlzLmRhdGFba2V5XSB8fCBbXSkuY29uY2F0KHZhbHVlKTtcclxuICAgIGlmKF8uaGFzKHRoaXMub2JzZXJ2ZXJzLCBrZXkpKSB7XHJcbiAgICAgIF8uZWFjaCh0aGlzLm9ic2VydmVyc1trZXldLCAoZm4pID0+IGZuKHZhbHVlKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhULlN0cmluZygpLCBwYXJhbXNTaGFwZSlcclxuICBAZGV2UmV0dXJucyhULnNoYXBlKHtcclxuICAgIGZsdXg6IFQuaW5zdGFuY2VPZihIVFRQRmx1eCksXHJcbiAgICBwYXJhbXM6IHBhcmFtc1NoYXBlLFxyXG4gIH0pKVxyXG4gIGdldChwYXRoLCBwYXJhbXMgPSB7fSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZmx1eDogdGhpcyxcclxuICAgICAgcGFyYW1zOiBPYmplY3QuYXNzaWduKHt9LCBfLmRlZmF1bHRzKHt9LCBwYXJhbXMsIGRlZmF1bHRQYXJhbXMpLCB7IHBhdGggfSksXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1NoYXBlKVxyXG4gIEBkZXZSZXR1cm5zKHZhbHVlc1R5cGUpXHJcbiAgdmFsdWVzKHBhcmFtcykge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5rZXlGb3IocGFyYW1zKTtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgc2hvdWxkKHRoaXMuZGF0YSkuaGF2ZS5wcm9wZXJ0eShrZXkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuZGF0YVtrZXldO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFxyXG4gICAgVC5TdHJpbmcoKSxcclxuICAgIFQub25lT2YoVC5leGFjdGx5KCdnZXQnKSwgVC5leGFjdGx5KCdwb3N0JykpLFxyXG4gICAgVC5vcHRpb24oVC5PYmplY3QoKSlcclxuICApXHJcbiAgQGRldlJldHVybnMoVC5Qcm9taXNlKCkpXHJcbiAgcmVxdWVzdChwYXRoLCBtZXRob2QsIG9wdHMgPSB7fSkge1xyXG4gICAgbGV0IHJlcTtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHJlcSA9IHN1cGVyYWdlbnRbbWV0aG9kXSh1cmwucmVzb2x2ZSh0aGlzLmJhc2VVcmwsIHBhdGgpKVxyXG4gICAgICAgIC5hY2NlcHQoJ2pzb24nKVxyXG4gICAgICAgIC50aW1lb3V0KHRoaXMub3B0aW9ucy5tYXhSZXF1ZXN0RHVyYXRpb24pO1xyXG4gICAgICBpZihvcHRzLnF1ZXJ5KSB7XHJcbiAgICAgICAgcmVxID0gcmVxLnF1ZXJ5KG9wdHMucXVlcnkpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmKG9wdHMuYm9keSkge1xyXG4gICAgICAgIHJlcSA9IHJlcS5zZW5kKG9wdHMuYm9keSk7XHJcbiAgICAgIH1cclxuICAgICAgcmVxLmVuZCgoZXJyLCByZXMpID0+IHtcclxuICAgICAgICBpZihlcnIpIHtcclxuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHJlc29sdmUocmVzLmJvZHkpO1xyXG4gICAgICB9KTtcclxuICAgIH0pXHJcbiAgICAuY2FuY2VsbGFibGUoKVxyXG4gICAgLmNhdGNoKFByb21pc2UuQ2FuY2VsbGF0aW9uRXJyb3IsIChlcnIpID0+IHtcclxuICAgICAgcmVxLmFib3J0KCk7XHJcbiAgICAgIHRocm93IGVycjtcclxuICAgIH0pXHJcbiAgICAudGhlbigocmVzKSA9PiBbdm9pZCAwLCByZXNdKVxyXG4gICAgLmNhdGNoKChlcnIpID0+IFtlcnIudG9TdHJpbmcoKSwgdm9pZCAwXSk7XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMocGFyYW1zU2hhcGUpXHJcbiAgQGRldlJldHVybnMoVC5Qcm9taXNlKCkpXHJcbiAgcG9wdWxhdGUocGFyYW1zKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmNvbnN0cnVjdG9yLmtleUZvcihwYXJhbXMpO1xyXG4gICAgY29uc3QgeyBwYXRoLCBxdWVyeSB9ID0gcGFyYW1zO1xyXG4gICAgaWYoIV8uaGFzKHRoaXMucHJvbWlzZXMsIGtleSkpIHtcclxuICAgICAgdGhpcy5wcm9taXNlc1trZXldID0gdGhpcy5mZXRjaChwYXRoLCAnZ2V0JywgeyBxdWVyeSB9KVxyXG4gICAgICAgIC50aGVuKChbZXJyLCByZXNdKSA9PiB0aGlzLnB1c2hWYWx1ZShrZXksIFtlcnIsIHJlc10pKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnByb21pc2VzW2tleV07XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMoVC5zaGFwZSh7XHJcbiAgICBwYXRoOiBULlN0cmluZygpLFxyXG4gICAgcXVlcnk6IFQub3B0aW9uKFQuYW55KCkpLFxyXG4gICAgYm9keTogVC5vcHRpb24oVC5hbnkoKSksXHJcbiAgfSkpXHJcbiAgQGRldlJldHVybnMoVC5Qcm9taXNlKCkpXHJcbiAgcG9zdCh7IHBhdGgsIHF1ZXJ5LCBib2R5IH0pIHtcclxuICAgIHJldHVybiB0aGlzLmZldGNoKHBhdGgsICdwb3N0JywgeyBxdWVyeSwgYm9keSB9KVxyXG4gICAgLnRoZW4oKFssIGVyciwgcmVzXSkgPT4ge1xyXG4gICAgICBpZihlcnIpIHtcclxuICAgICAgICB0aHJvdyBlcnI7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlcy5ib2R5O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMocGFyYW1zU2hhcGUsIFQuRnVuY3Rpb24oKSlcclxuICBAZGV2UmV0dXJucyhULkZ1bmN0aW9uKCkpXHJcbiAgb2JzZXJ2ZShwYXJhbXMsIGZuKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmNvbnN0cnVjdG9yLmtleUZvcihwYXJhbXMpO1xyXG4gICAgaWYoIV8uaGFzKHRoaXMub2JzZXJ2ZXJzLCBrZXkpKSB7XHJcbiAgICAgIHRoaXMub2JzZXJ2ZXJzW2tleV0gPSBbXTtcclxuICAgICAgY29uc3QgeyBwYXRoLCBxdWVyeSwgcmVmcmVzaEV2ZXJ5IH0gPSBwYXJhbXM7XHJcbiAgICAgIGlmKHJlZnJlc2hFdmVyeSkge1xyXG4gICAgICAgIHRoaXMucmVmcmVzaGVyc1trZXldID0gc2V0SW50ZXJ2YWwoKCkgPT5cclxuICAgICAgICAgIHRoaXMuZmV0Y2gocGF0aCwgJ2dldCcsIHsgcXVlcnkgfSlcclxuICAgICAgICAgICAgLnRoZW4oKFtlcnIsIHJlc10pID0+IHRoaXMucHVzaFZhbHVlKGtleSwgW2VyciwgcmVzXSkpXHJcbiAgICAgICAgLCByZWZyZXNoRXZlcnkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLm9ic2VydmVyc1trZXldLnB1c2goZm4pO1xyXG4gICAgaWYodGhpcy5wcm9taXNlc1trZXldKSB7XHJcbiAgICAgIF8uZGVmZXIoKCkgPT4gXy5lYWNoKHRoaXMuZGF0YVtrZXldLCAoW2VyciwgcmVzXSkgPT4gZm4oW2VyciwgcmVzXSkpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnBvcHVsYXRlKHBhcmFtcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICB0aGlzLm9ic2VydmVyc1trZXldLnNwbGljZSh0aGlzLm9ic2VydmVyc1trZXldLmluZGV4T2YoZm4pLCAxKTtcclxuICAgICAgaWYodGhpcy5vYnNlcnZlcnNba2V5XS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBpZihfLmhhcyh0aGlzLnJlZnJlc2hlcnMsIGtleSkpIHtcclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yZWZyZXNoZXJzW2tleV0pO1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMucmVmcmVzaGVyc1trZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlcnNba2V5XTtcclxuICAgICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV07XHJcbiAgICAgICAgZGVsZXRlIHRoaXMucHJvbWlzZXNba2V5XTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhUVFBGbHV4O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
