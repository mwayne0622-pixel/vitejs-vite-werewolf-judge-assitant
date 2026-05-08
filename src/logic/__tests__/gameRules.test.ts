/**
 * 游戏规则单元测试
 * 验证所有游戏逻辑的正确性
 */

import { describe, it, expect } from 'vitest';
import type { Player } from '../../types';
import {
  calculateDayResult,
  calculateVoteSummary,
  checkIdiotLogic,
  checkGameOver,
  applyWhiteWolfKingExplode,
  applyHunterShot,
  applyWolfBeautyLoverDeath,
} from '../gameRules';

// ============================================================================
// 测试工具函数
// ============================================================================

function createMockPlayer(overrides?: Partial<Player>): Player {
  return {
    id: 1,
    seat: 1,
    name: '玩家1',
    role: null,
    alive: true,
    idiotRevealed: false,
    ...overrides,
  };
}

function createPlayers(...roles: Array<string | null>): Player[] {
  return roles.map((role, index) =>
    createMockPlayer({
      id: index + 1,
      seat: index + 1,
      role: (role as any) || null,
    })
  );
}

// ============================================================================
// calculateDayResult 测试
// ============================================================================

describe('calculateDayResult', () => {
  it('平安夜：没有狼人目标', () => {
    const players = createPlayers('村民', '村民', '预言家');
    const result = calculateDayResult({
      players,
      wolfTargetId: null,
      witchSave: false,
      witchPoisonId: null,
      guardTargetId: null,
    });

    expect(result.deadIds).toEqual([]);
    expect(result.message).toBe('平安夜');
  });

  it('狼人杀死目标', () => {
    const players = createPlayers('村民', '村民', '预言家');
    const result = calculateDayResult({
      players,
      wolfTargetId: 1,
      witchSave: false,
      witchPoisonId: null,
      guardTargetId: null,
    });

    expect(result.deadIds).toContain(1);
    expect(result.message).toContain('1号');
  });

  it('女巫救狼人目标', () => {
    const players = createPlayers('村民', '村民', '女巫');
    const result = calculateDayResult({
      players,
      wolfTargetId: 1,
      witchSave: true,
      witchPoisonId: null,
      guardTargetId: null,
    });

    expect(result.deadIds).not.toContain(1);
    expect(result.message).toBe('平安夜');
  });

  it('女巫毒杀玩家', () => {
    const players = createPlayers('村民', '村民', '女巫');
    const result = calculateDayResult({
      players,
      wolfTargetId: null,
      witchSave: false,
      witchPoisonId: 2,
      guardTargetId: null,
    });

    expect(result.deadIds).toContain(2);
    expect(result.message).toContain('2号');
  });

  it('守卫保护狼人目标', () => {
    const players = createPlayers('村民', '村民', '守卫');
    const result = calculateDayResult({
      players,
      wolfTargetId: 1,
      witchSave: false,
      witchPoisonId: null,
      guardTargetId: 1,
    });

    expect(result.deadIds).not.toContain(1);
    expect(result.message).toBe('平安夜');
  });

  it('女巫同时救和毒', () => {
    const players = createPlayers('村民', '村民', '女巫');
    const result = calculateDayResult({
      players,
      wolfTargetId: 1,
      witchSave: true,
      witchPoisonId: 2,
      guardTargetId: null,
    });

    expect(result.deadIds).toContain(2);
    expect(result.deadIds).not.toContain(1);
  });

  it('多人死亡', () => {
    const players = createPlayers('村民', '村民', '村民', '女巫');
    const result = calculateDayResult({
      players,
      wolfTargetId: 1,
      witchSave: false,
      witchPoisonId: 2,
      guardTargetId: null,
    });

    expect(result.deadIds).toHaveLength(2);
    expect(result.deadIds).toContain(1);
    expect(result.deadIds).toContain(2);
    expect(result.message).toContain('1号');
    expect(result.message).toContain('2号');
  });
});

// ============================================================================
// calculateVoteSummary 测试
// ============================================================================

