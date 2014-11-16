module.exports = function(R) {
  const _ = R._;

  const defaultParams = {
      width: 1280,
      height: 720,
      scrollTop: 0,
      scrollLeft: 0,
  };

  return ({ storeName, dispatcherName, params }) => {
    params = params || {};
    _.dev(() => storeName.should.be.a.String &&
      dispatcherName.should.be.a.String &&
      params.should.be.an.Object
    );
    _.defaults(params, defaultParams);

    class Window extends R.App.Plugin {
      constructor({ flux, window, req, headers }) {
        super({ flux, window, req, headers });
        this.store = flux.getStore(storeName);

        if(window) {
          let dispatcher = flux.getDispatcher(dispatcherName);
          dispatcher.addActionHandler('/Window/scrollTo', ({ top, left }) => Promise.try(() => {
            _.dev(() => top.should.be.a.Number && left.should.be.a.Number);
            window.scrollTo(top, left);
          }));

          window.addEventListener('scroll', () => this.updateScroll({ window }));
          window.addEventListener('resize', () => this.updateSize({ window }));
        }

        this.updateScroll({ window });
        this.updateSize({ window });
      }

      getDisplayName() {
          return 'Window';
      }

      updateScroll({ window }) {
        let { scrollTop, scrollLeft } = window || params;
        this.store.set('/Window/scroll', { scrollTop, scrollLeft });
      }

      updateSize({ window }) {
        let { height, width } = params;
        if(window) {
          let { innerHeight, innerWidth } = window;
          [height, width] = [innerHeight, innerWidth];
        }
        this.store.set('/Window/size', { height, width });
      }
    }

    _.extend(Window.prototype, {
      store: null,
    });

    return Window;
  };
};
