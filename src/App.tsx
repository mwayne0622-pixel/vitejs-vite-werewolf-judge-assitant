import { useEffect, useMemo, useState } from 'react';

import type { MaybeRole, Phase, Player, GameConfig } from './types';
import {
  getIncludedGodCount,
  getPlayerCount,
  getPrevFirstNightPhase,
  getNextNightPhaseAfterWolf,
  getNextNightPhaseAfterWolfBeauty,
  getNextNightPhaseAfterSeer,
  getNextNightPhaseAfterWitch,
  getPrevNightPhase,
} from './utils/gameFlow';
import { buildDayResult } from './utils/dayLogic';

import SetupScreen from './screens/SetupScreen';
import DayResultScreen from './screens/DayResultScreen';
import VoteScreen from './screens/VoteScreen';
import FirstNightWolfScreen from './screens/FirstNightWolfScreen';
import FirstNightSeerScreen from './screens/FirstNightSeerScreen';
import FirstNightWitchScreen from './screens/FirstNightWitchScreen';
import FirstNightGuardScreen from './screens/FirstNightGuardScreen';
import FirstNightHunterScreen from './screens/FirstNightHunterScreen';
import FirstNightIdiotScreen from './screens/FirstNightIdiotScreen';

import NightSeerScreen from './screens/NightSeerScreen';
import NightWitchScreen from './screens/NightWitchScreen';
import NightGuardScreen from './screens/NightGuardScreen';
import NightWolfScreen from './screens/NightWolfScreen';

import HunterShootScreen from './screens/HunterShootScreen';

import FirstNightWhiteWolfKingScreen from './screens/FirstNightWhiteWolfKingScreen';
import FirstNightHiddenWolfScreen from './screens/FirstNightHiddenWolfScreen';
import WhiteWolfKingExplodeScreen from './screens/WhiteWolfKingExplodeScreen';

import FirstNightWolfBeautyScreen from './screens/FirstNightWolfBeautyScreen';
import NightWolfBeautyScreen from './screens/NightWolfBeautyScreen';

import FirstNightBearScreen from './screens/FirstNightBearScreen';
import FirstNightKnightScreen from './screens/FirstNightKnightScreen';
import KnightDuelScreen from './screens/KnightDuelScreen';
import { getBearInfo } from './utils/bearLogic';
import { getPhaseIcon, isNightPhase } from './utils/roleDisplay';
import RoleHelpModal from './components/RoleHelpModal';
import { isWolf } from './utils/roleUtils';
import {
  shouldTriggerWolfBeautyLoverDeath,
  type WolfBeautyDeathSource,
} from './utils/wolfBeautyLogic';

import {
  createStandardRoleCommitHandler,
  createWolvesCommitHandler,
  createWhiteWolfKingCommitHandler,
  createWolfBeautyCommitHandler,
} from './roles/roleHandlers';
import {
  calculateVoteSummary as calculateVoteSummaryLogic,
  checkGameOver as checkGameOverLogic,
  applyWolfBeautyLoverDeath as applyWolfBeautyLoverDeathLogic,
} from './logic/gameRules';

const STORAGE_KEY = 'wolf-judge-assistant-vote-split-v2';

let _savedCache: Record<string, unknown> | null | undefined;
function getSavedOnce(): Record<string, unknown> | null {
  if (_savedCache === undefined) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      _savedCache = raw ? JSON.parse(raw) : null;
    } catch {
      _savedCache = null;
    }
  }
  return _savedCache ?? null;
}

const defaultConfig: GameConfig = {
  villagerCount: 2,
  wolfCount: 2,
  hasSeer: true,
  hasWitch: true,
  hasGuard: false,
  hasHunter: false,
  hasWhiteWolfKing: false,
  hasWolfBeauty: false,
  hasIdiot: false,
  hasBear: false,
  hasKnight: false,
  hasHiddenWolf: false,
};

// 从 gameRules 导入的类型
import type { VoteSummary } from './logic/gameRules';

// 为了兼容性，提供包装函数
function calculateVoteSummary(params: {
  votes: Record<number, number | null>;
  currentVoters: Player[];
  currentVoteTargets: Player[];
  players: Player[];
  voteRound: 1 | 2;
}): VoteSummary & { shouldRevote: boolean } {
  return calculateVoteSummaryLogic(params);
}

