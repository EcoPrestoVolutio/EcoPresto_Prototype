export function validateSharesSum(shares: number[], tolerance = 0.01): { valid: boolean; sum: number } {
  const sum = shares.reduce((a, b) => a + b, 0);
  return { valid: Math.abs(sum - 1.0) <= tolerance, sum };
}

export function validateRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export function validatePositive(value: number): boolean {
  return value > 0;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function validateLossTreatment(
  recyclingWithoutLoss: number,
  recyclingWithLoss: number,
): { valid: boolean; disposal: number } {
  const total = recyclingWithoutLoss + recyclingWithLoss;
  return { valid: total <= 1.0, disposal: Math.max(0, 1 - total) };
}
