import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';
import { isWolf } from '../utils/roleUtils';

type Props = {
  knightPlayer: Player;
  duelTargets: Player[];
  selectedTargetId: number | null;
  onSelectTarget: (playerId: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function KnightDuelScreen({
  knightPlayer,
  duelTargets,
  selectedTargetId,
  onSelectTarget,
  onConfirm,
  onCancel,
}: Props) {
  const selectedTarget = duelTargets.find((p) => p.id === selectedTargetId) ?? null;
  const canConfirm = selectedTargetId !== null;

  const targetIsWolf = selectedTarget !== null && isWolf(selectedTarget.role);

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleSelectTarget(player: Player) {
    speakChinese(`骑士${knightPlayer.seat}号指向${player.seat}号，发起决斗！`);
    onSelectTarget(player.id);
  }

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              {
                zh: `骑士 ${knightPlayer.seat}号 发动决斗！选择决斗目标：`,
                en: `Knight (Seat ${knightPlayer.seat}) initiates a duel! Select a target:`,
              },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="选择决斗对象（全部存活玩家）" en="Select a target (all alive players)" small />
        </div>
        <div className="flex flex-wrap gap-2">
          {duelTargets.map((player) => {
            const selected = selectedTargetId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                showRole
                nightCompactRole
                onClick={() => handleSelectTarget(player)}
              />
            );
          })}
        </div>
      </div>

      {selectedTarget && (
        <div className={`mt-4 p-3.5 rounded-xl border text-sm font-semibold ${
          targetIsWolf
            ? 'bg-[var(--color-blood-dim)] border-[var(--color-blood)] text-[var(--color-moon-bright)]'
            : 'bg-[#0f2d1a] border-[#166534] text-[#bbf7d0]'
        }`}>
          {targetIsWolf ? (
            <Bilingual
              zh={`决斗成功：${selectedTarget.seat}号是${selectedTarget.role}，将被刺杀出局，白天立即结束，进入夜晚`}
              en={`Duel success: Seat ${selectedTarget.seat} is ${selectedTarget.role} — slain immediately, day ends, night begins`}
              small
            />
          ) : (
            <Bilingual
              zh={`决斗失败：${selectedTarget.seat}号是${selectedTarget.role ?? '未知'}，骑士${knightPlayer.seat}号出局，投票继续`}
              en={`Duel failed: Seat ${selectedTarget.seat} is ${selectedTarget.role ?? 'unknown'} — Knight (Seat ${knightPlayer.seat}) is eliminated, voting continues`}
              small
            />
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          type="button"
          className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors"
          onClick={onCancel}
        >
          <Bilingual zh="取消决斗" en="Cancel" small />
        </button>
        <button
          type="button"
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canConfirm ? 'bg-[var(--color-blood)] text-white hover:brightness-110 shadow-[var(--shadow-glow-blood)]' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canConfirm}
          onClick={() => {
            if (selectedTarget) {
              if (targetIsWolf) {
                speakChinese(`骑士翻牌决斗！${selectedTarget.seat}号确认是${selectedTarget.role}，被骑士当场刺杀出局，白天立即结束，所有人请闭眼，进入黑夜。`);
              } else {
                speakChinese(`骑士翻牌决斗！${selectedTarget.seat}号不是狼人阵营，骑士决斗失败，骑士${knightPlayer.seat}号出局，白天继续发言投票。`);
              }
            }
            onConfirm();
          }}
        >
          <Bilingual zh="确认决斗" en="Confirm duel" small />
        </button>
      </div>
    </section>
  );
}
