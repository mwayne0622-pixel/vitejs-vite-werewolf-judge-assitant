import type { Player } from '../types';
import { isWolf } from './roleUtils';

export type BearInfo = {
  bearPlayer: Player | null;
  leftNeighbor: Player | null;
  rightNeighbor: Player | null;
  isRoaring: boolean | null;
  message: string;
  english: string;
};

function getSortedPlayers(players: Player[]) {
  return [...players].sort((a, b) => a.seat - b.seat);
}

function findAliveNeighbor(
  players: Player[],
  bearIndex: number,
  direction: -1 | 1
): Player | null {
  const total = players.length;

  for (let step = 1; step < total; step += 1) {
    const index = (bearIndex + direction * step + total) % total;
    const candidate = players[index];

    if (candidate.alive) {
      return candidate;
    }
  }

  return null;
}

export function getBearInfo(players: Player[]): BearInfo | null {
  const bearPlayer = players.find((p) => p.role === '熊') ?? null;

  if (!bearPlayer) {
    return null;
  }

  if (!bearPlayer.alive) {
    return {
      bearPlayer,
      leftNeighbor: null,
      rightNeighbor: null,
      isRoaring: null,
      message: '熊已死亡，不再咆哮',
      english: 'The Bear is dead and no longer roars',
    };
  }

  const sortedPlayers = getSortedPlayers(players);
  const bearIndex = sortedPlayers.findIndex((p) => p.id === bearPlayer.id);

  const leftNeighbor = findAliveNeighbor(sortedPlayers, bearIndex, -1);
  const rightNeighbor = findAliveNeighbor(sortedPlayers, bearIndex, 1);

  const isRoaring =
    isWolf(leftNeighbor?.role ?? null) || isWolf(rightNeighbor?.role ?? null);

  return {
    bearPlayer,
    leftNeighbor,
    rightNeighbor,
    isRoaring,
    message: isRoaring ? '熊咆哮了' : '熊没有咆哮',
    english: isRoaring ? 'The Bear roars' : 'The Bear does not roar',
  };
}