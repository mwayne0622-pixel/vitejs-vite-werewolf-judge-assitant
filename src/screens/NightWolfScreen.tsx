import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  alivePlayers: Player[];
  wolfTargetId: number | null;
  canGoNext: boolean;
  onSelectTarget: (playerId: number) => void;
  onNext: () => void;
};

export default function NightWolfScreen({
  alivePlayers,
  wolfTargetId,
  canGoNext,
  onSelectTarget,
  onNext,
}: Props) {
  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="夜晚：狼人行动" en="Night: Wolves act" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>狼人请睁眼。<br />请选择今晚要袭击的玩家。</>}
            en={<>Wolves, please open your eyes.<br />Choose tonight&apos;s target.</>}
          />
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
        <Bilingual zh="狼人可以选择任意存活玩家作为刀口，包括自己。" en="Wolves may target any alive player, including themselves." small />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {alivePlayers.map((player) => {
          const selected = wolfTargetId === player.id;
          return (
            <PlayerSelectButton
              key={player.id}
              player={player}
              selected={selected}
              showRole
              onClick={() => onSelectTarget(player.id)}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          type="button"
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
