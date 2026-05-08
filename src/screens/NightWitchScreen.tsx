import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  wolfTarget: Player | null;
  witchIsDead: boolean;
  witchSave: boolean;
  witchPoisonId: number | null;
  witchSaveUsed: boolean;
  witchPoisonUsed: boolean;
  blockSelfSave: boolean;
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
  blockSelfSave,
  laterNightSaveDisabled,
  laterNightPoisonDisabled,
  alivePlayers,
  onToggleSave,
  onSelectPoison,
  onBack,
  onNext,
}: Props) {
  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="夜晚：女巫行动" en="Night: Witch acts" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>女巫请睁眼。<br />今晚是否使用解药？<br /><br />今晚是否使用毒药？<br />请选择一名玩家。</>}
            en={<>Witch, please open your eyes.<br />Do you want to use the antidote tonight?<br /><br />Do you want to use poison tonight?<br />Choose one player.</>}
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
          <Bilingual
            zh={<>今晚刀口：{wolfTarget ? `${wolfTarget.seat}号` : '未选择'}<br /><span className="text-[var(--color-amber-wolf)] font-bold">仅手势提示，勿读出声。</span></>}
            en={<>Tonight&apos;s target: {wolfTarget ? `Seat ${wolfTarget.seat}` : 'not selected'}<br /><span className="text-[var(--color-amber-wolf)] font-bold">Gesture only. Do not say aloud.</span></>}
            small
          />
        </div>
      ) : (
        <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
          <Bilingual zh="刀口已隐藏。法官仍按正常节奏询问解药与毒药。" en="Target is hidden. Keep the normal speaking rhythm for antidote and poison." small />
        </div>
      )}

      <label className={`flex items-center gap-2.5 mt-4 cursor-pointer transition-opacity ${laterNightSaveDisabled ? 'opacity-50' : ''}`}>
        <input type="checkbox" className="w-4 h-4 accent-[var(--color-blood)]" checked={witchSave} disabled={laterNightSaveDisabled} onChange={(e) => onToggleSave(e.target.checked)} />
        <span className="text-sm text-[var(--color-moon)]">
          <Bilingual
            zh={`使用解药救人${witchSaveUsed ? '（本局已用完）' : blockSelfSave ? '（不能自救）' : witchPoisonId !== null ? '（已选择毒药，不能同时使用）' : ''}`}
            en={`Use antidote to save${witchSaveUsed ? ' (already used)' : blockSelfSave ? ' (cannot self-save)' : witchPoisonId !== null ? ' (poison selected, cannot use both)' : ''}`}
            small
          />
        </span>
      </label>

      <div className={`mt-5 transition-opacity ${laterNightPoisonDisabled ? 'opacity-50' : ''}`}>
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual
            zh={`选择是否毒人${witchPoisonUsed ? '（本局已用完）' : witchSave ? '（已使用解药，不能同时使用）' : ''}`}
            en={`Choose whether to poison${witchPoisonUsed ? ' (already used)' : witchSave ? ' (antidote selected, cannot use both)' : ''}`}
            small
          />
        </div>
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
