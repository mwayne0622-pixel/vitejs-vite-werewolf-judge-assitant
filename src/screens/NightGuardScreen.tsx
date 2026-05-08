import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  alivePlayers: Player[];
  guardTargetId: number | null;
  guardIsDead: boolean;
  lastGuardTargetId: number | null;
  onSelectTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function NightGuardScreen({
  alivePlayers,
  guardTargetId,
  guardIsDead,
  lastGuardTargetId,
  onSelectTarget,
  onBack,
  onNext,
}: Props) {
  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="夜晚：守卫行动" en="Night: Guard acts" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>守卫请睁眼。<br />请选择今晚你要守护的玩家。</>}
            en={<>Guard, please open your eyes.<br />Choose the player you want to guard tonight.</>}
          />
        </div>
      </div>

      {guardIsDead && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)] text-xs">
          <Bilingual
            zh="守卫已死亡，本夜无实际操作。法官可继续宣读流程。"
            en="The guard is dead. No real action tonight. The judge may still read the process aloud."
            small
          />
        </div>
      )}

      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
        <Bilingual zh="守卫不能连续两晚守同一人。" en="The guard cannot protect the same player on two consecutive nights." small />
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {alivePlayers.map((player) => {
          const disabled = guardIsDead || player.id === lastGuardTargetId;
          const selected = guardTargetId === player.id;
          return (
            <PlayerSelectButton
              key={player.id}
              player={player}
              selected={selected}
              showRole
              disabled={disabled}
              disabledNote={player.id === lastGuardTargetId ? '上夜已守 · protected last night' : undefined}
              onClick={() => { if (!disabled) onSelectTarget(player.id); }}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button type="button" className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors" onClick={onBack}>
          <Bilingual zh="上一步" en="Back" small />
        </button>
        <button type="button" className="px-4 py-3 rounded-xl font-bold text-sm border-none bg-[var(--color-blood)] text-white cursor-pointer hover:brightness-110 transition-all shadow-[var(--shadow-glow-blood)]" onClick={onNext}>
          <Bilingual zh="天亮结算" en="Go to day result" small />
        </button>
      </div>
    </section>
  );
}
