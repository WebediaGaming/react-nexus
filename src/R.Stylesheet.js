module.exports = function(R) {
    var _ = require("lodash");
    var assert = require("assert");

    var Stylesheet = function Stylesheet() {
        this._rules = [];
    };

    _.extend(Stylesheet.prototype, /** @lends R.Stylesheet.prototype */ {
        _isStylesheet_: true,
        registerRule: function registerRule(selector, style) {
            R.Debug.dev(function() {
                assert(_.isPlainObject(style), "R.Stylesheet.registerClassName(...).style: expecting Object.");
            });
            this._rules.push({
                selector: selector,
                style: style,
            });
        },
        getProcessedCSS: function getProcessedCSS() {
            return R.Style.applyAllProcessors(_.map(this._rules, function(rule) {
                return rule.selector + " {\n" + R.Style.getCSSFromReactStyle(rule.style, "  ") + "}\n";
            }).join("\n"));
        },
    });

    return Stylesheet;
};
