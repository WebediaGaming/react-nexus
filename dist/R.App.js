"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
module.exports = function (R) {
  var co = require("co");
  var React = R.React;
  var _ = require("lodash");
  var assert = require("assert");
  var path = require("path");

  /**
  * <p>Simply create an App class with specifics</p>
  * <p>Provides methods in order to render the specified App server-side and client-side</p>
  * <ul>
  * <li> App.createApp => initializes methods of an application according to the specifications provided </li>
  * <li> App.renderToStringInServer => compute all React Components with data and render the corresponding HTML for the requesting client </li>
  * <li> App.renderIntoDocumentInClient => compute all React Components client-side and establishes a connection via socket in order to make data subscriptions</li>
  * <li> App.createPlugin => initiliaziation method of a plugin for the application </li>
  * </ul>
  * @class R.App
  */
  var App = {
    /**
    * <p> Initializes the application according to the specifications provided </p>
    * @method createApp
    * @param {object} specs All the specifications of the App
    * @return {AppInstance} AppInstance The instance of the created App
    */
    createApp: function createApp(specs) {
      R.Debug.dev(function () {
        assert(_.isPlainObject(specs), "R.App.createApp(...).specs: expecting Object.");
        assert(specs.fluxClass && _.isFunction(specs.fluxClass), "R.App.createApp(...).specs.fluxClass: expecting Function.");
        assert(specs.rootClass && _.isFunction(specs.rootClass), "R.App.createApp(...).specs.rootClass: expecting Function.");
        assert(specs.bootstrapTemplateVarsInServer && _.isFunction(specs.bootstrapTemplateVarsInServer, "R.App.createApp(...).specs.bootstrapTemplateVarsInServer: expecting Function."));
      });

      var AppInstance = function AppInstance() {
        _.extend(this, {
          _fluxClass: specs.fluxClass,
          _rootClass: specs.rootClass,
          _template: specs.template || App.defaultTemplate,
          _bootstrapTemplateVarsInServer: specs.bootstrapTemplateVarsInServer,
          _vars: specs.vars || {},
          _plugins: specs.plugins || {},
          _templateLibs: _.extend(specs.templateLibs || {}, {
            _: _ }) });
        _.extend(this, specs);
        _.each(specs, R.scope(function (val, attr) {
          if (_.isFunction(val)) {
            this[attr] = R.scope(val, this);
          }
        }, this));
      };
      _.extend(AppInstance.prototype, R.App._AppInstancePrototype);
      return AppInstance;
    },
    _AppInstancePrototype: {
      _fluxClass: null,
      _rootClass: null,
      _template: null,
      _bootstrapTemplateVarsInServer: null,
      _vars: null,
      _templateLibs: null,
      _plugins: null,
      /**
      * <p>Compute all React Components with data server-side and render the corresponding HTML for the requesting client</p>
      * @method renderToStringInServer
      * @param {object} req The classical request object
      * @return {object} template : the computed HTML template with data for the requesting client
      */
      renderToStringInServer: regeneratorRuntime.mark(function renderToStringInServer(req) {
        var guid, flux, rootProps, surrogateRootComponent, factoryRootComponent, rootComponent, rootHtml, serializedFlux;
        return regeneratorRuntime.wrap(function renderToStringInServer$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {case 0:

              R.Debug.dev(function () {
                assert(R.isServer(), "R.App.AppInstance.renderAppToStringInServer(...): should be in server.");
              });
              guid = R.guid();
              flux = new this._fluxClass();
              context$2$0.next = 5;
              return flux.bootstrapInServer(req, req.headers, guid);

            case 5:

              //Initializes plugin and fill all corresponding data for store : Memory
              _.each(this._plugins, function (Plugin, name) {
                var plugin = new Plugin();
                R.Debug.dev(function () {
                  assert(plugin.installInServer && _.isFunction(plugin.installInServer), "R.App.renderToStringInServer(...).plugins[...].installInServer: expecting Function. ('" + name + "')");
                });
                plugin.installInServer(flux, req);
              });
              rootProps = { flux: flux };

              R.Debug.dev(R.scope(function () {
                _.extend(rootProps, { __ReactOnRailsApp: this });
              }, this));

              surrogateRootComponent = new this._rootClass.__ReactOnRailsSurrogate({}, rootProps);

              if (!surrogateRootComponent.componentWillMount) {
                R.Debug.dev(function () {
                  console.error("Root component doesn't have componentWillMount. Maybe you forgot R.Root.Mixin? ('" + surrogateRootComponent.displayName + "')");
                });
              }
              surrogateRootComponent.componentWillMount();

              context$2$0.next = 13;
              return surrogateRootComponent.prefetchFluxStores();

            case 13:

              surrogateRootComponent.componentWillUnmount();

              factoryRootComponent = React.createFactory(this._rootClass);
              rootComponent = factoryRootComponent(rootProps);

              flux.startInjectingFromStores();
              rootHtml = React.renderToString(rootComponent);

              flux.stopInjectingFromStores();

              serializedFlux = flux.serialize();

              flux.destroy();
              context$2$0.next = 23;
              return this._bootstrapTemplateVarsInServer(req);

            case 23:
              context$2$0.t0 = context$2$0.sent;
              context$2$0.t1 = {
                rootHtml: rootHtml,
                serializedFlux: serializedFlux,
                serializedHeaders: R.Base64.encode(JSON.stringify(req.headers)),
                guid: guid };
              context$2$0.t2 = _.extend({}, context$2$0.t0, this._vars, context$2$0.t1);
              return context$2$0.abrupt("return", this._template(context$2$0.t2, this._templateLibs));

            case 27:
            case "end": return context$2$0.stop();
          }
        }, renderToStringInServer, this);
      }),
      /**
      * <p>Setting all the data for each React Component and Render it into the client. <br />
      * Connecting to the uplink-server via in order to enable the establishment of subsriptions for each React Component</p>
      * @method renderIntoDocumentInClient
      * @param {object} window The classical window object
      */
      renderIntoDocumentInClient: regeneratorRuntime.mark(function renderIntoDocumentInClient(window) {
        var flux, headers, guid, rootProps, factoryRootComponent, rootComponent;
        return regeneratorRuntime.wrap(function renderIntoDocumentInClient$(context$2$0) {
          while (1) switch (context$2$0.prev = context$2$0.next) {case 0:

              R.Debug.dev(function () {
                assert(R.isClient(), "R.App.AppInstance.renderAppIntoDocumentInClient(...): should be in client.");
                assert(_.has(window, "__ReactOnRails") && _.isPlainObject(window.__ReactOnRails), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails: expecting Object.");
                assert(_.has(window.__ReactOnRails, "guid") && _.isString(window.__ReactOnRails.guid), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails.guid: expecting String.");
                assert(_.has(window.__ReactOnRails, "serializedFlux") && _.isString(window.__ReactOnRails.serializedFlux), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails.serializedFlux: expecting String.");
                assert(_.has(window.__ReactOnRails, "serializedHeaders") && _.isString(window.__ReactOnRails.serializedHeaders), "R.App.AppInstance.renderIntoDocumentInClient(...).__ReactOnRails.headers: expecting String.");
              });
              flux = new this._fluxClass();

              R.Debug.dev(function () {
                window.__ReactOnRails.flux = flux;
              });
              headers = JSON.parse(R.Base64.decode(window.__ReactOnRails.serializedHeaders));
              guid = window.__ReactOnRails.guid;
              context$2$0.next = 7;
              return flux.bootstrapInClient(window, headers, guid);

            case 7:

              //Unserialize flux in order to fill all data in store
              flux.unserialize(window.__ReactOnRails.serializedFlux);
              _.each(this._plugins, function (Plugin, name) {
                var plugin = new Plugin();
                R.Debug.dev(function () {
                  assert(plugin.installInClient && _.isFunction(plugin.installInClient), "R.App.renderToStringInServer(...).plugins[...].installInClient: expecting Function. ('" + name + "')");
                });
                plugin.installInClient(flux, window);
              });
              rootProps = { flux: flux };

              R.Debug.dev(R.scope(function () {
                _.extend(rootProps, { __ReactOnRailsApp: this });
              }, this));
              factoryRootComponent = React.createFactory(this._rootClass);
              rootComponent = factoryRootComponent(rootProps);

              R.Debug.dev(function () {
                window.__ReactOnRails.rootComponent = rootComponent;
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
              React.render(rootComponent, window.document.getElementById("ReactOnRails-App-Root"));
              flux.stopInjectingFromStores();

            case 17:
            case "end": return context$2$0.stop();
          }
        }, renderIntoDocumentInClient, this);
      }) },
    /**
    * <p>Initiliaziation method of a plugin for the application</p>
    * @method createPlugin
    * @param {object} specs The specified specs provided by the plugin
    * @return {object} PluginInstance The instance of the created plugin
    */
    createPlugin: function createPlugin(specs) {
      R.Debug.dev(function () {
        assert(specs && _.isPlainObject(specs), "R.App.createPlugin(...).specs: expecting Object.");
        assert(specs.displayName && _.isString(specs.displayName), "R.App.createPlugin(...).specs.displayName: expecting String.");
        assert(specs.installInServer && _.isFunction(specs.installInServer), "R.App.createPlugin(...).specs.installInServer: expecting Function.");
        assert(specs.installInClient && _.isFunction(specs.installInClient), "R.App.createPlugin(...).specs.installInClient: expecting Function.");
      });

      var PluginInstance = function PluginInstance() {
        this.displayName = specs.displayName;
        _.each(specs, R.scope(function (val, attr) {
          if (_.isFunction(val)) {
            this[attr] = R.scope(val, this);
          }
        }, this));
      };

      _.extend(PluginInstance.prototype, specs, App._PluginInstancePrototype);

      return PluginInstance;
    },
    _PluginInstancePrototype: {
      displayName: null,
      installInClient: null,
      installInServer: null } };

  if (R.isServer()) {
    var fs = require("fs");
    var _defaultTemplate = _.template(fs.readFileSync(path.join(__dirname, "..", "src", "R.App.defaultTemplate.tpl")));
    App.defaultTemplate = function defaultTemplate(vars, libs) {
      return _defaultTemplate({ vars: vars, libs: libs });
    };
  } else {
    App.defaultTemplate = function defaultTemplate(vars, libs) {
      throw new Error("R.App.AppInstance.defaultTemplate(...): should not be called in the client.");
    };
  }

  return App;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImY6L1VzZXJzL0VsaWUvZ2l0L3JlYWN0L3JlYWN0LXJhaWxzL3NyYy9SLkFwcC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUN6QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsTUFBTSxDQUFDLE9BQU8sR0FBRyxVQUFTLENBQUMsRUFBRTtBQUN6QixNQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsTUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztBQUNwQixNQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUIsTUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQy9CLE1BQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7OztBQWEzQixNQUFJLEdBQUcsR0FBRzs7Ozs7OztBQU9OLGFBQVMsRUFBRSxTQUFTLFNBQVMsQ0FBQyxLQUFLLEVBQUU7QUFDakMsT0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNuQixjQUFNLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSwrQ0FBK0MsQ0FBQyxDQUFDO0FBQ2hGLGNBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFLDJEQUEyRCxDQUFDLENBQUM7QUFDdEgsY0FBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsMkRBQTJELENBQUMsQ0FBQztBQUN0SCxjQUFNLENBQUMsS0FBSyxDQUFDLDZCQUE2QixJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLDZCQUE2QixFQUFFLCtFQUErRSxDQUFDLENBQUMsQ0FBQztPQUNyTCxDQUFDLENBQUM7O0FBRUgsVUFBSSxXQUFXLEdBQUcsU0FBUyxXQUFXLEdBQUc7QUFDckMsU0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7QUFDWCxvQkFBVSxFQUFFLEtBQUssQ0FBQyxTQUFTO0FBQzNCLG9CQUFVLEVBQUUsS0FBSyxDQUFDLFNBQVM7QUFDM0IsbUJBQVMsRUFBRSxLQUFLLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQyxlQUFlO0FBQ2hELHdDQUE4QixFQUFFLEtBQUssQ0FBQyw2QkFBNkI7QUFDbkUsZUFBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksRUFBRTtBQUN2QixrQkFBUSxFQUFFLEtBQUssQ0FBQyxPQUFPLElBQUksRUFBRTtBQUM3Qix1QkFBYSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFlBQVksSUFBSSxFQUFFLEVBQUU7QUFDOUMsYUFBQyxFQUFFLENBQUMsRUFDUCxDQUFDLEVBQ0wsQ0FBQyxDQUFDO0FBQ0gsU0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDdEIsU0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDdEMsY0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLGdCQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7V0FDbkM7U0FDSixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDYixDQUFDO0FBQ0YsT0FBQyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztBQUM3RCxhQUFPLFdBQVcsQ0FBQztLQUN0QjtBQUNELHlCQUFxQixFQUFFO0FBQ25CLGdCQUFVLEVBQUUsSUFBSTtBQUNoQixnQkFBVSxFQUFFLElBQUk7QUFDaEIsZUFBUyxFQUFFLElBQUk7QUFDZixvQ0FBOEIsRUFBRSxJQUFJO0FBQ3BDLFdBQUssRUFBRSxJQUFJO0FBQ1gsbUJBQWEsRUFBRSxJQUFJO0FBQ25CLGNBQVEsRUFBRSxJQUFJOzs7Ozs7O0FBT2QsNEJBQXNCLDBCQUFFLFNBQVUsc0JBQXNCLENBQUMsR0FBRztZQUtwRCxJQUFJLEVBRUosSUFBSSxFQVlKLFNBQVMsRUFNVCxzQkFBc0IsRUFjdEIsb0JBQW9CLEVBQ3BCLGFBQWEsRUFRYixRQUFRLEVBSVIsY0FBYzs7OztBQW5EbEIsZUFBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNuQixzQkFBTSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsRUFBRSx3RUFBd0UsQ0FBQyxDQUFDO2VBQ2xHLENBQUMsQ0FBQztBQUVDLGtCQUFJLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRTtBQUVmLGtCQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFOztxQkFHMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQzs7Ozs7QUFFcEQsZUFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUN6QyxvQkFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUMxQixpQkFBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNuQix3QkFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsd0ZBQXdGLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO2lCQUNsTCxDQUFDLENBQUM7QUFDSCxzQkFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7ZUFDckMsQ0FBQyxDQUFDO0FBQ0MsdUJBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7O0FBQzlCLGVBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBVztBQUMzQixpQkFBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2VBQ3BELEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFHTixvQ0FBc0IsR0FBRyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQzs7O0FBRXZGLGtCQUFHLENBQUMsc0JBQXNCLENBQUMsa0JBQWtCLEVBQUU7QUFDM0MsaUJBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVc7QUFDbkIseUJBQU8sQ0FBQyxLQUFLLENBQUMsbUZBQW1GLEdBQUcsc0JBQXNCLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO2lCQUNsSixDQUFDLENBQUM7ZUFDTjtBQUNELG9DQUFzQixDQUFDLGtCQUFrQixFQUFFLENBQUM7OztxQkFJdEMsc0JBQXNCLENBQUMsa0JBQWtCLEVBQUU7Ozs7QUFDakQsb0NBQXNCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7QUFFMUMsa0NBQW9CLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0FBQzNELDJCQUFhLEdBQUcsb0JBQW9CLENBQUMsU0FBUyxDQUFDOztBQUNuRCxrQkFBSSxDQUFDLHdCQUF3QixFQUFFLENBQUM7QUFPNUIsc0JBQVEsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQzs7QUFDbEQsa0JBQUksQ0FBQyx1QkFBdUIsRUFBRSxDQUFDOztBQUczQiw0QkFBYyxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUU7O0FBQ3JDLGtCQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7O3FCQUMwQixJQUFJLENBQUMsOEJBQThCLENBQUMsR0FBRyxDQUFDOzs7OytCQUFjO0FBQzNGLHdCQUFRLEVBQUUsUUFBUTtBQUNsQiw4QkFBYyxFQUFFLGNBQWM7QUFDOUIsaUNBQWlCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0Qsb0JBQUksRUFBRSxJQUFJLEVBQ2I7K0JBTHFCLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBRSxrQkFBa0QsSUFBSSxDQUFDLEtBQUs7a0RBQXRGLElBQUksQ0FBQyxTQUFTLGlCQUtqQixJQUFJLENBQUMsYUFBYTs7Ozs7V0EzRFEsc0JBQXNCO09BNER2RCxDQUFBOzs7Ozs7O0FBT0QsZ0NBQTBCLDBCQUFFLFNBQVUsMEJBQTBCLENBQUMsTUFBTTtZQVEvRCxJQUFJLEVBSUosT0FBTyxFQUNQLElBQUksRUFhSixTQUFTLEVBSVQsb0JBQW9CLEVBQ3BCLGFBQWE7Ozs7QUE5QmpCLGVBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFlBQVc7QUFDbkIsc0JBQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsNEVBQTRFLENBQUMsQ0FBQztBQUNuRyxzQkFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUscUZBQXFGLENBQUMsQ0FBQztBQUN6SyxzQkFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsMEZBQTBGLENBQUMsQ0FBQztBQUNuTCxzQkFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsRUFBRSxvR0FBb0csQ0FBQyxDQUFDO0FBQ2pOLHNCQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsNkZBQTZGLENBQUMsQ0FBQztlQUNuTixDQUFDLENBQUM7QUFDQyxrQkFBSSxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTs7QUFDaEMsZUFBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNuQixzQkFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2VBQ3JDLENBQUMsQ0FBQztBQUNDLHFCQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDOUUsa0JBQUksR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUk7O3FCQUcvQixJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUM7Ozs7O0FBRW5ELGtCQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDdkQsZUFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLFVBQVMsTUFBTSxFQUFFLElBQUksRUFBRTtBQUN6QyxvQkFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUMxQixpQkFBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNuQix3QkFBTSxDQUFDLE1BQU0sQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsd0ZBQXdGLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO2lCQUNsTCxDQUFDLENBQUM7QUFDSCxzQkFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7ZUFDeEMsQ0FBQyxDQUFDO0FBQ0MsdUJBQVMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7O0FBQzlCLGVBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsWUFBVztBQUMzQixpQkFBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO2VBQ3BELEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNOLGtDQUFvQixHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUMzRCwyQkFBYSxHQUFHLG9CQUFvQixDQUFDLFNBQVMsQ0FBQzs7QUFDbkQsZUFBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsWUFBVztBQUNuQixzQkFBTSxDQUFDLGNBQWMsQ0FBQyxhQUFhLEdBQUcsYUFBYSxDQUFDO2VBQ3ZELENBQUMsQ0FBQztBQUNILGtCQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQzs7Ozs7Ozs7OztBQVVoQyxtQkFBSyxDQUFDLE1BQU0sQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO0FBQ3JGLGtCQUFJLENBQUMsdUJBQXVCLEVBQUUsQ0FBQzs7Ozs7V0E5Q0csMEJBQTBCO09BK0MvRCxDQUFBLEVBQ0o7Ozs7Ozs7QUFPRCxnQkFBWSxFQUFFLFNBQVMsWUFBWSxDQUFDLEtBQUssRUFBRTtBQUN2QyxPQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxZQUFXO0FBQ25CLGNBQU0sQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxrREFBa0QsQ0FBQyxDQUFDO0FBQzVGLGNBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxFQUFFLDhEQUE4RCxDQUFDLENBQUM7QUFDM0gsY0FBTSxDQUFDLEtBQUssQ0FBQyxlQUFlLElBQUksQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUUsb0VBQW9FLENBQUMsQ0FBQztBQUMzSSxjQUFNLENBQUMsS0FBSyxDQUFDLGVBQWUsSUFBSSxDQUFDLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsRUFBRSxvRUFBb0UsQ0FBQyxDQUFDO09BQzlJLENBQUMsQ0FBQzs7QUFFSCxVQUFJLGNBQWMsR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMzQyxZQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUM7QUFDckMsU0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDdEMsY0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0FBQ2xCLGdCQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7V0FDbkM7U0FDSixFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDYixDQUFDOztBQUVGLE9BQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0FBRXhFLGFBQU8sY0FBYyxDQUFDO0tBQ3pCO0FBQ0QsNEJBQXdCLEVBQUU7QUFDdEIsaUJBQVcsRUFBRSxJQUFJO0FBQ2pCLHFCQUFlLEVBQUUsSUFBSTtBQUNyQixxQkFBZSxFQUFFLElBQUksRUFDeEIsRUFDSixDQUFDOztBQUVGLE1BQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFFO0FBQ2IsUUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLFFBQUksZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsMkJBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkgsT0FBRyxDQUFDLGVBQWUsR0FBRyxTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3ZELGFBQU8sZ0JBQWdCLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0tBQ3ZELENBQUM7R0FDTCxNQUNJO0FBQ0QsT0FBRyxDQUFDLGVBQWUsR0FBRyxTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQ3ZELFlBQU0sSUFBSSxLQUFLLENBQUMsNkVBQTZFLENBQUMsQ0FBQztLQUNsRyxDQUFDO0dBQ0w7O0FBRUQsU0FBTyxHQUFHLENBQUM7Q0FDZCxDQUFDIiwiZmlsZSI6IlIuQXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsicmVxdWlyZSgnNnRvNS9wb2x5ZmlsbCcpO1xuY29uc3QgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFIpIHtcclxuICAgIHZhciBjbyA9IHJlcXVpcmUoXCJjb1wiKTtcclxuICAgIHZhciBSZWFjdCA9IFIuUmVhY3Q7XHJcbiAgICB2YXIgXyA9IHJlcXVpcmUoXCJsb2Rhc2hcIik7XHJcbiAgICB2YXIgYXNzZXJ0ID0gcmVxdWlyZShcImFzc2VydFwiKTtcclxuICAgIHZhciBwYXRoID0gcmVxdWlyZShcInBhdGhcIik7XHJcblxyXG4gICAgLyoqXHJcbiAgICAqIDxwPlNpbXBseSBjcmVhdGUgYW4gQXBwIGNsYXNzIHdpdGggc3BlY2lmaWNzPC9wPlxyXG4gICAgKiA8cD5Qcm92aWRlcyBtZXRob2RzIGluIG9yZGVyIHRvIHJlbmRlciB0aGUgc3BlY2lmaWVkIEFwcCBzZXJ2ZXItc2lkZSBhbmQgY2xpZW50LXNpZGU8L3A+XHJcbiAgICAqIDx1bD5cclxuICAgICogPGxpPiBBcHAuY3JlYXRlQXBwID0+IGluaXRpYWxpemVzIG1ldGhvZHMgb2YgYW4gYXBwbGljYXRpb24gYWNjb3JkaW5nIHRvIHRoZSBzcGVjaWZpY2F0aW9ucyBwcm92aWRlZCA8L2xpPlxyXG4gICAgKiA8bGk+IEFwcC5yZW5kZXJUb1N0cmluZ0luU2VydmVyID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgd2l0aCBkYXRhIGFuZCByZW5kZXIgdGhlIGNvcnJlc3BvbmRpbmcgSFRNTCBmb3IgdGhlIHJlcXVlc3RpbmcgY2xpZW50IDwvbGk+XHJcbiAgICAqIDxsaT4gQXBwLnJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50ID0+IGNvbXB1dGUgYWxsIFJlYWN0IENvbXBvbmVudHMgY2xpZW50LXNpZGUgYW5kIGVzdGFibGlzaGVzIGEgY29ubmVjdGlvbiB2aWEgc29ja2V0IGluIG9yZGVyIHRvIG1ha2UgZGF0YSBzdWJzY3JpcHRpb25zPC9saT5cclxuICAgICogPGxpPiBBcHAuY3JlYXRlUGx1Z2luID0+IGluaXRpbGlhemlhdGlvbiBtZXRob2Qgb2YgYSBwbHVnaW4gZm9yIHRoZSBhcHBsaWNhdGlvbiA8L2xpPlxyXG4gICAgKiA8L3VsPlxyXG4gICAgKiBAY2xhc3MgUi5BcHBcclxuICAgICovXHJcbiAgICB2YXIgQXBwID0ge1xyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICogPHA+IEluaXRpYWxpemVzIHRoZSBhcHBsaWNhdGlvbiBhY2NvcmRpbmcgdG8gdGhlIHNwZWNpZmljYXRpb25zIHByb3ZpZGVkIDwvcD5cclxuICAgICAgICAqIEBtZXRob2QgY3JlYXRlQXBwXHJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc3BlY3MgQWxsIHRoZSBzcGVjaWZpY2F0aW9ucyBvZiB0aGUgQXBwXHJcbiAgICAgICAgKiBAcmV0dXJuIHtBcHBJbnN0YW5jZX0gQXBwSW5zdGFuY2UgVGhlIGluc3RhbmNlIG9mIHRoZSBjcmVhdGVkIEFwcFxyXG4gICAgICAgICovXHJcbiAgICAgICAgY3JlYXRlQXBwOiBmdW5jdGlvbiBjcmVhdGVBcHAoc3BlY3MpIHtcclxuICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBhc3NlcnQoXy5pc1BsYWluT2JqZWN0KHNwZWNzKSwgXCJSLkFwcC5jcmVhdGVBcHAoLi4uKS5zcGVjczogZXhwZWN0aW5nIE9iamVjdC5cIik7XHJcbiAgICAgICAgICAgICAgICBhc3NlcnQoc3BlY3MuZmx1eENsYXNzICYmIF8uaXNGdW5jdGlvbihzcGVjcy5mbHV4Q2xhc3MpLCBcIlIuQXBwLmNyZWF0ZUFwcCguLi4pLnNwZWNzLmZsdXhDbGFzczogZXhwZWN0aW5nIEZ1bmN0aW9uLlwiKTtcclxuICAgICAgICAgICAgICAgIGFzc2VydChzcGVjcy5yb290Q2xhc3MgJiYgXy5pc0Z1bmN0aW9uKHNwZWNzLnJvb3RDbGFzcyksIFwiUi5BcHAuY3JlYXRlQXBwKC4uLikuc3BlY3Mucm9vdENsYXNzOiBleHBlY3RpbmcgRnVuY3Rpb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KHNwZWNzLmJvb3RzdHJhcFRlbXBsYXRlVmFyc0luU2VydmVyICYmIF8uaXNGdW5jdGlvbihzcGVjcy5ib290c3RyYXBUZW1wbGF0ZVZhcnNJblNlcnZlciwgXCJSLkFwcC5jcmVhdGVBcHAoLi4uKS5zcGVjcy5ib290c3RyYXBUZW1wbGF0ZVZhcnNJblNlcnZlcjogZXhwZWN0aW5nIEZ1bmN0aW9uLlwiKSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIEFwcEluc3RhbmNlID0gZnVuY3Rpb24gQXBwSW5zdGFuY2UoKSB7XHJcbiAgICAgICAgICAgICAgICBfLmV4dGVuZCh0aGlzLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgX2ZsdXhDbGFzczogc3BlY3MuZmx1eENsYXNzLFxyXG4gICAgICAgICAgICAgICAgICAgIF9yb290Q2xhc3M6IHNwZWNzLnJvb3RDbGFzcyxcclxuICAgICAgICAgICAgICAgICAgICBfdGVtcGxhdGU6IHNwZWNzLnRlbXBsYXRlIHx8IEFwcC5kZWZhdWx0VGVtcGxhdGUsXHJcbiAgICAgICAgICAgICAgICAgICAgX2Jvb3RzdHJhcFRlbXBsYXRlVmFyc0luU2VydmVyOiBzcGVjcy5ib290c3RyYXBUZW1wbGF0ZVZhcnNJblNlcnZlcixcclxuICAgICAgICAgICAgICAgICAgICBfdmFyczogc3BlY3MudmFycyB8fCB7fSxcclxuICAgICAgICAgICAgICAgICAgICBfcGx1Z2luczogc3BlY3MucGx1Z2lucyB8fCB7fSxcclxuICAgICAgICAgICAgICAgICAgICBfdGVtcGxhdGVMaWJzOiBfLmV4dGVuZChzcGVjcy50ZW1wbGF0ZUxpYnMgfHwge30sIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXzogXyxcclxuICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgXy5leHRlbmQodGhpcywgc3BlY3MpO1xyXG4gICAgICAgICAgICAgICAgXy5lYWNoKHNwZWNzLCBSLnNjb3BlKGZ1bmN0aW9uKHZhbCwgYXR0cikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKF8uaXNGdW5jdGlvbih2YWwpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNbYXR0cl0gPSBSLnNjb3BlKHZhbCwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSwgdGhpcykpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBfLmV4dGVuZChBcHBJbnN0YW5jZS5wcm90b3R5cGUsIFIuQXBwLl9BcHBJbnN0YW5jZVByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBBcHBJbnN0YW5jZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIF9BcHBJbnN0YW5jZVByb3RvdHlwZToge1xyXG4gICAgICAgICAgICBfZmx1eENsYXNzOiBudWxsLFxyXG4gICAgICAgICAgICBfcm9vdENsYXNzOiBudWxsLFxyXG4gICAgICAgICAgICBfdGVtcGxhdGU6IG51bGwsXHJcbiAgICAgICAgICAgIF9ib290c3RyYXBUZW1wbGF0ZVZhcnNJblNlcnZlcjogbnVsbCxcclxuICAgICAgICAgICAgX3ZhcnM6IG51bGwsXHJcbiAgICAgICAgICAgIF90ZW1wbGF0ZUxpYnM6IG51bGwsXHJcbiAgICAgICAgICAgIF9wbHVnaW5zOiBudWxsLFxyXG4gICAgICAgICAgICAvKipcclxuICAgICAgICAgICAgKiA8cD5Db21wdXRlIGFsbCBSZWFjdCBDb21wb25lbnRzIHdpdGggZGF0YSBzZXJ2ZXItc2lkZSBhbmQgcmVuZGVyIHRoZSBjb3JyZXNwb25kaW5nIEhUTUwgZm9yIHRoZSByZXF1ZXN0aW5nIGNsaWVudDwvcD5cclxuICAgICAgICAgICAgKiBAbWV0aG9kIHJlbmRlclRvU3RyaW5nSW5TZXJ2ZXJcclxuICAgICAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gcmVxIFRoZSBjbGFzc2ljYWwgcmVxdWVzdCBvYmplY3RcclxuICAgICAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IHRlbXBsYXRlIDogdGhlIGNvbXB1dGVkIEhUTUwgdGVtcGxhdGUgd2l0aCBkYXRhIGZvciB0aGUgcmVxdWVzdGluZyBjbGllbnRcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgcmVuZGVyVG9TdHJpbmdJblNlcnZlcjogZnVuY3Rpb24qIHJlbmRlclRvU3RyaW5nSW5TZXJ2ZXIocmVxKSB7XHJcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoUi5pc1NlcnZlcigpLCBcIlIuQXBwLkFwcEluc3RhbmNlLnJlbmRlckFwcFRvU3RyaW5nSW5TZXJ2ZXIoLi4uKTogc2hvdWxkIGJlIGluIHNlcnZlci5cIik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIC8vR2VuZXJhdGUgYSBndWlkXHJcbiAgICAgICAgICAgICAgICB2YXIgZ3VpZCA9IFIuZ3VpZCgpO1xyXG4gICAgICAgICAgICAgICAgLy9GbHV4IGlzIHRoZSBjbGFzcyB0aGF0IHdpbGwgYWxsb3cgZWFjaCBjb21wb25lbnQgdG8gcmV0cmlldmUgZGF0YVxyXG4gICAgICAgICAgICAgICAgdmFyIGZsdXggPSBuZXcgdGhpcy5fZmx1eENsYXNzKCk7XHJcbiAgICAgICAgICAgICAgICAvL1JlZ2lzdGVyIHN0b3JlIChSLlN0b3JlKSA6IFVwbGlua1NlcnZlciBhbmQgTWVtb3J5XHJcbiAgICAgICAgICAgICAgICAvL0luaXRpYWxpemVzIGZsdXggYW5kIFVwbGlua1NlcnZlciBpbiBvcmRlciB0byBiZSBhYmxlIHRvIGZldGNoIGRhdGEgZnJvbSB1cGxpbmstc2VydmVyXHJcbiAgICAgICAgICAgICAgICB5aWVsZCBmbHV4LmJvb3RzdHJhcEluU2VydmVyKHJlcSwgcmVxLmhlYWRlcnMsIGd1aWQpO1xyXG4gICAgICAgICAgICAgICAgLy9Jbml0aWFsaXplcyBwbHVnaW4gYW5kIGZpbGwgYWxsIGNvcnJlc3BvbmRpbmcgZGF0YSBmb3Igc3RvcmUgOiBNZW1vcnlcclxuICAgICAgICAgICAgICAgIF8uZWFjaCh0aGlzLl9wbHVnaW5zLCBmdW5jdGlvbihQbHVnaW4sIG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGx1Z2luID0gbmV3IFBsdWdpbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NlcnQocGx1Z2luLmluc3RhbGxJblNlcnZlciAmJiBfLmlzRnVuY3Rpb24ocGx1Z2luLmluc3RhbGxJblNlcnZlciksIFwiUi5BcHAucmVuZGVyVG9TdHJpbmdJblNlcnZlciguLi4pLnBsdWdpbnNbLi4uXS5pbnN0YWxsSW5TZXJ2ZXI6IGV4cGVjdGluZyBGdW5jdGlvbi4gKCdcIiArIG5hbWUgKyBcIicpXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbi5pbnN0YWxsSW5TZXJ2ZXIoZmx1eCwgcmVxKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvb3RQcm9wcyA9IHsgZmx1eDogZmx1eCB9O1xyXG4gICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZChyb290UHJvcHMsIHsgX19SZWFjdE9uUmFpbHNBcHA6IHRoaXMgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9DcmVhdGUgdGhlIFJlYWN0IGluc3RhbmNlIG9mIHJvb3QgY29tcG9uZW50IHdpdGggZmx1eFxyXG4gICAgICAgICAgICAgICAgdmFyIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQgPSBuZXcgdGhpcy5fcm9vdENsYXNzLl9fUmVhY3RPblJhaWxzU3Vycm9nYXRlKHt9LCByb290UHJvcHMpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCFzdXJyb2dhdGVSb290Q29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkge1xyXG4gICAgICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiUm9vdCBjb21wb25lbnQgZG9lc24ndCBoYXZlIGNvbXBvbmVudFdpbGxNb3VudC4gTWF5YmUgeW91IGZvcmdvdCBSLlJvb3QuTWl4aW4/ICgnXCIgKyBzdXJyb2dhdGVSb290Q29tcG9uZW50LmRpc3BsYXlOYW1lICsgXCInKVwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN1cnJvZ2F0ZVJvb3RDb21wb25lbnQuY29tcG9uZW50V2lsbE1vdW50KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9GZXRjaGluZyByb290IGNvbXBvbmVudCBhbmQgY2hpbGRzIGluIG9yZGVyIHRvIHJldHJpZXZlIGFsbCBkYXRhXHJcbiAgICAgICAgICAgICAgICAvL0ZpbGwgYWxsIGRhdGEgZm9yIHN0b3JlIDogVXBsaW5rXHJcbiAgICAgICAgICAgICAgICB5aWVsZCBzdXJyb2dhdGVSb290Q29tcG9uZW50LnByZWZldGNoRmx1eFN0b3JlcygpO1xyXG4gICAgICAgICAgICAgICAgc3Vycm9nYXRlUm9vdENvbXBvbmVudC5jb21wb25lbnRXaWxsVW5tb3VudCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBmYWN0b3J5Um9vdENvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUZhY3RvcnkodGhpcy5fcm9vdENsYXNzKTtcclxuICAgICAgICAgICAgICAgIHZhciByb290Q29tcG9uZW50ID0gZmFjdG9yeVJvb3RDb21wb25lbnQocm9vdFByb3BzKTtcclxuICAgICAgICAgICAgICAgIGZsdXguc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgc2VydmVyLXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHMgOlxyXG4gICAgICAgICAgICAgICAgKiAxLiBnZXRJbml0aWFsU3RhdGUgOiByZXR1cm4gcHJlZmV0Y2hlZCBzdG9yZWQgZGF0YSBhbmQgZmlsbCB0aGUgY29tcG9uZW50J3Mgc3RhdGVcclxuICAgICAgICAgICAgICAgICogMi4gY29tcG9uZW50V2lsbE1vdW50IDogc2ltcGxlIGluaXRpYWxpemF0aW9uIFxyXG4gICAgICAgICAgICAgICAgKiAzLiBSZW5kZXIgOiBjb21wdXRlIERPTSB3aXRoIHRoZSBjb21wb25lbnQncyBzdGF0ZVxyXG4gICAgICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgICAgIHZhciByb290SHRtbCA9IFJlYWN0LnJlbmRlclRvU3RyaW5nKHJvb3RDb21wb25lbnQpO1xyXG4gICAgICAgICAgICAgICAgZmx1eC5zdG9wSW5qZWN0aW5nRnJvbVN0b3JlcygpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vU2VyaWFsaXplcyBmbHV4IGluIG9yZGVyIHRvIHByb3ZpZGVzIGFsbCBwcmVmZXRjaGVkIHN0b3JlZCBkYXRhIHRvIHRoZSBjbGllbnRcclxuICAgICAgICAgICAgICAgIHZhciBzZXJpYWxpemVkRmx1eCA9IGZsdXguc2VyaWFsaXplKCk7XHJcbiAgICAgICAgICAgICAgICBmbHV4LmRlc3Ryb3koKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl90ZW1wbGF0ZShfLmV4dGVuZCh7fSwgeWllbGQgdGhpcy5fYm9vdHN0cmFwVGVtcGxhdGVWYXJzSW5TZXJ2ZXIocmVxKSwgdGhpcy5fdmFycywge1xyXG4gICAgICAgICAgICAgICAgICAgIHJvb3RIdG1sOiByb290SHRtbCxcclxuICAgICAgICAgICAgICAgICAgICBzZXJpYWxpemVkRmx1eDogc2VyaWFsaXplZEZsdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VyaWFsaXplZEhlYWRlcnM6IFIuQmFzZTY0LmVuY29kZShKU09OLnN0cmluZ2lmeShyZXEuaGVhZGVycykpLFxyXG4gICAgICAgICAgICAgICAgICAgIGd1aWQ6IGd1aWQsXHJcbiAgICAgICAgICAgICAgICB9KSwgdGhpcy5fdGVtcGxhdGVMaWJzKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICogPHA+U2V0dGluZyBhbGwgdGhlIGRhdGEgZm9yIGVhY2ggUmVhY3QgQ29tcG9uZW50IGFuZCBSZW5kZXIgaXQgaW50byB0aGUgY2xpZW50LiA8YnIgLz5cclxuICAgICAgICAgICAgKiBDb25uZWN0aW5nIHRvIHRoZSB1cGxpbmstc2VydmVyIHZpYSBpbiBvcmRlciB0byBlbmFibGUgdGhlIGVzdGFibGlzaG1lbnQgb2Ygc3Vic3JpcHRpb25zIGZvciBlYWNoIFJlYWN0IENvbXBvbmVudDwvcD5cclxuICAgICAgICAgICAgKiBAbWV0aG9kIHJlbmRlckludG9Eb2N1bWVudEluQ2xpZW50XHJcbiAgICAgICAgICAgICogQHBhcmFtIHtvYmplY3R9IHdpbmRvdyBUaGUgY2xhc3NpY2FsIHdpbmRvdyBvYmplY3RcclxuICAgICAgICAgICAgKi9cclxuICAgICAgICAgICAgcmVuZGVySW50b0RvY3VtZW50SW5DbGllbnQ6IGZ1bmN0aW9uKiByZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCh3aW5kb3cpIHtcclxuICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFzc2VydChSLmlzQ2xpZW50KCksIFwiUi5BcHAuQXBwSW5zdGFuY2UucmVuZGVyQXBwSW50b0RvY3VtZW50SW5DbGllbnQoLi4uKTogc2hvdWxkIGJlIGluIGNsaWVudC5cIik7XHJcbiAgICAgICAgICAgICAgICAgICAgYXNzZXJ0KF8uaGFzKHdpbmRvdywgXCJfX1JlYWN0T25SYWlsc1wiKSAmJiBfLmlzUGxhaW5PYmplY3Qod2luZG93Ll9fUmVhY3RPblJhaWxzKSwgXCJSLkFwcC5BcHBJbnN0YW5jZS5yZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCguLi4pLl9fUmVhY3RPblJhaWxzOiBleHBlY3RpbmcgT2JqZWN0LlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMod2luZG93Ll9fUmVhY3RPblJhaWxzLCBcImd1aWRcIikgJiYgXy5pc1N0cmluZyh3aW5kb3cuX19SZWFjdE9uUmFpbHMuZ3VpZCksIFwiUi5BcHAuQXBwSW5zdGFuY2UucmVuZGVySW50b0RvY3VtZW50SW5DbGllbnQoLi4uKS5fX1JlYWN0T25SYWlscy5ndWlkOiBleHBlY3RpbmcgU3RyaW5nLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMod2luZG93Ll9fUmVhY3RPblJhaWxzLCBcInNlcmlhbGl6ZWRGbHV4XCIpICYmIF8uaXNTdHJpbmcod2luZG93Ll9fUmVhY3RPblJhaWxzLnNlcmlhbGl6ZWRGbHV4KSwgXCJSLkFwcC5BcHBJbnN0YW5jZS5yZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCguLi4pLl9fUmVhY3RPblJhaWxzLnNlcmlhbGl6ZWRGbHV4OiBleHBlY3RpbmcgU3RyaW5nLlwiKTtcclxuICAgICAgICAgICAgICAgICAgICBhc3NlcnQoXy5oYXMod2luZG93Ll9fUmVhY3RPblJhaWxzLCBcInNlcmlhbGl6ZWRIZWFkZXJzXCIpICYmIF8uaXNTdHJpbmcod2luZG93Ll9fUmVhY3RPblJhaWxzLnNlcmlhbGl6ZWRIZWFkZXJzKSwgXCJSLkFwcC5BcHBJbnN0YW5jZS5yZW5kZXJJbnRvRG9jdW1lbnRJbkNsaWVudCguLi4pLl9fUmVhY3RPblJhaWxzLmhlYWRlcnM6IGV4cGVjdGluZyBTdHJpbmcuXCIpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmx1eCA9IG5ldyB0aGlzLl9mbHV4Q2xhc3MoKTtcclxuICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5fX1JlYWN0T25SYWlscy5mbHV4ID0gZmx1eDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSBKU09OLnBhcnNlKFIuQmFzZTY0LmRlY29kZSh3aW5kb3cuX19SZWFjdE9uUmFpbHMuc2VyaWFsaXplZEhlYWRlcnMpKTtcclxuICAgICAgICAgICAgICAgIHZhciBndWlkID0gd2luZG93Ll9fUmVhY3RPblJhaWxzLmd1aWQ7XHJcbiAgICAgICAgICAgICAgICAvL1JlZ2lzdGVyIHN0b3JlIChSLlN0b3JlKSA6IFVwbGlua1NlcnZlciBhbmQgTWVtb3J5XHJcbiAgICAgICAgICAgICAgICAvL0luaXRpYWxpemUgZmx1eCBhbmQgVXBsaW5rU2VydmVyIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gZmV0Y2ggZGF0YSBmcm9tIHVwbGluay1zZXJ2ZXIgYW5kIGNvbm5lY3QgdG8gaXQgdmlhIHNvY2tldFxyXG4gICAgICAgICAgICAgICAgeWllbGQgZmx1eC5ib290c3RyYXBJbkNsaWVudCh3aW5kb3csIGhlYWRlcnMsIGd1aWQpO1xyXG4gICAgICAgICAgICAgICAgLy9VbnNlcmlhbGl6ZSBmbHV4IGluIG9yZGVyIHRvIGZpbGwgYWxsIGRhdGEgaW4gc3RvcmVcclxuICAgICAgICAgICAgICAgIGZsdXgudW5zZXJpYWxpemUod2luZG93Ll9fUmVhY3RPblJhaWxzLnNlcmlhbGl6ZWRGbHV4KTtcclxuICAgICAgICAgICAgICAgIF8uZWFjaCh0aGlzLl9wbHVnaW5zLCBmdW5jdGlvbihQbHVnaW4sIG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgcGx1Z2luID0gbmV3IFBsdWdpbigpO1xyXG4gICAgICAgICAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhc3NlcnQocGx1Z2luLmluc3RhbGxJbkNsaWVudCAmJiBfLmlzRnVuY3Rpb24ocGx1Z2luLmluc3RhbGxJbkNsaWVudCksIFwiUi5BcHAucmVuZGVyVG9TdHJpbmdJblNlcnZlciguLi4pLnBsdWdpbnNbLi4uXS5pbnN0YWxsSW5DbGllbnQ6IGV4cGVjdGluZyBGdW5jdGlvbi4gKCdcIiArIG5hbWUgKyBcIicpXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHBsdWdpbi5pbnN0YWxsSW5DbGllbnQoZmx1eCwgd2luZG93KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvb3RQcm9wcyA9IHsgZmx1eDogZmx1eCB9O1xyXG4gICAgICAgICAgICAgICAgUi5EZWJ1Zy5kZXYoUi5zY29wZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBfLmV4dGVuZChyb290UHJvcHMsIHsgX19SZWFjdE9uUmFpbHNBcHA6IHRoaXMgfSk7XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgZmFjdG9yeVJvb3RDb21wb25lbnQgPSBSZWFjdC5jcmVhdGVGYWN0b3J5KHRoaXMuX3Jvb3RDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcm9vdENvbXBvbmVudCA9IGZhY3RvcnlSb290Q29tcG9uZW50KHJvb3RQcm9wcyk7XHJcbiAgICAgICAgICAgICAgICBSLkRlYnVnLmRldihmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuX19SZWFjdE9uUmFpbHMucm9vdENvbXBvbmVudCA9IHJvb3RDb21wb25lbnQ7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGZsdXguc3RhcnRJbmplY3RpbmdGcm9tU3RvcmVzKCk7XHJcbiAgICAgICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgICAgKiBSZW5kZXIgcm9vdCBjb21wb25lbnQgY2xpZW50LXNpZGUsIGZvciBlYWNoIGNvbXBvbmVudHM6XHJcbiAgICAgICAgICAgICAgICAqIDEuIGdldEluaXRpYWxTdGF0ZSA6IHJldHVybiBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xyXG4gICAgICAgICAgICAgICAgKiAyLiBjb21wb25lbnRXaWxsTW91bnQgOiBpbml0aWFsaXphdGlvbiBcclxuICAgICAgICAgICAgICAgICogMy4gUmVuZGVyIDogY29tcHV0ZSBET00gd2l0aCBzdG9yZSBkYXRhIGNvbXB1dGVkIHNlcnZlci1zaWRlIHdpdGggUi5GbHV4LnByZWZldGNoRmx1eFN0b3Jlc1xyXG4gICAgICAgICAgICAgICAgKiBSb290IENvbXBvbmVudCBhbHJlYWR5IGhhcyB0aGlzIHNlcnZlci1yZW5kZXJlZCBtYXJrdXAsIFxyXG4gICAgICAgICAgICAgICAgKiBSZWFjdCB3aWxsIHByZXNlcnZlIGl0IGFuZCBvbmx5IGF0dGFjaCBldmVudCBoYW5kbGVycy5cclxuICAgICAgICAgICAgICAgICogNC4gRmluYWxseSBjb21wb25lbnREaWRNb3VudCAoc3Vic2NyaWJlIGFuZCBmZXRjaGluZyBkYXRhKSB0aGVuIHJlcmVuZGVyaW5nIHdpdGggbmV3IHBvdGVudGlhbCBjb21wdXRlZCBkYXRhXHJcbiAgICAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICAgICAgUmVhY3QucmVuZGVyKHJvb3RDb21wb25lbnQsIHdpbmRvdy5kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlJlYWN0T25SYWlscy1BcHAtUm9vdFwiKSk7XHJcbiAgICAgICAgICAgICAgICBmbHV4LnN0b3BJbmplY3RpbmdGcm9tU3RvcmVzKCk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvKipcclxuICAgICAgICAqIDxwPkluaXRpbGlhemlhdGlvbiBtZXRob2Qgb2YgYSBwbHVnaW4gZm9yIHRoZSBhcHBsaWNhdGlvbjwvcD5cclxuICAgICAgICAqIEBtZXRob2QgY3JlYXRlUGx1Z2luXHJcbiAgICAgICAgKiBAcGFyYW0ge29iamVjdH0gc3BlY3MgVGhlIHNwZWNpZmllZCBzcGVjcyBwcm92aWRlZCBieSB0aGUgcGx1Z2luXHJcbiAgICAgICAgKiBAcmV0dXJuIHtvYmplY3R9IFBsdWdpbkluc3RhbmNlIFRoZSBpbnN0YW5jZSBvZiB0aGUgY3JlYXRlZCBwbHVnaW5cclxuICAgICAgICAqL1xyXG4gICAgICAgIGNyZWF0ZVBsdWdpbjogZnVuY3Rpb24gY3JlYXRlUGx1Z2luKHNwZWNzKSB7XHJcbiAgICAgICAgICAgIFIuRGVidWcuZGV2KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KHNwZWNzICYmIF8uaXNQbGFpbk9iamVjdChzcGVjcyksIFwiUi5BcHAuY3JlYXRlUGx1Z2luKC4uLikuc3BlY3M6IGV4cGVjdGluZyBPYmplY3QuXCIpO1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KHNwZWNzLmRpc3BsYXlOYW1lICYmIF8uaXNTdHJpbmcoc3BlY3MuZGlzcGxheU5hbWUpLCBcIlIuQXBwLmNyZWF0ZVBsdWdpbiguLi4pLnNwZWNzLmRpc3BsYXlOYW1lOiBleHBlY3RpbmcgU3RyaW5nLlwiKTtcclxuICAgICAgICAgICAgICAgIGFzc2VydChzcGVjcy5pbnN0YWxsSW5TZXJ2ZXIgJiYgXy5pc0Z1bmN0aW9uKHNwZWNzLmluc3RhbGxJblNlcnZlciksIFwiUi5BcHAuY3JlYXRlUGx1Z2luKC4uLikuc3BlY3MuaW5zdGFsbEluU2VydmVyOiBleHBlY3RpbmcgRnVuY3Rpb24uXCIpO1xyXG4gICAgICAgICAgICAgICAgYXNzZXJ0KHNwZWNzLmluc3RhbGxJbkNsaWVudCAmJiBfLmlzRnVuY3Rpb24oc3BlY3MuaW5zdGFsbEluQ2xpZW50KSwgXCJSLkFwcC5jcmVhdGVQbHVnaW4oLi4uKS5zcGVjcy5pbnN0YWxsSW5DbGllbnQ6IGV4cGVjdGluZyBGdW5jdGlvbi5cIik7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdmFyIFBsdWdpbkluc3RhbmNlID0gZnVuY3Rpb24gUGx1Z2luSW5zdGFuY2UoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BsYXlOYW1lID0gc3BlY3MuZGlzcGxheU5hbWU7XHJcbiAgICAgICAgICAgICAgICBfLmVhY2goc3BlY3MsIFIuc2NvcGUoZnVuY3Rpb24odmFsLCBhdHRyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoXy5pc0Z1bmN0aW9uKHZhbCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc1thdHRyXSA9IFIuc2NvcGUodmFsLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCB0aGlzKSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBfLmV4dGVuZChQbHVnaW5JbnN0YW5jZS5wcm90b3R5cGUsIHNwZWNzLCBBcHAuX1BsdWdpbkluc3RhbmNlUHJvdG90eXBlKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBQbHVnaW5JbnN0YW5jZTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIF9QbHVnaW5JbnN0YW5jZVByb3RvdHlwZToge1xyXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogbnVsbCxcclxuICAgICAgICAgICAgaW5zdGFsbEluQ2xpZW50OiBudWxsLFxyXG4gICAgICAgICAgICBpbnN0YWxsSW5TZXJ2ZXI6IG51bGwsXHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgaWYoUi5pc1NlcnZlcigpKSB7XHJcbiAgICAgICAgdmFyIGZzID0gcmVxdWlyZShcImZzXCIpO1xyXG4gICAgICAgIHZhciBfZGVmYXVsdFRlbXBsYXRlID0gXy50ZW1wbGF0ZShmcy5yZWFkRmlsZVN5bmMocGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLlwiLCBcInNyY1wiLCBcIlIuQXBwLmRlZmF1bHRUZW1wbGF0ZS50cGxcIikpKTtcclxuICAgICAgICBBcHAuZGVmYXVsdFRlbXBsYXRlID0gZnVuY3Rpb24gZGVmYXVsdFRlbXBsYXRlKHZhcnMsIGxpYnMpIHtcclxuICAgICAgICAgICAgcmV0dXJuIF9kZWZhdWx0VGVtcGxhdGUoeyB2YXJzOiB2YXJzLCBsaWJzOiBsaWJzIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbiAgICBlbHNlIHtcclxuICAgICAgICBBcHAuZGVmYXVsdFRlbXBsYXRlID0gZnVuY3Rpb24gZGVmYXVsdFRlbXBsYXRlKHZhcnMsIGxpYnMpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUi5BcHAuQXBwSW5zdGFuY2UuZGVmYXVsdFRlbXBsYXRlKC4uLik6IHNob3VsZCBub3QgYmUgY2FsbGVkIGluIHRoZSBjbGllbnQuXCIpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIEFwcDtcclxufTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9