export default function App() {
  const [showHelp, setShowHelp] = useState(false);
  const [config, setConfig] = useState<GameConfig>(() => (getSavedOnce()?.config as GameConfig) ?? defaultConfig);
  const [phase, setPhase] = useState<Phase>(() => (getSavedOnce()?.phase as Phase) ?? 'setup');
  const [players, setPlayers] = useState<Player[]>(() => {
    const s = getSavedOnce();
    if (Array.isArray(s?.players)) return s.players as Player[];
    const cfg = (s?.config as GameConfig) ?? defaultConfig;
    return createBlankPlayers(getPlayerCount(cfg));
  });

  const [firstNightDone, setFirstNightDone] = useState(() => Boolean(getSavedOnce()?.firstNightDone));

  const [selectedWolfIds, setSelectedWolfIds] = useState<number[]>(() => {
    const v = getSavedOnce()?.selectedWolfIds;
    return Array.isArray(v) ? (v as number[]) : [];
  });
  const [wolfTargetId, setWolfTargetId] = useState<number | null>(() => (getSavedOnce()?.wolfTargetId as number | null) ?? null);

  const [whiteWolfKingOwnerId, setWhiteWolfKingOwnerId] = useState<number | null>(() => (getSavedOnce()?.whiteWolfKingOwnerId as number | null) ?? null);
  const [draftWhiteWolfKingOwnerId, setDraftWhiteWolfKingOwnerId] = useState<number | null>(() => (getSavedOnce()?.draftWhiteWolfKingOwnerId as number | null) ?? null);

  const [whiteWolfKingExploded, setWhiteWolfKingExploded] = useState(() => Boolean(getSavedOnce()?.whiteWolfKingExploded));
  const [whiteWolfKingExplodeTargetId, setWhiteWolfKingExplodeTargetId] = useState<number | null>(() => (getSavedOnce()?.whiteWolfKingExplodeTargetId as number | null) ?? null);

  const [wolfBeautyOwnerId, setWolfBeautyOwnerId] = useState<number | null>(() => (getSavedOnce()?.wolfBeautyOwnerId as number | null) ?? null);
  const [draftWolfBeautyOwnerId, setDraftWolfBeautyOwnerId] = useState<number | null>(() => (getSavedOnce()?.draftWolfBeautyOwnerId as number | null) ?? null);

  const [wolfBeautyCharmTargetId, setWolfBeautyCharmTargetId] = useState<number | null>(() => (getSavedOnce()?.wolfBeautyCharmTargetId as number | null) ?? null);
  const [lastWolfBeautyCharmTargetId, setLastWolfBeautyCharmTargetId] = useState<number | null>(() => (getSavedOnce()?.lastWolfBeautyCharmTargetId as number | null) ?? null);

  const [wolfBeautyLoverMessage, setWolfBeautyLoverMessage] = useState<string | null>(() => (getSavedOnce()?.wolfBeautyLoverMessage as string | null) ?? null);
  const [wolfBeautyLoverEnglish, setWolfBeautyLoverEnglish] = useState<string | null>(() => (getSavedOnce()?.wolfBeautyLoverEnglish as string | null) ?? null);

  const [seerOwnerId, setSeerOwnerId] = useState<number | null>(() => (getSavedOnce()?.seerOwnerId as number | null) ?? null);
  const [draftSeerOwnerId, setDraftSeerOwnerId] = useState<number | null>(() => (getSavedOnce()?.draftSeerOwnerId as number | null) ?? null);
  const [seerCheckId, setSeerCheckId] = useState<number | null>(() => (getSavedOnce()?.seerCheckId as number | null) ?? null);

  const [witchOwnerId, setWitchOwnerId] = useState<number | null>(() => (getSavedOnce()?.witchOwnerId as number | null) ?? null);
  const [draftWitchOwnerId, setDraftWitchOwnerId] = useState<number | null>(() => (getSavedOnce()?.draftWitchOwnerId as number | null) ?? null);
  const [witchSave, setWitchSave] = useState(() => Boolean(getSavedOnce()?.witchSave));
  const [witchPoisonId, setWitchPoisonId] = useState<number | null>(() => (getSavedOnce()?.witchPoisonId as number | null) ?? null);

  const [guardOwnerId, setGuardOwnerId] = useState<number | null>(() => (getSavedOnce()?.guardOwnerId as number | null) ?? null);
  const [draftGuardOwnerId, setDraftGuardOwnerId] = useState<number | null>(() => (getSavedOnce()?.draftGuardOwnerId as number | null) ?? null);
  const [guardTargetId, setGuardTargetId] = useState<number | null>(() => (getSavedOnce()?.guardTargetId as number | null) ?? null);

  const [hunterOwnerId, setHunterOwnerId] = useState<number | null>(() => (getSavedOnce()?.hunterOwnerId as number | null) ?? null);
  const [draftHunterOwnerId, setDraftHunterOwnerId] = useState<number | null>(() => (getSavedOnce()?.draftHunterOwnerId as number | null) ?? null);

  const [witchSaveUsed, setWitchSaveUsed] = useState(() => Boolean(getSavedOnce()?.witchSaveUsed));
  const [witchPoisonUsed, setWitchPoisonUsed] = useState(() => Boolean(getSavedOnce()?.witchPoisonUsed));
  const [lastGuardTargetId, setLastGuardTargetId] = useState<number | null>(() => (getSavedOnce()?.lastGuardTargetId as number | null) ?? null);

  const [dayApplied, setDayApplied] = useState(() => Boolean(getSavedOnce()?.dayApplied));

  const [votes, setVotes] = useState<Record<number, number | null>>(() => (getSavedOnce()?.votes as Record<number, number | null>) ?? {});
  const [voteApplied, setVoteApplied] = useState(() => Boolean(getSavedOnce()?.voteApplied));

  const [voteRound, setVoteRound] = useState<1 | 2>(() => getSavedOnce()?.voteRound === 2 ? 2 : 1);
  const [revoteCandidateIds, setRevoteCandidateIds] = useState<number[]>(() => {
    const v = getSavedOnce()?.revoteCandidateIds;
    return Array.isArray(v) ? (v as number[]) : [];
  });

  const [appliedVoteSummary, setAppliedVoteSummary] = useState<
    (VoteSummary & { shouldRevote: boolean }) | null
  >(() => (getSavedOnce()?.appliedVoteSummary as (VoteSummary & { shouldRevote: boolean }) | null) ?? null);

  const [hunterShootSource, setHunterShootSource] = useState<
    'night' | 'vote' | null
  >(() => (getSavedOnce()?.hunterShootSource as 'night' | 'vote' | null) ?? null);
  const [hunterShotTargetId, setHunterShotTargetId] = useState<number | null>(() => (getSavedOnce()?.hunterShotTargetId as number | null) ?? null);
  const [hunterShotUsed, setHunterShotUsed] = useState(() => Boolean(getSavedOnce()?.hunterShotUsed));
  const [hunterShotMessage, setHunterShotMessage] = useState<string | null>(() => (getSavedOnce()?.hunterShotMessage as string | null) ?? null);
  const [hunterShotEnglish, setHunterShotEnglish] = useState<string | null>(() => (getSavedOnce()?.hunterShotEnglish as string | null) ?? null);

  const [whiteWolfKingMessage, setWhiteWolfKingMessage] = useState<string | null>(() => (getSavedOnce()?.whiteWolfKingMessage as string | null) ?? null);
  const [whiteWolfKingEnglish, setWhiteWolfKingEnglish] = useState<string | null>(() => (getSavedOnce()?.whiteWolfKingEnglish as string | null) ?? null);

  const [idiotOwnerId, setIdiotOwnerId] = useState<number | null>(() => (getSavedOnce()?.idiotOwnerId as number | null) ?? null);
  const [draftIdiotOwnerId, setDraftIdiotOwnerId] = useState<number | null>(() => (getSavedOnce()?.draftIdiotOwnerId as number | null) ?? null);

  const [draftBearOwnerId, setDraftBearOwnerId] = useState<number | null>(() => (getSavedOnce()?.draftBearOwnerId as number | null) ?? null);
  const [bearOwnerId, setBearOwnerId] = useState<number | null>(() => (getSavedOnce()?.bearOwnerId as number | null) ?? null);

  const [hiddenWolfOwnerId, setHiddenWolfOwnerId] = useState<number | null>(() => (getSavedOnce()?.hiddenWolfOwnerId as number | null) ?? null);
  const [draftHiddenWolfOwnerId, setDraftHiddenWolfOwnerId] = useState<number | null>(() => (getSavedOnce()?.draftHiddenWolfOwnerId as number | null) ?? null);

  const [knightOwnerId, setKnightOwnerId] = useState<number | null>(() => (getSavedOnce()?.knightOwnerId as number | null) ?? null);
  const [draftKnightOwnerId, setDraftKnightOwnerId] = useState<number | null>(() => (getSavedOnce()?.draftKnightOwnerId as number | null) ?? null);
  const [knightDuelUsed, setKnightDuelUsed] = useState(() => Boolean(getSavedOnce()?.knightDuelUsed));
  const [knightDuelTargetId, setKnightDuelTargetId] = useState<number | null>(() => (getSavedOnce()?.knightDuelTargetId as number | null) ?? null);
  const [knightDuelMessage, setKnightDuelMessage] = useState<string | null>(() => (getSavedOnce()?.knightDuelMessage as string | null) ?? null);
  const [knightDuelEnglish, setKnightDuelEnglish] = useState<string | null>(() => (getSavedOnce()?.knightDuelEnglish as string | null) ?? null);

  const [gameOver, setGameOver] = useState(() => Boolean(getSavedOnce()?.gameOver));
  const [gameResult, setGameResult] = useState<string | null>(() => (getSavedOnce()?.gameResult as string | null) ?? null);

  const playerCount = getPlayerCount(config);
  const configValid = config.wolfCount >= 1 && config.villagerCount >= 0;

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        config,
        phase,
        players,
        firstNightDone,

        selectedWolfIds,
        wolfTargetId,

        whiteWolfKingOwnerId,
        draftWhiteWolfKingOwnerId,
        whiteWolfKingExploded,
        whiteWolfKingExplodeTargetId,

        wolfBeautyOwnerId,
        draftWolfBeautyOwnerId,
        wolfBeautyCharmTargetId,
        lastWolfBeautyCharmTargetId,
        wolfBeautyLoverMessage,
        wolfBeautyLoverEnglish,

        seerOwnerId,
        draftSeerOwnerId,
        seerCheckId,

        witchOwnerId,
        draftWitchOwnerId,
        witchSave,
        witchPoisonId,

        guardOwnerId,
        draftGuardOwnerId,
        guardTargetId,

        hunterOwnerId,
        draftHunterOwnerId,

        witchSaveUsed,
        witchPoisonUsed,
        lastGuardTargetId,

        dayApplied,
        votes,
        voteApplied,

        hunterShootSource,
        hunterShotTargetId,
        hunterShotUsed,

        hunterShotMessage,
        hunterShotEnglish,

        idiotOwnerId,
        draftIdiotOwnerId,

        bearOwnerId,
        draftBearOwnerId,

        hiddenWolfOwnerId,
        draftHiddenWolfOwnerId,

        knightOwnerId,
        draftKnightOwnerId,
        knightDuelUsed,
        knightDuelTargetId,
        knightDuelMessage,
        knightDuelEnglish,

        gameOver,
        gameResult,

        voteRound,
        revoteCandidateIds,
        appliedVoteSummary,
      })
    );
  }, [
    config,
    phase,
    players,
    firstNightDone,
    selectedWolfIds,
    wolfTargetId,
    whiteWolfKingOwnerId,
    draftWhiteWolfKingOwnerId,
    whiteWolfKingExploded,
    whiteWolfKingExplodeTargetId,
    wolfBeautyOwnerId,
    draftWolfBeautyOwnerId,
    wolfBeautyCharmTargetId,
    lastWolfBeautyCharmTargetId,
    wolfBeautyLoverMessage,
    wolfBeautyLoverEnglish,
    seerOwnerId,
    draftSeerOwnerId,
    seerCheckId,
    witchOwnerId,
    draftWitchOwnerId,
    witchSave,
    witchPoisonId,
    guardOwnerId,
    draftGuardOwnerId,
    guardTargetId,
    hunterOwnerId,
    draftHunterOwnerId,
    witchSaveUsed,
    witchPoisonUsed,
    lastGuardTargetId,
    dayApplied,
    votes,
    voteApplied,
    hunterShootSource,
    hunterShotTargetId,
    hunterShotUsed,
    hunterShotMessage,
    hunterShotEnglish,
    idiotOwnerId,
    draftIdiotOwnerId,
    bearOwnerId,
    draftBearOwnerId,
    hiddenWolfOwnerId,
    draftHiddenWolfOwnerId,
    knightOwnerId,
    draftKnightOwnerId,
    knightDuelUsed,
    knightDuelTargetId,
    knightDuelMessage,
    knightDuelEnglish,
    gameOver,
    gameResult,
    voteRound,
    revoteCandidateIds,
    appliedVoteSummary,
  ]);

  const alivePlayers = useMemo(() => players.filter((p) => p.alive), [players]);

  const seerRoleExists = config.hasSeer;
  const witchRoleExists = config.hasWitch;
  const guardRoleExists = config.hasGuard;
  const hunterRoleExists = config.hasHunter;
  const idiotRoleExists = config.hasIdiot;
  const bearRoleExists = config.hasBear;
  const knightRoleExists = config.hasKnight;

  const aliveSeerExists = players.some((p) => p.alive && p.role === '预言家');
  const aliveWitchExists = players.some((p) => p.alive && p.role === '女巫');
  const aliveGuardExists = players.some((p) => p.alive && p.role === '守卫');

  const seerConfirmed =
    seerOwnerId !== null || players.some((p) => p.role === '预言家');
  const witchConfirmed =
    witchOwnerId !== null || players.some((p) => p.role === '女巫');
  const guardConfirmed =
    guardOwnerId !== null || players.some((p) => p.role === '守卫');

  const seerIsDead = seerRoleExists && seerConfirmed && !aliveSeerExists;
  const witchIsDead = witchRoleExists && witchConfirmed && !aliveWitchExists;
  const guardIsDead = guardRoleExists && guardConfirmed && !aliveGuardExists;

  const selectableForSingleGod = useMemo(
    () => players.filter((p) => p.role === null),
    [players]
  );

  const wolfTarget = players.find((p) => p.id === wolfTargetId) ?? null;
  const checkedPlayer = players.find((p) => p.id === seerCheckId) ?? null;

  const hunterPlayer = players.find((p) => p.role === '猎人') ?? null;

  const hunterShootTargets = alivePlayers.filter(
    (p) => hunterPlayer !== null && p.id !== hunterPlayer.id
  );

  const whiteWolfKingPlayer =
    whiteWolfKingOwnerId !== null
      ? players.find((p) => p.id === whiteWolfKingOwnerId) ?? null
      : players.find((p) => p.role === '白狼王') ?? null;

  const wolfBeautyPlayer =
    wolfBeautyOwnerId !== null
      ? players.find((p) => p.id === wolfBeautyOwnerId) ?? null
      : null;

  const wolfBeautyRoleExists = config.hasWolfBeauty;
  const wolfBeautyIsDead = wolfBeautyPlayer !== null && !wolfBeautyPlayer.alive;

  const firstNightWolfBeautyReady =
    !config.hasWolfBeauty ||
    (draftWolfBeautyOwnerId !== null && wolfBeautyCharmTargetId !== null);
  const aliveWhiteWolfKing =
    whiteWolfKingPlayer !== null && whiteWolfKingPlayer.alive;
  const canWhiteWolfKingExplode =
    phase === 'day-result' &&
    dayApplied &&
    !gameOver &&
    aliveWhiteWolfKing &&
    !whiteWolfKingExploded;

  const knightPlayer =
    knightOwnerId !== null
      ? players.find((p) => p.id === knightOwnerId) ?? null
      : players.find((p) => p.role === '骑士') ?? null;

  const canKnightDuel =
    phase === 'day-result' &&
    dayApplied &&
    !voteApplied &&
    !gameOver &&
    !knightDuelUsed &&
    knightPlayer !== null &&
    knightPlayer.alive;

  const selectableWhiteWolfKingPlayers = players.filter(
    (p) => p.role === '狼人' || p.role === '白狼王'
  );

  // 隐狼玩家在狼人阶段不睁眼，因此未被选入 selectedWolfIds，此时 role 仍为 null
  const selectableHiddenWolfPlayers = players.filter((p) => p.role === null);

  const wolfTeamPlayers = players.filter(
    (p) => p.role === '狼人' || p.role === '白狼王' || p.role === '狼美人'
  );

  const selectableWolfBeautyPlayers = players.filter(
    (p) =>
      (p.role === '狼人' || p.role === '狼美人') &&
      p.id !== draftWhiteWolfKingOwnerId
  );

  const whiteWolfKingExplodeTargets = alivePlayers.filter(
    (p) => whiteWolfKingPlayer !== null && p.id !== whiteWolfKingPlayer.id
  );

  const finalWitchSave = witchSave;
  const finalWitchPoisonId = witchSave ? null : witchPoisonId;

  const dayResult = useMemo(() => {
    return buildDayResult({
      players,
      wolfTargetId,
      witchSave: finalWitchSave,
      witchPoisonId: finalWitchPoisonId,
      guardTargetId,
    });
  }, [
    players,
    wolfTargetId,
    finalWitchSave,
    finalWitchPoisonId,
    guardTargetId,
  ]);

  const bearInfo = useMemo(() => {
    if (!bearRoleExists) return null;
    if (!dayApplied) return null;
    if (phase !== 'day-result') return null;
    if (voteApplied) return null;

    return getBearInfo(players);
  }, [bearRoleExists, dayApplied, phase, voteApplied, players]);

  const alivePlayersAfterNight = useMemo(() => {
    const deadSet = new Set(dayApplied ? [] : dayResult.deadIds);
    return players.filter((p) => p.alive && !deadSet.has(p.id));
  }, [players, dayApplied, dayResult.deadIds]);

  const eligibleAliveVoters = alivePlayersAfterNight.filter(
    (p) => !(p.role === '白痴' && p.idiotRevealed)
  );

  const eligibleVoteTargets = alivePlayersAfterNight.filter(
    (p) => !(p.role === '白痴' && p.idiotRevealed)
  );

  const currentVoteTargets =
    voteRound === 2
      ? eligibleVoteTargets.filter((p) => revoteCandidateIds.includes(p.id))
      : eligibleVoteTargets;

  const currentVoters =
    voteRound === 2
      ? eligibleAliveVoters.filter((p) => !revoteCandidateIds.includes(p.id))
      : eligibleAliveVoters;

  const allCurrentVotersVoted = currentVoters.every(
    (player) => votes[player.id] != null
  );
  const unvotedPlayers = currentVoters.filter(
    (player) => votes[player.id] == null
  );

  const voteSummary: VoteSummary & { shouldRevote: boolean } = useMemo(() => {
    return calculateVoteSummary({
      votes,
      currentVoters,
      currentVoteTargets,
      players,
      voteRound,
    });
  }, [votes, currentVoters, currentVoteTargets, players, voteRound]);

  const displayVoteSummary = useMemo(() => {
    if (voteApplied && appliedVoteSummary) {
      return appliedVoteSummary;
    }
    return voteSummary;
  }, [voteApplied, appliedVoteSummary, voteSummary]);

  function updateConfig(patch: Partial<GameConfig>) {
    setConfig((prev) => ({ ...prev, ...patch }));
  }

  function updatePlayerName(id: number, value: string) {
    setPlayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, name: value } : p))
    );
  }

  function startGame() {
    if (!configValid) return;
    const freshPlayers = createBlankPlayers(playerCount);

    setPlayers(freshPlayers);
    setPhase('first-night-wolf');
    setFirstNightDone(false);

    setSelectedWolfIds([]);
    setWolfTargetId(null);

    setWhiteWolfKingOwnerId(null);
    setDraftWhiteWolfKingOwnerId(null);
    setWhiteWolfKingExploded(false);
    setWhiteWolfKingExplodeTargetId(null);
    setHunterShotMessage(null);
    setHunterShotEnglish(null);

    setWolfBeautyOwnerId(null);
    setDraftWolfBeautyOwnerId(null);
    setWolfBeautyCharmTargetId(null);
    setLastWolfBeautyCharmTargetId(null);

    setWolfBeautyLoverMessage(null);
    setWolfBeautyLoverEnglish(null);

    setSeerOwnerId(null);
    setDraftSeerOwnerId(null);
    setSeerCheckId(null);

    setWitchOwnerId(null);
    setDraftWitchOwnerId(null);
    setWitchSave(false);
    setWitchPoisonId(null);

    setGuardOwnerId(null);
    setDraftGuardOwnerId(null);
    setGuardTargetId(null);

    setHunterOwnerId(null);
    setDraftHunterOwnerId(null);

    setIdiotOwnerId(null);
    setDraftIdiotOwnerId(null);

    setBearOwnerId(null);
    setDraftBearOwnerId(null);

    setHiddenWolfOwnerId(null);
    setDraftHiddenWolfOwnerId(null);

    setKnightOwnerId(null);
    setDraftKnightOwnerId(null);
    setKnightDuelUsed(false);
    setKnightDuelTargetId(null);
    setKnightDuelMessage(null);
    setKnightDuelEnglish(null);

    setWitchSaveUsed(false);
    setWitchPoisonUsed(false);
    setLastGuardTargetId(null);

    setDayApplied(false);
    setVotes({});
    setVoteApplied(false);
    setVoteRound(1);
    setRevoteCandidateIds([]);
    setAppliedVoteSummary(null);

    setHunterShootSource(null);
    setHunterShotTargetId(null);
    setHunterShotUsed(false);

    setGameOver(false);
    setGameResult(null);
    setWhiteWolfKingMessage(null);
    setWhiteWolfKingEnglish(null);
  }

  function resetCurrentGame() {
    const freshPlayers = createBlankPlayers(playerCount);

    setPlayers(freshPlayers);
    setPhase('setup');
    setFirstNightDone(false);

    setSelectedWolfIds([]);
    setWolfTargetId(null);

    setWhiteWolfKingOwnerId(null);
    setDraftWhiteWolfKingOwnerId(null);
    setWhiteWolfKingExploded(false);
    setWhiteWolfKingExplodeTargetId(null);
    setHunterShotMessage(null);
    setHunterShotEnglish(null);

    setWolfBeautyOwnerId(null);
    setDraftWolfBeautyOwnerId(null);
    setWolfBeautyCharmTargetId(null);
    setLastWolfBeautyCharmTargetId(null);

    setWolfBeautyLoverMessage(null);
    setWolfBeautyLoverEnglish(null);

    setSeerOwnerId(null);
    setDraftSeerOwnerId(null);
    setSeerCheckId(null);

    setWitchOwnerId(null);
    setDraftWitchOwnerId(null);
    setWitchSave(false);
    setWitchPoisonId(null);

    setGuardOwnerId(null);
    setDraftGuardOwnerId(null);
    setGuardTargetId(null);

    setHunterOwnerId(null);
    setDraftHunterOwnerId(null);

    setIdiotOwnerId(null);
    setDraftIdiotOwnerId(null);

    setBearOwnerId(null);
    setDraftBearOwnerId(null);

    setHiddenWolfOwnerId(null);
    setDraftHiddenWolfOwnerId(null);

    setKnightOwnerId(null);
    setDraftKnightOwnerId(null);
    setKnightDuelUsed(false);
    setKnightDuelTargetId(null);
    setKnightDuelMessage(null);
    setKnightDuelEnglish(null);

    setWitchSaveUsed(false);
    setWitchPoisonUsed(false);
    setLastGuardTargetId(null);

    setDayApplied(false);
    setVotes({});
    setVoteApplied(false);
    setVoteRound(1);
    setRevoteCandidateIds([]);
    setAppliedVoteSummary(null);

    setHunterShootSource(null);
    setHunterShotTargetId(null);
    setHunterShotUsed(false);
    setGameOver(false);
    setGameResult(null);
    setWhiteWolfKingMessage(null);
    setWhiteWolfKingEnglish(null);

  }

  function startNextNight() {

    if (gameOver) return;

    setWolfTargetId(null);
    setWhiteWolfKingExplodeTargetId(null);
    setWolfBeautyCharmTargetId(null);
    setWolfBeautyLoverMessage(null);
    setWolfBeautyLoverEnglish(null);
    setHunterShotMessage(null);
    setHunterShotEnglish(null);
    setSeerCheckId(null);
    setWitchSave(false);
    setWitchPoisonId(null);
    setGuardTargetId(null);
    setDayApplied(false);
    setVotes({});
    setVoteApplied(false);
    setVoteRound(1);
    setRevoteCandidateIds([]);
    setAppliedVoteSummary(null);
    setKnightDuelTargetId(null);
    setKnightDuelMessage(null);
    setKnightDuelEnglish(null);
    setPhase('night-wolf');
    setWhiteWolfKingMessage(null);
    setWhiteWolfKingEnglish(null);

  }

  function confirmWolfBeautyCharmAndNext() {
    if (
      !wolfBeautyIsDead &&
      wolfBeautyOwnerId !== null &&
      wolfBeautyCharmTargetId !== null
    ) {
      setLastWolfBeautyCharmTargetId(wolfBeautyCharmTargetId);
    }

    setPhase(getNextNightPhaseAfterWolfBeauty(config));
  }

  function applyWolfBeautyLoverDeath(
    basePlayers: Player[],
    source: WolfBeautyDeathSource
  ): Player[] {
    if (!shouldTriggerWolfBeautyLoverDeath(source)) {
      return basePlayers;
    }

    const wolfBeautyPlayer = basePlayers.find((p) => p.role === '狼美人');
    const result = applyWolfBeautyLoverDeathLogic({
      players: basePlayers,
      wolfBeautyPlayerId: wolfBeautyPlayer?.id ?? null,
      charmedTargetId: lastWolfBeautyCharmTargetId,
    });

    if (result.triggered) {
      setWolfBeautyLoverMessage(result.message);
      setWolfBeautyLoverEnglish(result.english);
      return result.nextPlayers;
    }

    return basePlayers;
  }

  function applyDayResult() {
    if (dayApplied || gameOver) return;

    const hunterDiesAtNight =
      hunterPlayer !== null && dayResult.deadIds.includes(hunterPlayer.id);

    const hunterPoisonedAtNight =
      hunterPlayer !== null && finalWitchPoisonId === hunterPlayer.id;

    const baseNextPlayers =
      dayResult.deadIds.length > 0
        ? players.map((player) =>
          dayResult.deadIds.includes(player.id)
            ? { ...player, alive: false }
            : player
        )
        : players;

    const wolfBeautyDiedByPoison =
      wolfBeautyPlayer !== null &&
      finalWitchPoisonId === wolfBeautyPlayer.id &&
      dayResult.deadIds.includes(wolfBeautyPlayer.id);

    const afterBeauty = wolfBeautyDiedByPoison
      ? applyWolfBeautyLoverDeath(baseNextPlayers, 'witch-poison')
      : baseNextPlayers;
    const nextPlayers = applyHiddenWolfBindingDeath(afterBeauty);

    setPlayers(nextPlayers);

    if (witchSave) {
      setWitchSaveUsed(true);
      setWitchPoisonId(null);
    } else if (witchPoisonId !== null) {
      setWitchPoisonUsed(true);
    }

    setLastGuardTargetId(guardTargetId);
    setDayApplied(true);

    if (hunterDiesAtNight && !hunterPoisonedAtNight && !hunterShotUsed) {
      setHunterShootSource('night');
      setHunterShotTargetId(null);
      setPhase('hunter-shoot');
      return;
    }

    checkGameOver(nextPlayers);
  }

  useEffect(() => {
    if (phase !== 'day-result') return;
    if (dayApplied || gameOver) return;
    applyDayResult();
  }, [phase, dayApplied, gameOver, applyDayResult]);

  function setPlayerVote(voterId: number, targetId: number) {
    if (!currentVoteTargets.some((p) => p.id === targetId)) return;

    setVotes((prev) => ({
      ...prev,
      [voterId]: targetId,
    }));
  }

  function applyVoteResult() {
    if (voteApplied || gameOver) return;

    const latestSummary = calculateVoteSummary({
      votes,
      currentVoters,
      currentVoteTargets,
      players,
      voteRound,
    });

    const eliminatedPlayer =
      latestSummary.eliminatedId !== null
        ? players.find((p) => p.id === latestSummary.eliminatedId) ?? null
        : null;

    const idiotTriggered =
      eliminatedPlayer !== null &&
      eliminatedPlayer.role === '白痴' &&
      !eliminatedPlayer.idiotRevealed;

    const revealedIdiotWasTargeted =
      eliminatedPlayer !== null &&
      eliminatedPlayer.role === '白痴' &&
      eliminatedPlayer.idiotRevealed;

    if (voteRound === 1 && latestSummary.shouldRevote) {
      setAppliedVoteSummary(latestSummary);
      setVoteRound(2);
      setRevoteCandidateIds(latestSummary.topTargets);
      setVotes({});
      return;
    }

    if (idiotTriggered) {
      const nextPlayers = players.map((p) =>
        p.id === eliminatedPlayer.id ? { ...p, idiotRevealed: true } : p
      );

      const idiotSummary = {
        ...latestSummary,
        eliminatedId: null,
        isTie: false,
        shouldRevote: false,
        message: `白痴翻牌：${eliminatedPlayer.seat}号免于出局，本轮无人被放逐`,
        english: `Idiot revealed: Seat ${eliminatedPlayer.seat} survives, no one is eliminated this round`,
      };

      setAppliedVoteSummary(idiotSummary);
      setPlayers(nextPlayers);
      setVoteApplied(true);
      setPhase('day-result');

      checkGameOver(nextPlayers);
      return;
    }

    if (revealedIdiotWasTargeted) {
      const blockedSummary = {
        ...latestSummary,
        eliminatedId: null,
        isTie: false,
        shouldRevote: false,
        message: `已翻牌白痴不能被再次放逐，本轮无人被放逐`,
        english: `A revealed Idiot cannot be voted out again. No one is eliminated this round`,
      };

      setAppliedVoteSummary(blockedSummary);
      setVoteApplied(true);
      setPhase('day-result');
      return;
    }

    const hunterDiesByVote =
      hunterPlayer !== null && latestSummary.eliminatedId === hunterPlayer.id;

    const baseNextPlayers =
      latestSummary.eliminatedId !== null
        ? players.map((player) =>
          player.id === latestSummary.eliminatedId
            ? { ...player, alive: false }
            : player
        )
        : players;

    const wolfBeautyDiedByVote =
      wolfBeautyPlayer !== null &&
      latestSummary.eliminatedId === wolfBeautyPlayer.id;

    const afterBeauty = wolfBeautyDiedByVote
      ? applyWolfBeautyLoverDeath(baseNextPlayers, 'vote')
      : baseNextPlayers;
    const nextPlayers = applyHiddenWolfBindingDeath(afterBeauty);

    setAppliedVoteSummary(latestSummary);
    setPlayers(nextPlayers);
    setVoteApplied(true);

    if (hunterDiesByVote && !hunterShotUsed) {
      setHunterShootSource('vote');
      setHunterShotTargetId(null);
      setPhase('hunter-shoot');
      return;
    }

    setPhase('day-result');

    checkGameOver(nextPlayers);
  }

  const activeWolfCount = config.wolfCount - (config.hasHiddenWolf ? 1 : 0);

  function toggleWolfSelection(playerId: number) {
    setSelectedWolfIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      }
      if (prev.length >= activeWolfCount) {
        return prev;
      }
      return [...prev, playerId];
    });
  }

  const commitWolvesAndNext = createWolvesCommitHandler(
    selectedWolfIds,
    wolfTargetId,
    config,
    players,
    { setPlayers, setSelectedWolfIds, setPhase }
  );

  const commitWhiteWolfKingAndNext = createWhiteWolfKingCommitHandler(
    selectedWolfIds,
    draftWhiteWolfKingOwnerId,
    config,
    players,
    { setPlayers, setWhiteWolfKingOwnerId, setPhase, setFirstNightDone }
  );

  const commitWolfBeautyAndNext = createWolfBeautyCommitHandler(
    selectedWolfIds,
    draftWhiteWolfKingOwnerId,
    draftWolfBeautyOwnerId,
    wolfBeautyCharmTargetId,
    config,
    players,
    {
      setPlayers,
      setWolfBeautyOwnerId,
      setLastWolfBeautyCharmTargetId,
      setPhase,
      setFirstNightDone,
    }
  );

  const commitSeerAndNext = createStandardRoleCommitHandler(
    '预言家',
    draftSeerOwnerId,
    config,
    players,
    { setPlayers, setRoleOwnerId: setSeerOwnerId, setDraftRoleOwnerId: setDraftSeerOwnerId, setPhase, setFirstNightDone }
  );

  const commitWitchAndNext = createStandardRoleCommitHandler(
    '女巫',
    draftWitchOwnerId,
    config,
    players,
    { setPlayers, setRoleOwnerId: setWitchOwnerId, setDraftRoleOwnerId: setDraftWitchOwnerId, setPhase, setFirstNightDone }
  );

  const commitGuardAndNext = createStandardRoleCommitHandler(
    '守卫',
    draftGuardOwnerId,
    config,
    players,
    { setPlayers, setRoleOwnerId: setGuardOwnerId, setDraftRoleOwnerId: setDraftGuardOwnerId, setPhase, setFirstNightDone }
  );

  const commitHunterAndNext = createStandardRoleCommitHandler(
    '猎人',
    draftHunterOwnerId,
    config,
    players,
    { setPlayers, setRoleOwnerId: setHunterOwnerId, setDraftRoleOwnerId: setDraftHunterOwnerId, setPhase, setFirstNightDone }
  );

  const commitIdiotAndNext = createStandardRoleCommitHandler(
    '白痴',
    draftIdiotOwnerId,
    config,
    players,
    { setPlayers, setRoleOwnerId: setIdiotOwnerId, setDraftRoleOwnerId: setDraftIdiotOwnerId, setPhase, setFirstNightDone }
  );

  const commitBearAndNext = createStandardRoleCommitHandler(
    '熊',
    draftBearOwnerId,
    config,
    players,
    { setPlayers, setRoleOwnerId: setBearOwnerId, setDraftRoleOwnerId: setDraftBearOwnerId, setPhase, setFirstNightDone }
  );

  const commitHiddenWolfAndNext = createStandardRoleCommitHandler(
    '隐狼',
    draftHiddenWolfOwnerId,
    config,
    players,
    { setPlayers, setRoleOwnerId: setHiddenWolfOwnerId, setDraftRoleOwnerId: setDraftHiddenWolfOwnerId, setPhase, setFirstNightDone }
  );

  const commitKnightAndNext = createStandardRoleCommitHandler(
    '骑士',
    draftKnightOwnerId,
    config,
    players,
    { setPlayers, setRoleOwnerId: setKnightOwnerId, setDraftRoleOwnerId: setDraftKnightOwnerId, setPhase, setFirstNightDone }
  );

  function startKnightDuel() {
    if (!canKnightDuel) return;
    setKnightDuelTargetId(null);
    setPhase('knight-duel');
  }

  function applyKnightDuel() {
    if (knightDuelTargetId === null || knightPlayer === null || gameOver) return;

    const target = players.find((p) => p.id === knightDuelTargetId);
    if (!target) return;

    setKnightDuelUsed(true);

    if (isWolf(target.role)) {
      const base = players.map((p) =>
        p.id === target.id ? { ...p, alive: false } : p
      );
      const nextPlayers = applyHiddenWolfBindingDeath(base);
      setKnightDuelMessage(`骑士决斗成功：${target.seat}号（${target.role}）被刺杀出局，白天立即结束`);
      setKnightDuelEnglish(`Knight duel success: Seat ${target.seat} (${target.role}) slain. Day ends immediately.`);
      setPlayers(nextPlayers);
      setVoteApplied(true);
      setAppliedVoteSummary({
        tally: {},
        topTargets: [],
        maxVotes: 0,
        eliminatedId: null,
        isTie: false,
        shouldRevote: false,
        message: '骑士决斗成功，本日跳过投票',
        english: 'Knight duel succeeded. Voting is skipped today.',
      });
      setKnightDuelTargetId(null);
      setPhase('day-result');
      checkGameOver(nextPlayers);
    } else {
      const nextPlayers = players.map((p) =>
        p.id === knightPlayer.id ? { ...p, alive: false } : p
      );
      setKnightDuelMessage(`骑士决斗失败：骑士 ${knightPlayer.seat}号 出局，白天继续发言投票`);
      setKnightDuelEnglish(`Knight duel failed: Knight (Seat ${knightPlayer.seat}) eliminated. Day speech and voting continue.`);
      setPlayers(nextPlayers);
      setKnightDuelTargetId(null);
      setPhase('day-result');
      checkGameOver(nextPlayers);
    }
  }

  function startWhiteWolfKingExplode() {
    if (!canWhiteWolfKingExplode || whiteWolfKingPlayer === null) return;

    setWhiteWolfKingExplodeTargetId(null);
    setPhase('white-wolf-king-explode');
  }

  function skipHunterShot() {
    if (gameOver) return;

    setHunterShotUsed(true);
    const nextPhase = 'day-result';

    setHunterShootSource(null);
    setHunterShotTargetId(null);
    setHunterShotMessage('猎人选择不开枪');
    setHunterShotEnglish('Hunter chose not to shoot');
    setPhase(nextPhase);
  }

  function confirmHunterShot() {
    if (hunterShotTargetId === null || gameOver) return;

    const baseNextPlayers = players.map((player) =>
      player.id === hunterShotTargetId ? { ...player, alive: false } : player
    );

    const shotTarget = players.find((p) => p.id === hunterShotTargetId) ?? null;

    if (shotTarget) {
      setHunterShotMessage(`猎人开枪带走：${shotTarget.seat}号`);
      setHunterShotEnglish(`Hunter shot: Seat ${shotTarget.seat} was taken down`);
    }

    const wolfBeautyDiedByHunterShot =
      wolfBeautyPlayer !== null &&
      hunterShotTargetId === wolfBeautyPlayer.id;

    const afterBeauty = wolfBeautyDiedByHunterShot
      ? applyWolfBeautyLoverDeath(baseNextPlayers, 'hunter-shot')
      : baseNextPlayers;
    const nextPlayers = applyHiddenWolfBindingDeath(afterBeauty);

    setPlayers(nextPlayers);

    setHunterShotUsed(true);
    const nextPhase = 'day-result';
    setHunterShootSource(null);
    setHunterShotTargetId(null);
    setPhase(nextPhase);

    checkGameOver(nextPlayers);
  }

  function confirmWhiteWolfKingExplode() {
    if (
      gameOver ||
      whiteWolfKingPlayer === null ||
      whiteWolfKingExplodeTargetId === null
    ) {
      return;
    }

    const explodeTarget =
      players.find((player) => player.id === whiteWolfKingExplodeTargetId) ??
      null;

    const baseNextPlayers = players.map((player) => {
      if (
        player.id === whiteWolfKingPlayer.id ||
        player.id === whiteWolfKingExplodeTargetId
      ) {
        return { ...player, alive: false };
      }
      return player;
    });
    const nextPlayers = applyHiddenWolfBindingDeath(baseNextPlayers);

    if (explodeTarget) {
      setWhiteWolfKingMessage(
        `白狼王 ${whiteWolfKingPlayer.seat}号 自爆带走 ${explodeTarget.seat}号`
      );
      setWhiteWolfKingEnglish(
        `White Wolf King (Seat ${whiteWolfKingPlayer.seat}) exploded and took Seat ${explodeTarget.seat}`
      );
    }

    setPlayers(nextPlayers);
    setWhiteWolfKingExploded(true);
    setWhiteWolfKingExplodeTargetId(null);

    // 白狼王自爆后，白天立即结束，跳过投票
    setVotes({});
    setVoteRound(1);
    setRevoteCandidateIds([]);
    setVoteApplied(true);
    setAppliedVoteSummary({
      tally: {},
      topTargets: [],
      maxVotes: 0,
      eliminatedId: null,
      isTie: false,
      shouldRevote: false,
      message: '白狼王自爆，本日跳过投票',
      english: 'White Wolf King exploded. Voting is skipped today.',
    });
    setPhase('day-result');

    checkGameOver(nextPlayers);
  }

  function checkGameOver(nextPlayers: Player[]) {
    const result = checkGameOverLogic({ players: nextPlayers });

    if (result.gameOver) {
      setGameOver(true);
      setGameResult(`${result.result} / ${result.english}`);
      return true;
    }

    return false;
  }

  // 捆绑死亡：场上所有非隐狼的狼人全部出局时，隐狼自动死亡
  function applyHiddenWolfBindingDeath(currentPlayers: Player[]): Player[] {
    if (!config.hasHiddenWolf || hiddenWolfOwnerId === null) return currentPlayers;
    const hiddenWolf = currentPlayers.find((p) => p.id === hiddenWolfOwnerId);
    if (!hiddenWolf?.alive) return currentPlayers;
    const otherWolvesAlive = currentPlayers.some(
      (p) => p.alive && p.id !== hiddenWolfOwnerId && isWolf(p.role)
    );
    if (otherWolvesAlive) return currentPlayers;
    return currentPlayers.map((p) =>
      p.id === hiddenWolfOwnerId ? { ...p, alive: false } : p
    );
  }

  const firstNightWolfReady =
    selectedWolfIds.length === activeWolfCount && wolfTargetId !== null;

  const firstNightWhiteWolfKingReady =
    !config.hasWhiteWolfKing || draftWhiteWolfKingOwnerId !== null;

  const firstNightSeerReady =
    !seerRoleExists || (draftSeerOwnerId !== null && seerCheckId !== null);
  const firstNightWitchReady = !witchRoleExists || draftWitchOwnerId !== null;
  const firstNightGuardReady =
    !guardRoleExists || (draftGuardOwnerId !== null && guardTargetId !== null);
  const firstNightHunterReady =
    !hunterRoleExists || draftHunterOwnerId !== null;
  const firstNightBearReady =
    !bearRoleExists || draftBearOwnerId !== null;

  const firstNightKnightReady =
    !knightRoleExists || draftKnightOwnerId !== null;

  const firstNightHiddenWolfReady = !config.hasHiddenWolf || draftHiddenWolfOwnerId !== null;

  const blockSelfSave =
    firstNightDone &&
    wolfTargetId !== null &&
    players.find((p) => p.id === wolfTargetId)?.role === '女巫';

  const laterNightSaveDisabled =
    witchIsDead || witchSaveUsed || blockSelfSave || witchPoisonId !== null;
  const laterNightPoisonDisabled = witchIsDead || witchPoisonUsed || witchSave;

  return (
    <div className="min-h-screen bg-[var(--color-wolf-bg)] py-6 px-4">
      <div className="max-w-[980px] mx-auto">

        {/* ── Header ── */}
        <header className="mb-5 relative overflow-hidden rounded-2xl bg-[var(--color-wolf-card)] border border-[var(--color-wolf-border)] shadow-[var(--shadow-card)]">
          {/* top accent line */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[var(--color-blood)] to-transparent" />
          <div className="px-5 py-5 text-center">
            <div className="flex items-center justify-center gap-3 relative">
              <span className="text-2xl select-none">🐺</span>
              <h1 className="text-2xl font-black tracking-[0.15em] text-[var(--color-moon-bright)] uppercase" style={{ fontFamily: 'system-ui, sans-serif' }}>
                狼人杀
              </h1>
              <span className="text-2xl select-none">🐺</span>
              <button
                type="button"
                onClick={() => setShowHelp(true)}
                className="absolute right-0 border border-[var(--color-wolf-border-hi)] text-[var(--color-moon-dim)] hover:text-[var(--color-moon-bright)] hover:border-[var(--color-moon-dim)] px-2.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer"
                aria-label="角色说明"
              >
                ？角色
              </button>
            </div>
            <div className="mt-1 text-[11px] font-semibold tracking-[0.3em] uppercase text-[var(--color-blood)] opacity-80">
              WEREWOLF · JUDGE · ASSISTANT
            </div>
            <div className="my-3 flex items-center gap-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--color-wolf-border-hi)]" />
              <span className="text-[10px] text-[var(--color-moon-dim)] tracking-widest uppercase">Judge Tool</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--color-wolf-border-hi)]" />
            </div>
            {phase !== 'setup' && (
              <button
                type="button"
                className="border border-[var(--color-blood)] bg-transparent text-[var(--color-blood)] hover:bg-[var(--color-blood-glow)] px-4 py-1.5 rounded-full cursor-pointer font-bold text-xs transition-colors tracking-wide"
                onClick={resetCurrentGame}
              >
                ↺ 重开本局 · Restart
              </button>
            )}
          </div>
          {/* bottom accent line */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--color-wolf-border-hi)] to-transparent" />
        </header>

        {/* ── Phase badge ── */}
        <div className={`mb-5 px-4 py-3 rounded-xl border flex items-center gap-3 ${
          isNightPhase(phase)
            ? 'bg-[#0e0b1f] border-[#3730a3]'
            : phase === 'day-result' || phase === 'day-vote'
              ? 'bg-[var(--color-amber-dim)] border-[var(--color-amber-border)]'
              : phase === 'hunter-shoot' || phase === 'white-wolf-king-explode' || phase === 'knight-duel'
                ? 'bg-[var(--color-blood-dim)] border-[var(--color-blood)]'
                : 'bg-[var(--color-wolf-surface)] border-[var(--color-wolf-border)]'
        }`}>
          <span className="text-xl select-none flex-shrink-0">{getPhaseIcon(phase)}</span>
          <div className="flex-1 min-w-0">
            <div className={`font-bold text-sm tracking-wide ${
              isNightPhase(phase) ? 'text-[#818cf8]'
              : phase === 'day-result' || phase === 'day-vote' ? 'text-[#fde68a]'
              : phase === 'hunter-shoot' || phase === 'white-wolf-king-explode' || phase === 'knight-duel' ? 'text-[var(--color-dead-text)]'
              : 'text-[var(--color-moon-bright)]'
            }`}>
              {getPhaseLabel(phase)}
            </div>
            <div className="text-[10px] text-[var(--color-moon-dim)] mt-0.5 tracking-wider">
              {getPhaseEnglish(phase).replace('Current phase: ', '')}
            </div>
          </div>
        </div>

        {phase === 'setup' && (
          <SetupScreen
            config={config}
            playerCount={playerCount}
            configValid={configValid}
            players={players}
            includedGodCount={getIncludedGodCount(config)}
            onUpdateConfig={updateConfig}
            onUpdatePlayerName={updatePlayerName}
            onResetPlayersLength={() =>
              setPlayers(createBlankPlayers(playerCount))
            }
            onStartGame={startGame}
          />
        )}

        {phase === 'first-night-wolf' && (
          <FirstNightWolfScreen
            players={players}
            wolfCount={activeWolfCount}
            hasHiddenWolf={config.hasHiddenWolf}
            selectedWolfIds={selectedWolfIds}
            wolfTargetId={wolfTargetId}
            canGoNext={firstNightWolfReady}
            onToggleWolfSelection={toggleWolfSelection}
            onSetWolfTarget={setWolfTargetId}
            onNext={commitWolvesAndNext}
          />
        )}

        {phase === 'first-night-white-wolf-king' && config.hasWhiteWolfKing && (
          <FirstNightWhiteWolfKingScreen
            players={players}
            selectablePlayers={selectableWhiteWolfKingPlayers}
            draftWhiteWolfKingOwnerId={draftWhiteWolfKingOwnerId}
            canGoNext={firstNightWhiteWolfKingReady}
            onSelectWhiteWolfKing={setDraftWhiteWolfKingOwnerId}
            onBack={() =>
              setPhase(getPrevFirstNightPhase(config, 'first-night-white-wolf-king'))
            }
            onNext={commitWhiteWolfKingAndNext}
          />
        )}

        {phase === 'first-night-hidden-wolf' && config.hasHiddenWolf && (
          <FirstNightHiddenWolfScreen
            selectablePlayers={selectableHiddenWolfPlayers}
            wolfTeamPlayers={wolfTeamPlayers}
            draftHiddenWolfOwnerId={draftHiddenWolfOwnerId}
            canGoNext={firstNightHiddenWolfReady}
            onSelectHiddenWolf={setDraftHiddenWolfOwnerId}
            onBack={() => setPhase(getPrevFirstNightPhase(config, 'first-night-hidden-wolf'))}
            onNext={commitHiddenWolfAndNext}
          />
        )}

        {phase === 'first-night-wolf-beauty' && wolfBeautyRoleExists && (
          <FirstNightWolfBeautyScreen
            players={players}
            selectablePlayers={selectableWolfBeautyPlayers}
            alivePlayers={alivePlayers}
            draftWolfBeautyOwnerId={draftWolfBeautyOwnerId}
            wolfBeautyCharmTargetId={wolfBeautyCharmTargetId}
            canGoNext={firstNightWolfBeautyReady}
            onSelectWolfBeauty={setDraftWolfBeautyOwnerId}
            onSelectCharmTarget={setWolfBeautyCharmTargetId}
            onBack={() =>
              setPhase(getPrevFirstNightPhase(config, 'first-night-wolf-beauty'))
            }
            onNext={commitWolfBeautyAndNext}
          />
        )}

        {phase === 'first-night-seer' && seerRoleExists && (
          <FirstNightSeerScreen
            players={players}
            draftSeerOwnerId={draftSeerOwnerId}
            seerCheckId={seerCheckId}
            selectablePlayers={selectableForSingleGod}
            alivePlayers={alivePlayers}
            canGoNext={firstNightSeerReady}
            onSelectSeer={setDraftSeerOwnerId}
            onSelectCheckTarget={setSeerCheckId}
            onBack={() =>
              setPhase(getPrevFirstNightPhase(config, 'first-night-seer'))
            }
            onNext={commitSeerAndNext}
          />
        )}

        {phase === 'first-night-witch' && witchRoleExists && (
          <FirstNightWitchScreen
            players={players}
            draftWitchOwnerId={draftWitchOwnerId}
            wolfTarget={wolfTarget}
            witchSave={witchSave}
            witchPoisonId={witchPoisonId}
            witchSaveUsed={witchSaveUsed}
            witchPoisonUsed={witchPoisonUsed}
            selectablePlayers={selectableForSingleGod}
            alivePlayers={alivePlayers}
            canGoNext={firstNightWitchReady}
            onSelectWitch={setDraftWitchOwnerId}
            onToggleSave={setWitchSave}
            onSelectPoison={setWitchPoisonId}
            onBack={() =>
              setPhase(getPrevFirstNightPhase(config, 'first-night-witch'))
            }
            onNext={commitWitchAndNext}
          />
        )}

        {phase === 'first-night-guard' && guardRoleExists && (
          <FirstNightGuardScreen
            players={players}
            draftGuardOwnerId={draftGuardOwnerId}
            guardTargetId={guardTargetId}
            selectablePlayers={selectableForSingleGod}
            alivePlayers={alivePlayers}
            canGoNext={firstNightGuardReady}
            onSelectGuard={setDraftGuardOwnerId}
            onSelectTarget={setGuardTargetId}
            onBack={() =>
              setPhase(getPrevFirstNightPhase(config, 'first-night-guard'))
            }
            onNext={commitGuardAndNext}
          />
        )}

        {phase === 'first-night-hunter' && hunterRoleExists && (
          <FirstNightHunterScreen
            players={players}
            draftHunterOwnerId={draftHunterOwnerId}
            selectablePlayers={selectableForSingleGod}
            canGoNext={firstNightHunterReady}
            onSelectHunter={setDraftHunterOwnerId}
            onBack={() =>
              setPhase(getPrevFirstNightPhase(config, 'first-night-hunter'))
            }
            onNext={commitHunterAndNext}
          />
        )}

        {phase === 'first-night-idiot' && idiotRoleExists && (
          <FirstNightIdiotScreen
            players={players}
            draftIdiotOwnerId={draftIdiotOwnerId}
            selectablePlayers={selectableForSingleGod}
            canGoNext={draftIdiotOwnerId !== null}
            onSelectIdiot={(playerId) => setDraftIdiotOwnerId(playerId)}
            onBack={() =>
              setPhase(getPrevFirstNightPhase(config, 'first-night-idiot'))
            }
            onNext={commitIdiotAndNext}
          />
        )}

        {phase === 'first-night-bear' && bearRoleExists && (
          <FirstNightBearScreen
            players={players}
            draftBearOwnerId={draftBearOwnerId}
            selectablePlayers={players.filter((p) => p.role === null)}
            canGoNext={firstNightBearReady}
            onSelectBear={setDraftBearOwnerId}
            onBack={() => setPhase(getPrevFirstNightPhase(config, 'first-night-bear'))}
            onNext={commitBearAndNext}
          />
        )}

        {phase === 'first-night-knight' && knightRoleExists && (
          <FirstNightKnightScreen
            players={players}
            draftKnightOwnerId={draftKnightOwnerId}
            selectablePlayers={players.filter((p) => p.role === null)}
            canGoNext={firstNightKnightReady}
            onSelectKnight={setDraftKnightOwnerId}
            onBack={() => setPhase(getPrevFirstNightPhase(config, 'first-night-knight'))}
            onNext={commitKnightAndNext}
          />
        )}

        {phase === 'night-wolf' && (
          <NightWolfScreen
            alivePlayers={alivePlayers}
            wolfTargetId={wolfTargetId}
            canGoNext={wolfTargetId !== null}
            onSelectTarget={setWolfTargetId}
            onNext={() => setPhase(getNextNightPhaseAfterWolf(config))}
          />
        )}

        {phase === 'night-wolf-beauty' && wolfBeautyRoleExists && (
          <NightWolfBeautyScreen
            alivePlayers={alivePlayers}
            wolfBeautyPlayer={wolfBeautyPlayer}
            wolfBeautyCharmTargetId={wolfBeautyCharmTargetId}
            lastWolfBeautyCharmTargetId={lastWolfBeautyCharmTargetId}
            wolfBeautyIsDead={wolfBeautyIsDead}
            onSelectCharmTarget={setWolfBeautyCharmTargetId}
            onBack={() => setPhase(getPrevNightPhase(config, 'night-wolf-beauty'))}
            onNext={confirmWolfBeautyCharmAndNext}
          />
        )}

        {phase === 'night-seer' && seerRoleExists && (
          <NightSeerScreen
            alivePlayers={alivePlayers}
            seerCheckId={seerCheckId}
            seerIsDead={seerIsDead}
            checkedPlayer={checkedPlayer}
            onSelectCheckTarget={setSeerCheckId}
            onBack={() => setPhase(getPrevNightPhase(config, 'night-seer'))}
            onNext={() => setPhase(getNextNightPhaseAfterSeer(config))}
          />
        )}

        {phase === 'night-witch' && witchRoleExists && (
          <NightWitchScreen
            wolfTarget={wolfTarget}
            witchIsDead={witchIsDead}
            witchSave={witchSave}
            witchPoisonId={witchPoisonId}
            witchSaveUsed={witchSaveUsed}
            laterNightSaveDisabled={laterNightSaveDisabled}
            laterNightPoisonDisabled={laterNightPoisonDisabled}
            alivePlayers={alivePlayers}
            onToggleSave={setWitchSave}
            onSelectPoison={setWitchPoisonId}
            onBack={() => setPhase(getPrevNightPhase(config, 'night-witch'))}
            onNext={() => setPhase(getNextNightPhaseAfterWitch(config))}
          />
        )}

        {phase === 'night-guard' && guardRoleExists && (
          <NightGuardScreen
            alivePlayers={alivePlayers}
            guardTargetId={guardTargetId}
            guardIsDead={guardIsDead}
            lastGuardTargetId={lastGuardTargetId}
            onSelectTarget={setGuardTargetId}
            onBack={() => setPhase(getPrevNightPhase(config, 'night-guard'))}
            onNext={() => setPhase('day-result')}
          />
        )}

        {phase === 'day-result' && (
          <DayResultScreen
            players={players}
            dayResult={dayResult}
            voteSummary={displayVoteSummary}
            voteApplied={voteApplied}
            unvotedPlayers={unvotedPlayers}

            dayApplied={dayApplied}
            gameOver={gameOver}
            gameResult={gameResult}
            whiteWolfKingOwnerId={whiteWolfKingOwnerId}
            canWhiteWolfKingExplode={canWhiteWolfKingExplode}

            bearInfo={bearInfo}

            wolfBeautyLoverMessage={wolfBeautyLoverMessage}
            wolfBeautyLoverEnglish={wolfBeautyLoverEnglish}

            onBack={() => setPhase(getPrevNightPhase(config, 'day-result'))}
            onGoToVote={() => setPhase('day-vote')}
            onStartNextNight={startNextNight}
            hunterShotMessage={hunterShotMessage}
            hunterShotEnglish={hunterShotEnglish}
            whiteWolfKingMessage={whiteWolfKingMessage}
            whiteWolfKingEnglish={whiteWolfKingEnglish}
            onStartWhiteWolfKingExplode={startWhiteWolfKingExplode}
            canKnightDuel={canKnightDuel}
            knightDuelMessage={knightDuelMessage}
            knightDuelEnglish={knightDuelEnglish}
            onStartKnightDuel={startKnightDuel}
          />
        )}

        {phase === 'day-vote' && (
          <VoteScreen
            voters={currentVoters}
            voteTargets={currentVoteTargets}
            voteRound={voteRound}
            votes={votes}
            voteSummary={displayVoteSummary}
            voteApplied={voteApplied}
            allCurrentVotersVoted={allCurrentVotersVoted}  // 👈 新增
            onSetPlayerVote={setPlayerVote}
            onBack={() => setPhase('day-result')}
            onApplyVoteResult={applyVoteResult}
          />
        )}

        {phase === 'hunter-shoot' && hunterPlayer && hunterShootSource && (
          <HunterShootScreen
            aliveTargets={hunterShootTargets}
            selectedTargetId={hunterShotTargetId}
            onSelectTarget={setHunterShotTargetId}
            onSkip={skipHunterShot}
            onConfirm={confirmHunterShot}
          />
        )}

        {phase === 'knight-duel' && knightPlayer !== null && (
          <KnightDuelScreen
            knightPlayer={knightPlayer}
            duelTargets={alivePlayers.filter((p) => p.id !== knightPlayer.id)}
            selectedTargetId={knightDuelTargetId}
            onSelectTarget={setKnightDuelTargetId}
            onConfirm={applyKnightDuel}
            onCancel={() => setPhase('day-result')}
          />
        )}

        {phase === 'white-wolf-king-explode' && whiteWolfKingPlayer !== null && (
          <WhiteWolfKingExplodeScreen
            whiteWolfKingPlayer={whiteWolfKingPlayer}
            targets={whiteWolfKingExplodeTargets}
            selectedTargetId={whiteWolfKingExplodeTargetId}
            onSelectTarget={setWhiteWolfKingExplodeTargetId}
            onBack={() => setPhase('day-result')}
            onConfirm={confirmWhiteWolfKingExplode}
          />
        )}

        {showHelp && <RoleHelpModal onClose={() => setShowHelp(false)} />}
      </div>
    </div>
  );
}

function createBlankPlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    seat: i + 1,
    name: `玩家${i + 1}`,
    role: null as MaybeRole,
    alive: true,
    idiotRevealed: false
  }));
}

function getPhaseLabel(phase: Phase) {
  switch (phase) {
    case 'setup':
      return '开局设置';
    case 'first-night-wolf':
      return '第一夜：狼人';
    case 'first-night-seer':
      return '第一夜：预言家';
    case 'first-night-witch':
      return '第一夜：女巫';
    case 'first-night-guard':
      return '第一夜：守卫';
    case 'first-night-hunter':
      return '第一夜：猎人';
    case 'first-night-bear':
      return '第一夜：熊';
    case 'day-result':
      return '天亮结果';
    case 'day-vote':
      return '白天投票';
    case 'night-wolf':
      return '夜晚：狼人行动';
    case 'night-seer':
      return '夜晚：预言家行动';
    case 'night-witch':
      return '夜晚：女巫行动';
    case 'night-guard':
      return '夜晚：守卫行动';
    case 'hunter-shoot':
      return '猎人开枪';
    case 'first-night-idiot':
      return '第一夜：白痴';
    case 'first-night-white-wolf-king':
      return '第一夜：白狼王';
    case 'first-night-hidden-wolf':
      return '第一夜：隐狼';
    case 'white-wolf-king-explode':
      return '白狼王自爆';
    case 'first-night-wolf-beauty':
      return '第一夜：狼美人';
    case 'night-wolf-beauty':
      return '夜晚：狼美人魅惑';
    case 'first-night-knight':
      return '第一夜：骑士';
    case 'knight-duel':
      return '骑士决斗';
    default:
      return phase;
  }
}

