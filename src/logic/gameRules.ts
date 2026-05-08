/**
 * 游戏业务逻辑纯函数
 * 所有函数都是纯函数，无副作用，便于单元测试
 */

import type { Player, GameConfig } from '../types';
import { isWolf, isVillager, isGod } from '../utils/roleUtils';

// ============================================================================
// 日间逻辑
// ============================================================================

export type DayResultParams = {
  players: Player[];
  wolfTargetId: number | null;
  witchSave: boolean;
  witchPoisonId: number | null;
  guardTargetId: number | null;
};

export type DayResult = {
  deadIds: number[];
  message: string;
  english: string;
};

/**
 * 计算一个夜晚的死亡结果
 * 规则：
 * - 狼人目标 → 死亡（除非被女巫救或守卫保护）
 * - 女巫可以救狼人目标（白痴自救除外）
 * - 女巫可以毒一个人
 * - 守卫可以保护一个人（同时保护和被狼杀则活）
 */
export function calculateDayResult(params: DayResultParams): DayResult {
  const { players, wolfTargetId, witchSave, witchPoisonId, guardTargetId } = params;

  const deadIds = new Set<number>();

  // 狼人目标逻辑
  const isWolfTargetSavedByWitch = wolfTargetId !== null && witchSave;
  const isWolfTargetGuarded = wolfTargetId !== null && guardTargetId === wolfTargetId;

  if (wolfTargetId !== null && !isWolfTargetSavedByWitch && !isWolfTargetGuarded) {
    deadIds.add(wolfTargetId);
  }

  // 女巫毒药逻辑
  if (witchPoisonId !== null && witchPoisonId !== wolfTargetId) {
    deadIds.add(witchPoisonId);
  }

  // 构建返回消息
  const deadPlayers = players.filter((p) => deadIds.has(p.id));

  if (deadPlayers.length === 0) {
    return {
      deadIds: [],
      message: '平安夜',
      english: 'Peaceful night',
    };
  }

  if (deadPlayers.length === 1) {
    return {
      deadIds: [deadPlayers[0].id],
      message: `昨夜死亡：${deadPlayers[0].seat}号`,
      english: `Last night dead: Seat ${deadPlayers[0].seat}`,
    };
  }

  return {
    deadIds: deadPlayers.map((p) => p.id),
    message: `昨夜死亡：${deadPlayers.map((p) => `${p.seat}号`).join('、')}`,
    english: `Last night dead: ${deadPlayers.map((p) => `Seat ${p.seat}`).join(', ')}`,
  };
}

// ============================================================================
// 投票逻辑
// ============================================================================

export type VoteSummaryParams = {
  votes: Record<number, number | null>;
  currentVoters: Player[];
  currentVoteTargets: Player[];
  players: Player[];
  voteRound: 1 | 2;
};

export type VoteSummary = {
  tally: Record<number, number>;
  topTargets: number[];
  maxVotes: number;
  eliminatedId: number | null;
  isTie: boolean;
  shouldRevote: boolean;
  message: string;
  english: string;
};

/**
 * 计算投票结果
 * 规则：
 * - 计票只来自 currentVoters（已活跃），目标只能是 currentVoteTargets
 * - 平票时进行再投票（第二轮）
 * - 第二轮平票则无人出局
 */
