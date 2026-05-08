import { useState } from 'react';
import type { GameConfig, Phase, Player } from '../types';

const STORAGE_KEY = 'wolf-judge-assistant-vote-split-v2';

export interface GameState {
  config: GameConfig;
  phase: Phase;
  players: Player[];
  firstNightDone: boolean;
  gameOver: boolean;
  gameResult: string | null;
}

let _cached: Record<string, unknown> | null | undefined;
function getSavedOnce(): Record<string, unknown> | null {
  if (_cached === undefined) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _cached = raw ? JSON.parse(raw) : null;
    } catch {
      _cached = null;
    }
  }
  return _cached;
}

/**
 * 管理游戏的基础状态（配置、阶段、玩家）
 * 包括 localStorage 持久化
 */
export function useGameState(initialState: GameState) {
  const [config, setConfig] = useState<GameConfig>(() => (getSavedOnce()?.config as GameConfig) ?? initialState.config);
  const [phase, setPhase] = useState<Phase>(() => (getSavedOnce()?.phase as Phase) ?? initialState.phase);
  const [players, setPlayers] = useState<Player[]>(() => (getSavedOnce()?.players as Player[]) ?? initialState.players);
  const [firstNightDone, setFirstNightDone] = useState<boolean>(() => {
    const s = getSavedOnce();
    return s?.firstNightDone !== undefined ? Boolean(s.firstNightDone) : initialState.firstNightDone;
  });
  const [gameOver, setGameOver] = useState<boolean>(() => {
    const s = getSavedOnce();
    return s?.gameOver !== undefined ? Boolean(s.gameOver) : initialState.gameOver;
  });
  const [gameResult, setGameResult] = useState<string | null>(() => {
    const s = getSavedOnce();
    return s?.gameResult !== undefined ? (s.gameResult as string | null) : initialState.gameResult;
  });

  return {
    config,
    setConfig,
    phase,
    setPhase,
    players,
    setPlayers,
    firstNightDone,
    setFirstNightDone,
    gameOver,
    setGameOver,
    gameResult,
    setGameResult,
  };
}
