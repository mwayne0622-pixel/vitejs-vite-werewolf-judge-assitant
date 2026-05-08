import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

import type { MaybeRole, Phase, Player, GameConfig } from './types';
import Bilingual from './components/Bilingual';
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
import WhiteWolfKingExplodeScreen from './screens/WhiteWolfKingExplodeScreen';

import FirstNightWolfBeautyScreen from './screens/FirstNightWolfBeautyScreen';
import NightWolfBeautyScreen from './screens/NightWolfBeautyScreen';

import FirstNightBearScreen from './screens/FirstNightBearScreen';
import { getBearInfo } from './utils/bearLogic';
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
  const [config, setConfig] = useState<GameConfig>(defaultConfig);
  const [phase, setPhase] = useState<Phase>('setup');
  const [players, setPlayers] = useState<Player[]>(
    createBlankPlayers(getPlayerCount(defaultConfig))
  );

  const [firstNightDone, setFirstNightDone] = useState(false);

  const [selectedWolfIds, setSelectedWolfIds] = useState<number[]>([]);
  const [wolfTargetId, setWolfTargetId] = useState<number | null>(null);

  const [whiteWolfKingOwnerId, setWhiteWolfKingOwnerId] = useState<number | null>(null);
  const [draftWhiteWolfKingOwnerId, setDraftWhiteWolfKingOwnerId] = useState<number | null>(null);

  const [whiteWolfKingExploded, setWhiteWolfKingExploded] = useState(false);
  const [whiteWolfKingExplodeTargetId, setWhiteWolfKingExplodeTargetId] = useState<number | null>(null);

  const [wolfBeautyOwnerId, setWolfBeautyOwnerId] = useState<number | null>(null);
  const [draftWolfBeautyOwnerId, setDraftWolfBeautyOwnerId] = useState<number | null>(null);

  const [wolfBeautyCharmTargetId, setWolfBeautyCharmTargetId] = useState<number | null>(null);
  const [lastWolfBeautyCharmTargetId, setLastWolfBeautyCharmTargetId] = useState<number | null>(null);

  const [wolfBeautyLoverMessage, setWolfBeautyLoverMessage] = useState<string | null>(null);
  const [wolfBeautyLoverEnglish, setWolfBeautyLoverEnglish] = useState<string | null>(null);

  const [seerOwnerId, setSeerOwnerId] = useState<number | null>(null);
  const [draftSeerOwnerId, setDraftSeerOwnerId] = useState<number | null>(null);
  const [seerCheckId, setSeerCheckId] = useState<number | null>(null);

  const [witchOwnerId, setWitchOwnerId] = useState<number | null>(null);
  const [draftWitchOwnerId, setDraftWitchOwnerId] = useState<number | null>(
    null
  );
  const [witchSave, setWitchSave] = useState(false);
  const [witchPoisonId, setWitchPoisonId] = useState<number | null>(null);

  const [guardOwnerId, setGuardOwnerId] = useState<number | null>(null);
  const [draftGuardOwnerId, setDraftGuardOwnerId] = useState<number | null>(
    null
  );
  const [guardTargetId, setGuardTargetId] = useState<number | null>(null);

  const [hunterOwnerId, setHunterOwnerId] = useState<number | null>(null);
  const [draftHunterOwnerId, setDraftHunterOwnerId] = useState<number | null>(
    null
  );

  const [witchSaveUsed, setWitchSaveUsed] = useState(false);
  const [witchPoisonUsed, setWitchPoisonUsed] = useState(false);
  const [lastGuardTargetId, setLastGuardTargetId] = useState<number | null>(
    null
  );

  const [dayApplied, setDayApplied] = useState(false);

  const [votes, setVotes] = useState<Record<number, number | null>>({});
  const [voteApplied, setVoteApplied] = useState(false);

  const [voteRound, setVoteRound] = useState<1 | 2>(1);
  const [revoteCandidateIds, setRevoteCandidateIds] = useState<number[]>([]);

  const [appliedVoteSummary, setAppliedVoteSummary] = useState<
    (VoteSummary & { shouldRevote: boolean }) | null
  >(null);

  const [hunterShootSource, setHunterShootSource] = useState<
    'night' | 'vote' | null
  >(null);
  const [hunterShotTargetId, setHunterShotTargetId] = useState<number | null>(
    null
  );
  const [hunterShotUsed, setHunterShotUsed] = useState(false);
  const [hunterShotMessage, setHunterShotMessage] = useState<string | null>(null);
  const [hunterShotEnglish, setHunterShotEnglish] = useState<string | null>(null);

  const [whiteWolfKingMessage, setWhiteWolfKingMessage] = useState<string | null>(null);
  const [whiteWolfKingEnglish, setWhiteWolfKingEnglish] = useState<string | null>(null);

  const [idiotOwnerId, setIdiotOwnerId] = useState<number | null>(null);
  const [draftIdiotOwnerId, setDraftIdiotOwnerId] = useState<number | null>(null);

  const [draftBearOwnerId, setDraftBearOwnerId] = useState<number | null>(null);
  const [bearOwnerId, setBearOwnerId] = useState<number | null>(null);

  const [gameOver, setGameOver] = useState(false);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const playerCount = getPlayerCount(config);
  const configValid = config.wolfCount >= 1 && config.villagerCount >= 0;

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    try {
      const data = JSON.parse(raw);
      const loadedConfig: GameConfig = data.config ?? defaultConfig;

      setConfig(loadedConfig);
      setPhase(data.phase ?? 'setup');
      setPlayers(
        Array.isArray(data.players)
          ? data.players
          : createBlankPlayers(getPlayerCount(loadedConfig))
      );

      setFirstNightDone(Boolean(data.firstNightDone));

      setSelectedWolfIds(
        Array.isArray(data.selectedWolfIds) ? data.selectedWolfIds : []
      );
      setWolfTargetId(data.wolfTargetId ?? null);

      setWhiteWolfKingOwnerId(data.whiteWolfKingOwnerId ?? null);
      setDraftWhiteWolfKingOwnerId(data.draftWhiteWolfKingOwnerId ?? null);
      setWhiteWolfKingExploded(Boolean(data.whiteWolfKingExploded));
      setWhiteWolfKingExplodeTargetId(data.whiteWolfKingExplodeTargetId ?? null);

      setWolfBeautyOwnerId(data.wolfBeautyOwnerId ?? null);
      setDraftWolfBeautyOwnerId(data.draftWolfBeautyOwnerId ?? null);
      setWolfBeautyCharmTargetId(data.wolfBeautyCharmTargetId ?? null);
      setLastWolfBeautyCharmTargetId(data.lastWolfBeautyCharmTargetId ?? null);
      setWolfBeautyLoverMessage(data.wolfBeautyLoverMessage ?? null);
      setWolfBeautyLoverEnglish(data.wolfBeautyLoverEnglish ?? null);

      setSeerOwnerId(data.seerOwnerId ?? null);
      setDraftSeerOwnerId(data.draftSeerOwnerId ?? null);
      setSeerCheckId(data.seerCheckId ?? null);

      setWitchOwnerId(data.witchOwnerId ?? null);
      setDraftWitchOwnerId(data.draftWitchOwnerId ?? null);
      setWitchSave(Boolean(data.witchSave));
      setWitchPoisonId(data.witchPoisonId ?? null);

      setGuardOwnerId(data.guardOwnerId ?? null);
      setDraftGuardOwnerId(data.draftGuardOwnerId ?? null);
      setGuardTargetId(data.guardTargetId ?? null);

      setHunterOwnerId(data.hunterOwnerId ?? null);
      setDraftHunterOwnerId(data.draftHunterOwnerId ?? null);

      setWitchSaveUsed(Boolean(data.witchSaveUsed));
      setWitchPoisonUsed(Boolean(data.witchPoisonUsed));
      setLastGuardTargetId(data.lastGuardTargetId ?? null);

      setDayApplied(Boolean(data.dayApplied));
      setVotes(data.votes ?? {});
      setVoteApplied(Boolean(data.voteApplied));

      setVoteRound(data.voteRound === 2 ? 2 : 1);
      setRevoteCandidateIds(Array.isArray(data.revoteCandidateIds) ? data.revoteCandidateIds : []);
      setAppliedVoteSummary(data.appliedVoteSummary ?? null);

      setHunterShootSource(data.hunterShootSource ?? null);
      setHunterShotTargetId(data.hunterShotTargetId ?? null);
      setHunterShotUsed(Boolean(data.hunterShotUsed));

      setHunterShotMessage(data.hunterShotMessage ?? null);
      setHunterShotEnglish(data.hunterShotEnglish ?? null);

      setIdiotOwnerId(data.idiotOwnerId ?? null);
      setDraftIdiotOwnerId(data.draftIdiotOwnerId ?? null);

      setBearOwnerId(data.bearOwnerId ?? null);
      setDraftBearOwnerId(data.draftBearOwnerId ?? null);

      setGameOver(Boolean(data.gameOver));
      setGameResult(data.gameResult ?? null);
    } catch {
      // ignore bad cache
    }
  }, []);

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

  const selectableWhiteWolfKingPlayers = players.filter(
    (p) => p.role === '狼人' || p.role === '白狼王'
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

    const nextPlayers = wolfBeautyDiedByPoison
      ? applyWolfBeautyLoverDeath(baseNextPlayers, 'witch-poison')
      : baseNextPlayers;

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

    const nextPlayers = wolfBeautyDiedByVote
      ? applyWolfBeautyLoverDeath(baseNextPlayers, 'vote')
      : baseNextPlayers;

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

  function toggleWolfSelection(playerId: number) {
    setSelectedWolfIds((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      }
      if (prev.length >= config.wolfCount) {
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

    const nextPlayers = wolfBeautyDiedByHunterShot
      ? applyWolfBeautyLoverDeath(baseNextPlayers, 'hunter-shot')
      : baseNextPlayers;

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

    const nextPlayers = players.map((player) => {
      if (
        player.id === whiteWolfKingPlayer.id ||
        player.id === whiteWolfKingExplodeTargetId
      ) {
        return { ...player, alive: false };
      }
      return player;
    });

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

  const firstNightWolfReady =
    selectedWolfIds.length === config.wolfCount && wolfTargetId !== null;

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

  const blockSelfSave =
    firstNightDone &&
    wolfTargetId !== null &&
    players.find((p) => p.id === wolfTargetId)?.role === '女巫';

  const laterNightSaveDisabled =
    witchIsDead || witchSaveUsed || blockSelfSave || witchPoisonId !== null;
  const laterNightPoisonDisabled = witchIsDead || witchPoisonUsed || witchSave;

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerBlock}>
          <Bilingual
            zh="狼人杀法官助手"
            en="Werewolf Judge Assistant"
            align="center"
          />
          <div style={{ marginTop: 10 }}>
            <Bilingual
              zh="首夜确认身份并同步完成动作"
              en="First night confirms identities and completes actions at the same time"
              align="center"
              small
            />
          </div>
          {phase !== 'setup' && (
            <div style={{ marginTop: 14, textAlign: 'center' }}>
              <button
                type="button"
                style={styles.headerResetButton}
                onClick={resetCurrentGame}
              >
                <Bilingual zh="重开本局" en="Restart game" small />
              </button>
            </div>
          )}
        </div>

        <div style={styles.phaseBar}>
          <Bilingual
            zh={`当前阶段：${getPhaseLabel(phase)}`}
            en={getPhaseEnglish(phase)}
          />
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
            wolfCount={config.wolfCount}
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
            witchPoisonUsed={witchPoisonUsed}
            blockSelfSave={blockSelfSave}
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

            onStartWhiteWolfKingExplode={startWhiteWolfKingExplode}

            onBack={() => setPhase(getPrevNightPhase(config, 'day-result'))}
            onApplyDayResult={applyDayResult}
            onGoToVote={() => setPhase('day-vote')}
            onStartNextNight={startNextNight}
            onReset={resetCurrentGame}
            hunterShotMessage={hunterShotMessage}
            hunterShotEnglish={hunterShotEnglish}
            whiteWolfKingMessage={whiteWolfKingMessage}
            whiteWolfKingEnglish={whiteWolfKingEnglish}
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
            source={hunterShootSource}
            hunterPlayer={hunterPlayer}
            aliveTargets={hunterShootTargets}
            selectedTargetId={hunterShotTargetId}
            onSelectTarget={setHunterShotTargetId}
            onSkip={skipHunterShot}
            onConfirm={confirmHunterShot}
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
    case 'white-wolf-king-explode':
      return '白狼王自爆';
    case 'first-night-wolf-beauty':
      return '第一夜：狼美人';
    case 'night-wolf-beauty':
      return '夜晚：狼美人魅惑';
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
    case 'white-wolf-king-explode':
      return 'Current phase: White Wolf King explodes';
    case 'first-night-wolf-beauty':
      return 'Current phase: First night - Wolf Beauty';
    case 'night-wolf-beauty':
      return 'Current phase: Night - Wolf Beauty charms';
    default:
      return phase;
  }
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#f3f4f6',
    padding: '24px 16px',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  container: {
    maxWidth: 980,
    margin: '0 auto',
  },
  headerBlock: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    background: '#ffffff',
    boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
  },
  phaseBar: {
    marginBottom: 20,
    padding: 14,
    borderRadius: 14,
    background: '#e5e7eb',
    color: '#111827',
  },
  card: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    marginBottom: 20,
  },
  tipBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    color: '#374151',
    border: '1px solid #e5e7eb',
  },
  deadNotice: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#fff7ed',
    color: '#9a3412',
    border: '1px solid #fdba74',
  },
  optionList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  optionButton: {
    border: '1px solid #d1d5db',
    borderRadius: 14,
    padding: '12px 14px',
    cursor: 'pointer',
    fontSize: 14,
    background: '#ffffff',
  },
  actionRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 20,
  },
  primaryButton: {
    border: 'none',
    background: '#111827',
    color: '#ffffff',
    padding: '12px 16px',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 700,
  },
  secondaryButton: {
    border: '1px solid #d1d5db',
    background: '#ffffff',
    color: '#111827',
    padding: '12px 16px',
    borderRadius: 14,
    cursor: 'pointer',
    fontWeight: 700,
  },
  resultBox: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
    background: '#eff6ff',
    color: '#1e3a8a',
  },
  checkboxRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 15,
    color: '#111827',
  },
  headerResetButton: {
    border: '1px solid #fecaca',
    background: '#ffffff',
    color: '#b91c1c',
    padding: '8px 14px',
    borderRadius: 999,
    cursor: 'pointer',
    fontWeight: 700,
    fontSize: 13,
  },
};
