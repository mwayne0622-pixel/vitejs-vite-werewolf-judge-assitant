import type { Player } from '../types';
import { getRoleIcon, getRoleFaction, getFactionClasses } from '../utils/roleDisplay';

type Props = {
  player: Player;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
  showRole?: boolean;
  label?: string;
  sublabel?: string;
  disabledNote?: string;
  showWolfClawOnSelected?: boolean;
  nightCompactRole?: boolean;
};

export default function PlayerSelectButton({
  player,
  selected,
  onClick,
  disabled = false,
  showRole = false,
  label,
  sublabel,
  disabledNote,
  showWolfClawOnSelected = false,
  nightCompactRole = false,
}: Props) {
  const faction = showRole ? getRoleFaction(player.role) : 'unknown';
  const factionCls = getFactionClasses(faction);
  const roleText = showRole && player.role ? `${getRoleIcon(player.role)} ${player.role}` : '';

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        'relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-left transition-all min-w-[120px]',
        selected
          ? 'bg-[var(--color-blood)] border-[var(--color-blood)] text-white shadow-[0_0_14px_rgba(192,57,43,0.5)]'
          : showRole && faction !== 'unknown'
            ? `${factionCls.bg} ${factionCls.border} ${factionCls.text} hover:brightness-110`
            : 'bg-[var(--color-wolf-card-alt)] border-[var(--color-wolf-border-hi)] text-[var(--color-moon)] hover:border-[var(--color-blood)] hover:text-[var(--color-moon-bright)]',
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
      ].join(' ')}
    >
      {/* Seat badge */}
      <span className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black leading-none border ${
        selected
          ? 'bg-white/20 border-white/30 text-white'
          : 'bg-[var(--color-wolf-surface)] border-[var(--color-wolf-border-hi)] text-[var(--color-moon-bright)]'
      }`}>
        {player.seat}
      </span>

      {/* Content */}
      <span className="flex flex-col min-w-0">
        {!nightCompactRole && (
          <span className="text-sm font-semibold leading-tight truncate">
            {label ?? player.name}
          </span>
        )}
        {(showRole || sublabel || disabledNote) && (
          <span
            className={[
              nightCompactRole
                ? 'text-base font-bold leading-tight'
                : 'text-[11px] leading-tight mt-0.5 truncate',
              selected ? 'text-white/90' : 'opacity-70',
            ].join(' ')}
          >
            {disabledNote
              ? disabledNote
              : showRole && player.role
                ? roleText
                : sublabel ?? ''}
          </span>
        )}
      </span>

      {showWolfClawOnSelected && selected && (
        <span
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none flex items-center justify-center"
        >
          <span className="text-[34px] leading-none rotate-[-18deg] drop-shadow-[0_0_8px_rgba(127,29,29,0.95)]">
            🔪
          </span>
        </span>
      )}
    </button>
  );
}
