import { useMemo, useState } from 'react';
import type { SectionId, SleeperType } from '../types';
import { defaultProduct } from '../data/sleeperPresets';
import { getSleeperType } from '../data/sleeperTypes';
import { useVariants } from '../hooks/useVariants';
import { useAllCalculations } from '../hooks/useCalculation';
import { useMaterialsEnergy } from '../hooks/useMaterialsEnergy';
import { MainLayout } from '../components/layout/MainLayout';
import { VariantTabs } from '../components/layout/VariantTabs';
import { SectionNav } from '../components/layout/SectionNav';
import type { NavSection } from '../components/layout/SectionNav';
import { PageNav } from '../components/layout/PageNav';
import { ProductInfoForm } from '../components/forms/ProductInfoForm';
import { ComponentForm } from '../components/forms/ComponentForm';
import { ElectricitySectionForm } from '../components/forms/ElectricitySectionForm';
import { HeatSectionForm } from '../components/forms/HeatSectionForm';
import { TransportSectionForm } from '../components/forms/TransportSectionForm';
import { TauDisplay } from '../components/visualization/TauDisplay';
import { BreakdownLegend } from '../components/visualization/BreakdownLegend';
import { ResultsChart } from '../components/visualization/ResultsChart';
import { SankeyDiagram } from '../components/visualization/SankeyDiagram';
import { OverviewPage } from './OverviewPage';
import { MaterialsEnergyPage } from './MaterialsEnergyPage';
import type { PageId } from '../types';

export function Calculator() {
  const [activePage, setActivePage] = useState<PageId>('variant-config');

  const variantHook = useVariants(defaultProduct);
  const {
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
    addVariant,
    removeVariant,
    duplicateVariant,
    renameVariant,
    setComponentCount,
    setSleeperComponents,
  } = variantHook;

  const [activeSection, setActiveSection] = useState<SectionId>('product-info');
  const allResults = useAllCalculations(product.variants);
  const activeResult = activeVariant ? allResults.get(activeVariant.id) : null;

  const me = useMaterialsEnergy();

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
      { id: 'electricity', label: 'Electricity', group: 'lifecycle' },
      { id: 'heat', label: 'Heat', group: 'lifecycle' },
      { id: 'transport-land', label: 'Transport Land', group: 'lifecycle' },
      { id: 'transport-overseas', label: 'Transport Overseas', group: 'lifecycle' },
    );
    return s;
  }, [activeVariant]);

  const materialOptions = useMemo(() => me.getMaterialOptions(), [me]);

  const handleSleeperTypeChange = (sleeperType: SleeperType) => {
    const def = getSleeperType(sleeperType);
    if (def && activeVariant) {
      setSleeperComponents(def.defaultComponents, activeVariant.id);
      updateTransportLand({ distance: def.installationTransportKm });
      updateUsePhase({ lifetime: def.lifetime });
    }
  };

  function renderActiveSection() {
    if (!activeVariant) return null;

    if (activeSection === 'product-info') {
      return (
        <ProductInfoForm
          productInfo={activeVariant.productInfo}
          lifetime={activeVariant.usePhase.lifetime}
          onUpdate={updateProductInfo}
          onLifetimeChange={(lifetime) => updateUsePhase({ lifetime })}
          onComponentCountChange={setComponentCount}
          onSleeperTypeChange={handleSleeperTypeChange}
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
          lifetime={activeVariant.usePhase.lifetime}
          onUpdate={updateComponent}
          materialOptions={materialOptions}
        />
      );
    }

    if (activeSection === 'electricity') {
      return (
        <ElectricitySectionForm
          components={activeVariant.components}
          electricityMixId={activeVariant.manufacturing.electricity.mixId}
          heatMixId={activeVariant.manufacturing.heat.mixId}
          lifetime={activeVariant.usePhase.lifetime}
          onMixChange={(mixId) =>
            updateManufacturing({ electricity: { ...activeVariant.manufacturing.electricity, mixId } })
          }
        />
      );
    }

    if (activeSection === 'heat') {
      return (
        <HeatSectionForm
          components={activeVariant.components}
          heatMixId={activeVariant.manufacturing.heat.mixId}
          lifetime={activeVariant.usePhase.lifetime}
          onMixChange={(mixId) =>
            updateManufacturing({ heat: { ...activeVariant.manufacturing.heat, mixId } })
          }
        />
      );
    }

    if (activeSection === 'transport-land') {
      return (
        <TransportSectionForm
          title="Transport Land"
          type="land"
          distance={activeVariant.transportLand.distance}
          mixId={activeVariant.transportLand.mixId}
          components={activeVariant.components}
          lifetime={activeVariant.usePhase.lifetime}
          onDistanceChange={(distance) => updateTransportLand({ distance })}
          onMixChange={(mixId) => updateTransportLand({ mixId })}
        />
      );
    }

    if (activeSection === 'transport-overseas') {
      return (
        <TransportSectionForm
          title="Transport Overseas"
          type="overseas"
          distance={activeVariant.transportOverseas.distance}
          mixId={activeVariant.transportOverseas.mixId}
          components={activeVariant.components}
          lifetime={activeVariant.usePhase.lifetime}
          onDistanceChange={(distance) => updateTransportOverseas({ distance })}
          onMixChange={(mixId) => updateTransportOverseas({ mixId })}
        />
      );
    }

    return null;
  }

  const pageNav = <PageNav activePage={activePage} onSelect={setActivePage} />;

  if (activePage === 'overview') {
    return (
      <MainLayout
        pageNav={pageNav}
        content={<OverviewPage variants={product.variants} results={allResults} />}
      />
    );
  }

  if (activePage === 'materials-energy') {
    return (
      <MainLayout
        pageNav={pageNav}
        content={<MaterialsEnergyPage />}
      />
    );
  }

  return (
    <MainLayout
      pageNav={pageNav}
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
