import Bilingual from '../components/Bilingual';
import NumberStepper from '../components/NumberStepper';
import type { GameConfig, Player } from '../types';

type Props = {
  config: GameConfig;
  playerCount: number;
  configValid: boolean;
  players: Player[];
  includedGodCount: number;
  onUpdateConfig: (patch: Partial<GameConfig>) => void;
  onUpdatePlayerName: (id: number, value: string) => void;
  onResetPlayersLength: () => void;
  onStartGame: () => void;
};

function CheckboxCard({
  checked,
  onChange,
  zh,
  en,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  zh: string;
  en: string;
}) {
  return (
    <label
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border cursor-pointer transition-colors select-none ${
        checked
          ? 'border-[var(--color-blood)] bg-[var(--color-blood-glow)] text-[var(--color-moon-bright)]'
          : 'border-[var(--color-wolf-border)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)]'
      }`}
    >
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${
          checked ? 'border-[var(--color-blood)] bg-[var(--color-blood)]' : 'border-[var(--color-wolf-border-hi)]'
        }`}
      >
        {checked && <span className="text-white text-[10px] leading-none">✓</span>}
      </span>
      <span className="text-sm font-semibold">{zh}<br /><small className="font-normal text-[var(--color-moon-dim)] text-[11px]">{en}</small></span>
    </label>
  );
}

export default function SetupScreen({
  config,
  playerCount,
  configValid,
  includedGodCount,
  onUpdateConfig,
  onStartGame,
}: Props) {
  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="1. 开局设置" en="Game setup" />

      <div className="mt-4 p-4 rounded-2xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)]">
        <div className="grid grid-cols-5 gap-2">
          {[
            { label: '狼人', value: config.wolfCount },
            { label: '神职', value: includedGodCount },
            { label: '村民', value: config.villagerCount },
            { label: '总人数', value: playerCount },
            { label: '状态', value: configValid ? '✓ 可开始' : '需调整' },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-[var(--color-wolf-card)] border border-[var(--color-wolf-border)]">
              <strong className="text-[var(--color-moon-dim)] text-xs">{label}</strong>
              <span className="text-[var(--color-moon-bright)] font-bold text-sm">{value}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {[
            { label: `熊：${config.hasBear ? '开启' : '关闭'}`, on: config.hasBear },
            { label: `白痴：${config.hasIdiot ? '开启' : '关闭'}`, on: config.hasIdiot },
            { label: `骑士：${config.hasKnight ? '开启' : '关闭'}`, on: config.hasKnight },
            { label: `白狼王：${config.hasWhiteWolfKing ? '开启' : '关闭'}`, on: config.hasWhiteWolfKing },
            { label: `狼美人：${config.hasWolfBeauty ? '开启' : '关闭'}`, on: config.hasWolfBeauty },
            { label: `隐狼：${config.hasHiddenWolf ? '开启' : '关闭'}`, on: config.hasHiddenWolf },
          ].map(({ label, on }) => (
            <span key={label} className={`px-2.5 py-1 rounded-full text-xs border ${on ? 'border-[var(--color-blood)] text-[var(--color-moon-bright)]' : 'border-[var(--color-wolf-border)] text-[var(--color-moon-dim)]'}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <NumberStepper
          labelZh="狼人数量"
          labelEn="Number of wolves"
          value={config.wolfCount}
          min={1}
          max={8}
          onChange={(next) => onUpdateConfig({ wolfCount: next })}
          unitZh="狼"
        />
        <NumberStepper
          labelZh="村民数量"
          labelEn="Number of villagers"
          value={config.villagerCount}
          min={1}
          max={8}
          onChange={(next) => onUpdateConfig({ villagerCount: next })}
          unitZh="民"
        />
      </div>

      <div className="mt-5">
        <div className="text-[var(--color-moon-bright)] font-bold text-sm mb-3">
          <Bilingual zh="本局加入的角色" en="Special roles included" small />
        </div>

        <div className="mb-4">
          <div className="text-[var(--color-moon-dim)] text-xs font-semibold mb-2 uppercase tracking-wider">
            <Bilingual zh="神职角色" en="God roles" small />
          </div>
          <div className="flex flex-wrap gap-2">
            <CheckboxCard checked={config.hasSeer} onChange={(v) => onUpdateConfig({ hasSeer: v })} zh="预言家" en="Seer" />
            <CheckboxCard checked={config.hasWitch} onChange={(v) => onUpdateConfig({ hasWitch: v })} zh="女巫" en="Witch" />
            <CheckboxCard checked={config.hasGuard} onChange={(v) => onUpdateConfig({ hasGuard: v })} zh="守卫" en="Guard" />
            <CheckboxCard checked={config.hasHunter} onChange={(v) => onUpdateConfig({ hasHunter: v })} zh="猎人" en="Hunter" />
            <CheckboxCard checked={config.hasBear} onChange={(v) => onUpdateConfig({ hasBear: v })} zh="熊" en="Bear" />
            <CheckboxCard checked={config.hasIdiot} onChange={(v) => onUpdateConfig({ hasIdiot: v })} zh="白痴" en="Idiot" />
            <CheckboxCard checked={config.hasKnight} onChange={(v) => onUpdateConfig({ hasKnight: v })} zh="骑士" en="Knight" />
          </div>
        </div>

        <div>
          <div className="text-[var(--color-moon-dim)] text-xs font-semibold mb-2 uppercase tracking-wider">
            <Bilingual zh="狼人阵营角色" en="Wolf camp roles" small />
          </div>
          <div className="flex flex-wrap gap-2">
            <CheckboxCard checked={config.hasWhiteWolfKing} onChange={(v) => onUpdateConfig({ hasWhiteWolfKing: v })} zh="白狼王" en="White Wolf King" />
            <CheckboxCard checked={config.hasWolfBeauty} onChange={(v) => onUpdateConfig({ hasWolfBeauty: v })} zh="狼美人" en="Wolf Beauty" />
            <CheckboxCard checked={config.hasHiddenWolf} onChange={(v) => onUpdateConfig({ hasHiddenWolf: v })} zh="隐狼" en="Hidden Wolf" />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          className={`border-none px-4 py-3 rounded-xl font-bold text-sm cursor-pointer transition-all ${
            configValid
              ? 'bg-[var(--color-blood)] text-white hover:brightness-110 shadow-[var(--shadow-glow-blood)]'
              : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'
          }`}
          onClick={onStartGame}
          disabled={!configValid}
        >
          <Bilingual zh="开始第一夜" en="Start first night" small />
        </button>
      </div>
    </section>
  );
}
