import { useMemo } from 'react';
import { Flame } from 'lucide-react';
import type { ComponentItem } from '../../types';
import { useMaterialsEnergy } from '../../hooks/useMaterialsEnergy';
import { computeHeatBreakdown, HEAT_PUMP_FACTOR } from '../../utils/energyBreakdown';
import { calculateMixTau } from '../../utils/calculate';
import type { MixLookup } from '../../utils/calculate';
import { SelectInput } from './SelectInput';

interface HeatSectionFormProps {
  components: ComponentItem[];
  heatMixId: string;
  lifetime: number;
  onMixChange: (mixId: string) => void;
}

export function HeatSectionForm({
  components,
  heatMixId,
  lifetime,
  onMixChange,
}: HeatSectionFormProps) {
  const me = useMaterialsEnergy();

  const heatMix = useMemo(
    () => me.getMixById(heatMixId),
    [me, heatMixId],
  );

  const heatBd = useMemo(
    () => computeHeatBreakdown(components, me.getMaterialRate, heatMix),
    [components, me.getMaterialRate, heatMix],
  );

  const tau = useMemo(() => {
    const lookup: MixLookup = {
      getMix: me.getMixById,
      getTransportMix: me.getTransportMixById,
      getErp: me.getErpEntry,
      getMaterialRate: me.getMaterialRate,
    };
    return calculateMixTau(heatBd.totalProduced, heatMixId, lifetime, lookup);
  }, [heatBd.totalProduced, heatMixId, lifetime, me]);

  const mixOptions = useMemo(() => me.getHeatMixOptions(), [me]);

  const sourcesWithErp = useMemo(() => {
    if (!heatMix) return [];
    return heatMix.sources
      .filter(s => s.share > 0)
      .map(s => {
        const erp = me.getErpEntry(s.erpId);
        return {
          erpId: s.erpId,
          name: erp?.name ?? s.erpId,
          share: s.share,
          erp: erp?.erp ?? 0,
          isHeatPump: s.erpId === 'ht_heatpump',
        };
      })
      .sort((a, b) => b.share - a.share);
  }, [heatMix, me]);

  const maxShare = sourcesWithErp.length > 0 ? Math.max(...sourcesWithErp.map(s => s.share)) : 1;

  return (
    <section className="bg-white">
      <h2 className="flex items-center gap-2 border-b border-gray-200 pb-2 text-lg font-bold text-gray-900">
        <Flame className="h-5 w-5 text-orange-500" />
        Heat
      </h2>

      <div className="mt-5 space-y-6">
        <SelectInput
          label="Mix Profile"
          value={heatMixId}
          options={mixOptions}
          onChange={onMixChange}
          tooltip="Heat generation mix used for τ calculation. Heat pump share converts to electricity demand."
        />

        <SourceSharesTable sources={sourcesWithErp} maxShare={maxShare} />

        <HeatConsumptionBreakdown
          manufacture={heatBd.manufacture}
          recycleCascade={heatBd.recycleCascade}
          totalProduced={heatBd.totalProduced}
          fromHeatPump={heatBd.fromHeatPump}
          netHeat={heatBd.netHeat}
          heatPumpShare={heatBd.heatPumpShare}
        />

        <HeatTauResult tau={tau} lifetime={lifetime} totalProduced={heatBd.totalProduced} netHeat={heatBd.netHeat} />
      </div>
    </section>
  );
}

function SourceSharesTable({
  sources,
  maxShare,
}: {
  sources: { erpId: string; name: string; share: number; isHeatPump: boolean }[];
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
                  {s.name.replace('Heat, ', '')}
                  {s.isHeatPump && (
                    <span className="ml-1 text-[10px] text-blue-500">→ elec.</span>
                  )}
                </span>
                <div className="flex-1 h-3.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${s.isHeatPump ? 'bg-blue-300' : 'bg-orange-400'}`}
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

function HeatConsumptionBreakdown({
  manufacture,
  recycleCascade,
  totalProduced,
  fromHeatPump,
  netHeat,
  heatPumpShare,
}: {
  manufacture: number;
  recycleCascade: number;
  totalProduced: number;
  fromHeatPump: number;
  netHeat: number;
  heatPumpShare: number;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Consumption Breakdown
      </h3>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="space-y-1">
          <Row label="Manufacture product" value={manufacture} />
          <Row label="Recycle / cascade" value={recycleCascade} />
        </div>
        <div className="mt-1.5 flex items-center justify-between border-t border-gray-300 pt-1.5">
          <span className="text-xs font-semibold text-gray-800">Total heat produced</span>
          <span className="font-mono text-sm font-bold text-gray-900">
            {totalProduced.toFixed(2)} kWh
          </span>
        </div>

        {heatPumpShare > 0 && (
          <div className="mt-3 rounded border border-blue-200 bg-blue-50 p-2">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-blue-600 mb-1">
              Heat Pump Interaction
            </p>
            <div className="space-y-0.5">
              <div className="flex justify-between text-xs text-blue-700">
                <span>Heat from pump ({(heatPumpShare * 100).toFixed(0)}%)</span>
                <span className="font-mono">{fromHeatPump.toFixed(2)} kWh</span>
              </div>
              <div className="flex justify-between text-xs text-blue-700">
                <span>→ Added to electricity (factor = {HEAT_PUMP_FACTOR})</span>
                <span className="font-mono">{(fromHeatPump * HEAT_PUMP_FACTOR).toFixed(2)} kWh</span>
              </div>
              <div className="flex justify-between text-xs font-semibold text-blue-800 border-t border-blue-200 pt-0.5 mt-0.5">
                <span>Net heat (non-electric)</span>
                <span className="font-mono">{netHeat.toFixed(2)} kWh</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-xs text-gray-600">{label}</span>
      <span className="font-mono text-xs text-gray-700">{value.toFixed(2)} kWh</span>
    </div>
  );
}

function HeatTauResult({
  tau,
  lifetime,
  totalProduced,
  netHeat,
}: {
  tau: number;
  lifetime: number;
  totalProduced: number;
  netHeat: number;
}) {
  const perYear = lifetime > 0 ? totalProduced / lifetime : 0;

  return (
    <div className="rounded-lg border border-orange-200 bg-orange-50 p-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-orange-700">
            Resource Pressure
          </h3>
          <p className="mt-0.5 text-[10px] text-orange-600">
            {totalProduced.toFixed(1)} kWh / {lifetime}a = {perYear.toFixed(1)} kWh/a
          </p>
          {netHeat < totalProduced && (
            <p className="text-[10px] text-orange-500">
              Heat pump portion (ERP = 0) excluded from τ
            </p>
          )}
        </div>
        <div className="text-right">
          <span className="font-mono text-lg font-bold text-orange-900">
            {tau.toExponential(3)}
          </span>
        </div>
      </div>
    </div>
  );
}
