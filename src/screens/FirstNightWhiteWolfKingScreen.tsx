import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  players: Player[];
  selectablePlayers: Player[];
  draftWhiteWolfKingOwnerId: number | null;
  canGoNext: boolean;
  onSelectWhiteWolfKing: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightWhiteWolfKingScreen({
  players,
  selectablePlayers,
  draftWhiteWolfKingOwnerId,
  canGoNext,
  onSelectWhiteWolfKing,
  onBack,
  onNext,
}: Props) {
  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="确认白狼王" en="Confirm White Wolf King" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>白狼王请睁眼。<br />请确认你的身份。</>}
            en={<>White Wolf King, please open your eyes.<br />Confirm your identity.</>}
          />
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
        <Bilingual
          zh="请从已选中的狼人中，再指定 1 名玩家为白狼王。白狼王属于狼人阵营，占用一个狼位。"
          en="Please choose 1 player from the selected wolves to be the White Wolf King. The White Wolf King belongs to the wolf camp and occupies one wolf slot."
          small
        />
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-3">
          <Bilingual zh="当前狼人名单" en="Current wolf list" small />
        </div>
        <div className="flex flex-col gap-2.5">
          {selectablePlayers.map((player) => {
            const selected = draftWhiteWolfKingOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                sublabel={selected ? '已设为白狼王 · Selected as White Wolf King' : '点击设为白狼王 · Click to assign'}
                onClick={() => onSelectWhiteWolfKing(player.id)}
              />
            );
          })}
        </div>
      </div>

      {draftWhiteWolfKingOwnerId !== null && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border-hi)] text-[var(--color-moon)] text-xs">
          <Bilingual
            zh={`当前选择：${players.find((p) => p.id === draftWhiteWolfKingOwnerId)?.seat ?? ''}号为白狼王`}
            en={`Current selection: Seat ${players.find((p) => p.id === draftWhiteWolfKingOwnerId)?.seat ?? ''} as White Wolf King`}
            small
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-5">
        <button type="button" className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors" onClick={onBack}>
          <Bilingual zh="返回" en="Back" small />
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
