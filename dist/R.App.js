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
          return _.copromise(regeneratorRuntime.mark(function callee$3$0() {
            return regeneratorRuntime.wrap(function callee$3$0$(context$4$0) {
              while (1) switch (context$4$0.prev = context$4$0.next) {
                case 0: context$4$0.prev = 0;
                  context$4$0.next = 3;
                  return this.render({ req: req });
                case 3: context$4$0.t0 = context$4$0.sent;
                  return context$4$0.abrupt("return", res.status(200).send(context$4$0.t0));
                case 7: context$4$0.prev = 7;
                  context$4$0.t1 = context$4$0["catch"](0);
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
            while (1) switch (context$3$0.prev = context$3$0.next) {
              case 0: req = _ref2.req;
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
              case 6: context$3$0.t2 = context$3$0.sent;
                context$3$0.next = 12;
                break;
              case 9: context$3$0.next = 11;
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
              case 22: context$3$0.t3 = context$3$0.sent;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L3JlYWN0LW5leHVzL3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQyxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVMsQ0FBQyxFQUFFO0FBQ3pCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUM7QUFDdEIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNkLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOztNQWF0QyxHQUFHO1FBQUgsR0FBRyxHQUNJLFNBRFAsR0FBRyxHQUNPOztBQUNaLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDbkMsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7QUFFeEMsT0FBQyxDQUFDLEdBQUcsQ0FBQztlQUFNLE1BQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFFBQVEsSUFDeEMsTUFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxJQUM5QixNQUFLLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLElBQzdCLE1BQUssUUFBUSxDQUFDLE1BQU0sQ0FB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L0MsaUJBQUMsQ0FBQyxHQUFHLENBQUM7eUJBQU0sTUFBTSxDQUFDLFlBQVksQ0FBQyxhQUFhLEdBQUcsYUFBYTtpQkFBQSxDQUFDLENBQUM7Ozs7Ozs7Ozs7QUFVL0Qsb0JBQUksQ0FBQyxtQkFBbUIsQ0FBQzt5QkFBTSxLQUFLLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQztpQkFBQSxDQUFDLENBQUM7Ozs7O1NBQzlGOzs7O1dBeklHLEdBQUc7OztBQTRJVCxHQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxTQUFTLDZCQUE2QjtBQUNqRCxRQUFJLEVBQUUsSUFBSTtBQUNWLFFBQUksRUFBRSxJQUFJO0FBQ1YsZUFBVyxFQUFFLElBQUk7QUFDakIsWUFBUSxFQUFFLElBQUk7QUFDZCxXQUFPLEVBQUUsSUFBSSxFQUNkLENBQUMsQ0FBQzs7QUFFSCxHQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBTixNQUFNLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLFNBQU8sR0FBRyxDQUFDO0NBQ2QsQ0FBQyIsImZpbGUiOiJSLkFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbmNvbnN0IFByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihSKSB7XG4gICAgY29uc3QgUmVhY3QgPSBSLlJlYWN0O1xuICAgIGNvbnN0IF8gPSBSLl87XG4gICAgY29uc3QgUGx1Z2luID0gcmVxdWlyZSgnLi9SLkFwcC5QbHVnaW4nKShSKTtcblxuICAgIC8qKlxuICAgICogPHA+U2ltcGx5IGNyZWF0ZSBhbiBBcHAgY2xhc3Mgd2l0aCBzcGVjaWZpY3M8L3A+XG4gICAgKiA8cD5Qcm92aWRlcyBtZXRob2RzIGluIG9yZGVyIHRvIHJlbmRlciB0aGUgc3BlY2lmaWVkIEFwcCBzZXJ2ZXItc2lkZSBhbmQgY2xpZW50LXNpZGU8L3A+XG4gICAgKiA8dWw+XG4gICAgKiA8bGk+IEFwcC5jcmVhdGVBcHAgPT4gaW5pdGlhbGl6ZXMgbWV0aG9kcyBvZiBhbiBhcHBsaWNhdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljYXRpb25zIHByb3ZpZGVkIDwvbGk+XG4gICAgKiA8bGk+IEFwcC5yZW5kZXJUb1N0cmluZ0luU2VydmVyID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50IDwvbGk+XG4gICAgKiA8bGk+IEFwcC5yZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCA9PiBjb21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIGNsaWVudC1zaWRlIGFuZCBlc3RhYmxpc2hlcyBhIGNvbm5lY3Rpb24gdmlhIHNvY2tldCBpbiBvcmRlciB0byBtYWtlIGRhdGEgc3Vic2NyaXB0aW9uczwvbGk+XG4gICAgKiA8bGk+IEFwcC5jcmVhdGVQbHVnaW4gPT4gaW5pdGlsaWF6aWF0aW9uIG1ldGhvZCBvZiBhIHBsdWdpbiBmb3IgdGhlIGFwcGxpY2F0aW9uIDwvbGk+XG4gICAgKiA8L3VsPlxuICAgICogQGNsYXNzIFIuQXBwXG4gICAgKi9cbiAgICBjbGFzcyBBcHAge1xuICAgICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuRmx1eCA9IHRoaXMuZ2V0Rmx1eENsYXNzKCk7XG4gICAgICAgIHRoaXMuUm9vdCA9IHRoaXMuZ2V0Um9vdENsYXNzKCk7XG4gICAgICAgIHRoaXMuUm9vdEZhY3RvcnkgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHRoaXMuUm9vdCk7XG4gICAgICAgIHRoaXMudGVtcGxhdGUgPSB0aGlzLmdldFRlbXBsYXRlKCk7XG4gICAgICAgIHRoaXMuUGx1Z2lucyA9IHRoaXMuZ2V0UGx1Z2luc0NsYXNzZXMoKTtcblxuICAgICAgICBfLmRldigoKSA9PiB0aGlzLkZsdXguc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgICB0aGlzLlJvb3Quc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgICB0aGlzLnZhcnMuc2hvdWxkLmJlLmFuLk9iamVjdCAmJlxuICAgICAgICAgIHRoaXMudGVtcGxhdGUuc2hvdWxkLmJlLmEuRnVuY3Rpb24gJiZcbiAgICAgICAgICB0aGlzLlBsdWdpbnMuc2hvdWxkLmJlLmFuLkFycmF5XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5wcmVyZW5kZXIgPSBfLnNjb3BlKHRoaXMucHJlcmVuZGVyLCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgZ2V0Rmx1eENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0Um9vdENsYXNzKCkgeyBfLmFic3RyYWN0KCk7IH1cblxuICAgICAgZ2V0VGVtcGxhdGUoKSB7IF8uYWJzdHJhY3QoKTsgfVxuXG4gICAgICBnZXRQbHVnaW5zQ2xhc3NlcygpIHsgXy5hYnN0cmFjdCgpOyB9XG5cbiAgICAgIC8vIEZ1dHVyZS1wcm9vZjogbWlnaHQgZG8gc29tZXRoaW5nIHdpdGggeyByZXEsIHdpbmRvdyB9IGF0IHNvbWUgcG9pbnRcbiAgICAgIC8vIG9mIHRoZSBmdXR1cmUuXG4gICAgICAqZ2V0VGVtcGxhdGVWYXJzKHsgcmVxIH0pIHsgXy5hYnN0cmFjdCgpOyB9IC8vIGpzaGludCBpZ25vcmU6bGluZVxuXG4gICAgICBwcmVyZW5kZXIocmVxLCByZXMpIHtcbiAgICAgICAgcmV0dXJuIF8uY29wcm9taXNlKGZ1bmN0aW9uKigpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5zdGF0dXMoMjAwKS5zZW5kKHlpZWxkIHRoaXMucmVuZGVyKHsgcmVxIH0pKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2F0Y2goZSkge1xuICAgICAgICAgICAgbGV0IGVyciA9IGUudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIGxldCBzdGFjaztcbiAgICAgICAgICAgIF8uZGV2KCgpID0+IHN0YWNrID0gZS5zdGFjayk7XG4gICAgICAgICAgICBfLnByb2QoKCkgPT4gc3RhY2sgPSBudWxsKTtcbiAgICAgICAgICAgIHJldHVybiByZXMuc3RhdHVzKDUwMCkuanNvbih7IGVyciwgc3RhY2sgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzKTtcbiAgICAgIH1cblxuICAgICAgKnJlbmRlcih7IHJlcSwgd2luZG93IH0pIHsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIF8uZGV2KCgpID0+IF8uaXNTZXJ2ZXIoKSA/IHJlcS5zaG91bGQuYmUuYW4uT2JqZWN0IDogd2luZG93LnNob3VsZC5iZS5hbi5PYmplY3QpO1xuICAgICAgICByZXR1cm4gXy5pc1NlcnZlcigpID8geWllbGQgdGhpcy5fcmVuZGVySW5TZXJ2ZXIocmVxKSA6IHlpZWxkIHRoaXMuX3JlbmRlckluQ2xpZW50KHdpbmRvdyk7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgfVxuICAgICAgLyoqXG4gICAgICAqIDxwPkNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIHNlcnZlci1zaWRlIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50PC9wPlxuICAgICAgKiBAbWV0aG9kIHJlbmRlclRvU3RyaW5nSW5TZXJ2ZXJcbiAgICAgICogQHBhcmFtIHtvYmplY3R9IHJlcSBUaGUgY2xhc3NpY2FsIHJlcXVlc3Qgb2JqZWN0XG4gICAgICAqIEByZXR1cm4ge29iamVjdH0gdGVtcGxhdGUgOiB0aGUgY29tcHV0ZWQgSFRNTCB0ZW1wbGF0ZSB3aXRoIGRhdGEgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudFxuICAgICAgKi9cbiAgICAgICpfcmVuZGVySW5TZXJ2ZXIocmVxKSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICBfLmRldigoKSA9PiBfLmlzU2VydmVyKCkuc2hvdWxkLmJlLm9rICYmXG4gICAgICAgICAgcmVxLmhlYWRlcnMuc2hvdWxkLmJlLm9rXG4gICAgICAgICk7XG5cbiAgICAgICAgbGV0IGd1aWQgPSBfLmd1aWQoKTtcbiAgICAgICAgbGV0IGhlYWRlcnMgPSByZXEuaGVhZGVycztcbiAgICAgICAgbGV0IGZsdXggPSBuZXcgdGhpcy5GbHV4KHsgZ3VpZCwgaGVhZGVycywgcmVxIH0pO1xuICAgICAgICAvLyBSZWdpc3RlciBzdG9yZSAoUi5TdG9yZSkgOiBVcGxpbmtTZXJ2ZXIgYW5kIE1lbW9yeVxuICAgICAgICAvLyBJbml0aWFsaXplcyBmbHV4IGFuZCBVcGxpbmtTZXJ2ZXIgaW4gb3JkZXIgdG8gYmUgYWJsZSB0byBmZXRjaCBkYXRhIGZyb20gdXBsaW5rLXNlcnZlclxuICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCgpOyAvLyBqc2hpbnQgaWdub3JlOmxpbmVcblxuICAgICAgICAvLyBJbml0aWFsaXplcyBwbHVnaW4gYW5kIGZpbGwgYWxsIGNvcnJlc3BvbmRpbmcgZGF0YSBmb3Igc3RvcmUgOiBNZW1vcnlcbiAgICAgICAgbGV0IHBsdWdpbnMgPSB0aGlzLlBsdWdpbnMubWFwKChQbHVnaW4pID0+IG5ldyBQbHVnaW4oeyBmbHV4LCByZXEsIGhlYWRlcnMgfSkpO1xuXG4gICAgICAgIGxldCByb290UHJvcHMgPSB7IGZsdXgsIHBsdWdpbnMgfTtcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBSZWFjdCBpbnN0YW5jZSBvZiByb290IGNvbXBvbmVudCB3aXRoIGZsdXhcbiAgICAgICAgbGV0IHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQgPSBuZXcgdGhpcy5Sb290Ll9fUmVhY3ROZXh1c1N1cnJvZ2F0ZSh7fSwgcm9vdFByb3BzKTtcbiAgICAgICAgaWYoIXN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KSB7XG4gICAgICAgICAgXy5kZXYoKCkgPT4gY29uc29sZS5lcnJvcignUm9vdCBjb21wb25lbnQgcmVxdWlyZXMgY29tcG9uZW50V2lsbE1vdW50IGltcGxlbWVudGF0aW9uLiBNYXliZSB5b3UgZm9yZ290IHRvIG1peGluIFIuUm9vdC5NaXhpbj8nKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gRW11bGF0ZSBSZWFjdCBsaWZlY3ljbGVcbiAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsTW91bnQoKTtcbiAgICAgICAgeWllbGQgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5wcmVmZXRjaEZsdXhTdG9yZXMoKTtcbiAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xuXG4gICAgICAgIC8qXG4gICAgICAgICogUmVuZGVyIHJvb3QgY29tcG9uZW50IHNlcnZlci1zaWRlLCBmb3IgZWFjaCBjb21wb25lbnRzIDpcbiAgICAgICAgKiAxLiBnZXRJbml0aWFsU3RhdGUgOiByZXR1cm4gcHJlZmV0Y2hlZCBzdG9yZWQgZGF0YSBhbmQgZmlsbCB0aGUgY29tcG9uZW50J3Mgc3RhdGVcbiAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBzaW1wbGUgaW5pdGlhbGl6YXRpb25cbiAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHRoZSBjb21wb25lbnQncyBzdGF0ZVxuICAgICAgICAqL1xuICAgICAgICBsZXQgcm9vdENvbXBvbmVudCA9IHRoaXMuUm9vdEZhY3Rvcnkocm9vdFByb3BzKTtcbiAgICAgICAgbGV0IHJvb3RIdG1sO1xuICAgICAgICBmbHV4LmluamVjdGluZ0Zyb21TdG9yZXMoKCkgPT4gcm9vdEh0bWwgPSBSZWFjdC5yZW5kZXJUb1N0cmluZyhyb290Q29tcG9uZW50KSk7XG4gICAgICAgIC8vIFNlcmlhbGl6ZXMgZmx1eCBpbiBvcmRlciB0byBwcm92aWRlcyBhbGwgcHJlZmV0Y2hlZCBzdG9yZWQgZGF0YSB0byB0aGUgY2xpZW50XG4gICAgICAgIGxldCBzZXJpYWxpemVkRmx1eCA9IGZsdXguc2VyaWFsaXplKCk7XG4gICAgICAgIGZsdXguZGVzdHJveSgpO1xuICAgICAgICBwbHVnaW5zLmZvckVhY2goKHBsdWdpbikgPT4gcGx1Z2luLmRlc3Ryb3koKSk7XG5cbiAgICAgICAgbGV0IHNlcmlhbGl6ZWRIZWFkZXJzID0gXy5iYXNlNjRFbmNvZGUoSlNPTi5zdHJpbmdpZnkoaGVhZGVycykpO1xuICAgICAgICByZXR1cm4gdGhpcy50ZW1wbGF0ZShfLmV4dGVuZCh7fSwgeWllbGQgdGhpcy5nZXRUZW1wbGF0ZVZhcnMoeyByZXEgfSksIHsgcm9vdEh0bWwsIHNlcmlhbGl6ZWRGbHV4LCBzZXJpYWxpemVkSGVhZGVycywgZ3VpZCB9KSk7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgKiA8cD5TZXR0aW5nIGFsbCB0aGUgZGF0YSBmb3IgZWFjaCBSZWFjdCBDb21wb25lbnQgYW5kIFJlbmRlciBpdCBpbnRvIHRoZSBjbGllbnQuIDxiciAvPlxuICAgICAgKiBDb25uZWN0aW5nIHRvIHRoZSB1cGxpbmstc2VydmVyIHZpYSBpbiBvcmRlciB0byBlbmFibGUgdGhlIGVzdGFibGlzaG1lbnQgb2Ygc3Vic3JpcHRpb25zIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudDwvcD5cbiAgICAgICogQG1ldGhvZCByZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudFxuICAgICAgKiBAcGFyYW0ge29iamVjdH0gd2luZG93IFRoZSBjbGFzc2ljYWwgd2luZG93IG9iamVjdFxuICAgICAgKi9cbiAgICAgICpfcmVuZGVySW5DbGllbnQod2luZG93KSB7IC8vIGpzaGludCBpZ25vcmU6bGluZVxuICAgICAgICBfLmRldigoKSA9PiBfLmlzQ2xpZW50KCkuc2hvdWxkLmJlLm9rICYmXG4gICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zaG91bGQuYmUuYW4uT2JqZWN0ICYmXG4gICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5ndWlkLnNob3VsZC5iZS5hLlN0cmluZyAmJlxuICAgICAgICAgIHdpbmRvdy5fX1JlYWN0TmV4dXMuc2VyaWFsaXplZEZsdXguc2hvdWxkLmJlLmEuU3RyaW5nICYmXG4gICAgICAgICAgd2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkSGVhZGVycy5zaG91bGQuYmUuYS5TdHJpbmcgJiZcbiAgICAgICAgICB3aW5kb3cuX19SZWFjdE5leHVzLnJvb3RFbGVtZW50LnNob3VsZC5iZS5va1xuICAgICAgICApO1xuICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLmFwcCA9IHRoaXMpO1xuICAgICAgICBsZXQgaGVhZGVycyA9IEpTT04ucGFyc2UoXy5iYXNlNjREZWNvZGUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkSGVhZGVycykpO1xuICAgICAgICBsZXQgZ3VpZCA9IHdpbmRvdy5fX1JlYWN0TmV4dXMuZ3VpZDtcbiAgICAgICAgbGV0IGZsdXggPSBuZXcgdGhpcy5GbHV4KHsgaGVhZGVycywgZ3VpZCwgd2luZG93IH0pO1xuICAgICAgICBfLmRldigoKSA9PiB3aW5kb3cuX19SZWFjdE5leHVzLmZsdXggPSBmbHV4KTtcblxuICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcCh7IHdpbmRvdywgaGVhZGVycywgZ3VpZCB9KTsgLy8ganNoaW50IGlnbm9yZTpsaW5lXG4gICAgICAgIGZsdXgudW5zZXJpYWxpemUod2luZG93Ll9fUmVhY3ROZXh1cy5zZXJpYWxpemVkRmx1eCk7XG4gICAgICAgIGxldCBwbHVnaW5zID0gdGhpcy5QbHVnaW5zLmZvckVhY2goKFBsdWdpbikgPT4gbmV3IFBsdWdpbih7IGZsdXgsIHdpbmRvdywgaGVhZGVycyB9KSk7XG4gICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMucGx1Z2lucyA9IHBsdWdpbnMpO1xuXG4gICAgICAgIGxldCByb290UHJvcHMgPSB7IGZsdXgsIHBsdWdpbnMgfTtcbiAgICAgICAgbGV0IHJvb3RDb21wb25lbnQgPSB0aGlzLlJvb3RGYWN0b3J5KHJvb3RQcm9wcyk7XG4gICAgICAgIF8uZGV2KCgpID0+IHdpbmRvdy5fX1JlYWN0TmV4dXMucm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQpO1xuICAgICAgICAvKlxuICAgICAgICAqIFJlbmRlciByb290IGNvbXBvbmVudCBjbGllbnQtc2lkZSwgZm9yIGVhY2ggY29tcG9uZW50czpcbiAgICAgICAgKiAxLiBnZXRJbml0aWFsU3RhdGUgOiByZXR1cm4gc3RvcmUgZGF0YSBjb21wdXRlZCBzZXJ2ZXItc2lkZSB3aXRoIFIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXNcbiAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBpbml0aWFsaXphdGlvblxuICAgICAgICAqIDMuIFJlbmRlciA6IGNvbXB1dGUgRE9NIHdpdGggc3RvcmUgZGF0YSBjb21wdXRlZCBzZXJ2ZXItc2lkZSB3aXRoIFIuRmx1eC5wcmVmZXRjaEZsdXhTdG9yZXNcbiAgICAgICAgKiBSb290IENvbXBvbmVudCBhbHJlYWR5IGhhcyB0aGlzIHNlcnZlci1yZW5kZXJlZCBtYXJrdXAsXG4gICAgICAgICogUmVhY3Qgd2lsbCBwcmVzZXJ2ZSBpdCBhbmQgb25seSBhdHRhY2ggZXZlbnQgaGFuZGxlcnMuXG4gICAgICAgICogNC4gRmluYWxseSBjb21wb25lbnREaWRNb3VudCAoc3Vic2NyaWJlIGFuZCBmZXRjaGluZyBkYXRhKSB0aGVuIHJlcmVuZGVyaW5nIHdpdGggbmV3IHBvdGVudGlhbCBjb21wdXRlZCBkYXRhXG4gICAgICAgICovXG4gICAgICAgIGZsdXguaW5qZWN0aW5nRnJvbVN0b3JlcygoKSA9PiBSZWFjdC5yZW5kZXIocm9vdENvbXBvbmVudCwgd2luZG93Ll9fUmVhY3ROZXh1cy5yb290RWxlbWVudCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF8uZXh0ZW5kKEFwcC5wcm90b3R5cGUsIC8qKiBAbGVuZHMgQXBwLnByb3RvdHlwZSAqL3tcbiAgICAgIEZsdXg6IG51bGwsXG4gICAgICBSb290OiBudWxsLFxuICAgICAgUm9vdEZhY3Rvcnk6IG51bGwsXG4gICAgICB0ZW1wbGF0ZTogbnVsbCxcbiAgICAgIFBsdWdpbnM6IG51bGwsXG4gICAgfSk7XG5cbiAgICBfLmV4dGVuZChBcHAsIHsgUGx1Z2luIH0pO1xuICAgIHJldHVybiBBcHA7XG59O1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9