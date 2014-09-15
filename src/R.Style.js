module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var recase = require("change-case");
    var parse = require("css-parse");

    var Style = {
        slowlyAutoPrefixStyle: function slowlyAutoPrefixStyle(style) {
            var unprefixedCSS = R.Style.fromReactStyleToCSS(style);
            var prefixedCSS = autoprefix.process(unprefixedCSS).css;
            return R.Style.slowlyFromCSSToReactStyle(prefixedCSS);
        },
        fromReactStyleToCSS: function fromReactStyleToCSS(style) {
            R.Debug.dev(function() {
                assert(_.isPlainObject(style), "R.Style.fromReactStyleToCSS(...).style: expecting Object.");
            });
            return _.map(style, function(val, attr) {
                return recase.paramCase(attr) + ": " + val + ";\n";
            }).join("");
        },
        slowlyFromCSSToReactStyle: function slowlyFromCSSToReactStyle(css) {
            css = "* {\n" + css + "}\n";
            var style = {};
            var parsed = parse(css);
            R.Debug.dev(function() {
                assert(_.size(parsed.stylesheet.rules) === 1, "R.Style.slowlyFromCSSToReactStyle(...): expecting only 1 set of rules.");
            });
            _.each(parsed.stylesheet.rules, function(rule) {
                if(rule.type === "rule") {
                    _.each(rule.declarations, function(decl) {
                        if(decl.type === "declaration") {
                            style[recase.camelCase()] = decl.value;
                        }
                    });
                }
            });
            return style;
        },
    };

    R.Style = Style;
    return R;
};
