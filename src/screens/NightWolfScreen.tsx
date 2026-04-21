import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  alivePlayers: Player[];
  wolfTargetId: number | null;
  canGoNext: boolean;
  onSelectTarget: (playerId: number) => void;
  onNext: () => void;
};

export default function NightWolfScreen({
  alivePlayers,
  wolfTargetId,
  canGoNext,
  onSelectTarget,
  onNext,
}: Props) {
  return (
    <section style={styles.card}>
      <Bilingual zh="夜晚：狼人行动" en="Night: Wolves act" />

      <div style={styles.tipBox}>
        <Bilingual
          zh="狼人可以选择任意存活玩家作为刀口，包括自己。"
          en="Wolves may target any alive player, including themselves."
          small
        />
      </div>

      <div style={styles.optionList}>
        {alivePlayers.map((player) => (
          <button
            key={player.id}
            style={{
              ...styles.optionButton,
              background: wolfTargetId === player.id ? '#111827' : '#ffffff',
              color: wolfTargetId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSelectTarget(player.id)}
          >
            <Bilingual
              zh={`${player.seat}号`}
              en={`Seat ${player.seat}`}
              small
            />
          </button>
        ))}
      </div>

      <div style={styles.actionRow}>
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
};
