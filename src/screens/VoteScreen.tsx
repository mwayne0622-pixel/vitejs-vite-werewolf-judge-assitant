import Bilingual from '../components/Bilingual';
import type { Player } from '../types';
import PlayerSelectButton from '../components/PlayerSelectButton';

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
  allCurrentVotersVoted: boolean;
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
  allCurrentVotersVoted,
  onSetPlayerVote,
  onBack,
  onApplyVoteResult,
}: Props) {
  const unvotedPlayers = voters.filter((voter) => votes[voter.id] == null);
  const canApply = !voteApplied && allCurrentVotersVoted;

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="白天投票" en="Day voting" />

      <div className="mt-2">
        <Bilingual
          zh={voteRound === 1 ? '当前为第一轮投票' : '当前为第二轮平票再投'}
          en={voteRound === 1 ? 'Round 1 voting' : 'Round 2 revote'}
          small
        />
      </div>

      <div className="mt-4 p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] text-[var(--color-moon-dim)] text-xs">
        <Bilingual
          zh="记录每位投票玩家的投票。第一轮平票将进入第二轮再投，第二轮平票则无人出局。"
          en="Record each eligible player's vote. A tie in round 1 leads to a revote; a tie in round 2 means no elimination."
          small
        />
      </div>

      <div className="mt-4">
        <div className="text-[var(--color-moon-dim)] text-xs mb-2">
          <Bilingual zh="逐个记录投票" en="Record votes one by one" small />
        </div>

        <div className="flex flex-col gap-3">
          {voters.map((voter) => (
            <div key={voter.id} className="flex flex-col gap-2.5 p-3 border border-[var(--color-wolf-border)] rounded-xl bg-[var(--color-wolf-surface)]">
              <div className="font-bold text-[var(--color-moon-bright)] text-sm">
                <Bilingual zh={`${voter.seat}号投票`} en={`Seat ${voter.seat} votes`} small />
              </div>
              <div className="flex flex-wrap gap-2">
                {voteTargets.map((target) => {
                  const selected = votes[voter.id] === target.id;
                  return (
                    <PlayerSelectButton
                      key={target.id}
                      player={target}
                      selected={selected}
                      onClick={() => onSetPlayerVote(voter.id, target.id)}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 p-4 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] flex flex-col gap-2.5 text-left">
        <div className="text-[var(--color-moon-bright)] text-sm">
          <strong className="text-[var(--color-moon-dim)]">投票结果：</strong>
          {voteSummary.message}
        </div>

        {unvotedPlayers.length > 0 && (
          <div className="px-2.5 py-2 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber-border)] text-[var(--color-amber-wolf)] text-xs">
            <strong>未投票：</strong>
            {unvotedPlayers.map((p) => `${p.seat}号`).join('、')}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-1">
          {voteTargets.map((target) => {
            const count = voteSummary.tally[target.id] || 0;
            return (
              <div key={target.id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--color-vote-bg)] border border-[var(--color-vote-border)] text-[var(--color-vote-text)] text-xs whitespace-nowrap">
                <strong>{target.seat}号</strong>
                <span>{count}票</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          className="px-4 py-3 rounded-xl font-bold text-sm border border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] cursor-pointer hover:border-[var(--color-moon-dim)] transition-colors"
          onClick={onBack}
        >
          <Bilingual zh="返回天亮结果" en="Back to day result" small />
        </button>

        <button
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${
            canApply
              ? 'bg-[#166534] text-white hover:brightness-110'
              : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'
          }`}
          onClick={onApplyVoteResult}
          disabled={!canApply}
        >
          <Bilingual zh="应用投票结果" en="Apply vote result" small />
        </button>
      </div>
    </section>
  );
}