export function calculateVoteSummary(params: VoteSummaryParams): VoteSummary {
  const { votes, currentVoters, currentVoteTargets, players, voteRound } = params;

  const tally: Record<number, number> = {};

  // 计票
  currentVoters.forEach((player) => {
    const targetId = votes[player.id];
    if (targetId != null && currentVoteTargets.some((target) => target.id === targetId)) {
      tally[targetId] = (tally[targetId] || 0) + 1;
    }
  });

  // 没有有效投票
  const entries = Object.entries(tally).map(([targetId, count]) => ({
    targetId: Number(targetId),
    count,
  }));

  if (entries.length === 0) {
    return {
      tally,
      topTargets: [],
      maxVotes: 0,
      eliminatedId: null,
      isTie: false,
      shouldRevote: false,
      message: voteRound === 1 ? '尚未产生有效投票' : '尚未产生有效再投票',
      english: voteRound === 1 ? 'No valid votes yet' : 'No valid revotes yet',
    };
  }

  // 找出得票最多的
  const maxVotes = Math.max(...entries.map((e) => e.count));
  const topTargets = entries.filter((e) => e.count === maxVotes).map((e) => e.targetId);

  // 一票胜出
  if (topTargets.length === 1) {
    const eliminated = players.find((p) => p.id === topTargets[0]) ?? null;
    return {
      tally,
      topTargets,
      maxVotes,
      eliminatedId: topTargets[0],
      isTie: false,
      shouldRevote: false,
      message: `投票出局：${eliminated?.seat}号`,
      english: `Voted out: Seat ${eliminated?.seat ?? ''}`,
    };
  }

  // 平票
  if (voteRound === 1) {
    return {
      tally,
      topTargets,
      maxVotes,
      eliminatedId: null,
      isTie: true,
      shouldRevote: true,
      message: `平票，进入第二轮投票：${topTargets
        .map((id) => {
          const p = players.find((player) => player.id === id);
          return p ? `${p.seat}号` : '';
        })
        .filter(Boolean)
        .join('、')}`,
      english: 'Tie vote, proceed to revote',
    };
  }

  // 第二轮平票
  return {
    tally,
    topTargets,
    maxVotes,
    eliminatedId: null,
    isTie: true,
    shouldRevote: false,
    message: '第二轮仍平票，无人出局',
    english: 'Revote tied, no one is eliminated',
  };
}

// ============================================================================
// 白痴逻辑
// ============================================================================

export type IdiotVoteResultParams = {
  eliminatedId: number | null;
  players: Player[];
  idiotRevealed: boolean;
};

export type IdiotVoteResult =
  | { type: 'normal'; nextPlayers: Player[] }
  | {
      type: 'idiot-triggered';
      nextPlayers: Player[];
      message: string;
      english: string;
    }
  | {
      type: 'revealed-idiot-protected';
      message: string;
      english: string;
    };

/**
 * 检查白痴特殊逻辑
 * 规则：
 * - 未翻牌白痴被投出 → 翻牌，无人出局
 * - 已翻牌白痴被投出 → 禁止，无人出局
 */
export function checkIdiotLogic(params: IdiotVoteResultParams): IdiotVoteResult {
  const { eliminatedId, players, idiotRevealed } = params;

  const eliminatedPlayer = eliminatedId ? players.find((p) => p.id === eliminatedId) : null;

  // 检查是否是白痴
  if (eliminatedPlayer?.role !== '白痴') {
    return {
      type: 'normal',
      nextPlayers: eliminatedId
        ? players.map((p) => (p.id === eliminatedId ? { ...p, alive: false } : p))
        : players,
    };
  }

  // 未翻牌白痴 → 翻牌
  if (!eliminatedPlayer.idiotRevealed) {
    const nextPlayers = players.map((p) =>
      p.id === eliminatedPlayer.id ? { ...p, idiotRevealed: true } : p
    );
    return {
      type: 'idiot-triggered',
      nextPlayers,
      message: `白痴翻牌：${eliminatedPlayer.seat}号免于出局，本轮无人被放逐`,
      english: `Idiot revealed: Seat ${eliminatedPlayer.seat} survives, no one is eliminated this round`,
    };
  }

  // 已翻牌白痴 → 保护
  return {
    type: 'revealed-idiot-protected',
    message: `已翻牌白痴不能被再次放逐，本轮无人被放逐`,
    english: `A revealed Idiot cannot be voted out again. No one is eliminated this round`,
  };
}

// ============================================================================
// 游戏结束判定
// ============================================================================

export type GameOverCheckParams = {
  players: Player[];
};

export type GameOverResult =
  | { gameOver: false }
  | {
      gameOver: true;
      result: string;
      english: string;
    };

/**
 * 检查游戏是否结束
 * 规则：
 * - 狼人全灭 → 好人阵营胜利
 * - 村民全灭 → 狼人阵营胜利
 * - 所有神全灭 → 狼人阵营胜利
 */
