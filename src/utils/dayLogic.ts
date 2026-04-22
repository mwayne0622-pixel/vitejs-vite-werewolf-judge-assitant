import type { Player } from '../types';

type BuildDayResultParams = {
  players: Player[];
  wolfTargetId: number | null;
  witchSave: boolean;
  witchPoisonId: number | null;
  guardTargetId: number | null;
};

type DayResult = {
  deadIds: number[];
  message: string;
  english: string;
};

export function buildDayResult({
  players,
  wolfTargetId,
  witchSave,
  witchPoisonId,
  guardTargetId,
}: BuildDayResultParams): DayResult {
  const deadIds = new Set<number>();

  const isWolfTargetSavedByWitch =
    wolfTargetId !== null && witchSave;

  const isWolfTargetGuarded =
    wolfTargetId !== null &&
    guardTargetId !== null &&
    guardTargetId === wolfTargetId;

  if (
    wolfTargetId !== null &&
    !isWolfTargetSavedByWitch &&
    !isWolfTargetGuarded
  ) {
    deadIds.add(wolfTargetId);
  }

  if (witchPoisonId !== null) {
    deadIds.add(witchPoisonId);
  }

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
    english: `Last night dead: ${deadPlayers
      .map((p) => `Seat ${p.seat}`)
      .join(', ')}`,
  };
}