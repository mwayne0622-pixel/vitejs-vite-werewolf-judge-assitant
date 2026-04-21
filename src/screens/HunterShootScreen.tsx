import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  source: 'night' | 'vote';
  hunterPlayer: Player;
  aliveTargets: Player[];
  selectedTargetId: number | null;
  onSelectTarget: (playerId: number) => void;
  onSkip: () => void;
  onConfirm: () => void;
};

export default function HunterShootScreen({
  source,
  hunterPlayer,
  aliveTargets,
  selectedTargetId,
  onSelectTarget,
  onSkip,
  onConfirm,
}: Props) {
  return (
    <section style={styles.card}>
      <Bilingual zh="猎人开枪" en="Hunter shoots" />

      <div style={styles.tipBox}>
        <Bilingual
          zh={`猎人（${hunterPlayer.seat}号）已因${
            source === 'night' ? '夜晚死亡' : '投票出局'
          }触发技能，可选择带走一名存活玩家，也可以选择不开枪。`}
          en={`Hunter (Seat ${hunterPlayer.seat}) died by ${
            source === 'night' ? 'night kill' : 'vote out'
          } and may shoot one alive player, or skip.`}
          small
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <Bilingual zh="选择带走目标" en="Choose a target to shoot" small />
      </div>

      <div style={styles.optionList}>
        {aliveTargets.map((player) => (
          <button
            key={player.id}
            style={{
              ...styles.optionButton,
              background:
                selectedTargetId === player.id ? '#111827' : '#ffffff',
              color: selectedTargetId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSelectTarget(player.id)}
          >
            <Bilingual
              zh={`${player.seat}号 - ${player.name}`}
              en={`Seat ${player.seat} - ${player.name}`}
              small
            />
          </button>
        ))}
      </div>

      <div style={styles.actionRow}>
        <button style={styles.secondaryButton} onClick={onSkip}>
          <Bilingual zh="不开枪" en="Skip" small />
        </button>

        <button
          style={{
            ...styles.primaryButton,
            opacity: selectedTargetId !== null ? 1 : 0.5,
            cursor: selectedTargetId !== null ? 'pointer' : 'not-allowed',
          }}
          disabled={selectedTargetId === null}
          onClick={onConfirm}
        >
          <Bilingual zh="确认开枪" en="Confirm shot" small />
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