describe('calculateVoteSummary', () => {
  it('一票胜出', () => {
    const players = createPlayers('村民', '村民', '村民');
    const voters = [players[0], players[1]];
    const targets = [players[1], players[2]];

    const result = calculateVoteSummary({
      votes: { 1: 2, 2: 2 }, // 玩家1和2都投给玩家2
      currentVoters: voters,
      currentVoteTargets: targets,
      players,
      voteRound: 1,
    });

    expect(result.eliminatedId).toBe(2);
    expect(result.isTie).toBe(false);
    expect(result.shouldRevote).toBe(false);
  });

  it('第一轮平票触发再投票', () => {
    const players = createPlayers('村民', '村民', '村民');
    const voters = [players[0], players[1]];
    const targets = [players[1], players[2]];

    const result = calculateVoteSummary({
      votes: { 1: 2, 2: 3 }, // 玩家1投给2，玩家2投给3
      currentVoters: voters,
      currentVoteTargets: targets,
      players,
      voteRound: 1,
    });

    expect(result.eliminatedId).toBeNull();
    expect(result.isTie).toBe(true);
    expect(result.shouldRevote).toBe(true);
    expect(result.topTargets).toContain(2);
    expect(result.topTargets).toContain(3);
  });

  it('第二轮平票无人出局', () => {
    const players = createPlayers('村民', '村民', '村民');
    const voters = [players[0], players[1]];
    const targets = [players[1], players[2]];

    const result = calculateVoteSummary({
      votes: { 1: 2, 2: 3 },
      currentVoters: voters,
      currentVoteTargets: targets,
      players,
      voteRound: 2,
    });

    expect(result.eliminatedId).toBeNull();
    expect(result.isTie).toBe(true);
    expect(result.shouldRevote).toBe(false);
  });

  it('忽略无效投票', () => {
    const players = createPlayers('村民', '村民', '村民');
    const voters = [players[0]];
    const targets = [players[2]];

    const result = calculateVoteSummary({
      votes: { 1: 999 }, // 投给不存在的玩家
      currentVoters: voters,
      currentVoteTargets: targets,
      players,
      voteRound: 1,
    });

    expect(result.eliminatedId).toBeNull();
    expect(result.topTargets).toHaveLength(0);
  });

  it('未投票的玩家不计入', () => {
    const players = createPlayers('村民', '村民', '村民');
    const voters = [players[0], players[1]];
    const targets = [players[1], players[2]];

    const result = calculateVoteSummary({
      votes: { 1: 2 }, // 玩家2未投票
      currentVoters: voters,
      currentVoteTargets: targets,
      players,
      voteRound: 1,
    });

    expect(result.maxVotes).toBe(1);
  });

  it('三人平票', () => {
    const players = createPlayers('村民', '村民', '村民', '村民');
    const voters = [players[0], players[1], players[2]];
    const targets = players.slice(1);

    const result = calculateVoteSummary({
      votes: { 1: 2, 2: 3, 3: 4 },
      currentVoters: voters,
      currentVoteTargets: targets,
      players,
      voteRound: 1,
    });

    expect(result.isTie).toBe(true);
    expect(result.shouldRevote).toBe(true);
    expect(result.topTargets).toHaveLength(3);
  });
});

// ============================================================================
// checkIdiotLogic 测试
// ============================================================================

describe('checkIdiotLogic', () => {
  it('未翻牌白痴被投出时翻牌', () => {
    const players = createPlayers('白痴', '村民', '村民');
    players[0].idiotRevealed = false;

    const result = checkIdiotLogic({
      eliminatedId: 1,
      players,
      idiotRevealed: false,
    });

    expect(result.type).toBe('idiot-triggered');
    expect((result as any).nextPlayers[0].idiotRevealed).toBe(true);
  });

  it('已翻牌白痴被投出时保护', () => {
    const players = createPlayers('白痴', '村民', '村民');
    players[0].idiotRevealed = true;

    const result = checkIdiotLogic({
      eliminatedId: 1,
      players,
      idiotRevealed: true,
    });

    expect(result.type).toBe('revealed-idiot-protected');
  });

  it('非白痴正常消亡', () => {
    const players = createPlayers('村民', '村民', '村民');

    const result = checkIdiotLogic({
      eliminatedId: 1,
      players,
      idiotRevealed: false,
    });

    expect(result.type).toBe('normal');
    expect((result as any).nextPlayers[0].alive).toBe(false);
  });

  it('无人被消亡时', () => {
    const players = createPlayers('村民', '村民', '村民');

    const result = checkIdiotLogic({
      eliminatedId: null,
      players,
      idiotRevealed: false,
    });

    expect(result.type).toBe('normal');
    expect((result as any).nextPlayers[0].alive).toBe(true);
  });
});

// ============================================================================
// checkGameOver 测试
// ============================================================================

