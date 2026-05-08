import { useEffect } from 'react';
import type { GameState } from './useGameState';
import type { RoleOwnersState } from './useRoleOwners';
import type { NightActionsState } from './useNightActions';
import type { VotingState } from './useVoting';
import type { SpecialEventsState } from './useSpecialEvents';

const STORAGE_KEY = 'wolf-judge-assistant-vote-split-v2';

export interface PersistenceData {
  // 基础游戏状态
  config: GameState['config'];
  phase: GameState['phase'];
  players: GameState['players'];
  firstNightDone: boolean;
  gameOver: boolean;
  gameResult: string | null;

  // Role 所有者
  roleOwners: RoleOwnersState;

  // 夜间行动
  nightActions: NightActionsState;

  // 投票
  voting: VotingState;

  // 特殊事件
  specialEvents: SpecialEventsState;
}

/**
 * 管理游戏状态的 localStorage 持久化
 * 在所有状态变化时自动保存
 */
export function useGameStatePersistence(data: PersistenceData) {
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const clearStorage = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return { clearStorage };
}

/**
 * 从 localStorage 加载游戏状态
 */
export function loadGameStateFromStorage(): PersistenceData | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
