module.exports = function(R) {
  return () => {
    class Cordova extends R.App.Plugin {
      constructor({ flux, window, req, headers }) { // jshint ignore:line
        super(...arguments);
        if(window) {
          void 0;
          // Client-only init
        }
        else {
          void 0;
          // Server-only init
        }
      }

      getDisplayName() {
        return 'Cordova';
      }
    }

    return Cordova;
  };
};
