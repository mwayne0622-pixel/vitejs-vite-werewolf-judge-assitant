import type { Player, GameConfig, Phase, Role } from '../types';
import { getNextFirstNightPhase, finalizeUnassignedVillagers } from '../utils/gameFlow';

/**
 * 为标准 role（预言家、女巫、守卫等）生成 commit handler
 * 模式：draft owner → confirmed owner，清除其他相同 role，进入下一个 phase
 */
export function createStandardRoleCommitHandler(
  roleName: Role,
  draftOwnerId: number | null,
  config: GameConfig,
  players: Player[],
  callbacks: {
    setPlayers: (fn: (prev: Player[]) => Player[]) => void;
    setRoleOwnerId: (id: number | null) => void;
    setDraftRoleOwnerId: (id: number | null) => void;
    setPhase: (phase: Phase) => void;
    setFirstNightDone: (done: boolean) => void;
  }
) {
  return () => {
    if (draftOwnerId === null) return;

    // 获取该 role 对应的首夜 phase
    const rolePhaseMap: Record<Role, Phase> = {
      '预言家': 'first-night-seer',
      '女巫': 'first-night-witch',
      '守卫': 'first-night-guard',
      '猎人': 'first-night-hunter',
      '白痴': 'first-night-idiot',
      '熊': 'first-night-bear',
      '骑士': 'first-night-knight',
      '隐狼': 'first-night-hidden-wolf',
      '狼人': 'first-night-wolf', // 不会用到
      '白狼王': 'first-night-white-wolf-king', // 不会用到
      '狼美人': 'first-night-wolf-beauty', // 不会用到
      '村民': 'setup', // 不会用到
    };

    const currentPhase = rolePhaseMap[roleName];
    if (!currentPhase) return;

    const nextPhase = getNextFirstNightPhase(config, currentPhase);

    // 更新 players：新 owner 获得这个 role，其他相同 role 清除
    const nextPlayers: Player[] = players.map((p): Player => {
      if (p.role === roleName && p.id !== draftOwnerId) {
        return { ...p, role: null };
      }
      if (p.id === draftOwnerId) {
        return { ...p, role: roleName };
      }
      return p;
    });

    // 如果是最后一个 role，需要 finalize 并标记首夜完成
    if (nextPhase === 'day-result') {
      callbacks.setPlayers(() => finalizeUnassignedVillagers(nextPlayers));
      callbacks.setRoleOwnerId(draftOwnerId);
      callbacks.setFirstNightDone(true);
      callbacks.setPhase('day-result');
      return;
    }

    // 否则继续到下一个 phase
    callbacks.setPlayers(() => nextPlayers);
    callbacks.setRoleOwnerId(draftOwnerId);
    callbacks.setPhase(nextPhase);
  };
}

/**
 * 为狼人生成 handler
 * 特殊性：从 selectedWolfIds 而非 draft 获取，需要合并白狼王等逻辑
 */
export function createWolvesCommitHandler(
  selectedWolfIds: number[],
  wolfTargetId: number | null,
  config: GameConfig,
  players: Player[],
  callbacks: {
    setPlayers: (fn: (prev: Player[]) => Player[]) => void;
    setSelectedWolfIds: (ids: number[]) => void;
    setPhase: (phase: Phase) => void;
  }
) {
  return () => {
    if (selectedWolfIds.length === 0 || wolfTargetId === null) return;

    const nextPlayers = players.map((p): Player => {
      if (selectedWolfIds.includes(p.id)) return { ...p, role: '狼人' };
      if (p.role === '狼人') return { ...p, role: null };
      return p;
    });

    callbacks.setPlayers(() => nextPlayers);

    const nextPhase = getNextFirstNightPhase(config, 'first-night-wolf');

    callbacks.setPhase(nextPhase);
  };
}

/**
 * 为白狼王生成 handler
 * 特殊性：从多个狼人中选一个变成白狼王，其他保持狼人
 */
export function createWhiteWolfKingCommitHandler(
  selectedWolfIds: number[],
  draftWhiteWolfKingOwnerId: number | null,
  config: GameConfig,
  players: Player[],
  callbacks: {
    setPlayers: (fn: (prev: Player[]) => Player[]) => void;
    setWhiteWolfKingOwnerId: (id: number | null) => void;
    setPhase: (phase: Phase) => void;
    setFirstNightDone: (done: boolean) => void;
  }
) {
  return () => {
    if (draftWhiteWolfKingOwnerId === null) return;

    const nextPhase = getNextFirstNightPhase(config, 'first-night-white-wolf-king');

    const nextPlayers: Player[] = players.map((p): Player => {
      if (!selectedWolfIds.includes(p.id)) return p;

      return {
        ...p,
        role: p.id === draftWhiteWolfKingOwnerId ? '白狼王' : '狼人',
      };
    });

    if (nextPhase === 'day-result') {
      callbacks.setPlayers(() => finalizeUnassignedVillagers(nextPlayers));
      callbacks.setWhiteWolfKingOwnerId(draftWhiteWolfKingOwnerId);
      callbacks.setFirstNightDone(true);
      callbacks.setPhase('day-result');
      return;
    }

    callbacks.setPlayers(() => nextPlayers);
    callbacks.setWhiteWolfKingOwnerId(draftWhiteWolfKingOwnerId);
    callbacks.setPhase(nextPhase);
  };
}

/**
 * 为狼美人生成 handler
 * 特殊性：从多个狼人中选一个变成狼美人，并设置魅惑目标
 */
export function createWolfBeautyCommitHandler(
  selectedWolfIds: number[],
  draftWhiteWolfKingOwnerId: number | null,
  draftWolfBeautyOwnerId: number | null,
  wolfBeautyCharmTargetId: number | null,
  config: GameConfig,
  players: Player[],
  callbacks: {
    setPlayers: (fn: (prev: Player[]) => Player[]) => void;
    setWolfBeautyOwnerId: (id: number | null) => void;
    setLastWolfBeautyCharmTargetId: (id: number | null) => void;
    setPhase: (phase: Phase) => void;
    setFirstNightDone: (done: boolean) => void;
  }
) {
  return () => {
    if (draftWolfBeautyOwnerId === null) return;

    const nextPhase = getNextFirstNightPhase(config, 'first-night-wolf-beauty');

    const nextPlayers: Player[] = players.map((p): Player => {
      if (!selectedWolfIds.includes(p.id)) return p;

      if (p.id === draftWolfBeautyOwnerId) {
        return { ...p, role: '狼美人' };
      }

      if (p.id === draftWhiteWolfKingOwnerId) {
        return { ...p, role: '白狼王' };
      }

      return { ...p, role: '狼人' };
    });

    if (nextPhase === 'day-result') {
      callbacks.setPlayers(() => finalizeUnassignedVillagers(nextPlayers));
      callbacks.setWolfBeautyOwnerId(draftWolfBeautyOwnerId);
      callbacks.setLastWolfBeautyCharmTargetId(wolfBeautyCharmTargetId);
      callbacks.setFirstNightDone(true);
      callbacks.setPhase('day-result');
      return;
    }

    callbacks.setPlayers(() => nextPlayers);
    callbacks.setWolfBeautyOwnerId(draftWolfBeautyOwnerId);
    callbacks.setLastWolfBeautyCharmTargetId(wolfBeautyCharmTargetId);
    callbacks.setPhase(nextPhase);
  };
}
