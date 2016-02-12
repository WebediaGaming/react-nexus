import entriesToObject from '../util/entriesToObject';

/**
 * Extracts headers from the given headers according his type into an Object.
 *
 * @param {Object} headers The headers to extract
 * @throws {Error} An error throws if the headers cannot be extracted
 * @return {Object} The extracted headers
 */
function headersToObject(headers) {
  if(typeof headers.entries === 'function') {
    return entriesToObject(headers.entries());
  }
  if(typeof headers.raw === 'function') {
    return headers.raw();
  }
  if(typeof headers.forEach === 'function') {
    const o = {};
    headers.forEach((v, k) => o[k] = v);
    return o;
  }
  throw new Error('Could not find a suitable interface for converting headers to object');
}

export default headersToObject;
