import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

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
    <section style={styles.card}>
      <Bilingual zh="4. 第一夜：女巫" en="First night: Witch" />

      <div style={styles.judgePanel}>
        <div style={styles.judgeHeader}>
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>

        <div style={styles.judgeContent}>
          <Bilingual
            zh={
              <>
                女巫请睁眼。
                <br />
                请确认你的身份。
                <br />
                <br />
                今晚是否使用解药？
                <br />
                <br />
                今晚是否使用毒药？
                <br />
                请选择一名玩家。
              </>
            }
            en={
              <>
                Witch, please open your eyes.
                <br />
                Confirm your identity.
                <br />
                <br />
                Do you want to use the antidote tonight?
                <br />
                <br />
                Do you want to use poison tonight?
                <br />
                Choose one player.
              </>
            }
          />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Bilingual
          zh="先选中谁是女巫，点击下一步后才保存"
          en="Choose the witch first. It is saved only when you click Next."
          small
        />
      </div>

      <div style={styles.optionList}>
        {selectablePlayers.map((player) => (
          <button
            key={player.id}
            style={{
              ...styles.optionButton,
              background:
                draftWitchOwnerId === player.id ? '#111827' : '#ffffff',
              color: draftWitchOwnerId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSelectWitch(player.id)}
          >
            <Bilingual
              zh={`${player.seat}号 - ${player.name}`}
              en={`Seat ${player.seat} - ${player.name}`}
              small
            />
          </button>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <Bilingual
          zh={`已选女巫：${selectedWitch ? `${selectedWitch.seat}号` : '无'}`}
          en={`Selected witch: ${
            selectedWitch ? `Seat ${selectedWitch.seat}` : 'None'
          }`}
          small
        />
      </div>

      {!witchSaveUsed ? (
        <div style={styles.targetBox}>
          <Bilingual
            zh={
              <>
                今晚刀口：{wolfTarget ? `${wolfTarget.seat}号` : '未选择'}
                <br />
                <span style={styles.gestureNote}>仅手势提示，勿读出声。</span>
              </>
            }
            en={
              <>
                Tonight&apos;s target:{' '}
                {wolfTarget ? `Seat ${wolfTarget.seat}` : 'not selected'}
                <br />
                <span style={styles.gestureNote}>
                  Gesture only. Do not say aloud.
                </span>
              </>
            }
            small
          />
        </div>
      ) : (
        <div style={styles.hiddenTargetBox}>
          <Bilingual
            zh="刀口已隐藏。法官仍按正常节奏询问解药与毒药。"
            en="Target is hidden. Keep the normal speaking rhythm for antidote and poison."
            small
          />
        </div>
      )}

      <label
        style={{
          ...styles.checkboxRow,
          marginTop: 16,
          opacity: saveDisabled ? 0.5 : 1,
        }}
      >
        <input
          type="checkbox"
          checked={witchSave}
          disabled={saveDisabled}
          onChange={(e) => onToggleSave(e.target.checked)}
        />
        <Bilingual
          zh={`使用解药救人${
            witchSaveUsed
              ? '（本局已用完）'
              : witchPoisonId !== null
              ? '（已选择毒药，不能同时使用）'
              : ''
          }`}
          en={`Use antidote to save${
            witchSaveUsed
              ? ' (already used in this game)'
              : witchPoisonId !== null
              ? ' (poison selected, cannot use both)'
              : ''
          }`}
          small
        />
      </label>

      <div style={{ marginTop: 20, opacity: poisonDisabled ? 0.5 : 1 }}>
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
              ? ' (already used in this game)'
              : witchSave
              ? ' (antidote selected, cannot use both)'
              : ''
          }`}
          small
        />
      </div>

      <div style={styles.optionList}>
        <button
          disabled={poisonDisabled}
          style={{
            ...styles.optionButton,
            background: witchPoisonId === null ? '#111827' : '#ffffff',
            color: witchPoisonId === null ? '#ffffff' : '#111827',
            cursor: poisonDisabled ? 'not-allowed' : 'pointer',
            opacity: poisonDisabled ? 0.5 : 1,
          }}
          onClick={() => onSelectPoison(null)}
        >
          <Bilingual zh="不使用毒药" en="Do not use poison" small />
        </button>

        {alivePlayers.map((player) => (
          <button
            key={player.id}
            disabled={poisonDisabled}
            style={{
              ...styles.optionButton,
              background: witchPoisonId === player.id ? '#111827' : '#ffffff',
              color: witchPoisonId === player.id ? '#ffffff' : '#111827',
              cursor: poisonDisabled ? 'not-allowed' : 'pointer',
              opacity: poisonDisabled ? 0.5 : 1,
            }}
            onClick={() => onSelectPoison(player.id)}
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

        <button
          style={{
            ...styles.primaryButton,
            opacity: canGoNext ? 1 : 0.5,
            cursor: canGoNext ? 'pointer' : 'not-allowed',
          }}
          disabled={!canGoNext}
          onClick={onNext}
        >
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
  judgePanel: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    background: '#f5f3ff',
    border: '1px solid #ddd6fe',
  },
  judgeHeader: {
    fontSize: 14,
    fontWeight: 700,
    color: '#6d28d9',
    marginBottom: 8,
  },
  judgeContent: {
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
    lineHeight: 1.7,
  },
  targetBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#eff6ff',
    color: '#1e3a8a',
    border: '1px solid #bfdbfe',
  },
  hiddenTargetBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    color: '#374151',
    border: '1px solid #e5e7eb',
  },
  gestureNote: {
    color: '#b45309',
    fontWeight: 700,
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
    gap: 12,
    marginTop: 20,
    flexWrap: 'wrap',
  },
  primaryButton: {
    background: '#111827',
    color: '#fff',
    border: 'none',
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
  },
};