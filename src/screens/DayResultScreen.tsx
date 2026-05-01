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
      return 'Unconfirmed';
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
    <section style={styles.card}>
      <Bilingual zh="天亮结果" en="Day result" />

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
            {hunterShotMessage && hunterShotEnglish && (
              <div style={styles.warningBox}>
                <Bilingual
                  zh={hunterShotMessage}
                  en={hunterShotEnglish}
                  small
                />
              </div>
            )}
            {whiteWolfKingMessage && whiteWolfKingEnglish && (
              <div style={styles.warningBox}>
                <Bilingual
                  zh={whiteWolfKingMessage}
                  en={whiteWolfKingEnglish}
                  small
                />
              </div>
            )}

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

            {wolfBeautyLoverMessage && wolfBeautyLoverEnglish && (
              <div style={styles.warningBox}>
                <Bilingual
                  zh={wolfBeautyLoverMessage}
                  en={wolfBeautyLoverEnglish}
                  small
                />
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

      <div style={{ marginTop: 20 }}>
        <Bilingual zh="投票结果" en="Voting result" small />
      </div>

      <div style={styles.summaryBox}>
        <div>
          <strong>结果：</strong>
          {voteSummary.message}
        </div>

        {unvotedPlayers.length > 0 && (
          <div style={styles.unvotedBox}>
            <strong>未投票：</strong>
            {unvotedPlayers.map((player) => `${player.seat}号`).join('、')}
          </div>
        )}

        <div style={styles.voteChipList}>
          {Object.entries(voteSummary.tally).map(([id, count]) => {
            const player = players.find((p) => p.id === Number(id));
            if (!player) return null;

            return (
              <div key={id} style={styles.voteChip}>
                <strong>{player.seat}号</strong>
                <span>{count}票</span>
              </div>
            );
          })}
        </div>
      </div>

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
            ...styles.voteButton,
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
            ...styles.nextNightButton,
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

      <div style={{ marginTop: 20 }}>
        <Bilingual zh="玩家状态" en="Player status" small />

        <div style={styles.playerList}>
          {players.map((player) => {
            const isRevealedIdiot =
              player.role === '白痴' && player.idiotRevealed;

            return (
              <div key={player.id} style={styles.playerRow}>
                <div style={styles.seatTag}>{player.seat}号</div>

                <div style={styles.nameCell}>
                  <Bilingual zh={player.name} en={player.name} small />
                </div>

                <div
                  style={{
                    ...styles.roleCell,
                    color: isRevealedIdiot ? '#dc2626' : '#111827',
                    fontWeight: isRevealedIdiot ? 700 : 500,
                  }}
                >
                  <div style={styles.roleLine}>
                    <Bilingual
                      zh={roleLabel(player)}
                      en={roleToEnglish(player)}
                      small
                    />

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
    gap: 10,
    textAlign: 'left',
  },

  unvotedBox: {
    padding: '8px 10px',
    borderRadius: 12,
    background: '#fff7ed',
    color: '#9a3412',
    fontSize: 13,
    border: '1px solid #fdba74',
  },

  voteChipList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },

  voteChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 10px',
    borderRadius: 999,
    background: '#eef2ff',
    color: '#3730a3',
    fontSize: 13,
    whiteSpace: 'nowrap',
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

  voteButton: {
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    padding: '12px 16px',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 700,
  },

  nextNightButton: {
    border: 'none',
    background: '#16a34a',
    color: '#fff',
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
    display: 'grid',
    gridTemplateColumns: '50px minmax(70px, 1fr) minmax(120px, 1.2fr) auto',
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
    boxSizing: 'border-box',
    whiteSpace: 'nowrap',
  },

  nameCell: {
    minWidth: 0,
  },

  roleCell: {
    minWidth: 0,
  },

  roleLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },

  aliveBadge: {
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
    whiteSpace: 'nowrap',
    flexShrink: 0,
    textAlign: 'center',
  },

  explodeButton: {
    border: 'none',
    background: '#b91c1c',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: 8,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 12,
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },

  warningBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#fff7ed',
    color: '#9a3412',
    border: '1px solid #fdba74',
  },
};