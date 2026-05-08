import { useState, useEffect } from 'react';
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

/**
 * 管理游戏的基础状态（配置、阶段、玩家）
 * 包括 localStorage 持久化
 */
export function useGameState(initialState: GameState) {
  const [config, setConfig] = useState<GameConfig>(initialState.config);
  const [phase, setPhase] = useState<Phase>(initialState.phase);
  const [players, setPlayers] = useState<Player[]>(initialState.players);
  const [firstNightDone, setFirstNightDone] = useState(initialState.firstNightDone);
  const [gameOver, setGameOver] = useState(initialState.gameOver);
  const [gameResult, setGameResult] = useState<string | null>(initialState.gameResult);

  // localStorage 加载
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      if (data.config) setConfig(data.config);
      if (data.phase) setPhase(data.phase);
      if (data.players) setPlayers(data.players);
      if (data.firstNightDone !== undefined) setFirstNightDone(data.firstNightDone);
      if (data.gameOver !== undefined) setGameOver(data.gameOver);
      if (data.gameResult !== undefined) setGameResult(data.gameResult);
    } catch {
      // ignore bad cache
    }
  }, []);

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
