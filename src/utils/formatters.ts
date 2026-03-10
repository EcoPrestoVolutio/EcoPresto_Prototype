export function formatTau(value: number): string {
  if (value === 0) return '0';
  const exponent = Math.floor(Math.log10(Math.abs(value)));
  const mantissa = value / Math.pow(10, exponent);
  const superscriptMap: Record<string, string> = {
    '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3',
    '4': '\u2074', '5': '\u2075', '6': '\u2076', '7': '\u2077',
    '8': '\u2078', '9': '\u2079', '-': '\u207B',
  };
  const expStr = String(exponent).split('').map(c => superscriptMap[c] || c).join('');
  return `${mantissa.toFixed(2)} \u00D7 10${expStr}`;
}

export function formatTauShort(value: number): string {
  if (value === 0) return '0';
  return value.toExponential(2);
}

export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export function formatMass(kg: number): string {
  return `${formatNumber(kg, 1)} kg`;
}
