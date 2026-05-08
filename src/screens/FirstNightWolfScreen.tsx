import Bilingual from '../components/Bilingual';
import PlayerSelectButton from '../components/PlayerSelectButton';
import type { Player } from '../types';

type Props = {
  players: Player[];
  wolfCount: number;
  selectedWolfIds: number[];
  wolfTargetId: number | null;
  canGoNext: boolean;
  onToggleWolfSelection: (playerId: number) => void;
  onSetWolfTarget: (playerId: number) => void;
  onNext: () => void;
};

export default function FirstNightWolfScreen({
  players,
  wolfCount,
  selectedWolfIds,
  wolfTargetId,
  canGoNext,
  onToggleWolfSelection,
  onSetWolfTarget,
  onNext,
}: Props) {
  const selectedWolfSeats = selectedWolfIds
    .map((id) => players.find((p) => p.id === id)?.seat)
    .filter((seat): seat is number => seat !== undefined);

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="2. 第一夜：狼人" en="First night: Wolves" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>狼人请睁眼。<br />请确认彼此身份，并选择今晚要袭击的玩家。</>}
            en={<>Wolves, please open your eyes.<br />Confirm each other, then choose tonight&apos;s target.</>}
          />
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
        <Bilingual
          zh="先标记哪些玩家是狼人，再记录今晚刀口。狼人可以自刀。"
          en="Mark which players are wolves first, then record tonight's target. Wolves may target themselves."
          small
        />
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh={`选择狼人（需选 ${wolfCount} 个）`} en={`Select wolves (need ${wolfCount})`} small />
        </div>
        <div className="flex flex-wrap gap-2">
          {players.map((player) => (
            <PlayerSelectButton
              key={player.id}
              player={player}
              selected={selectedWolfIds.includes(player.id)}
              onClick={() => onToggleWolfSelection(player.id)}
            />
          ))}
        </div>
        <div className="mt-2 text-xs text-[var(--color-moon-dim)]">
          <Bilingual
            zh={`已选狼人：${selectedWolfSeats.length > 0 ? selectedWolfSeats.map((s) => `${s}号`).join('、') : '无'}`}
            en={`Selected wolves: ${selectedWolfSeats.length > 0 ? selectedWolfSeats.map((s) => `Seat ${s}`).join(', ') : 'None'}`}
            small
          />
        </div>
      </div>

      <div className="mt-5">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="选择今晚刀口" en="Select tonight's target" small />
        </div>
        <div className="flex flex-wrap gap-2">
          {players.map((player) => (
            <PlayerSelectButton
              key={player.id}
              player={player}
              selected={wolfTargetId === player.id}
              onClick={() => onSetWolfTarget(player.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canGoNext ? 'bg-[var(--color-blood)] text-white hover:brightness-110 shadow-[var(--shadow-glow-blood)]' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canGoNext}
          onClick={onNext}
        >
          <Bilingual zh="下一步" en="Next" small />
        </button>
      </div>
    </section>
  );
}
