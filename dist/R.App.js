"use strict";

var _classProps = function (child, staticProps, instanceProps) {
  if (staticProps) Object.defineProperties(child, staticProps);

  if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
};

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var React = R.React;
  var _ = R._;
  var should = R.should;
  var path = require("path");

  var App = (function () {
    var App = function App() {
      var _this = this;

      this.Flux = this.getFluxClass();
      this.Root = this.getRootClass();
      this.vars = this.getDefaultVars();
      this.template = this.getTemplate();
      this.templateLibs = this.getTemplateLibs();
      this.Plugins = this.getPluginsClasses();

      _.dev(function () {
        return _this.Flux.should.be.a.Function && _this.Root.should.be.a.Function && _this.vars.should.be.an.Object && _this.template.should.be.a.Function && _this.templateLibs.should.be.an.Object && _this.Plugins.should.be.an.Array;
      });
    };

    _classProps(App, null, {
      getFluxClass: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      getRootClass: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      getDefaultVars: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      getTemplate: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      getTemplateLibs: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      getPluginsClasses: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      getTemplateVars: {
        writable: true,
        value: function (_ref) {
          var req = _ref.req;
          _.abstract();
        }
      },
      render: {
        writable: true,
        value: function (_ref2) {
          var req = _ref2.req;
          var window = _ref2.window;

          _.dev(function () {
            return _.isServer() ? req.should.be.an.Object : window.should.be.an.Object;
          });
          return _.isServer() ? this._renderInServer(req) : this._renderInClient(window);
        }
      },
      _renderInServer: {
        writable: true,
        value: function (req) {
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            var guid, flux, headers, plugins, rootProps, surrogateRootComponent, rootComponentFactory, rootComponent, rootHtml, serializedFlux, vars, serializedHeaders;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _.isServer().should.be.ok && req.headers.should.be.ok;
                  });

                  guid = _.guid();
                  flux = new this.Flux();
                  headers = req.headers;
                  context$4$0.next = 6;
                  return flux.bootstrap({ req: req, headers: headers, guid: guid });

                case 6:
                  plugins = this.Plugins.map(function (Plugin) {
                    return new Plugin({ flux: flux, req: req });
                  });
                  rootProps = { flux: flux, plugins: plugins };
                  surrogateRootComponent = new this.Root.__ReactNexusSurrogate({}, rootProps);

                  if (!surrogateRootComponent.componentWillMount) {
                    _.dev(function () {
                      return console.error("Root component requires componentWillMount implementation. Maybe you forgot to mixin R.Root.Mixin?");
                    });
                  }
                  surrogateRootComponent.componentWillMount();
                  context$4$0.next = 13;
                  return surrogateRootComponent.prefetchFluxStores();

                case 13:

                  surrogateRootComponent.componentWillUnmount();

                  rootComponentFactory = React.createFactory(this.Root);
                  rootComponent = rootComponentFactory(rootProps);

                  flux.startInjectingFromStores();

                  rootHtml = React.renderToString(rootComponent);

                  flux.stopInjectingFromStores();
                  serializedFlux = flux.serialize();

                  flux.destroy();
                  plugins.forEach(function (plugin) {
                    return plugin.destroy();
                  });

                  context$4$0.next = 24;
                  return this.getTemplateVars({ req: req });

                case 24:
                  context$4$0.t0 = context$4$0.sent;
                  vars = _.extend({}, context$4$0.t0, this.vars);
                  serializedHeaders = _.base64Encode(JSON.stringify(headers));
                  return context$4$0.abrupt("return", this.template({ vars: vars, rootHtml: rootHtml, serializedFlux: serializedFlux, serializedHeaders: serializedHeaders, guid: guid }, this.templateLibs));

                case 28:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          }), this);
        }
      },
      _renderInClient: {
        writable: true,
        value: function (window) {
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            var flux, headers, guid, plugins, rootProps, rootComponentFactory, rootComponent;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              var _this2 = this;
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _.isClient().should.be.ok && window.__ReactNexus.should.be.an.Object && window.__ReactNexus.guid.should.be.a.String && window.__ReactNexus.serializedFlux.should.be.a.String && window.__ReactNexus.serializedHeaders.should.be.a.String && window.__ReactNexus.rootElement.should.be.ok;
                  });
                  _.dev(function () {
                    return window.__ReactNexus.app = _this2;
                  });
                  flux = new this.Flux();

                  _.dev(function () {
                    return window.__ReactNexus.flux = flux;
                  });
                  headers = JSON.parse(_.base64Decode(window.__ReactNexus.serializedHeaders));
                  guid = window.__ReactNexus.guid;
                  context$4$0.next = 8;
                  return flux.bootstrap({ window: window, headers: headers, guid: guid });

                case 8:

                  flux.unserialize(window.__ReactNexus.serializedFlux);
                  plugins = this.Plugins.forEach(function (Plugin) {
                    return new Plugin({ flux: flux, window: window });
                  });

                  _.dev(function () {
                    return window.__ReactNexus.plugins = plugins;
                  });

                  rootProps = { flux: flux, plugins: plugins };
                  rootComponentFactory = React.createFactory(this.Root);
                  rootComponent = rootComponentFactory(rootProps);

                  _.dev(function () {
                    return window.__ReactNexus.rootComponent = rootComponent;
                  });
                  flux.startInjectingFromStores();
                  /*
                  * Render root component client-side, for each components:
                  * 1. getInitialState : return store data computed server-side with R.Flux.prefetchFluxStores
                  * 2. componentWillMount : initialization
                  * 3. Render : compute DOM with store data computed server-side with R.Flux.prefetchFluxStores
                  * Root Component already has this server-rendered markup,
                  * React will preserve it and only attach event handlers.
                  * 4. Finally componentDidMount (subscribe and fetching data) then rerendering with new potential computed data
                  */
                  React.render(rootComponent, window.__ReactNexus.rootElement);
                  flux.stopInjectingFromStores();

                case 18:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this);
          }), this);
        }
      }
    });

    return App;
  })();

  _.extend(App.prototype, /** @lends App.prototype */{
    fluxClass: null,
    rootClass: null,
    template: null,
    vars: null,
    plugins: null,
    bootstrapTemplateVarsInServer: null });

  var Plugin = (function () {
    var Plugin = function Plugin(_ref3) {
      var flux = _ref3.flux;
      var req = _ref3.req;
      var window = _ref3.window;

      _.dev(function () {
        return flux.should.be.instanceOf(R.Flux);
      });
      _.dev(function () {
        return _.isServer() ? req.should.be.an.Object : window.should.be.an.Object;
      });
      this.displayName = this.getDisplayName();
    };

    _classProps(Plugin, null, {
      getDisplayName: {
        writable: true,
        value: function () {
          _.abstract();
        }
      },
      destroy: {
        writable: true,
        value: function () {
          _.abstract();
        }
      }
    });

    return Plugin;
  })();

  _.extend(Plugin.prototype, /** @lends Plugin.Prototype */{
    displayName: null });

  _.extend(App, { Plugin: Plugin });
  return App;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7TUFhdkIsR0FBRztRQUFILEdBQUcsR0FDSSxTQURQLEdBQUcsR0FDTzs7O0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbEMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkMsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDM0MsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFeEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDeEMsTUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUM5QixNQUFLLElBQUksQ0FB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QyxTQUFTLGdDQUFpQztBQUN4RCxlQUFXLEVBQUUsSUFBSSxFQUNsQixDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQztDQUNkLENBQUMiLCJmaWxlIjoiUi5BcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICAgIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcbiAgICBjb25zdCBfID0gUi5fO1xuICAgIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XG5cbiAgICAvKipcbiAgICAqIDxwPlNpbXBseSBjcmVhdGUgYW4gQXBwIGNsYXNzIHdpdGggc3BlY2lmaWNzPC9wPlxuICAgICogPHA+UHJvdmlkZXMgbWV0aG9kcyBpbiBvcmRlciB0byByZW5kZXIgdGhlIHNwZWNpZmllZCBBcHAgc2VydmVyLXNpZGUgYW5kIGNsaWVudC1zaWRlPC9wPlxuICAgICogPHVsPlxuICAgICogPGxpPiBBcHAuY3JlYXRlQXBwID0+IGluaXRpYWxpemVzIG1ldGhvZHMgb2YgYW4gYXBwbGljYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZCA8L2xpPlxuICAgICogPGxpPiBBcHAucmVuZGVyVG9TdHJpbmdJblNlcnZlciA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudCA8L2xpPlxuICAgICogPGxpPiBBcHAucmVuZGVySW50b0RvY3VtZW50SW5DbGllbnQgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyBjbGllbnQtc2lkZSBhbmQgZXN0YWJsaXNoZXMgYSBjb25uZWN0aW9uIHZpYSBzb2NrZXQgaW4gb3JkZXIgdG8gbWFrZSBkYXRhIHN1YnNjcmlwdGlvbnM8L2xpPlxuICAgICogPGxpPiBBcHAuY3JlYXRlUGx1Z2luID0+IGluaXRpbGlhemlhdGlvbiBtZXRob2Qgb2YgYSBwbHVnaW4gZm9yIHRoZSBhcHBsaWNhdGlvbiA8L2xpPlxuICAgICogPC91bD5cbiAgICAqIEBjbGFzcyBSLkFwcFxuICAgICovXG4gICAgY2xhc3MgQXBwIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkZsdXggPSB0aGlzLmdldEZsdXhDbGFzcygpO1xuICAgICAgICB0aGlzLlJvb3QgPSB0aGlzLmdldFJvb3RDbGFzcygpO1xuICAgICAgICB0aGlzLnZhcnMgPSB0aGlzLmdldERlZmF1bHRWYXJzKCk7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLmdldFRlbXBsYXRlKCk7XG4gICAgICAgIHRoaXMudGVtcGxhdGVMaWJzID0gdGhpcy5nZXRUZW1wbGF0ZUxpYnMoKTtcbiAgICAgICAgdGhpcy5QbHVnaW5zID0gdGhpcy5nZXRQbHVnaW5zQ2xhc3NlcygpO1xuXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuRmx1eC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMuUm9vdC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMudmFycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZS5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxuICAgICAgICAgIHRoaXMudGVtcGxhdGVMaWJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB0aGlzLlBsdWdpbnMuc2hvdWxkLmJlLmFuLkFycmF5XG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGdldEZsdXhDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFJvb3RDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldERlZmF1bHRWYXJzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0VGVtcGxhdGUoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRUZW1wbGF0ZUxpYnMoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRQbHVnaW5zQ2xhc3NlcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFRlbXBsYXRlVmFycyh7IHJlcSB9KSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICByZW5kZXIoeyByZXEsIHdpbmRvdyB9KSB7XG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgICByZXR1cm4gXy5pc1NlcnZlcigpID8gdGhpcy5fcmVuZGVySW5TZXJ2ZXIocmVxKSA6IHRoaXMuX3JlbmRlckluQ2xpZW50KHdpbmRvdyk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICogPHA+Q29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgc2VydmVyLXNpZGUgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQ8L3A+XG4gICAgICAqIEBtZXRob2QgcmVuZGVyVG9TdHJpbmdJblNlcnZlclxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxIFRoZSBjbGFzc2ljYWwgcmVxdWVzdCBvYmplY3RcbiAgICAgICogQHJldHVybiB7b2JqZWN0fSB0ZW1wbGF0ZSA6IHRoZSBjb21wdXRlZCBIVE1MIHRlbXBsYXRlIHdpdGggZGF0YSBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50XG4gICAgICAqL1xuICAgICAgX3JlbmRlckluU2VydmVyKHJlcSkge1xuICAgICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgICAgIHJlcS5oZWFkZXJzLnNob3VsZC5iZS5va1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBsZXQgZ3VpZCA9IF8uZ3VpZCgpO1xuICAgICAgICAgIGxldCBmbHV4ID0gbmV3IHRoaXMuRmx1eCgpO1xuICAgICAgICAgIGxldCBoZWFkZXJzID0gcmVxLmhlYWRlcnM7XG4gICAgICAgICAgLy9SZWdpc3RlciBzdG9yZSAoUi5TdG9yZSkgOiBVcGxpbmtTZXJ2ZXIgYW5kIE1lbW9yeVxuICAgICAgICAgIC8vSW5pdGlhbGl6ZXMgZmx1eCBhbmQgVXBsaW5rU2VydmVyIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gZmV0Y2ggZGF0YSBmcm9tIHVwbGluay1zZXJ2ZXJcbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCh7IHJlcSwgaGVhZGVycywgZ3VpZCB9KTtcblxuICAgICAgICAgIC8vSW5pdGlhbGl6ZXMgcGx1Z2luIGFuZCBmaWxsIGFsbCBjb3JyZXNwb25kaW5nIGRhdGEgZm9yIHN0b3JlIDogTWVtb3J5XG4gICAgICAgICAgbGV0IHBsdWdpbnMgPSB0aGlzLlBsdWdpbnMubWFwKChQbHVnaW4pID0+IG5ldyBQbHVnaW4oeyBmbHV4LCByZXEgfSkpO1xuXG4gICAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xuICAgICAgICAgIC8vQ3JlYXRlIHRoZSBSZWFjdCBpbnN0YW5jZSBvZiByb290IGNvbXBvbmVudCB3aXRoIGZsdXhcbiAgICAgICAgICBsZXQgc3Vycm9nYXRlUm9vdENvbXBvbmVudCA9IG5ldyB0aGlzLlJvb3QuX19SZWFjdE5leHVzU3Vycm9nYXRlKHt9LCByb290UHJvcHMpO1xuICAgICAgICAgIGlmKCFzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkge1xuICAgICAgICAgICAgXy5kZXYoKCkgPT4gY29uc29sZS5lcnJvcignUm9vdCBjb21wb25lbnQgcmVxdWlyZXMgY29tcG9uZW50V2lsbE1vdW50IGltcGxlbWVudGF0aW9uLiBNYXliZSB5b3UgZm9yZ290IHRvIG1peGluIFIuUm9vdC5NaXhpbj8nKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XG4gICAgICAgICAgeWllbGQgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcbiAgICAgICAgICBzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cbiAgICAgICAgICBsZXQgcm9vdENvbXBvbmVudEZhY3RvcnkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHRoaXMuUm9vdCk7XG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50RmFjdG9yeShyb290UHJvcHMpO1xuICAgICAgICAgIGZsdXguc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG5cbiAgICAgICAgICAvKlxuICAgICAgICAgICogUmVuZGVyIHJvb3QgY29tcG9uZW50IHNlcnZlci1zaWRlLCBmb3IgZWFjaCBjb21wb25lbnRzIDpcbiAgICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIGFuZCBmaWxsIHRoZSBjb21wb25lbnQncyBzdGF0ZVxuICAgICAgICAgICogMi4gY29tcG9uZW50V2lsbE1vdW50IDogc2ltcGxlIGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHRoZSBjb21wb25lbnQncyBzdGF0ZVxuICAgICAgICAgICovXG4gICAgICAgICAgbGV0IHJvb3RIdG1sID0gUmVhY3QucmVuZGVyVG9TdHJpbmcocm9vdENvbXBvbmVudCk7XG4gICAgICAgICAgZmx1eC5zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuICAgICAgICAgIC8vU2VyaWFsaXplcyBmbHV4IGluIG9yZGVyIHRvIHByb3ZpZGVzIGFsbCBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIHRvIHRoZSBjbGllbnRcbiAgICAgICAgICBsZXQgc2VyaWFsaXplZEZsdXggPSBmbHV4LnNlcmlhbGl6ZSgpO1xuICAgICAgICAgIGZsdXguZGVzdHJveSgpO1xuICAgICAgICAgIHBsdWdpbnMuZm9yRWFjaCgocGx1Z2luKSA9PiBwbHVnaW4uZGVzdHJveSgpKTtcblxuICAgICAgICAgIGxldCB2YXJzID0gXy5leHRlbmQoe30sIHlpZWxkIHRoaXMuZ2V0VGVtcGxhdGVWYXJzKHsgcmVxIH0pLCB0aGlzLnZhcnMpO1xuICAgICAgICAgIGxldCBzZXJpYWxpemVkSGVhZGVycyA9IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KGhlYWRlcnMpKTtcbiAgICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZSh7IHZhcnMsIHJvb3RIdG1sLCBzZXJpYWxpemVkRmx1eCwgc2VyaWFsaXplZEhlYWRlcnMsIGd1aWQgfSwgdGhpcy50ZW1wbGF0ZUxpYnMpO1xuXG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICogPHA+U2V0dGluZyBhbGwgdGhlIGRhdGEgZm9yIGVhY2ggUmVhY3QgQ29tcG9uZW50IGFuZCBSZW5kZXIgaXQgaW50byB0aGUgY2xpZW50LiA8YnIgLz5cbiAgICAgICogQ29ubmVjdGluZyB0byB0aGUgdXBsaW5rLXNlcnZlciB2aWEgaW4gb3JkZXIgdG8gZW5hYmxlIHRoZSBlc3RhYmxpc2htZW50IG9mIHN1YnNyaXB0aW9ucyBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQ8L3A+XG4gICAgICAqIEBtZXRob2QgcmVuZGVySW50b0RvY3VtZW50SW5DbGllbnRcbiAgICAgICogQHBhcmFtIHtvYmplY3R9IHdpbmRvdyBUaGUgY2xhc3NpY2FsIHdpbmRvdyBvYmplY3RcbiAgICAgICovXG4gICAgICBfcmVuZGVySW5DbGllbnQod2luZG93KSB7XG4gICAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRGbHV4LnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkSGVhZGVycy5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdEVsZW1lbnQuc2hvdWxkLmJlLm9rXG4gICAgICAgICAgKTtcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLmFwcCA9IHRoaXMpO1xuICAgICAgICAgIGxldCBmbHV4ID0gbmV3IHRoaXMuRmx1eCgpO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuZmx1eCA9IGZsdXgpO1xuICAgICAgICAgIGxldCBoZWFkZXJzID0gSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZSh3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzKSk7XG4gICAgICAgICAgbGV0IGd1aWQgPSB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQ7XG5cbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCh7IHdpbmRvdywgaGVhZGVycywgZ3VpZCB9KTtcbiAgICAgICAgICBmbHV4LnVuc2VyaWFsaXplKHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEZsdXgpO1xuICAgICAgICAgIGxldCBwbHVnaW5zID0gdGhpcy5QbHVnaW5zLmZvckVhY2goKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHdpbmRvdyB9KSk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5wbHVnaW5zID0gcGx1Z2lucyk7XG5cbiAgICAgICAgICBsZXQgcm9vdFByb3BzID0geyBmbHV4LCBwbHVnaW5zIH07XG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnRGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSh0aGlzLlJvb3QpO1xuICAgICAgICAgIGxldCByb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudEZhY3Rvcnkocm9vdFByb3BzKTtcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50KTtcbiAgICAgICAgICBmbHV4LnN0YXJ0SW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuICAgICAgICAgIC8qXG4gICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgY2xpZW50LXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHM6XG4gICAgICAgICAgKiAxLiBnZXRJbml0aWFsU3RhdGUgOiByZXR1cm4gc3RvcmUgZGF0YSBjb21wdXRlZCBzZXJ2ZXItc2lkZSB3aXRoIFIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXNcbiAgICAgICAgICAqIDIuIGNvbXBvbmVudFdpbGxNb3VudCA6IGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHN0b3JlIGRhdGEgY29tcHV0ZWQgc2VydmVyLXNpZGUgd2l0aCBSLkZsdXgucHJlZmV0Y2hGbHV4U3RvcmVzXG4gICAgICAgICAgKiBSb290IENvbXBvbmVudCBhbHJlYWR5IGhhcyB0aGlzIHNlcnZlci1yZW5kZXJlZCBtYXJrdXAsXG4gICAgICAgICAgKiBSZWFjdCB3aWxsIHByZXNlcnZlIGl0IGFuZCBvbmx5IGF0dGFjaCBldmVudCBoYW5kbGVycy5cbiAgICAgICAgICAqIDQuIEZpbmFsbHkgY29tcG9uZW50RGlkTW91bnQgKHN1YnNjcmliZSBhbmQgZmV0Y2hpbmcgZGF0YSkgdGhlbiByZXJlbmRlcmluZyB3aXRoIG5ldyBwb3RlbnRpYWwgY29tcHV0ZWQgZGF0YVxuICAgICAgICAgICovXG4gICAgICAgICAgUmVhY3QucmVuZGVyKHJvb3RDb21wb25lbnQsIHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdEVsZW1lbnQpO1xuICAgICAgICAgIGZsdXguc3RvcEluamVjdGluZ0Zyb21TdG9yZXMoKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBfLmV4dGVuZChBcHAucHJvdG90eXBlLCAvKiogQGxlbmRzIEFwcC5wcm90b3R5cGUgKi97XG4gICAgICBmbHV4Q2xhc3M6IG51bGwsXG4gICAgICByb290Q2xhc3M6IG51bGwsXG4gICAgICB0ZW1wbGF0ZTogbnVsbCxcbiAgICAgIHZhcnM6IG51bGwsXG4gICAgICBwbHVnaW5zOiBudWxsLFxuICAgICAgYm9vdHN0cmFwVGVtcGxhdGVWYXJzSW5TZXJ2ZXI6IG51bGwsXG4gICAgfSk7XG5cbiAgICBjbGFzcyBQbHVnaW4ge1xuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCByZXEsIHdpbmRvdyB9KSB7XG4gICAgICAgIF8uZGV2KCgpID0+IGZsdXguc2hvdWxkLmJlLmluc3RhbmNlT2YoUi5GbHV4KSk7XG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgICB0aGlzLmRpc3BsYXlOYW1lID0gdGhpcy5nZXREaXNwbGF5TmFtZSgpO1xuICAgICAgfVxuXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGRlc3Ryb3koKSB7IF8uYWJzdHJhY3QoKTsgfVxuICAgIH1cblxuICAgIF8uZXh0ZW5kKFBsdWdpbi5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUGx1Z2luLlByb3RvdHlwZSAqLyB7XG4gICAgICBkaXNwbGF5TmFtZTogbnVsbCxcbiAgICB9KTtcblxuICAgIF8uZXh0ZW5kKEFwcCwgeyBQbHVnaW4gfSk7XG4gICAgcmV0dXJuIEFwcDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=