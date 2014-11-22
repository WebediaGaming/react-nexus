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
            while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
                req = _ref.req;
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
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {case 0:
                  context$4$0.prev = 0;
                  context$4$0.next = 3;
                  return this.render({ req: req });

                case 3:
                  context$4$0.t0 = context$4$0.sent;
                  return context$4$0.abrupt("return", res.status(200).send(context$4$0.t0));

                case 7:
                  context$4$0.prev = 7;
                  context$4$0.t1 = context$4$0.catch(0);

                  (function () {
                    var err = context$4$0.t1.toString();
                    var stack;
                    _.dev(function () {
                      return stack = context$4$0.t1.stack;
                    });
                    _.prod(function () {
                      return stack = null;
                    });
                    return res.status(500).json({ err: err, stack: stack });
                  })();

                case 10:
                case "end": return context$4$0.stop();
              }
            }, callee$3$0, this, [[0, 7]]);
          }), this);
        }
      },
      render: {
        writable: true,
        value: regeneratorRuntime.mark(function callee$2$1(_ref2) {
          var req, window;
          return regeneratorRuntime.wrap(function callee$2$1$(context$3$0) {
            while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
                req = _ref2.req;
                window = _ref2.window;
                // jshint ignore:line
                _.dev(function () {
                  return _.isServer() ? req.should.be.an.Object : window.should.be.an.Object;
                });

                if (!_.isServer()) {
                  context$3$0.next = 9;
                  break;
                }
                context$3$0.next = 6;
                return this._renderInServer(req);

              case 6:
                context$3$0.t2 = context$3$0.sent;
                context$3$0.next = 12;
                break;

              case 9:
                context$3$0.next = 11;
                return this._renderInClient(window);

              case 11: context$3$0.t2 = context$3$0.sent;
              case 12: return context$3$0.abrupt("return", context$3$0.t2);
              case 13:
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
            while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
                // jshint ignore:line
                _.dev(function () {
                  return _.isServer().should.be.ok && req.headers.should.be.ok;
                });

                guid = _.guid();
                headers = req.headers;
                flux = new this.Flux({ guid: guid, headers: headers, req: req });
                context$3$0.next = 6;
                return flux.bootstrap();

              case 6:
                plugins = this.Plugins.map(function (Plugin) {
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

              case 22:
                context$3$0.t3 = context$3$0.sent;
                context$3$0.t4 = _.extend({}, context$3$0.t3, { rootHtml: rootHtml, serializedFlux: serializedFlux, serializedHeaders: serializedHeaders, guid: guid });
                return context$3$0.abrupt("return", this.template(context$3$0.t4));

              case 25:
              case "end": return context$3$0.stop();
            }
          }, callee$2$2, this);
        })
      },
      _renderInClient: {
        writable: true,
        value: regeneratorRuntime.mark(function callee$2$3(window) {
          var headers, guid, flux, plugins, rootProps, rootComponent;
          return regeneratorRuntime.wrap(function callee$2$3$(context$3$0) {
            var _this2 = this;
            while (1) switch (context$3$0.prev = context$3$0.next) {case 0:
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

                context$3$0.next = 8;
                return flux.bootstrap({ window: window, headers: headers, guid: guid });

              case 8:
                // jshint ignore:line
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

              case 15:
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFhdEMsR0FBRztRQUFILEdBQUcsR0FDSSxTQURQLEdBQUcsR0FDTzs7O0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsRCxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQyxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztBQUV4QyxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUN4QyxNQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQzlCLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sSUFDN0IsTUFBSyxRQUFRLENB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QUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUM7O0FBQy9DLGlCQUFDLENBQUMsR0FBRyxDQUFDO3lCQUFNLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxHQUFHLGFBQWE7aUJBQUEsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0FBVS9ELG9CQUFJLENBQUMsbUJBQW1CLENBQUM7eUJBQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLFlBQVksQ0FBQyxXQUFXLENBQUM7aUJBQUEsQ0FBQyxDQUFDOzs7Ozs7U0FDOUY7Ozs7V0F6SUcsR0FBRzs7Ozs7QUE0SVQsR0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyw2QkFBNkI7QUFDakQsUUFBSSxFQUFFLElBQUk7QUFDVixRQUFJLEVBQUUsSUFBSTtBQUNWLGVBQVcsRUFBRSxJQUFJO0FBQ2pCLFlBQVEsRUFBRSxJQUFJO0FBQ2QsV0FBTyxFQUFFLElBQUksRUFDZCxDQUFDLENBQUM7O0FBRUgsR0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQztDQUNkLENBQUMiLCJmaWxlIjoiUi5BcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gICAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xyXG4gICAgY29uc3QgXyA9IFIuXztcclxuICAgIGNvbnN0IFBsdWdpbiA9IHJlcXVpcmUoJy4vUi5BcHAuUGx1Z2luJykoUik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIDxwPlNpbXBseSBjcmVhdGUgYW4gQXBwIGNsYXNzIHdpdGggc3BlY2lmaWNzPC9wPlxyXG4gICAgKiA8cD5Qcm92aWRlcyBtZXRob2RzIGluIG9yZGVyIHRvIHJlbmRlciB0aGUgc3BlY2lmaWVkIEFwcCBzZXJ2ZXItc2lkZSBhbmQgY2xpZW50LXNpZGU8L3A+XHJcbiAgICAqIDx1bD5cclxuICAgICogPGxpPiBBcHAuY3JlYXRlQXBwID0+IGluaXRpYWxpemVzIG1ldGhvZHMgb2YgYW4gYXBwbGljYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZCA8L2xpPlxyXG4gICAgKiA8bGk+IEFwcC5yZW5kZXJUb1N0cmluZ0luU2VydmVyID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50IDwvbGk+XHJcbiAgICAqIDxsaT4gQXBwLnJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50ID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgY2xpZW50LXNpZGUgYW5kIGVzdGFibGlzaGVzIGEgY29ubmVjdGlvbiB2aWEgc29ja2V0IGluIG9yZGVyIHRvIG1ha2UgZGF0YSBzdWJzY3JpcHRpb25zPC9saT5cclxuICAgICogPGxpPiBBcHAuY3JlYXRlUGx1Z2luID0+IGluaXRpbGlhemlhdGlvbiBtZXRob2Qgb2YgYSBwbHVnaW4gZm9yIHRoZSBhcHBsaWNhdGlvbiA8L2xpPlxyXG4gICAgKiA8L3VsPlxyXG4gICAgKiBAY2xhc3MgUi5BcHBcclxuICAgICovXHJcbiAgICBjbGFzcyBBcHAge1xyXG4gICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLkZsdXggPSB0aGlzLmdldEZsdXhDbGFzcygpO1xyXG4gICAgICAgIHRoaXMuUm9vdCA9IHRoaXMuZ2V0Um9vdENsYXNzKCk7XHJcbiAgICAgICAgdGhpcy5Sb290RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkodGhpcy5Sb290KTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5nZXRUZW1wbGF0ZSgpO1xyXG4gICAgICAgIHRoaXMuUGx1Z2lucyA9IHRoaXMuZ2V0UGx1Z2luc0NsYXNzZXMoKTtcclxuXHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5GbHV4LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgICB0aGlzLlJvb3Quc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcclxuICAgICAgICAgIHRoaXMudmFycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgICB0aGlzLnRlbXBsYXRlLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgICB0aGlzLlBsdWdpbnMuc2hvdWxkLmJlLmFuLkFycmF5XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcmVyZW5kZXIgPSBfLnNjb3BlKHRoaXMucHJlcmVuZGVyLCB0aGlzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZ2V0Rmx1eENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICAgIGdldFJvb3RDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICBnZXRUZW1wbGF0ZSgpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICBnZXRQbHVnaW5zQ2xhc3NlcygpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICAvLyBGdXR1cmUtcHJvb2Y6IG1pZ2h0IGRvIHNvbWV0aGluZyB3aXRoIHsgcmVxLCB3aW5kb3cgfSBhdCBzb21lIHBvaW50XHJcbiAgICAgIC8vIG9mIHRoZSBmdXR1cmUuXHJcbiAgICAgICpnZXRUZW1wbGF0ZVZhcnMoeyByZXEgfSkgeyBfLmFic3RyYWN0KCk7IH0gLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcblxyXG4gICAgICBwcmVyZW5kZXIocmVxLCByZXMpIHtcclxuICAgICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xyXG4gICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHlpZWxkIHRoaXMucmVuZGVyKHsgcmVxIH0pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhdGNoKGUpIHtcclxuICAgICAgICAgICAgbGV0IGVyciA9IGUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgbGV0IHN0YWNrO1xyXG4gICAgICAgICAgICBfLmRldigoKSA9PiBzdGFjayA9IGUuc3RhY2spO1xyXG4gICAgICAgICAgICBfLnByb2QoKCkgPT4gc3RhY2sgPSBudWxsKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKHsgZXJyLCBzdGFjayB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgKnJlbmRlcih7IHJlcSwgd2luZG93IH0pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpID8gcmVxLnNob3VsZC5iZS5hbi5PYmplY3QgOiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIF8uaXNTZXJ2ZXIoKSA/IHlpZWxkIHRoaXMuX3JlbmRlckluU2VydmVyKHJlcSkgOiB5aWVsZCB0aGlzLl9yZW5kZXJJbkNsaWVudCh3aW5kb3cpOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcclxuICAgICAgfVxyXG4gICAgICAvKipcclxuICAgICAgKiA8cD5Db21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBzZXJ2ZXItc2lkZSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudDwvcD5cclxuICAgICAgKiBAbWV0aG9kIHJlbmRlclRvU3RyaW5nSW5TZXJ2ZXJcclxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxIFRoZSBjbGFzc2ljYWwgcmVxdWVzdCBvYmplY3RcclxuICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHRlbXBsYXRlIDogdGhlIGNvbXB1dGVkIEhUTUwgdGVtcGxhdGUgd2l0aCBkYXRhIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnRcclxuICAgICAgKi9cclxuICAgICAgKl9yZW5kZXJJblNlcnZlcihyZXEpIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgICAgcmVxLmhlYWRlcnMuc2hvdWxkLmJlLm9rXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgbGV0IGd1aWQgPSBfLmd1aWQoKTtcclxuICAgICAgICBsZXQgaGVhZGVycyA9IHJlcS5oZWFkZXJzO1xyXG4gICAgICAgIGxldCBmbHV4ID0gbmV3IHRoaXMuRmx1eCh7IGd1aWQsIGhlYWRlcnMsIHJlcSB9KTtcclxuICAgICAgICAvLyBSZWdpc3RlciBzdG9yZSAoUi5TdG9yZSkgOiBVcGxpbmtTZXJ2ZXIgYW5kIE1lbW9yeVxyXG4gICAgICAgIC8vIEluaXRpYWxpemVzIGZsdXggYW5kIFVwbGlua1NlcnZlciBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGZldGNoIGRhdGEgZnJvbSB1cGxpbmstc2VydmVyXHJcbiAgICAgICAgeWllbGQgZmx1eC5ib290c3RyYXAoKTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXHJcblxyXG4gICAgICAgIC8vIEluaXRpYWxpemVzIHBsdWdpbiBhbmQgZmlsbCBhbGwgY29ycmVzcG9uZGluZyBkYXRhIGZvciBzdG9yZSA6IE1lbW9yeVxyXG4gICAgICAgIGxldCBwbHVnaW5zID0gdGhpcy5QbHVnaW5zLm1hcCgoUGx1Z2luKSA9PiBuZXcgUGx1Z2luKHsgZmx1eCwgcmVxLCBoZWFkZXJzIH0pKTtcclxuXHJcbiAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xyXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgUmVhY3QgaW5zdGFuY2Ugb2Ygcm9vdCBjb21wb25lbnQgd2l0aCBmbHV4XHJcbiAgICAgICAgbGV0IHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQgPSBuZXcgdGhpcy5Sb290Ll9fUmVhY3ROZXh1c1N1cnJvZ2F0ZSh7fSwgcm9vdFByb3BzKTtcclxuICAgICAgICBpZighc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIHtcclxuICAgICAgICAgIF8uZGV2KCgpID0+IGNvbnNvbGUuZXJyb3IoJ1Jvb3QgY29tcG9uZW50IHJlcXVpcmVzIGNvbXBvbmVudFdpbGxNb3VudCBpbXBsZW1lbnRhdGlvbi4gTWF5YmUgeW91IGZvcmdvdCB0byBtaXhpbiBSLlJvb3QuTWl4aW4/JykpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbXVsYXRlIFJlYWN0IGxpZmVjeWNsZVxyXG4gICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XHJcbiAgICAgICAgeWllbGQgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcclxuICAgICAgICBzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XHJcblxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgc2VydmVyLXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHMgOlxyXG4gICAgICAgICogMS4gZ2V0SW5pdGlhbFN0YXRlIDogcmV0dXJuIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgYW5kIGZpbGwgdGhlIGNvbXBvbmVudCdzIHN0YXRlXHJcbiAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBzaW1wbGUgaW5pdGlhbGl6YXRpb25cclxuICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggdGhlIGNvbXBvbmVudCdzIHN0YXRlXHJcbiAgICAgICAgKi9cclxuICAgICAgICBsZXQgcm9vdENvbXBvbmVudCA9IHRoaXMuUm9vdEZhY3Rvcnkocm9vdFByb3BzKTtcclxuICAgICAgICBsZXQgcm9vdEh0bWw7XHJcbiAgICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IHJvb3RIdG1sID0gUmVhY3QucmVuZGVyVG9TdHJpbmcocm9vdENvbXBvbmVudCkpO1xyXG4gICAgICAgIC8vIFNlcmlhbGl6ZXMgZmx1eCBpbiBvcmRlciB0byBwcm92aWRlcyBhbGwgcHJlZmV0Y2hlZCBzdG9yZWQgZGF0YSB0byB0aGUgY2xpZW50XHJcbiAgICAgICAgbGV0IHNlcmlhbGl6ZWRGbHV4ID0gZmx1eC5zZXJpYWxpemUoKTtcclxuICAgICAgICBmbHV4LmRlc3Ryb3koKTtcclxuICAgICAgICBwbHVnaW5zLmZvckVhY2goKHBsdWdpbikgPT4gcGx1Z2luLmRlc3Ryb3koKSk7XHJcblxyXG4gICAgICAgIGxldCBzZXJpYWxpemVkSGVhZGVycyA9IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KGhlYWRlcnMpKTtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZShfLmV4dGVuZCh7fSwgeWllbGQgdGhpcy5nZXRUZW1wbGF0ZVZhcnMoeyByZXEgfSksIHsgcm9vdEh0bWwsIHNlcmlhbGl6ZWRGbHV4LCBzZXJpYWxpemVkSGVhZGVycywgZ3VpZCB9KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAqIDxwPlNldHRpbmcgYWxsIHRoZSBkYXRhIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudCBhbmQgUmVuZGVyIGl0IGludG8gdGhlIGNsaWVudC4gPGJyIC8+XHJcbiAgICAgICogQ29ubmVjdGluZyB0byB0aGUgdXBsaW5rLXNlcnZlciB2aWEgaW4gb3JkZXIgdG8gZW5hYmxlIHRoZSBlc3RhYmxpc2htZW50IG9mIHN1YnNyaXB0aW9ucyBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQ8L3A+XHJcbiAgICAgICogQG1ldGhvZCByZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudFxyXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSB3aW5kb3cgVGhlIGNsYXNzaWNhbCB3aW5kb3cgb2JqZWN0XHJcbiAgICAgICovXHJcbiAgICAgICpfcmVuZGVySW5DbGllbnQod2luZG93KSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxyXG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNDbGllbnQoKS5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5ndWlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEhlYWRlcnMuc2hvdWxkLmJlLmEuU3RyaW5nICYmXHJcbiAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RFbGVtZW50LnNob3VsZC5iZS5va1xyXG4gICAgICAgICk7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5hcHAgPSB0aGlzKTtcclxuICAgICAgICBsZXQgaGVhZGVycyA9IEpTT04ucGFyc2UoXy5iYXNlNjREZWNvZGUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkSGVhZGVycykpO1xyXG4gICAgICAgIGxldCBndWlkID0gd2luZG93Ll9fUmVhY3ROZXh1cy5ndWlkO1xyXG4gICAgICAgIGxldCBmbHV4ID0gbmV3IHRoaXMuRmx1eCh7IGhlYWRlcnMsIGd1aWQsIHdpbmRvdyB9KTtcclxuICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLmZsdXggPSBmbHV4KTtcclxuXHJcbiAgICAgICAgeWllbGQgZmx1eC5ib290c3RyYXAoeyB3aW5kb3csIGhlYWRlcnMsIGd1aWQgfSk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxyXG4gICAgICAgIGZsdXgudW5zZXJpYWxpemUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eCk7XHJcbiAgICAgICAgbGV0IHBsdWdpbnMgPSB0aGlzLlBsdWdpbnMuZm9yRWFjaCgoUGx1Z2luKSA9PiBuZXcgUGx1Z2luKHsgZmx1eCwgd2luZG93LCBoZWFkZXJzIH0pKTtcclxuICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLnBsdWdpbnMgPSBwbHVnaW5zKTtcclxuXHJcbiAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xyXG4gICAgICAgIGxldCByb290Q29tcG9uZW50ID0gdGhpcy5Sb290RmFjdG9yeShyb290UHJvcHMpO1xyXG4gICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQpO1xyXG4gICAgICAgIC8qXHJcbiAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgY2xpZW50LXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHM6XHJcbiAgICAgICAgKiAxLiBnZXRJbml0aWFsU3RhdGUgOiByZXR1cm4gc3RvcmUgZGF0YSBjb21wdXRlZCBzZXJ2ZXItc2lkZSB3aXRoIFIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXNcclxuICAgICAgICAqIDIuIGNvbXBvbmVudFdpbGxNb3VudCA6IGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHN0b3JlIGRhdGEgY29tcHV0ZWQgc2VydmVyLXNpZGUgd2l0aCBSLkZsdXgucHJlZmV0Y2hGbHV4U3RvcmVzXHJcbiAgICAgICAgKiBSb290IENvbXBvbmVudCBhbHJlYWR5IGhhcyB0aGlzIHNlcnZlci1yZW5kZXJlZCBtYXJrdXAsXHJcbiAgICAgICAgKiBSZWFjdCB3aWxsIHByZXNlcnZlIGl0IGFuZCBvbmx5IGF0dGFjaCBldmVudCBoYW5kbGVycy5cclxuICAgICAgICAqIDQuIEZpbmFsbHkgY29tcG9uZW50RGlkTW91bnQgKHN1YnNjcmliZSBhbmQgZmV0Y2hpbmcgZGF0YSkgdGhlbiByZXJlbmRlcmluZyB3aXRoIG5ldyBwb3RlbnRpYWwgY29tcHV0ZWQgZGF0YVxyXG4gICAgICAgICovXHJcbiAgICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IFJlYWN0LnJlbmRlcihyb290Q29tcG9uZW50LCB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RFbGVtZW50KSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBfLmV4dGVuZChBcHAucHJvdG90eXBlLCAvKiogQGxlbmRzIEFwcC5wcm90b3R5cGUgKi97XHJcbiAgICAgIEZsdXg6IG51bGwsXHJcbiAgICAgIFJvb3Q6IG51bGwsXHJcbiAgICAgIFJvb3RGYWN0b3J5OiBudWxsLFxyXG4gICAgICB0ZW1wbGF0ZTogbnVsbCxcclxuICAgICAgUGx1Z2luczogbnVsbCxcclxuICAgIH0pO1xyXG5cclxuICAgIF8uZXh0ZW5kKEFwcCwgeyBQbHVnaW4gfSk7XHJcbiAgICByZXR1cm4gQXBwO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=