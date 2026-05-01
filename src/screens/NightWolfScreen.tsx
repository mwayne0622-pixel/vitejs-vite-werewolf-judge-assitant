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

function roleToEnglish(role: Player['role']) {
  switch (role) {
    case '狼人':
      return 'Wolf';
    case '白狼王':
      return 'White Wolf King';
    case '狼美人':
      return 'Wolf Beauty';
    case '预言家':
      return 'Seer';
    case '女巫':
      return 'Witch';
    case '守卫':
      return 'Guard';
    case '猎人':
      return 'Hunter';
    case '白痴':
      return 'Idiot';
    case '熊':
      return 'Bear';
    case '村民':
      return 'Villager';
    default:
      return 'Unknown';
  }
}

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
                请选择今晚要袭击的玩家。
              </>
            }
            en={
              <>
                Wolves, please open your eyes.
                <br />
                Choose tonight&apos;s target.
              </>
            }
          />
        </div>
      </div>

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
            type="button"
            style={{
              ...styles.optionButton,
              background: wolfTargetId === player.id ? '#111827' : '#ffffff',
              color: wolfTargetId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSelectTarget(player.id)}
          >
            <Bilingual
              zh={`${player.seat}号 - ${player.role ?? '未确认'}`}
              en={`Seat ${player.seat} - ${roleToEnglish(player.role)}`}
              small
            />
          </button>
        ))}
      </div>

      <div style={styles.actionRow}>
        <button
          type="button"
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
    minWidth: 120,
    textAlign: 'left',
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