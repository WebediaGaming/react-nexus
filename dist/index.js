"use strict";

require("6to5/polyfill");var Promise = require("bluebird");var __DEV__ = (process.env.NODE_ENV !== "production");
var co = require("co");
co(regeneratorRuntime.mark(function _callee() {
  var myWorld;
  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (true) switch (_context.prev = _context.next) {
      case 0: myWorld = "world";
        console.warn((function () {
          return "Hello " + myWorld;
        })());
        _context.next = 4;
        return new Promise(function (resolve, reject) {
          return resolve(42) || reject(void 0);
        });
      case 4: _context.t0 = _context.sent;
        console.warn(_context.t0);

        return _context.abrupt("return", 1337);
      case 7:
      case "end": return _context.stop();
    }
  }, _callee, this);
})).call(null, function (err, res) {
  return console.warn(err, res);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLEFBQUMsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLEFBQUMsSUFBTSxPQUFPLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsS0FBSyxZQUFZLENBQUMsQ0FBQztBQUN2SCxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsRUFBRSx5QkFBQztNQUNHLE9BQU87OztjQUFQLE9BQU8sR0FBRyxPQUFPO0FBQ3JCLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFBZSxPQUFPO1NBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7ZUFDeEIsSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtpQkFBSyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQUEsQ0FBQzs7QUFBbEYsZUFBTyxDQUFDLElBQUk7O3lDQUNMLElBQUk7Ozs7O0NBQ1osRUFBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsVUFBQyxHQUFHLEVBQUUsR0FBRztTQUFLLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQztDQUFBLENBQUMsQ0FBQyIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjbyA9IHJlcXVpcmUoJ2NvJyk7XHJcbmNvKGZ1bmN0aW9uKigpIHtcclxuICBsZXQgbXlXb3JsZCA9ICd3b3JsZCc7XHJcbiAgY29uc29sZS53YXJuKCgoKSA9PiBgSGVsbG8gJHtteVdvcmxkfWApKCkpO1xyXG4gIGNvbnNvbGUud2Fybih5aWVsZCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiByZXNvbHZlKDQyKSB8fCByZWplY3Qodm9pZCAwKSkpO1xyXG4gIHJldHVybiAxMzM3O1xyXG59KS5jYWxsKG51bGwsIChlcnIsIHJlcykgPT4gY29uc29sZS53YXJuKGVyciwgcmVzKSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==