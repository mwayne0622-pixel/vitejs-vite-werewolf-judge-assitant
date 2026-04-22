import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type VoteSummary = {
  tally: Record<number, number>;
  topTargets: number[];
  maxVotes: number;
  eliminatedId: number | null;
  isTie: boolean;
  message: string;
  english: string;
};

type Props = {
  voters: Player[];
  voteTargets: Player[];
  voteRound: 1 | 2;
  votes: Record<number, number | null>;
  voteSummary: VoteSummary & { shouldRevote: boolean };
  voteApplied: boolean;
  onSetPlayerVote: (voterId: number, targetId: number) => void;
  onBack: () => void;
  onApplyVoteResult: () => void;
};

export default function VoteScreen({
  voters,
  voteTargets,
  voteRound,
  votes,
  voteSummary,
  voteApplied,
  onSetPlayerVote,
  onBack,
  onApplyVoteResult,
}: Props) {
  return (
    <section style={styles.card}>
      <Bilingual zh="白天投票" en="Day voting" />

      <div style={{ marginTop: 8 }}>
        <Bilingual
          zh={voteRound === 1 ? '当前为第一轮投票' : '当前为第二轮平票再投'}
          en={voteRound === 1 ? 'Round 1 voting' : 'Round 2 revote'}
          small
        />
      </div>

      <div style={styles.tipBox}>
        <Bilingual
          zh="记录每位投票玩家的投票。第一轮平票将进入第二轮再投，第二轮平票则无人出局。"
          en="Record each eligible player's vote. A tie in round 1 leads to a revote; a tie in round 2 means no elimination."
          small
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <Bilingual zh="逐个记录投票" en="Record votes one by one" small />
      </div>

      <div style={styles.playerList}>
        {voters.map((voter) => (
          <div key={voter.id} style={styles.voteRow}>
            <div style={styles.voteVoter}>
              <Bilingual
                zh={`${voter.seat}号投票`}
                en={`Seat ${voter.seat} votes`}
                small
              />
            </div>

            <div style={styles.optionList}>
              {voteTargets.map((target) => (
                <button
                  key={target.id}
                  style={{
                    ...styles.optionButton,
                    background: votes[voter.id] === target.id ? '#111827' : '#ffffff',
                    color: votes[voter.id] === target.id ? '#ffffff' : '#111827',
                  }}
                  onClick={() => onSetPlayerVote(voter.id, target.id)}
                >
                  <Bilingual
                    zh={`${target.seat}号`}
                    en={`Seat ${target.seat}`}
                    small
                  />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={styles.summaryBox}>
        <div>
          <strong>投票结果：</strong>
          {voteSummary.message}
        </div>

        {voteTargets.map((target) => {
          const count = voteSummary.tally[target.id] || 0;
          return (
            <div key={target.id}>
              {target.seat}号：{count} 票
            </div>
          );
        })}
      </div>

      <div style={styles.actionRow}>
        <button style={styles.secondaryButton} onClick={onBack}>
          <Bilingual zh="返回天亮结果" en="Back to day result" small />
        </button>

        <button
          style={{
            ...styles.primaryButton,
            opacity: voteApplied ? 0.5 : 1,
            cursor: voteApplied ? 'not-allowed' : 'pointer',
          }}
          onClick={onApplyVoteResult}
          disabled={voteApplied}
        >
          <Bilingual zh="应用投票结果" en="Apply vote result" small />
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
  summaryBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    background: '#f9fafb',
    display: 'grid',
    gap: 8,
  },
  playerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 12,
  },
  voteRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 14,
  },
  voteVoter: {
    fontWeight: 700,
    color: '#111827',
  },
  optionList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
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
