import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  whiteWolfKingPlayer: Player;
  targets: Player[];
  selectedTargetId: number | null;
  onSelectTarget: (id: number) => void;
  onBack: () => void;
  onConfirm: () => void;
};

export default function WhiteWolfKingExplodeScreen({
  whiteWolfKingPlayer,
  targets,
  selectedTargetId,
  onSelectTarget,
  onBack,
  onConfirm,
}: Props) {
  return (
    <section style={styles.card}>
      <Bilingual zh="白狼王自爆" en="White Wolf King Explode" />

      <div style={styles.warningBox}>
        <Bilingual
          zh={`白狼王 ${whiteWolfKingPlayer.seat}号 已选择自爆，请选择一名玩家与其同归于尽。`}
          en={`White Wolf King (Seat ${whiteWolfKingPlayer.seat}) has chosen to explode. Select one player to take down.`}
          small
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <Bilingual zh="可选目标" en="Selectable targets" small />
      </div>

      <div style={styles.playerGrid}>
        {targets.map((player) => {
          const selected = selectedTargetId === player.id;
          const displayName = player.name?.trim() || `${player.seat}号玩家`;

          return (
            <button
              key={player.id}
              type="button"
              style={{
                ...styles.targetButton,
                background: selected ? '#111827' : '#ffffff',
                color: selected ? '#ffffff' : '#111827',
                borderColor: selected ? '#111827' : '#d1d5db',
              }}
              onClick={() => onSelectTarget(player.id)}
            >
              <Bilingual
                zh={`${player.seat}号 - ${displayName}`}
                en={`Seat ${player.seat} - ${displayName}`}
                small
              />
            </button>
          );
        })}
      </div>

      {selectedTargetId !== null && (
        <div style={styles.confirmBox}>
          <Bilingual
            zh={`确认：白狼王将与 ${
              targets.find((p) => p.id === selectedTargetId)?.seat
            }号 同归于尽`}
            en={`Confirm: White Wolf King will take Seat ${
              targets.find((p) => p.id === selectedTargetId)?.seat
            } down`}
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
            ...styles.dangerButton,
            opacity: selectedTargetId ? 1 : 0.5,
            cursor: selectedTargetId ? 'pointer' : 'not-allowed',
          }}
          disabled={!selectedTargetId}
          onClick={onConfirm}
        >
          <Bilingual zh="确认自爆" en="Confirm Explode" small />
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
  warningBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
  },
  playerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
    gap: 10,
    marginTop: 12,
  },
  targetButton: {
    border: '1px solid #d1d5db',
    borderRadius: 14,
    padding: '12px 14px',
    background: '#ffffff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'left',
    minHeight: 62,
  },
  confirmBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#fff7ed',
    border: '1px solid #fdba74',
    color: '#9a3412',
  },
  actionRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  secondaryButton: {
    border: '1px solid #d1d5db',
    background: '#ffffff',
    padding: '12px 16px',
    borderRadius: 14,
    cursor: 'pointer',
  },
  dangerButton: {
    border: 'none',
    background: '#b91c1c',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 700,
  },
};