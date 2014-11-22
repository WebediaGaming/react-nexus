module.exports = function(R) {
  return () => {
    class Fullscreen extends R.App.Plugin {
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

      destroy() {
        // No-op.
      }

      getDisplayName() {
        return 'Fullscreen';
      }
    }

    return Fullscreen;
  };
};
