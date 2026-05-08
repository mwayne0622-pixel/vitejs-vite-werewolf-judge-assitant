import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  players: Player[];
  draftGuardOwnerId: number | null;
  guardTargetId: number | null;
  selectablePlayers: Player[];
  alivePlayers: Player[];
  canGoNext: boolean;
  onSelectGuard: (playerId: number) => void;
  onSelectTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightGuardScreen({
  players,
  draftGuardOwnerId,
  guardTargetId,
  selectablePlayers,
  alivePlayers,
  canGoNext,
  onSelectGuard,
  onSelectTarget,
  onBack,
  onNext,
}: Props) {
  const selectedGuard = draftGuardOwnerId !== null ? players.find((p) => p.id === draftGuardOwnerId) ?? null : null;

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="5. 第一夜：守卫" en="First night: Guard" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>守卫请睁眼。<br />请确认你的身份。<br />请选择今晚你要守护的玩家。</>}
            en={<>Guard, please open your eyes.<br />Confirm your identity.<br />Choose the player you want to guard tonight.</>}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="先选中谁是守卫，点击下一步后才保存" en="Choose the guard first. It is saved only when you click Next." small />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftGuardOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => onSelectGuard(player.id)}
              />
            );
          })}
        </div>
        <div className="mt-2 text-xs text-[var(--color-moon-dim)]">
          <Bilingual
            zh={`已选守卫：${selectedGuard ? `${selectedGuard.seat}号` : '无'}`}
            en={`Selected guard: ${selectedGuard ? `Seat ${selectedGuard.seat}` : 'None'}`}
            small
          />
        </div>
      </div>

      <div className="mt-5">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="选择守护目标" en="Choose a player to guard" small />
        </div>
        <div className="flex flex-wrap gap-2">
          {alivePlayers.map((player) => {
            const selected = guardTargetId === player.id;
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
