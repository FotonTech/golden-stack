export function isScalar(value: any) {
  const withSymbol = typeof Symbol !== 'undefined';

  const type = typeof value;
  if (type === 'string') {
    return true;
  }
  if (type === 'number') {
    return true;
  }
  if (type === 'boolean') {
    return true;
  }
  if (withSymbol === true && type === 'symbol') {
    return true;
  }

  if (value == null) {
    return true;
  }
  if (withSymbol === true && value instanceof Symbol) {
    return true;
  }
  if (value instanceof String) {
    return true;
  }
  if (value instanceof Number) {
    return true;
  }
  if (value instanceof Boolean) {
    return true;
  }

  return false;
}