describe('checkGameOver', () => {
  it('狼人全灭 → 好人胜利', () => {
    const players = createPlayers('狼人', '狼人', '村民');
    players[0].alive = false;
    players[1].alive = false;

    const result = checkGameOver({ players });

    expect(result.gameOver).toBe(true);
    expect((result as any).result).toContain('好人');
  });

  it('村民全灭 → 狼人胜利', () => {
    const players = createPlayers('狼人', '村民', '村民');
    players[1].alive = false;
    players[2].alive = false;

    const result = checkGameOver({ players });

    expect(result.gameOver).toBe(true);
    expect((result as any).result).toContain('狼人');
  });

  it('所有神全灭 → 狼人胜利', () => {
    const players = createPlayers('狼人', '预言家', '女巫');
    players[1].alive = false;
    players[2].alive = false;

    const result = checkGameOver({ players });

    expect(result.gameOver).toBe(true);
    expect((result as any).result).toContain('狼人');
  });

  it('游戏未结束', () => {
    const players = createPlayers('狼人', '村民', '预言家');

    const result = checkGameOver({ players });

    expect(result.gameOver).toBe(false);
  });

  it('只有狼人活着', () => {
    const players = createPlayers('狼人', '村民', '预言家');
    players[1].alive = false;
    players[2].alive = false;

    const result = checkGameOver({ players });

    expect(result.gameOver).toBe(true);
  });
});

// ============================================================================
// applyWhiteWolfKingExplode 测试
// ============================================================================

describe('applyWhiteWolfKingExplode', () => {
  it('白狼王自爆', () => {
    const players = createPlayers('白狼王', '村民', '村民');

    const result = applyWhiteWolfKingExplode({
      players,
      whiteWolfKingPlayerId: 1,
      targetId: 2,
    });

    expect(result.nextPlayers[0].alive).toBe(false); // 白狼王
    expect(result.nextPlayers[1].alive).toBe(false); // 目标
    expect(result.shouldSkipVoting).toBe(true);
  });

  it('自爆消息正确', () => {
    const players = createPlayers('白狼王', '村民', '村民');

    const result = applyWhiteWolfKingExplode({
      players,
      whiteWolfKingPlayerId: 1,
      targetId: 3,
    });

    expect(result.message).toContain('1号');
    expect(result.message).toContain('3号');
  });
});

// ============================================================================
// applyHunterShot 测试
// ============================================================================

describe('applyHunterShot', () => {
  it('猎人射杀目标', () => {
    const players = createPlayers('猎人', '村民', '村民');

    const result = applyHunterShot({
      players,
      hunterPlayerId: 1,
      targetId: 2,
    });

    expect(result.nextPlayers[1].alive).toBe(false);
  });

  it('射杀消息正确', () => {
    const players = createPlayers('猎人', '村民', '村民');

    const result = applyHunterShot({
      players,
      hunterPlayerId: 1,
      targetId: 3,
    });

    expect(result.message).toContain('3号');
  });
});

// ============================================================================
// applyWolfBeautyLoverDeath 测试
// ============================================================================

describe('applyWolfBeautyLoverDeath', () => {
  it('狼美人死亡时魅惑目标陪死', () => {
    const players = createPlayers('狼美人', '村民', '村民');
    players[0].alive = false;

    const result = applyWolfBeautyLoverDeath({
      players,
      wolfBeautyPlayerId: 1,
      charmedTargetId: 2,
    });

    expect(result.triggered).toBe(true);
    expect(result.nextPlayers[1].alive).toBe(false);
  });

  it('狼美人未死亡时不触发', () => {
    const players = createPlayers('狼美人', '村民', '村民');

    const result = applyWolfBeautyLoverDeath({
      players,
      wolfBeautyPlayerId: 1,
      charmedTargetId: 2,
    });

    expect(result.triggered).toBe(false);
  });

  it('魅惑目标已死亡时不触发', () => {
    const players = createPlayers('狼美人', '村民', '村民');
    players[0].alive = false;
    players[1].alive = false;

    const result = applyWolfBeautyLoverDeath({
      players,
      wolfBeautyPlayerId: 1,
      charmedTargetId: 2,
    });

    expect(result.triggered).toBe(false);
  });

  it('无魅惑目标时不触发', () => {
    const players = createPlayers('狼美人', '村民', '村民');
    players[0].alive = false;

    const result = applyWolfBeautyLoverDeath({
      players,
      wolfBeautyPlayerId: 1,
      charmedTargetId: null,
    });

    expect(result.triggered).toBe(false);
  });
});
