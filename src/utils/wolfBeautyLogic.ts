import type { Player } from '../types';

export type WolfBeautyDeathSource = 'vote' | 'witch-poison' | 'hunter-shot' | 'wolf-kill' | 'white-wolf-king';

export function shouldTriggerWolfBeautyLoverDeath(source: WolfBeautyDeathSource): boolean {
  return source === 'vote' || source === 'witch-poison' || source === 'hunter-shot';
}

export function getWolfBeautyCharmedPlayer(
  players: Player[],
  charmedPlayerId: number | null
): Player | null {
  if (charmedPlayerId === null) return null;
  return players.find((p) => p.id === charmedPlayerId) ?? null;
}