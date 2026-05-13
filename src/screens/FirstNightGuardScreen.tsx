import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
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
  players: _players,
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
  function speakGuardLine(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 0.96;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleSelectGuard(playerId: number) {
    onSelectGuard(playerId);
    speakGuardLine('守卫已就位，今夜我站岗，狼人先排队。');
  }

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '守卫请睁眼。', en: 'Guard, please open your eyes.' },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftGuardOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => handleSelectGuard(player.id)}
              />
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <div className="mt-3.5 mb-5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
          <JudgeScriptHeader />
          <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
            <JudgeScriptLines
              lines={[
                { zh: '请选择今晚你要守护的玩家。', en: 'Choose the player you want to guard tonight.' },
              ]}
            />
          </div>
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
