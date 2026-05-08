import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  players: Player[];
  draftHunterOwnerId: number | null;
  selectablePlayers: Player[];
  canGoNext: boolean;
  onSelectHunter: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightHunterScreen({
  players,
  draftHunterOwnerId,
  selectablePlayers,
  canGoNext,
  onSelectHunter,
  onBack,
  onNext,
}: Props) {
  const selectedHunter = draftHunterOwnerId !== null ? players.find((p) => p.id === draftHunterOwnerId) ?? null : null;

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="6. 第一夜：猎人" en="First night: Hunter" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>猎人请睁眼。<br />请确认你的身份。</>}
            en={<>Hunter, please open your eyes.<br />Confirm your identity.</>}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="先选中谁是猎人，点击下一步后才保存" en="Choose the hunter first. It is saved only when you click Next." small />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftHunterOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => onSelectHunter(player.id)}
              />
            );
          })}
        </div>
        <div className="mt-2 text-xs text-[var(--color-moon-dim)]">
          <Bilingual
            zh={`已选猎人：${selectedHunter ? `${selectedHunter.seat}号` : '无'}`}
            en={`Selected hunter: ${selectedHunter ? `Seat ${selectedHunter.seat}` : 'None'}`}
            small
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors" onClick={onBack}>
          <Bilingual zh="上一步" en="Back" small />
        </button>
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
