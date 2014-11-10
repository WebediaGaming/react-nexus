module.exports = function(R) {
  return (params) => {
    class Cordova extends R.App.Plugin {
      constructor() {
        super();
      }

      getDisplayName() {
        return 'Cordova';
      }

      installInClient(flux, window) {

      }

      installInServer(flux, req) {

      }
    }

    _.extend(Cordova.prototype, {
      displayName: 'Cordova',
    });

    return Cordova;
  };
};
