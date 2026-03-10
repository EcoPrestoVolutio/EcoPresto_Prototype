import { useMemo } from 'react';
import type { Variant, CalculationResult } from '../types';
import { calculateVariantTau } from '../utils/calculate';

export function useCalculation(variant: Variant | undefined): CalculationResult | null {
  return useMemo(() => {
    if (!variant) return null;
    return calculateVariantTau(variant);
  }, [variant]);
}

export function useAllCalculations(variants: Variant[]): Map<string, CalculationResult> {
  return useMemo(() => {
    const results = new Map<string, CalculationResult>();
    for (const v of variants) {
      results.set(v.id, calculateVariantTau(v));
    }
    return results;
  }, [variants]);
}