function getPhaseEnglish(phase: Phase) {
  switch (phase) {
    case 'setup':
      return 'Current phase: Game setup';
    case 'first-night-wolf':
      return 'Current phase: First night - Wolves';
    case 'first-night-seer':
      return 'Current phase: First night - Seer';
    case 'first-night-witch':
      return 'Current phase: First night - Witch';
    case 'first-night-guard':
      return 'Current phase: First night - Guard';
    case 'first-night-hunter':
      return 'Current phase: First night - Hunter';
    case 'first-night-bear':
      return 'Current phase: First night - Bear';
    case 'day-result':
      return 'Current phase: Day result';
    case 'day-vote':
      return 'Current phase: Day voting';
    case 'night-wolf':
      return 'Current phase: Night - Wolves act';
    case 'night-seer':
      return 'Current phase: Night - Seer acts';
    case 'night-witch':
      return 'Current phase: Night - Witch acts';
    case 'night-guard':
      return 'Current phase: Night - Guard acts';
    case 'hunter-shoot':
      return 'Current phase: Hunter shoots';
    case 'first-night-idiot':
      return 'Current phase: First night - Idiot';
    case 'first-night-white-wolf-king':
      return 'Current phase: First night - White Wolf King';
    case 'first-night-hidden-wolf':
      return 'Current phase: First night - Hidden Wolf';
    case 'white-wolf-king-explode':
      return 'Current phase: White Wolf King explodes';
    case 'first-night-wolf-beauty':
      return 'Current phase: First night - Wolf Beauty';
    case 'night-wolf-beauty':
      return 'Current phase: Night - Wolf Beauty charms';
    case 'first-night-knight':
      return 'Current phase: First night - Knight';
    case 'knight-duel':
      return 'Current phase: Knight duel';
    default:
      return phase;
  }
}
