import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  players: Player[];
  draftHunterOwnerId: number | null;
  selectablePlayers: Player[];
  canGoNext: boolean;
  onSelectHunter: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightHunterScreen({
  players,
  draftHunterOwnerId,
  selectablePlayers,
  canGoNext,
  onSelectHunter,
  onBack,
  onNext,
}: Props) {
  const selectedHunter =
    draftHunterOwnerId !== null
      ? players.find((p) => p.id === draftHunterOwnerId) ?? null
      : null;

  return (
    <section style={styles.card}>
      <Bilingual zh="6. 第一夜：猎人" en="First night: Hunter" />

      <div style={{ marginTop: 16 }}>
        <Bilingual
          zh="先选中谁是猎人，点击下一步后才保存（首夜只确认身份，无夜间动作）"
          en="Choose the hunter first. It is saved only when you click Next. (Identity only, no night action)"
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
                draftHunterOwnerId === player.id ? '#111827' : '#ffffff',
              color: draftHunterOwnerId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSelectHunter(player.id)}
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
          zh={`已选猎人：${selectedHunter ? `${selectedHunter.seat}号` : '无'}`}
          en={`Selected hunter: ${
            selectedHunter ? `Seat ${selectedHunter.seat}` : 'None'
          }`}
          small
        />
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
};
