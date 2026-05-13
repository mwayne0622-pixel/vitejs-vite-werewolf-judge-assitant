import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
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
  const checkedPlayer = players.find((p) => p.id === seerCheckId);
  const checkedIsWolfTeam = checkedPlayer ? isWolf(checkedPlayer.role) : false;

  function speakSeerLine(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleSelectSeer(playerId: number) {
    onSelectSeer(playerId);
    speakSeerLine('预言家到位，今晚我来开盲盒，看看谁是狼人。');
  }

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '预言家请睁眼。', en: 'Seer, please open your eyes.' },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftSeerOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => handleSelectSeer(player.id)}
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
                { zh: '请指出今晚你要查验的玩家。', en: 'Choose the player you want to check tonight.' },
              ]}
            />
          </div>
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
