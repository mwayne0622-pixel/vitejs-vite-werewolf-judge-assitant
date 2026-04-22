import type { GameConfig, Phase, Player } from '../types';

export function getIncludedGodCount(config: GameConfig) {
  return [
    config.hasSeer,
    config.hasWitch,
    config.hasGuard,
    config.hasHunter,
  ].filter(Boolean).length;
}

export function getPlayerCount(config: GameConfig) {
  return config.villagerCount + config.wolfCount + getIncludedGodCount(config);
}

export function finalizeUnassignedVillagers(players: Player[]): Player[] {
  return players.map((p) => ({
    ...p,
    role: p.role ?? '村民',
  }));
}

export function getNextFirstNightPhase(
  config: GameConfig,
  current: Phase
): Phase {
  if (current === 'first-night-wolf') {
    if (config.hasWhiteWolfKing) return 'first-night-white-wolf-king';
    if (config.hasSeer) return 'first-night-seer';
    if (config.hasWitch) return 'first-night-witch';
    if (config.hasGuard) return 'first-night-guard';
    if (config.hasHunter) return 'first-night-hunter';
    return 'day-result';
  }

  if (current === 'first-night-white-wolf-king') {
    if (config.hasSeer) return 'first-night-seer';
    if (config.hasWitch) return 'first-night-witch';
    if (config.hasGuard) return 'first-night-guard';
    if (config.hasHunter) return 'first-night-hunter';
    return 'day-result';
  }

  if (current === 'first-night-seer') {
    if (config.hasWitch) return 'first-night-witch';
    if (config.hasGuard) return 'first-night-guard';
    if (config.hasHunter) return 'first-night-hunter';
    return 'day-result';
  }

  if (current === 'first-night-witch') {
    if (config.hasGuard) return 'first-night-guard';
    if (config.hasHunter) return 'first-night-hunter';
    return 'day-result';
  }

  if (current === 'first-night-guard') {
    if (config.hasHunter) return 'first-night-hunter';
    return 'day-result';
  }

  return 'day-result';
}

export function getPrevFirstNightPhase(
  config: GameConfig,
  current: Phase
): Phase {
  if (current === 'first-night-white-wolf-king') {
    return 'first-night-wolf';
  }

  if (current === 'first-night-seer') {
    if (config.hasWhiteWolfKing) return 'first-night-white-wolf-king';
    return 'first-night-wolf';
  }

  if (current === 'first-night-witch') {
    if (config.hasSeer) return 'first-night-seer';
    return 'first-night-wolf';
  }

  if (current === 'first-night-guard') {
    if (config.hasWitch) return 'first-night-witch';
    if (config.hasSeer) return 'first-night-seer';
    return 'first-night-wolf';
  }

  if (current === 'first-night-hunter') {
    if (config.hasGuard) return 'first-night-guard';
    if (config.hasWitch) return 'first-night-witch';
    if (config.hasSeer) return 'first-night-seer';
    return 'first-night-wolf';
  }

  return 'setup';
}

export function getNextNightPhaseAfterWolf(config: GameConfig): Phase {
  if (config.hasSeer) return 'night-seer';
  if (config.hasWitch) return 'night-witch';
  if (config.hasGuard) return 'night-guard';
  return 'day-result';
}

export function getNextNightPhaseAfterSeer(config: GameConfig): Phase {
  if (config.hasWitch) return 'night-witch';
  if (config.hasGuard) return 'night-guard';
  return 'day-result';
}

export function getNextNightPhaseAfterWitch(config: GameConfig): Phase {
  if (config.hasGuard) return 'night-guard';
  return 'day-result';
}

export function getPrevNightPhase(config: GameConfig, current: Phase): Phase {
  if (current === 'night-seer') return 'night-wolf';

  if (current === 'night-witch') {
    if (config.hasSeer) return 'night-seer';
    return 'night-wolf';
  }

  if (current === 'night-guard') {
    if (config.hasWitch) return 'night-witch';
    if (config.hasSeer) return 'night-seer';
    return 'night-wolf';
  }

  if (current === 'day-result') {
    if (config.hasGuard) return 'night-guard';
    if (config.hasWitch) return 'night-witch';
    if (config.hasSeer) return 'night-seer';
    return 'night-wolf';
  }

  return 'night-wolf';
}
