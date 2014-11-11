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
            var guid, headers, flux, plugins, rootProps, surrogateRootComponent, rootComponentFactory, rootComponent, rootHtml, serializedFlux, vars, serializedHeaders;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _.isServer().should.be.ok && req.headers.should.be.ok;
                  });

                  guid = _.guid();
                  headers = req.headers;
                  flux = new this.Flux({ guid: guid, headers: headers, req: req });
                  context$4$0.next = 6;
                  return flux.bootstrap();

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
            var headers, guid, flux, plugins, rootProps, rootComponentFactory, rootComponent;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              var _this2 = this;
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:

                  _.dev(function () {
                    return _.isClient().should.be.ok && window.__ReactNexus.should.be.an.Object && window.__ReactNexus.guid.should.be.a.String && window.__ReactNexus.serializedFlux.should.be.a.String && window.__ReactNexus.serializedHeaders.should.be.a.String && window.__ReactNexus.rootElement.should.be.ok;
                  });
                  _.dev(function () {
                    return window.__ReactNexus.app = _this2;
                  });
                  headers = JSON.parse(_.base64Decode(window.__ReactNexus.serializedHeaders));
                  guid = window.__ReactNexus.guid;
                  flux = new this.Flux({ headers: headers, guid: guid, window: window });

                  _.dev(function () {
                    return window.__ReactNexus.flux = flux;
                  });

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7TUFhdkIsR0FBRztRQUFILEdBQUcsR0FDSSxTQURQLEdBQUcsR0FDTzs7O0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbEMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkMsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDM0MsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFeEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDeEMsTUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUM5QixNQUFLLElBQUksQ0FB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UUFBUSxFQUFFLENBQUM7U0FBRTs7OztXQVR2QixNQUFNOzs7OztBQVlaLEdBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsZ0NBQWlDO0FBQ3hELGVBQVcsRUFBRSxJQUFJLEVBQ2xCLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLFNBQU8sR0FBRyxDQUFDO0NBQ2QsQ0FBQyIsImZpbGUiOiJSLkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gICAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuICAgIGNvbnN0IF8gPSBSLl87XG4gICAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcblxuICAgIC8qKlxuICAgICogPHA+U2ltcGx5IGNyZWF0ZSBhbiBBcHAgY2xhc3Mgd2l0aCBzcGVjaWZpY3M8L3A+XG4gICAgKiA8cD5Qcm92aWRlcyBtZXRob2RzIGluIG9yZGVyIHRvIHJlbmRlciB0aGUgc3BlY2lmaWVkIEFwcCBzZXJ2ZXItc2lkZSBhbmQgY2xpZW50LXNpZGU8L3A+XG4gICAgKiA8dWw+XG4gICAgKiA8bGk+IEFwcC5jcmVhdGVBcHAgPT4gaW5pdGlhbGl6ZXMgbWV0aG9kcyBvZiBhbiBhcHBsaWNhdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljYXRpb25zIHByb3ZpZGVkIDwvbGk+XG4gICAgKiA8bGk+IEFwcC5yZW5kZXJUb1N0cmluZ0luU2VydmVyID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50IDwvbGk+XG4gICAgKiA8bGk+IEFwcC5yZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIGNsaWVudC1zaWRlIGFuZCBlc3RhYmxpc2hlcyBhIGNvbm5lY3Rpb24gdmlhIHNvY2tldCBpbiBvcmRlciB0byBtYWtlIGRhdGEgc3Vic2NyaXB0aW9uczwvbGk+XG4gICAgKiA8bGk+IEFwcC5jcmVhdGVQbHVnaW4gPT4gaW5pdGlsaWF6aWF0aW9uIG1ldGhvZCBvZiBhIHBsdWdpbiBmb3IgdGhlIGFwcGxpY2F0aW9uIDwvbGk+XG4gICAgKiA8L3VsPlxuICAgICogQGNsYXNzIFIuQXBwXG4gICAgKi9cbiAgICBjbGFzcyBBcHAge1xuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRmx1eCA9IHRoaXMuZ2V0Rmx1eENsYXNzKCk7XG4gICAgICAgIHRoaXMuUm9vdCA9IHRoaXMuZ2V0Um9vdENsYXNzKCk7XG4gICAgICAgIHRoaXMudmFycyA9IHRoaXMuZ2V0RGVmYXVsdFZhcnMoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZSA9IHRoaXMuZ2V0VGVtcGxhdGUoKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZUxpYnMgPSB0aGlzLmdldFRlbXBsYXRlTGlicygpO1xuICAgICAgICB0aGlzLlBsdWdpbnMgPSB0aGlzLmdldFBsdWdpbnNDbGFzc2VzKCk7XG5cbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5GbHV4LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy5Sb290LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy52YXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB0aGlzLnRlbXBsYXRlLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZUxpYnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICAgIHRoaXMuUGx1Z2lucy5zaG91bGQuYmUuYW4uQXJyYXlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZ2V0Rmx1eENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0Um9vdENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0RGVmYXVsdFZhcnMoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRUZW1wbGF0ZSgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFRlbXBsYXRlTGlicygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFBsdWdpbnNDbGFzc2VzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0VGVtcGxhdGVWYXJzKHsgcmVxIH0pIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIHJlbmRlcih7IHJlcSwgd2luZG93IH0pIHtcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpID8gcmVxLnNob3VsZC5iZS5hbi5PYmplY3QgOiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdCk7XG4gICAgICAgIHJldHVybiBfLmlzU2VydmVyKCkgPyB0aGlzLl9yZW5kZXJJblNlcnZlcihyZXEpIDogdGhpcy5fcmVuZGVySW5DbGllbnQod2luZG93KTtcbiAgICAgIH1cbiAgICAgIC8qKlxuICAgICAgKiA8cD5Db21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBzZXJ2ZXItc2lkZSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudDwvcD5cbiAgICAgICogQG1ldGhvZCByZW5kZXJUb1N0cmluZ0luU2VydmVyXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXEgVGhlIGNsYXNzaWNhbCByZXF1ZXN0IG9iamVjdFxuICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHRlbXBsYXRlIDogdGhlIGNvbXB1dGVkIEhUTUwgdGVtcGxhdGUgd2l0aCBkYXRhIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnRcbiAgICAgICovXG4gICAgICBfcmVuZGVySW5TZXJ2ZXIocmVxKSB7XG4gICAgICAgIHJldHVybiBfLmNvcHJvbWlzZShmdW5jdGlvbiooKSB7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpLnNob3VsZC5iZS5vayAmJlxuICAgICAgICAgICAgcmVxLmhlYWRlcnMuc2hvdWxkLmJlLm9rXG4gICAgICAgICAgKTtcblxuICAgICAgICAgIGxldCBndWlkID0gXy5ndWlkKCk7XG4gICAgICAgICAgbGV0IGhlYWRlcnMgPSByZXEuaGVhZGVycztcbiAgICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBndWlkLCBoZWFkZXJzLCByZXEgfSk7XG4gICAgICAgICAgLy9SZWdpc3RlciBzdG9yZSAoUi5TdG9yZSkgOiBVcGxpbmtTZXJ2ZXIgYW5kIE1lbW9yeVxuICAgICAgICAgIC8vSW5pdGlhbGl6ZXMgZmx1eCBhbmQgVXBsaW5rU2VydmVyIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gZmV0Y2ggZGF0YSBmcm9tIHVwbGluay1zZXJ2ZXJcbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCgpO1xuXG4gICAgICAgICAgLy9Jbml0aWFsaXplcyBwbHVnaW4gYW5kIGZpbGwgYWxsIGNvcnJlc3BvbmRpbmcgZGF0YSBmb3Igc3RvcmUgOiBNZW1vcnlcbiAgICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5tYXAoKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHJlcSB9KSk7XG5cbiAgICAgICAgICBsZXQgcm9vdFByb3BzID0geyBmbHV4LCBwbHVnaW5zIH07XG4gICAgICAgICAgLy9DcmVhdGUgdGhlIFJlYWN0IGluc3RhbmNlIG9mIHJvb3QgY29tcG9uZW50IHdpdGggZmx1eFxuICAgICAgICAgIGxldCBzdXJyb2dhdGVSb290Q29tcG9uZW50ID0gbmV3IHRoaXMuUm9vdC5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoe30sIHJvb3RQcm9wcyk7XG4gICAgICAgICAgaWYoIXN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBjb25zb2xlLmVycm9yKCdSb290IGNvbXBvbmVudCByZXF1aXJlcyBjb21wb25lbnRXaWxsTW91bnQgaW1wbGVtZW50YXRpb24uIE1heWJlIHlvdSBmb3Jnb3QgdG8gbWl4aW4gUi5Sb290Lk1peGluPycpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVSb290Q29tcG9uZW50LnByZWZldGNoRmx1eFN0b3JlcygpO1xuICAgICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuICAgICAgICAgIGxldCByb290Q29tcG9uZW50RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkodGhpcy5Sb290KTtcbiAgICAgICAgICBsZXQgcm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnRGYWN0b3J5KHJvb3RQcm9wcyk7XG4gICAgICAgICAgZmx1eC5zdGFydEluamVjdGluZ0Zyb21TdG9yZXMoKTtcblxuICAgICAgICAgIC8qXG4gICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgc2VydmVyLXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHMgOlxuICAgICAgICAgICogMS4gZ2V0SW5pdGlhbFN0YXRlIDogcmV0dXJuIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgYW5kIGZpbGwgdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBzaW1wbGUgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICAgKi9cbiAgICAgICAgICBsZXQgcm9vdEh0bWwgPSBSZWFjdC5yZW5kZXJUb1N0cmluZyhyb290Q29tcG9uZW50KTtcbiAgICAgICAgICBmbHV4LnN0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCk7XG4gICAgICAgICAgLy9TZXJpYWxpemVzIGZsdXggaW4gb3JkZXIgdG8gcHJvdmlkZXMgYWxsIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgdG8gdGhlIGNsaWVudFxuICAgICAgICAgIGxldCBzZXJpYWxpemVkRmx1eCA9IGZsdXguc2VyaWFsaXplKCk7XG4gICAgICAgICAgZmx1eC5kZXN0cm95KCk7XG4gICAgICAgICAgcGx1Z2lucy5mb3JFYWNoKChwbHVnaW4pID0+IHBsdWdpbi5kZXN0cm95KCkpO1xuXG4gICAgICAgICAgbGV0IHZhcnMgPSBfLmV4dGVuZCh7fSwgeWllbGQgdGhpcy5nZXRUZW1wbGF0ZVZhcnMoeyByZXEgfSksIHRoaXMudmFycyk7XG4gICAgICAgICAgbGV0IHNlcmlhbGl6ZWRIZWFkZXJzID0gXy5iYXNlNjRFbmNvZGUoSlNPTi5zdHJpbmdpZnkoaGVhZGVycykpO1xuICAgICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlKHsgdmFycywgcm9vdEh0bWwsIHNlcmlhbGl6ZWRGbHV4LCBzZXJpYWxpemVkSGVhZGVycywgZ3VpZCB9LCB0aGlzLnRlbXBsYXRlTGlicyk7XG5cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgKiA8cD5TZXR0aW5nIGFsbCB0aGUgZGF0YSBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQgYW5kIFJlbmRlciBpdCBpbnRvIHRoZSBjbGllbnQuIDxiciAvPlxuICAgICAgKiBDb25uZWN0aW5nIHRvIHRoZSB1cGxpbmstc2VydmVyIHZpYSBpbiBvcmRlciB0byBlbmFibGUgdGhlIGVzdGFibGlzaG1lbnQgb2Ygc3Vic3JpcHRpb25zIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudDwvcD5cbiAgICAgICogQG1ldGhvZCByZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudFxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gd2luZG93IFRoZSBjbGFzc2ljYWwgd2luZG93IG9iamVjdFxuICAgICAgKi9cbiAgICAgIF9yZW5kZXJJbkNsaWVudCh3aW5kb3cpIHtcbiAgICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICBfLmRldigoKSA9PiBfLmlzQ2xpZW50KCkuc2hvdWxkLmJlLm9rICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuZ3VpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEZsdXguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudC5zaG91bGQuYmUub2tcbiAgICAgICAgICApO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuYXBwID0gdGhpcyk7XG4gICAgICAgICAgbGV0IGhlYWRlcnMgPSBKU09OLnBhcnNlKF8uYmFzZTY0RGVjb2RlKHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEhlYWRlcnMpKTtcbiAgICAgICAgICBsZXQgZ3VpZCA9IHdpbmRvdy5fX1JlYWN0TmV4dXMuZ3VpZDtcbiAgICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3cgfSk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5mbHV4ID0gZmx1eCk7XG5cbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCh7IHdpbmRvdywgaGVhZGVycywgZ3VpZCB9KTtcbiAgICAgICAgICBmbHV4LnVuc2VyaWFsaXplKHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEZsdXgpO1xuICAgICAgICAgIGxldCBwbHVnaW5zID0gdGhpcy5QbHVnaW5zLmZvckVhY2goKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHdpbmRvdyB9KSk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5wbHVnaW5zID0gcGx1Z2lucyk7XG5cbiAgICAgICAgICBsZXQgcm9vdFByb3BzID0geyBmbHV4LCBwbHVnaW5zIH07XG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnRGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSh0aGlzLlJvb3QpO1xuICAgICAgICAgIGxldCByb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudEZhY3Rvcnkocm9vdFByb3BzKTtcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50KTtcbiAgICAgICAgICBmbHV4LnN0YXJ0SW5qZWN0aW5nRnJvbVN0b3JlcygpO1xuICAgICAgICAgIC8qXG4gICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgY2xpZW50LXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHM6XG4gICAgICAgICAgKiAxLiBnZXRJbml0aWFsU3RhdGUgOiByZXR1cm4gc3RvcmUgZGF0YSBjb21wdXRlZCBzZXJ2ZXItc2lkZSB3aXRoIFIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXNcbiAgICAgICAgICAqIDIuIGNvbXBvbmVudFdpbGxNb3VudCA6IGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHN0b3JlIGRhdGEgY29tcHV0ZWQgc2VydmVyLXNpZGUgd2l0aCBSLkZsdXgucHJlZmV0Y2hGbHV4U3RvcmVzXG4gICAgICAgICAgKiBSb290IENvbXBvbmVudCBhbHJlYWR5IGhhcyB0aGlzIHNlcnZlci1yZW5kZXJlZCBtYXJrdXAsXG4gICAgICAgICAgKiBSZWFjdCB3aWxsIHByZXNlcnZlIGl0IGFuZCBvbmx5IGF0dGFjaCBldmVudCBoYW5kbGVycy5cbiAgICAgICAgICAqIDQuIEZpbmFsbHkgY29tcG9uZW50RGlkTW91bnQgKHN1YnNjcmliZSBhbmQgZmV0Y2hpbmcgZGF0YSkgdGhlbiByZXJlbmRlcmluZyB3aXRoIG5ldyBwb3RlbnRpYWwgY29tcHV0ZWQgZGF0YVxuICAgICAgICAgICovXG4gICAgICAgICAgUmVhY3QucmVuZGVyKHJvb3RDb21wb25lbnQsIHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdEVsZW1lbnQpO1xuICAgICAgICAgIGZsdXguc3RvcEluamVjdGluZ0Zyb21TdG9yZXMoKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBfLmV4dGVuZChBcHAucHJvdG90eXBlLCAvKiogQGxlbmRzIEFwcC5wcm90b3R5cGUgKi97XG4gICAgICBmbHV4Q2xhc3M6IG51bGwsXG4gICAgICByb290Q2xhc3M6IG51bGwsXG4gICAgICB0ZW1wbGF0ZTogbnVsbCxcbiAgICAgIHZhcnM6IG51bGwsXG4gICAgICBwbHVnaW5zOiBudWxsLFxuICAgICAgYm9vdHN0cmFwVGVtcGxhdGVWYXJzSW5TZXJ2ZXI6IG51bGwsXG4gICAgfSk7XG5cbiAgICBjbGFzcyBQbHVnaW4ge1xuICAgICAgY29uc3RydWN0b3IoeyBmbHV4LCByZXEsIHdpbmRvdyB9KSB7XG4gICAgICAgIF8uZGV2KCgpID0+IGZsdXguc2hvdWxkLmJlLmluc3RhbmNlT2YoUi5GbHV4KSk7XG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgICB0aGlzLmRpc3BsYXlOYW1lID0gdGhpcy5nZXREaXNwbGF5TmFtZSgpO1xuICAgICAgfVxuXG4gICAgICBnZXREaXNwbGF5TmFtZSgpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGRlc3Ryb3koKSB7IF8uYWJzdHJhY3QoKTsgfVxuICAgIH1cblxuICAgIF8uZXh0ZW5kKFBsdWdpbi5wcm90b3R5cGUsIC8qKiBAbGVuZHMgUGx1Z2luLlByb3RvdHlwZSAqLyB7XG4gICAgICBkaXNwbGF5TmFtZTogbnVsbCxcbiAgICB9KTtcblxuICAgIF8uZXh0ZW5kKEFwcCwgeyBQbHVnaW4gfSk7XG4gICAgcmV0dXJuIEFwcDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=