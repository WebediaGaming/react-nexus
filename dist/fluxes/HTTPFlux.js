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
      var val = _ref2[1];
      var date = _ref2[2];
      return _bluebird2['default'].resolve([err, val, date]);
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
      var val = _ref3[1];

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
      }).then(function (val) {
        return [void 0, val];
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
          var val = _ref4[1];
          return _this2.pushVersion(key, [err, val]);
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
                var val = _ref7[1];
                return _this3.pushVersion(key, [err, val]);
              });
            }, refreshEvery);
          }
        })();
      }
      this.observers[key].push(fn);
      if (this.promises[key]) {
        _lodash2['default'].defer(function () {
          return _lodash2['default'].each(_this3.versions(params), function (_ref8) {
            var err = _ref8[0];
            var val = _ref8[1];
            var date = _ref8[2];
            return fn([err, val, date]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZsdXhlcy9IVFRQRmx1eC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7OzswQkFDQyxZQUFZOzs7O21CQUNuQixLQUFLOzs7O3dCQUNELFVBQVU7Ozs7a0NBQzhCLHFCQUFxQjs7OztxQkFFaEUsUUFBUTs7OzswQkFDd0MsZ0JBQWdCOztBQUVqRixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxhQUFhLENBQUM7O0FBRXZELElBQU0sU0FBUyxHQUFHLGdDQUFFLE1BQU0sQ0FBQyxnQ0FBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDOztBQUV2QyxJQUFNLFdBQVcsR0FBRyxnQ0FBRSxLQUFLLENBQUM7QUFDMUIsb0JBQWtCLEVBQUUsU0FBUztBQUM3QixXQUFTLEVBQUUsU0FBUztDQUNyQixDQUFDLENBQUM7QUFDSCxJQUFNLGNBQWMsR0FBRztBQUNyQixvQkFBa0IsRUFBRSxLQUFLO0FBQ3pCLFdBQVMsRUFBRSxJQUFJO0NBQ2hCLENBQUM7O0FBRUYsSUFBTSxVQUFVLEdBQUcsZ0NBQUUsS0FBSyxDQUFDO0FBQ3pCLE1BQUksRUFBRSxnQ0FBRSxNQUFNLEVBQUU7QUFDaEIsT0FBSyxFQUFFLGdDQUFFLE1BQU0sRUFBRTtBQUNqQixjQUFZLEVBQUUsU0FBUztDQUN4QixDQUFDLENBQUM7QUFDSCxJQUFNLGFBQWEsR0FBRztBQUNwQixPQUFLLEVBQUUsRUFBRTtBQUNULGNBQVksRUFBRSxLQUFLLENBQUM7Q0FDckIsQ0FBQzs7SUFFSSxRQUFRO1lBQVIsUUFBUTs7d0JBQVIsUUFBUTs7aUJBUVgsNEJBQVcsZ0NBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBTGxDLDBCQUFTLGdDQUFFLEtBQUssQ0FBQztBQUNoQixhQUFPLEVBQUUsZ0NBQUUsTUFBTSxFQUFFO0FBQ25CLGFBQU8sRUFBRSxXQUFXO0FBQ3BCLFVBQUksRUFBRSxnQ0FBRSxNQUFNLENBQUMsRUFBRSxJQUFJLHNCQUFjLEVBQUUsQ0FBQztLQUN2QyxDQUFDLENBQUM7V0FFZSxxQkFBQyxJQUEwQixFQUFFO1VBQTFCLE9BQU8sR0FBVCxJQUEwQixDQUF4QixPQUFPO1VBQUUsT0FBTyxHQUFsQixJQUEwQixDQUFmLE9BQU87VUFBRSxJQUFJLEdBQXhCLElBQTBCLENBQU4sSUFBSTs7QUFDekMsYUFBTyxJQUFJLFFBQVEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzdDOzs7aUJBR0EsNEJBQVcsZ0NBQUUsTUFBTSxFQUFFLENBQUMsRUFEdEIsMEJBQVMsVUFBVSxDQUFDO1dBRVIsZ0JBQUMsTUFBTSxFQUFFO0FBQ3BCLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMvQjs7O1dBaEJvQixVQUFVOzs7O0FBa0JwQixXQW5CUCxRQUFRLENBbUJBLE9BQU8sRUFBMkI7UUFBekIsT0FBTyx5REFBRyxFQUFFO1FBQUUsSUFBSSx5REFBRyxFQUFFOzswQkFuQnhDLFFBQVE7O0FBb0JWLG9CQUFPLENBQUM7QUFDUixRQUFHLE9BQU8sRUFBRTtBQUNWLHNDQUFFLE1BQU0sRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3BCLGlCQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsc0NBQUUsTUFBTSxDQUFDLEVBQUUsSUFBSSxzQkFBYyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN4QztBQUNELFFBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsb0JBQUUsUUFBUSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDdkQsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsUUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsUUFBSSxDQUFDLFFBQVEsR0FBRyxvQkFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLFVBQUMsS0FBZ0I7VUFBZixHQUFHLEdBQUosS0FBZ0I7VUFBVixHQUFHLEdBQVQsS0FBZ0I7VUFBTCxJQUFJLEdBQWYsS0FBZ0I7YUFBSyxzQkFBUSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQUEsQ0FBQyxDQUFDO0FBQzNGLFFBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFFBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0dBQ3RCOzt3QkFqQ0csUUFBUTs7aUJBbUNYLDRCQUFXLGdDQUFFLEtBQUssQ0FBQztBQUNsQixhQUFPLEVBQUUsZ0NBQUUsTUFBTSxFQUFFO0FBQ25CLGFBQU8sRUFBRSxXQUFXO0FBQ3BCLFVBQUksRUFBRSxnQ0FBRSxNQUFNLENBQUMsRUFBRSxJQUFJLHNCQUFjLEVBQUUsQ0FBQztLQUN2QyxDQUFDLENBQUM7V0FDTSxxQkFBRztBQUNWLGFBQU87QUFDTCxlQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU87QUFDckIsZUFBTyxFQUFFLElBQUksQ0FBQyxlQUFlO0FBQzdCLFlBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtPQUNoQixDQUFDO0tBQ0g7OztpQkFHQSw0QkFBVyxnQ0FBRSxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsRUFEbEMsMEJBQVMsZ0NBQUUsTUFBTSxFQUFFLHNCQUFjO1dBRXZCLHFCQUFDLEdBQUcsRUFBRSxLQUFVLEVBQUU7VUFBWCxHQUFHLEdBQUosS0FBVTtVQUFKLEdBQUcsR0FBVCxLQUFVOztBQUN6QixVQUFNLE9BQU8sR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQSxDQUFFLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDMUQsVUFBRyxvQkFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRTtBQUM3Qiw0QkFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRSxVQUFDLEVBQUU7aUJBQUssRUFBRSxDQUFDLE9BQU8sQ0FBQztTQUFBLENBQUMsQ0FBQztPQUNsRDtBQUNELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztpQkFHQSw0QkFBVyxnQ0FBRSxLQUFLLENBQUM7QUFDbEIsVUFBSSxFQUFFLGdDQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUM7QUFDNUIsWUFBTSxFQUFFLFVBQVU7S0FDbkIsQ0FBQyxDQUFDLEVBSkYsMEJBQVMsZ0NBQUUsTUFBTSxFQUFFLEVBQUUsZ0NBQUUsTUFBTSxFQUFFLENBQUM7V0FLOUIsYUFBQyxJQUFJLEVBQWU7VUFBYixNQUFNLHlEQUFHLEVBQUU7O0FBQ25CLGFBQU87QUFDTCxZQUFJLEVBQUUsSUFBSTtBQUNWLGNBQU0sRUFBRSxlQUFjLEVBQUUsRUFBRSxvQkFBRSxRQUFRLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsRUFBRSxFQUFFLElBQUksRUFBSixJQUFJLEVBQUUsQ0FBQztPQUMzRSxDQUFDO0tBQ0g7OztpQkFHQSxpREFBd0IsRUFEeEIsMEJBQVMsVUFBVSxDQUFDO1dBRWIsa0JBQUMsTUFBTSxFQUFFO0FBQ2YsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDNUMsVUFBRyxDQUFDLG9CQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQ3pCLFlBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO09BQ3JCO0FBQ0QsYUFBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3ZCOzs7aUJBT0EsNEJBQVcsZ0NBQUUsT0FBTyxFQUFFLENBQUMsRUFMdkIsMEJBQ0MsZ0NBQUUsTUFBTSxFQUFFLEVBQ1YsZ0NBQUUsS0FBSyxDQUFDLGdDQUFFLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxnQ0FBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDNUMsZ0NBQUUsTUFBTSxDQUFDLGdDQUFFLE1BQU0sRUFBRSxDQUFDLENBQ3JCO1dBRU0saUJBQUMsSUFBSSxFQUFFLE1BQU0sRUFBYTs7O1VBQVgsSUFBSSx5REFBRyxFQUFFOztBQUM3QixVQUFJLEdBQUcsWUFBQSxDQUFDO0FBQ1IsYUFBTywwQkFBWSxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsV0FBRyxHQUFHLHdCQUFXLE1BQU0sQ0FBQyxDQUFDLGlCQUFJLE9BQU8sQ0FBQyxNQUFLLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUN0RCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQ2QsT0FBTyxDQUFDLE1BQUssT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDNUMsWUFBRyxJQUFJLENBQUMsS0FBSyxFQUFFO0FBQ2IsYUFBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO0FBQ0QsWUFBRyxJQUFJLENBQUMsSUFBSSxFQUFFO0FBQ1osYUFBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzNCO0FBQ0QsV0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUs7QUFDcEIsY0FBRyxHQUFHLEVBQUU7QUFDTixtQkFBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDcEI7QUFDRCxpQkFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzFCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FDRCxXQUFXLEVBQUUsU0FDUixDQUFDLHNCQUFRLGlCQUFpQixFQUFFLFVBQUMsR0FBRyxFQUFLO0FBQ3pDLFdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNaLGNBQU0sR0FBRyxDQUFDO09BQ1gsQ0FBQyxDQUNELElBQUksQ0FBQyxVQUFDLEdBQUc7ZUFBSyxDQUFDLEtBQUssQ0FBQyxFQUFFLEdBQUcsQ0FBQztPQUFBLENBQUMsU0FDdkIsQ0FBQyxVQUFDLEdBQUc7ZUFBSyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztLQUMzQzs7O2lCQUdBLDRCQUFXLGdDQUFFLE9BQU8sRUFBRSxDQUFDLEVBRHZCLDBCQUFTLFVBQVUsQ0FBQztXQUViLGtCQUFDLE1BQU0sRUFBRTs7O0FBQ2YsVUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7VUFDcEMsSUFBSSxHQUFZLE1BQU0sQ0FBdEIsSUFBSTtVQUFFLEtBQUssR0FBSyxNQUFNLENBQWhCLEtBQUs7O0FBQ25CLFVBQUcsQ0FBQyxvQkFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsRUFBRTtBQUM3QixZQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsQ0FBQyxDQUN0RCxJQUFJLENBQUMsVUFBQyxLQUFVO2NBQVQsR0FBRyxHQUFKLEtBQVU7Y0FBSixHQUFHLEdBQVQsS0FBVTtpQkFBSyxPQUFLLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FBQSxDQUFDLENBQUM7T0FDNUQ7QUFDRCxhQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDM0I7OztpQkFPQSw0QkFBVyxnQ0FBRSxPQUFPLEVBQUUsQ0FBQyxFQUx2QiwwQkFBUyxnQ0FBRSxLQUFLLENBQUM7QUFDaEIsVUFBSSxFQUFFLGdDQUFFLE1BQU0sRUFBRTtBQUNoQixXQUFLLEVBQUUsZ0NBQUUsTUFBTSxDQUFDLGdDQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3hCLFVBQUksRUFBRSxnQ0FBRSxNQUFNLENBQUMsZ0NBQUUsR0FBRyxFQUFFLENBQUM7S0FDeEIsQ0FBQyxDQUFDO1dBRUMsY0FBQyxLQUFxQixFQUFFO1VBQXJCLElBQUksR0FBTixLQUFxQixDQUFuQixJQUFJO1VBQUUsS0FBSyxHQUFiLEtBQXFCLENBQWIsS0FBSztVQUFFLElBQUksR0FBbkIsS0FBcUIsQ0FBTixJQUFJOztBQUN0QixhQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsSUFBSSxFQUFKLElBQUksRUFBRSxDQUFDLENBQy9DLElBQUksQ0FBQyxVQUFDLEtBQVksRUFBSztZQUFkLEdBQUcsR0FBTixLQUFZO1lBQUosR0FBRyxHQUFYLEtBQVk7O0FBQ2pCLFlBQUcsR0FBRyxFQUFFO0FBQ04sZ0JBQU0sR0FBRyxDQUFDO1NBQ1g7QUFDRCxlQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUM7T0FDakIsQ0FBQyxDQUFDO0tBQ0o7OztpQkFHQSw0QkFBVyxnQ0FBRSxRQUFRLEVBQUUsQ0FBQyxFQUR4QiwwQkFBUyxVQUFVLEVBQUUsZ0NBQUUsUUFBUSxFQUFFLENBQUM7V0FFNUIsaUJBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRTs7O0FBQ2xCLFVBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzVDLFVBQUcsQ0FBQyxvQkFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsRUFBRTs7QUFDOUIsaUJBQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztjQUNqQixJQUFJLEdBQTBCLE1BQU0sQ0FBcEMsSUFBSTtjQUFFLEtBQUssR0FBbUIsTUFBTSxDQUE5QixLQUFLO2NBQUUsWUFBWSxHQUFLLE1BQU0sQ0FBdkIsWUFBWTs7QUFDakMsY0FBRyxZQUFZLEVBQUU7QUFDZixtQkFBSyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsV0FBVyxDQUFDO3FCQUNqQyxPQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFMLEtBQUssRUFBRSxDQUFDLENBQy9CLElBQUksQ0FBQyxVQUFDLEtBQVU7b0JBQVQsR0FBRyxHQUFKLEtBQVU7b0JBQUosR0FBRyxHQUFULEtBQVU7dUJBQUssT0FBSyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2VBQUEsQ0FBQzthQUFBLEVBQzFELFlBQVksQ0FBQyxDQUFDO1dBQ2pCOztPQUNGO0FBQ0QsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDN0IsVUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ3JCLDRCQUFFLEtBQUssQ0FBQztpQkFBTSxvQkFBRSxJQUFJLENBQUMsT0FBSyxRQUFRLENBQUMsTUFBTSxDQUFDLEVBQUUsVUFBQyxLQUFnQjtnQkFBZixHQUFHLEdBQUosS0FBZ0I7Z0JBQVYsR0FBRyxHQUFULEtBQWdCO2dCQUFMLElBQUksR0FBZixLQUFnQjttQkFBSyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO1dBQUEsQ0FBQztTQUFBLENBQUMsQ0FBQztPQUMxRixNQUNJO0FBQ0gsWUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN2QjtBQUNELGFBQU8sWUFBTTtBQUNYLGVBQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDL0QsWUFBRyxPQUFLLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO0FBQ25DLGNBQUcsb0JBQUUsR0FBRyxDQUFDLE9BQUssVUFBVSxFQUFFLEdBQUcsQ0FBQyxFQUFFO0FBQzlCLHlCQUFhLENBQUMsT0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQyxtQkFBTyxPQUFLLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUM3QjtBQUNELGlCQUFPLE9BQUssU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLGlCQUFPLE9BQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLGlCQUFPLE9BQUssUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzNCO09BQ0YsQ0FBQztLQUNIOzs7U0FoTEcsUUFBUTs7O3FCQW1MQyxRQUFRIiwiZmlsZSI6ImZsdXhlcy9IVFRQRmx1eC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBfIGZyb20gJ2xvZGFzaCc7XHJcbmltcG9ydCBzdXBlcmFnZW50IGZyb20gJ3N1cGVyYWdlbnQnO1xyXG5pbXBvcnQgdXJsIGZyb20gJ3VybCc7XHJcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcclxuaW1wb3J0IFQsIHsgdGFrZXMgYXMgZGV2VGFrZXMsIHJldHVybnMgYXMgZGV2UmV0dXJucyB9IGZyb20gJ3R5cGVjaGVjay1kZWNvcmF0b3InO1xyXG5cclxuaW1wb3J0IEZsdXggZnJvbSAnLi9GbHV4JztcclxuaW1wb3J0IHsgdmVyc2lvbiBhcyB2ZXJzaW9uVHlwZSwgdmVyc2lvbnMgYXMgdmVyc2lvbnNUeXBlIH0gZnJvbSAnLi4vdXRpbHMvdHlwZXMnO1xyXG5cclxuY29uc3QgX19ERVZfXyA9IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAnZGV2ZWxvcG1lbnQnO1xyXG5cclxuY29uc3Qgb3B0TnVtYmVyID0gVC5vcHRpb24oVC5OdW1iZXIoKSk7XHJcblxyXG5jb25zdCBvcHRpb25zVHlwZSA9IFQuc2hhcGUoe1xyXG4gIG1heFJlcXVlc3REdXJhdGlvbjogb3B0TnVtYmVyLFxyXG4gIG1heEFnZW50czogb3B0TnVtYmVyLFxyXG59KTtcclxuY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgbWF4UmVxdWVzdER1cmF0aW9uOiAzMDAwMCxcclxuICBtYXhBZ2VudHM6IDEwMDAsXHJcbn07XHJcblxyXG5jb25zdCBwYXJhbXNUeXBlID0gVC5zaGFwZSh7XHJcbiAgcGF0aDogVC5TdHJpbmcoKSxcclxuICBxdWVyeTogVC5PYmplY3QoKSxcclxuICByZWZyZXNoRXZlcnk6IG9wdE51bWJlcixcclxufSk7XHJcbmNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XHJcbiAgcXVlcnk6IHt9LFxyXG4gIHJlZnJlc2hFdmVyeTogdm9pZCAwLFxyXG59O1xyXG5cclxuY2xhc3MgSFRUUEZsdXggZXh0ZW5kcyBGbHV4IHtcclxuICBzdGF0aWMgZGlzcGxheU5hbWUgPSAnSFRUUEZsdXgnO1xyXG5cclxuICBAZGV2VGFrZXMoVC5zaGFwZSh7XHJcbiAgICBiYXNlVXJsOiBULlN0cmluZygpLFxyXG4gICAgb3B0aW9uczogb3B0aW9uc1R5cGUsXHJcbiAgICBkYXRhOiBULk9iamVjdCh7IHR5cGU6IHZlcnNpb25zVHlwZSB9KSxcclxuICB9KSlcclxuICBAZGV2UmV0dXJucyhULmluc3RhbmNlT2YoSFRUUEZsdXgpKVxyXG4gIHN0YXRpYyB1bnNlcmlhbGl6ZSh7IGJhc2VVcmwsIG9wdGlvbnMsIGRhdGEgfSkge1xyXG4gICAgcmV0dXJuIG5ldyBIVFRQRmx1eChiYXNlVXJsLCBvcHRpb25zLCBkYXRhKTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhwYXJhbXNUeXBlKVxyXG4gIEBkZXZSZXR1cm5zKFQuU3RyaW5nKCkpXHJcbiAgc3RhdGljIGtleUZvcihwYXJhbXMpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYXJhbXMpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoYmFzZVVybCwgb3B0aW9ucyA9IHt9LCBkYXRhID0ge30pIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICBpZihfX0RFVl9fKSB7XHJcbiAgICAgIFQuU3RyaW5nKCkoYmFzZVVybCk7XHJcbiAgICAgIG9wdGlvbnNUeXBlKG9wdGlvbnMpO1xyXG4gICAgICBULk9iamVjdCh7IHR5cGU6IHZlcnNpb25zVHlwZSB9KShkYXRhKTtcclxuICAgIH1cclxuICAgIHRoaXMub3JpZ2luYWxPcHRpb25zID0gb3B0aW9ucztcclxuICAgIHRoaXMub3B0aW9ucyA9IF8uZGVmYXVsdHMoe30sIG9wdGlvbnMsIGRlZmF1bHRPcHRpb25zKTtcclxuICAgIHRoaXMuYmFzZVVybCA9IGJhc2VVcmw7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgdGhpcy5wcm9taXNlcyA9IF8ubWFwVmFsdWVzKGRhdGEsIChbZXJyLCB2YWwsIGRhdGVdKSA9PiBQcm9taXNlLnJlc29sdmUoW2VyciwgdmFsLCBkYXRlXSkpO1xyXG4gICAgdGhpcy5vYnNlcnZlcnMgPSB7fTtcclxuICAgIHRoaXMucmVmcmVzaGVycyA9IHt9O1xyXG4gIH1cclxuXHJcbiAgQGRldlJldHVybnMoVC5zaGFwZSh7XHJcbiAgICBiYXNlVXJsOiBULlN0cmluZygpLFxyXG4gICAgb3B0aW9uczogb3B0aW9uc1R5cGUsXHJcbiAgICBkYXRhOiBULk9iamVjdCh7IHR5cGU6IHZlcnNpb25zVHlwZSB9KSxcclxuICB9KSlcclxuICBzZXJpYWxpemUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBiYXNlVXJsOiB0aGlzLmJhc2VVcmwsXHJcbiAgICAgIG9wdGlvbnM6IHRoaXMub3JpZ2luYWxPcHRpb25zLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGEsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuU3RyaW5nKCksIHZlcnNpb25UeXBlKVxyXG4gIEBkZXZSZXR1cm5zKFQuaW5zdGFuY2VPZihIVFRQRmx1eCkpXHJcbiAgcHVzaFZlcnNpb24oa2V5LCBbZXJyLCB2YWxdKSB7XHJcbiAgICBjb25zdCB2ZXJzaW9uID0gW2VyciwgdmFsLCBuZXcgRGF0ZSgpXTtcclxuICAgIHRoaXMuZGF0YVtrZXldID0gKHRoaXMuZGF0YVtrZXldIHx8IFtdKS5jb25jYXQoW3ZlcnNpb25dKTtcclxuICAgIGlmKF8uaGFzKHRoaXMub2JzZXJ2ZXJzLCBrZXkpKSB7XHJcbiAgICAgIF8uZWFjaCh0aGlzLm9ic2VydmVyc1trZXldLCAoZm4pID0+IGZuKHZlcnNpb24pKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuU3RyaW5nKCksIFQuT2JqZWN0KCkpXHJcbiAgQGRldlJldHVybnMoVC5zaGFwZSh7XHJcbiAgICBmbHV4OiBULmluc3RhbmNlT2YoSFRUUEZsdXgpLFxyXG4gICAgcGFyYW1zOiBwYXJhbXNUeXBlLFxyXG4gIH0pKVxyXG4gIGdldChwYXRoLCBwYXJhbXMgPSB7fSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZmx1eDogdGhpcyxcclxuICAgICAgcGFyYW1zOiBPYmplY3QuYXNzaWduKHt9LCBfLmRlZmF1bHRzKHt9LCBwYXJhbXMsIGRlZmF1bHRQYXJhbXMpLCB7IHBhdGggfSksXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1R5cGUpXHJcbiAgQGRldlJldHVybnModmVyc2lvbnNUeXBlKVxyXG4gIHZlcnNpb25zKHBhcmFtcykge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5jb25zdHJ1Y3Rvci5rZXlGb3IocGFyYW1zKTtcclxuICAgIGlmKCFfLmhhcyh0aGlzLmRhdGEsIGtleSkpIHtcclxuICAgICAgdGhpcy5kYXRhW2tleV0gPSBbXTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmRhdGFba2V5XTtcclxuICB9XHJcblxyXG4gIEBkZXZUYWtlcyhcclxuICAgIFQuU3RyaW5nKCksXHJcbiAgICBULm9uZU9mKFQuZXhhY3RseSgnZ2V0JyksIFQuZXhhY3RseSgncG9zdCcpKSxcclxuICAgIFQub3B0aW9uKFQuT2JqZWN0KCkpXHJcbiAgKVxyXG4gIEBkZXZSZXR1cm5zKFQuUHJvbWlzZSgpKVxyXG4gIHJlcXVlc3QocGF0aCwgbWV0aG9kLCBvcHRzID0ge30pIHtcclxuICAgIGxldCByZXE7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICByZXEgPSBzdXBlcmFnZW50W21ldGhvZF0odXJsLnJlc29sdmUodGhpcy5iYXNlVXJsLCBwYXRoKSlcclxuICAgICAgICAuYWNjZXB0KCdqc29uJylcclxuICAgICAgICAudGltZW91dCh0aGlzLm9wdGlvbnMubWF4UmVxdWVzdER1cmF0aW9uKTtcclxuICAgICAgaWYob3B0cy5xdWVyeSkge1xyXG4gICAgICAgIHJlcSA9IHJlcS5xdWVyeShvcHRzLnF1ZXJ5KTtcclxuICAgICAgfVxyXG4gICAgICBpZihvcHRzLmJvZHkpIHtcclxuICAgICAgICByZXEgPSByZXEuc2VuZChvcHRzLmJvZHkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJlcS5lbmQoKGVyciwgcmVzKSA9PiB7XHJcbiAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICByZXR1cm4gcmVqZWN0KGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiByZXNvbHZlKHJlcy5ib2R5KTtcclxuICAgICAgfSk7XHJcbiAgICB9KVxyXG4gICAgLmNhbmNlbGxhYmxlKClcclxuICAgIC5jYXRjaChQcm9taXNlLkNhbmNlbGxhdGlvbkVycm9yLCAoZXJyKSA9PiB7XHJcbiAgICAgIHJlcS5hYm9ydCgpO1xyXG4gICAgICB0aHJvdyBlcnI7XHJcbiAgICB9KVxyXG4gICAgLnRoZW4oKHZhbCkgPT4gW3ZvaWQgMCwgdmFsXSlcclxuICAgIC5jYXRjaCgoZXJyKSA9PiBbZXJyLnRvU3RyaW5nKCksIHZvaWQgMF0pO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1R5cGUpXHJcbiAgQGRldlJldHVybnMoVC5Qcm9taXNlKCkpXHJcbiAgcG9wdWxhdGUocGFyYW1zKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmNvbnN0cnVjdG9yLmtleUZvcihwYXJhbXMpO1xyXG4gICAgY29uc3QgeyBwYXRoLCBxdWVyeSB9ID0gcGFyYW1zO1xyXG4gICAgaWYoIV8uaGFzKHRoaXMucHJvbWlzZXMsIGtleSkpIHtcclxuICAgICAgdGhpcy5wcm9taXNlc1trZXldID0gdGhpcy5yZXF1ZXN0KHBhdGgsICdnZXQnLCB7IHF1ZXJ5IH0pXHJcbiAgICAgICAgLnRoZW4oKFtlcnIsIHZhbF0pID0+IHRoaXMucHVzaFZlcnNpb24oa2V5LCBbZXJyLCB2YWxdKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlc1trZXldO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKFQuc2hhcGUoe1xyXG4gICAgcGF0aDogVC5TdHJpbmcoKSxcclxuICAgIHF1ZXJ5OiBULm9wdGlvbihULmFueSgpKSxcclxuICAgIGJvZHk6IFQub3B0aW9uKFQuYW55KCkpLFxyXG4gIH0pKVxyXG4gIEBkZXZSZXR1cm5zKFQuUHJvbWlzZSgpKVxyXG4gIHBvc3QoeyBwYXRoLCBxdWVyeSwgYm9keSB9KSB7XHJcbiAgICByZXR1cm4gdGhpcy5mZXRjaChwYXRoLCAncG9zdCcsIHsgcXVlcnksIGJvZHkgfSlcclxuICAgIC50aGVuKChbLCBlcnIsIHJlc10pID0+IHtcclxuICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgdGhyb3cgZXJyO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXMuYm9keTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgQGRldlRha2VzKHBhcmFtc1R5cGUsIFQuRnVuY3Rpb24oKSlcclxuICBAZGV2UmV0dXJucyhULkZ1bmN0aW9uKCkpXHJcbiAgb2JzZXJ2ZShwYXJhbXMsIGZuKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmNvbnN0cnVjdG9yLmtleUZvcihwYXJhbXMpO1xyXG4gICAgaWYoIV8uaGFzKHRoaXMub2JzZXJ2ZXJzLCBrZXkpKSB7XHJcbiAgICAgIHRoaXMub2JzZXJ2ZXJzW2tleV0gPSBbXTtcclxuICAgICAgY29uc3QgeyBwYXRoLCBxdWVyeSwgcmVmcmVzaEV2ZXJ5IH0gPSBwYXJhbXM7XHJcbiAgICAgIGlmKHJlZnJlc2hFdmVyeSkge1xyXG4gICAgICAgIHRoaXMucmVmcmVzaGVyc1trZXldID0gc2V0SW50ZXJ2YWwoKCkgPT5cclxuICAgICAgICAgIHRoaXMuZmV0Y2gocGF0aCwgJ2dldCcsIHsgcXVlcnkgfSlcclxuICAgICAgICAgICAgLnRoZW4oKFtlcnIsIHZhbF0pID0+IHRoaXMucHVzaFZlcnNpb24oa2V5LCBbZXJyLCB2YWxdKSlcclxuICAgICAgICAsIHJlZnJlc2hFdmVyeSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMub2JzZXJ2ZXJzW2tleV0ucHVzaChmbik7XHJcbiAgICBpZih0aGlzLnByb21pc2VzW2tleV0pIHtcclxuICAgICAgXy5kZWZlcigoKSA9PiBfLmVhY2godGhpcy52ZXJzaW9ucyhwYXJhbXMpLCAoW2VyciwgdmFsLCBkYXRlXSkgPT4gZm4oW2VyciwgdmFsLCBkYXRlXSkpKTtcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB0aGlzLnBvcHVsYXRlKHBhcmFtcyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gKCkgPT4ge1xyXG4gICAgICB0aGlzLm9ic2VydmVyc1trZXldLnNwbGljZSh0aGlzLm9ic2VydmVyc1trZXldLmluZGV4T2YoZm4pLCAxKTtcclxuICAgICAgaWYodGhpcy5vYnNlcnZlcnNba2V5XS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBpZihfLmhhcyh0aGlzLnJlZnJlc2hlcnMsIGtleSkpIHtcclxuICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5yZWZyZXNoZXJzW2tleV0pO1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMucmVmcmVzaGVyc1trZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlcnNba2V5XTtcclxuICAgICAgICBkZWxldGUgdGhpcy5kYXRhW2tleV07XHJcbiAgICAgICAgZGVsZXRlIHRoaXMucHJvbWlzZXNba2V5XTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEhUVFBGbHV4O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
