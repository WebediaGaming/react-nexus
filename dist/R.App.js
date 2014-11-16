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
  var Plugin = require("./R.App.Plugin")(R);

  var App = (function () {
    var App = function App() {
      var _this = this;
      this.Flux = this.getFluxClass();
      this.Root = this.getRootClass();
      this.RootFactory = React.createFactory(this.Root);
      this.template = this.getTemplate();
      this.Plugins = this.getPluginsClasses();

      _.dev(function () {
        return _this.Flux.should.be.a.Function && _this.Root.should.be.a.Function && _this.vars.should.be.an.Object && _this.template.should.be.a.Function && _this.Plugins.should.be.an.Array;
      });

      this.prerender = _.scope(this.prerender, this);
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
      getTemplate: {
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
        value: regeneratorRuntime.mark(function callee$2$0(_ref) {
          var req;
          return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0: req = _ref.req;
                _.abstract();
              case 2:
              case "end": return context$3$0.stop();
            }
          }, callee$2$0, this);
        })
      },
      prerender: {
        writable: true,
        value: function (req, res) {
          this.render({ req: req }).then(function (html) {
            return res.status(200).send(html);
          })["catch"](function (err) {
            var json = { err: err.toString() };
            _.dev(function () {
              return _.extend(json, { stack: err.stack });
            });
            return res.status(500).json(json);
          });
        }
      },
      render: {
        writable: true,
        value: regeneratorRuntime.mark(function callee$2$1(_ref2) {
          var req, window;
          return regeneratorRuntime.wrap(function callee$2$1$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0: req = _ref2.req;
                window = _ref2.window;
                // jshint ignore:line
                _.dev(function () {
                  return _.isServer() ? req.should.be.an.Object : window.should.be.an.Object;
                });
                return context$3$0.abrupt("return", _.isServer() ? this._renderInServer(req) : this._renderInClient(window));
              case 4:
              case "end": return context$3$0.stop();
            }
          }, callee$2$1, this);
        })
      },
      _renderInServer: {
        writable: true,
        value: regeneratorRuntime.mark(function callee$2$2(req) {
          var guid, headers, flux, plugins, rootProps, surrogateRootComponent, rootComponent, rootHtml, serializedFlux, serializedHeaders;
          return regeneratorRuntime.wrap(function callee$2$2$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0: // jshint ignore:line
                _.dev(function () {
                  return _.isServer().should.be.ok && req.headers.should.be.ok;
                });

                guid = _.guid();
                headers = req.headers;
                flux = new this.Flux({ guid: guid, headers: headers, req: req });
                context$3$0.next = 6;
                return flux.bootstrap();
              case 6: plugins = this.Plugins.map(function (Plugin) {
                  return new Plugin({ flux: flux, req: req, headers: headers });
                });
                rootProps = { flux: flux, plugins: plugins };
                surrogateRootComponent = new this.Root.__ReactNexusSurrogate({}, rootProps);
                if (!surrogateRootComponent.componentWillMount) {
                  _.dev(function () {
                    return console.error("Root component requires componentWillMount implementation. Maybe you forgot to mixin R.Root.Mixin?");
                  });
                }
                // Emulate React lifecycle
                surrogateRootComponent.componentWillMount();
                context$3$0.next = 13;
                return surrogateRootComponent.prefetchFluxStores();
              case 13:
                surrogateRootComponent.componentWillUnmount();

                rootComponent = this.RootFactory(rootProps);
                flux.injectingFromStores(function () {
                  return rootHtml = React.renderToString(rootComponent);
                });
                serializedFlux = flux.serialize();
                flux.destroy();
                plugins.forEach(function (plugin) {
                  return plugin.destroy();
                });

                serializedHeaders = _.base64Encode(JSON.stringify(headers));
                context$3$0.next = 22;
                return this.getTemplateVars({ req: req });
              case 22: context$3$0.t0 = context$3$0.sent;
                context$3$0.t1 = _.extend({}, context$3$0.t0, { rootHtml: rootHtml, serializedFlux: serializedFlux, serializedHeaders: serializedHeaders, guid: guid });
                return context$3$0.abrupt("return", this.template(context$3$0.t1));
              case 25:
              case "end": return context$3$0.stop();
            }
          }, callee$2$2, this);
        })
      },
      _renderInClient: {
        writable: true,
        value: regeneratorRuntime.mark(function callee$2$3(window) {
          var _this2, headers, guid, flux, plugins, rootProps, rootComponent;
          return regeneratorRuntime.wrap(function callee$2$3$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0: _this2 = this;
                // jshint ignore:line
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

                context$3$0.next = 9;
                return flux.bootstrap({ window: window, headers: headers, guid: guid });
              case 9: // jshint ignore:line
                flux.unserialize(window.__ReactNexus.serializedFlux);
                plugins = this.Plugins.forEach(function (Plugin) {
                  return new Plugin({ flux: flux, window: window, headers: headers });
                });
                _.dev(function () {
                  return window.__ReactNexus.plugins = plugins;
                });

                rootProps = { flux: flux, plugins: plugins };
                rootComponent = this.RootFactory(rootProps);
                _.dev(function () {
                  return window.__ReactNexus.rootComponent = rootComponent;
                });
                /*
                * Render root component client-side, for each components:
                * 1. getInitialState : return store data computed server-side with R.Flux.prefetchFluxStores
                * 2. componentWillMount : initialization
                * 3. Render : compute DOM with store data computed server-side with R.Flux.prefetchFluxStores
                * Root Component already has this server-rendered markup,
                * React will preserve it and only attach event handlers.
                * 4. Finally componentDidMount (subscribe and fetching data) then rerendering with new potential computed data
                */
                flux.injectingFromStores(function () {
                  return React.render(rootComponent, window.__ReactNexus.rootElement);
                });
              case 16:
              case "end": return context$3$0.stop();
            }
          }, callee$2$3, this);
        })
      }
    });

    return App;
  })();

  _.extend(App.prototype, /** @lends App.prototype */{
    Flux: null,
    Root: null,
    RootFactory: null,
    template: null,
    Plugins: null });

  _.extend(App, { Plugin: Plugin });
  return App;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQ3pCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQWF0QyxHQUFHO1FBQUgsR0FBRyxHQUNJLFNBRFAsR0FBRyxHQUNPOztBQUNaLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkMsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFeEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDeEMsTUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUM5QixNQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzdCLE1BQUssUUFBUSxDQUFDLE1BQU0sQ0FB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QUMsYUFBYSxHQUFHLGFBQWE7aUJBQUEsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0FBVS9ELG9CQUFJLENBQUMsbUJBQW1CLENBQUM7eUJBQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7aUJBQUEsQ0FBQyxDQUFDOzs7OztTQUM5Rjs7OztXQXBJRyxHQUFHOzs7QUF1SVQsR0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyw2QkFBNkI7QUFDakQsUUFBSSxFQUFFLElBQUk7QUFDVixRQUFJLEVBQUUsSUFBSTtBQUNWLGVBQVcsRUFBRSxJQUFJO0FBQ2pCLFlBQVEsRUFBRSxJQUFJO0FBQ2QsV0FBTyxFQUFFLElBQUksRUFDZCxDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQztDQUNkLENBQUMiLCJmaWxlIjoiUi5BcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xuICAgIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcbiAgICBjb25zdCBfID0gUi5fO1xuICAgIGNvbnN0IFBsdWdpbiA9IHJlcXVpcmUoJy4vUi5BcHAuUGx1Z2luJykoUik7XG5cbiAgICAvKipcbiAgICAqIDxwPlNpbXBseSBjcmVhdGUgYW4gQXBwIGNsYXNzIHdpdGggc3BlY2lmaWNzPC9wPlxuICAgICogPHA+UHJvdmlkZXMgbWV0aG9kcyBpbiBvcmRlciB0byByZW5kZXIgdGhlIHNwZWNpZmllZCBBcHAgc2VydmVyLXNpZGUgYW5kIGNsaWVudC1zaWRlPC9wPlxuICAgICogPHVsPlxuICAgICogPGxpPiBBcHAuY3JlYXRlQXBwID0+IGluaXRpYWxpemVzIG1ldGhvZHMgb2YgYW4gYXBwbGljYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZCA8L2xpPlxuICAgICogPGxpPiBBcHAucmVuZGVyVG9TdHJpbmdJblNlcnZlciA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudCA8L2xpPlxuICAgICogPGxpPiBBcHAucmVuZGVySW50b0RvY3VtZW50SW5DbGllbnQgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyBjbGllbnQtc2lkZSBhbmQgZXN0YWJsaXNoZXMgYSBjb25uZWN0aW9uIHZpYSBzb2NrZXQgaW4gb3JkZXIgdG8gbWFrZSBkYXRhIHN1YnNjcmlwdGlvbnM8L2xpPlxuICAgICogPGxpPiBBcHAuY3JlYXRlUGx1Z2luID0+IGluaXRpbGlhemlhdGlvbiBtZXRob2Qgb2YgYSBwbHVnaW4gZm9yIHRoZSBhcHBsaWNhdGlvbiA8L2xpPlxuICAgICogPC91bD5cbiAgICAqIEBjbGFzcyBSLkFwcFxuICAgICovXG4gICAgY2xhc3MgQXBwIHtcbiAgICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLkZsdXggPSB0aGlzLmdldEZsdXhDbGFzcygpO1xuICAgICAgICB0aGlzLlJvb3QgPSB0aGlzLmdldFJvb3RDbGFzcygpO1xuICAgICAgICB0aGlzLlJvb3RGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSh0aGlzLlJvb3QpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5nZXRUZW1wbGF0ZSgpO1xuICAgICAgICB0aGlzLlBsdWdpbnMgPSB0aGlzLmdldFBsdWdpbnNDbGFzc2VzKCk7XG5cbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5GbHV4LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy5Sb290LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy52YXJzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB0aGlzLnRlbXBsYXRlLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXG4gICAgICAgICAgdGhpcy5QbHVnaW5zLnNob3VsZC5iZS5hbi5BcnJheVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMucHJlcmVuZGVyID0gXy5zY29wZSh0aGlzLnByZXJlbmRlciwgdGhpcyk7XG4gICAgICB9XG5cbiAgICAgIGdldEZsdXhDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFJvb3RDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFRlbXBsYXRlKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0UGx1Z2luc0NsYXNzZXMoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICAvLyBGdXR1cmUtcHJvb2Y6IG1pZ2h0IGRvIHNvbWV0aGluZyB3aXRoIHsgcmVxLCB3aW5kb3cgfSBhdCBzb21lIHBvaW50XG4gICAgICAvLyBvZiB0aGUgZnV0dXJlLlxuICAgICAgKmdldFRlbXBsYXRlVmFycyh7IHJlcSB9KSB7IF8uYWJzdHJhY3QoKTsgfSAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuICAgICAgcHJlcmVuZGVyKHJlcSwgcmVzKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKHsgcmVxIH0pXG4gICAgICAgIC50aGVuKChodG1sKSA9PiByZXMuc3RhdHVzKDIwMCkuc2VuZChodG1sKSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBsZXQganNvbiA9IHsgZXJyOiBlcnIudG9TdHJpbmcoKSB9O1xuICAgICAgICAgIF8uZGV2KCgpID0+IF8uZXh0ZW5kKGpzb24sIHsgc3RhY2s6IGVyci5zdGFjayB9KSk7XG4gICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKGpzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgKnJlbmRlcih7IHJlcSwgd2luZG93IH0pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgICByZXR1cm4gXy5pc1NlcnZlcigpID8gdGhpcy5fcmVuZGVySW5TZXJ2ZXIocmVxKSA6IHRoaXMuX3JlbmRlckluQ2xpZW50KHdpbmRvdyk7XG4gICAgICB9XG4gICAgICAvKipcbiAgICAgICogPHA+Q29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgc2VydmVyLXNpZGUgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQ8L3A+XG4gICAgICAqIEBtZXRob2QgcmVuZGVyVG9TdHJpbmdJblNlcnZlclxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxIFRoZSBjbGFzc2ljYWwgcmVxdWVzdCBvYmplY3RcbiAgICAgICogQHJldHVybiB7b2JqZWN0fSB0ZW1wbGF0ZSA6IHRoZSBjb21wdXRlZCBIVE1MIHRlbXBsYXRlIHdpdGggZGF0YSBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50XG4gICAgICAqL1xuICAgICAgKl9yZW5kZXJJblNlcnZlcihyZXEpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgICByZXEuaGVhZGVycy5zaG91bGQuYmUub2tcbiAgICAgICAgKTtcblxuICAgICAgICBsZXQgZ3VpZCA9IF8uZ3VpZCgpO1xuICAgICAgICBsZXQgaGVhZGVycyA9IHJlcS5oZWFkZXJzO1xuICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBndWlkLCBoZWFkZXJzLCByZXEgfSk7XG4gICAgICAgIC8vIFJlZ2lzdGVyIHN0b3JlIChSLlN0b3JlKSA6IFVwbGlua1NlcnZlciBhbmQgTWVtb3J5XG4gICAgICAgIC8vIEluaXRpYWxpemVzIGZsdXggYW5kIFVwbGlua1NlcnZlciBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGZldGNoIGRhdGEgZnJvbSB1cGxpbmstc2VydmVyXG4gICAgICAgIHlpZWxkIGZsdXguYm9vdHN0cmFwKCk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4gICAgICAgIC8vIEluaXRpYWxpemVzIHBsdWdpbiBhbmQgZmlsbCBhbGwgY29ycmVzcG9uZGluZyBkYXRhIGZvciBzdG9yZSA6IE1lbW9yeVxuICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5tYXAoKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHJlcSwgaGVhZGVycyB9KSk7XG5cbiAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xuICAgICAgICAvLyBDcmVhdGUgdGhlIFJlYWN0IGluc3RhbmNlIG9mIHJvb3QgY29tcG9uZW50IHdpdGggZmx1eFxuICAgICAgICBsZXQgc3Vycm9nYXRlUm9vdENvbXBvbmVudCA9IG5ldyB0aGlzLlJvb3QuX19SZWFjdE5leHVzU3Vycm9nYXRlKHt9LCByb290UHJvcHMpO1xuICAgICAgICBpZighc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIHtcbiAgICAgICAgICBfLmRldigoKSA9PiBjb25zb2xlLmVycm9yKCdSb290IGNvbXBvbmVudCByZXF1aXJlcyBjb21wb25lbnRXaWxsTW91bnQgaW1wbGVtZW50YXRpb24uIE1heWJlIHlvdSBmb3Jnb3QgdG8gbWl4aW4gUi5Sb290Lk1peGluPycpKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBFbXVsYXRlIFJlYWN0IGxpZmVjeWNsZVxuICAgICAgICBzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICB5aWVsZCBzdXJyb2dhdGVSb290Q29tcG9uZW50LnByZWZldGNoRmx1eFN0b3JlcygpO1xuICAgICAgICBzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XG5cbiAgICAgICAgLypcbiAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgc2VydmVyLXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHMgOlxuICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIGFuZCBmaWxsIHRoZSBjb21wb25lbnQncyBzdGF0ZVxuICAgICAgICAqIDIuIGNvbXBvbmVudFdpbGxNb3VudCA6IHNpbXBsZSBpbml0aWFsaXphdGlvblxuICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggdGhlIGNvbXBvbmVudCdzIHN0YXRlXG4gICAgICAgICovXG4gICAgICAgIGxldCByb290Q29tcG9uZW50ID0gdGhpcy5Sb290RmFjdG9yeShyb290UHJvcHMpO1xuICAgICAgICBsZXQgcm9vdEh0bWw7XG4gICAgICAgIGZsdXguaW5qZWN0aW5nRnJvbVN0b3JlcygoKSA9PiByb290SHRtbCA9IFJlYWN0LnJlbmRlclRvU3RyaW5nKHJvb3RDb21wb25lbnQpKTtcbiAgICAgICAgLy8gU2VyaWFsaXplcyBmbHV4IGluIG9yZGVyIHRvIHByb3ZpZGVzIGFsbCBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIHRvIHRoZSBjbGllbnRcbiAgICAgICAgbGV0IHNlcmlhbGl6ZWRGbHV4ID0gZmx1eC5zZXJpYWxpemUoKTtcbiAgICAgICAgZmx1eC5kZXN0cm95KCk7XG4gICAgICAgIHBsdWdpbnMuZm9yRWFjaCgocGx1Z2luKSA9PiBwbHVnaW4uZGVzdHJveSgpKTtcblxuICAgICAgICBsZXQgc2VyaWFsaXplZEhlYWRlcnMgPSBfLmJhc2U2NEVuY29kZShKU09OLnN0cmluZ2lmeShoZWFkZXJzKSk7XG4gICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlKF8uZXh0ZW5kKHt9LCB5aWVsZCB0aGlzLmdldFRlbXBsYXRlVmFycyh7IHJlcSB9KSwgeyByb290SHRtbCwgc2VyaWFsaXplZEZsdXgsIHNlcmlhbGl6ZWRIZWFkZXJzLCBndWlkIH0pKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAqIDxwPlNldHRpbmcgYWxsIHRoZSBkYXRhIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudCBhbmQgUmVuZGVyIGl0IGludG8gdGhlIGNsaWVudC4gPGJyIC8+XG4gICAgICAqIENvbm5lY3RpbmcgdG8gdGhlIHVwbGluay1zZXJ2ZXIgdmlhIGluIG9yZGVyIHRvIGVuYWJsZSB0aGUgZXN0YWJsaXNobWVudCBvZiBzdWJzcmlwdGlvbnMgZm9yIGVhY2ggUmVhY3QgQ29tcG9uZW50PC9wPlxuICAgICAgKiBAbWV0aG9kIHJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50XG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSB3aW5kb3cgVGhlIGNsYXNzaWNhbCB3aW5kb3cgb2JqZWN0XG4gICAgICAqL1xuICAgICAgKl9yZW5kZXJJbkNsaWVudCh3aW5kb3cpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNDbGllbnQoKS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcbiAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdEVsZW1lbnQuc2hvdWxkLmJlLm9rXG4gICAgICAgICk7XG4gICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuYXBwID0gdGhpcyk7XG4gICAgICAgIGxldCBoZWFkZXJzID0gSlNPTi5wYXJzZShfLmJhc2U2NERlY29kZSh3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzKSk7XG4gICAgICAgIGxldCBndWlkID0gd2luZG93Ll9fUmVhY3ROZXh1cy5ndWlkO1xuICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3cgfSk7XG4gICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuZmx1eCA9IGZsdXgpO1xuXG4gICAgICAgIHlpZWxkIGZsdXguYm9vdHN0cmFwKHsgd2luZG93LCBoZWFkZXJzLCBndWlkIH0pOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcbiAgICAgICAgZmx1eC51bnNlcmlhbGl6ZSh3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRGbHV4KTtcbiAgICAgICAgbGV0IHBsdWdpbnMgPSB0aGlzLlBsdWdpbnMuZm9yRWFjaCgoUGx1Z2luKSA9PiBuZXcgUGx1Z2luKHsgZmx1eCwgd2luZG93LCBoZWFkZXJzIH0pKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5wbHVnaW5zID0gcGx1Z2lucyk7XG5cbiAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xuICAgICAgICBsZXQgcm9vdENvbXBvbmVudCA9IHRoaXMuUm9vdEZhY3Rvcnkocm9vdFByb3BzKTtcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5yb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudCk7XG4gICAgICAgIC8qXG4gICAgICAgICogUmVuZGVyIHJvb3QgY29tcG9uZW50IGNsaWVudC1zaWRlLCBmb3IgZWFjaCBjb21wb25lbnRzOlxuICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xuICAgICAgICAqIDIuIGNvbXBvbmVudFdpbGxNb3VudCA6IGluaXRpYWxpemF0aW9uXG4gICAgICAgICogMy4gUmVuZGVyIDogY29tcHV0ZSBET00gd2l0aCBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xuICAgICAgICAqIFJvb3QgQ29tcG9uZW50IGFscmVhZHkgaGFzIHRoaXMgc2VydmVyLXJlbmRlcmVkIG1hcmt1cCxcbiAgICAgICAgKiBSZWFjdCB3aWxsIHByZXNlcnZlIGl0IGFuZCBvbmx5IGF0dGFjaCBldmVudCBoYW5kbGVycy5cbiAgICAgICAgKiA0LiBGaW5hbGx5IGNvbXBvbmVudERpZE1vdW50IChzdWJzY3JpYmUgYW5kIGZldGNoaW5nIGRhdGEpIHRoZW4gcmVyZW5kZXJpbmcgd2l0aCBuZXcgcG90ZW50aWFsIGNvbXB1dGVkIGRhdGFcbiAgICAgICAgKi9cbiAgICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IFJlYWN0LnJlbmRlcihyb290Q29tcG9uZW50LCB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RFbGVtZW50KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgXy5leHRlbmQoQXBwLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBBcHAucHJvdG90eXBlICove1xuICAgICAgRmx1eDogbnVsbCxcbiAgICAgIFJvb3Q6IG51bGwsXG4gICAgICBSb290RmFjdG9yeTogbnVsbCxcbiAgICAgIHRlbXBsYXRlOiBudWxsLFxuICAgICAgUGx1Z2luczogbnVsbCxcbiAgICB9KTtcblxuICAgIF8uZXh0ZW5kKEFwcCwgeyBQbHVnaW4gfSk7XG4gICAgcmV0dXJuIEFwcDtcbn07XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=