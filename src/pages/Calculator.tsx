import { useMemo, useState } from 'react';
import type { SectionId } from '../types';
import { defaultProduct } from '../data/sleeperPresets';
import { getErpEntriesByCategory } from '../data/erpDatabase';
import { getElectricityMixes, getHeatMixes } from '../data/energyMixes';
import { transportModes } from '../data/transportModes';
import { useVariants } from '../hooks/useVariants';
import { useAllCalculations } from '../hooks/useCalculation';
import { MainLayout } from '../components/layout/MainLayout';
import { VariantTabs } from '../components/layout/VariantTabs';
import { SectionNav } from '../components/layout/SectionNav';
import type { NavSection } from '../components/layout/SectionNav';
import { ProductInfoForm } from '../components/forms/ProductInfoForm';
import { ComponentForm } from '../components/forms/ComponentForm';
import { ManufacturingForm } from '../components/forms/ManufacturingForm';
import { UsePhaseForm } from '../components/forms/UsePhaseForm';
import { EndOfLifeForm } from '../components/forms/EndOfLifeForm';
import { TauDisplay } from '../components/visualization/TauDisplay';
import { BreakdownLegend } from '../components/visualization/BreakdownLegend';
import { ResultsChart } from '../components/visualization/ResultsChart';
import { SankeyDiagram } from '../components/visualization/SankeyDiagram';

export function Calculator() {
  const {
    product,
    activeVariant,
    activeVariantId,
    setActiveVariantId,
    updateProductInfo,
    updateComponent,
    updateManufacturing,
    updateUsePhase,
    updateEndOfLife,
    addVariant,
    removeVariant,
    duplicateVariant,
    renameVariant,
    setComponentCount,
  } = useVariants(defaultProduct);

  const [activeSection, setActiveSection] = useState<SectionId>('product-info');
  const allResults = useAllCalculations(product.variants);
  const activeResult = activeVariant ? allResults.get(activeVariant.id) : null;

  const sections = useMemo((): NavSection[] => {
    const s: NavSection[] = [
      { id: 'product-info', label: 'Product Info', group: 'product' },
    ];
    if (activeVariant) {
      for (let i = 0; i < activeVariant.components.length; i++) {
        const comp = activeVariant.components[i];
        s.push({
          id: `component-${i}` as SectionId,
          label: comp.name || `Component ${i + 1}`,
          group: 'component',
          icon: comp.icon,
        });
      }
    }
    s.push(
      { id: 'manufacturing', label: 'Manufacturing', group: 'lifecycle' },
      { id: 'use-phase', label: 'Use Phase', group: 'lifecycle' },
      { id: 'end-of-life', label: 'End of Life', group: 'lifecycle' },
    );
    return s;
  }, [activeVariant]);

  const materialOptions = useMemo(
    () => getErpEntriesByCategory('material').map(e => ({ value: e.id, label: e.name })),
    [],
  );

  const transportModeOptions = useMemo(
    () => transportModes.map(m => ({ value: m.id, label: m.name })),
    [],
  );

  const electricityMixOptions = useMemo(
    () => getElectricityMixes().map(m => ({ value: m.id, label: m.name })),
    [],
  );

  const heatMixOptions = useMemo(
    () => getHeatMixes().map(m => ({ value: m.id, label: m.name })),
    [],
  );

  function renderActiveSection() {
    if (!activeVariant) return null;

    if (activeSection === 'product-info') {
      return (
        <ProductInfoForm
          productInfo={activeVariant.productInfo}
          onUpdate={updateProductInfo}
          onComponentCountChange={setComponentCount}
        />
      );
    }

    if (activeSection.startsWith('component-')) {
      const idx = parseInt(activeSection.split('-')[1], 10);
      const comp = activeVariant.components[idx];
      if (!comp) return null;
      return (
        <ComponentForm
          component={comp}
          index={idx}
          onUpdate={updateComponent}
          materialOptions={materialOptions}
          transportModeOptions={transportModeOptions}
        />
      );
    }

    if (activeSection === 'manufacturing') {
      return (
        <ManufacturingForm
          manufacturing={activeVariant.manufacturing}
          onUpdate={updateManufacturing}
          electricityMixOptions={electricityMixOptions}
          heatMixOptions={heatMixOptions}
        />
      );
    }

    if (activeSection === 'use-phase') {
      return (
        <UsePhaseForm
          usePhase={activeVariant.usePhase}
          onUpdate={updateUsePhase}
        />
      );
    }

    if (activeSection === 'end-of-life') {
      return (
        <EndOfLifeForm
          endOfLife={activeVariant.endOfLife}
          components={activeVariant.components.map(c => ({ id: c.id, name: c.name }))}
          onUpdate={updateEndOfLife}
          transportModeOptions={transportModeOptions}
        />
      );
    }

    return null;
  }

  return (
    <MainLayout
      tabs={
        <VariantTabs
          variants={product.variants.map(v => ({ id: v.id, name: v.name }))}
          activeId={activeVariantId}
          onSelect={setActiveVariantId}
          onAdd={addVariant}
          onRemove={removeVariant}
          onDuplicate={duplicateVariant}
          onRename={renameVariant}
        />
      }
      nav={
        <SectionNav
          sections={sections}
          activeSection={activeSection}
          onSelect={setActiveSection}
        />
      }
      content={renderActiveSection()}
      sidebar={
        <div className="flex flex-col gap-6 p-4">
          {activeVariant && activeResult && (
            <>
              <TauDisplay
                totalTau={activeResult.totalTau}
                variantName={activeVariant.name}
              />
              <SankeyDiagram
                components={activeVariant.components}
                totalWeight={activeVariant.productInfo.totalWeight}
              />
              <BreakdownLegend breakdown={activeResult.breakdown} />
            </>
          )}
          <ResultsChart
            variants={product.variants.map(v => ({ id: v.id, name: v.name }))}
            results={allResults}
          />
        </div>
      }
    />
  );
}
