# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Werewolf (Mafia) Judge Assistant** application built with React, TypeScript, and Vite. It's designed to help facilitate gameplay of the Werewolf game by managing roles, night actions, voting, and game state.

The app is bilingual (Chinese/English) and features a full game flow from setup through end-game, with support for multiple special roles and game mechanics.

## Quick Start

### Development
```bash
npm run dev          # Start dev server (Vite HMR enabled)
npm run build        # Build for production (includes TypeScript compilation)
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

### Project Dependencies
- React 19.2+
- TypeScript 6.0+
- Vite 8.0+
- ESLint with TypeScript support

## Architecture & Key Concepts

### State Management Pattern
The entire game state is managed in `App.tsx` through React hooks. This is intentional - the state is complex with many interdependent pieces (player roles, night actions, voting tallies, special mechanic flags), and a centralized approach works well here given the single-screen game flow.

**Key state categories:**
- **Game config**: Role enabled/disabled flags, player counts
- **Players**: Array with role, alive status, seat, name, idiot reveal status
- **Role owner tracking**: Separate state for who has each special role (Seer, Witch, Guard, Hunter, etc.) with both confirmed and draft versions
- **Night actions**: Wolf targets, seer checks, witch saves/poisons, guard protection
- **Voting**: Vote tally, round number (1 or 2 for revotes), tied candidates
- **Special mechanics**: Wolf Beauty lover death, White Wolf King explosion, Hunter shots, Bear logic, Idiot reveal

### Phase-Driven Architecture

The game progresses through a state machine of phases defined in `src/types.ts:Phase`. Each phase corresponds to a screen component in `src/screens/`:

**Setup Phase**: `SetupScreen` - Configure roles and player names

**First Night Phases** (sequential, role-by-role):
- `first-night-wolf` → Wolves choose target
- `first-night-white-wolf-king` → Designate White Wolf King (if enabled)
- `first-night-wolf-beauty` → Designate Wolf Beauty & charm target (if enabled)
- `first-night-seer` → Seer checks a player
- `first-night-witch` → Witch saves/poisons
- `first-night-guard` → Guard protects
- `first-night-hunter` → Hunter designated
- `first-night-idiot` → Idiot designated
- `first-night-bear` → Bear designated

**Day Result & Voting**: 
- `day-result` → Show night deaths, special messages, Bear logic if triggered
- `day-vote` → Voting phase (with revote logic for ties)
- `hunter-shoot` → Hunter shoots if triggered

**Subsequent Nights** (similar flow as first night but simpler):
- `night-wolf` → Wolf targets
- `night-wolf-beauty` → Beauty charms (if alive)
- `night-seer` → Seer checks
- `night-witch` → Witch saves/poisons
- `night-guard` → Guard protects

**Special Phases**:
- `white-wolf-king-explode` → White Wolf King self-destruct during day

Phase transitions are controlled by:
- `getNextFirstNightPhase()` / `getPrevFirstNightPhase()` - for first night navigation
- `getNextNightPhaseAfterWolf()` and similar - for subsequent nights
- Direct phase setters in handlers (e.g., `startNextNight()`, `applyVoteResult()`)

### Screen Components (`src/screens/`)

Each screen handles:
1. **Rendering** the current phase UI (bilingual text via `<Bilingual>` component)
2. **State updates** (via callbacks from App.tsx)
3. **Validation** (e.g., preventing "next" until selections are made)

Screen naming convention: `FirstNight<Role>Screen` for first night, `Night<Role>Screen` for subsequent nights.

### Utility Functions

**`src/utils/gameFlow.ts`**
- Phase navigation logic
- Player/god count calculations
- Finalization of unassigned villagers

**`src/utils/dayLogic.ts`**
- `buildDayResult()` - Calculates night deaths from wolves, witch poison, guard saves. Returns deadIds, death reasons in Chinese/English.

**`src/utils/roleUtils.ts`**
- Predicates: `isWolf()`, `isVillager()`, `isGod()`

**`src/utils/wolfBeautyLogic.ts`**
- `shouldTriggerWolfBeautyLoverDeath()` - Checks if Wolf Beauty's lover should die (vote/poison/hunter shot)
- `getWolfBeautyCharmedPlayer()` - Gets the charmed target

**`src/utils/bearLogic.ts`**
- `getBearInfo()` - Calculates if Bear should take action today (votes for each player)

### Key Mechanics

**Vote Resolution** (`calculateVoteSummary()` in App.tsx)
- Counts votes, returns deadIds
- Handles ties (triggers revote with round 2)
- Handles idiot reveal (voting out an unrevealed idiot = no elimination)
- Handles already-revealed idiot (cannot be eliminated again)

**Wolf Beauty Lover Death** (`applyWolfBeautyLoverDeath()`)
- When Wolf Beauty dies (from witch poison, voter elimination, or hunter shot), her charmed lover dies with her
- Stored as last charm target to survive multiple rounds

**White Wolf King Explosion** (`confirmWhiteWolfKingExplode()`)
- Can explode during day-result phase if alive and not yet exploded
- Kills both self and target, skips voting

**Hunter Shot** (triggered in `applyDayResult()` or `applyVoteResult()`)
- When hunter dies at night or by vote, enters `hunter-shoot` phase
- Hunter can shoot one alive player (other than self), or skip
- Takes effect immediately

**Witch Mechanics**
- First night: can save and poison different targets
- Later nights: can only save wolf's target (if save unused) OR poison (if poison unused)
- Cannot save self (first night auto-blocks, later nights explicit check)
- Cannot poison while saving, cannot save while poisoning

**Game Over Condition** (`checkGameOver()`)
- Wolves eliminated → Good team wins
- All villagers eliminated → Wolves win
- All gods eliminated → Wolves win

### State Persistence

Game state (all major variables) is saved to localStorage on every state change with key `'wolf-judge-assistant-vote-split-v2'`. On app load, state is restored. This allows game resumption across page refreshes.

## Common Development Tasks

### Adding a New Role
1. Add role name to `src/types.ts:Role` (string literal)
2. Add config flag to `GameConfig` (e.g., `hasNewRole: boolean`)
3. Create first night and night screen components
4. Update `getIncludedGodCount()` if it's a god role
5. Add state variables for role owner, draft owner, and any actions (similar to seer/witch pattern)
6. Update `getNextFirstNightPhase()` and `getPrevFirstNightPhase()` to route through the new phase
7. Update `getNextNightPhaseAfterWolf()` (or similar) to route through the new night phase
8. Handle role-specific logic in `App.tsx` (game-over checks if relevant, day result application, etc.)
9. Add phase label mappings in `getPhaseLabel()` and `getPhaseEnglish()`
10. Update localStorage key if the new state requires it

### Adding a Special Game Mechanic
- Implement core logic in a new file under `src/utils/`
- Call the logic from `App.tsx` at the appropriate point
- Bilingual messages should use `setXxxMessage()` / `setXxxEnglish()` state pattern
- Consider edge cases (dead players, used-up abilities, state ordering)

### Modifying Vote Logic
- Core calculation is in `calculateVoteSummary()`
- Vote result application is in `applyVoteResult()`
- Watch for interaction with idiot reveal and Wolf Beauty lover death
- Consider impact on `currentVoters` and `currentVoteTargets` filtering

### Testing a Feature
- Start dev server: `npm run dev`
- Navigate to the relevant phase
- Test bilingual rendering (UI should show both Chinese and English)
- Test edge cases (dead players, ability reuse, revotes, hunter shots during/after ability use)
- Check localStorage persistence (refresh page mid-game, state should restore)

## Code Style & Patterns

- **Naming**: Camel case for variables/functions, Chinese names (e.g., `seerOwnerId`) are acceptable for clarity in a game about Chinese roles
- **Bilingual text**: Use `<Bilingual zh="..." en="..." />` component for all user-facing text
- **State updates**: Use setter functions, not direct mutations; use immutable patterns (e.g., `map()` + ternary for updates)
- **Inline styles**: All styling via `CSSProperties` objects for simplicity (no separate CSS file for new components)
- **Conditional rendering**: Use short-circuit `&&` for phase-based rendering, not full ternary

## File Structure
```
src/
├── App.tsx              # Main game logic & state machine (1700+ lines)
├── types.ts             # TypeScript types (Role, Phase, Player, GameConfig)
├── main.tsx             # Entry point
├── components/
│   ├── Bilingual.tsx    # Bilingual text helper
│   └── NumberStepper.tsx # Input component
├── screens/             # One component per game phase
│   ├── SetupScreen.tsx
│   ├── FirstNight*.tsx  # 9 first night screens
│   ├── Night*.tsx       # 4 night screens
│   ├── DayResultScreen.tsx
│   ├── VoteScreen.tsx
│   ├── HunterShootScreen.tsx
│   └── WhiteWolfKingExplodeScreen.tsx
└── utils/
    ├── gameFlow.ts      # Phase navigation
    ├── dayLogic.ts      # Night death calculation
    ├── roleUtils.ts     # Role predicates
    ├── wolfBeautyLogic.ts
    └── bearLogic.ts
```

## Notes for Future Maintainers

- App.tsx is the heart of the system; understand the state layout before making changes
- Phase navigation is non-linear (some roles are optional) - use the helper functions, don't hardcode phase names
- The bilingual approach uses component-level strings, not i18n libraries - consistent but requires discipline
- localStorage key bumping (`-v2` suffix) signals incompatible state changes; update if state structure changes incompatibly
- Testing game flow is hard without manual clicking; consider a debugger UI for fast role assignment if adding many features
