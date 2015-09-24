import pathToRegexp from 'path-to-regexp';

class Routable {
  constructor(route) {
    this.route = route;
    this.keys = [];
    this.re = pathToRegexp(route, this.keys);
    this.toPath = pathToRegexp.compile(this.route);
  }
}

export default Routable;
