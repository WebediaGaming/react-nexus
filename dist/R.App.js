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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImQ6L3dvcmtzcGFjZV9wci9yZWFjdC1yYWlscy9zcmMvUi5BcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDZCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO0FBQ3hCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFhdEMsR0FBRztRQUFILEdBQUcsR0FDSSxTQURQLEdBQUcsR0FDTzs7QUFDWixVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNoQyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNoQyxVQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUNsQyxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUNuQyxVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztBQUMzQyxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDOztBQUV4QyxPQUFDLENBQUMsR0FBRyxDQUFDO2VBQU0sTUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUN4QyxNQUFLLElBQUksQ0FBQyxN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QUVILEdBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFOLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDMUIsU0FBTyxHQUFHLENBQUM7Q0FDZCxDQUFDIiwiZmlsZSI6IlIuQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICAgIGNvbnN0IFJlYWN0ID0gUi5SZWFjdDtcclxuICAgIGNvbnN0IF8gPSBSLl87XHJcbiAgICBjb25zdCBzaG91bGQgPSBSLnNob3VsZDtcclxuICAgIGNvbnN0IHBhdGggPSByZXF1aXJlKCdwYXRoJyk7XHJcbiAgICBjb25zdCBQbHVnaW4gPSByZXF1aXJlKCcuL1IuQXBwLlBsdWdpbicpKFIpO1xyXG5cclxuICAgIC8qKlxyXG4gICAgKiA8cD5TaW1wbHkgY3JlYXRlIGFuIEFwcCBjbGFzcyB3aXRoIHNwZWNpZmljczwvcD5cclxuICAgICogPHA+UHJvdmlkZXMgbWV0aG9kcyBpbiBvcmRlciB0byByZW5kZXIgdGhlIHNwZWNpZmllZCBBcHAgc2VydmVyLXNpZGUgYW5kIGNsaWVudC1zaWRlPC9wPlxyXG4gICAgKiA8dWw+XHJcbiAgICAqIDxsaT4gQXBwLmNyZWF0ZUFwcCA9PiBpbml0aWFsaXplcyBtZXRob2RzIG9mIGFuIGFwcGxpY2F0aW9uIGFjY29yZGluZyB0byB0aGUgc3BlY2lmaWNhdGlvbnMgcHJvdmlkZWQgPC9saT5cclxuICAgICogPGxpPiBBcHAucmVuZGVyVG9TdHJpbmdJblNlcnZlciA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudCA8L2xpPlxyXG4gICAgKiA8bGk+IEFwcC5yZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIGNsaWVudC1zaWRlIGFuZCBlc3RhYmxpc2hlcyBhIGNvbm5lY3Rpb24gdmlhIHNvY2tldCBpbiBvcmRlciB0byBtYWtlIGRhdGEgc3Vic2NyaXB0aW9uczwvbGk+XHJcbiAgICAqIDxsaT4gQXBwLmNyZWF0ZVBsdWdpbiA9PiBpbml0aWxpYXppYXRpb24gbWV0aG9kIG9mIGEgcGx1Z2luIGZvciB0aGUgYXBwbGljYXRpb24gPC9saT5cclxuICAgICogPC91bD5cclxuICAgICogQGNsYXNzIFIuQXBwXHJcbiAgICAqL1xyXG4gICAgY2xhc3MgQXBwIHtcclxuICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5GbHV4ID0gdGhpcy5nZXRGbHV4Q2xhc3MoKTtcclxuICAgICAgICB0aGlzLlJvb3QgPSB0aGlzLmdldFJvb3RDbGFzcygpO1xyXG4gICAgICAgIHRoaXMudmFycyA9IHRoaXMuZ2V0RGVmYXVsdFZhcnMoKTtcclxuICAgICAgICB0aGlzLnRlbXBsYXRlID0gdGhpcy5nZXRUZW1wbGF0ZSgpO1xyXG4gICAgICAgIHRoaXMudGVtcGxhdGVMaWJzID0gdGhpcy5nZXRUZW1wbGF0ZUxpYnMoKTtcclxuICAgICAgICB0aGlzLlBsdWdpbnMgPSB0aGlzLmdldFBsdWdpbnNDbGFzc2VzKCk7XHJcblxyXG4gICAgICAgIF8uZGV2KCgpID0+IHRoaXMuRmx1eC5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxyXG4gICAgICAgICAgdGhpcy5Sb290LnNob3VsZC5iZS5hLkZ1bmN0aW9uICYmXHJcbiAgICAgICAgICB0aGlzLnZhcnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZS5zaG91bGQuYmUuYS5GdW5jdGlvbiAmJlxyXG4gICAgICAgICAgdGhpcy50ZW1wbGF0ZUxpYnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxyXG4gICAgICAgICAgdGhpcy5QbHVnaW5zLnNob3VsZC5iZS5hbi5BcnJheVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGdldEZsdXhDbGFzcygpIHsgXy5hYnN0cmFjdCgpOyB9XHJcblxyXG4gICAgICBnZXRSb290Q2xhc3MoKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgICAgZ2V0RGVmYXVsdFZhcnMoKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgICAgZ2V0VGVtcGxhdGUoKSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgICAgZ2V0VGVtcGxhdGVMaWJzKCkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICAgIGdldFBsdWdpbnNDbGFzc2VzKCkgeyBfLmFic3RyYWN0KCk7IH1cclxuXHJcbiAgICAgIGdldFRlbXBsYXRlVmFycyh7IHJlcSB9KSB7IF8uYWJzdHJhY3QoKTsgfVxyXG5cclxuICAgICAgcHJlcmVuZGVyKHJlcSwgcmVzKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoeyByZXEgfSlcclxuICAgICAgICAudGhlbigoaHRtbCkgPT4gcmVzLnN0YXR1cygyMDApLnNlbmQoaHRtbCkpXHJcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICAgIGxldCBqc29uID0geyBlcnI6IGVyci50b1N0cmluZygpIH07XHJcbiAgICAgICAgICBfLmRldigoKSA9PiBfLmV4dGVuZChqc29uLCB7IHN0YWNrOiBlcnIuc3RhY2sgfSkpO1xyXG4gICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoNTAwKS5qc29uKGpzb24pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZW5kZXIoeyByZXEsIHdpbmRvdyB9KSB7XHJcbiAgICAgICAgXy5kZXYoKCkgPT4gXy5pc1NlcnZlcigpID8gcmVxLnNob3VsZC5iZS5hbi5PYmplY3QgOiB3aW5kb3cuc2hvdWxkLmJlLmFuLk9iamVjdCk7XHJcbiAgICAgICAgcmV0dXJuIF8uaXNTZXJ2ZXIoKSA/IHRoaXMuX3JlbmRlckluU2VydmVyKHJlcSkgOiB0aGlzLl9yZW5kZXJJbkNsaWVudCh3aW5kb3cpO1xyXG4gICAgICB9XHJcbiAgICAgIC8qKlxyXG4gICAgICAqIDxwPkNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIHNlcnZlci1zaWRlIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50PC9wPlxyXG4gICAgICAqIEBtZXRob2QgcmVuZGVyVG9TdHJpbmdJblNlcnZlclxyXG4gICAgICAqIEBwYXJhbSB7b2JqZWN0fSByZXEgVGhlIGNsYXNzaWNhbCByZXF1ZXN0IG9iamVjdFxyXG4gICAgICAqIEByZXR1cm4ge29iamVjdH0gdGVtcGxhdGUgOiB0aGUgY29tcHV0ZWQgSFRNTCB0ZW1wbGF0ZSB3aXRoIGRhdGEgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudFxyXG4gICAgICAqL1xyXG4gICAgICBfcmVuZGVySW5TZXJ2ZXIocmVxKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcclxuICAgICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKS5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICAgICAgcmVxLmhlYWRlcnMuc2hvdWxkLmJlLm9rXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGxldCBndWlkID0gXy5ndWlkKCk7XHJcbiAgICAgICAgICBsZXQgaGVhZGVycyA9IHJlcS5oZWFkZXJzO1xyXG4gICAgICAgICAgbGV0IGZsdXggPSBuZXcgdGhpcy5GbHV4KHsgZ3VpZCwgaGVhZGVycywgcmVxIH0pO1xyXG4gICAgICAgICAgLy8gUmVnaXN0ZXIgc3RvcmUgKFIuU3RvcmUpIDogVXBsaW5rU2VydmVyIGFuZCBNZW1vcnlcclxuICAgICAgICAgIC8vIEluaXRpYWxpemVzIGZsdXggYW5kIFVwbGlua1NlcnZlciBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGZldGNoIGRhdGEgZnJvbSB1cGxpbmstc2VydmVyXHJcbiAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCgpO1xyXG5cclxuICAgICAgICAgIC8vIEluaXRpYWxpemVzIHBsdWdpbiBhbmQgZmlsbCBhbGwgY29ycmVzcG9uZGluZyBkYXRhIGZvciBzdG9yZSA6IE1lbW9yeVxyXG4gICAgICAgICAgbGV0IHBsdWdpbnMgPSB0aGlzLlBsdWdpbnMubWFwKChQbHVnaW4pID0+IG5ldyBQbHVnaW4oeyBmbHV4LCByZXEsIGhlYWRlcnMgfSkpO1xyXG5cclxuICAgICAgICAgIGxldCByb290UHJvcHMgPSB7IGZsdXgsIHBsdWdpbnMgfTtcclxuICAgICAgICAgIC8vIENyZWF0ZSB0aGUgUmVhY3QgaW5zdGFuY2Ugb2Ygcm9vdCBjb21wb25lbnQgd2l0aCBmbHV4XHJcbiAgICAgICAgICBsZXQgc3Vycm9nYXRlUm9vdENvbXBvbmVudCA9IG5ldyB0aGlzLlJvb3QuX19SZWFjdE5leHVzU3Vycm9nYXRlKHt9LCByb290UHJvcHMpO1xyXG4gICAgICAgICAgaWYoIXN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSB7XHJcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IGNvbnNvbGUuZXJyb3IoJ1Jvb3QgY29tcG9uZW50IHJlcXVpcmVzIGNvbXBvbmVudFdpbGxNb3VudCBpbXBsZW1lbnRhdGlvbi4gTWF5YmUgeW91IGZvcmdvdCB0byBtaXhpbiBSLlJvb3QuTWl4aW4/JykpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgLy8gRW11bGF0ZSBSZWFjdCBsaWZlY3ljbGVcclxuICAgICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XHJcbiAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVSb290Q29tcG9uZW50LnByZWZldGNoRmx1eFN0b3JlcygpO1xyXG4gICAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xyXG5cclxuICAgICAgICAgIGxldCByb290Q29tcG9uZW50RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkodGhpcy5Sb290KTtcclxuICAgICAgICAgIGxldCByb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudEZhY3Rvcnkocm9vdFByb3BzKTtcclxuICAgICAgICAgIGxldCByb290SHRtbDtcclxuXHJcbiAgICAgICAgICAvKlxyXG4gICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgc2VydmVyLXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHMgOlxyXG4gICAgICAgICAgKiAxLiBnZXRJbml0aWFsU3RhdGUgOiByZXR1cm4gcHJlZmV0Y2hlZCBzdG9yZWQgZGF0YSBhbmQgZmlsbCB0aGUgY29tcG9uZW50J3Mgc3RhdGVcclxuICAgICAgICAgICogMi4gY29tcG9uZW50V2lsbE1vdW50IDogc2ltcGxlIGluaXRpYWxpemF0aW9uXHJcbiAgICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggdGhlIGNvbXBvbmVudCdzIHN0YXRlXHJcbiAgICAgICAgICAqL1xyXG4gICAgICAgICAgZmx1eC5pbmplY3RpbmdGcm9tU3RvcmVzKCgpID0+IHJvb3RIdG1sID0gUmVhY3QucmVuZGVyVG9TdHJpbmcocm9vdENvbXBvbmVudCkpO1xyXG4gICAgICAgICAgLy8gU2VyaWFsaXplcyBmbHV4IGluIG9yZGVyIHRvIHByb3ZpZGVzIGFsbCBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIHRvIHRoZSBjbGllbnRcclxuICAgICAgICAgIGxldCBzZXJpYWxpemVkRmx1eCA9IGZsdXguc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICBmbHV4LmRlc3Ryb3koKTtcclxuICAgICAgICAgIHBsdWdpbnMuZm9yRWFjaCgocGx1Z2luKSA9PiBwbHVnaW4uZGVzdHJveSgpKTtcclxuXHJcbiAgICAgICAgICBsZXQgdmFycyA9IF8uZXh0ZW5kKHt9LCB5aWVsZCB0aGlzLmdldFRlbXBsYXRlVmFycyh7IHJlcSB9KSwgdGhpcy52YXJzKTtcclxuICAgICAgICAgIGxldCBzZXJpYWxpemVkSGVhZGVycyA9IF8uYmFzZTY0RW5jb2RlKEpTT04uc3RyaW5naWZ5KGhlYWRlcnMpKTtcclxuICAgICAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlKHsgdmFycywgcm9vdEh0bWwsIHNlcmlhbGl6ZWRGbHV4LCBzZXJpYWxpemVkSGVhZGVycywgZ3VpZCB9LCB0aGlzLnRlbXBsYXRlTGlicyk7XHJcblxyXG4gICAgICAgIH0sIHRoaXMpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvKipcclxuICAgICAgKiA8cD5TZXR0aW5nIGFsbCB0aGUgZGF0YSBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQgYW5kIFJlbmRlciBpdCBpbnRvIHRoZSBjbGllbnQuIDxiciAvPlxyXG4gICAgICAqIENvbm5lY3RpbmcgdG8gdGhlIHVwbGluay1zZXJ2ZXIgdmlhIGluIG9yZGVyIHRvIGVuYWJsZSB0aGUgZXN0YWJsaXNobWVudCBvZiBzdWJzcmlwdGlvbnMgZm9yIGVhY2ggUmVhY3QgQ29tcG9uZW50PC9wPlxyXG4gICAgICAqIEBtZXRob2QgcmVuZGVySW50b0RvY3VtZW50SW5DbGllbnRcclxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gd2luZG93IFRoZSBjbGFzc2ljYWwgd2luZG93IG9iamVjdFxyXG4gICAgICAqL1xyXG4gICAgICBfcmVuZGVySW5DbGllbnQod2luZG93KSB7XHJcbiAgICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcclxuICAgICAgICAgIF8uZGV2KCgpID0+IF8uaXNDbGllbnQoKS5zaG91bGQuYmUub2sgJiZcclxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXHJcbiAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuZ3VpZC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eC5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkSGVhZGVycy5zaG91bGQuYmUuYS5TdHJpbmcgJiZcclxuICAgICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudC5zaG91bGQuYmUub2tcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLmFwcCA9IHRoaXMpO1xyXG4gICAgICAgICAgbGV0IGhlYWRlcnMgPSBKU09OLnBhcnNlKF8uYmFzZTY0RGVjb2RlKHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEhlYWRlcnMpKTtcclxuICAgICAgICAgIGxldCBndWlkID0gd2luZG93Ll9fUmVhY3ROZXh1cy5ndWlkO1xyXG4gICAgICAgICAgbGV0IGZsdXggPSBuZXcgdGhpcy5GbHV4KHsgaGVhZGVycywgZ3VpZCwgd2luZG93IH0pO1xyXG4gICAgICAgICAgXy5kZXYoKCkgPT4gd2luZG93Ll9fUmVhY3ROZXh1cy5mbHV4ID0gZmx1eCk7XHJcblxyXG4gICAgICAgICAgeWllbGQgZmx1eC5ib290c3RyYXAoeyB3aW5kb3csIGhlYWRlcnMsIGd1aWQgfSk7XHJcbiAgICAgICAgICBmbHV4LnVuc2VyaWFsaXplKHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEZsdXgpO1xyXG4gICAgICAgICAgbGV0IHBsdWdpbnMgPSB0aGlzLlBsdWdpbnMuZm9yRWFjaCgoUGx1Z2luKSA9PiBuZXcgUGx1Z2luKHsgZmx1eCwgd2luZG93LCBoZWFkZXJzIH0pKTtcclxuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMucGx1Z2lucyA9IHBsdWdpbnMpO1xyXG5cclxuICAgICAgICAgIGxldCByb290UHJvcHMgPSB7IGZsdXgsIHBsdWdpbnMgfTtcclxuICAgICAgICAgIGxldCByb290Q29tcG9uZW50RmFjdG9yeSA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkodGhpcy5Sb290KTtcclxuICAgICAgICAgIGxldCByb290Q29tcG9uZW50ID0gcm9vdENvbXBvbmVudEZhY3Rvcnkocm9vdFByb3BzKTtcclxuICAgICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQpO1xyXG4gICAgICAgICAgLypcclxuICAgICAgICAgICogUmVuZGVyIHJvb3QgY29tcG9uZW50IGNsaWVudC1zaWRlLCBmb3IgZWFjaCBjb21wb25lbnRzOlxyXG4gICAgICAgICAgKiAxLiBnZXRJbml0aWFsU3RhdGUgOiByZXR1cm4gc3RvcmUgZGF0YSBjb21wdXRlZCBzZXJ2ZXItc2lkZSB3aXRoIFIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXNcclxuICAgICAgICAgICogMi4gY29tcG9uZW50V2lsbE1vdW50IDogaW5pdGlhbGl6YXRpb25cclxuICAgICAgICAgICogMy4gUmVuZGVyIDogY29tcHV0ZSBET00gd2l0aCBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xyXG4gICAgICAgICAgKiBSb290IENvbXBvbmVudCBhbHJlYWR5IGhhcyB0aGlzIHNlcnZlci1yZW5kZXJlZCBtYXJrdXAsXHJcbiAgICAgICAgICAqIFJlYWN0IHdpbGwgcHJlc2VydmUgaXQgYW5kIG9ubHkgYXR0YWNoIGV2ZW50IGhhbmRsZXJzLlxyXG4gICAgICAgICAgKiA0LiBGaW5hbGx5IGNvbXBvbmVudERpZE1vdW50IChzdWJzY3JpYmUgYW5kIGZldGNoaW5nIGRhdGEpIHRoZW4gcmVyZW5kZXJpbmcgd2l0aCBuZXcgcG90ZW50aWFsIGNvbXB1dGVkIGRhdGFcclxuICAgICAgICAgICovXHJcbiAgICAgICAgICBmbHV4LmluamVjdGluZ0Zyb21TdG9yZXMoKCkgPT4gUmVhY3QucmVuZGVyKHJvb3RDb21wb25lbnQsIHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdEVsZW1lbnQpKTtcclxuICAgICAgICB9LCB0aGlzKTtcclxuICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBfLmV4dGVuZChBcHAucHJvdG90eXBlLCAvKiogQGxlbmRzIEFwcC5wcm90b3R5cGUgKi97XHJcbiAgICAgIEZsdXg6IG51bGwsXHJcbiAgICAgIFJvb3Q6IG51bGwsXHJcbiAgICAgIHRlbXBsYXRlOiBudWxsLFxyXG4gICAgICB2YXJzOiBudWxsLFxyXG4gICAgICBQbHVnaW5zOiBudWxsLFxyXG4gICAgICBib290c3RyYXBUZW1wbGF0ZVZhcnNJblNlcnZlcjogbnVsbCxcclxuICAgIH0pO1xyXG5cclxuICAgIF8uZXh0ZW5kKEFwcCwgeyBQbHVnaW4gfSk7XHJcbiAgICByZXR1cm4gQXBwO1xyXG59O1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=