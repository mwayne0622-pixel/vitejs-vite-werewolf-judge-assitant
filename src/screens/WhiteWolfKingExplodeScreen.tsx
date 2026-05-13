import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  whiteWolfKingPlayer: Player;
  targets: Player[];
  selectedTargetId: number | null;
  onSelectTarget: (id: number) => void;
  onBack: () => void;
  onConfirm: () => void;
};

export default function WhiteWolfKingExplodeScreen({
  whiteWolfKingPlayer,
  targets,
  selectedTargetId,
  onSelectTarget,
  onBack,
  onConfirm,
}: Props) {
  const canConfirm = selectedTargetId !== null;
  const explodeLine = `白狼王 ${whiteWolfKingPlayer.seat}号 已选择自爆，请选择一名玩家与其同归于尽。`;

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 0.95;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)] text-xs">
        <div className="flex items-center gap-2">
          <Bilingual
            zh={explodeLine}
            en={`White Wolf King (Seat ${whiteWolfKingPlayer.seat}) has chosen to explode. Select one player to take down.`}
            small
          />
          <button
            type="button"
            className="px-1.5 py-0.5 rounded-md border border-[var(--color-blood)] text-xs text-[var(--color-moon-bright)] hover:bg-[#7f1d1d] transition-colors"
            onClick={() => speakChinese(explodeLine)}
            aria-label={`朗读：${explodeLine}`}
            title="朗读"
          >
            🔊
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex flex-wrap gap-2">
          {targets.map((player) => {
            const selected = selectedTargetId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                showRole
                nightCompactRole
                onClick={() => onSelectTarget(player.id)}
              />
            );
          })}
        </div>
      </div>

      {canConfirm && (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber-border)] text-[var(--color-amber-wolf)] text-xs">
          <div className="flex items-center gap-2">
            <Bilingual
              zh={`确认：白狼王将与 ${targets.find((p) => p.id === selectedTargetId)?.seat}号 同归于尽`}
              en={`Confirm: White Wolf King will take Seat ${targets.find((p) => p.id === selectedTargetId)?.seat} down`}
              small
            />
            <button
              type="button"
              className="px-1.5 py-0.5 rounded-md border border-[var(--color-amber-border)] text-xs text-[var(--color-amber-wolf)] hover:bg-[#451a03] transition-colors"
              onClick={() => speakChinese(`确认：白狼王将与 ${targets.find((p) => p.id === selectedTargetId)?.seat}号 同归于尽`)}
              aria-label={`朗读：确认白狼王将与 ${targets.find((p) => p.id === selectedTargetId)?.seat}号 同归于尽`}
              title="朗读"
            >
              🔊
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mt-5">
        <button type="button" className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors" onClick={onBack}>
          <Bilingual zh="返回" en="Back" small />
        </button>
        <button
          type="button"
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canConfirm ? 'bg-[var(--color-blood)] text-white hover:brightness-110 shadow-[var(--shadow-glow-blood)]' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canConfirm}
          onClick={onConfirm}
        >
          <Bilingual zh="确认自爆" en="Confirm Explode" small />
        </button>
      </div>
    </section>
  );
}
