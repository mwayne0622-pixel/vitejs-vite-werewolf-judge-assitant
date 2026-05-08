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

type BearInfo = {
  bearPlayer: Player | null;
  leftNeighbor: Player | null;
  rightNeighbor: Player | null;
  isRoaring: boolean | null;
  message: string;
  english: string;
};

type Props = {
  players: Player[];
  dayResult: DayResult;
  voteSummary: VoteSummary;
  voteApplied: boolean;
  unvotedPlayers?: Player[];
  dayApplied: boolean;
  gameOver: boolean;
  gameResult: string | null;
  whiteWolfKingOwnerId: number | null;
  canWhiteWolfKingExplode: boolean;
  bearInfo: BearInfo | null;
  wolfBeautyLoverMessage: string | null;
  wolfBeautyLoverEnglish: string | null;
  hunterShotMessage: string | null;
  hunterShotEnglish: string | null;
  whiteWolfKingMessage: string | null;
  whiteWolfKingEnglish: string | null;
  onStartWhiteWolfKingExplode: () => void;
  onBack: () => void;
  onApplyDayResult: () => void;
  onGoToVote: () => void;
  onStartNextNight: () => void;
  onReset: () => void;
};

function roleLabel(player: Player) {
  if (player.role === '白痴' && player.idiotRevealed) return '白痴（已翻牌）';
  return player.role ?? '未确认';
}

function roleToEnglish(player: Player) {
  if (player.role === '白痴' && player.idiotRevealed) return 'Idiot (Revealed)';
  switch (player.role) {
    case '狼人': return 'Wolf';
    case '白狼王': return 'White Wolf King';
    case '狼美人': return 'Wolf Beauty';
    case '预言家': return 'Seer';
    case '女巫': return 'Witch';
    case '守卫': return 'Guard';
    case '猎人': return 'Hunter';
    case '白痴': return 'Idiot';
    case '熊': return 'Bear';
    case '村民': return 'Villager';
    default: return 'Unconfirmed';
  }
}

