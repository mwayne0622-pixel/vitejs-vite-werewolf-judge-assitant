import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  players: Player[];
  draftBearOwnerId: number | null;
  selectablePlayers: Player[];
  canGoNext: boolean;
  onSelectBear: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightBearScreen({
  players,
  draftBearOwnerId,
  selectablePlayers,
  canGoNext,
  onSelectBear,
  onBack,
  onNext,
}: Props) {
  const selectedBear =
    draftBearOwnerId !== null
      ? players.find((p) => p.id === draftBearOwnerId) ?? null
      : null;

  return (
    <section style={styles.card}>
      <Bilingual zh="第一夜：熊" en="First night: Bear" />

      <div style={styles.judgePanel}>
        <div style={styles.judgeHeader}>
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>

        <div style={styles.judgeContent}>
          <Bilingual
            zh={
              <>
                熊请睁眼。
                <br />
                请确认你的身份。
              </>
            }
            en={
              <>
                Bear, please open your eyes.
                <br />
                Confirm your identity.
              </>
            }
          />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Bilingual
          zh="先选中谁是熊，点击下一步后才保存"
          en="Choose who the Bear is. It is saved only when you click Next."
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
                draftBearOwnerId === player.id ? '#111827' : '#ffffff',
              color:
                draftBearOwnerId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSelectBear(player.id)}
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
          zh={`已选熊：${selectedBear ? `${selectedBear.seat}号` : '无'}`}
          en={`Selected Bear: ${
            selectedBear ? `Seat ${selectedBear.seat}` : 'None'
          }`}
          small
        />
      </div>

      <div style={styles.tipBox}>
        <Bilingual
          zh="每天白天宣布死讯后，若熊左右相邻的存活玩家中存在狼人，则熊会咆哮。"
          en="After the night result is announced, if at least one of the Bear's adjacent alive players is a wolf, the Bear roars."
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
  tipBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    color: '#374151',
    border: '1px solid #e5e7eb',
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