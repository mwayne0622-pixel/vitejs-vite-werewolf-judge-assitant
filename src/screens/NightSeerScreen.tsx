import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  alivePlayers: Player[];
  seerCheckId: number | null;
  seerIsDead: boolean;
  checkedPlayer: Player | null;
  onSelectCheckTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function NightSeerScreen({
  alivePlayers,
  seerCheckId,
  seerIsDead,
  checkedPlayer,
  onSelectCheckTarget,
  onBack,
  onNext,
}: Props) {
  return (
    <section style={styles.card}>
      <Bilingual zh="夜晚：预言家行动" en="Night: Seer acts" />

      {seerIsDead && (
        <div style={styles.deadNotice}>
          <Bilingual
            zh="预言家已死亡，本夜无实际操作。法官可继续宣读流程。"
            en="The seer is dead. No real action tonight. The judge may still read the process aloud."
            small
          />
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Bilingual zh="选择查验目标" en="Choose a player to check" small />
      </div>

      <div style={styles.optionList}>
        {alivePlayers.map((player) => (
          <button
            key={player.id}
            disabled={seerIsDead}
            style={{
              ...styles.optionButton,
              background: seerCheckId === player.id ? '#111827' : '#ffffff',
              color: seerCheckId === player.id ? '#ffffff' : '#111827',
              opacity: seerIsDead ? 0.45 : 1,
              cursor: seerIsDead ? 'not-allowed' : 'pointer',
            }}
            onClick={() => {
              if (!seerIsDead) onSelectCheckTarget(player.id);
            }}
          >
            <Bilingual
              zh={`${player.seat}号`}
              en={`Seat ${player.seat}`}
              small
            />
          </button>
        ))}
      </div>

      {checkedPlayer && (
        <div style={styles.resultBox}>
          <Bilingual
            zh={`查验结果：${checkedPlayer.seat}号 是 ${
              checkedPlayer.role === '狼人' ? '狼人' : '好人阵营'
            }`}
            en={`Result: Seat ${checkedPlayer.seat} is ${
              checkedPlayer.role === '狼人' ? 'a wolf' : 'good team'
            }`}
            small
          />
        </div>
      )}

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
  resultBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    background: '#eff6ff',
    color: '#1e3a8a',
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
