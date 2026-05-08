import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import { isWolf } from '../utils/roleUtils';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  players: Player[];
  draftSeerOwnerId: number | null;
  seerCheckId: number | null;
  selectablePlayers: Player[];
  alivePlayers: Player[];
  canGoNext: boolean;
  onSelectSeer: (playerId: number) => void;
  onSelectCheckTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightSeerScreen({
  players,
  draftSeerOwnerId,
  seerCheckId,
  selectablePlayers,
  alivePlayers,
  canGoNext,
  onSelectSeer,
  onSelectCheckTarget,
  onBack,
  onNext,
}: Props) {
  const selectedSeer = players.find((p) => p.id === draftSeerOwnerId);
  const checkedPlayer = players.find((p) => p.id === seerCheckId);
  const checkedIsWolfTeam = checkedPlayer ? isWolf(checkedPlayer.role) : false;

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="3. 第一夜：预言家" en="First night: Seer" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>预言家请睁眼。<br />请确认你的身份。<br />请指出今晚你要查验的玩家。</>}
            en={<>Seer, please open your eyes.<br />Confirm your identity.<br />Choose the player you want to check tonight.</>}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="先选中谁是预言家，点击下一步后才保存" en="Choose the seer first. It is saved only when you click Next." small />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftSeerOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => onSelectSeer(player.id)}
              />
            );
          })}
        </div>
        <div className="mt-2 text-xs text-[var(--color-moon-dim)]">
          <Bilingual
            zh={`已选预言家：${selectedSeer ? `${selectedSeer.seat}号` : '无'}`}
            en={`Selected seer: ${selectedSeer ? `Seat ${selectedSeer.seat}` : 'None'}`}
            small
          />
        </div>
      </div>

      <div className="mt-5">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="选择查验目标" en="Choose a player to check" small />
        </div>
        <div className="flex flex-wrap gap-2">
          {alivePlayers.map((player) => {
            const selected = seerCheckId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => onSelectCheckTarget(player.id)}
              />
            );
          })}
        </div>
      </div>

      {checkedPlayer && (
        <div className={`mt-4 p-4 rounded-xl border flex items-center justify-between gap-4 font-bold ${checkedIsWolfTeam ? 'bg-[var(--color-blood-dim)] border-[var(--color-blood)] text-[var(--color-dead-text)]' : 'bg-[var(--color-alive-bg)] border-[var(--color-alive-border)] text-[var(--color-alive-text)]'}`}>
          <div>
            <div>查验结果：{checkedPlayer.seat}号 是 {checkedIsWolfTeam ? '狼人阵营' : '好人阵营'}</div>
            <div className="mt-1 text-xs opacity-85 font-medium">Result: Seat {checkedPlayer.seat} is {checkedIsWolfTeam ? 'wolf team' : 'good team'}</div>
          </div>
          <span className="text-2xl">{checkedIsWolfTeam ? '👎' : '👍'}</span>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors"
          onClick={onBack}
        >
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
