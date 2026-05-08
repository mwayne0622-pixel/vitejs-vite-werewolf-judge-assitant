import { useState } from 'react';
import type { VoteSummary } from '../logic/gameRules';

export interface VotingState {
  votes: Record<number, number | null>;
  voteApplied: boolean;
  voteRound: 1 | 2;
  revoteCandidateIds: number[];
  appliedVoteSummary: (VoteSummary & { shouldRevote: boolean }) | null;
  dayApplied: boolean;
}

/**
 * 管理投票相关的所有状态
 * 包括：投票记录、投票轮次、投票结果等
 */
export function useVoting(initialState: VotingState) {
  const [votes, setVotes] = useState(initialState.votes);
  const [voteApplied, setVoteApplied] = useState(initialState.voteApplied);
  const [voteRound, setVoteRound] = useState(initialState.voteRound);
  const [revoteCandidateIds, setRevoteCandidateIds] = useState(
    initialState.revoteCandidateIds
  );
  const [appliedVoteSummary, setAppliedVoteSummary] = useState(
    initialState.appliedVoteSummary
  );
  const [dayApplied, setDayApplied] = useState(initialState.dayApplied);

  // 重置投票（为新的一天做准备）
  const resetVoting = () => {
    setVotes({});
    setVoteApplied(false);
    setVoteRound(1);
    setRevoteCandidateIds([]);
    setAppliedVoteSummary(null);
    setDayApplied(false);
  };

  return {
    votes,
    setVotes,
    voteApplied,
    setVoteApplied,
    voteRound,
    setVoteRound,
    revoteCandidateIds,
    setRevoteCandidateIds,
    appliedVoteSummary,
    setAppliedVoteSummary,
    dayApplied,
    setDayApplied,

    resetVoting,
  };
}
