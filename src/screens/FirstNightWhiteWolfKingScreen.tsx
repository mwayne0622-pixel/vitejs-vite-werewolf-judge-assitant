import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  players: Player[];
  selectablePlayers: Player[];
  draftWhiteWolfKingOwnerId: number | null;
  canGoNext: boolean;
  onSelectWhiteWolfKing: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightWhiteWolfKingScreen({
  players,
  selectablePlayers,
  draftWhiteWolfKingOwnerId,
  canGoNext,
  onSelectWhiteWolfKing,
  onBack,
  onNext,
}: Props) {
  return (
    <section style={styles.card}>
      <Bilingual zh="确认白狼王" en="Confirm White Wolf King" />

      <div style={styles.tipBox}>
        <Bilingual
          zh="请从已选中的狼人中，再指定 1 名玩家为白狼王。白狼王属于狼人阵营，占用一个狼位。"
          en="Please choose 1 player from the selected wolves to be the White Wolf King. The White Wolf King belongs to the wolf camp and occupies one wolf slot."
          small
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <Bilingual zh="当前狼人名单" en="Current wolf list" small />
      </div>

      <div style={styles.playerList}>
        {selectablePlayers.map((player) => {
          const selected = draftWhiteWolfKingOwnerId === player.id;
          const displayName =
            player.name?.trim() || `${player.seat}号玩家`;

          return (
            <button
              key={player.id}
              type="button"
              style={{
                ...styles.playerButton,
                background: selected ? '#111827' : '#ffffff',
                color: selected ? '#ffffff' : '#111827',
                borderColor: selected ? '#111827' : '#d1d5db',
              }}
              onClick={() => onSelectWhiteWolfKing(player.id)}
            >
              <div style={styles.playerMainLine}>
                <strong>{player.seat}号</strong>
                <span>{displayName}</span>
              </div>

              <div style={styles.playerSubLine}>
                <Bilingual
                  zh={selected ? '已设为白狼王' : '点击设为白狼王'}
                  en={selected ? 'Selected as White Wolf King' : 'Click to assign'}
                  small
                />
              </div>
            </button>
          );
        })}
      </div>

      {draftWhiteWolfKingOwnerId !== null && (
        <div style={styles.summaryBox}>
          <Bilingual
            zh={`当前选择：${
              players.find((p) => p.id === draftWhiteWolfKingOwnerId)?.seat ?? ''
            }号为白狼王`}
            en={`Current selection: Seat ${
              players.find((p) => p.id === draftWhiteWolfKingOwnerId)?.seat ?? ''
            } as White Wolf King`}
            small
          />
        </div>
      )}

      <div style={styles.actionRow}>
        <button type="button" style={styles.secondaryButton} onClick={onBack}>
          <Bilingual zh="返回" en="Back" small />
        </button>

        <button
          type="button"
          style={{
            ...styles.primaryButton,
            opacity: canGoNext ? 1 : 0.5,
            cursor: canGoNext ? 'pointer' : 'not-allowed',
          }}
          onClick={onNext}
          disabled={!canGoNext}
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
  playerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 12,
  },
  playerButton: {
    border: '1px solid #d1d5db',
    borderRadius: 16,
    padding: 14,
    background: '#ffffff',
    textAlign: 'left',
    cursor: 'pointer',
  },
  playerMainLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 15,
  },
  playerSubLine: {
    marginTop: 8,
    opacity: 0.9,
  },
  summaryBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
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