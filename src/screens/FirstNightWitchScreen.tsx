import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

type Props = {
  players: Player[];
  draftWitchOwnerId: number | null;
  wolfTarget: Player | null;
  witchSave: boolean;
  witchPoisonId: number | null;
  witchSaveUsed: boolean;
  witchPoisonUsed: boolean;
  selectablePlayers: Player[];
  alivePlayers: Player[];
  canGoNext: boolean;
  onSelectWitch: (id: number) => void;
  onToggleSave: (checked: boolean) => void;
  onSelectPoison: (id: number | null) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightWitchScreen({
  players,
  draftWitchOwnerId,
  wolfTarget,
  witchSave,
  witchPoisonId,
  witchSaveUsed,
  witchPoisonUsed,
  selectablePlayers,
  alivePlayers,
  canGoNext,
  onSelectWitch,
  onToggleSave,
  onSelectPoison,
  onBack,
  onNext,
}: Props) {
  const selectedWitch = players.find((p) => p.id === draftWitchOwnerId) ?? null;
  const saveDisabled = witchSaveUsed || witchPoisonId !== null;
  const poisonDisabled = witchPoisonUsed || witchSave;

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="4. 第一夜：女巫" en="First night: Witch" />

      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <div className="text-xs font-bold text-[#818cf8] mb-2">
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>
        <div className="text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          <Bilingual
            zh={<>女巫请睁眼。<br />请确认你的身份。<br /><br />今晚是否使用解药？<br /><br />今晚是否使用毒药？<br />请选择一名玩家。</>}
            en={<>Witch, please open your eyes.<br />Confirm your identity.<br /><br />Do you want to use the antidote tonight?<br /><br />Do you want to use poison tonight?<br />Choose one player.</>}
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="先选中谁是女巫，点击下一步后才保存" en="Choose the witch first. It is saved only when you click Next." small />
        </div>
        <div className="flex flex-wrap gap-2">
          {selectablePlayers.map((player) => {
            const selected = draftWitchOwnerId === player.id;
            return (
              <PlayerSelectButton
                key={player.id}
                player={player}
                selected={selected}
                onClick={() => onSelectWitch(player.id)}
              />
            );
          })}
        </div>
        <div className="mt-2 text-xs text-[var(--color-moon-dim)]">
          <Bilingual
            zh={`已选女巫：${selectedWitch ? `${selectedWitch.seat}号` : '无'}`}
            en={`Selected witch: ${selectedWitch ? `Seat ${selectedWitch.seat}` : 'None'}`}
            small
          />
        </div>
      </div>

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
          <Bilingual
            zh="刀口已隐藏。法官仍按正常节奏询问解药与毒药。"
            en="Target is hidden. Keep the normal speaking rhythm for antidote and poison."
            small
          />
        </div>
      )}

      <label className={`flex items-center gap-2.5 mt-4 cursor-pointer transition-opacity ${saveDisabled ? 'opacity-50' : ''}`}>
        <input type="checkbox" className="w-4 h-4 accent-[var(--color-blood)]" checked={witchSave} disabled={saveDisabled} onChange={(e) => onToggleSave(e.target.checked)} />
        <span className="text-sm text-[var(--color-moon)]">
          <Bilingual
            zh={`使用解药救人${witchSaveUsed ? '（本局已用完）' : witchPoisonId !== null ? '（已选择毒药，不能同时使用）' : ''}`}
            en={`Use antidote to save${witchSaveUsed ? ' (already used in this game)' : witchPoisonId !== null ? ' (poison selected, cannot use both)' : ''}`}
            small
          />
        </span>
      </label>

      <div className={`mt-5 transition-opacity ${poisonDisabled ? 'opacity-50' : ''}`}>
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual
            zh={`选择是否毒人${witchPoisonUsed ? '（本局已用完）' : witchSave ? '（已使用解药，不能同时使用）' : ''}`}
            en={`Choose whether to poison${witchPoisonUsed ? ' (already used in this game)' : witchSave ? ' (antidote selected, cannot use both)' : ''}`}
            small
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            disabled={poisonDisabled}
            className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold border transition-all ${witchPoisonId === null ? 'bg-[var(--color-blood)] border-[var(--color-blood)] text-white' : 'bg-[var(--color-wolf-card-alt)] border-[var(--color-wolf-border-hi)] text-[var(--color-moon)]'} ${poisonDisabled ? 'cursor-not-allowed' : 'cursor-pointer hover:border-[var(--color-blood)]'}`}
            onClick={() => onSelectPoison(null)}
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
                disabled={poisonDisabled}
                onClick={() => onSelectPoison(player.id)}
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
