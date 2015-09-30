var stripDecorator = require('babel-plugin-strip-decorator'); // eslint-disable-line no-var

module.exports = {
  only: /\.jsx$/,
  plugins: process.env.NODE_ENV === 'development' ? [] : [
    { transformer: stripDecorator('devTakes', 'devReturns'), position: 'before' },
  ],
  optional: [
    'runtime',
    'es7.classProperties',
    'es7.decorators',
    'es7.objectRestSpread',
  ],
  loose: [
    'es6.classes',
    'es6.destructuring',
    'es6.properties.computed',
    'es6.modules',
    'es6.forOf',
    'es6.templateLiterals',
  ],
};
