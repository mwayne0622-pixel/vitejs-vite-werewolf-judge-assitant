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

  wolfTargetId: number | null;
  seerCheckId: number | null;
  witchSave: boolean;
  witchPoisonId: number | null;
  guardTargetId: number | null;

  voteSummary: VoteSummary;
  voteApplied: boolean;

  dayApplied: boolean;
  gameOver: boolean;
  gameResult: string | null;

  whiteWolfKingOwnerId: number | null;
  canWhiteWolfKingExplode: boolean;

  bearInfo: BearInfo | null;

  onStartWhiteWolfKingExplode: () => void;

  onBack: () => void;
  onApplyDayResult: () => void;
  onGoToVote: () => void;
  onApplyVote: () => void;
  onStartNextNight: () => void;
  onReset: () => void;
};

function roleLabel(player: Player) {
  if (player.role === '白痴' && player.idiotRevealed) {
    return '白痴（已翻牌）';
  }
  return player.role ?? '未确认';
}

function roleToEnglish(player: Player) {
  if (player.role === '白痴' && player.idiotRevealed) {
    return 'Idiot (Revealed)';
  }

  switch (player.role) {
    case '狼人':
      return 'Wolf';
    case '白狼王':
      return 'White Wolf King';
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
  gameOver,
  gameResult,

  whiteWolfKingOwnerId,
  canWhiteWolfKingExplode,

  bearInfo,

  onBack,
  onApplyDayResult,
  onGoToVote,
  onApplyVote,
  onStartNextNight,
  onStartWhiteWolfKingExplode,
  onReset,
}: Props) {
  const canGoBack = !gameOver && !dayApplied;
  const canApplyNightDeaths = !gameOver && !dayApplied;
  const canGoToVote = !gameOver && dayApplied && !voteApplied;
  const canStartNextNight = !gameOver && voteApplied;

  return (
    <section style={styles.card}>
      <Bilingual zh="天亮结果" en="Day result" />

      {/* 法官宣读信息 */}
      <div style={{ marginTop: 12 }}>
        <Bilingual zh="法官宣读信息" en="Judge announcements" small />
      </div>

      <div style={styles.announcementStack}>
        {gameOver ? (
          <div style={styles.announcementBox}>
            <Bilingual
              zh={gameResult ?? '游戏结束'}
              en={gameResult ?? 'Game over'}
            />
          </div>
        ) : (
          <>
            <div style={styles.announcementBox}>
              <Bilingual zh={dayResult.message} en={dayResult.english} />
            </div>

            {bearInfo && (
              <div style={styles.announcementBox}>
                <Bilingual zh={bearInfo.message} en={bearInfo.english} />

                {bearInfo.bearPlayer && bearInfo.bearPlayer.alive && (
                  <div style={styles.announcementDetail}>
                    <Bilingual
                      zh={`熊：${bearInfo.bearPlayer.seat}号 ｜ 左邻居：${bearInfo.leftNeighbor
                        ? `${bearInfo.leftNeighbor.seat}号`
                        : '无'
                        } ｜ 右邻居：${bearInfo.rightNeighbor
                          ? `${bearInfo.rightNeighbor.seat}号`
                          : '无'
                        }`}
                      en={`Bear: Seat ${bearInfo.bearPlayer.seat
                        } | Left neighbor: ${bearInfo.leftNeighbor
                          ? `Seat ${bearInfo.leftNeighbor.seat}`
                          : 'None'
                        } | Right neighbor: ${bearInfo.rightNeighbor
                          ? `Seat ${bearInfo.rightNeighbor.seat}`
                          : 'None'
                        }`}
                      small
                    />
                  </div>
                )}
              </div>
            )}

            {canWhiteWolfKingExplode && (
              <div style={styles.announcementBox}>
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
        <button
          style={{
            ...styles.secondaryButton,
            opacity: canGoBack ? 1 : 0.5,
            cursor: canGoBack ? 'pointer' : 'not-allowed',
          }}
          disabled={!canGoBack}
          onClick={onBack}
        >
          <Bilingual zh="上一步" en="Back" small />
        </button>

        <button
          style={{
            ...styles.primaryButton,
            opacity: canApplyNightDeaths ? 1 : 0.5,
            cursor: canApplyNightDeaths ? 'pointer' : 'not-allowed',
          }}
          disabled={!canApplyNightDeaths}
          onClick={onApplyDayResult}
        >
          <Bilingual zh="应用夜间死亡" en="Apply night deaths" small />
        </button>

        <button
          style={{
            ...styles.primaryButton,
            opacity: canGoToVote ? 1 : 0.5,
            cursor: canGoToVote ? 'pointer' : 'not-allowed',
          }}
          disabled={!canGoToVote}
          onClick={onGoToVote}
        >
          <Bilingual zh="进入投票" en="Go to voting" small />
        </button>

        <button
          style={{
            ...styles.primaryButton,
            opacity: canStartNextNight ? 1 : 0.5,
            cursor: canStartNextNight ? 'pointer' : 'not-allowed',
          }}
          disabled={!canStartNextNight}
          onClick={onStartNextNight}
        >
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
          {players.map((player) => {
            const isRevealedIdiot =
              player.role === '白痴' && player.idiotRevealed;

            return (
              <div key={player.id} style={styles.playerRow}>
                <div style={styles.seatTag}>{player.seat}号</div>

                <div style={{ minWidth: 120 }}>
                  <Bilingual zh={player.name} en={player.name} small />
                </div>

                <div
                  style={{
                    minWidth: 120,
                    color: isRevealedIdiot ? '#dc2626' : '#111827',
                    fontWeight: isRevealedIdiot ? 700 : 500,
                  }}
                >
                  <Bilingual
                    zh={roleLabel(player)}
                    en={roleToEnglish(player)}
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

                {canWhiteWolfKingExplode &&
                  player.id === whiteWolfKingOwnerId &&
                  player.alive && (
                    <button
                      style={{
                        ...styles.explodeButton,
                        opacity: gameOver ? 0.5 : 1,
                        cursor: gameOver ? 'not-allowed' : 'pointer',
                      }}
                      disabled={gameOver}
                      onClick={onStartWhiteWolfKingExplode}
                    >
                      <Bilingual zh="自爆" en="Explode" small />
                    </button>
                  )}
              </div>
            );
          })}
        </div>
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

  announcementStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 10,
  },

  announcementBox: {
    padding: 16,
    borderRadius: 16,
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #fcd34d',
  },

  announcementDetail: {
    marginTop: 8,
    opacity: 0.9,
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

  explodeButton: {
    border: 'none',
    background: '#b91c1c',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: 10,
    cursor: 'pointer',
    fontWeight: 700,
    marginLeft: 'auto',
  },
};