export function checkGameOver(params: GameOverCheckParams): GameOverResult {
  const { players } = params;

  const aliveWolves = players.filter((p) => p.alive && isWolf(p.role)).length;
  const aliveVillagers = players.filter((p) => p.alive && isVillager(p.role)).length;
  const aliveGods = players.filter((p) => p.alive && isGod(p.role)).length;

  if (aliveWolves === 0) {
    return {
      gameOver: true,
      result: '好人阵营胜利',
      english: 'Good team wins',
    };
  }

  if (aliveVillagers === 0 || aliveGods === 0) {
    return {
      gameOver: true,
      result: '狼人阵营胜利',
      english: 'Wolves win',
    };
  }

  return { gameOver: false };
}

// ============================================================================
// 白狼王自爆逻辑
// ============================================================================

export type WhiteWolfKingExplodeParams = {
  players: Player[];
  whiteWolfKingPlayerId: number;
  targetId: number;
};

export type WhiteWolfKingExplodeResult = {
  nextPlayers: Player[];
  message: string;
  english: string;
  shouldSkipVoting: boolean;
};

/**
 * 白狼王自爆
 * 规则：
 * - 白狼王和目标同时死亡
 * - 当天投票直接跳过
 */
export function applyWhiteWolfKingExplode(
  params: WhiteWolfKingExplodeParams
): WhiteWolfKingExplodeResult {
  const { players, whiteWolfKingPlayerId, targetId } = params;

  const whiteWolfKing = players.find((p) => p.id === whiteWolfKingPlayerId);
  const target = players.find((p) => p.id === targetId);

  const nextPlayers = players.map((player) => {
    if (player.id === whiteWolfKingPlayerId || player.id === targetId) {
      return { ...player, alive: false };
    }
    return player;
  });

  return {
    nextPlayers,
    message: `白狼王 ${whiteWolfKing?.seat}号 自爆带走 ${target?.seat}号`,
    english: `White Wolf King (Seat ${whiteWolfKing?.seat}) exploded and took Seat ${target?.seat}`,
    shouldSkipVoting: true,
  };
}

// ============================================================================
// 猎人逻辑
// ============================================================================

export type HunterShotParams = {
  players: Player[];
  hunterPlayerId: number;
  targetId: number;
};

export type HunterShotResult = {
  nextPlayers: Player[];
  message: string;
  english: string;
};

/**
 * 猎人开枪
 * 规则：
 * - 猎人可以射杀一个活跃的目标（不能是自己）
 */
export function applyHunterShot(params: HunterShotParams): HunterShotResult {
  const { players, targetId } = params;

  const target = players.find((p) => p.id === targetId);

  const nextPlayers = players.map((player) =>
    player.id === targetId ? { ...player, alive: false } : player
  );

  return {
    nextPlayers,
    message: `猎人开枪带走：${target?.seat}号`,
    english: `Hunter shot: Seat ${target?.seat} was taken down`,
  };
}

// ============================================================================
// 狼美人殉情逻辑
// ============================================================================

export type WolfBeautyLoverDeathParams = {
  players: Player[];
  wolfBeautyPlayerId: number | null;
  charmedTargetId: number | null;
};

export type WolfBeautyLoverDeathResult =
  | { triggered: false; nextPlayers: Player[] }
  | {
      triggered: true;
      nextPlayers: Player[];
      message: string;
      english: string;
    };

/**
 * 狼美人殉情
 * 规则：
 * - 狼美人死亡时，被魅惑的目标也会死亡
 * - 被魅惑的目标必须还活着
 */
export function applyWolfBeautyLoverDeath(
  params: WolfBeautyLoverDeathParams
): WolfBeautyLoverDeathResult {
  const { players, wolfBeautyPlayerId, charmedTargetId } = params;

  const wolfBeauty = players.find((p) => p.id === wolfBeautyPlayerId);
  const charmedPlayer = players.find((p) => p.id === charmedTargetId);

  // 狼美人必须死亡
  if (!wolfBeauty || wolfBeauty.alive) {
    return { triggered: false, nextPlayers: players };
  }

  // 被魅惑的目标必须活着
  if (!charmedPlayer || !charmedPlayer.alive) {
    return { triggered: false, nextPlayers: players };
  }

  const nextPlayers = players.map((p) =>
    p.id === charmedPlayer.id ? { ...p, alive: false } : p
  );

  return {
    triggered: true,
    nextPlayers,
    message: `狼美人殉情：${charmedPlayer.seat}号随狼美人一同出局`,
    english: `Wolf Beauty lover death: Seat ${charmedPlayer.seat} dies with the Wolf Beauty`,
  };
}
