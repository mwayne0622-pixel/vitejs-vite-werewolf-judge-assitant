import { useState } from 'react';

export interface RoleOwnersState {
  seerOwnerId: number | null;
  draftSeerOwnerId: number | null;
  witchOwnerId: number | null;
  draftWitchOwnerId: number | null;
  guardOwnerId: number | null;
  draftGuardOwnerId: number | null;
  hunterOwnerId: number | null;
  draftHunterOwnerId: number | null;
  idiotOwnerId: number | null;
  draftIdiotOwnerId: number | null;
  whiteWolfKingOwnerId: number | null;
  draftWhiteWolfKingOwnerId: number | null;
  wolfBeautyOwnerId: number | null;
  draftWolfBeautyOwnerId: number | null;
  bearOwnerId: number | null;
  draftBearOwnerId: number | null;
}

/**
 * 管理所有 role 的所有者状态
 * 包括 confirmed 和 draft 两个版本
 */
export function useRoleOwners(initialState: RoleOwnersState) {
  const [seerOwnerId, setSeerOwnerId] = useState(initialState.seerOwnerId);
  const [draftSeerOwnerId, setDraftSeerOwnerId] = useState(initialState.draftSeerOwnerId);

  const [witchOwnerId, setWitchOwnerId] = useState(initialState.witchOwnerId);
  const [draftWitchOwnerId, setDraftWitchOwnerId] = useState(
    initialState.draftWitchOwnerId
  );

  const [guardOwnerId, setGuardOwnerId] = useState(initialState.guardOwnerId);
  const [draftGuardOwnerId, setDraftGuardOwnerId] = useState(
    initialState.draftGuardOwnerId
  );

  const [hunterOwnerId, setHunterOwnerId] = useState(initialState.hunterOwnerId);
  const [draftHunterOwnerId, setDraftHunterOwnerId] = useState(
    initialState.draftHunterOwnerId
  );

  const [idiotOwnerId, setIdiotOwnerId] = useState(initialState.idiotOwnerId);
  const [draftIdiotOwnerId, setDraftIdiotOwnerId] = useState(
    initialState.draftIdiotOwnerId
  );

  const [whiteWolfKingOwnerId, setWhiteWolfKingOwnerId] = useState(
    initialState.whiteWolfKingOwnerId
  );
  const [draftWhiteWolfKingOwnerId, setDraftWhiteWolfKingOwnerId] = useState(
    initialState.draftWhiteWolfKingOwnerId
  );

  const [wolfBeautyOwnerId, setWolfBeautyOwnerId] = useState(
    initialState.wolfBeautyOwnerId
  );
  const [draftWolfBeautyOwnerId, setDraftWolfBeautyOwnerId] = useState(
    initialState.draftWolfBeautyOwnerId
  );

  const [bearOwnerId, setBearOwnerId] = useState(initialState.bearOwnerId);
  const [draftBearOwnerId, setDraftBearOwnerId] = useState(
    initialState.draftBearOwnerId
  );

  return {
    seerOwnerId,
    setSeerOwnerId,
    draftSeerOwnerId,
    setDraftSeerOwnerId,
    witchOwnerId,
    setWitchOwnerId,
    draftWitchOwnerId,
    setDraftWitchOwnerId,
    guardOwnerId,
    setGuardOwnerId,
    draftGuardOwnerId,
    setDraftGuardOwnerId,
    hunterOwnerId,
    setHunterOwnerId,
    draftHunterOwnerId,
    setDraftHunterOwnerId,
    idiotOwnerId,
    setIdiotOwnerId,
    draftIdiotOwnerId,
    setDraftIdiotOwnerId,
    whiteWolfKingOwnerId,
    setWhiteWolfKingOwnerId,
    draftWhiteWolfKingOwnerId,
    setDraftWhiteWolfKingOwnerId,
    wolfBeautyOwnerId,
    setWolfBeautyOwnerId,
    draftWolfBeautyOwnerId,
    setDraftWolfBeautyOwnerId,
    bearOwnerId,
    setBearOwnerId,
    draftBearOwnerId,
    setDraftBearOwnerId,
  };
}
