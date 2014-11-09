"use strict";

require("6to5/polyfill");
var Promise = require("bluebird");
var co = require("co");
co(regeneratorRuntime.mark(function callee$0$0() {
  var myWorld;
  return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {case 0:
        myWorld = "world";

        console.warn((function () {
          return "Hello " + myWorld;
        })());
        context$1$0.next = 4;
        return new Promise(function (resolve, reject) {
          return resolve(42);
        });

      case 4:
        context$1$0.t0 = context$1$0.sent;
        console.warn(context$1$0.t0);

        return context$1$0.abrupt("return", 1337);

      case 7:
      case "end": return context$1$0.stop();
    }
  }, callee$0$0, this);
})).call(null, function (err, res) {
  return console.warn(err, res);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L21pc2MvbXktc3RhcnRlcmtpdC9zcmMvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDekIsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN2QixFQUFFLHlCQUFDO01BQ0csT0FBTzs7O0FBQVAsZUFBTyxHQUFHLE9BQU87O0FBQ3JCLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFBZSxPQUFPO1NBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7ZUFDeEIsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtpQkFBSyxPQUFPLENBQUMsRUFBRSxDQUFDO1NBQUEsQ0FBQzs7OztBQUFoRSxlQUFPLENBQUMsSUFBSTs7NENBQ0wsSUFBSTs7Ozs7O0NBQ1osRUFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRztTQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztDQUFBLENBQUMsQ0FBQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbInJlcXVpcmUoJzZ0bzUvcG9seWZpbGwnKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbnZhciBjbyA9IHJlcXVpcmUoJ2NvJyk7XG5jbyhmdW5jdGlvbiooKSB7XG4gIGxldCBteVdvcmxkID0gJ3dvcmxkJztcbiAgY29uc29sZS53YXJuKCgoKSA9PiBgSGVsbG8gJHtteVdvcmxkfWApKCkpO1xuICBjb25zb2xlLndhcm4oeWllbGQgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4gcmVzb2x2ZSg0MikpKTtcbiAgcmV0dXJuIDEzMzc7XG59KS5jYWxsKG51bGwsIChlcnIsIHJlcykgPT4gY29uc29sZS53YXJuKGVyciwgcmVzKSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=