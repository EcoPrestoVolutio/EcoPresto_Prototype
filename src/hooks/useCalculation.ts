import { useMemo } from 'react';
import type { Variant, CalculationResult } from '../types';
import { calculateVariantTau } from '../utils/calculate';
import type { MixLookup } from '../utils/calculate';
import { useMaterialsEnergy } from './useMaterialsEnergy';

export function useCalculation(variant: Variant | undefined): CalculationResult | null {
  const { getMixById, getTransportMixById, getErpEntry, getMaterialRate } = useMaterialsEnergy();
  const lookup: MixLookup = useMemo(() => ({
    getMix: getMixById,
    getTransportMix: getTransportMixById,
    getErp: getErpEntry,
    getMaterialRate,
  }), [getMixById, getTransportMixById, getErpEntry, getMaterialRate]);

  return useMemo(() => {
    if (!variant) return null;
    return calculateVariantTau(variant, lookup);
  }, [variant, lookup]);
}

export function useAllCalculations(variants: Variant[]): Map<string, CalculationResult> {
  const { getMixById, getTransportMixById, getErpEntry, getMaterialRate } = useMaterialsEnergy();
  const lookup: MixLookup = useMemo(() => ({
    getMix: getMixById,
    getTransportMix: getTransportMixById,
    getErp: getErpEntry,
    getMaterialRate,
  }), [getMixById, getTransportMixById, getErpEntry, getMaterialRate]);

  return useMemo(() => {
    const results = new Map<string, CalculationResult>();
    for (const v of variants) {
      results.set(v.id, calculateVariantTau(v, lookup));
    }
    return results;
  }, [variants, lookup]);
}
