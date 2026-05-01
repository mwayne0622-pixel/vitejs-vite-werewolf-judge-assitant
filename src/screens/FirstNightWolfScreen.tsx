import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  players: Player[];
  wolfCount: number;
  selectedWolfIds: number[];
  wolfTargetId: number | null;
  canGoNext: boolean;
  onToggleWolfSelection: (playerId: number) => void;
  onSetWolfTarget: (playerId: number) => void;
  onNext: () => void;
};

export default function FirstNightWolfScreen({
  players,
  wolfCount,
  selectedWolfIds,
  wolfTargetId,
  canGoNext,
  onToggleWolfSelection,
  onSetWolfTarget,
  onNext,
}: Props) {
  const selectedWolfSeats = selectedWolfIds
    .map((id) => players.find((p) => p.id === id)?.seat)
    .filter((seat): seat is number => seat !== undefined);

  return (
    <section style={styles.card}>
      <Bilingual zh="2. 第一夜：狼人" en="First night: Wolves" />

      <div style={styles.judgePanel}>
        <div style={styles.judgeHeader}>
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>

        <div style={styles.judgeContent}>
          <Bilingual
            zh={
              <>
                狼人请睁眼。
                <br />
                请确认彼此身份，并选择今晚要袭击的玩家。
              </>
            }
            en={
              <>
                Wolves, please open your eyes.
                <br />
                Confirm each other, then choose tonight&apos;s target.
              </>
            }
          />
        </div>
      </div>

      <div style={styles.tipBox}>
        <Bilingual
          zh="先标记哪些玩家是狼人，再记录今晚刀口。狼人可以自刀。"
          en="Mark which players are wolves first, then record tonight's target. Wolves may target themselves."
          small
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <Bilingual
          zh={`选择狼人（需选 ${wolfCount} 个）`}
          en={`Select wolves (need ${wolfCount})`}
          small
        />
      </div>

      <div style={styles.optionList}>
        {players.map((player) => (
          <button
            key={player.id}
            style={{
              ...styles.optionButton,
              background: selectedWolfIds.includes(player.id)
                ? '#111827'
                : '#ffffff',
              color: selectedWolfIds.includes(player.id)
                ? '#ffffff'
                : '#111827',
            }}
            onClick={() => onToggleWolfSelection(player.id)}
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
          zh={`已选狼人：${
            selectedWolfSeats.length > 0
              ? selectedWolfSeats.map((seat) => `${seat}号`).join('、')
              : '无'
          }`}
          en={`Selected wolves: ${
            selectedWolfSeats.length > 0
              ? selectedWolfSeats.map((seat) => `Seat ${seat}`).join(', ')
              : 'None'
          }`}
          small
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <Bilingual zh="选择今晚刀口" en="Select tonight's target" small />
      </div>

      <div style={styles.optionList}>
        {players.map((player) => (
          <button
            key={player.id}
            style={{
              ...styles.optionButton,
              background: wolfTargetId === player.id ? '#111827' : '#ffffff',
              color: wolfTargetId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSetWolfTarget(player.id)}
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