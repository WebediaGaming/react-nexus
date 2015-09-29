'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createDecoratedClass = require('babel-runtime/helpers/create-decorated-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _Flux2 = require('./Flux');

var _Flux3 = _interopRequireDefault(_Flux2);

var __DEV__ = process.env.NODE_ENV === 'development';

var optNumber = _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].Number());

var valueShape = _typecheckDecorator2['default'].shape([_typecheckDecorator2['default'].option(_typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].instanceOf(Error), _typecheckDecorator2['default'].String())), _typecheckDecorator2['default'].any(), _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].instanceOf(Date), _typecheckDecorator2['default'].String()))]);
var valuesType = _typecheckDecorator2['default'].Array({ type: valueShape });

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
  query: {},
  refreshEvery: void 0
};

var HTTPFlux = (function (_Flux) {
  _inherits(HTTPFlux, _Flux);

  _createDecoratedClass(HTTPFlux, null, [{
    key: 'unserialize',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].instanceOf(HTTPFlux)), _typecheckDecorator.takes(_typecheckDecorator2['default'].shape({
      baseUrl: _typecheckDecorator2['default'].String(),
      options: optionsShape,
      data: _typecheckDecorator2['default'].Object({ type: valuesType })
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

  function HTTPFlux(baseUrl) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
    var data = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    _classCallCheck(this, HTTPFlux);

    _Flux.call(this);
    if (__DEV__) {
      _typecheckDecorator2['default'].String()(baseUrl);
      optionsShape(options);
      _typecheckDecorator2['default'].Object({ type: valuesType })(data);
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
      data: _typecheckDecorator2['default'].Object({ type: valuesType })
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
    value: function pushValue(key, _ref3) {
      var err = _ref3[0];
      var res = _ref3[1];

      var value = [err, res, new Date()];
      this.data[key] = (this.data[key] || []).concat([value]);
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
    })), _typecheckDecorator.takes(_typecheckDecorator2['default'].String(), _typecheckDecorator2['default'].Object())],
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
      if (!_lodash2['default'].has(this.data, key)) {
        this.data[key] = [];
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
        this.promises[key] = this.request(path, 'get', { query: query }).then(function (_ref4) {
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
})(_Flux3['default']);

exports['default'] = HTTPFlux;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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Q0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDdkI7QUFDRCxhQUFPLFlBQU07QUFDWCxlQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFlBQUcsT0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNuQyxjQUFHLG9CQUFFLEdBQUcsQ0FBQyxPQUFLLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRTtBQUM5Qix5QkFBYSxDQUFDLE9BQUssVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEMsbUJBQU8sT0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDN0I7QUFDRCxpQkFBTyxPQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixpQkFBTyxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QixpQkFBTyxPQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQjtPQUNGLENBQUM7S0FDSDs7O1NBaExHLFFBQVE7OztxQkFtTEMsUUFBUSIsImZpbGUiOiJmbHV4ZXMvSFRUUEZsdXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgc3VwZXJhZ2VudCBmcm9tICdzdXBlcmFnZW50JztcclxuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xyXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XHJcbmltcG9ydCBULCB7IHRha2VzIGFzIGRldlRha2VzLCByZXR1cm5zIGFzIGRldlJldHVybnMgfSBmcm9tICd0eXBlY2hlY2stZGVjb3JhdG9yJztcclxuXHJcbmltcG9ydCBGbHV4IGZyb20gJy4vRmx1eCc7XHJcblxyXG5jb25zdCBfX0RFVl9fID0gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09ICdkZXZlbG9wbWVudCc7XHJcblxyXG5jb25zdCBvcHROdW1iZXIgPSBULm9wdGlvbihULk51bWJlcigpKTtcclxuXHJcbmNvbnN0IHZhbHVlU2hhcGUgPSBULnNoYXBlKFtcclxuICBULm9wdGlvbihULm9uZU9mKFQuaW5zdGFuY2VPZihFcnJvciksIFQuU3RyaW5nKCkpKSxcclxuICBULmFueSgpLFxyXG4gIFQub3B0aW9uKFQub25lT2YoVC5pbnN0YW5jZU9mKERhdGUpLCBULlN0cmluZygpKSksXHJcbl0pO1xyXG5jb25zdCB2YWx1ZXNUeXBlID0gVC5BcnJheSh7IHR5cGU6IHZhbHVlU2hhcGUgfSk7XHJcblxyXG5jb25zdCBvcHRpb25zU2hhcGUgPSBULnNoYXBlKHtcclxuICBtYXhSZXF1ZXN0RHVyYXRpb246IG9wdE51bWJlcixcclxuICBtYXhBZ2VudHM6IG9wdE51bWJlcixcclxufSk7XHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIG1heFJlcXVlc3REdXJhdGlvbjogMzAwMDAsXHJcbiAgbWF4QWdlbnRzOiAxMDAwLFxyXG59O1xyXG5cclxuY29uc3QgcGFyYW1zU2hhcGUgPSBULnNoYXBlKHtcclxuICBwYXRoOiBULlN0cmluZygpLFxyXG4gIHF1ZXJ5OiBULk9iamVjdCgpLFxyXG4gIHJlZnJlc2hFdmVyeTogb3B0TnVtYmVyLFxyXG59KTtcclxuY29uc3QgZGVmYXVsdFBhcmFtcyA9IHtcclxuICBxdWVyeToge30sXHJcbiAgcmVmcmVzaEV2ZXJ5OiB2b2lkIDAsXHJcbn07XHJcblxyXG5jbGFzcyBIVFRQRmx1eCBleHRlbmRzIEZsdXgge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdIVFRQRmx1eCc7XHJcblxyXG4gIEBkZXZUYWtlcyhULnNoYXBlKHtcclxuICAgIGJhc2VVcmw6IFQuU3RyaW5nKCksXHJcbiAgICBvcHRpb25zOiBvcHRpb25zU2hhcGUsXHJcbiAgICBkYXRhOiBULk9iamVjdCh7IHR5cGU6IHZhbHVlc1R5cGUgfSksXHJcbiAgfSkpXHJcbiAgQGRldlJldHVybnMoVC5pbnN0YW5jZU9mKEhUVFBGbHV4KSlcclxuICBzdGF0aWMgdW5zZXJpYWxpemUoeyBiYXNlVXJsLCBvcHRpb25zLCBkYXRhIH0pIHtcclxuICAgIHJldHVybiBuZXcgSFRUUEZsdXgoYmFzZVVybCwgb3B0aW9ucywgZGF0YSk7XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMocGFyYW1zU2hhcGUpXHJcbiAgQGRldlJldHVybnMoVC5TdHJpbmcoKSlcclxuICBzdGF0aWMga2V5Rm9yKHBhcmFtcykge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihiYXNlVXJsLCBvcHRpb25zID0ge30sIGRhdGEgPSB7fSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgVC5TdHJpbmcoKShiYXNlVXJsKTtcclxuICAgICAgb3B0aW9uc1NoYXBlKG9wdGlvbnMpO1xyXG4gICAgICBULk9iamVjdCh7IHR5cGU6IHZhbHVlc1R5cGUgfSkoZGF0YSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9yaWdpbmFsT3B0aW9ucyA9IG9wdGlvbnM7XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBfLmRlZmF1bHRzKHt9LCBvcHRpb25zLCBkZWZhdWx0T3B0aW9ucyk7XHJcbiAgICB0aGlzLmJhc2VVcmwgPSBiYXNlVXJsO1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMucHJvbWlzZXMgPSBfLm1hcFZhbHVlcyhkYXRhLCAoW2VyciwgcmVzXSkgPT4gUHJvbWlzZS5yZXNvbHZlKFtlcnIsIHJlc10pKTtcclxuICAgIHRoaXMub2JzZXJ2ZXJzID0ge307XHJcbiAgICB0aGlzLnJlZnJlc2hlcnMgPSB7fTtcclxuICB9XHJcblxyXG4gIEBkZXZSZXR1cm5zKFQuc2hhcGUoe1xyXG4gICAgYmFzZVVybDogVC5TdHJpbmcoKSxcclxuICAgIG9wdGlvbnM6IG9wdGlvbnNTaGFwZSxcclxuICAgIGRhdGE6IFQuT2JqZWN0KHsgdHlwZTogdmFsdWVzVHlwZSB9KSxcclxuICB9KSlcclxuICBzZXJpYWxpemUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBiYXNlVXJsOiB0aGlzLmJhc2VVcmwsXHJcbiAgICAgIG9wdGlvbnM6IHRoaXMub3JpZ2luYWxPcHRpb25zLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGEsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuU3RyaW5nKCksIHZhbHVlU2hhcGUpXHJcbiAgQGRldlJldHVybnMoVC5pbnN0YW5jZU9mKEhUVFBGbHV4KSlcclxuICBwdXNoVmFsdWUoa2V5LCBbZXJyLCByZXNdKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IFtlcnIsIHJlcywgbmV3IERhdGUoKV07XHJcbiAgICB0aGlzLmRhdGFba2V5XSA9ICh0aGlzLmRhdGFba2V5XSB8fCBbXSkuY29uY2F0KFt2YWx1ZV0pO1xyXG4gICAgaWYoXy5oYXModGhpcy5vYnNlcnZlcnMsIGtleSkpIHtcclxuICAgICAgXy5lYWNoKHRoaXMub2JzZXJ2ZXJzW2tleV0sIChmbikgPT4gZm4odmFsdWUpKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuU3RyaW5nKCksIFQuT2JqZWN0KCkpXHJcbiAgQGRldlJldHVybnMoVC5zaGFwZSh7XHJcbiAgICBmbHV4OiBULmluc3RhbmNlT2YoSFRUUEZsdXgpLFxyXG4gICAgcGFyYW1zOiBwYXJhbXNTaGFwZSxcclxuICB9KSlcclxuICBnZXQocGF0aCwgcGFyYW1zID0ge30pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZsdXg6IHRoaXMsXHJcbiAgICAgIHBhcmFtczogT2JqZWN0LmFzc2lnbih7fSwgXy5kZWZhdWx0cyh7fSwgcGFyYW1zLCBkZWZhdWx0UGFyYW1zKSwgeyBwYXRoIH0pLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhwYXJhbXNTaGFwZSlcclxuICBAZGV2UmV0dXJucyh2YWx1ZXNUeXBlKVxyXG4gIHZhbHVlcyhwYXJhbXMpIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuY29uc3RydWN0b3Iua2V5Rm9yKHBhcmFtcyk7XHJcbiAgICBpZighXy5oYXModGhpcy5kYXRhLCBrZXkpKSB7XHJcbiAgICAgIHRoaXMuZGF0YVtrZXldID0gW107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW2tleV07XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMoXHJcbiAgICBULlN0cmluZygpLFxyXG4gICAgVC5vbmVPZihULmV4YWN0bHkoJ2dldCcpLCBULmV4YWN0bHkoJ3Bvc3QnKSksXHJcbiAgICBULm9wdGlvbihULk9iamVjdCgpKVxyXG4gIClcclxuICBAZGV2UmV0dXJucyhULlByb21pc2UoKSlcclxuICByZXF1ZXN0KHBhdGgsIG1ldGhvZCwgb3B0cyA9IHt9KSB7XHJcbiAgICBsZXQgcmVxO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgcmVxID0gc3VwZXJhZ2VudFttZXRob2RdKHVybC5yZXNvbHZlKHRoaXMuYmFzZVVybCwgcGF0aCkpXHJcbiAgICAgICAgLmFjY2VwdCgnanNvbicpXHJcbiAgICAgICAgLnRpbWVvdXQodGhpcy5vcHRpb25zLm1heFJlcXVlc3REdXJhdGlvbik7XHJcbiAgICAgIGlmKG9wdHMucXVlcnkpIHtcclxuICAgICAgICByZXEgPSByZXEucXVlcnkob3B0cy5xdWVyeSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYob3B0cy5ib2R5KSB7XHJcbiAgICAgICAgcmVxID0gcmVxLnNlbmQob3B0cy5ib2R5KTtcclxuICAgICAgfVxyXG4gICAgICByZXEuZW5kKChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgIGlmKGVycikge1xyXG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcmVzb2x2ZShyZXMuYm9keSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYW5jZWxsYWJsZSgpXHJcbiAgICAuY2F0Y2goUHJvbWlzZS5DYW5jZWxsYXRpb25FcnJvciwgKGVycikgPT4ge1xyXG4gICAgICByZXEuYWJvcnQoKTtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSlcclxuICAgIC50aGVuKChyZXMpID0+IFt2b2lkIDAsIHJlc10pXHJcbiAgICAuY2F0Y2goKGVycikgPT4gW2Vyci50b1N0cmluZygpLCB2b2lkIDBdKTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhwYXJhbXNTaGFwZSlcclxuICBAZGV2UmV0dXJucyhULlByb21pc2UoKSlcclxuICBwb3B1bGF0ZShwYXJhbXMpIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuY29uc3RydWN0b3Iua2V5Rm9yKHBhcmFtcyk7XHJcbiAgICBjb25zdCB7IHBhdGgsIHF1ZXJ5IH0gPSBwYXJhbXM7XHJcbiAgICBpZighXy5oYXModGhpcy5wcm9taXNlcywga2V5KSkge1xyXG4gICAgICB0aGlzLnByb21pc2VzW2tleV0gPSB0aGlzLnJlcXVlc3QocGF0aCwgJ2dldCcsIHsgcXVlcnkgfSlcclxuICAgICAgICAudGhlbigoW2VyciwgcmVzXSkgPT4gdGhpcy5wdXNoVmFsdWUoa2V5LCBbZXJyLCByZXNdKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlc1trZXldO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuc2hhcGUoe1xyXG4gICAgcGF0aDogVC5TdHJpbmcoKSxcclxuICAgIHF1ZXJ5OiBULm9wdGlvbihULmFueSgpKSxcclxuICAgIGJvZHk6IFQub3B0aW9uKFQuYW55KCkpLFxyXG4gIH0pKVxyXG4gIEBkZXZSZXR1cm5zKFQuUHJvbWlzZSgpKVxyXG4gIHBvc3QoeyBwYXRoLCBxdWVyeSwgYm9keSB9KSB7XHJcbiAgICByZXR1cm4gdGhpcy5mZXRjaChwYXRoLCAncG9zdCcsIHsgcXVlcnksIGJvZHkgfSlcclxuICAgIC50aGVuKChbLCBlcnIsIHJlc10pID0+IHtcclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXMuYm9keTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1NoYXBlLCBULkZ1bmN0aW9uKCkpXHJcbiAgQGRldlJldHVybnMoVC5GdW5jdGlvbigpKVxyXG4gIG9ic2VydmUocGFyYW1zLCBmbikge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5rZXlGb3IocGFyYW1zKTtcclxuICAgIGlmKCFfLmhhcyh0aGlzLm9ic2VydmVycywga2V5KSkge1xyXG4gICAgICB0aGlzLm9ic2VydmVyc1trZXldID0gW107XHJcbiAgICAgIGNvbnN0IHsgcGF0aCwgcXVlcnksIHJlZnJlc2hFdmVyeSB9ID0gcGFyYW1zO1xyXG4gICAgICBpZihyZWZyZXNoRXZlcnkpIHtcclxuICAgICAgICB0aGlzLnJlZnJlc2hlcnNba2V5XSA9IHNldEludGVydmFsKCgpID0+XHJcbiAgICAgICAgICB0aGlzLmZldGNoKHBhdGgsICdnZXQnLCB7IHF1ZXJ5IH0pXHJcbiAgICAgICAgICAgIC50aGVuKChbZXJyLCByZXNdKSA9PiB0aGlzLnB1c2hWYWx1ZShrZXksIFtlcnIsIHJlc10pKVxyXG4gICAgICAgICwgcmVmcmVzaEV2ZXJ5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5vYnNlcnZlcnNba2V5XS5wdXNoKGZuKTtcclxuICAgIGlmKHRoaXMucHJvbWlzZXNba2V5XSkge1xyXG4gICAgICBfLmRlZmVyKCgpID0+IF8uZWFjaCh0aGlzLmRhdGFba2V5XSwgKFtlcnIsIHJlc10pID0+IGZuKFtlcnIsIHJlc10pKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5wb3B1bGF0ZShwYXJhbXMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgdGhpcy5vYnNlcnZlcnNba2V5XS5zcGxpY2UodGhpcy5vYnNlcnZlcnNba2V5XS5pbmRleE9mKGZuKSwgMSk7XHJcbiAgICAgIGlmKHRoaXMub2JzZXJ2ZXJzW2tleV0ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgaWYoXy5oYXModGhpcy5yZWZyZXNoZXJzLCBrZXkpKSB7XHJcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMucmVmcmVzaGVyc1trZXldKTtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLnJlZnJlc2hlcnNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJzW2tleV07XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZGF0YVtrZXldO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnByb21pc2VzW2tleV07XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIVFRQRmx1eDtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
