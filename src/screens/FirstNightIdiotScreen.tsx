import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  players: Player[];
  draftIdiotOwnerId: number | null;
  selectablePlayers: Player[];
  canGoNext: boolean;
  onSelectIdiot: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightIdiotScreen({
  players,
  draftIdiotOwnerId,
  selectablePlayers,
  canGoNext,
  onSelectIdiot,
  onBack,
  onNext,
}: Props) {
  const selectedIdiot = players.find((p) => p.id === draftIdiotOwnerId);

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="第一夜：白痴" en="First night: Idiot" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>白痴请睁眼。<br />请确认你的身份。</>}
            en={<>Idiot, please open your eyes.<br />Confirm your identity.</>}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="先选中谁是白痴，点击下一步后才保存" en="Choose who the Idiot is first. It is saved only when you click Next." small />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftIdiotOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => onSelectIdiot(player.id)}
              />
            );
          })}
        </div>
        <div className="mt-2 text-xs text-[var(--color-moon-dim)]">
          <Bilingual
            zh={`已选白痴：${selectedIdiot ? `${selectedIdiot.seat}号` : '无'}`}
            en={`Selected idiot: ${selectedIdiot ? `Seat ${selectedIdiot.seat}` : 'None'}`}
            small
          />
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
        <Bilingual
          zh="白痴仅在白天投票被放逐时可翻牌免于出局；若夜晚死亡、被猎人带走或被白狼王自爆带走，则直接死亡。"
          en="The Idiot only reveals and survives when voted out during the day. If killed at night, shot by the Hunter, or taken down by the White Wolf King, the Idiot dies immediately."
          small
        />
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button type="button" className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors" onClick={onBack}>
          <Bilingual zh="上一步" en="Back" small />
        </button>
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
