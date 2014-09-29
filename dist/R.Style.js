module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");
    var recase = require("change-case");
    var parse = require("css-parse");
    var _autoprefixer = require("autoprefixer-core");
    var CleanCSS = require("clean-css");

    var localProcessors = [];

    var Style = function Style(style) {
        return Style.slowlyProcessReactStyle(style);
    };

    _.extend(Style, {
        Processors: {
            autoprefixer: function autoprefixer(css) {
                return autoprefixer.process(css).css;
            },
            min: function min(css) {
                return new CleanCSS().minify(css);
            },
        },
        _processors: [],
        registerCSSProcessor: function registerCSSProcessor(process) {
            R.Style._processors.push(process);
        },
        applyAllProcessors: function applyAllProcessors(css) {
            var rCSS = css;
            _.each(Style.localProcessors, function(process) {
                rCSS = process(rCSS);
            });
            return rCSS;
        },
        slowlyProcessReactStyle: function slowlyAutoPrefixStyle(style) {
            var css = R.Style.applyAllProcessors("* {\n" + R.Style.fromReactStyleToCSS(style) + "}\n");
            return R.Style.slowlyFromCSSToReactStyle(css);
        },
        getCSSFromReactStyle: function getCSSFromReactStyle(style, indent) {
            indent = indent || "";
            R.Debug.dev(function() {
                assert(_.isPlainObject(style), "R.Style.getCSSFromReactStyle(...).style: expecting Object.");
            });
            return _.map(style, function(val, attr) {
                return indent + recase.paramCase(attr) + ": " + val + ";\n";
            }).join("");
        },
        slowlyGetReactStyleFromCSS: function slowlyGetReactStyleFromCSS(css) {
            var style = {};
            var parsed = parse(css);
            R.Debug.dev(function() {
                assert(_.size(parsed.stylesheet.rules) === 1, "R.Style.slowlyGetReactStyleFromCSS(...): expecting only 1 set of rules.");
            });
            _.each(parsed.stylesheet.rules, function(rule) {
                if(rule.type === "rule") {
                    _.each(rule.declarations, function(decl) {
                        if(decl.type === "declaration") {
                            style[recase.camelCase(decl.property)] = decl.value;
                        }
                    });
                }
            });
            return style;
        },
    });

    R.Style = Style;
    return R;
};
