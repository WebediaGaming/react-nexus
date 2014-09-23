React on Rails - The Ultimate React Framework
=============================================

React on Rails is your way into production-ready React apps.
Embracing the core principles of React, React on Rails provides you with all you need
to start making you React-powered, full stack JS WebApp, that actually does actual things
in actualy browsers of actual visitors, served by actual servers crawled by actual spiders.
Not your grandma's WebApp.

Installation & Usage
====================
`npm install react-rails` and start hacking.
Fork `react-rails-starterkit` if you want to start from scratch.

Check out the [Introduction](https://github.com/elierotenberg/react-rails/blob/master/INTRO.md) and the [Full API Docs](https://github.com/elierotenberg/react-rails/blob/master/API.md) for more info.

Core principles
===============
- First-class server-side pre-rendering, even with complex, async data dependencies.
- Fully-integrated flux implementation, including flux over the wire.
- Real-time full-duplex data propagation by default.
- Idiomatic React implementation of all you need for you WebApp: animations, routing,
tree transformation, HTTP backend communication, session management, etc, the React Way.

SHOW ME THE CODE
================

#### Animating

Toggles the rotation of an image upon click a button.

```js
var R = require("react-rails");
var styles = { // Styles are automatically processed (vendor-prefixing, etc)
    "left": new R.Style({ transform: "rotate(0deg)" }),
    "right": new R.Style({ transform: "rotate(180deg)" }),
};

module.exports = React.createClass({
    mixins: [R.Component.Mixin],
    propTypes: {
        src: React.PropTypes.string.isRequired,
    },
    getInitialState: function() { return { orientation: "left" }; },
    rotate: function(from, to) {
        this.animate("rotate", { // starts an animation.
            from: styles[from],  // the component can be safely unmounted
            to: styles[to],      // during the animation,
            duration: 1000,      // R.Animate handles everything properly.
            easing: "cubic-in-out",
        });
        this.setState({ orientation: to });
    },
    handleClick: function() {
        if(this.state.orientation === "left") {
            this.rotate("left", "right");
        }
        else {
            this.rotate("right", "left");
        }
    },
    render: function() {
        var style = this.isAnimating("rotate") ? this.getAnimatedStyle("rotate") : styles[this.state.orientation];
        return (<div>
            <button onClick={this.handleClick}>Click to rotate</button>
            <img src={this.props.src} style={style} />
        </div>);
    },
});
```

#### Basic Flux - Component

Tells a memory dispatcher to roll a dice, and continusouly update state to reflect its status.

```js
var R = require("react-rails");

module.exports = React.createClass({
    mixins: [R.Component.Mixin],
    getFluxStoreSubscriptions: _.constant({ // subscribe to a stored resources and auto-injects
        "memory://diceValue": "diceValue",  // the up-to-date value in state.
    }),
    handleClick: function() {
        this.dispatch("dispatcher://rollTheDice", { from: 0, to: 6 })(this.handleDispatched);
    },
    handleDispatched: R.Async.IfMounted(function(err) { // Will only execute if the component
        R.Debug.dev(function() {                        // is still mounted when invoked
            if(err) { throw err; }
        });
    }),
    render: function() {
        return (<div>
            <span>Current dice value: {this.state.diceValue}</span>
            <button onClick={this.handleClick}>Roll the dice</button>
        </div>);
    },
});
```

#### Basic Flux - Backend (with generators)

Dispatches a "/rollTheDice" action.

```js

dispatcher.addListener("/rollTheDice", function*(params) {
    R.Debug.dev(function() { // Ignored in production
        assert(params.from && _.isNumber(params.from));
        assert(params.to && _.isNumber(params.to));
    });
    // asynchronously udpate the memory store
    var diceValue = _.random(params.from, params.to);
    yield this.getFlux().getStore("memory").set("/diceValue", diceValue);
});
```



Roadmap
=======

- Release v0.1.0
    - Stabilize the API
    - Document the API
    - Add more tests

- Release v0.2.0
    - Lightweight builds/move plugins out of core
