import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  players: Player[];
  selectablePlayers: Player[];
  alivePlayers: Player[];
  draftWolfBeautyOwnerId: number | null;
  wolfBeautyCharmTargetId: number | null;
  canGoNext: boolean;
  onSelectWolfBeauty: (playerId: number) => void;
  onSelectCharmTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightWolfBeautyScreen({
  players: _players,
  selectablePlayers,
  alivePlayers,
  draftWolfBeautyOwnerId,
  wolfBeautyCharmTargetId,
  canGoNext,
  onSelectWolfBeauty,
  onSelectCharmTarget,
  onBack,
  onNext,
}: Props) {
  const charmTargets = alivePlayers.filter((player) => player.id !== draftWolfBeautyOwnerId);

  function speakWolfBeautyLine(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 1.08;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleSelectWolfBeauty(playerId: number) {
    onSelectWolfBeauty(playerId);
    speakWolfBeautyLine('狼美人登场，今晚全场看我眼色。');
  }

  function handleSelectCharmTarget(playerId: number) {
    onSelectCharmTarget(playerId);
    speakWolfBeautyLine('就你了，今晚先心动，明天再心碎。');
  }

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '狼美人请睁眼。', en: 'Wolf Beauty, please open your eyes.' },
            ]}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-3">
          <Bilingual zh="当前狼人名单" en="Current wolf list" small />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftWolfBeautyOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => handleSelectWolfBeauty(player.id)}
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
                { zh: '请指出今晚你要魅惑的对象。', en: 'Choose the player you want to charm tonight.' },
              ]}
            />
          </div>
        </div>

        <div className="mt-2 p-3.5 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber-border)] text-[var(--color-amber-wolf)] text-xs mb-3">
          <Bilingual
            zh="请选择狼美人第一夜魅惑的玩家。魅惑目标不会立即死亡，只有狼美人因投票、女巫毒药或猎人开枪出局时，最后一次被魅惑的玩家才会殉情。"
            en="Choose the Wolf Beauty's first-night charm target. The target does not die immediately. If the Wolf Beauty is later voted out, poisoned, or shot by the Hunter, the last charmed player dies with her."
            small
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {charmTargets.map((player) => {
            const selected = wolfBeautyCharmTargetId === player.id;
            const disabled = draftWolfBeautyOwnerId === null;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                disabled={disabled}
                onClick={() => { if (!disabled) handleSelectCharmTarget(player.id); }}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button type="button" className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors" onClick={onBack}>
          <Bilingual zh="返回" en="Back" small />
        </button>
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
