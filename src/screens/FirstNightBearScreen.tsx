import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  players: Player[];
  draftBearOwnerId: number | null;
  selectablePlayers: Player[];
  canGoNext: boolean;
  onSelectBear: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightBearScreen({
  players: _players,
  draftBearOwnerId,
  selectablePlayers,
  canGoNext,
  onSelectBear,
  onBack,
  onNext,
}: Props) {
  function speakBearLine(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 0.9;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleSelectBear(playerId: number) {
    onSelectBear(playerId);
    speakBearLine('熊已到岗，今晚谁敢靠近我家门口，嗷呜嗷呜。');
  }

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '熊请睁眼。', en: 'Bear, please open your eyes.' },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftBearOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => handleSelectBear(player.id)}
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
