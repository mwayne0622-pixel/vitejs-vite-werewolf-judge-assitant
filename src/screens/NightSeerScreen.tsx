import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
import type { Player } from '../types';
import { isWolf } from '../utils/roleUtils';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  alivePlayers: Player[];
  seerCheckId: number | null;
  seerIsDead: boolean;
  checkedPlayer: Player | null;
  onSelectCheckTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function NightSeerScreen({
  alivePlayers,
  seerCheckId,
  seerIsDead,
  checkedPlayer,
  onSelectCheckTarget,
  onBack,
  onNext,
}: Props) {
  const checkedIsWolfTeam = checkedPlayer ? isWolf(checkedPlayer.role) : false;

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="夜晚：预言家行动" en="Night: Seer acts" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '预言家请睁眼。', en: 'Seer, please open your eyes.' },
              { zh: '请选择今晚你要查验的玩家。', en: 'Choose the player you want to check tonight.' },
            ]}
          />
        </div>
      </div>

      {seerIsDead && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)] text-xs">
          <Bilingual
            zh="预言家已死亡，本夜无实际操作。法官可继续宣读流程。"
            en="The seer is dead. No real action tonight. The judge may still read the process aloud."
            small
          />
        </div>
      )}

      <div className="mt-4">
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
                showRole
                nightCompactRole
                disabled={seerIsDead}
                onClick={() => { if (!seerIsDead) onSelectCheckTarget(player.id); }}
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
