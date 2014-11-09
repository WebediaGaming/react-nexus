var co = require('co');
co(function*() {
  let myWorld = 'world';
  console.warn((() => `Hello ${myWorld}`)());
  console.warn(yield new Promise((resolve, reject) => resolve(42)));
  return 1337;
}).call(null, (err, res) => console.warn(err, res));
