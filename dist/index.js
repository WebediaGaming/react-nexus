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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImc6L215LXN0YXJ0ZXJraXQvc3JjL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3pCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNsQyxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsRUFBRSx5QkFBQztNQUNHLE9BQU87OztBQUFQLGVBQU8sR0FBRyxPQUFPOztBQUNyQixlQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQWUsT0FBTztTQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7O2VBQ3hCLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07aUJBQUssT0FBTyxDQUFDLEVBQUUsQ0FBQztTQUFBLENBQUM7Ozs7QUFBaEUsZUFBTyxDQUFDLElBQUk7OzRDQUNMLElBQUk7Ozs7OztDQUNaLEVBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFVBQUMsR0FBRyxFQUFFLEdBQUc7U0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7Q0FBQSxDQUFDLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJyZXF1aXJlKCc2dG81L3BvbHlmaWxsJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG52YXIgY28gPSByZXF1aXJlKCdjbycpO1xuY28oZnVuY3Rpb24qKCkge1xuICBsZXQgbXlXb3JsZCA9ICd3b3JsZCc7XG4gIGNvbnNvbGUud2FybigoKCkgPT4gYEhlbGxvICR7bXlXb3JsZH1gKSgpKTtcbiAgY29uc29sZS53YXJuKHlpZWxkIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHJlc29sdmUoNDIpKSk7XG4gIHJldHVybiAxMzM3O1xufSkuY2FsbChudWxsLCAoZXJyLCByZXMpID0+IGNvbnNvbGUud2FybihlcnIsIHJlcykpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9