import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  alivePlayers: Player[];
  wolfBeautyPlayer: Player | null;
  wolfBeautyCharmTargetId: number | null;
  lastWolfBeautyCharmTargetId: number | null;
  wolfBeautyIsDead: boolean;
  onSelectCharmTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function NightWolfBeautyScreen({
  alivePlayers,
  wolfBeautyPlayer,
  wolfBeautyCharmTargetId,
  lastWolfBeautyCharmTargetId,
  wolfBeautyIsDead,
  onSelectCharmTarget,
  onBack,
  onNext,
}: Props) {
  const selectableTargets = alivePlayers.filter((player) => {
    if (wolfBeautyPlayer && player.id === wolfBeautyPlayer.id) return false;
    if (player.id === lastWolfBeautyCharmTargetId) return false;
    return true;
  });
  const selectedTarget = wolfBeautyCharmTargetId !== null ? alivePlayers.find((p) => p.id === wolfBeautyCharmTargetId) ?? null : null;
  const isDisabled = wolfBeautyIsDead || !wolfBeautyPlayer;

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="夜晚：狼美人魅惑" en="Night: Wolf Beauty charms" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>狼美人请睁眼。<br />请选择今晚你要魅惑的玩家。</>}
            en={<>Wolf Beauty, please open your eyes.<br />Choose the player you want to charm tonight.</>}
          />
        </div>
      </div>

      {wolfBeautyIsDead && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)] text-xs">
          <Bilingual zh="狼美人已死亡，本夜无实际操作。法官可继续宣读流程。" en="The Wolf Beauty is dead. No real action tonight. The judge may still read the process aloud." small />
        </div>
      )}

      {!wolfBeautyIsDead && wolfBeautyPlayer && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
          <Bilingual
            zh={`${wolfBeautyPlayer.seat}号狼美人请选择一名玩家进行魅惑。不能连续两晚魅惑同一名玩家。`}
            en={`Wolf Beauty at Seat ${wolfBeautyPlayer.seat} chooses one player to charm. The same player cannot be charmed on two consecutive nights.`}
            small
          />
        </div>
      )}

      {!wolfBeautyIsDead && !wolfBeautyPlayer && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)] text-xs">
          <Bilingual zh="本局尚未确认狼美人身份，本夜无实际操作。" en="The Wolf Beauty has not been confirmed in this game. No real action tonight." small />
        </div>
      )}

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="选择魅惑目标" en="Choose charm target" small />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectableTargets.map((player) => {
            const selected = wolfBeautyCharmTargetId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                showRole
                disabled={isDisabled}
                onClick={() => { if (!isDisabled) onSelectCharmTarget(player.id); }}
              />
            );
          })}
        </div>
      </div>

      {lastWolfBeautyCharmTargetId !== null && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber-border)] text-[var(--color-amber-wolf)] text-xs">
          <Bilingual
            zh={`上一次魅惑目标：${alivePlayers.find((p) => p.id === lastWolfBeautyCharmTargetId)?.seat ?? ''}号，本夜不可再次选择。`}
            en={`Previous charm target: Seat ${alivePlayers.find((p) => p.id === lastWolfBeautyCharmTargetId)?.seat ?? ''}. This player cannot be chosen again tonight.`}
            small
          />
        </div>
      )}

      {selectedTarget && (
        <div className="mt-4 p-3.5 rounded-xl bg-[#0c1a2e] border border-[#1e3a5f] text-[#93c5fd] text-xs">
          <Bilingual zh={`本夜魅惑目标：${selectedTarget.seat}号`} en={`Charm target tonight: Seat ${selectedTarget.seat}`} small />
        </div>
      )}

      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
        <Bilingual
          zh="提示：狼美人若因投票、女巫毒药或猎人开枪出局，最后一次被魅惑的玩家会随之殉情；若被狼人刀死则不触发。"
          en="Note: If the Wolf Beauty is voted out, poisoned by the Witch, or shot by the Hunter, the last charmed player dies with her. If killed by the wolf attack, this does not trigger."
          small
        />
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button type="button" className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors" onClick={onBack}>
          <Bilingual zh="上一步" en="Back" small />
        </button>
        <button type="button" className="px-4 py-3 rounded-xl font-bold text-sm border-none bg-[var(--color-blood)] text-white cursor-pointer hover:brightness-110 transition-all shadow-[var(--shadow-glow-blood)]" onClick={onNext}>
          <Bilingual zh="下一步" en="Next" small />
        </button>
      </div>
    </section>
  );
}
