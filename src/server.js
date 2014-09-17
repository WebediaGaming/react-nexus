var R = require("./R");

["Server", "SimpleUplinkServer"].forEach(function(module) {
    require("./R." +  module)(R);
});

require("./R.Server")(R);
require("./R.SimpleUplinkServer")(R);

module.exports = R;
