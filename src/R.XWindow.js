module.exports = function(R) {
  return (params) => {
    class XWindow extends R.App.Plugin {
      constructor({ flux, window, req, headers }) {
        super(...arguments);
        if(window) {
          // Client-only init
        }
        else {
          // Server-only init
        }
      }

      getDisplayName() {
        return 'XWindow';
      }
    }

    return XWindow;
  };
};
