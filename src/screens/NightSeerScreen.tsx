import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import { isWolf } from '../utils/roleUtils';

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
  const checkedIsWolfTeam = checkedPlayer ? isWolf(checkedPlayer.role) : false;

  return (
    <section style={styles.card}>
      <Bilingual zh="夜晚：预言家行动" en="Night: Seer acts" />

      <div style={styles.judgePanel}>
        <div style={styles.judgeHeader}>
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>

        <div style={styles.judgeContent}>
          <Bilingual
            zh={
              <>
                预言家请睁眼。
                <br />
                请选择今晚你要查验的玩家。
              </>
            }
            en={
              <>
                Seer, please open your eyes.
                <br />
                Choose the player you want to check tonight.
              </>
            }
          />
        </div>
      </div>

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
        <div
          style={{
            ...styles.resultBox,
            background: checkedIsWolfTeam ? '#fee2e2' : '#dcfce7',
            color: checkedIsWolfTeam ? '#991b1b' : '#166534',
            borderColor: checkedIsWolfTeam ? '#fecaca' : '#bbf7d0',
          }}
        >
          <div style={styles.resultRow}>
            <div>
              <div>
                查验结果：{checkedPlayer.seat}号 是{' '}
                {checkedIsWolfTeam ? '狼人阵营' : '好人阵营'}
              </div>
              <div style={styles.resultEnglish}>
                Result: Seat {checkedPlayer.seat} is{' '}
                {checkedIsWolfTeam ? 'wolf team' : 'good team'}
              </div>
            </div>

            <span style={styles.resultIcon}>
              {checkedIsWolfTeam ? '👎' : '👍'}
            </span>
          </div>
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
    border: '1px solid',
  },
  resultRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    fontWeight: 700,
  },
  resultEnglish: {
    marginTop: 4,
    fontSize: 13,
    fontWeight: 500,
    opacity: 0.85,
  },
  resultIcon: {
    fontSize: 28,
    lineHeight: 1,
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