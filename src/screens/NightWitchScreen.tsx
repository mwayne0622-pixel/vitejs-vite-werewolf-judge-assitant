import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

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
    <section style={styles.card}>
      <Bilingual zh="夜晚：女巫行动" en="Night: Witch acts" />

      {witchIsDead && (
        <div style={styles.deadNotice}>
          <Bilingual
            zh="女巫已死亡，本夜无实际操作。法官可继续宣读流程。"
            en="The witch is dead. No real action tonight. The judge may still read the process aloud."
            small
          />
        </div>
      )}

      <div style={styles.tipBox}>
        <Bilingual
          zh={`今晚刀口：${wolfTarget ? `${wolfTarget.seat}号` : '未选择'}`}
          en={
            wolfTarget
              ? `Tonight's target: Seat ${wolfTarget.seat}`
              : `Tonight's target: not selected`
          }
          small
        />
      </div>

      <label
        style={{
          ...styles.checkboxRow,
          opacity: laterNightSaveDisabled ? 0.5 : 1,
        }}
      >
        <input
          type="checkbox"
          checked={witchSave}
          disabled={laterNightSaveDisabled}
          onChange={(e) => onToggleSave(e.target.checked)}
        />
        <Bilingual
          zh={`使用解药救人${
            witchSaveUsed
              ? '（本局已用完）'
              : blockSelfSave
              ? '（不能自救）'
              : witchPoisonId !== null
              ? '（已选择毒药，不能同时使用）'
              : ''
          }`}
          en={`Use antidote to save${
            witchSaveUsed
              ? ' (already used)'
              : blockSelfSave
              ? ' (cannot self-save)'
              : witchPoisonId !== null
              ? ' (poison selected, cannot use both)'
              : ''
          }`}
          small
        />
      </label>

      <div
        style={{
          marginTop: 20,
          opacity: laterNightPoisonDisabled ? 0.5 : 1,
        }}
      >
        <Bilingual
          zh={`选择是否毒人${
            witchPoisonUsed
              ? '（本局已用完）'
              : witchSave
              ? '（已使用解药，不能同时使用）'
              : ''
          }`}
          en={`Choose whether to poison${
            witchPoisonUsed
              ? ' (already used)'
              : witchSave
              ? ' (antidote selected, cannot use both)'
              : ''
          }`}
          small
        />
      </div>

      <div style={styles.optionList}>
        <button
          disabled={laterNightPoisonDisabled}
          style={{
            ...styles.optionButton,
            background: witchPoisonId === null ? '#111827' : '#ffffff',
            color: witchPoisonId === null ? '#ffffff' : '#111827',
            opacity: laterNightPoisonDisabled ? 0.45 : 1,
            cursor: laterNightPoisonDisabled ? 'not-allowed' : 'pointer',
          }}
          onClick={() => {
            if (!laterNightPoisonDisabled) onSelectPoison(null);
          }}
        >
          <Bilingual zh="不使用毒药" en="Do not use poison" small />
        </button>

        {alivePlayers.map((player) => (
          <button
            key={player.id}
            disabled={laterNightPoisonDisabled}
            style={{
              ...styles.optionButton,
              background: witchPoisonId === player.id ? '#111827' : '#ffffff',
              color: witchPoisonId === player.id ? '#ffffff' : '#111827',
              opacity: laterNightPoisonDisabled ? 0.45 : 1,
              cursor: laterNightPoisonDisabled ? 'not-allowed' : 'pointer',
            }}
            onClick={() => {
              if (!laterNightPoisonDisabled) onSelectPoison(player.id);
            }}
          >
            <Bilingual
              zh={`毒 ${player.seat}号`}
              en={`Poison Seat ${player.seat}`}
              small
            />
          </button>
        ))}
      </div>

      <div style={styles.actionRow}>
        <button style={styles.secondaryButton} onClick={onBack}>
          <Bilingual zh="上一步" en="Back" small />
        </button>

        <button style={styles.primaryButton} onClick={onNext}>
          <Bilingual zh="下一步" en="Next" small />
        </button>
      </div>
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    marginBottom: 20,
  },
  deadNotice: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#fff7ed',
    color: '#9a3412',
    border: '1px solid #fdba74',
  },
  tipBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    color: '#374151',
    border: '1px solid #e5e7eb',
  },
  optionList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  optionButton: {
    border: '1px solid #d1d5db',
    borderRadius: 14,
    padding: '12px 14px',
    cursor: 'pointer',
    fontSize: 14,
    background: '#ffffff',
  },
  actionRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    border: 'none',
    background: '#111827',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 700,
  },
  secondaryButton: {
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#111827',
    padding: '12px 16px',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 700,
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 15,
    color: '#111827',
  },
};
