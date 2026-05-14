import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  aliveTargets: Player[];
  selectedTargetId: number | null;
  onSelectTarget: (playerId: number) => void;
  onSkip: () => void;
  onConfirm: () => void;
};

export default function HunterShootScreen({
  aliveTargets,
  selectedTargetId,
  onSelectTarget,
  onSkip,
  onConfirm,
}: Props) {
  const canConfirm = selectedTargetId !== null;

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 1.02;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleSelectTarget(player: Player) {
    speakChinese(`猎人举枪锁定${player.seat}号：我人是倒了，准头还在线。今夜这枪，算你中奖了。`);
    onSelectTarget(player.id);
  }

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '请选择是否开枪，并指定一名存活玩家。', en: 'Choose whether to shoot, and name one alive player.' },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="选择带走目标" en="Choose a target to shoot" small />
        </div>
        <div className="flex flex-wrap gap-2">
          {aliveTargets.map((player) => {
            const selected = selectedTargetId === player.id;
            return (
                <PlayerSelectButton
                  key={player.id}
                  player={player}
                  selected={selected}
                  onClick={() => handleSelectTarget(player)}
                />
              );
            })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors" onClick={onSkip}>
          <Bilingual zh="不开枪" en="Skip" small />
        </button>
        <button
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canConfirm ? 'bg-[var(--color-blood)] text-white hover:brightness-110 shadow-[var(--shadow-glow-blood)]' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          <Bilingual zh="确认开枪" en="Confirm shot" small />
        </button>
      </div>
    </section>
  );
}
