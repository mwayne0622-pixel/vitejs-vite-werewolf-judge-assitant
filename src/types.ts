export type Role = '狼人' | '预言家' | '女巫' | '守卫' | '猎人' | '村民';
export type MaybeRole = Role | null;

export type Phase =
  | 'setup'
  | 'first-night-wolf'
  | 'first-night-seer'
  | 'first-night-witch'
  | 'first-night-guard'
  | 'first-night-hunter'
  | 'day-result'
  | 'day-vote'
  | 'hunter-shoot'
  | 'night-wolf'
  | 'night-seer'
  | 'night-witch'
  | 'night-guard';

export type Player = {
  id: number;
  seat: number;
  name: string;
  role: MaybeRole;
  alive: boolean;
};

export type GameConfig = {
  villagerCount: number;
  wolfCount: number;
  hasSeer: boolean;
  hasWitch: boolean;
  hasGuard: boolean;
  hasHunter: boolean;
};
