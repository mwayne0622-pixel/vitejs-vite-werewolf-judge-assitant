import { useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';

import type { MaybeRole, Phase, Player, GameConfig } from './types';
import Bilingual from './components/Bilingual';
import {
  getIncludedGodCount,
  getPlayerCount,
  finalizeUnassignedVillagers,
  getNextFirstNightPhase,
  getPrevFirstNightPhase,
  getNextNightPhaseAfterWolf,
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

import { isGod, isWolf, isVillager } from './utils/roleUtils';

const STORAGE_KEY = 'wolf-judge-assistant-vote-split-v2';

const defaultConfig: GameConfig = {
  villagerCount: 2,
  wolfCount: 2,
  hasSeer: true,
  hasWitch: true,
  hasGuard: true,
  hasHunter: false,
  hasWhiteWolfKing: false,
  hasIdiot: false,
};

type VoteSummary = {
  tally: Record<number, number>;
  topTargets: number[];
  maxVotes: number;
  eliminatedId: number | null;
  isTie: boolean;
  message: string;
  english: string;
};

function calculateVoteSummary(params: {
  votes: Record<number, number | null>;
  currentVoters: Player[];
  currentVoteTargets: Player[];
  players: Player[];
  voteRound: 1 | 2;
}): VoteSummary & { shouldRevote: boolean } {
  const { votes, currentVoters, currentVoteTargets, players, voteRound } = params;

  const tally: Record<number, number> = {};

  currentVoters.forEach((player) => {
    const targetId = votes[player.id];
    if (
      targetId != null &&
      currentVoteTargets.some((target) => target.id === targetId)
    ) {
      tally[targetId] = (tally[targetId] || 0) + 1;
    }
  });

  const entries = Object.entries(tally).map(([targetId, count]) => ({
    targetId: Number(targetId),
    count,
  }));

  if (entries.length === 0) {
    return {
      tally,
      topTargets: [],
      maxVotes: 0,
      eliminatedId: null,
      isTie: false,
      shouldRevote: false,
      message: voteRound === 1 ? '尚未产生有效投票' : '尚未产生有效再投票',
      english: voteRound === 1 ? 'No valid votes yet' : 'No valid revotes yet',
    };
  }

  const maxVotes = Math.max(...entries.map((e) => e.count));
  const topTargets = entries
    .filter((e) => e.count === maxVotes)
    .map((e) => e.targetId);

  if (topTargets.length === 1) {
    const eliminated = players.find((p) => p.id === topTargets[0]) ?? null;
    return {
      tally,
      topTargets,
      maxVotes,
      eliminatedId: topTargets[0],
      isTie: false,
      shouldRevote: false,
      message: `投票出局：${eliminated?.seat}号`,
      english: `Voted out: Seat ${eliminated?.seat ?? ''}`,
    };
  }

  if (voteRound === 1) {
    return {
      tally,
      topTargets,
      maxVotes,
      eliminatedId: null,
      isTie: true,
      shouldRevote: true,
      message: `平票，进入第二轮投票：${topTargets
        .map((id) => {
          const p = players.find((player) => player.id === id);
          return p ? `${p.seat}号` : '';
        })
        .filter(Boolean)
        .join('、')}`,
      english: 'Tie vote, proceed to revote',
    };
  }

  return {
    tally,
    topTargets,
    maxVotes,
    eliminatedId: null,
    isTie: true,
    shouldRevote: false,
    message: '第二轮仍平票，无人出局',
    english: 'Revote tied, no one is eliminated',
  };
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

  const [idiotOwnerId, setIdiotOwnerId] = useState<number | null>(null);
  const [draftIdiotOwnerId, setDraftIdiotOwnerId] = useState<number | null>(null);

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

      setIdiotOwnerId(data.idiotOwnerId ?? null);
      setDraftIdiotOwnerId(data.draftIdiotOwnerId ?? null);

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

        idiotOwnerId,
        draftIdiotOwnerId,

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
    idiotOwnerId,
    draftIdiotOwnerId,
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

  const aliveSeerExists = players.some((p) => p.alive && p.role === '预言家');
  const aliveWitchExists = players.some((p) => p.alive && p.role === '女巫');
  const aliveGuardExists = players.some((p) => p.alive && p.role === '守卫');

  const seerConfirmed =
    seerOwnerId !== null || players.some((p) => p.role === '预言家');
  const witchConfirmed =
    witchOwnerId !== null || players.some((p) => p.role === '女巫');
  const guardConfirmed =
    guardOwnerId !== null || players.some((p) => p.role === '守卫');
  const hunterConfirmed =
    hunterOwnerId !== null || players.some((p) => p.role === '猎人');
  const idiotConfirmed =
    idiotOwnerId !== null || players.some((p) => p.role === '白痴');

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

  const alivePlayersAfterNight = useMemo(() => {
    const deadSet = new Set(dayApplied ? [] : dayResult.deadIds);
    return players.filter((p) => p.alive && !deadSet.has(p.id));
  }, [players, dayApplied, dayResult.deadIds]);

  const eligibleAliveVoters = alivePlayersAfterNight.filter(
    (p) => !(p.role === '白痴' && p.idiotRevealed)
  );

  const currentVoteTargets =
    voteRound === 2
      ? alivePlayersAfterNight.filter((p) => revoteCandidateIds.includes(p.id))
      : alivePlayersAfterNight;

  const currentVoters =
    voteRound === 2
      ? eligibleAliveVoters.filter((p) => !revoteCandidateIds.includes(p.id))
      : eligibleAliveVoters;

  const allCurrentVotersVoted = currentVoters.every(
    (player) => votes[player.id] != null
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

  }

  function startNextNight() {

    if (gameOver) return;

    setWolfTargetId(null);
    setWhiteWolfKingExplodeTargetId(null);
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

  }

  function applyDayResult() {
    if (dayApplied || gameOver) return;

    const hunterDiesAtNight =
      hunterPlayer !== null && dayResult.deadIds.includes(hunterPlayer.id);

    const hunterPoisonedAtNight =
      hunterPlayer !== null && finalWitchPoisonId === hunterPlayer.id;

    const nextPlayers =
      dayResult.deadIds.length > 0
        ? players.map((player) =>
          dayResult.deadIds.includes(player.id)
            ? { ...player, alive: false }
            : player
        )
        : players;

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

    const hunterDiesByVote =
      hunterPlayer !== null && latestSummary.eliminatedId === hunterPlayer.id;

    const nextPlayers =
      latestSummary.eliminatedId !== null
        ? players.map((player) =>
          player.id === latestSummary.eliminatedId
            ? { ...player, alive: false }
            : player
        )
        : players;

    setAppliedVoteSummary(latestSummary);
    setPlayers(nextPlayers);
    setVoteApplied(true);

    if (hunterDiesByVote && !hunterShotUsed) {
      setHunterShootSource('vote');
      setHunterShotTargetId(null);
      setPhase('hunter-shoot');
      return;
    }

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

  function commitWolvesAndNext() {
    setPlayers((prev) =>
      prev.map((p): Player => {
        if (selectedWolfIds.includes(p.id)) return { ...p, role: '狼人' };
        if (p.role === '狼人') return { ...p, role: null };
        return p;
      })
    );
    setPhase(getNextFirstNightPhase(config, 'first-night-wolf'));
  }

  function commitWhiteWolfKingAndNext() {
    if (draftWhiteWolfKingOwnerId === null) return;

    const nextPhase = getNextFirstNightPhase(config, 'first-night-white-wolf-king');

    const nextPlayers: Player[] = players.map((p): Player => {
      if (!selectedWolfIds.includes(p.id)) return p;

      return {
        ...p,
        role: p.id === draftWhiteWolfKingOwnerId ? '白狼王' : '狼人',
      };
    });

    if (nextPhase === 'day-result') {
      setPlayers(finalizeUnassignedVillagers(nextPlayers));
      setWhiteWolfKingOwnerId(draftWhiteWolfKingOwnerId);
      setFirstNightDone(true);
      setPhase('day-result');
      return;
    }

    setPlayers(nextPlayers);
    setWhiteWolfKingOwnerId(draftWhiteWolfKingOwnerId);
    setPhase(nextPhase);
  }

  function commitSeerAndNext() {
    if (draftSeerOwnerId === null) return;

    const nextPhase = getNextFirstNightPhase(config, 'first-night-seer');
    const nextPlayers: Player[] = players.map((p): Player => {
      if (p.role === '预言家' && p.id !== draftSeerOwnerId) {
        return { ...p, role: null };
      }
      if (p.id === draftSeerOwnerId) {
        return { ...p, role: '预言家' };
      }
      return p;
    });

    if (nextPhase === 'day-result') {
      setPlayers(finalizeUnassignedVillagers(nextPlayers));
      setSeerOwnerId(draftSeerOwnerId);
      setFirstNightDone(true);
      setPhase('day-result');
      return;
    }

    setPlayers(nextPlayers);
    setSeerOwnerId(draftSeerOwnerId);
    setPhase(nextPhase);
  }

  function commitWitchAndNext() {
    if (draftWitchOwnerId === null) return;

    const nextPhase = getNextFirstNightPhase(config, 'first-night-witch');
    const nextPlayers: Player[] = players.map((p): Player => {
      if (p.role === '女巫' && p.id !== draftWitchOwnerId) {
        return { ...p, role: null };
      }
      if (p.id === draftWitchOwnerId) {
        return { ...p, role: '女巫' };
      }
      return p;
    });

    if (nextPhase === 'day-result') {
      setPlayers(finalizeUnassignedVillagers(nextPlayers));
      setWitchOwnerId(draftWitchOwnerId);
      setFirstNightDone(true);
      setPhase('day-result');
      return;
    }

    setPlayers(nextPlayers);
    setWitchOwnerId(draftWitchOwnerId);
    setPhase(nextPhase);
  }

  function commitGuardAndNext() {
    if (draftGuardOwnerId === null) return;

    const nextPhase = getNextFirstNightPhase(config, 'first-night-guard');
    const nextPlayers: Player[] = players.map((p): Player => {
      if (p.role === '守卫' && p.id !== draftGuardOwnerId) {
        return { ...p, role: null };
      }
      if (p.id === draftGuardOwnerId) {
        return { ...p, role: '守卫' };
      }
      return p;
    });

    if (nextPhase === 'day-result') {
      setPlayers(finalizeUnassignedVillagers(nextPlayers));
      setGuardOwnerId(draftGuardOwnerId);
      setFirstNightDone(true);
      setPhase('day-result');
      return;
    }

    setPlayers(nextPlayers);
    setGuardOwnerId(draftGuardOwnerId);
    setPhase(nextPhase);
  }

  function commitHunterAndNext() {
    if (draftHunterOwnerId === null) return;

    const nextPhase = getNextFirstNightPhase(config, 'first-night-hunter');

    const nextPlayers: Player[] = players.map((p): Player => {
      if (p.role === '猎人' && p.id !== draftHunterOwnerId) {
        return { ...p, role: null };
      }
      if (p.id === draftHunterOwnerId) {
        return { ...p, role: '猎人' };
      }
      return p;
    });

    if (nextPhase === 'day-result') {
      setPlayers(finalizeUnassignedVillagers(nextPlayers));
      setHunterOwnerId(draftHunterOwnerId);
      setFirstNightDone(true);
      setPhase('day-result');
      return;
    }

    setPlayers(nextPlayers);
    setHunterOwnerId(draftHunterOwnerId);
    setPhase(nextPhase);
  }

  function commitIdiotAndNext() {
    if (draftIdiotOwnerId === null) return;

    const nextPlayers: Player[] = players.map((p): Player => {
      if (p.role === '白痴' && p.id !== draftIdiotOwnerId) {
        return { ...p, role: null };
      }
      if (p.id === draftIdiotOwnerId) {
        return { ...p, role: '白痴' };
      }
      return p;
    });

    setPlayers(finalizeUnassignedVillagers(nextPlayers));
    setIdiotOwnerId(draftIdiotOwnerId);
    setFirstNightDone(true);
    setPhase('day-result');
  }

  function startWhiteWolfKingExplode() {
    if (!canWhiteWolfKingExplode || whiteWolfKingPlayer === null) return;

    setWhiteWolfKingExplodeTargetId(null);
    setPhase('white-wolf-king-explode');
  }

  function skipHunterShot() {
    if (gameOver) return;

    setHunterShotUsed(true);
    const nextPhase = hunterShootSource === 'night' ? 'day-result' : 'day-vote';
    setHunterShootSource(null);
    setHunterShotTargetId(null);
    setPhase(nextPhase);
  }

  function confirmHunterShot() {
    if (hunterShotTargetId === null || gameOver) return;

    const nextPlayers = players.map((player) =>
      player.id === hunterShotTargetId ? { ...player, alive: false } : player
    );

    setPlayers(nextPlayers);

    setHunterShotUsed(true);
    const nextPhase = hunterShootSource === 'night' ? 'day-result' : 'day-vote';
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

    const nextPlayers = players.map((player) => {
      if (
        player.id === whiteWolfKingPlayer.id ||
        player.id === whiteWolfKingExplodeTargetId
      ) {
        return { ...player, alive: false };
      }
      return player;
    });

    setPlayers(nextPlayers);
    setWhiteWolfKingExploded(true);
    setWhiteWolfKingExplodeTargetId(null);

    const ended = checkGameOver(nextPlayers);
    if (ended) return;

    startNextNight();
  }

  function checkGameOver(nextPlayers: Player[]) {
    const aliveWolves = nextPlayers.filter(
      (p) => p.alive && isWolf(p.role)
    ).length;

    const aliveVillagers = nextPlayers.filter(
      (p) => p.alive && isVillager(p.role)
    ).length;

    const aliveGods = nextPlayers.filter(
      (p) => p.alive && isGod(p.role)
    ).length;

    if (aliveWolves === 0) {
      setGameOver(true);
      setGameResult('好人阵营胜利 / Good team wins');
      return true;
    }

    if (aliveVillagers === 0) {
      setGameOver(true);
      setGameResult('狼人阵营胜利 / Wolves win');
      return true;
    }

    if (aliveGods === 0) {
      setGameOver(true);
      setGameResult('狼人阵营胜利 / Wolves win');
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
        </div>

        {gameOver && gameResult && (
          <div style={styles.gameOverBox}>
            <Bilingual zh={gameResult} en={gameResult} align="center" />
          </div>
        )}

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

        {phase === 'night-wolf' && (
          <NightWolfScreen
            alivePlayers={alivePlayers}
            wolfTargetId={wolfTargetId}
            canGoNext={wolfTargetId !== null}
            onSelectTarget={setWolfTargetId}
            onNext={() => setPhase(getNextNightPhaseAfterWolf(config))}
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
            wolfTargetId={wolfTargetId}
            seerCheckId={seerCheckId}
            witchSave={finalWitchSave}
            witchPoisonId={finalWitchPoisonId}
            guardTargetId={guardTargetId}
            voteSummary={displayVoteSummary}
            voteApplied={voteApplied}
            dayApplied={dayApplied}
            onBack={() => setPhase(getPrevNightPhase(config, 'day-result'))}
            onApplyDayResult={applyDayResult}
            onGoToVote={() => setPhase('day-vote')}
            onApplyVote={applyVoteResult}
            onStartNextNight={startNextNight}
            onReset={resetCurrentGame}
            whiteWolfKingOwnerId={whiteWolfKingOwnerId}
            canWhiteWolfKingExplode={canWhiteWolfKingExplode}
            onStartWhiteWolfKingExplode={startWhiteWolfKingExplode}
            getRoleDisplay={getRoleDisplay}
            gameOver={gameOver}
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
    default:
      return phase;
  }
}

function getRoleDisplay(player: Player): string {
  if (!player.role) return '未分配';

  if (player.role === '白痴' && player.idiotRevealed) {
    return '白痴（已翻牌）';
  }

  return player.role;
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
  gameOverBox: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 16,
    background: '#fef3c7',
    color: '#92400e',
    border: '1px solid #f59e0b',
    fontWeight: 700,
  },
};
