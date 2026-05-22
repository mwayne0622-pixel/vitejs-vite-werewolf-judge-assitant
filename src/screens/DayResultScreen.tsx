import Bilingual from '../components/Bilingual';
import JudgeScriptHeader from '../components/JudgeScriptHeader';
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
  canKnightDuel: boolean;
  knightDuelMessage: string | null;
  knightDuelEnglish: string | null;
  onStartKnightDuel: () => void;
  onBack: () => void;
  onGoToVote: () => void;
  onStartNextNight: () => void;
};

function roleLabel(player: Player) {
  if (player.role === '白痴' && player.idiotRevealed) return '白痴（已翻牌）';
  return player.role ?? '未确认';
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
  onStartWhiteWolfKingExplode,
  canKnightDuel,
  knightDuelMessage,
  knightDuelEnglish,
  onStartKnightDuel,
  onBack,
  onGoToVote,
  onStartNextNight,
}: Props) {
  const canGoBack = !gameOver && !dayApplied;
  const canGoToVote = !gameOver && dayApplied && !voteApplied;
  const canStartNextNight = !gameOver && voteApplied;
  const dayResultZh =
    dayResult.message === '平安夜' ? '今晚是平安夜' : dayResult.message;
  const dayResultEn =
    dayResult.english === 'Peaceful night' ? 'Tonight is a peaceful night' : dayResult.english;
  const safeGameResultEn = gameResult ?? 'Game over';

  function speakChinese(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const zhVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith('zh'));
    if (zhVoice) utterance.voice = zhVoice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handleWhiteWolfKingExplode() {
    speakChinese('白狼王摊牌了：这局先炸个响，带你们一起看烟花。');
    onStartWhiteWolfKingExplode();
  }

  function speakDayVoteSummary() {
    const detail = Object.entries(voteSummary.tally)
      .map(([id, count]) => {
        const player = players.find((p) => p.id === Number(id));
        return player ? `${player.seat}号${count}票` : null;
      })
      .filter((item): item is string => item !== null)
      .join('，');
    const text = `投票结果：${voteSummary.message}。当前票型：${detail || '暂无有效票型'}。`;
    speakChinese(text);
  }

  return (
    <section className="bg-[var(--color-wolf-card)] rounded-2xl p-5 mb-5 shadow-[var(--shadow-card)] border border-[var(--color-wolf-border)]">
      <div className="mt-3.5 p-4 rounded-xl bg-[#0e0b1f] border border-[#3730a3]">
        <JudgeScriptHeader />
        <div className="flex flex-col gap-2.5 mt-3 text-[var(--color-moon-bright)] font-semibold leading-relaxed">
          {gameOver ? (
            <div className="flex items-center gap-2">
              <Bilingual zh={gameResult ?? '游戏结束'} en={safeGameResultEn} />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <Bilingual zh={dayResultZh} en={dayResultEn} />
                <button
                  type="button"
                  className="px-1.5 py-0.5 rounded-md border border-[#d97706] text-xs text-[#fde68a] hover:bg-[#78350f] transition-colors"
                  onClick={() => speakChinese(dayResultZh)}
                  aria-label={`朗读：${dayResultZh}`}
                  title="朗读"
                >
                  🔊
                </button>
              </div>

              {hunterShotMessage && (
                <div className="flex items-start gap-2">
                  <Bilingual zh={hunterShotMessage} en={hunterShotEnglish ?? ''} small />
                </div>
              )}

              {whiteWolfKingMessage && (
                <div className="flex items-start gap-2">
                  <Bilingual zh={whiteWolfKingMessage} en={whiteWolfKingEnglish ?? ''} small />
                </div>
              )}

              {bearInfo && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Bilingual zh={bearInfo.message} en={bearInfo.english} />
                    <button
                      type="button"
                      className="px-1.5 py-0.5 rounded-md border border-[#d97706] text-xs text-[#fde68a] hover:bg-[#78350f] transition-colors"
                      onClick={() => speakChinese(bearInfo.message)}
                      aria-label={`朗读：${bearInfo.message}`}
                      title="朗读"
                    >
                      🔊
                    </button>
                  </div>
                  {bearInfo.bearPlayer && bearInfo.bearPlayer.alive && (
                    <div className="opacity-80">
                      <Bilingual
                        zh={`熊：${bearInfo.bearPlayer.seat}号 ｜ 左邻居：${bearInfo.leftNeighbor ? `${bearInfo.leftNeighbor.seat}号` : '无'} ｜ 右邻居：${bearInfo.rightNeighbor ? `${bearInfo.rightNeighbor.seat}号` : '无'}`}
                        en={`Bear: Seat ${bearInfo.bearPlayer.seat} | Left neighbor: ${bearInfo.leftNeighbor ? `Seat ${bearInfo.leftNeighbor.seat}` : 'None'} | Right neighbor: ${bearInfo.rightNeighbor ? `Seat ${bearInfo.rightNeighbor.seat}` : 'None'}`}
                        small
                      />
                    </div>
                  )}
                </div>
              )}

              {wolfBeautyLoverMessage && (
                <div className="flex items-start gap-2">
                  <Bilingual zh={wolfBeautyLoverMessage} en={wolfBeautyLoverEnglish ?? ''} small />
                </div>
              )}

              {knightDuelMessage && (
                <div className="flex items-start gap-2">
                  <Bilingual zh={knightDuelMessage} en={knightDuelEnglish ?? ''} small />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="mt-5">
        <Bilingual zh="投票结果" en="Voting result" small />
      </div>

      <div className="mt-2 p-4 rounded-xl bg-[var(--color-wolf-surface)] border border-[var(--color-wolf-border)] flex flex-col gap-2.5 text-left">
        <div className="text-[var(--color-moon-bright)] text-sm flex items-center gap-2">
          <strong className="text-[var(--color-moon-dim)]">结果：</strong>
          <span>{voteSummary.message}</span>
          <button
            type="button"
            className="px-1.5 py-0.5 rounded-md border border-[#d97706] text-xs text-[#fde68a] hover:bg-[#78350f] transition-colors"
            onClick={speakDayVoteSummary}
            aria-label="朗读投票结果和票型"
            title="朗读"
          >
            🔊
          </button>
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
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canGoBack ? 'bg-[#475569] text-white hover:brightness-110' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canGoBack}
          onClick={onBack}
        >
          <Bilingual zh="上一步" en="Back" small />
        </button>

        <button
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canGoToVote ? 'bg-[#7c2d12] text-[#ffe7cc] hover:bg-[#9a3412]' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canGoToVote}
          onClick={onGoToVote}
        >
          <Bilingual zh="进入投票" en="Go to voting" small />
        </button>

        {canKnightDuel && (
          <button
            type="button"
            className="px-4 py-3 rounded-xl font-bold text-sm border-none bg-[#4c1d95] text-[#e9d5ff] cursor-pointer hover:bg-[#5b21b6] transition-all"
            onClick={onStartKnightDuel}
          >
            <Bilingual zh="骑士发动决斗" en="Knight: Duel!" small />
          </button>
        )}

        <button
          className={`px-4 py-3 rounded-xl font-bold text-sm border-none cursor-pointer transition-all ${canStartNextNight ? 'bg-[#0f3d3e] text-[#d7fffb] hover:bg-[#145255]' : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] cursor-not-allowed opacity-50'}`}
          disabled={!canStartNextNight}
          onClick={onStartNextNight}
        >
          <Bilingual zh="开始下一夜" en="Start next night" small />
        </button>
      </div>

      <div className="mt-5">
        <Bilingual zh="玩家状态" en="Player status" small />

        <div className="mt-2.5 flex flex-wrap gap-2.5">
          {players.map((player) => {
            const isRevealedIdiot = player.role === '白痴' && player.idiotRevealed;
            return (
              <div
                key={player.id}
                className={`px-3 py-2.5 rounded-2xl border flex items-center gap-2.5 ${player.alive ? 'bg-[var(--color-wolf-card-alt)] border-[var(--color-wolf-border-hi)]' : 'bg-[var(--color-blood-dim)] border-[var(--color-blood)]'}`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="w-12 text-center bg-[var(--color-wolf-card-alt)] border border-[var(--color-wolf-border-hi)] text-[var(--color-moon-bright)] rounded-lg py-1.5 text-sm font-bold whitespace-nowrap box-border">
                    {player.seat}号
                  </div>
                  <div className={`min-w-0 text-sm font-semibold ${isRevealedIdiot ? 'text-[var(--color-blood)]' : 'text-[var(--color-moon-bright)]'}`}>
                    {roleLabel(player)}
                  </div>
                  {canWhiteWolfKingExplode && player.id === whiteWolfKingOwnerId && player.alive && (
                    <button
                      className={`border-none bg-[var(--color-blood)] text-white w-8 h-8 rounded-lg cursor-pointer flex items-center justify-center flex-shrink-0 hover:brightness-110 ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={gameOver}
                      onClick={handleWhiteWolfKingExplode}
                      aria-label="白狼王自爆"
                      title="白狼王自爆"
                    >
                      <span className="text-xl leading-none" aria-hidden="true">💣</span>
                    </button>
                  )}
                </div>

                <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs border ${player.alive ? 'bg-[var(--color-alive-bg)] border-[var(--color-alive-border)] text-[var(--color-alive-text)]' : 'bg-[var(--color-dead-bg)] border-[var(--color-dead-border)] text-[var(--color-dead-text)]'}`}>
                  <span aria-hidden="true" className="leading-none">{player.alive ? '🟢' : '☠️'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
