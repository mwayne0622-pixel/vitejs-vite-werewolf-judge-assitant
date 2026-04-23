export type Role =
  | '狼人'
  | '白狼王'
  | '预言家'
  | '女巫'
  | '守卫'
  | '猎人'
  | '白痴'
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
  | 'first-night-white-wolf-king'
  | 'white-wolf-king-explode'
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
};
