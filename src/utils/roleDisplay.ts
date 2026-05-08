import type { MaybeRole } from '../types';

export type Faction = 'wolf' | 'god' | 'villager' | 'unknown';

export function getRoleIcon(role: MaybeRole): string {
  switch (role) {
    case '狼人':    return '🐺';
    case '白狼王':  return '👑';
    case '狼美人':  return '🌹';
    case '预言家':  return '🔮';
    case '女巫':    return '🧪';
    case '守卫':    return '🛡️';
    case '猎人':    return '🏹';
    case '熊':      return '🐻';
    case '白痴':    return '🃏';
    case '村民':    return '🏘️';
    default:        return '❓';
  }
}

export function getRoleFaction(role: MaybeRole): Faction {
  switch (role) {
    case '狼人':
    case '白狼王':
    case '狼美人':
      return 'wolf';
    case '预言家':
    case '女巫':
    case '守卫':
    case '猎人':
    case '熊':
    case '白痴':
      return 'god';
    case '村民':
      return 'villager';
    default:
      return 'unknown';
  }
}

export function getFactionClasses(faction: Faction): { border: string; text: string; bg: string } {
  switch (faction) {
    case 'wolf':
      return {
        border: 'border-[var(--color-blood)]',
        text:   'text-[var(--color-dead-text)]',
        bg:     'bg-[var(--color-blood-dim)]',
      };
    case 'god':
      return {
        border: 'border-[var(--color-amber-wolf)]',
        text:   'text-[#fde68a]',
        bg:     'bg-[var(--color-amber-dim)]',
      };
    case 'villager':
      return {
        border: 'border-[var(--color-wolf-border-hi)]',
        text:   'text-[var(--color-moon)]',
        bg:     'bg-[var(--color-wolf-card-alt)]',
      };
    default:
      return {
        border: 'border-[var(--color-wolf-border)]',
        text:   'text-[var(--color-moon-dim)]',
        bg:     'bg-[var(--color-wolf-surface)]',
      };
  }
}

export function getPhaseIcon(phase: string): string {
  if (phase.startsWith('first-night') || phase.startsWith('night')) return '🌙';
  if (phase === 'day-result' || phase === 'day-vote') return '☀️';
  if (phase === 'hunter-shoot') return '🏹';
  if (phase === 'white-wolf-king-explode') return '💥';
  if (phase === 'setup') return '⚙️';
  return '🎮';
}

export function isNightPhase(phase: string): boolean {
  return phase.startsWith('first-night') || phase.startsWith('night');
}
