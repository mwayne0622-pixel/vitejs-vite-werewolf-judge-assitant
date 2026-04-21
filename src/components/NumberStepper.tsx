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
      <label
        style={{
          display: 'block',
          marginBottom: 8,
          color: '#111827',
          fontWeight: 700,
        }}
      >
        <Bilingual zh={labelZh} en={labelEn} small />
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            border: '1px solid #d1d5db',
            background: '#ffffff',
            fontSize: 20,
            cursor: 'pointer',
          }}
          onClick={() => onChange(clamp(value - 1, min, max))}
          disabled={value <= min}
        >
          -
        </button>

        <div
          style={{
            minWidth: 90,
            textAlign: 'center',
            padding: '10px 12px',
            borderRadius: 12,
            border: '1px solid #d1d5db',
            background: '#f9fafb',
            fontWeight: 700,
          }}
        >
          {value} {unitZh}
        </div>

        <button
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            border: '1px solid #d1d5db',
            background: '#ffffff',
            fontSize: 20,
            cursor: 'pointer',
          }}
          onClick={() => onChange(clamp(value + 1, min, max))}
          disabled={value >= max}
        >
          +
        </button>
      </div>
    </div>
  );
}