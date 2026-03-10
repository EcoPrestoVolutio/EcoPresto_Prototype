import { useMemo } from 'react';
import { Zap, Info } from 'lucide-react';
import type { ComponentItem, EnergyMix } from '../../types';
import { useMaterialsEnergy } from '../../hooks/useMaterialsEnergy';
import { computeHeatBreakdown, computeElectricityBreakdown } from '../../utils/energyBreakdown';
import { calculateMixTau } from '../../utils/calculate';
import type { MixLookup } from '../../utils/calculate';
import { SelectInput } from './SelectInput';

interface ElectricitySectionFormProps {
  components: ComponentItem[];
  electricityMixId: string;
  heatMixId: string;
  lifetime: number;
  onMixChange: (mixId: string) => void;
}

export function ElectricitySectionForm({
  components,
  electricityMixId,
  heatMixId,
  lifetime,
  onMixChange,
}: ElectricitySectionFormProps) {
  const me = useMaterialsEnergy();

  const electricityMix = useMemo(
    () => me.getMixById(electricityMixId),
    [me, electricityMixId],
  );

  const heatMix = useMemo(
    () => me.getMixById(heatMixId),
    [me, heatMixId],
  );

  const heatBd = useMemo(
    () => computeHeatBreakdown(components, me.getMaterialRate, heatMix),
    [components, me.getMaterialRate, heatMix],
  );

  const elecBd = useMemo(
    () => computeElectricityBreakdown(components, me.getMaterialRate, heatBd),
    [components, me.getMaterialRate, heatBd],
  );

  const tau = useMemo(() => {
    const lookup: MixLookup = {
      getMix: me.getMixById,
      getTransportMix: me.getTransportMixById,
      getErp: me.getErpEntry,
      getMaterialRate: me.getMaterialRate,
    };
    return calculateMixTau(elecBd.total, electricityMixId, lifetime, lookup);
  }, [elecBd.total, electricityMixId, lifetime, me]);

  const mixOptions = useMemo(() => me.getElectricityMixOptions(), [me]);

  const sourcesWithErp = useMemo(() => {
    if (!electricityMix) return [];
    return electricityMix.sources
      .filter(s => s.share > 0)
      .map(s => {
        const erp = me.getErpEntry(s.erpId);
        return { erpId: s.erpId, name: erp?.name ?? s.erpId, share: s.share, erp: erp?.erp ?? 0 };
      })
      .sort((a, b) => b.share - a.share);
  }, [electricityMix, me]);

  const maxShare = sourcesWithErp.length > 0 ? Math.max(...sourcesWithErp.map(s => s.share)) : 1;

  return (
    <section className="bg-white">
      <h2 className="flex items-center gap-2 border-b border-gray-200 pb-2 text-lg font-bold text-gray-900">
        <Zap className="h-5 w-5 text-amber-500" />
        Electricity
      </h2>

      <div className="mt-5 space-y-6">
        <SelectInput
          label="Mix Profile"
          value={electricityMixId}
          options={mixOptions}
          onChange={onMixChange}
          tooltip="Electricity generation mix used for τ calculation"
        />

        <SourceSharesTable sources={sourcesWithErp} maxShare={maxShare} />

        <ConsumptionBreakdown
          manufacture={elecBd.manufacture}
          heatPump={elecBd.heatPump}
          recycleCascade={elecBd.recycleCascade}
          total={elecBd.total}
        />

        <TauResult tau={tau} lifetime={lifetime} total={elecBd.total} />
      </div>
    </section>
  );
}

function SourceSharesTable({
  sources,
  maxShare,
}: {
  sources: { erpId: string; name: string; share: number; erp: number }[];
  maxShare: number;
}) {
  if (sources.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Source Shares
      </h3>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="space-y-1.5">
          {sources.map(s => {
            const pct = (s.share * 100).toFixed(1);
            const barWidth = maxShare > 0 ? (s.share / maxShare) * 100 : 0;
            return (
              <div key={s.erpId} className="flex items-center gap-3">
                <span className="w-40 truncate text-xs text-gray-600" title={s.name}>
                  {s.name.replace('Electricity, ', '')}
                </span>
                <div className="flex-1 h-3.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="w-14 text-right font-mono text-xs text-gray-700">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ConsumptionBreakdown({
  manufacture,
  heatPump,
  recycleCascade,
  total,
}: {
  manufacture: number;
  heatPump: number;
  recycleCascade: number;
  total: number;
}) {
  const rows: { label: string; value: number; note?: string }[] = [
    { label: 'Manufacture product', value: manufacture },
    { label: 'Heat (from heat pump)', value: heatPump, note: heatPump > 0 ? 'factor 0.33' : undefined },
    { label: 'Recycle / cascade', value: recycleCascade },
  ];

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Consumption Breakdown
      </h3>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="space-y-1">
          {rows.map(r => (
            <div key={r.label} className="flex items-center justify-between py-0.5">
              <span className="text-xs text-gray-600">
                {r.label}
                {r.note && (
                  <span className="ml-1 text-[10px] text-gray-400">({r.note})</span>
                )}
              </span>
              <span className="font-mono text-xs text-gray-700">
                {r.value.toFixed(2)} kWh
              </span>
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex items-center justify-between border-t border-gray-300 pt-1.5">
          <span className="text-xs font-semibold text-gray-800">Total</span>
          <span className="font-mono text-sm font-bold text-gray-900">
            {total.toFixed(2)} kWh
          </span>
        </div>
      </div>
    </div>
  );
}

function TauResult({
  tau,
  lifetime,
  total,
}: {
  tau: number;
  lifetime: number;
  total: number;
}) {
  const perYear = lifetime > 0 ? total / lifetime : 0;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Resource Pressure
          </h3>
          <p className="mt-0.5 text-[10px] text-amber-600">
            {total.toFixed(1)} kWh / {lifetime}a = {perYear.toFixed(1)} kWh/a
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-lg font-bold text-amber-900">
            {tau.toExponential(3)}
          </span>
        </div>
      </div>
    </div>
  );
}
