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

var _utilsTypes = require('../utils/types');

var __DEV__ = process.env.NODE_ENV === 'development';

var optNumber = _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].Number());

var optionsType = _typecheckDecorator2['default'].shape({
  maxRequestDuration: optNumber,
  maxAgents: optNumber
});
var defaultOptions = {
  maxRequestDuration: 30000,
  maxAgents: 1000
};

var paramsType = _typecheckDecorator2['default'].shape({
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
      options: optionsType,
      data: _typecheckDecorator2['default'].Object({ type: _utilsTypes.versions })
    }))],
    value: function unserialize(_ref) {
      var baseUrl = _ref.baseUrl;
      var options = _ref.options;
      var data = _ref.data;

      return new HTTPFlux(baseUrl, options, data);
    }
  }, {
    key: 'keyFor',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].String()), _typecheckDecorator.takes(paramsType)],
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
      optionsType(options);
      _typecheckDecorator2['default'].Object({ type: _utilsTypes.versions })(data);
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
      options: optionsType,
      data: _typecheckDecorator2['default'].Object({ type: _utilsTypes.versions })
    }))],
    value: function serialize() {
      return {
        baseUrl: this.baseUrl,
        options: this.originalOptions,
        data: this.data
      };
    }
  }, {
    key: 'pushVersion',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].instanceOf(HTTPFlux)), _typecheckDecorator.takes(_typecheckDecorator2['default'].String(), _utilsTypes.version)],
    value: function pushVersion(key, _ref3) {
      var err = _ref3[0];
      var res = _ref3[1];

      var version = [err, res, new Date()];
      this.data[key] = (this.data[key] || []).concat([version]);
      if (_lodash2['default'].has(this.observers, key)) {
        _lodash2['default'].each(this.observers[key], function (fn) {
          return fn(version);
        });
      }
      return this;
    }
  }, {
    key: 'get',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].shape({
      flux: _typecheckDecorator2['default'].instanceOf(HTTPFlux),
      params: paramsType
    })), _typecheckDecorator.takes(_typecheckDecorator2['default'].String(), _typecheckDecorator2['default'].Object())],
    value: function get(path) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return {
        flux: this,
        params: _Object$assign({}, _lodash2['default'].defaults({}, params, defaultParams), { path: path })
      };
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
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Promise()), _typecheckDecorator.takes(paramsType)],
    value: function populate(params) {
      var _this2 = this;

      var key = this.constructor.keyFor(params);
      var path = params.path;
      var query = params.query;

      if (!_lodash2['default'].has(this.promises, key)) {
        this.promises[key] = this.request(path, 'get', { query: query }).then(function (_ref4) {
          var err = _ref4[0];
          var res = _ref4[1];
          return _this2.pushVersion(key, [err, res]);
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
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Function()), _typecheckDecorator.takes(paramsType, _typecheckDecorator2['default'].Function())],
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
                return _this3.pushVersion(key, [err, res]);
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
//# sourceMappingURL=data:application/json;base64,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LFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUM3QjtBQUNELGlCQUFPLE9BQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLGlCQUFPLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLGlCQUFPLE9BQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO09BQ0YsQ0FBQztLQUNIOzs7U0FoTEcsUUFBUTs7O3FCQW1MQyxRQUFRIiwiZmlsZSI6ImZsdXhlcy9IVFRQRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBzdXBlcmFnZW50IGZyb20gJ3N1cGVyYWdlbnQnO1xyXG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XHJcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcclxuaW1wb3J0IFQsIHsgdGFrZXMgYXMgZGV2VGFrZXMsIHJldHVybnMgYXMgZGV2UmV0dXJucyB9IGZyb20gJ3R5cGVjaGVjay1kZWNvcmF0b3InO1xyXG5cclxuaW1wb3J0IEZsdXggZnJvbSAnLi9GbHV4JztcclxuaW1wb3J0IHsgdmVyc2lvbiBhcyB2ZXJzaW9uVHlwZSwgdmVyc2lvbnMgYXMgdmVyc2lvbnNUeXBlIH0gZnJvbSAnLi4vdXRpbHMvdHlwZXMnO1xyXG5cclxuY29uc3QgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxuY29uc3Qgb3B0TnVtYmVyID0gVC5vcHRpb24oVC5OdW1iZXIoKSk7XHJcblxyXG5jb25zdCBvcHRpb25zVHlwZSA9IFQuc2hhcGUoe1xyXG4gIG1heFJlcXVlc3REdXJhdGlvbjogb3B0TnVtYmVyLFxyXG4gIG1heEFnZW50czogb3B0TnVtYmVyLFxyXG59KTtcclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgbWF4UmVxdWVzdER1cmF0aW9uOiAzMDAwMCxcclxuICBtYXhBZ2VudHM6IDEwMDAsXHJcbn07XHJcblxyXG5jb25zdCBwYXJhbXNUeXBlID0gVC5zaGFwZSh7XHJcbiAgcGF0aDogVC5TdHJpbmcoKSxcclxuICBxdWVyeTogVC5PYmplY3QoKSxcclxuICByZWZyZXNoRXZlcnk6IG9wdE51bWJlcixcclxufSk7XHJcbmNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XHJcbiAgcXVlcnk6IHt9LFxyXG4gIHJlZnJlc2hFdmVyeTogdm9pZCAwLFxyXG59O1xyXG5cclxuY2xhc3MgSFRUUEZsdXggZXh0ZW5kcyBGbHV4IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnSFRUUEZsdXgnO1xyXG5cclxuICBAZGV2VGFrZXMoVC5zaGFwZSh7XHJcbiAgICBiYXNlVXJsOiBULlN0cmluZygpLFxyXG4gICAgb3B0aW9uczogb3B0aW9uc1R5cGUsXHJcbiAgICBkYXRhOiBULk9iamVjdCh7IHR5cGU6IHZlcnNpb25zVHlwZSB9KSxcclxuICB9KSlcclxuICBAZGV2UmV0dXJucyhULmluc3RhbmNlT2YoSFRUUEZsdXgpKVxyXG4gIHN0YXRpYyB1bnNlcmlhbGl6ZSh7IGJhc2VVcmwsIG9wdGlvbnMsIGRhdGEgfSkge1xyXG4gICAgcmV0dXJuIG5ldyBIVFRQRmx1eChiYXNlVXJsLCBvcHRpb25zLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhwYXJhbXNUeXBlKVxyXG4gIEBkZXZSZXR1cm5zKFQuU3RyaW5nKCkpXHJcbiAgc3RhdGljIGtleUZvcihwYXJhbXMpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYXJhbXMpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoYmFzZVVybCwgb3B0aW9ucyA9IHt9LCBkYXRhID0ge30pIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIFQuU3RyaW5nKCkoYmFzZVVybCk7XHJcbiAgICAgIG9wdGlvbnNUeXBlKG9wdGlvbnMpO1xyXG4gICAgICBULk9iamVjdCh7IHR5cGU6IHZlcnNpb25zVHlwZSB9KShkYXRhKTtcclxuICAgIH1cclxuICAgIHRoaXMub3JpZ2luYWxPcHRpb25zID0gb3B0aW9ucztcclxuICAgIHRoaXMub3B0aW9ucyA9IF8uZGVmYXVsdHMoe30sIG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcclxuICAgIHRoaXMuYmFzZVVybCA9IGJhc2VVcmw7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy5wcm9taXNlcyA9IF8ubWFwVmFsdWVzKGRhdGEsIChbZXJyLCByZXNdKSA9PiBQcm9taXNlLnJlc29sdmUoW2VyciwgcmVzXSkpO1xyXG4gICAgdGhpcy5vYnNlcnZlcnMgPSB7fTtcclxuICAgIHRoaXMucmVmcmVzaGVycyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgQGRldlJldHVybnMoVC5zaGFwZSh7XHJcbiAgICBiYXNlVXJsOiBULlN0cmluZygpLFxyXG4gICAgb3B0aW9uczogb3B0aW9uc1R5cGUsXHJcbiAgICBkYXRhOiBULk9iamVjdCh7IHR5cGU6IHZlcnNpb25zVHlwZSB9KSxcclxuICB9KSlcclxuICBzZXJpYWxpemUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBiYXNlVXJsOiB0aGlzLmJhc2VVcmwsXHJcbiAgICAgIG9wdGlvbnM6IHRoaXMub3JpZ2luYWxPcHRpb25zLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGEsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuU3RyaW5nKCksIHZlcnNpb25UeXBlKVxyXG4gIEBkZXZSZXR1cm5zKFQuaW5zdGFuY2VPZihIVFRQRmx1eCkpXHJcbiAgcHVzaFZlcnNpb24oa2V5LCBbZXJyLCByZXNdKSB7XHJcbiAgICBjb25zdCB2ZXJzaW9uID0gW2VyciwgcmVzLCBuZXcgRGF0ZSgpXTtcclxuICAgIHRoaXMuZGF0YVtrZXldID0gKHRoaXMuZGF0YVtrZXldIHx8IFtdKS5jb25jYXQoW3ZlcnNpb25dKTtcclxuICAgIGlmKF8uaGFzKHRoaXMub2JzZXJ2ZXJzLCBrZXkpKSB7XHJcbiAgICAgIF8uZWFjaCh0aGlzLm9ic2VydmVyc1trZXldLCAoZm4pID0+IGZuKHZlcnNpb24pKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuU3RyaW5nKCksIFQuT2JqZWN0KCkpXHJcbiAgQGRldlJldHVybnMoVC5zaGFwZSh7XHJcbiAgICBmbHV4OiBULmluc3RhbmNlT2YoSFRUUEZsdXgpLFxyXG4gICAgcGFyYW1zOiBwYXJhbXNUeXBlLFxyXG4gIH0pKVxyXG4gIGdldChwYXRoLCBwYXJhbXMgPSB7fSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZmx1eDogdGhpcyxcclxuICAgICAgcGFyYW1zOiBPYmplY3QuYXNzaWduKHt9LCBfLmRlZmF1bHRzKHt9LCBwYXJhbXMsIGRlZmF1bHRQYXJhbXMpLCB7IHBhdGggfSksXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1R5cGUpXHJcbiAgQGRldlJldHVybnModmVyc2lvbnNUeXBlKVxyXG4gIHZlcnNpb25zKHBhcmFtcykge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5rZXlGb3IocGFyYW1zKTtcclxuICAgIGlmKCFfLmhhcyh0aGlzLmRhdGEsIGtleSkpIHtcclxuICAgICAgdGhpcy5kYXRhW2tleV0gPSBbXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmRhdGFba2V5XTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhcclxuICAgIFQuU3RyaW5nKCksXHJcbiAgICBULm9uZU9mKFQuZXhhY3RseSgnZ2V0JyksIFQuZXhhY3RseSgncG9zdCcpKSxcclxuICAgIFQub3B0aW9uKFQuT2JqZWN0KCkpXHJcbiAgKVxyXG4gIEBkZXZSZXR1cm5zKFQuUHJvbWlzZSgpKVxyXG4gIHJlcXVlc3QocGF0aCwgbWV0aG9kLCBvcHRzID0ge30pIHtcclxuICAgIGxldCByZXE7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICByZXEgPSBzdXBlcmFnZW50W21ldGhvZF0odXJsLnJlc29sdmUodGhpcy5iYXNlVXJsLCBwYXRoKSlcclxuICAgICAgICAuYWNjZXB0KCdqc29uJylcclxuICAgICAgICAudGltZW91dCh0aGlzLm9wdGlvbnMubWF4UmVxdWVzdER1cmF0aW9uKTtcclxuICAgICAgaWYob3B0cy5xdWVyeSkge1xyXG4gICAgICAgIHJlcSA9IHJlcS5xdWVyeShvcHRzLnF1ZXJ5KTtcclxuICAgICAgfVxyXG4gICAgICBpZihvcHRzLmJvZHkpIHtcclxuICAgICAgICByZXEgPSByZXEuc2VuZChvcHRzLmJvZHkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlcS5lbmQoKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNvbHZlKHJlcy5ib2R5KTtcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLmNhbmNlbGxhYmxlKClcclxuICAgIC5jYXRjaChQcm9taXNlLkNhbmNlbGxhdGlvbkVycm9yLCAoZXJyKSA9PiB7XHJcbiAgICAgIHJlcS5hYm9ydCgpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oKHJlcykgPT4gW3ZvaWQgMCwgcmVzXSlcclxuICAgIC5jYXRjaCgoZXJyKSA9PiBbZXJyLnRvU3RyaW5nKCksIHZvaWQgMF0pO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1R5cGUpXHJcbiAgQGRldlJldHVybnMoVC5Qcm9taXNlKCkpXHJcbiAgcG9wdWxhdGUocGFyYW1zKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmNvbnN0cnVjdG9yLmtleUZvcihwYXJhbXMpO1xyXG4gICAgY29uc3QgeyBwYXRoLCBxdWVyeSB9ID0gcGFyYW1zO1xyXG4gICAgaWYoIV8uaGFzKHRoaXMucHJvbWlzZXMsIGtleSkpIHtcclxuICAgICAgdGhpcy5wcm9taXNlc1trZXldID0gdGhpcy5yZXF1ZXN0KHBhdGgsICdnZXQnLCB7IHF1ZXJ5IH0pXHJcbiAgICAgICAgLnRoZW4oKFtlcnIsIHJlc10pID0+IHRoaXMucHVzaFZlcnNpb24oa2V5LCBbZXJyLCByZXNdKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlc1trZXldO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuc2hhcGUoe1xyXG4gICAgcGF0aDogVC5TdHJpbmcoKSxcclxuICAgIHF1ZXJ5OiBULm9wdGlvbihULmFueSgpKSxcclxuICAgIGJvZHk6IFQub3B0aW9uKFQuYW55KCkpLFxyXG4gIH0pKVxyXG4gIEBkZXZSZXR1cm5zKFQuUHJvbWlzZSgpKVxyXG4gIHBvc3QoeyBwYXRoLCBxdWVyeSwgYm9keSB9KSB7XHJcbiAgICByZXR1cm4gdGhpcy5mZXRjaChwYXRoLCAncG9zdCcsIHsgcXVlcnksIGJvZHkgfSlcclxuICAgIC50aGVuKChbLCBlcnIsIHJlc10pID0+IHtcclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXMuYm9keTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1R5cGUsIFQuRnVuY3Rpb24oKSlcclxuICBAZGV2UmV0dXJucyhULkZ1bmN0aW9uKCkpXHJcbiAgb2JzZXJ2ZShwYXJhbXMsIGZuKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmNvbnN0cnVjdG9yLmtleUZvcihwYXJhbXMpO1xyXG4gICAgaWYoIV8uaGFzKHRoaXMub2JzZXJ2ZXJzLCBrZXkpKSB7XHJcbiAgICAgIHRoaXMub2JzZXJ2ZXJzW2tleV0gPSBbXTtcclxuICAgICAgY29uc3QgeyBwYXRoLCBxdWVyeSwgcmVmcmVzaEV2ZXJ5IH0gPSBwYXJhbXM7XHJcbiAgICAgIGlmKHJlZnJlc2hFdmVyeSkge1xyXG4gICAgICAgIHRoaXMucmVmcmVzaGVyc1trZXldID0gc2V0SW50ZXJ2YWwoKCkgPT5cclxuICAgICAgICAgIHRoaXMuZmV0Y2gocGF0aCwgJ2dldCcsIHsgcXVlcnkgfSlcclxuICAgICAgICAgICAgLnRoZW4oKFtlcnIsIHJlc10pID0+IHRoaXMucHVzaFZlcnNpb24oa2V5LCBbZXJyLCByZXNdKSlcclxuICAgICAgICAsIHJlZnJlc2hFdmVyeSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMub2JzZXJ2ZXJzW2tleV0ucHVzaChmbik7XHJcbiAgICBpZih0aGlzLnByb21pc2VzW2tleV0pIHtcclxuICAgICAgXy5kZWZlcigoKSA9PiBfLmVhY2godGhpcy5kYXRhW2tleV0sIChbZXJyLCByZXNdKSA9PiBmbihbZXJyLCByZXNdKSkpO1xyXG4gICAgfVxyXG4gICAgZWxzZSB7XHJcbiAgICAgIHRoaXMucG9wdWxhdGUocGFyYW1zKTtcclxuICAgIH1cclxuICAgIHJldHVybiAoKSA9PiB7XHJcbiAgICAgIHRoaXMub2JzZXJ2ZXJzW2tleV0uc3BsaWNlKHRoaXMub2JzZXJ2ZXJzW2tleV0uaW5kZXhPZihmbiksIDEpO1xyXG4gICAgICBpZih0aGlzLm9ic2VydmVyc1trZXldLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIGlmKF8uaGFzKHRoaXMucmVmcmVzaGVycywga2V5KSkge1xyXG4gICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnJlZnJlc2hlcnNba2V5XSk7XHJcbiAgICAgICAgICBkZWxldGUgdGhpcy5yZWZyZXNoZXJzW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVyc1trZXldO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLmRhdGFba2V5XTtcclxuICAgICAgICBkZWxldGUgdGhpcy5wcm9taXNlc1trZXldO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgSFRUUEZsdXg7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
