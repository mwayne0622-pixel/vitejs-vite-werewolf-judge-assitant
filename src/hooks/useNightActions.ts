import { useState } from 'react';

export interface NightActionsState {
  selectedWolfIds: number[];
  wolfTargetId: number | null;
  seerCheckId: number | null;
  witchSave: boolean;
  witchPoisonId: number | null;
  witchSaveUsed: boolean;
  witchPoisonUsed: boolean;
  guardTargetId: number | null;
  lastGuardTargetId: number | null;
  wolfBeautyCharmTargetId: number | null;
  lastWolfBeautyCharmTargetId: number | null;
}

/**
 * 管理所有夜间行动的状态
 * 包括：狼人目标、预言家检查、女巫救毒、守卫保护、狼美人魅惑等
 */
export function useNightActions(initialState: NightActionsState) {
  const [selectedWolfIds, setSelectedWolfIds] = useState(initialState.selectedWolfIds);
  const [wolfTargetId, setWolfTargetId] = useState(initialState.wolfTargetId);

  const [seerCheckId, setSeerCheckId] = useState(initialState.seerCheckId);

  const [witchSave, setWitchSave] = useState(initialState.witchSave);
  const [witchPoisonId, setWitchPoisonId] = useState(initialState.witchPoisonId);
  const [witchSaveUsed, setWitchSaveUsed] = useState(initialState.witchSaveUsed);
  const [witchPoisonUsed, setWitchPoisonUsed] = useState(initialState.witchPoisonUsed);

  const [guardTargetId, setGuardTargetId] = useState(initialState.guardTargetId);
  const [lastGuardTargetId, setLastGuardTargetId] = useState(
    initialState.lastGuardTargetId
  );

  const [wolfBeautyCharmTargetId, setWolfBeautyCharmTargetId] = useState(
    initialState.wolfBeautyCharmTargetId
  );
  const [lastWolfBeautyCharmTargetId, setLastWolfBeautyCharmTargetId] = useState(
    initialState.lastWolfBeautyCharmTargetId
  );

  // 重置所有夜间行动（为新的一夜做准备）
  const resetNightActions = () => {
    setWolfTargetId(null);
    setSeerCheckId(null);
    setWitchSave(false);
    setWitchPoisonId(null);
    setGuardTargetId(null);
    setWolfBeautyCharmTargetId(null);
  };

  return {
    selectedWolfIds,
    setSelectedWolfIds,
    wolfTargetId,
    setWolfTargetId,

    seerCheckId,
    setSeerCheckId,

    witchSave,
    setWitchSave,
    witchPoisonId,
    setWitchPoisonId,
    witchSaveUsed,
    setWitchSaveUsed,
    witchPoisonUsed,
    setWitchPoisonUsed,

    guardTargetId,
    setGuardTargetId,
    lastGuardTargetId,
    setLastGuardTargetId,

    wolfBeautyCharmTargetId,
    setWolfBeautyCharmTargetId,
    lastWolfBeautyCharmTargetId,
    setLastWolfBeautyCharmTargetId,

    resetNightActions,
  };
}
