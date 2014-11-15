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
  var Plugin = require("./R.App.Plugin")(R);

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
      prerender: {
        writable: true,
        value: function (req, res) {
          this.render({ req: req }).then(function (html) {
            return res.status(200).send(html);
          }).catch(function (err) {
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
              while (1) switch (context$4$0.prev = context$4$0.next) {
                case 0:
                  _.dev(function () {
                    return _.isServer().should.be.ok && req.headers.should.be.ok;
                  });

                  guid = _.guid();
                  headers = req.headers;
                  flux = new this.Flux({ guid: guid, headers: headers, req: req });
                  context$4$0.next = 6;
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
                  context$4$0.next = 13;
                  return surrogateRootComponent.prefetchFluxStores();
                case 13:
                  surrogateRootComponent.componentWillUnmount();

                  rootComponentFactory = React.createFactory(this.Root);
                  rootComponent = rootComponentFactory(rootProps);


                  /*
                  * Render root component server-side, for each components :
                  * 1. getInitialState : return prefetched stored data and fill the component's state
                  * 2. componentWillMount : simple initialization
                  * 3. Render : compute DOM with the component's state
                  */
                  flux.injectingFromStores(function () {
                    return rootHtml = React.renderToString(rootComponent);
                  });
                  serializedFlux = flux.serialize();
                  flux.destroy();
                  plugins.forEach(function (plugin) {
                    return plugin.destroy();
                  });

                  context$4$0.next = 22;
                  return this.getTemplateVars({ req: req });
                case 22: context$4$0.t0 = context$4$0.sent;
                  vars = _.extend({}, context$4$0.t0, this.vars);
                  serializedHeaders = _.base64Encode(JSON.stringify(headers));
                  return context$4$0.abrupt("return", this.template({ vars: vars, rootHtml: rootHtml, serializedFlux: serializedFlux, serializedHeaders: serializedHeaders, guid: guid }, this.templateLibs));
                case 26:
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
            var _this2, headers, guid, flux, plugins, rootProps, rootComponentFactory, rootComponent;
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {
                case 0: _this2 = this;
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

                  context$4$0.next = 9;
                  return flux.bootstrap({ window: window, headers: headers, guid: guid });
                case 9:
                  flux.unserialize(window.__ReactNexus.serializedFlux);
                  plugins = this.Plugins.forEach(function (Plugin) {
                    return new Plugin({ flux: flux, window: window, headers: headers });
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
                case 17:
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
    Flux: null,
    Root: null,
    template: null,
    vars: null,
    Plugins: null,
    bootstrapTemplateVarsInServer: null });

  _.extend(App, { Plugin: Plugin });
  return App;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQ3pCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7QUFDeEIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQWF0QyxHQUFHO1FBQUgsR0FBRyxHQUNJLFNBRFAsR0FBRyxHQUNPOztBQUNaLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ2xDLFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25DLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0FBQzNDLFVBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7O0FBRXhDLE9BQUMsQ0FBQyxHQUFHLENBQUM7ZUFBTSxNQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLElBQ3hDLE1BQUssSUFBSSxDQUFDLE1B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R0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQU4sTUFBTSxFQUFFLENBQUMsQ0FBQztBQUMxQixTQUFPLEdBQUcsQ0FBQztDQUNkLENBQUMiLCJmaWxlIjoiUi5BcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG5jb25zdCBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oUikge1xyXG4gICAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xyXG4gICAgY29uc3QgXyA9IFIuXztcclxuICAgIGNvbnN0IHNob3VsZCA9IFIuc2hvdWxkO1xyXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcclxuICAgIGNvbnN0IFBsdWdpbiA9IHJlcXVpcmUoJy4vUi5BcHAuUGx1Z2luJykoUik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIDxwPlNpbXBseSBjcmVhdGUgYW4gQXBwIGNsYXNzIHdpdGggc3BlY2lmaWNzPC9wPlxyXG4gICAgKiA8cD5Qcm92aWRlcyBtZXRob2RzIGluIG9yZGVyIHRvIHJlbmRlciB0aGUgc3BlY2lmaWVkIEFwcCBzZXJ2ZXItc2lkZSBhbmQgY2xpZW50LXNpZGU8L3A+XHJcbiAgICAqIDx1bD5cclxuICAgICogPGxpPiBBcHAuY3JlYXRlQXBwID0+IGluaXRpYWxpemVzIG1ldGhvZHMgb2YgYW4gYXBwbGljYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZCA8L2xpPlxyXG4gICAgKiA8bGk+IEFwcC5yZW5kZXJUb1N0cmluZ0luU2VydmVyID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50IDwvbGk+XHJcbiAgICAqIDxsaT4gQXBwLnJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50ID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgY2xpZW50LXNpZGUgYW5kIGVzdGFibGlzaGVzIGEgY29ubmVjdGlvbiB2aWEgc29ja2V0IGluIG9yZGVyIHRvIG1ha2UgZGF0YSBzdWJzY3JpcHRpb25zPC9saT5cclxuICAgICogPGxpPiBBcHAuY3JlYXRlUGx1Z2luID0+IGluaXRpbGlhemlhdGlvbiBtZXRob2Qgb2YgYSBwbHVnaW4gZm9yIHRoZSBhcHBsaWNhdGlvbiA8L2xpPlxyXG4gICAgKiA8L3VsPlxyXG4gICAgKiBAY2xhc3MgUi5BcHBcclxuICAgICovXHJcbiAgICBjbGFzcyBBcHAge1xyXG4gICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLkZsdXggPSB0aGlzLmdldEZsdXhDbGFzcygpO1xyXG4gICAgICAgIHRoaXMuUm9vdCA9IHRoaXMuZ2V0Um9vdENsYXNzKCk7XHJcbiAgICAgICAgdGhpcy52YXJzID0gdGhpcy5nZXREZWZhdWx0VmFycygpO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLmdldFRlbXBsYXRlKCk7XHJcbiAgICAgICAgdGhpcy50ZW1wbGF0ZUxpYnMgPSB0aGlzLmdldFRlbXBsYXRlTGlicygpO1xyXG4gICAgICAgIHRoaXMuUGx1Z2lucyA9IHRoaXMuZ2V0UGx1Z2luc0NsYXNzZXMoKTtcclxuXHJcbiAgICAgICAgXy5kZXYoKCkgPT4gdGhpcy5GbHV4LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgICB0aGlzLlJvb3Quc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcclxuICAgICAgICAgIHRoaXMudmFycy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgICB0aGlzLnRlbXBsYXRlLnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgICB0aGlzLnRlbXBsYXRlTGlicy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgICB0aGlzLlBsdWdpbnMuc2hvdWxkLmJlLmFuLkFycmF5XHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgZ2V0Rmx1eENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICAgIGdldFJvb3RDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICBnZXREZWZhdWx0VmFycygpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICBnZXRUZW1wbGF0ZSgpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICBnZXRUZW1wbGF0ZUxpYnMoKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgICAgZ2V0UGx1Z2luc0NsYXNzZXMoKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgICAgZ2V0VGVtcGxhdGVWYXJzKHsgcmVxIH0pIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICBwcmVyZW5kZXIocmVxLCByZXMpIHtcclxuICAgICAgICB0aGlzLnJlbmRlcih7IHJlcSB9KVxyXG4gICAgICAgIC50aGVuKChodG1sKSA9PiByZXMuc3RhdHVzKDIwMCkuc2VuZChodG1sKSlcclxuICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgICAgbGV0IGpzb24gPSB7IGVycjogZXJyLnRvU3RyaW5nKCkgfTtcclxuICAgICAgICAgIF8uZGV2KCgpID0+IF8uZXh0ZW5kKGpzb24sIHsgc3RhY2s6IGVyci5zdGFjayB9KSk7XHJcbiAgICAgICAgICByZXR1cm4gcmVzLnN0YXR1cyg1MDApLmpzb24oanNvbik7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJlbmRlcih7IHJlcSwgd2luZG93IH0pIHtcclxuICAgICAgICBfLmRldigoKSA9PiBfLmlzU2VydmVyKCkgPyByZXEuc2hvdWxkLmJlLmFuLk9iamVjdCA6IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcclxuICAgICAgICByZXR1cm4gXy5pc1NlcnZlcigpID8gdGhpcy5fcmVuZGVySW5TZXJ2ZXIocmVxKSA6IHRoaXMuX3JlbmRlckluQ2xpZW50KHdpbmRvdyk7XHJcbiAgICAgIH1cclxuICAgICAgLyoqXHJcbiAgICAgICogPHA+Q29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgc2VydmVyLXNpZGUgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQ8L3A+XHJcbiAgICAgICogQG1ldGhvZCByZW5kZXJUb1N0cmluZ0luU2VydmVyXHJcbiAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlcSBUaGUgY2xhc3NpY2FsIHJlcXVlc3Qgb2JqZWN0XHJcbiAgICAgICogQHJldHVybiB7b2JqZWN0fSB0ZW1wbGF0ZSA6IHRoZSBjb21wdXRlZCBIVE1MIHRlbXBsYXRlIHdpdGggZGF0YSBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50XHJcbiAgICAgICovXHJcbiAgICAgIF9yZW5kZXJJblNlcnZlcihyZXEpIHtcclxuICAgICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xyXG4gICAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgICAgICByZXEuaGVhZGVycy5zaG91bGQuYmUub2tcclxuICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgbGV0IGd1aWQgPSBfLmd1aWQoKTtcclxuICAgICAgICAgIGxldCBoZWFkZXJzID0gcmVxLmhlYWRlcnM7XHJcbiAgICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBndWlkLCBoZWFkZXJzLCByZXEgfSk7XHJcbiAgICAgICAgICAvLyBSZWdpc3RlciBzdG9yZSAoUi5TdG9yZSkgOiBVcGxpbmtTZXJ2ZXIgYW5kIE1lbW9yeVxyXG4gICAgICAgICAgLy8gSW5pdGlhbGl6ZXMgZmx1eCBhbmQgVXBsaW5rU2VydmVyIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gZmV0Y2ggZGF0YSBmcm9tIHVwbGluay1zZXJ2ZXJcclxuICAgICAgICAgIHlpZWxkIGZsdXguYm9vdHN0cmFwKCk7XHJcblxyXG4gICAgICAgICAgLy8gSW5pdGlhbGl6ZXMgcGx1Z2luIGFuZCBmaWxsIGFsbCBjb3JyZXNwb25kaW5nIGRhdGEgZm9yIHN0b3JlIDogTWVtb3J5XHJcbiAgICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5tYXAoKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHJlcSwgaGVhZGVycyB9KSk7XHJcblxyXG4gICAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xyXG4gICAgICAgICAgLy8gQ3JlYXRlIHRoZSBSZWFjdCBpbnN0YW5jZSBvZiByb290IGNvbXBvbmVudCB3aXRoIGZsdXhcclxuICAgICAgICAgIGxldCBzdXJyb2dhdGVSb290Q29tcG9uZW50ID0gbmV3IHRoaXMuUm9vdC5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoe30sIHJvb3RQcm9wcyk7XHJcbiAgICAgICAgICBpZighc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQpIHtcclxuICAgICAgICAgICAgXy5kZXYoKCkgPT4gY29uc29sZS5lcnJvcignUm9vdCBjb21wb25lbnQgcmVxdWlyZXMgY29tcG9uZW50V2lsbE1vdW50IGltcGxlbWVudGF0aW9uLiBNYXliZSB5b3UgZm9yZ290IHRvIG1peGluIFIuUm9vdC5NaXhpbj8nKSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICAvLyBFbXVsYXRlIFJlYWN0IGxpZmVjeWNsZVxyXG4gICAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcclxuICAgICAgICAgIHlpZWxkIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQucHJlZmV0Y2hGbHV4U3RvcmVzKCk7XHJcbiAgICAgICAgICBzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KCk7XHJcblxyXG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnRGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSh0aGlzLlJvb3QpO1xyXG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50RmFjdG9yeShyb290UHJvcHMpO1xyXG4gICAgICAgICAgbGV0IHJvb3RIdG1sO1xyXG5cclxuICAgICAgICAgIC8qXHJcbiAgICAgICAgICAqIFJlbmRlciByb290IGNvbXBvbmVudCBzZXJ2ZXItc2lkZSwgZm9yIGVhY2ggY29tcG9uZW50cyA6XHJcbiAgICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIGFuZCBmaWxsIHRoZSBjb21wb25lbnQncyBzdGF0ZVxyXG4gICAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBzaW1wbGUgaW5pdGlhbGl6YXRpb25cclxuICAgICAgICAgICogMy4gUmVuZGVyIDogY29tcHV0ZSBET00gd2l0aCB0aGUgY29tcG9uZW50J3Mgc3RhdGVcclxuICAgICAgICAgICovXHJcbiAgICAgICAgICBmbHV4LmluamVjdGluZ0Zyb21TdG9yZXMoKCkgPT4gcm9vdEh0bWwgPSBSZWFjdC5yZW5kZXJUb1N0cmluZyhyb290Q29tcG9uZW50KSk7XHJcbiAgICAgICAgICAvLyBTZXJpYWxpemVzIGZsdXggaW4gb3JkZXIgdG8gcHJvdmlkZXMgYWxsIHByZWZldGNoZWQgc3RvcmVkIGRhdGEgdG8gdGhlIGNsaWVudFxyXG4gICAgICAgICAgbGV0IHNlcmlhbGl6ZWRGbHV4ID0gZmx1eC5zZXJpYWxpemUoKTtcclxuICAgICAgICAgIGZsdXguZGVzdHJveSgpO1xyXG4gICAgICAgICAgcGx1Z2lucy5mb3JFYWNoKChwbHVnaW4pID0+IHBsdWdpbi5kZXN0cm95KCkpO1xyXG5cclxuICAgICAgICAgIGxldCB2YXJzID0gXy5leHRlbmQoe30sIHlpZWxkIHRoaXMuZ2V0VGVtcGxhdGVWYXJzKHsgcmVxIH0pLCB0aGlzLnZhcnMpO1xyXG4gICAgICAgICAgbGV0IHNlcmlhbGl6ZWRIZWFkZXJzID0gXy5iYXNlNjRFbmNvZGUoSlNPTi5zdHJpbmdpZnkoaGVhZGVycykpO1xyXG4gICAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGUoeyB2YXJzLCByb290SHRtbCwgc2VyaWFsaXplZEZsdXgsIHNlcmlhbGl6ZWRIZWFkZXJzLCBndWlkIH0sIHRoaXMudGVtcGxhdGVMaWJzKTtcclxuXHJcbiAgICAgICAgfSwgdGhpcyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8qKlxyXG4gICAgICAqIDxwPlNldHRpbmcgYWxsIHRoZSBkYXRhIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudCBhbmQgUmVuZGVyIGl0IGludG8gdGhlIGNsaWVudC4gPGJyIC8+XHJcbiAgICAgICogQ29ubmVjdGluZyB0byB0aGUgdXBsaW5rLXNlcnZlciB2aWEgaW4gb3JkZXIgdG8gZW5hYmxlIHRoZSBlc3RhYmxpc2htZW50IG9mIHN1YnNyaXB0aW9ucyBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQ8L3A+XHJcbiAgICAgICogQG1ldGhvZCByZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudFxyXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSB3aW5kb3cgVGhlIGNsYXNzaWNhbCB3aW5kb3cgb2JqZWN0XHJcbiAgICAgICovXHJcbiAgICAgIF9yZW5kZXJJbkNsaWVudCh3aW5kb3cpIHtcclxuICAgICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xyXG4gICAgICAgICAgXy5kZXYoKCkgPT4gXy5pc0NsaWVudCgpLnNob3VsZC5iZS5vayAmJlxyXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNob3VsZC5iZS5hbi5PYmplY3QgJiZcclxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5ndWlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRGbHV4LnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnNlcmlhbGl6ZWRIZWFkZXJzLnNob3VsZC5iZS5hLlN0cmluZyAmJlxyXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RFbGVtZW50LnNob3VsZC5iZS5va1xyXG4gICAgICAgICAgKTtcclxuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMuYXBwID0gdGhpcyk7XHJcbiAgICAgICAgICBsZXQgaGVhZGVycyA9IEpTT04ucGFyc2UoXy5iYXNlNjREZWNvZGUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkSGVhZGVycykpO1xyXG4gICAgICAgICAgbGV0IGd1aWQgPSB3aW5kb3cuX19SZWFjdE5leHVzLmd1aWQ7XHJcbiAgICAgICAgICBsZXQgZmx1eCA9IG5ldyB0aGlzLkZsdXgoeyBoZWFkZXJzLCBndWlkLCB3aW5kb3cgfSk7XHJcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLmZsdXggPSBmbHV4KTtcclxuXHJcbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCh7IHdpbmRvdywgaGVhZGVycywgZ3VpZCB9KTtcclxuICAgICAgICAgIGZsdXgudW5zZXJpYWxpemUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eCk7XHJcbiAgICAgICAgICBsZXQgcGx1Z2lucyA9IHRoaXMuUGx1Z2lucy5mb3JFYWNoKChQbHVnaW4pID0+IG5ldyBQbHVnaW4oeyBmbHV4LCB3aW5kb3csIGhlYWRlcnMgfSkpO1xyXG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5wbHVnaW5zID0gcGx1Z2lucyk7XHJcblxyXG4gICAgICAgICAgbGV0IHJvb3RQcm9wcyA9IHsgZmx1eCwgcGx1Z2lucyB9O1xyXG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnRGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSh0aGlzLlJvb3QpO1xyXG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50RmFjdG9yeShyb290UHJvcHMpO1xyXG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5yb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudCk7XHJcbiAgICAgICAgICAvKlxyXG4gICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgY2xpZW50LXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHM6XHJcbiAgICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xyXG4gICAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBpbml0aWFsaXphdGlvblxyXG4gICAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHN0b3JlIGRhdGEgY29tcHV0ZWQgc2VydmVyLXNpZGUgd2l0aCBSLkZsdXgucHJlZmV0Y2hGbHV4U3RvcmVzXHJcbiAgICAgICAgICAqIFJvb3QgQ29tcG9uZW50IGFscmVhZHkgaGFzIHRoaXMgc2VydmVyLXJlbmRlcmVkIG1hcmt1cCxcclxuICAgICAgICAgICogUmVhY3Qgd2lsbCBwcmVzZXJ2ZSBpdCBhbmQgb25seSBhdHRhY2ggZXZlbnQgaGFuZGxlcnMuXHJcbiAgICAgICAgICAqIDQuIEZpbmFsbHkgY29tcG9uZW50RGlkTW91bnQgKHN1YnNjcmliZSBhbmQgZmV0Y2hpbmcgZGF0YSkgdGhlbiByZXJlbmRlcmluZyB3aXRoIG5ldyBwb3RlbnRpYWwgY29tcHV0ZWQgZGF0YVxyXG4gICAgICAgICAgKi9cclxuICAgICAgICAgIGZsdXguaW5qZWN0aW5nRnJvbVN0b3JlcygoKSA9PiBSZWFjdC5yZW5kZXIocm9vdENvbXBvbmVudCwgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudCkpO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIF8uZXh0ZW5kKEFwcC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgQXBwLnByb3RvdHlwZSAqL3tcclxuICAgICAgRmx1eDogbnVsbCxcclxuICAgICAgUm9vdDogbnVsbCxcclxuICAgICAgdGVtcGxhdGU6IG51bGwsXHJcbiAgICAgIHZhcnM6IG51bGwsXHJcbiAgICAgIFBsdWdpbnM6IG51bGwsXHJcbiAgICAgIGJvb3RzdHJhcFRlbXBsYXRlVmFyc0luU2VydmVyOiBudWxsLFxyXG4gICAgfSk7XHJcblxyXG4gICAgXy5leHRlbmQoQXBwLCB7IFBsdWdpbiB9KTtcclxuICAgIHJldHVybiBBcHA7XHJcbn07XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==