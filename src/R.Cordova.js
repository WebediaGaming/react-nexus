module.exports = function(R) {
  return (params) => {
    class Cordova extends R.App.Plugin {
      constructor({ flux, window, req }) {
        super();
        if(window) {
          // Client-only init
        }
        else {
          // Server-only init
        }
      }

      getDisplayName() {
        return 'Cordova';
      }
    }

    _.extend(Cordova.prototype, {
      displayName: 'Cordova',
    });

    return Cordova;
  };
};
