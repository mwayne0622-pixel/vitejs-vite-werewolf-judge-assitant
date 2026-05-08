import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  source: 'night' | 'vote';
  hunterPlayer: Player;
  aliveTargets: Player[];
  selectedTargetId: number | null;
  onSelectTarget: (playerId: number) => void;
  onSkip: () => void;
  onConfirm: () => void;
};

export default function HunterShootScreen({
  source,
  hunterPlayer,
  aliveTargets,
  selectedTargetId,
  onSelectTarget,
  onSkip,
  onConfirm,
}: Props) {
  const canConfirm = selectedTargetId !== null;

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="猎人开枪" en="Hunter shoots" />

      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber-border)] text-[#fde68a] text-xs">
        <Bilingual
          zh={`猎人（${hunterPlayer.seat}号）已因${source === 'night' ? '夜晚死亡' : '投票出局'}触发技能，可选择带走一名存活玩家，也可以选择不开枪。`}
          en={`Hunter (Seat ${hunterPlayer.seat}) died by ${source === 'night' ? 'night kill' : 'vote out'} and may shoot one alive player, or skip.`}
          small
        />
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="选择带走目标" en="Choose a target to shoot" small />
        </div>
        <div className="flex flex-wrap gap-2">
          {aliveTargets.map((player) => {
            const selected = selectedTargetId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => onSelectTarget(player.id)}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors" onClick={onSkip}>
          <Bilingual zh="不开枪" en="Skip" small />
        </button>
        <button
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canConfirm ? 'bg-[var(--color-blood)] text-white hover:brightness-110 shadow-[var(--shadow-glow-blood)]' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          <Bilingual zh="确认开枪" en="Confirm shot" small />
        </button>
      </div>
    </section>
  );
}
