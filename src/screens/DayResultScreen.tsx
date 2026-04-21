import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type DayResult = {
  deadIds: number[];
  message: string;
  english: string;
};

type VoteSummary = {
  tally: Record<number, number>;
  message: string;
  english: string;
};

type Props = {
  // 数据
  players: Player[];
  dayResult: DayResult;

  wolfTargetId: number | null;
  seerCheckId: number | null;
  witchSave: boolean;
  witchPoisonId: number | null;
  guardTargetId: number | null;

  // 投票
  voteSummary: VoteSummary;
  voteApplied: boolean;

  // 状态
  dayApplied: boolean;

  // 操作
  onBack: () => void;
  onApplyDayResult: () => void;
  onGoToVote: () => void;
  onApplyVote: () => void;
  onStartNextNight: () => void;
  onReset: () => void;
};

function roleLabel(role: Player['role']) {
  return role ?? '未确认';
}

function roleToEnglish(role: Player['role']) {
  switch (role) {
    case '狼人':
      return 'Wolf';
    case '预言家':
      return 'Seer';
    case '女巫':
      return 'Witch';
    case '守卫':
      return 'Guard';
    case '猎人':
      return 'Hunter';
    case '村民':
      return 'Villager';
    default:
      return 'Unconfirmed';
  }
}

export default function DayResultScreen({
  players,
  dayResult,

  wolfTargetId,
  seerCheckId,
  witchSave,
  witchPoisonId,
  guardTargetId,

  voteSummary,
  voteApplied,
  dayApplied,

  onBack,
  onApplyDayResult,
  onGoToVote,
  onApplyVote,
  onStartNextNight,
  onReset,
}: Props) {
  const getSeat = (id: number | null) => {
    if (!id) return '无';
    const p = players.find((p) => p.id === id);
    return p ? `${p.seat}号` : '无';
  };

  return (
    <section style={styles.card}>
      <Bilingual zh="天亮结果" en="Day result" />

      {/* 夜晚结果 */}
      <div style={styles.resultBox}>
        <Bilingual zh={dayResult.message} en={dayResult.english} />
      </div>

      {/* 夜晚动作 summary */}
      <div style={styles.summaryBox}>
        <div>
          <strong>狼人刀口：</strong>
          {getSeat(wolfTargetId)}
        </div>

        {seerCheckId !== null && (
          <div>
            <strong>预言家查验：</strong>
            {getSeat(seerCheckId)}
          </div>
        )}

        <div>
          <strong>女巫救人：</strong>
          {witchSave ? '是' : '否'}
        </div>

        <div>
          <strong>女巫毒人：</strong>
          {getSeat(witchPoisonId)}
        </div>

        <div>
          <strong>守卫守护：</strong>
          {getSeat(guardTargetId)}
        </div>
      </div>

      {/* 投票结果 */}
      <div style={{ marginTop: 20 }}>
        <Bilingual zh="投票结果" en="Voting result" small />
      </div>

      <div style={styles.summaryBox}>
        <div>
          <strong>结果：</strong>
          {voteSummary.message}
        </div>

        {Object.entries(voteSummary.tally).map(([id, count]) => {
          const player = players.find((p) => p.id === Number(id));
          if (!player) return null;

          return (
            <div key={id}>
              {player.seat}号：{count} 票
            </div>
          );
        })}
      </div>

      {/* 按钮区 */}
      <div style={styles.actionRow}>
        <button style={styles.secondaryButton} onClick={onBack}>
          <Bilingual zh="上一步" en="Back" small />
        </button>

        <button
          style={{
            ...styles.primaryButton,
            opacity: dayApplied ? 0.5 : 1,
            cursor: dayApplied ? 'not-allowed' : 'pointer',
          }}
          disabled={dayApplied}
          onClick={onApplyDayResult}
        >
          <Bilingual zh="应用夜间死亡" en="Apply night deaths" small />
        </button>

        <button style={styles.primaryButton} onClick={onGoToVote}>
          <Bilingual zh="进入投票" en="Go to voting" small />
        </button>

        <button
          style={{
            ...styles.primaryButton,
            opacity: voteApplied ? 0.5 : 1,
            cursor: voteApplied ? 'not-allowed' : 'pointer',
          }}
          disabled={voteApplied}
          onClick={onApplyVote}
        >
          <Bilingual zh="应用投票结果" en="Apply vote result" small />
        </button>

        <button style={styles.primaryButton} onClick={onStartNextNight}>
          <Bilingual zh="开始下一夜" en="Start next night" small />
        </button>

        <button style={styles.dangerButton} onClick={onReset}>
          <Bilingual zh="重开本局" en="Restart game" small />
        </button>
      </div>

      {/* 玩家状态 */}
      <div style={{ marginTop: 20 }}>
        <Bilingual zh="玩家状态" en="Player status" small />
        <div style={styles.playerList}>
          {players.map((player) => (
            <div key={player.id} style={styles.playerRow}>
              <div style={styles.seatTag}>{player.seat}号</div>

              <div style={{ minWidth: 120 }}>
                <Bilingual zh={player.name} en={player.name} small />
              </div>

              <div style={{ minWidth: 90 }}>
                <Bilingual
                  zh={roleLabel(player.role)}
                  en={roleToEnglish(player.role)}
                  small
                />
              </div>

              <div
                style={{
                  ...styles.aliveBadge,
                  background: player.alive ? '#dcfce7' : '#fee2e2',
                  color: player.alive ? '#166534' : '#991b1b',
                }}
              >
                <Bilingual
                  zh={player.alive ? '存活' : '死亡'}
                  en={player.alive ? 'Alive' : 'Dead'}
                  small
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 样式（直接复制，不依赖 App.tsx） */
const styles: Record<string, CSSProperties> = {
  card: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    marginBottom: 20,
  },
  resultBox: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    background: '#eff6ff',
    color: '#1e3a8a',
  },
  summaryBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    background: '#f9fafb',
    display: 'grid',
    gap: 8,
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
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 700,
  },
  secondaryButton: {
    border: '1px solid #d1d5db',
    background: '#fff',
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
  },
  playerList: {
    marginTop: 10,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  playerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    border: '1px solid #e5e7eb',
    borderRadius: 12,
  },
  seatTag: {
    width: 50,
    textAlign: 'center',
    background: '#111827',
    color: '#fff',
    borderRadius: 10,
    padding: 6,
  },
  aliveBadge: {
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
  },
};
