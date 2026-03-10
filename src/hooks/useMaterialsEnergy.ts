import { createContext, useContext, useState, useCallback } from 'react';
import type { EnergyMix, TransportMix, ERPEntry, MaterialEnergyRates } from '../types';
import { energyMixes as defaultEnergyMixes } from '../data/energyMixes';
import { defaultTransportMixes } from '../data/transportMixes';
import { erpDatabase as defaultErpDatabase } from '../data/erpDatabase';
import { materialEnergyRates as defaultMaterialRates } from '../data/materialEnergyRates';

export interface MaterialsEnergyContextValue {
  electricityMixes: EnergyMix[];
  heatMixes: EnergyMix[];
  transportMixes: TransportMix[];
  materials: ERPEntry[];
  materialRates: MaterialEnergyRates[];

  updateEnergyMix: (id: string, updates: Partial<EnergyMix>) => void;
  addEnergyMix: (mix: EnergyMix) => void;
  removeEnergyMix: (id: string) => void;

  updateTransportMix: (id: string, updates: Partial<TransportMix>) => void;
  addTransportMix: (mix: TransportMix) => void;
  removeTransportMix: (id: string) => void;

  getMixById: (id: string) => EnergyMix | undefined;
  getTransportMixById: (id: string) => TransportMix | undefined;
  getErpEntry: (id: string) => ERPEntry | undefined;
  getMaterialRate: (materialId: string) => MaterialEnergyRates | undefined;

  getElectricityMixOptions: () => { value: string; label: string }[];
  getHeatMixOptions: () => { value: string; label: string }[];
  getTransportMixOptions: (type: 'land' | 'overseas') => { value: string; label: string }[];
  getMaterialOptions: () => { value: string; label: string }[];
}

export const MaterialsEnergyContext = createContext<MaterialsEnergyContextValue>(
  null as unknown as MaterialsEnergyContextValue,
);

export function useMaterialsEnergy() {
  return useContext(MaterialsEnergyContext);
}

export function useMaterialsEnergyState(): MaterialsEnergyContextValue {
  const [energyMixes, setEnergyMixes] = useState<EnergyMix[]>(defaultEnergyMixes);
  const [transportMixes, setTransportMixes] = useState<TransportMix[]>(defaultTransportMixes);
  const [materials] = useState<ERPEntry[]>(defaultErpDatabase);
  const [materialRates] = useState<MaterialEnergyRates[]>(defaultMaterialRates);

  const electricityMixes = energyMixes.filter(m => m.type === 'electricity');
  const heatMixes = energyMixes.filter(m => m.type === 'heat');

  const updateEnergyMix = useCallback((id: string, updates: Partial<EnergyMix>) => {
    setEnergyMixes(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const addEnergyMix = useCallback((mix: EnergyMix) => {
    setEnergyMixes(prev => [...prev, mix]);
  }, []);

  const removeEnergyMix = useCallback((id: string) => {
    setEnergyMixes(prev => prev.filter(m => m.id !== id));
  }, []);

  const updateTransportMix = useCallback((id: string, updates: Partial<TransportMix>) => {
    setTransportMixes(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const addTransportMix = useCallback((mix: TransportMix) => {
    setTransportMixes(prev => [...prev, mix]);
  }, []);

  const removeTransportMix = useCallback((id: string) => {
    setTransportMixes(prev => prev.filter(m => m.id !== id));
  }, []);

  const getMixById = useCallback((id: string) => {
    return energyMixes.find(m => m.id === id);
  }, [energyMixes]);

  const getTransportMixById = useCallback((id: string) => {
    return transportMixes.find(m => m.id === id);
  }, [transportMixes]);

  const getErpEntry = useCallback((id: string) => {
    return materials.find(e => e.id === id);
  }, [materials]);

  const getMaterialRate = useCallback((materialId: string) => {
    return materialRates.find(r => r.materialId === materialId);
  }, [materialRates]);

  const getElectricityMixOptions = useCallback(() => {
    return electricityMixes.map(m => ({ value: m.id, label: m.name }));
  }, [electricityMixes]);

  const getHeatMixOptions = useCallback(() => {
    return heatMixes.map(m => ({ value: m.id, label: m.name }));
  }, [heatMixes]);

  const getTransportMixOptions = useCallback((type: 'land' | 'overseas') => {
    return transportMixes.filter(m => m.type === type).map(m => ({ value: m.id, label: m.name }));
  }, [transportMixes]);

  const getMaterialOptions = useCallback(() => {
    return materials.filter(e => e.category === 'material').map(e => ({ value: e.id, label: e.name }));
  }, [materials]);

  return {
    electricityMixes, heatMixes, transportMixes, materials, materialRates,
    updateEnergyMix, addEnergyMix, removeEnergyMix,
    updateTransportMix, addTransportMix, removeTransportMix,
    getMixById, getTransportMixById, getErpEntry, getMaterialRate,
    getElectricityMixOptions, getHeatMixOptions, getTransportMixOptions, getMaterialOptions,
  };
}
