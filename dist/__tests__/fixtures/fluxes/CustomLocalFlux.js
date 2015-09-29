'use strict';

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createDecoratedClass = require('babel-runtime/helpers/create-decorated-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

exports.__esModule = true;

var _typecheckDecorator = require('typecheck-decorator');

var _typecheckDecorator2 = _interopRequireDefault(_typecheckDecorator);

var _fluxesLocalFlux = require('../../../fluxes/LocalFlux');

var _fluxesLocalFlux2 = _interopRequireDefault(_fluxesLocalFlux);

var _utilsTypes = require('../../../utils/types');

var CustomLocalFlux = (function (_LocalFlux) {
  _inherits(CustomLocalFlux, _LocalFlux);

  function CustomLocalFlux() {
    _classCallCheck(this, CustomLocalFlux);

    _LocalFlux.apply(this, arguments);
  }

  _createDecoratedClass(CustomLocalFlux, [{
    key: 'dispatch',
    decorators: [_typecheckDecorator.returns(_typecheckDecorator2['default'].Promise()), _typecheckDecorator.takes(_utilsTypes.action)],
    value: function dispatch(_ref) {
      var _this = this;

      var type = _ref.type;
      var payload = _ref.payload;

      return _Promise['try'](function () {
        if (type === 'set font size') {
          var fontSize = payload.fontSize;

          return _this.set('/fontSize', fontSize);
        }
        throw new TypeError('Unknown action type \'' + type + '\' for \'' + _this.constructor.displayName + '\'.');
      });
    }
  }], [{
    key: 'displayName',
    value: 'CustomLocalFlux',
    enumerable: true
  }]);

  return CustomLocalFlux;
})(_fluxesLocalFlux2['default']);

exports['default'] = CustomLocalFlux;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fdGVzdHNfXy9maXh0dXJlcy9mbHV4ZXMvQ3VzdG9tTG9jYWxGbHV4LmpzeCJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztrQ0FBNEQscUJBQXFCOzs7OytCQUUzRCwyQkFBMkI7Ozs7MEJBQ1osc0JBQXNCOztJQUVyRCxlQUFlO1lBQWYsZUFBZTs7V0FBZixlQUFlOzBCQUFmLGVBQWU7Ozs7O3dCQUFmLGVBQWU7O2lCQUlsQiw0QkFBVyxnQ0FBRSxPQUFPLEVBQUUsQ0FBQyxFQUR2Qiw2Q0FBb0I7V0FFYixrQkFBQyxJQUFpQixFQUFFOzs7VUFBakIsSUFBSSxHQUFOLElBQWlCLENBQWYsSUFBSTtVQUFFLE9BQU8sR0FBZixJQUFpQixDQUFULE9BQU87O0FBQ3RCLGFBQU8sZ0JBQVksWUFBTTtBQUN2QixZQUFHLElBQUksS0FBSyxlQUFlLEVBQUU7Y0FDbkIsUUFBUSxHQUFLLE9BQU8sQ0FBcEIsUUFBUTs7QUFDaEIsaUJBQU8sTUFBSyxHQUFHLENBQUMsV0FBVyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3hDO0FBQ0QsY0FBTSxJQUFJLFNBQVMsNEJBQXlCLElBQUksaUJBQVUsTUFBSyxXQUFXLENBQUMsV0FBVyxTQUFLLENBQUM7T0FDN0YsQ0FBQyxDQUFDO0tBQ0o7OztXQVpvQixpQkFBaUI7Ozs7U0FEbEMsZUFBZTs7O3FCQWdCTixlQUFlIiwiZmlsZSI6Il9fdGVzdHNfXy9maXh0dXJlcy9mbHV4ZXMvQ3VzdG9tTG9jYWxGbHV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFQsIHsgdGFrZXMgYXMgZGV2VGFrZXMsIHJldHVybnMgYXMgZGV2UmV0dXJucyB9IGZyb20gJ3R5cGVjaGVjay1kZWNvcmF0b3InO1xyXG5cclxuaW1wb3J0IExvY2FsRmx1eCBmcm9tICcuLi8uLi8uLi9mbHV4ZXMvTG9jYWxGbHV4JztcclxuaW1wb3J0IHsgYWN0aW9uIGFzIGFjdGlvblR5cGUgfSBmcm9tICcuLi8uLi8uLi91dGlscy90eXBlcyc7XHJcblxyXG5jbGFzcyBDdXN0b21Mb2NhbEZsdXggZXh0ZW5kcyBMb2NhbEZsdXgge1xyXG4gIHN0YXRpYyBkaXNwbGF5TmFtZSA9ICdDdXN0b21Mb2NhbEZsdXgnO1xyXG5cclxuICBAZGV2VGFrZXMoYWN0aW9uVHlwZSlcclxuICBAZGV2UmV0dXJucyhULlByb21pc2UoKSlcclxuICBkaXNwYXRjaCh7IHR5cGUsIHBheWxvYWQgfSkge1xyXG4gICAgcmV0dXJuIFByb21pc2UudHJ5KCgpID0+IHtcclxuICAgICAgaWYodHlwZSA9PT0gJ3NldCBmb250IHNpemUnKSB7XHJcbiAgICAgICAgY29uc3QgeyBmb250U2l6ZSB9ID0gcGF5bG9hZDtcclxuICAgICAgICByZXR1cm4gdGhpcy5zZXQoJy9mb250U2l6ZScsIGZvbnRTaXplKTtcclxuICAgICAgfVxyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBVbmtub3duIGFjdGlvbiB0eXBlICcke3R5cGV9JyBmb3IgJyR7dGhpcy5jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZX0nLmApO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDdXN0b21Mb2NhbEZsdXg7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
