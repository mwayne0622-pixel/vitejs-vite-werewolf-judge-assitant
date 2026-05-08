import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  players: Player[];
  draftBearOwnerId: number | null;
  selectablePlayers: Player[];
  canGoNext: boolean;
  onSelectBear: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightBearScreen({
  players,
  draftBearOwnerId,
  selectablePlayers,
  canGoNext,
  onSelectBear,
  onBack,
  onNext,
}: Props) {
  const selectedBear = draftBearOwnerId !== null ? players.find((p) => p.id === draftBearOwnerId) ?? null : null;

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="第一夜：熊" en="First night: Bear" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>熊请睁眼。<br />请确认你的身份。</>}
            en={<>Bear, please open your eyes.<br />Confirm your identity.</>}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="先选中谁是熊，点击下一步后才保存" en="Choose who the Bear is. It is saved only when you click Next." small />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftBearOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => onSelectBear(player.id)}
              />
            );
          })}
        </div>
        <div className="mt-2 text-xs text-[var(--color-moon-dim)]">
          <Bilingual
            zh={`已选熊：${selectedBear ? `${selectedBear.seat}号` : '无'}`}
            en={`Selected Bear: ${selectedBear ? `Seat ${selectedBear.seat}` : 'None'}`}
            small
          />
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
        <Bilingual
          zh="每天白天宣布死讯后，若熊左右相邻的存活玩家中存在狼人，则熊会咆哮。"
          en="After the night result is announced, if at least one of the Bear's adjacent alive players is a wolf, the Bear roars."
          small
        />
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
