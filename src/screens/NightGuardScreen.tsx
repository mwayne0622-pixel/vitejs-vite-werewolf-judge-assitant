import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  alivePlayers: Player[];
  guardTargetId: number | null;
  guardIsDead: boolean;
  lastGuardTargetId: number | null;
  onSelectTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function NightGuardScreen({
  alivePlayers,
  guardTargetId,
  guardIsDead,
  lastGuardTargetId,
  onSelectTarget,
  onBack,
  onNext,
}: Props) {
  return (
    <section style={styles.card}>
      <Bilingual zh="夜晚：守卫行动" en="Night: Guard acts" />

      <div style={styles.judgePanel}>
        <div style={styles.judgeHeader}>
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>

        <div style={styles.judgeContent}>
          <Bilingual
            zh={
              <>
                守卫请睁眼。
                <br />
                请选择今晚你要守护的玩家。
              </>
            }
            en={
              <>
                Guard, please open your eyes.
                <br />
                Choose the player you want to guard tonight.
              </>
            }
          />
        </div>
      </div>

      {guardIsDead && (
        <div style={styles.deadNotice}>
          <Bilingual
            zh="守卫已死亡，本夜无实际操作。法官可继续宣读流程。"
            en="The guard is dead. No real action tonight. The judge may still read the process aloud."
            small
          />
        </div>
      )}

      <div style={styles.tipBox}>
        <Bilingual
          zh="守卫不能连续两晚守同一人。"
          en="The guard cannot protect the same player on two consecutive nights."
          small
        />
      </div>

      <div style={styles.optionList}>
        {alivePlayers.map((player) => {
          const blockedByLastNight = lastGuardTargetId === player.id;
          const disabled = guardIsDead || blockedByLastNight;

          return (
            <button
              key={player.id}
              disabled={disabled}
              style={{
                ...styles.optionButton,
                background: guardTargetId === player.id ? '#111827' : '#ffffff',
                color: guardTargetId === player.id ? '#ffffff' : '#111827',
                opacity: disabled ? 0.45 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
              onClick={() => {
                if (!disabled) onSelectTarget(player.id);
              }}
            >
              <Bilingual
                zh={`${player.seat}号${
                  blockedByLastNight ? '（上夜已守）' : ''
                }`}
                en={`Seat ${player.seat}${
                  blockedByLastNight ? ' (protected last night)' : ''
                }`}
                small
              />
            </button>
          );
        })}
      </div>

      <div style={styles.actionRow}>
        <button style={styles.secondaryButton} onClick={onBack}>
          <Bilingual zh="上一步" en="Back" small />
        </button>

        <button style={styles.primaryButton} onClick={onNext}>
          <Bilingual zh="天亮结算" en="Go to day result" small />
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