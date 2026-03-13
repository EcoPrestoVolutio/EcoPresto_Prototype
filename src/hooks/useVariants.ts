import { useState, useCallback } from 'react';
import type { Product, Variant, ComponentItem, Manufacturing, UsePhase, EndOfLife, ProductInfo, VariantTransport } from '../types';

let variantCounter = 100;

const DEFAULT_CHAIN = { collectionRate: 1.0, recyclingRate: 0, cascadingRate: 0, lossRate: 1 };

function createEmptyVariant(index: number): Variant {
  const id = `variant-${++variantCounter}`;
  return {
    id,
    name: `Variant ${index}`,
    productInfo: { name: '', category: 'Infrastructure', variantName: `Variant ${index}`, sleeperType: 'concrete', totalMass: 0, componentCount: 1 },
    components: [{
      id: `${id}-comp-1`,
      name: 'Component 1',
      icon: 'cube',
      materialId: 'cement_unspecified',
      mass: 0,
      primaryContent: 1.0,
      manufacturingLossRate: 0,
      manufacturingLossTreatment: DEFAULT_CHAIN,
      eolTreatment: DEFAULT_CHAIN,
    }],
    manufacturing: {
      electricity: { consumption: 0, mixId: 'ch_grid_basic' },
      heat: { consumption: 0, mixId: 'heat_basic' },
    },
    transportLand: { distance: 0, mixId: 'basic_land' },
    transportOverseas: { distance: 0, mixId: 'basic_overseas' },
    usePhase: { lifetime: 30 },
    endOfLife: {
      scenario: 'recycling',
      transport: { distance: 0, modes: [{ modeId: 'trans_lorry', share: 1.0 }] },
    },
  };
}

export function useVariants(initialProduct: Product) {
  const [product, setProduct] = useState<Product>(initialProduct);
  const [activeVariantId, setActiveVariantId] = useState<string>(initialProduct.variants[0]?.id ?? '');

  const activeVariant = product.variants.find(v => v.id === activeVariantId) ?? product.variants[0];

  const updateVariant = useCallback((variantId: string, updater: (v: Variant) => Variant) => {
    setProduct(prev => ({
      ...prev,
      variants: prev.variants.map(v => v.id === variantId ? updater(v) : v),
    }));
  }, []);

  const updateActiveVariant = useCallback((updater: (v: Variant) => Variant) => {
    updateVariant(activeVariantId, updater);
  }, [activeVariantId, updateVariant]);

  const updateProductInfo = useCallback((info: Partial<ProductInfo>) => {
    updateActiveVariant(v => ({ ...v, productInfo: { ...v.productInfo, ...info } }));
  }, [updateActiveVariant]);

  const updateComponent = useCallback((componentId: string, updates: Partial<ComponentItem>) => {
    updateActiveVariant(v => {
      const components = v.components.map(c => c.id === componentId ? { ...c, ...updates } : c);
      return {
        ...v,
        components,
        productInfo: { ...v.productInfo, totalMass: components.reduce((s, c) => s + c.mass, 0) },
      };
    });
  }, [updateActiveVariant]);

  const updateManufacturing = useCallback((updates: Partial<Manufacturing>) => {
    updateActiveVariant(v => ({
      ...v,
      manufacturing: {
        electricity: updates.electricity ?? v.manufacturing.electricity,
        heat: updates.heat ?? v.manufacturing.heat,
      },
    }));
  }, [updateActiveVariant]);

  const updateTransportLand = useCallback((updates: Partial<VariantTransport>) => {
    updateActiveVariant(v => ({ ...v, transportLand: { ...v.transportLand, ...updates } }));
  }, [updateActiveVariant]);

  const updateTransportOverseas = useCallback((updates: Partial<VariantTransport>) => {
    updateActiveVariant(v => ({ ...v, transportOverseas: { ...v.transportOverseas, ...updates } }));
  }, [updateActiveVariant]);

  const updateUsePhase = useCallback((updates: Partial<UsePhase>) => {
    updateActiveVariant(v => ({ ...v, usePhase: { ...v.usePhase, ...updates } }));
  }, [updateActiveVariant]);

  const updateEndOfLife = useCallback((updates: Partial<EndOfLife>) => {
    updateActiveVariant(v => ({ ...v, endOfLife: { ...v.endOfLife, ...updates } }));
  }, [updateActiveVariant]);

  const addVariant = useCallback(() => {
    if (product.variants.length >= 5) return;
    const newVariant = createEmptyVariant(product.variants.length + 1);
    setProduct(prev => ({ ...prev, variants: [...prev.variants, newVariant] }));
    setActiveVariantId(newVariant.id);
  }, [product.variants.length]);

  const removeVariant = useCallback((variantId: string) => {
    if (product.variants.length <= 1) return;
    setProduct(prev => {
      const filtered = prev.variants.filter(v => v.id !== variantId);
      return { ...prev, variants: filtered };
    });
    if (activeVariantId === variantId) {
      setActiveVariantId(product.variants.find(v => v.id !== variantId)?.id ?? '');
    }
  }, [product.variants, activeVariantId]);

  const duplicateVariant = useCallback((variantId: string) => {
    if (product.variants.length >= 5) return;
    const source = product.variants.find(v => v.id === variantId);
    if (!source) return;
    const newId = `variant-${++variantCounter}`;
    const dup: Variant = {
      ...JSON.parse(JSON.stringify(source)),
      id: newId,
      name: `${source.name} (copy)`,
    };
    setProduct(prev => ({ ...prev, variants: [...prev.variants, dup] }));
    setActiveVariantId(newId);
  }, [product.variants]);

  const renameVariant = useCallback((variantId: string, name: string) => {
    updateVariant(variantId, v => ({ ...v, name }));
  }, [updateVariant]);

  const setComponentCount = useCallback((count: number) => {
    updateActiveVariant(v => {
      const current = v.components;
      if (count > current.length) {
        const newComps: ComponentItem[] = [];
        for (let i = current.length; i < count; i++) {
          newComps.push({
            id: `${v.id}-comp-${i + 1}`,
            name: `Component ${i + 1}`,
            icon: 'cube',
            materialId: 'cement_unspecified',
            mass: 0,
            primaryContent: 1.0,
            manufacturingLossRate: 0,
            manufacturingLossTreatment: DEFAULT_CHAIN,
            eolTreatment: DEFAULT_CHAIN,
          });
        }
        return {
          ...v,
          components: [...current, ...newComps],
          productInfo: { ...v.productInfo, componentCount: count },
        };
      } else {
        return {
          ...v,
          components: current.slice(0, count),
          productInfo: { ...v.productInfo, componentCount: count },
        };
      }
    });
  }, [updateActiveVariant]);

  const setSleeperComponents = useCallback((components: Omit<ComponentItem, 'id'>[], variantId: string) => {
    updateVariant(variantId, v => ({
      ...v,
      components: components.map((c, i) => ({ ...c, id: `${v.id}-comp-${i + 1}` })),
      productInfo: {
        ...v.productInfo,
        componentCount: components.length,
        totalMass: components.reduce((sum, c) => sum + c.mass, 0),
      },
    }));
  }, [updateVariant]);

  return {
    product,
    activeVariant,
    activeVariantId,
    setActiveVariantId,
    updateProductInfo,
    updateComponent,
    updateManufacturing,
    updateTransportLand,
    updateTransportOverseas,
    updateUsePhase,
    updateEndOfLife,
    addVariant,
    removeVariant,
    duplicateVariant,
    renameVariant,
    setComponentCount,
    setSleeperComponents,
  };
}
