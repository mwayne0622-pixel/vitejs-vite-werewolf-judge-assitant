import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
import JudgeScriptLines from '../components/JudgeScriptLines';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  wolfTarget: Player | null;
  witchIsDead: boolean;
  witchSave: boolean;
  witchPoisonId: number | null;
  witchSaveUsed: boolean;
  witchPoisonUsed: boolean;
  laterNightSaveDisabled: boolean;
  laterNightPoisonDisabled: boolean;
  alivePlayers: Player[];
  onToggleSave: (checked: boolean) => void;
  onSelectPoison: (playerId: number | null) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function NightWitchScreen({
  wolfTarget,
  witchIsDead,
  witchSave,
  witchPoisonId,
  witchSaveUsed,
  witchPoisonUsed,
  laterNightSaveDisabled,
  laterNightPoisonDisabled,
  alivePlayers,
  onToggleSave,
  onSelectPoison,
  onBack,
  onNext,
}: Props) {
  const tonightTargetText = wolfTarget ? `${wolfTarget.seat}号` : '未选择';

  function speakWitchLine(text: string) {
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

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '女巫请睁眼。', en: 'Witch, please open your eyes.' },
            ]}
          />
        </div>
      </div>

      {witchIsDead && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)] text-xs">
          <Bilingual zh="女巫已死亡，本夜无实际操作。法官可继续宣读流程。" en="The witch is dead. No real action tonight. The judge may still read the process aloud." small />
        </div>
      )}

      {!witchSaveUsed ? (
        <div className="mt-4 p-3.5 rounded-xl bg-[#0c1a2e] border border-[#1e3a5f] text-[#93c5fd] text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[var(--color-moon-bright)] font-semibold">今晚刀口</span>
            <button
              type="button"
              className="px-1.5 py-0.5 rounded-md border border-[#6366f1] text-xs text-[#a5b4fc] hover:bg-[#312e81] transition-colors"
              onClick={() => speakWitchLine('今晚刀口')}
              aria-label="朗读：今晚刀口"
              title="朗读今晚刀口"
            >
              🔊
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xl leading-none" aria-label="静音提示" title="静音提示">
              🔇
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-[#60a5fa] bg-[#172554] text-[#bfdbfe] font-black text-base tracking-wide shadow-[0_0_12px_rgba(96,165,250,0.35)]">
              {tonightTargetText}
            </span>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
          <Bilingual zh="刀口已隐藏。法官仍按正常节奏询问解药与毒药。" en="Target is hidden. Keep the normal speaking rhythm for antidote and poison." small />
        </div>
      )}

      <div className="mt-4 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '你有一瓶解药，今晚是否使用？', en: 'You have one antidote. Will you use it tonight?' },
            ]}
          />
        </div>
      </div>

      <div className={`mt-4 transition-opacity ${laterNightSaveDisabled ? 'opacity-50' : ''}`}>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={laterNightSaveDisabled}
            className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${witchSave ? 'bg-[var(--color-blood)] border-[var(--color-blood)] text-white' : 'bg-[var(--color-wolf-card-alt)] border-[var(--color-wolf-border-hi)] text-[var(--color-moon)]'} ${laterNightSaveDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-blood)]'}`}
            onClick={() => onToggleSave(true)}
          >
            <Bilingual zh="使用解药" en="Use antidote" small />
          </button>
          <button
            type="button"
            disabled={laterNightSaveDisabled}
            className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${!witchSave ? 'bg-[var(--color-blood)] border-[var(--color-blood)] text-white' : 'bg-[var(--color-wolf-card-alt)] border-[var(--color-wolf-border-hi)] text-[var(--color-moon)]'} ${laterNightSaveDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-blood)]'}`}
            onClick={() => onToggleSave(false)}
          >
            <Bilingual zh="不使用解药" en="Do not use antidote" small />
          </button>
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <JudgeScriptLines
            lines={[
              { zh: '你有一瓶毒药，今晚是否使用？', en: 'You have one poison. Will you use it tonight?' },
              { zh: '你要毒谁？', en: 'Who do you want to poison?' },
            ]}
          />
        </div>
      </div>

      <div className={`mt-5 transition-opacity ${laterNightPoisonDisabled ? 'opacity-50' : ''}`}>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={laterNightPoisonDisabled}
            className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${witchPoisonId === null ? 'bg-[var(--color-blood)] border-[var(--color-blood)] text-white' : 'bg-[var(--color-wolf-card-alt)] border-[var(--color-wolf-border-hi)] text-[var(--color-moon)]'} ${laterNightPoisonDisabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-blood)]'}`}
            onClick={() => { if (!laterNightPoisonDisabled) onSelectPoison(null); }}
          >
            <Bilingual zh="不使用毒药" en="Do not use poison" small />
          </button>
          {alivePlayers.map((player) => {
            const selected = witchPoisonId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                showRole
                nightCompactRole
                disabled={laterNightPoisonDisabled}
                onClick={() => { if (!laterNightPoisonDisabled) onSelectPoison(player.id); }}
              />
            );
          })}
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
