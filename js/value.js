export const MIN = 0;
export const MAX = 100;

export function clamp(n, min = MIN, max = MAX) {
  return Math.min(max, Math.max(min, n));
}

export function toValue(input) {
  if (typeof input === 'string') {
    // Number('') === 0, поэтому пустую строку отсекаем явно
    input = input.trim() === '' ? NaN : Number(input.replace(',', '.'));
  }
  if (!Number.isFinite(input)) return null;
  return clamp(input);
}

export function isValidInput(text) {
  if (!/^((0|[1-9]\d*)([.,]\d*)?)?$/.test(text)) return false;
  return !(Number(text.replace(',', '.')) > MAX);
}