export default function DayResultScreen({
  players,
  dayResult,
  voteSummary,
  voteApplied,
  unvotedPlayers = [],
  dayApplied,
  gameOver,
  gameResult,
  whiteWolfKingOwnerId,
  canWhiteWolfKingExplode,
  bearInfo,
  wolfBeautyLoverMessage,
  wolfBeautyLoverEnglish,
  hunterShotMessage,
  hunterShotEnglish,
  whiteWolfKingMessage,
  whiteWolfKingEnglish,
  onBack,
  onApplyDayResult,
  onGoToVote,
  onStartNextNight,
  onStartWhiteWolfKingExplode,
  onReset,
}: Props) {
  const canGoBack = !gameOver && !dayApplied;
  const canApplyNightDeaths = !gameOver && !dayApplied;
  const canGoToVote = !gameOver && dayApplied && !voteApplied;
  const canStartNextNight = !gameOver && voteApplied;

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <Bilingual zh="天亮结果" en="Day result" />

      <div className="mt-3">
        <Bilingual zh="法官宣读信息" en="Judge announcements" small />
      </div>

      <div className="flex flex-col gap-3 mt-2.5">
        {gameOver ? (
          <div className="p-4 rounded-2xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)]">
            <Bilingual zh={gameResult ?? '游戏结束'} en={gameResult ?? 'Game over'} />
          </div>
        ) : (
          <>
            <div className="p-4 rounded-2xl bg-[var(--color-amber-dim)] border border-[var(--color-amber-border)] text-[#fde68a]">
              <Bilingual zh={dayResult.message} en={dayResult.english} />
            </div>

            {hunterShotMessage && hunterShotEnglish && (
              <div className="p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)]">
                <Bilingual zh={hunterShotMessage} en={hunterShotEnglish} small />
              </div>
            )}

            {whiteWolfKingMessage && whiteWolfKingEnglish && (
              <div className="p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)]">
                <Bilingual zh={whiteWolfKingMessage} en={whiteWolfKingEnglish} small />
              </div>
            )}

            {bearInfo && (
              <div className="p-4 rounded-2xl bg-[var(--color-amber-dim)] border border-[var(--color-amber-border)] text-[#fde68a]">
                <Bilingual zh={bearInfo.message} en={bearInfo.english} />
                {bearInfo.bearPlayer && bearInfo.bearPlayer.alive && (
                  <div className="mt-2 opacity-80">
                    <Bilingual
                      zh={`熊：${bearInfo.bearPlayer.seat}号 ｜ 左邻居：${bearInfo.leftNeighbor ? `${bearInfo.leftNeighbor.seat}号` : '无'} ｜ 右邻居：${bearInfo.rightNeighbor ? `${bearInfo.rightNeighbor.seat}号` : '无'}`}
                      en={`Bear: Seat ${bearInfo.bearPlayer.seat} | Left neighbor: ${bearInfo.leftNeighbor ? `Seat ${bearInfo.leftNeighbor.seat}` : 'None'} | Right neighbor: ${bearInfo.rightNeighbor ? `Seat ${bearInfo.rightNeighbor.seat}` : 'None'}`}
                      small
                    />
                  </div>
                )}
              </div>
            )}

            {wolfBeautyLoverMessage && wolfBeautyLoverEnglish && (
              <div className="p-3.5 rounded-xl bg-[var(--color-blood-dim)] border border-[var(--color-blood)] text-[var(--color-moon-bright)]">
                <Bilingual zh={wolfBeautyLoverMessage} en={wolfBeautyLoverEnglish} small />
              </div>
            )}

            {canWhiteWolfKingExplode && (
              <div className="p-3.5 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border-hi)] text-[var(--color-moon)]">
                <Bilingual
                  zh="当前白狼王仍存活，可在进入投票前选择自爆并带走一名玩家。"
                  en="The White Wolf King is still alive and may explode before voting to take one player down."
                  small
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-5">
        <Bilingual zh="投票结果" en="Voting result" small />
      </div>

      <div className="mt-2 p-4 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] flex flex-col gap-2.5 text-left">
        <div className="text-[var(--color-moon-bright)] text-sm">
          <strong className="text-[var(--color-moon-dim)]">结果：</strong>
          {voteSummary.message}
        </div>

        {unvotedPlayers.length > 0 && (
          <div className="px-2.5 py-2 rounded-xl bg-[var(--color-amber-dim)] border border-[var(--color-amber-border)] text-[var(--color-amber-wolf)] text-xs">
            <strong>未投票：</strong>
            {unvotedPlayers.map((p) => `${p.seat}号`).join('、')}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {Object.entries(voteSummary.tally).map(([id, count]) => {
            const player = players.find((p) => p.id === Number(id));
            if (!player) return null;
            return (
              <div key={id} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--color-vote-bg)] border border-[var(--color-vote-border)] text-[var(--color-vote-text)] text-xs whitespace-nowrap">
                <strong>{player.seat}号</strong>
                <span>{count}票</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-5">
        <button
          className={`px-4 py-3 rounded-xl font-bold text-sm border cursor-pointer transition-all ${canGoBack ? 'border-[var(--color-wolf-border-hi)] bg-[var(--color-wolf-card-alt)] text-[var(--color-moon)] hover:border-[var(--color-moon-dim)]' : 'border-[var(--color-wolf-border)] bg-transparent text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canGoBack}
          onClick={onBack}
        >
          <Bilingual zh="上一步" en="Back" small />
        </button>

        <button
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canApplyNightDeaths ? 'bg-[var(--color-wolf-surface)] text-[var(--color-moon-bright)] border border-[var(--color-wolf-border-hi)] hover:border-[var(--color-moon-dim)]' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canApplyNightDeaths}
          onClick={onApplyDayResult}
        >
          <Bilingual zh="应用夜间死亡" en="Apply night deaths" small />
        </button>

        <button
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canGoToVote ? 'bg-[#1d4ed8] text-white hover:brightness-110' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canGoToVote}
          onClick={onGoToVote}
        >
          <Bilingual zh="进入投票" en="Go to voting" small />
        </button>

        <button
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canStartNextNight ? 'bg-[#166534] text-white hover:brightness-110' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canStartNextNight}
          onClick={onStartNextNight}
        >
          <Bilingual zh="开始下一夜" en="Start next night" small />
        </button>

        <button
          className="px-4 py-3 rounded-xl text-sm border-none bg-[var(--color-blood-dim)] text-[var(--color-moon)] cursor-pointer hover:bg-[var(--color-blood)] hover:text-white transition-all"
          onClick={onReset}
        >
          <Bilingual zh="重开本局" en="Restart game" small />
        </button>
      </div>

      <div className="mt-5">
        <Bilingual zh="玩家状态" en="Player status" small />

        <div className="flex flex-col gap-2.5 mt-2.5">
          {players.map((player) => {
            const isRevealedIdiot = player.role === '白痴' && player.idiotRevealed;
            return (
              <div key={player.id} className="grid items-center gap-2.5 p-2.5 border border-[var(--color-wolf-border)] rounded-xl bg-[var(--color-wolf-surface)]" style={{ gridTemplateColumns: '48px minmax(60px,1fr) minmax(100px,1.2fr) auto' }}>
                <div className="w-12 text-center bg-[var(--color-wolf-card-alt)] border border-[var(--color-wolf-border-hi)] text-[var(--color-moon-bright)] rounded-lg py-1.5 text-sm font-bold whitespace-nowrap box-border">
                  {player.seat}号
                </div>

                <div className="min-w-0 text-sm text-[var(--color-moon)]">{player.name}</div>

                <div className={`min-w-0 text-sm ${isRevealedIdiot ? 'text-[var(--color-blood)] font-bold' : 'text-[var(--color-moon)]'}`}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Bilingual zh={roleLabel(player)} en={roleToEnglish(player)} small />
                    {canWhiteWolfKingExplode && player.id === whiteWolfKingOwnerId && player.alive && (
                      <button
                        className={`border-none bg-[var(--color-blood)] text-white px-2 py-1 rounded-lg cursor-pointer font-bold text-xs whitespace-nowrap flex-shrink-0 hover:brightness-110 ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={gameOver}
                        onClick={onStartWhiteWolfKingExplode}
                      >
                        <Bilingual zh="自爆" en="Explode" small />
                      </button>
                    )}
                  </div>
                </div>

                <div className={`px-2.5 py-1.5 rounded-full text-xs whitespace-nowrap flex-shrink-0 text-center border ${player.alive ? 'bg-[var(--color-alive-bg)] border-[var(--color-alive-border)] text-[var(--color-alive-text)]' : 'bg-[var(--color-dead-bg)] border-[var(--color-dead-border)] text-[var(--color-dead-text)]'}`}>
                  <Bilingual zh={player.alive ? '存活' : '死亡'} en={player.alive ? 'Alive' : 'Dead'} small />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
