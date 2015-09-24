export default function entriesToObject(entries) {
  const o = {};
  for(const [k, v] of entries) {
    o[k] = v;
  }
  return o;
}
