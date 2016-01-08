import _ from 'lodash';

function objectToMap(obj) {
  return new Map(_.pairs(obj));
}

export default objectToMap;
