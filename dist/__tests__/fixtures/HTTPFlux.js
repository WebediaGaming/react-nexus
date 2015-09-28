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

var _2 = require('../..');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9IVFRQRmx1eC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7OztnQ0FDSCxvQkFBb0I7Ozs7MEJBQ2hCLFlBQVk7Ozs7bUJBQ25CLEtBQUs7Ozs7d0JBQ0QsVUFBVTs7OztrQ0FDOEIscUJBQXFCOzs7O2lCQUU1RCxPQUFPOztBQUU1QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxhQUFhLENBQUM7O0FBRXZELElBQU0sU0FBUyxHQUFHLGdDQUFFLE1BQU0sQ0FBQyxnQ0FBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDOztBQUV2QyxJQUFNLFVBQVUsR0FBRyxnQ0FBRSxLQUFLLENBQUMsQ0FDekIsZ0NBQUUsTUFBTSxDQUFDLGdDQUFFLEtBQUssQ0FBQyxnQ0FBRSxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsZ0NBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUNsRCxnQ0FBRSxHQUFHLEVBQUUsRUFDUCxnQ0FBRSxLQUFLLENBQUMsZ0NBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFLGdDQUFFLE1BQU0sRUFBRSxDQUFDLENBQ3hDLENBQUMsQ0FBQztBQUNILElBQU0sVUFBVSxHQUFHLGdDQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFdkMsSUFBTSxZQUFZLEdBQUcsZ0NBQUUsS0FBSyxDQUFDO0FBQzNCLG9CQUFrQixFQUFFLFNBQVM7QUFDN0IsV0FBUyxFQUFFLFNBQVM7Q0FDckIsQ0FBQyxDQUFDO0FBQ0gsSUFBTSxjQUFjLEdBQUc7QUFDckIsb0JBQWtCLEVBQUUsS0FBSztBQUN6QixXQUFTLEVBQUUsSUFBSTtDQUNoQixDQUFDOztBQUVGLElBQU0sV0FBVyxHQUFHLGdDQUFFLEtBQUssQ0FBQztBQUMxQixNQUFJLEVBQUUsZ0NBQUUsTUFBTSxFQUFFO0FBQ2hCLE9BQUssRUFBRSxnQ0FBRSxNQUFNLEVBQUU7QUFDakIs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QyxNQUFNLENBQUMsT0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQy9ELFlBQUcsT0FBSyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNuQyxjQUFHLG9CQUFFLEdBQUcsQ0FBQyxPQUFLLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRTtBQUM5Qix5QkFBYSxDQUFDLE9BQUssVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEMsbUJBQU8sT0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDN0I7QUFDRCxpQkFBTyxPQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixpQkFBTyxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QixpQkFBTyxPQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMzQjtPQUNGLENBQUM7S0FDSDs7O1NBakxHLFFBQVE7OztxQkFvTEMsUUFBUSIsImZpbGUiOiJfX3Rlc3RzX18vZml4dHVyZXMvSFRUUEZsdXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXyBmcm9tICdsb2Rhc2gnO1xuaW1wb3J0IHNob3VsZCBmcm9tICdzaG91bGQvYXMtZnVuY3Rpb24nO1xuaW1wb3J0IHN1cGVyYWdlbnQgZnJvbSAnc3VwZXJhZ2VudCc7XG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgVCwgeyB0YWtlcyBhcyBkZXZUYWtlcywgcmV0dXJucyBhcyBkZXZSZXR1cm5zIH0gZnJvbSAndHlwZWNoZWNrLWRlY29yYXRvcic7XG5cbmltcG9ydCB7IEZsdXggfSBmcm9tICcuLi8uLic7XG5cbmNvbnN0IF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcclxuXHJcbmNvbnN0IG9wdE51bWJlciA9IFQub3B0aW9uKFQuTnVtYmVyKCkpO1xyXG5cclxuY29uc3QgdmFsdWVTaGFwZSA9IFQuc2hhcGUoW1xyXG4gIFQub3B0aW9uKFQub25lT2YoVC5pbnN0YW5jZU9mKEVycm9yKSwgVC5TdHJpbmcoKSkpLFxyXG4gIFQuYW55KCksXHJcbiAgVC5vbmVPZihULmluc3RhbmNlT2YoRGF0ZSksIFQuU3RyaW5nKCkpLFxyXG5dKTtcclxuY29uc3QgdmFsdWVzVHlwZSA9IFQuQXJyYXkodmFsdWVTaGFwZSk7XHJcblxyXG5jb25zdCBvcHRpb25zU2hhcGUgPSBULnNoYXBlKHtcclxuICBtYXhSZXF1ZXN0RHVyYXRpb246IG9wdE51bWJlcixcclxuICBtYXhBZ2VudHM6IG9wdE51bWJlcixcclxufSk7XHJcbmNvbnN0IGRlZmF1bHRPcHRpb25zID0ge1xyXG4gIG1heFJlcXVlc3REdXJhdGlvbjogMzAwMDAsXHJcbiAgbWF4QWdlbnRzOiAxMDAwLFxyXG59O1xyXG5cclxuY29uc3QgcGFyYW1zU2hhcGUgPSBULnNoYXBlKHtcclxuICBwYXRoOiBULlN0cmluZygpLFxyXG4gIHF1ZXJ5OiBULk9iamVjdCgpLFxyXG4gIHJlZnJlc2hFdmVyeTogb3B0TnVtYmVyLFxyXG59KTtcclxuY29uc3QgZGVmYXVsdFBhcmFtcyA9IHtcclxuICByZWZyZXNoRXZlcnk6IG51bGwsXHJcbiAgYXV0aFRva2VuOiBudWxsLFxyXG59O1xyXG5cclxuY2xhc3MgSFRUUEZsdXggZXh0ZW5kcyBGbHV4IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnSFRUUEZsdXgnO1xyXG5cclxuICBAZGV2VGFrZXMoVC5zaGFwZSh7XHJcbiAgICBiYXNlVXJsOiBULlN0cmluZygpLFxyXG4gICAgb3B0aW9uczogb3B0aW9uc1NoYXBlLFxyXG4gICAgZGF0YTogVC5PYmplY3QodmFsdWVzVHlwZSksXHJcbiAgfSkpXHJcbiAgQGRldlJldHVybnMoVC5pbnN0YW5jZU9mKEhUVFBGbHV4KSlcclxuICBzdGF0aWMgdW5zZXJpYWxpemUoeyBiYXNlVXJsLCBvcHRpb25zLCBkYXRhIH0pIHtcclxuICAgIHJldHVybiBuZXcgSFRUUEZsdXgoYmFzZVVybCwgb3B0aW9ucywgZGF0YSk7XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMocGFyYW1zU2hhcGUpXHJcbiAgQGRldlJldHVybnMoVC5TdHJpbmcoKSlcclxuICBzdGF0aWMga2V5Rm9yKHBhcmFtcykge1xyXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHBhcmFtcyk7XHJcbiAgfVxyXG5cclxuICBjb25zdHJ1Y3RvcihiYXNlVXJsLCBvcHRpb25zLCBkYXRhKSB7XHJcbiAgICBzdXBlcigpO1xyXG4gICAgaWYoX19ERVZfXykge1xyXG4gICAgICBULlN0cmluZygpKGJhc2VVcmwpO1xyXG4gICAgICBvcHRpb25zU2hhcGUob3B0aW9ucyk7XHJcbiAgICAgIFQuT2JqZWN0KHZhbHVlc1R5cGUpKGRhdGEpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5vcmlnaW5hbE9wdGlvbnMgPSBvcHRpb25zO1xyXG4gICAgdGhpcy5vcHRpb25zID0gXy5kZWZhdWx0cyh7fSwgb3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xyXG4gICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybDtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICB0aGlzLnByb21pc2VzID0gXy5tYXBWYWx1ZXMoZGF0YSwgKFtlcnIsIHJlc10pID0+IFByb21pc2UucmVzb2x2ZShbZXJyLCByZXNdKSk7XHJcbiAgICB0aGlzLm9ic2VydmVycyA9IHt9O1xyXG4gICAgdGhpcy5yZWZyZXNoZXJzID0ge307XHJcbiAgfVxyXG5cclxuICBAZGV2UmV0dXJucyhULnNoYXBlKHtcclxuICAgIGJhc2VVcmw6IFQuU3RyaW5nKCksXHJcbiAgICBvcHRpb25zOiBvcHRpb25zU2hhcGUsXHJcbiAgICBkYXRhOiBULk9iamVjdCh2YWx1ZXNUeXBlKSxcclxuICB9KSlcclxuICBzZXJpYWxpemUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBiYXNlVXJsOiB0aGlzLmJhc2VVcmwsXHJcbiAgICAgIG9wdGlvbnM6IHRoaXMub3JpZ2luYWxPcHRpb25zLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGEsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuU3RyaW5nKCksIHZhbHVlU2hhcGUpXHJcbiAgQGRldlJldHVybnMoVC5pbnN0YW5jZU9mKEhUVFBGbHV4KSlcclxuICBwdXNoVmFsdWUocGFyYW1zLCBbZXJyLCByZXNdKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmNvbnN0cnVjdG9yLmtleUZvcihwYXJhbXMpO1xyXG4gICAgY29uc3QgdmFsdWUgPSBbZXJyLCByZXMsIG5ldyBEYXRlKCldO1xyXG4gICAgdGhpcy5kYXRhW2tleV0gPSAodGhpcy5kYXRhW2tleV0gfHwgW10pLmNvbmNhdCh2YWx1ZSk7XHJcbiAgICBpZihfLmhhcyh0aGlzLm9ic2VydmVycywga2V5KSkge1xyXG4gICAgICBfLmVhY2godGhpcy5vYnNlcnZlcnNba2V5XSwgKGZuKSA9PiBmbih2YWx1ZSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBAZGV2VGFrZXMoVC5TdHJpbmcoKSwgcGFyYW1zU2hhcGUpXHJcbiAgQGRldlJldHVybnMoVC5zaGFwZSh7XHJcbiAgICBmbHV4OiBULmluc3RhbmNlT2YoSFRUUEZsdXgpLFxyXG4gICAgcGFyYW1zOiBwYXJhbXNTaGFwZSxcclxuICB9KSlcclxuICBnZXQocGF0aCwgcGFyYW1zID0ge30pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGZsdXg6IHRoaXMsXHJcbiAgICAgIHBhcmFtczogT2JqZWN0LmFzc2lnbih7fSwgXy5kZWZhdWx0cyh7fSwgcGFyYW1zLCBkZWZhdWx0UGFyYW1zKSwgeyBwYXRoIH0pLFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhwYXJhbXNTaGFwZSlcclxuICBAZGV2UmV0dXJucyh2YWx1ZXNUeXBlKVxyXG4gIHZhbHVlcyhwYXJhbXMpIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuY29uc3RydWN0b3Iua2V5Rm9yKHBhcmFtcyk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIHNob3VsZCh0aGlzLmRhdGEpLmhhdmUucHJvcGVydHkoa2V5KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmRhdGFba2V5XTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhcclxuICAgIFQuU3RyaW5nKCksXHJcbiAgICBULm9uZU9mKFQuZXhhY3RseSgnZ2V0JyksIFQuZXhhY3RseSgncG9zdCcpKSxcclxuICAgIFQub3B0aW9uKFQuT2JqZWN0KCkpXHJcbiAgKVxyXG4gIEBkZXZSZXR1cm5zKFQuUHJvbWlzZSgpKVxyXG4gIHJlcXVlc3QocGF0aCwgbWV0aG9kLCBvcHRzID0ge30pIHtcclxuICAgIGxldCByZXE7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICByZXEgPSBzdXBlcmFnZW50W21ldGhvZF0odXJsLnJlc29sdmUodGhpcy5iYXNlVXJsLCBwYXRoKSlcclxuICAgICAgICAuYWNjZXB0KCdqc29uJylcclxuICAgICAgICAudGltZW91dCh0aGlzLm9wdGlvbnMubWF4UmVxdWVzdER1cmF0aW9uKTtcclxuICAgICAgaWYob3B0cy5xdWVyeSkge1xyXG4gICAgICAgIHJlcSA9IHJlcS5xdWVyeShvcHRzLnF1ZXJ5KTtcclxuICAgICAgfVxyXG4gICAgICBpZihvcHRzLmJvZHkpIHtcclxuICAgICAgICByZXEgPSByZXEuc2VuZChvcHRzLmJvZHkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlcS5lbmQoKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNvbHZlKHJlcy5ib2R5KTtcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLmNhbmNlbGxhYmxlKClcclxuICAgIC5jYXRjaChQcm9taXNlLkNhbmNlbGxhdGlvbkVycm9yLCAoZXJyKSA9PiB7XHJcbiAgICAgIHJlcS5hYm9ydCgpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oKHJlcykgPT4gW3ZvaWQgMCwgcmVzXSlcclxuICAgIC5jYXRjaCgoZXJyKSA9PiBbZXJyLnRvU3RyaW5nKCksIHZvaWQgMF0pO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1NoYXBlKVxyXG4gIEBkZXZSZXR1cm5zKFQuUHJvbWlzZSgpKVxyXG4gIHBvcHVsYXRlKHBhcmFtcykge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5rZXlGb3IocGFyYW1zKTtcclxuICAgIGNvbnN0IHsgcGF0aCwgcXVlcnkgfSA9IHBhcmFtcztcclxuICAgIGlmKCFfLmhhcyh0aGlzLnByb21pc2VzLCBrZXkpKSB7XHJcbiAgICAgIHRoaXMucHJvbWlzZXNba2V5XSA9IHRoaXMuZmV0Y2gocGF0aCwgJ2dldCcsIHsgcXVlcnkgfSlcclxuICAgICAgICAudGhlbigoW2VyciwgcmVzXSkgPT4gdGhpcy5wdXNoVmFsdWUoa2V5LCBbZXJyLCByZXNdKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlc1trZXldO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuc2hhcGUoe1xyXG4gICAgcGF0aDogVC5TdHJpbmcoKSxcclxuICAgIHF1ZXJ5OiBULm9wdGlvbihULmFueSgpKSxcclxuICAgIGJvZHk6IFQub3B0aW9uKFQuYW55KCkpLFxyXG4gIH0pKVxyXG4gIEBkZXZSZXR1cm5zKFQuUHJvbWlzZSgpKVxyXG4gIHBvc3QoeyBwYXRoLCBxdWVyeSwgYm9keSB9KSB7XHJcbiAgICByZXR1cm4gdGhpcy5mZXRjaChwYXRoLCAncG9zdCcsIHsgcXVlcnksIGJvZHkgfSlcclxuICAgIC50aGVuKChbLCBlcnIsIHJlc10pID0+IHtcclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXMuYm9keTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1NoYXBlLCBULkZ1bmN0aW9uKCkpXHJcbiAgQGRldlJldHVybnMoVC5GdW5jdGlvbigpKVxyXG4gIG9ic2VydmUocGFyYW1zLCBmbikge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5rZXlGb3IocGFyYW1zKTtcclxuICAgIGlmKCFfLmhhcyh0aGlzLm9ic2VydmVycywga2V5KSkge1xyXG4gICAgICB0aGlzLm9ic2VydmVyc1trZXldID0gW107XHJcbiAgICAgIGNvbnN0IHsgcGF0aCwgcXVlcnksIHJlZnJlc2hFdmVyeSB9ID0gcGFyYW1zO1xyXG4gICAgICBpZihyZWZyZXNoRXZlcnkpIHtcclxuICAgICAgICB0aGlzLnJlZnJlc2hlcnNba2V5XSA9IHNldEludGVydmFsKCgpID0+XHJcbiAgICAgICAgICB0aGlzLmZldGNoKHBhdGgsICdnZXQnLCB7IHF1ZXJ5IH0pXHJcbiAgICAgICAgICAgIC50aGVuKChbZXJyLCByZXNdKSA9PiB0aGlzLnB1c2hWYWx1ZShrZXksIFtlcnIsIHJlc10pKVxyXG4gICAgICAgICwgcmVmcmVzaEV2ZXJ5KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5vYnNlcnZlcnNba2V5XS5wdXNoKGZuKTtcclxuICAgIGlmKHRoaXMucHJvbWlzZXNba2V5XSkge1xyXG4gICAgICBfLmRlZmVyKCgpID0+IF8uZWFjaCh0aGlzLmRhdGFba2V5XSwgKFtlcnIsIHJlc10pID0+IGZuKFtlcnIsIHJlc10pKSk7XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgdGhpcy5wb3B1bGF0ZShwYXJhbXMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICgpID0+IHtcclxuICAgICAgdGhpcy5vYnNlcnZlcnNba2V5XS5zcGxpY2UodGhpcy5vYnNlcnZlcnNba2V5XS5pbmRleE9mKGZuKSwgMSk7XHJcbiAgICAgIGlmKHRoaXMub2JzZXJ2ZXJzW2tleV0ubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgaWYoXy5oYXModGhpcy5yZWZyZXNoZXJzLCBrZXkpKSB7XHJcbiAgICAgICAgICBjbGVhckludGVydmFsKHRoaXMucmVmcmVzaGVyc1trZXldKTtcclxuICAgICAgICAgIGRlbGV0ZSB0aGlzLnJlZnJlc2hlcnNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVsZXRlIHRoaXMub2JzZXJ2ZXJzW2tleV07XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuZGF0YVtrZXldO1xyXG4gICAgICAgIGRlbGV0ZSB0aGlzLnByb21pc2VzW2tleV07XHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIVFRQRmx1eDtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
