'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createDecoratedClass = require('babel-runtime/helpers/create-decorated-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _slicedToArray = require('babel-runtime/helpers/sliced-to-array')['default'];

var _Object$assign = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _superagent = require('superagent');

var _superagent2 = _interopRequireDefault(_superagent);

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _shouldAsFunction = require('should/as-function');

var _shouldAsFunction2 = _interopRequireDefault(_shouldAsFunction);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _2 = require('../..');

var __DEV__ = process.env.NODE_ENV === 'development';

var optNumber = _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].Number());

var valueShape = _typecheckDecorator2['default'].shape([_typecheckDecorator2['default'].bool(), _typecheckDecorator2['default'].option(_typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].instanceOf(Error), _typecheckDecorator2['default'].String())), _typecheckDecorator2['default'].any(), _typecheckDecorator2['default'].oneOf(_typecheckDecorator2['default'].instanceOf(Date), _typecheckDecorator2['default'].String())]);
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
    decorators: [(0, _typecheckDecorator.returns)(_typecheckDecorator2['default'].instanceOf(HTTPFlux)), (0, _typecheckDecorator.takes)(_typecheckDecorator2['default'].shape({
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
    decorators: [(0, _typecheckDecorator.returns)(_typecheckDecorator2['default'].String()), (0, _typecheckDecorator.takes)(paramsShape)],
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

    _get(Object.getPrototypeOf(HTTPFlux.prototype), 'constructor', this).call(this);
    if (__DEV__) {
      _typecheckDecorator2['default'].String()(baseUrl);
      optionsShape(options);
      _typecheckDecorator2['default'].Object(valuesType)(data);
    }
    this.originalOptions = options;
    this.options = _lodash2['default'].defaults(options, defaultOptions);
    this.baseUrl = baseUrl;
    this.data = data;
  }

  _createDecoratedClass(HTTPFlux, [{
    key: 'serialize',
    decorators: [(0, _typecheckDecorator.returns)(_typecheckDecorator2['default'].shape({
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
    decorators: [(0, _typecheckDecorator.returns)(_typecheckDecorator2['default'].instanceOf(HTTPFlux)), (0, _typecheckDecorator.takes)(_typecheckDecorator2['default'].String(), _typecheckDecorator2['default'].shape([_typecheckDecorator2['default'].String(), _typecheckDecorator2['default'].any()]))],
    value: function pushValue(params, _ref2) {
      var _ref22 = _slicedToArray(_ref2, 3);

      var pending = _ref22[0];
      var err = _ref22[1];
      var res = _ref22[2];

      var key = this.constructor.keyFor(params);
      this.data[key] = (this.data[key] || []).concat([[pending, err, res, new Date()]]);
      return this;
    }
  }, {
    key: 'request',
    decorators: [(0, _typecheckDecorator.returns)(_typecheckDecorator2['default'].instanceOf(_superagent2['default'].Request)), (0, _typecheckDecorator.takes)(_typecheckDecorator2['default'].String())],
    value: function request(method, path) {
      return _superagent2['default'][method](_url2['default'].resolve(this.baseUrl, path)).accept('json').timeout(this.options.maxRequestDuration);
    }
  }, {
    key: 'get',
    decorators: [(0, _typecheckDecorator.returns)(_typecheckDecorator2['default'].shape({
      flux: _typecheckDecorator2['default'].instanceOf(HTTPFlux),
      params: paramsShape
    })), (0, _typecheckDecorator.takes)(_typecheckDecorator2['default'].String(), paramsShape)],
    value: function get(path) {
      var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      return {
        flux: this,
        params: _Object$assign({}, _lodash2['default'].defaults(params, defaultParams), { path: path })
      };
    }
  }, {
    key: 'values',
    decorators: [(0, _typecheckDecorator.returns)(valuesType), (0, _typecheckDecorator.takes)(paramsShape)],
    value: function values(params) {
      var key = this.constructor.keyFor(params);
      if (__DEV__) {
        (0, _shouldAsFunction2['default'])(this.data).have.property(key);
      }
      return this.data[key];
    }
  }, {
    key: 'populate',
    decorators: [(0, _typecheckDecorator.returns)(_typecheckDecorator2['default'].Promise()), (0, _typecheckDecorator.takes)(paramsShape)],
    value: function populate(_ref3) {
      var _this = this;

      var path = _ref3.path;
      var query = _ref3.query;

      var req = undefined;
      return new _bluebird2['default'](function (resolve, reject) {
        req = _this.pushValue([true, null, null]).request('get', path).query(query).end(function (err, res) {
          if (err) {
            return reject(err);
          }
          resolve(res.body);
        });
      }).cancellable()['catch'](_bluebird2['default'].CancellationError, function (err) {
        req.abort();
        throw err;
      }).then(function (res) {
        return [false, null, res];
      })['catch'](function (err) {
        return [false, err.toString(), void 0];
      }).then(function (_ref4) {
        var _ref42 = _slicedToArray(_ref4, 3);

        var pending = _ref42[0];
        var err = _ref42[1];
        var res = _ref42[2];
        return _this.pushValue(pending, err, res);
      });
    }
  }]);

  return HTTPFlux;
})(_2.Flux);

exports['default'] = HTTPFlux;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9IVFRQRmx1eC5qc3giXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBQWMsUUFBUTs7OzswQkFDRixZQUFZOzs7O2tDQUNFLHFCQUFxQjs7OztnQ0FDcEMsb0JBQW9COzs7O21CQUN2QixLQUFLOzs7O3dCQUNELFVBQVU7Ozs7aUJBR1QsT0FBTzs7QUFGNUIsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEtBQUssYUFBYSxDQUFDOztBQUl2RCxJQUFNLFNBQVMsR0FBRyxnQ0FBRSxNQUFNLENBQUMsZ0NBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQzs7QUFFdkMsSUFBTSxVQUFVLEdBQUcsZ0NBQUUsS0FBSyxDQUFDLENBQ3pCLGdDQUFFLElBQUksRUFBRSxFQUNSLGdDQUFFLE1BQU0sQ0FBQyxnQ0FBRSxLQUFLLENBQUMsZ0NBQUUsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUFFLGdDQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFDbEQsZ0NBQUUsR0FBRyxFQUFFLEVBQ1AsZ0NBQUUsS0FBSyxDQUFDLGdDQUFFLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRSxnQ0FBRSxNQUFNLEVBQUUsQ0FBQyxDQUN4QyxDQUFDLENBQUM7QUFDSCxJQUFNLFVBQVUsR0FBRyxnQ0FBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRXZDLElBQU0sWUFBWSxHQUFHLGdDQUFFLEtBQUssQ0FBQztBQUMzQixvQkFBa0IsRUFBRSxTQUFTO0FBQzdCLFdBQVMsRUFBRSxTQUFTO0NBQ3JCLENBQUMsQ0FBQztBQUNILElBQU0sY0FBYyxHQUFHO0FBQ3JCLG9CQUFrQixFQUFFLEtBQUs7QUFDekIsV0FBUyxFQUFFLElBQUk7Q0FDaEIsQ0FBQzs7QUFFRixJQUFNLFdBQVcsR0FBRyxnQ0FBRSxLQUFLLENBQUM7QUFDMUIsTUFBSSxFQUFFLGdDQUFFLE1BQU0sRUFBRTtBQUNoQixPQUFLLEVB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QyxVQUFDLEtBQW1CO29DQUFuQixLQUFtQjs7WUFBbEIsT0FBTztZQUFFLEdBQUc7WUFBRSxHQUFHO2VBQU0sTUFBSyxTQUFTLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7T0FBQSxDQUFDLENBQUM7S0FDbkU7OztTQWhIRyxRQUFROzs7cUJBbUhDLFFBQVEiLCJmaWxlIjoiX190ZXN0c19fL2ZpeHR1cmVzL0hUVFBGbHV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHJlcXVlc3QgZnJvbSAnc3VwZXJhZ2VudCc7XHJcbmltcG9ydCBULCB7IHRha2VzLCByZXR1cm5zIH0gZnJvbSAndHlwZWNoZWNrLWRlY29yYXRvcic7XHJcbmltcG9ydCBzaG91bGQgZnJvbSAnc2hvdWxkL2FzLWZ1bmN0aW9uJztcclxuaW1wb3J0IHVybCBmcm9tICd1cmwnO1xyXG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XHJcbmNvbnN0IF9fREVWX18gPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JztcclxuXHJcbmltcG9ydCB7IEZsdXggfSBmcm9tICcuLi8uLic7XHJcblxyXG5jb25zdCBvcHROdW1iZXIgPSBULm9wdGlvbihULk51bWJlcigpKTtcclxuXHJcbmNvbnN0IHZhbHVlU2hhcGUgPSBULnNoYXBlKFtcclxuICBULmJvb2woKSxcclxuICBULm9wdGlvbihULm9uZU9mKFQuaW5zdGFuY2VPZihFcnJvciksIFQuU3RyaW5nKCkpKSxcclxuICBULmFueSgpLFxyXG4gIFQub25lT2YoVC5pbnN0YW5jZU9mKERhdGUpLCBULlN0cmluZygpKSxcclxuXSk7XHJcbmNvbnN0IHZhbHVlc1R5cGUgPSBULkFycmF5KHZhbHVlU2hhcGUpO1xyXG5cclxuY29uc3Qgb3B0aW9uc1NoYXBlID0gVC5zaGFwZSh7XHJcbiAgbWF4UmVxdWVzdER1cmF0aW9uOiBvcHROdW1iZXIsXHJcbiAgbWF4QWdlbnRzOiBvcHROdW1iZXIsXHJcbn0pO1xyXG5jb25zdCBkZWZhdWx0T3B0aW9ucyA9IHtcclxuICBtYXhSZXF1ZXN0RHVyYXRpb246IDMwMDAwLFxyXG4gIG1heEFnZW50czogMTAwMCxcclxufTtcclxuXHJcbmNvbnN0IHBhcmFtc1NoYXBlID0gVC5zaGFwZSh7XHJcbiAgcGF0aDogVC5TdHJpbmcoKSxcclxuICBxdWVyeTogVC5PYmplY3QoKSxcclxuICByZWZyZXNoRXZlcnk6IG9wdE51bWJlcixcclxufSk7XHJcbmNvbnN0IGRlZmF1bHRQYXJhbXMgPSB7XHJcbiAgcmVmcmVzaEV2ZXJ5OiBudWxsLFxyXG4gIGF1dGhUb2tlbjogbnVsbCxcclxufTtcclxuXHJcbmNsYXNzIEhUVFBGbHV4IGV4dGVuZHMgRmx1eCB7XHJcbiAgc3RhdGljIGRpc3BsYXlOYW1lID0gJ0hUVFBGbHV4JztcclxuXHJcbiAgQHRha2VzKFQuc2hhcGUoe1xyXG4gICAgYmFzZVVybDogVC5TdHJpbmcoKSxcclxuICAgIG9wdGlvbnM6IG9wdGlvbnNTaGFwZSxcclxuICAgIGRhdGE6IFQuT2JqZWN0KHZhbHVlc1R5cGUpLFxyXG4gIH0pKVxyXG4gIEByZXR1cm5zKFQuaW5zdGFuY2VPZihIVFRQRmx1eCkpXHJcbiAgc3RhdGljIHVuc2VyaWFsaXplKHsgYmFzZVVybCwgb3B0aW9ucywgZGF0YSB9KSB7XHJcbiAgICByZXR1cm4gbmV3IEhUVFBGbHV4KGJhc2VVcmwsIG9wdGlvbnMsIGRhdGEpO1xyXG4gIH1cclxuXHJcbiAgQHRha2VzKHBhcmFtc1NoYXBlKVxyXG4gIEByZXR1cm5zKFQuU3RyaW5nKCkpXHJcbiAgc3RhdGljIGtleUZvcihwYXJhbXMpIHtcclxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShwYXJhbXMpO1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoYmFzZVVybCwgb3B0aW9ucywgZGF0YSkge1xyXG4gICAgc3VwZXIoKTtcclxuICAgIGlmKF9fREVWX18pIHtcclxuICAgICAgVC5TdHJpbmcoKShiYXNlVXJsKTtcclxuICAgICAgb3B0aW9uc1NoYXBlKG9wdGlvbnMpO1xyXG4gICAgICBULk9iamVjdCh2YWx1ZXNUeXBlKShkYXRhKTtcclxuICAgIH1cclxuICAgIHRoaXMub3JpZ2luYWxPcHRpb25zID0gb3B0aW9ucztcclxuICAgIHRoaXMub3B0aW9ucyA9IF8uZGVmYXVsdHMob3B0aW9ucywgZGVmYXVsdE9wdGlvbnMpO1xyXG4gICAgdGhpcy5iYXNlVXJsID0gYmFzZVVybDtcclxuICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgfVxyXG5cclxuICBAcmV0dXJucyhULnNoYXBlKHtcclxuICAgIGJhc2VVcmw6IFQuU3RyaW5nKCksXHJcbiAgICBvcHRpb25zOiBvcHRpb25zU2hhcGUsXHJcbiAgICBkYXRhOiBULk9iamVjdCh2YWx1ZXNUeXBlKSxcclxuICB9KSlcclxuICBzZXJpYWxpemUoKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBiYXNlVXJsOiB0aGlzLmJhc2VVcmwsXHJcbiAgICAgIG9wdGlvbnM6IHRoaXMub3JpZ2luYWxPcHRpb25zLFxyXG4gICAgICBkYXRhOiB0aGlzLmRhdGEsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgQHRha2VzKFxyXG4gICAgVC5TdHJpbmcoKSxcclxuICAgIFQuc2hhcGUoW1QuU3RyaW5nKCksIFQuYW55KCldKVxyXG4gIClcclxuICBAcmV0dXJucyhULmluc3RhbmNlT2YoSFRUUEZsdXgpKVxyXG4gIHB1c2hWYWx1ZShwYXJhbXMsIFtwZW5kaW5nLCBlcnIsIHJlc10pIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuY29uc3RydWN0b3Iua2V5Rm9yKHBhcmFtcyk7XHJcbiAgICB0aGlzLmRhdGFba2V5XSA9ICh0aGlzLmRhdGFba2V5XSB8fCBbXSkuY29uY2F0KFtbcGVuZGluZywgZXJyLCByZXMsIG5ldyBEYXRlKCldXSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIEB0YWtlcyhULlN0cmluZygpKVxyXG4gIEByZXR1cm5zKFQuaW5zdGFuY2VPZihyZXF1ZXN0LlJlcXVlc3QpKVxyXG4gIHJlcXVlc3QobWV0aG9kLCBwYXRoKSB7XHJcbiAgICByZXR1cm4gcmVxdWVzdFttZXRob2RdKHVybC5yZXNvbHZlKHRoaXMuYmFzZVVybCwgcGF0aCkpXHJcbiAgICAgIC5hY2NlcHQoJ2pzb24nKVxyXG4gICAgICAudGltZW91dCh0aGlzLm9wdGlvbnMubWF4UmVxdWVzdER1cmF0aW9uKTtcclxuICB9XHJcblxyXG4gIEB0YWtlcyhcclxuICAgIFQuU3RyaW5nKCksXHJcbiAgICBwYXJhbXNTaGFwZVxyXG4gIClcclxuICBAcmV0dXJucyhULnNoYXBlKHtcclxuICAgIGZsdXg6IFQuaW5zdGFuY2VPZihIVFRQRmx1eCksXHJcbiAgICBwYXJhbXM6IHBhcmFtc1NoYXBlLFxyXG4gIH0pKVxyXG4gIGdldChwYXRoLCBwYXJhbXMgPSB7fSkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZmx1eDogdGhpcyxcclxuICAgICAgcGFyYW1zOiBPYmplY3QuYXNzaWduKHt9LCBfLmRlZmF1bHRzKHBhcmFtcywgZGVmYXVsdFBhcmFtcyksIHsgcGF0aCB9KSxcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBAdGFrZXMocGFyYW1zU2hhcGUpXHJcbiAgQHJldHVybnModmFsdWVzVHlwZSlcclxuICB2YWx1ZXMocGFyYW1zKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmNvbnN0cnVjdG9yLmtleUZvcihwYXJhbXMpO1xyXG4gICAgaWYoX19ERVZfXykge1xyXG4gICAgICBzaG91bGQodGhpcy5kYXRhKS5oYXZlLnByb3BlcnR5KGtleSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5kYXRhW2tleV07XHJcbiAgfVxyXG5cclxuICBAdGFrZXMocGFyYW1zU2hhcGUpXHJcbiAgQHJldHVybnMoVC5Qcm9taXNlKCkpXHJcbiAgcG9wdWxhdGUoeyBwYXRoLCBxdWVyeSB9KSB7XHJcbiAgICBsZXQgcmVxO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgcmVxID0gdGhpcy5wdXNoVmFsdWUoW3RydWUsIG51bGwsIG51bGxdKVxyXG4gICAgICAgIC5yZXF1ZXN0KCdnZXQnLCBwYXRoKVxyXG4gICAgICAgIC5xdWVyeShxdWVyeSlcclxuICAgICAgICAuZW5kKChlcnIsIHJlcykgPT4ge1xyXG4gICAgICAgICAgaWYoZXJyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJlc29sdmUocmVzLmJvZHkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSlcclxuICAgIC5jYW5jZWxsYWJsZSgpXHJcbiAgICAuY2F0Y2goUHJvbWlzZS5DYW5jZWxsYXRpb25FcnJvciwgKGVycikgPT4ge1xyXG4gICAgICByZXEuYWJvcnQoKTtcclxuICAgICAgdGhyb3cgZXJyO1xyXG4gICAgfSlcclxuICAgIC50aGVuKChyZXMpID0+IFtmYWxzZSwgbnVsbCwgcmVzXSlcclxuICAgIC5jYXRjaCgoZXJyKSA9PiBbZmFsc2UsIGVyci50b1N0cmluZygpLCB2b2lkIDBdKVxyXG4gICAgLnRoZW4oKFtwZW5kaW5nLCBlcnIsIHJlc10pID0+IHRoaXMucHVzaFZhbHVlKHBlbmRpbmcsIGVyciwgcmVzKSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBIVFRQRmx1eDtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9