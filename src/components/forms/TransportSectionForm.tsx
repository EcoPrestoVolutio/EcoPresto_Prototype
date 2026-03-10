import { useMemo } from 'react';
import { Truck, Ship } from 'lucide-react';
import type { ComponentItem } from '../../types';
import { useMaterialsEnergy } from '../../hooks/useMaterialsEnergy';
import { NumberInput } from './NumberInput';
import { SelectInput } from './SelectInput';

interface TransportSectionFormProps {
  title: string;
  type: 'land' | 'overseas';
  distance: number;
  mixId: string;
  components: ComponentItem[];
  lifetime: number;
  onDistanceChange: (distance: number) => void;
  onMixChange: (mixId: string) => void;
}

export function TransportSectionForm({
  title,
  type,
  distance,
  mixId,
  components,
  lifetime,
  onDistanceChange,
  onMixChange,
}: TransportSectionFormProps) {
  const me = useMaterialsEnergy();

  const mixOptions = useMemo(
    () => me.getTransportMixOptions(type),
    [me, type],
  );

  const transportMix = useMemo(
    () => me.getTransportMixById(mixId),
    [me, mixId],
  );

  const totalMass = useMemo(
    () => components.reduce((sum, c) => sum + c.mass, 0),
    [components],
  );

  const tkm = totalMass > 0 && distance > 0
    ? (totalMass * distance) / 1000
    : 0;

  const tau = useMemo(() => {
    if (tkm <= 0 || lifetime <= 0 || !transportMix) return 0;
    let sum = 0;
    for (const mode of transportMix.modes) {
      const erp = me.getErpEntry(mode.modeId);
      if (erp && erp.erp > 0) {
        sum += (tkm * mode.share) / erp.erp / lifetime;
      }
    }
    return sum;
  }, [tkm, lifetime, transportMix, me]);

  const modesWithErp = useMemo(() => {
    if (!transportMix) return [];
    return transportMix.modes
      .filter(m => m.share > 0)
      .map(m => {
        const erp = me.getErpEntry(m.modeId);
        return { modeId: m.modeId, name: erp?.name ?? m.modeId, share: m.share };
      })
      .sort((a, b) => b.share - a.share);
  }, [transportMix, me]);

  const maxShare = modesWithErp.length > 0 ? Math.max(...modesWithErp.map(m => m.share)) : 1;

  const Icon = type === 'overseas' ? Ship : Truck;
  const accentColor = type === 'overseas' ? 'indigo' : 'purple';

  return (
    <section className="bg-white">
      <h2 className={`flex items-center gap-2 border-b border-gray-200 pb-2 text-lg font-bold text-gray-900`}>
        <Icon className={`h-5 w-5 text-${accentColor}-500`} />
        {title}
      </h2>

      <div className="mt-5 space-y-6">
        <NumberInput
          label="Distance"
          value={distance}
          unit="km"
          min={0}
          onChange={onDistanceChange}
          tooltip="Installation transport distance for this sleeper type"
        />

        <SelectInput
          label="Transport Mix"
          value={mixId}
          options={mixOptions}
          onChange={onMixChange}
          tooltip="Transport mode mix profile used for τ calculation"
        />

        <ModeSharesTable modes={modesWithErp} maxShare={maxShare} accentColor={accentColor} />

        <TkmBreakdown totalMass={totalMass} distance={distance} tkm={tkm} />

        <TransportTauResult tau={tau} lifetime={lifetime} tkm={tkm} accentColor={accentColor} />
      </div>
    </section>
  );
}

function ModeSharesTable({
  modes,
  maxShare,
  accentColor,
}: {
  modes: { modeId: string; name: string; share: number }[];
  maxShare: number;
  accentColor: string;
}) {
  if (modes.length === 0) return null;

  const barClass = accentColor === 'indigo' ? 'bg-indigo-400' : 'bg-purple-400';

  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Mode Shares
      </h3>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="space-y-1.5">
          {modes.map(m => {
            const pct = (m.share * 100).toFixed(1);
            const barWidth = maxShare > 0 ? (m.share / maxShare) * 100 : 0;
            return (
              <div key={m.modeId} className="flex items-center gap-3">
                <span className="w-44 truncate text-xs text-gray-600" title={m.name}>
                  {m.name.replace('Transport, ', '').replace('Freight train, ', 'Train ')}
                </span>
                <div className="flex-1 h-3.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barClass}`}
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

function TkmBreakdown({
  totalMass,
  distance,
  tkm,
}: {
  totalMass: number;
  distance: number;
  tkm: number;
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
        Transport Volume
      </h3>
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between py-0.5">
            <span className="text-xs text-gray-600">Product mass</span>
            <span className="font-mono text-xs text-gray-700">{totalMass.toFixed(1)} kg</span>
          </div>
          <div className="flex items-center justify-between py-0.5">
            <span className="text-xs text-gray-600">Distance</span>
            <span className="font-mono text-xs text-gray-700">{distance.toFixed(0)} km</span>
          </div>
        </div>
        <div className="mt-1.5 flex items-center justify-between border-t border-gray-300 pt-1.5">
          <span className="text-xs font-semibold text-gray-800">
            Total
            <span className="ml-1 text-[10px] font-normal text-gray-500">
              (mass × dist / 1000)
            </span>
          </span>
          <span className="font-mono text-sm font-bold text-gray-900">
            {tkm.toFixed(2)} tkm
          </span>
        </div>
      </div>
    </div>
  );
}

function TransportTauResult({
  tau,
  lifetime,
  tkm,
  accentColor,
}: {
  tau: number;
  lifetime: number;
  tkm: number;
  accentColor: string;
}) {
  const perYear = lifetime > 0 ? tkm / lifetime : 0;

  const borderClass = accentColor === 'indigo' ? 'border-indigo-200' : 'border-purple-200';
  const bgClass = accentColor === 'indigo' ? 'bg-indigo-50' : 'bg-purple-50';
  const titleClass = accentColor === 'indigo' ? 'text-indigo-700' : 'text-purple-700';
  const subtitleClass = accentColor === 'indigo' ? 'text-indigo-600' : 'text-purple-600';
  const valueClass = accentColor === 'indigo' ? 'text-indigo-900' : 'text-purple-900';

  return (
    <div className={`rounded-lg border ${borderClass} ${bgClass} p-3`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xs font-semibold uppercase tracking-wider ${titleClass}`}>
            Resource Pressure
          </h3>
          <p className={`mt-0.5 text-[10px] ${subtitleClass}`}>
            {tkm.toFixed(1)} tkm / {lifetime}a = {perYear.toFixed(2)} tkm/a
          </p>
        </div>
        <div className="text-right">
          <span className={`font-mono text-lg font-bold ${valueClass}`}>
            {tau.toExponential(3)}
          </span>
        </div>
      </div>
    </div>
  );
}
