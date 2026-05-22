import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  alivePlayers: Player[];
  wolfBeautyPlayer: Player | null;
  wolfBeautyCharmTargetId: number | null;
  lastWolfBeautyCharmTargetId: number | null;
  wolfBeautyIsDead: boolean;
  onSelectCharmTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function NightWolfBeautyScreen({
  alivePlayers,
  wolfBeautyPlayer,
  wolfBeautyCharmTargetId,
  lastWolfBeautyCharmTargetId,
  wolfBeautyIsDead,
  onSelectCharmTarget,
  onBack,
  onNext,
}: Props) {
  const selectableTargets = alivePlayers.filter((player) => {
    if (wolfBeautyPlayer && player.id === wolfBeautyPlayer.id) return false;
    if (player.id === lastWolfBeautyCharmTargetId) return false;
    return true;
  });
  const isDisabled = wolfBeautyIsDead || !wolfBeautyPlayer;

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
              { zh: '请选择今晚你要魅惑的玩家。', en: 'Choose the player you want to charm tonight.' },
            ]}
          />
        </div>
      </div>

      {wolfBeautyIsDead && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)] text-xs">
          <Bilingual zh="狼美人已死亡，本夜无实际操作。法官可继续宣读流程。" en="The Wolf Beauty is dead. No real action tonight. The judge may still read the process aloud." small />
        </div>
      )}

      {!wolfBeautyIsDead && !wolfBeautyPlayer && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)] text-xs">
          <Bilingual zh="本局尚未确认狼美人身份，本夜无实际操作。" en="The Wolf Beauty has not been confirmed in this game. No real action tonight." small />
        </div>
      )}

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {selectableTargets.map((player) => {
            const selected = wolfBeautyCharmTargetId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                showRole
                nightCompactRole
                disabled={isDisabled}
                onClick={() => { if (!isDisabled) handleSelectCharmTarget(player.id); }}
              />
            );
          })}
        </div>
      </div>

      {lastWolfBeautyCharmTargetId !== null && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber-border)] text-[var(--color-amber-wolf)] text-xs">
          <Bilingual
            zh={`上一次魅惑目标：${alivePlayers.find((p) => p.id === lastWolfBeautyCharmTargetId)?.seat ?? ''}号，本夜不可再次选择。`}
            en={`Previous charm target: Seat ${alivePlayers.find((p) => p.id === lastWolfBeautyCharmTargetId)?.seat ?? ''}. This player cannot be chosen again tonight.`}
            small
          />
        </div>
      )}

      <div className="mt-4 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines lines={[{ zh: '狼美人请闭眼。', en: 'Wolf Beauty, please close your eyes.' }]} />
        </div>
      </div>

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
