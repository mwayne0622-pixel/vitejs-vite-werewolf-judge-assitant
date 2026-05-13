import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  alivePlayers: Player[];
  wolfTargetId: number | null;
  canGoNext: boolean;
  onSelectTarget: (playerId: number) => void;
  onNext: () => void;
};

export default function NightWolfScreen({
  alivePlayers,
  wolfTargetId,
  canGoNext,
  onSelectTarget,
  onNext,
}: Props) {
  function playDeadVoiceEffect() {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance('嘿嘿，今晚就刀你了。');
    utterance.lang = 'zh-CN';
    utterance.rate = 0.92;
    utterance.pitch = 0.9;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleSelectTarget(playerId: number) {
    onSelectTarget(playerId);
    playDeadVoiceEffect();
  }

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '狼人请睁眼。', en: 'Wolves, please open your eyes.' },
              { zh: '请选择今晚要袭击的玩家。', en: "Choose tonight's target." },
            ]}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {alivePlayers.map((player) => {
          const selected = wolfTargetId === player.id;
          return (
            <PlayerSelectButton
              key={player.id}
              player={player}
              selected={selected}
              showRole
              nightCompactRole
              onClick={() => handleSelectTarget(player.id)}
            />
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
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
