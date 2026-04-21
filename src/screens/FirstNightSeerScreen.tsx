import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  players: Player[];
  draftSeerOwnerId: number | null;
  seerCheckId: number | null;
  selectablePlayers: Player[];
  alivePlayers: Player[];
  canGoNext: boolean;
  onSelectSeer: (playerId: number) => void;
  onSelectCheckTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightSeerScreen({
  players,
  draftSeerOwnerId,
  seerCheckId,
  selectablePlayers,
  alivePlayers,
  canGoNext,
  onSelectSeer,
  onSelectCheckTarget,
  onBack,
  onNext,
}: Props) {
  const selectedSeer = players.find((p) => p.id === draftSeerOwnerId);
  const checkedPlayer = players.find((p) => p.id === seerCheckId);

  return (
    <section style={styles.card}>
      <Bilingual zh="3. 第一夜：预言家" en="First night: Seer" />

      {/* 选择预言家 */}
      <div style={{ marginTop: 16 }}>
        <Bilingual
          zh="先选中谁是预言家，点击下一步后才保存"
          en="Choose the seer first. It is saved only when you click Next."
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
                draftSeerOwnerId === player.id ? '#111827' : '#ffffff',
              color: draftSeerOwnerId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSelectSeer(player.id)}
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
          zh={`已选预言家：${selectedSeer ? `${selectedSeer.seat}号` : '无'}`}
          en={`Selected seer: ${
            selectedSeer ? `Seat ${selectedSeer.seat}` : 'None'
          }`}
          small
        />
      </div>

      {/* 查验目标 */}
      <div style={{ marginTop: 20 }}>
        <Bilingual zh="选择查验目标" en="Choose a player to check" small />
      </div>

      <div style={styles.optionList}>
        {alivePlayers.map((player) => (
          <button
            key={player.id}
            style={{
              ...styles.optionButton,
              background: seerCheckId === player.id ? '#111827' : '#ffffff',
              color: seerCheckId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSelectCheckTarget(player.id)}
          >
            <Bilingual
              zh={`${player.seat}号 - ${player.name}`}
              en={`Seat ${player.seat} - ${player.name}`}
              small
            />
          </button>
        ))}
      </div>

      {/* 查验结果 */}
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

      {/* 操作按钮 */}
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
