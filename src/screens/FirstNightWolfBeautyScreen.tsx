import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  players: Player[];
  selectablePlayers: Player[];
  alivePlayers: Player[];
  draftWolfBeautyOwnerId: number | null;
  wolfBeautyCharmTargetId: number | null;
  canGoNext: boolean;
  onSelectWolfBeauty: (playerId: number) => void;
  onSelectCharmTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightWolfBeautyScreen({
  players,
  selectablePlayers,
  alivePlayers,
  draftWolfBeautyOwnerId,
  wolfBeautyCharmTargetId,
  canGoNext,
  onSelectWolfBeauty,
  onSelectCharmTarget,
  onBack,
  onNext,
}: Props) {
  const selectedWolfBeauty = draftWolfBeautyOwnerId !== null ? players.find((p) => p.id === draftWolfBeautyOwnerId) ?? null : null;
  const selectedCharmTarget = wolfBeautyCharmTargetId !== null ? players.find((p) => p.id === wolfBeautyCharmTargetId) ?? null : null;
  const charmTargets = alivePlayers.filter((player) => player.id !== draftWolfBeautyOwnerId);

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="确认狼美人" en="Confirm Wolf Beauty" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>狼美人请睁眼。<br />请确认你的身份。<br />请指出今晚你要魅惑的对象。</>}
            en={<>Wolf Beauty, please open your eyes.<br />Confirm your identity.<br />Choose the player you want to charm tonight.</>}
          />
        </div>
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
        <Bilingual
          zh="请从已选中的狼人中，再指定 1 名玩家为狼美人。狼美人属于狼人阵营，占用一个狼位。第一夜也需要同时选择魅惑目标。"
          en="Please choose 1 player from the selected wolves to be the Wolf Beauty. The Wolf Beauty belongs to the wolf camp and occupies one wolf slot. On the first night, also choose a charm target."
          small
        />
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-3">
          <Bilingual zh="当前狼人名单" en="Current wolf list" small />
        </div>
        <div className="flex flex-col gap-2.5">
          {selectablePlayers.map((player) => {
            const selected = draftWolfBeautyOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                sublabel={selected ? '已设为狼美人 · Selected as Wolf Beauty' : '点击设为狼美人 · Click to assign'}
                onClick={() => onSelectWolfBeauty(player.id)}
              />
            );
          })}
        </div>
      </div>

      {selectedWolfBeauty && (
        <div className="mt-3 p-3 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border-hi)] text-[var(--color-moon)] text-xs">
          <Bilingual zh={`当前选择：${selectedWolfBeauty.seat}号为狼美人`} en={`Current selection: Seat ${selectedWolfBeauty.seat} as Wolf Beauty`} small />
        </div>
      )}

      <div className="mt-5">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="第一夜魅惑目标" en="First night charm target" small />
        </div>
        <div className="mt-2 p-3.5 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber-border)] text-[var(--color-amber-wolf)] text-xs mb-3">
          <Bilingual
            zh="请选择狼美人第一夜魅惑的玩家。魅惑目标不会立即死亡，只有狼美人因投票、女巫毒药或猎人开枪出局时，最后一次被魅惑的玩家才会殉情。"
            en="Choose the Wolf Beauty's first-night charm target. The target does not die immediately. If the Wolf Beauty is later voted out, poisoned, or shot by the Hunter, the last charmed player dies with her."
            small
          />
        </div>
        <div className="flex flex-col gap-2.5">
          {charmTargets.map((player) => {
            const selected = wolfBeautyCharmTargetId === player.id;
            const disabled = draftWolfBeautyOwnerId === null;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                disabled={disabled}
                sublabel={selected ? '已设为魅惑目标 · Selected as charm target' : '点击设为魅惑目标 · Click to charm'}
                onClick={() => { if (!disabled) onSelectCharmTarget(player.id); }}
              />
            );
          })}
        </div>
      </div>

      {selectedCharmTarget && (
        <div className="mt-3 p-3 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border-hi)] text-[var(--color-moon)] text-xs">
          <Bilingual zh={`当前魅惑目标：${selectedCharmTarget.seat}号`} en={`Current charm target: Seat ${selectedCharmTarget.seat}`} small />
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
