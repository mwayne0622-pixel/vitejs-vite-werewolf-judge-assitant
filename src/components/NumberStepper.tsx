import Bilingual from './Bilingual';

type Props = {
  labelZh: string;
  labelEn: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
  unitZh: string;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function NumberStepper({
  labelZh,
  labelEn,
  value,
  min,
  max,
  onChange,
  unitZh,
}: Props) {
  return (
    <div>
      <label className="block mb-2">
        <Bilingual zh={labelZh} en={labelEn} small />
      </label>

      <div className="flex items-center gap-3">
        <button
          className="w-10 h-10 rounded-xl border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] text-xl cursor-pointer hover:border-[var(--color-blood)] hover:text-[var(--color-moon-bright)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => onChange(clamp(value - 1, min, max))}
          disabled={value <= min}
        >
          -
        </button>

        <div className="min-w-[90px] text-center px-3 py-2.5 rounded-xl border border-[var(--color-wolf-border)] bg-[var(--color-wolf-surface)] text-[var(--color-moon-bright)] font-bold">
          {value} {unitZh}
        </div>

        <button
          className="w-10 h-10 rounded-xl border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] text-xl cursor-pointer hover:border-[var(--color-blood)] hover:text-[var(--color-moon-bright)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          onClick={() => onChange(clamp(value + 1, min, max))}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}
