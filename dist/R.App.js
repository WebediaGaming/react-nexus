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

                case 22:
                  context$4$0.t0 = context$4$0.sent;
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
                case 0:
                  _this2 = this;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFhdEMsR0FBRztRQUFILEdBQUcsR0FDSSxTQURQLEdBQUcsR0FDTzs7O0FBQ1osVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7QUFDaEMsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDbEMsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkMsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDM0MsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFeEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDeEMsTUFBSyxJ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QUFJLEVBQ3BDLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLFNBQU8sR0FBRyxDQUFDO0NBQ2QsQ0FBQyIsImZpbGUiOiJSLkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gICAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuICAgIGNvbnN0IF8gPSBSLl87XG4gICAgY29uc3Qgc2hvdWxkID0gUi5zaG91bGQ7XG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICBjb25zdCBQbHVnaW4gPSByZXF1aXJlKCcuL1IuQXBwLlBsdWdpbicpKFIpO1xuXG4gICAgLyoqXG4gICAgKiA8cD5TaW1wbHkgY3JlYXRlIGFuIEFwcCBjbGFzcyB3aXRoIHNwZWNpZmljczwvcD5cbiAgICAqIDxwPlByb3ZpZGVzIG1ldGhvZHMgaW4gb3JkZXIgdG8gcmVuZGVyIHRoZSBzcGVjaWZpZWQgQXBwIHNlcnZlci1zaWRlIGFuZCBjbGllbnQtc2lkZTwvcD5cbiAgICAqIDx1bD5cbiAgICAqIDxsaT4gQXBwLmNyZWF0ZUFwcCA9PiBpbml0aWFsaXplcyBtZXRob2RzIG9mIGFuIGFwcGxpY2F0aW9uIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWNhdGlvbnMgcHJvdmlkZWQgPC9saT5cbiAgICAqIDxsaT4gQXBwLnJlbmRlclRvU3RyaW5nSW5TZXJ2ZXIgPT4gY29tcHV0ZSBhbGwgUmVhY3QgQ29tcG9uZW50cyB3aXRoIGRhdGEgYW5kIHJlbmRlciB0aGUgY29ycmVzcG9uZGluZyBIVE1MIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnQgPC9saT5cbiAgICAqIDxsaT4gQXBwLnJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50ID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgY2xpZW50LXNpZGUgYW5kIGVzdGFibGlzaGVzIGEgY29ubmVjdGlvbiB2aWEgc29ja2V0IGluIG9yZGVyIHRvIG1ha2UgZGF0YSBzdWJzY3JpcHRpb25zPC9saT5cbiAgICAqIDxsaT4gQXBwLmNyZWF0ZVBsdWdpbiA9PiBpbml0aWxpYXppYXRpb24gbWV0aG9kIG9mIGEgcGx1Z2luIGZvciB0aGUgYXBwbGljYXRpb24gPC9saT5cbiAgICAqIDwvdWw+XG4gICAgKiBAY2xhc3MgUi5BcHBcbiAgICAqL1xuICAgIGNsYXNzIEFwcCB7XG4gICAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5GbHV4ID0gdGhpcy5nZXRGbHV4Q2xhc3MoKTtcbiAgICAgICAgdGhpcy5Sb290ID0gdGhpcy5nZXRSb290Q2xhc3MoKTtcbiAgICAgICAgdGhpcy52YXJzID0gdGhpcy5nZXREZWZhdWx0VmFycygpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5nZXRUZW1wbGF0ZSgpO1xuICAgICAgICB0aGlzLnRlbXBsYXRlTGlicyA9IHRoaXMuZ2V0VGVtcGxhdGVMaWJzKCk7XG4gICAgICAgIHRoaXMuUGx1Z2lucyA9IHRoaXMuZ2V0UGx1Z2luc0NsYXNzZXMoKTtcblxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLkZsdXguc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgICB0aGlzLlJvb3Quc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgICB0aGlzLnZhcnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICAgIHRoaXMudGVtcGxhdGUuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgICB0aGlzLnRlbXBsYXRlTGlicy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgICAgdGhpcy5QbHVnaW5zLnNob3VsZC5iZS5hbi5BcnJheVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBnZXRGbHV4Q2xhc3MoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRSb290Q2xhc3MoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXREZWZhdWx0VmFycygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIGdldFRlbXBsYXRlKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0VGVtcGxhdGVMaWJzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0UGx1Z2luc0NsYXNzZXMoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRUZW1wbGF0ZVZhcnMoeyByZXEgfSkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgcHJlcmVuZGVyKHJlcSwgcmVzKSB7XG4gICAgICAgIHRoaXMucmVuZGVyKHsgcmVxIH0pXG4gICAgICAgIC50aGVuKChodG1sKSA9PiByZXMuc3RhdHVzKDIwMCkuc2VuZChodG1sKSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICBsZXQganNvbiA9IHsgZXJyOiBlcnIudG9TdHJpbmcoKSB9O1xuICAgICAgICAgIF8uZGV2KCgpID0+IF8uZXh0ZW5kKGpzb24sIHsgc3RhY2s6IGVyci5zdGFjayB9KSk7XG4gICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKGpzb24pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyKHsgcmVxLCB3aW5kb3cgfSkge1xuICAgICAgICBfLmRldigoKSA9PiBfLmlzU2VydmVyKCkgPyByZXEuc2hvdWxkLmJlLmFuLk9iamVjdCA6IHdpbmRvdy5zaG91bGQuYmUuYW4uT2JqZWN0KTtcbiAgICAgICAgcmV0dXJuIF8uaXNTZXJ2ZXIoKSA/IHRoaXMuX3JlbmRlckluU2VydmVyKHJlcSkgOiB0aGlzLl9yZW5kZXJJbkNsaWVudCh3aW5kb3cpO1xuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAqIDxwPkNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIHNlcnZlci1zaWRlIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50PC9wPlxuICAgICAgKiBAbWV0aG9kIHJlbmRlclRvU3RyaW5nSW5TZXJ2ZXJcbiAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlcSBUaGUgY2xhc3NpY2FsIHJlcXVlc3Qgb2JqZWN0XG4gICAgICAqIEByZXR1cm4ge29iamVjdH0gdGVtcGxhdGUgOiB0aGUgY29tcHV0ZWQgSFRNTCB0ZW1wbGF0ZSB3aXRoIGRhdGEgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudFxuICAgICAgKi9cbiAgICAgIF9yZW5kZXJJblNlcnZlcihyZXEpIHtcbiAgICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICBfLmRldigoKSA9PiBfLmlzU2VydmVyKCkuc2hvdWxkLmJlLm9rICYmXG4gICAgICAgICAgICByZXEuaGVhZGVycy5zaG91bGQuYmUub2tcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgbGV0IGd1aWQgPSBfLmd1aWQoKTtcbiAgICAgICAgICBsZXQgaGVhZGVycyA9IHJlcS5oZWFkZXJzO1xuICAgICAgICAgIGxldCBmbHV4ID0gbmV3IHRoaXMuRmx1eCh7IGd1aWQsIGhlYWRlcnMsIHJlcSB9KTtcbiAgICAgICAgICAvLyBSZWdpc3RlciBzdG9yZSAoUi5TdG9yZSkgOiBVcGxpbmtTZXJ2ZXIgYW5kIE1lbW9yeVxuICAgICAgICAgIC8vIEluaXRpYWxpemVzIGZsdXggYW5kIFVwbGlua1NlcnZlciBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGZldGNoIGRhdGEgZnJvbSB1cGxpbmstc2VydmVyXG4gICAgICAgICAgeWllbGQgZmx1eC5ib290c3RyYXAoKTtcblxuICAgICAgICAgIC8vIEluaXRpYWxpemVzIHBsdWdpbiBhbmQgZmlsbCBhbGwgY29ycmVzcG9uZGluZyBkYXRhIGZvciBzdG9yZSA6IE1lbW9yeVxuICAgICAgICAgIGxldCBwbHVnaW5zID0gdGhpcy5QbHVnaW5zLm1hcCgoUGx1Z2luKSA9PiBuZXcgUGx1Z2luKHsgZmx1eCwgcmVxLCBoZWFkZXJzIH0pKTtcblxuICAgICAgICAgIGxldCByb290UHJvcHMgPSB7IGZsdXgsIHBsdWdpbnMgfTtcbiAgICAgICAgICAvLyBDcmVhdGUgdGhlIFJlYWN0IGluc3RhbmNlIG9mIHJvb3QgY29tcG9uZW50IHdpdGggZmx1eFxuICAgICAgICAgIGxldCBzdXJyb2dhdGVSb290Q29tcG9uZW50ID0gbmV3IHRoaXMuUm9vdC5fX1JlYWN0TmV4dXNTdXJyb2dhdGUoe30sIHJvb3RQcm9wcyk7XG4gICAgICAgICAgaWYoIXN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSB7XG4gICAgICAgICAgICBfLmRldigoKSA9PiBjb25zb2xlLmVycm9yKCdSb290IGNvbXBvbmVudCByZXF1aXJlcyBjb21wb25lbnRXaWxsTW91bnQgaW1wbGVtZW50YXRpb24uIE1heWJlIHlvdSBmb3Jnb3QgdG8gbWl4aW4gUi5Sb290Lk1peGluPycpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gRW11bGF0ZSBSZWFjdCBsaWZlY3ljbGVcbiAgICAgICAgICBzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuICAgICAgICAgIHlpZWxkIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQucHJlZmV0Y2hGbHV4U3RvcmVzKCk7XG4gICAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnRGYWN0b3J5ID0gUmVhY3QuY3JlYXRlRmFjdG9yeSh0aGlzLlJvb3QpO1xuICAgICAgICAgIGxldCByb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudEZhY3Rvcnkocm9vdFByb3BzKTtcbiAgICAgICAgICBsZXQgcm9vdEh0bWw7XG5cbiAgICAgICAgICAvKlxuICAgICAgICAgICogUmVuZGVyIHJvb3QgY29tcG9uZW50IHNlcnZlci1zaWRlLCBmb3IgZWFjaCBjb21wb25lbnRzIDpcbiAgICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIGFuZCBmaWxsIHRoZSBjb21wb25lbnQncyBzdGF0ZVxuICAgICAgICAgICogMi4gY29tcG9uZW50V2lsbE1vdW50IDogc2ltcGxlIGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHRoZSBjb21wb25lbnQncyBzdGF0ZVxuICAgICAgICAgICovXG4gICAgICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IHJvb3RIdG1sID0gUmVhY3QucmVuZGVyVG9TdHJpbmcocm9vdENvbXBvbmVudCkpO1xuICAgICAgICAgIC8vIFNlcmlhbGl6ZXMgZmx1eCBpbiBvcmRlciB0byBwcm92aWRlcyBhbGwgcHJlZmV0Y2hlZCBzdG9yZWQgZGF0YSB0byB0aGUgY2xpZW50XG4gICAgICAgICAgbGV0IHNlcmlhbGl6ZWRGbHV4ID0gZmx1eC5zZXJpYWxpemUoKTtcbiAgICAgICAgICBmbHV4LmRlc3Ryb3koKTtcbiAgICAgICAgICBwbHVnaW5zLmZvckVhY2goKHBsdWdpbikgPT4gcGx1Z2luLmRlc3Ryb3koKSk7XG5cbiAgICAgICAgICBsZXQgdmFycyA9IF8uZXh0ZW5kKHt9LCB5aWVsZCB0aGlzLmdldFRlbXBsYXRlVmFycyh7IHJlcSB9KSwgdGhpcy52YXJzKTtcbiAgICAgICAgICBsZXQgc2VyaWFsaXplZEhlYWRlcnMgPSBfLmJhc2U2NEVuY29kZShKU09OLnN0cmluZ2lmeShoZWFkZXJzKSk7XG4gICAgICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGUoeyB2YXJzLCByb290SHRtbCwgc2VyaWFsaXplZEZsdXgsIHNlcmlhbGl6ZWRIZWFkZXJzLCBndWlkIH0sIHRoaXMudGVtcGxhdGVMaWJzKTtcblxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAqIDxwPlNldHRpbmcgYWxsIHRoZSBkYXRhIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudCBhbmQgUmVuZGVyIGl0IGludG8gdGhlIGNsaWVudC4gPGJyIC8+XG4gICAgICAqIENvbm5lY3RpbmcgdG8gdGhlIHVwbGluay1zZXJ2ZXIgdmlhIGluIG9yZGVyIHRvIGVuYWJsZSB0aGUgZXN0YWJsaXNobWVudCBvZiBzdWJzcmlwdGlvbnMgZm9yIGVhY2ggUmVhY3QgQ29tcG9uZW50PC9wPlxuICAgICAgKiBAbWV0aG9kIHJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50XG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSB3aW5kb3cgVGhlIGNsYXNzaWNhbCB3aW5kb3cgb2JqZWN0XG4gICAgICAqL1xuICAgICAgX3JlbmRlckluQ2xpZW50KHdpbmRvdykge1xuICAgICAgICByZXR1cm4gXy5jb3Byb21pc2UoZnVuY3Rpb24qKCkge1xuICAgICAgICAgIF8uZGV2KCgpID0+IF8uaXNDbGllbnQoKS5zaG91bGQuYmUub2sgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5ndWlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEhlYWRlcnMuc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RFbGVtZW50LnNob3VsZC5iZS5va1xuICAgICAgICAgICk7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5hcHAgPSB0aGlzKTtcbiAgICAgICAgICBsZXQgaGVhZGVycyA9IEpTT04ucGFyc2UoXy5iYXNlNjREZWNvZGUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkSGVhZGVycykpO1xuICAgICAgICAgIGxldCBndWlkID0gd2luZG93Ll9fUmVhY3ROZXh1cy5ndWlkO1xuICAgICAgICAgIGxldCBmbHV4ID0gbmV3IHRoaXMuRmx1eCh7IGhlYWRlcnMsIGd1aWQsIHdpbmRvdyB9KTtcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLmZsdXggPSBmbHV4KTtcblxuICAgICAgICAgIHlpZWxkIGZsdXguYm9vdHN0cmFwKHsgd2luZG93LCBoZWFkZXJzLCBndWlkIH0pO1xuICAgICAgICAgIGZsdXgudW5zZXJpYWxpemUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eCk7XG4gICAgICAgICAgbGV0IHBsdWdpbnMgPSB0aGlzLlBsdWdpbnMuZm9yRWFjaCgoUGx1Z2luKSA9PiBuZXcgUGx1Z2luKHsgZmx1eCwgd2luZG93LCBoZWFkZXJzIH0pKTtcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLnBsdWdpbnMgPSBwbHVnaW5zKTtcblxuICAgICAgICAgIGxldCByb290UHJvcHMgPSB7IGZsdXgsIHBsdWdpbnMgfTtcbiAgICAgICAgICBsZXQgcm9vdENvbXBvbmVudEZhY3RvcnkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHRoaXMuUm9vdCk7XG4gICAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSByb290Q29tcG9uZW50RmFjdG9yeShyb290UHJvcHMpO1xuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQpO1xuICAgICAgICAgIC8qXG4gICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgY2xpZW50LXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHM6XG4gICAgICAgICAgKiAxLiBnZXRJbml0aWFsU3RhdGUgOiByZXR1cm4gc3RvcmUgZGF0YSBjb21wdXRlZCBzZXJ2ZXItc2lkZSB3aXRoIFIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXNcbiAgICAgICAgICAqIDIuIGNvbXBvbmVudFdpbGxNb3VudCA6IGluaXRpYWxpemF0aW9uXG4gICAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHN0b3JlIGRhdGEgY29tcHV0ZWQgc2VydmVyLXNpZGUgd2l0aCBSLkZsdXgucHJlZmV0Y2hGbHV4U3RvcmVzXG4gICAgICAgICAgKiBSb290IENvbXBvbmVudCBhbHJlYWR5IGhhcyB0aGlzIHNlcnZlci1yZW5kZXJlZCBtYXJrdXAsXG4gICAgICAgICAgKiBSZWFjdCB3aWxsIHByZXNlcnZlIGl0IGFuZCBvbmx5IGF0dGFjaCBldmVudCBoYW5kbGVycy5cbiAgICAgICAgICAqIDQuIEZpbmFsbHkgY29tcG9uZW50RGlkTW91bnQgKHN1YnNjcmliZSBhbmQgZmV0Y2hpbmcgZGF0YSkgdGhlbiByZXJlbmRlcmluZyB3aXRoIG5ldyBwb3RlbnRpYWwgY29tcHV0ZWQgZGF0YVxuICAgICAgICAgICovXG4gICAgICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IFJlYWN0LnJlbmRlcihyb290Q29tcG9uZW50LCB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RFbGVtZW50KSk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgXy5leHRlbmQoQXBwLnByb3RvdHlwZSwgLyoqIEBsZW5kcyBBcHAucHJvdG90eXBlICove1xuICAgICAgRmx1eDogbnVsbCxcbiAgICAgIFJvb3Q6IG51bGwsXG4gICAgICB0ZW1wbGF0ZTogbnVsbCxcbiAgICAgIHZhcnM6IG51bGwsXG4gICAgICBQbHVnaW5zOiBudWxsLFxuICAgICAgYm9vdHN0cmFwVGVtcGxhdGVWYXJzSW5TZXJ2ZXI6IG51bGwsXG4gICAgfSk7XG5cbiAgICBfLmV4dGVuZChBcHAsIHsgUGx1Z2luIH0pO1xuICAgIHJldHVybiBBcHA7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9