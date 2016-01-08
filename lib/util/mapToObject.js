function mapToObject(map) {
  const obj = Object.create(null);
  map.forEach((v, k) => obj[k] = v);
  return obj;
}

export default mapToObject;
