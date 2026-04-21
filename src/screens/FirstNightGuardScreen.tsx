import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  players: Player[];
  draftGuardOwnerId: number | null;
  guardTargetId: number | null;
  selectablePlayers: Player[];
  alivePlayers: Player[];
  canGoNext: boolean;
  onSelectGuard: (playerId: number) => void;
  onSelectTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightGuardScreen({
  players,
  draftGuardOwnerId,
  guardTargetId,
  selectablePlayers,
  alivePlayers,
  canGoNext,
  onSelectGuard,
  onSelectTarget,
  onBack,
  onNext,
}: Props) {
  const selectedGuard =
    draftGuardOwnerId !== null
      ? players.find((p) => p.id === draftGuardOwnerId) ?? null
      : null;

  return (
    <section style={styles.card}>
      <Bilingual zh="5. 第一夜：守卫" en="First night: Guard" />

      <div style={{ marginTop: 16 }}>
        <Bilingual
          zh="先选中谁是守卫，点击下一步后才保存"
          en="Choose the guard first. It is saved only when you click Next."
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
                draftGuardOwnerId === player.id ? '#111827' : '#ffffff',
              color: draftGuardOwnerId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSelectGuard(player.id)}
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
          zh={`已选守卫：${selectedGuard ? `${selectedGuard.seat}号` : '无'}`}
          en={`Selected guard: ${
            selectedGuard ? `Seat ${selectedGuard.seat}` : 'None'
          }`}
          small
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <Bilingual zh="选择守护目标" en="Choose a player to guard" small />
      </div>

      <div style={styles.optionList}>
        {alivePlayers.map((player) => (
          <button
            key={player.id}
            style={{
              ...styles.optionButton,
              background: guardTargetId === player.id ? '#111827' : '#ffffff',
              color: guardTargetId === player.id ? '#ffffff' : '#111827',
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
