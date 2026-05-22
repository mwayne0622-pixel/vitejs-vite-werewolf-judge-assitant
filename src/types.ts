export type Role =
  | '狼人'
  | '白狼王'
  | '狼美人'
  | '隐狼'
  | '预言家'
  | '女巫'
  | '守卫'
  | '猎人'
  | '白痴'
  | '熊'
  | '骑士'
  | '村民';

export type MaybeRole = Role | null;

export type Phase =
  | 'setup'
  | 'first-night-wolf'
  | 'first-night-seer'
  | 'first-night-witch'
  | 'first-night-guard'
  | 'first-night-hunter'
  | 'first-night-idiot'
  | 'first-night-bear'
  | 'first-night-knight'
  | 'first-night-white-wolf-king'
  | 'first-night-hidden-wolf'
  | 'first-night-wolf-beauty'
  | 'white-wolf-king-explode'
  | 'day-result'
  | 'day-vote'
  | 'hunter-shoot'
  | 'knight-duel'
  | 'night-wolf'
  | 'night-wolf-beauty'
  | 'night-seer'
  | 'night-witch'
  | 'night-guard';

export type Player = {
  id: number;
  seat: number;
  name: string;
  role: MaybeRole;
  alive: boolean;
  idiotRevealed: boolean;
};

export type GameConfig = {
  villagerCount: number;
  wolfCount: number;
  hasSeer: boolean;
  hasWitch: boolean;
  hasGuard: boolean;
  hasHunter: boolean;
  hasWhiteWolfKing: boolean;
  hasIdiot: boolean;
  hasBear: boolean;
  hasKnight: boolean;
  hasWolfBeauty: boolean;
  hasHiddenWolf: boolean;
};