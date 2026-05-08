import { useState } from 'react';

export interface SpecialEventsState {
  hunterShootSource: 'night' | 'vote' | null;
  hunterShotTargetId: number | null;
  hunterShotUsed: boolean;
  hunterShotMessage: string | null;
  hunterShotEnglish: string | null;

  whiteWolfKingExploded: boolean;
  whiteWolfKingExplodeTargetId: number | null;
  whiteWolfKingMessage: string | null;
  whiteWolfKingEnglish: string | null;

  wolfBeautyLoverMessage: string | null;
  wolfBeautyLoverEnglish: string | null;
}

/**
 * 管理游戏中的特殊事件
 * 包括：猎人开枪、白狼王自爆、狼美人殉情等特殊机制的消息和状态
 */
export function useSpecialEvents(initialState: SpecialEventsState) {
  const [hunterShootSource, setHunterShootSource] = useState(
    initialState.hunterShootSource
  );
  const [hunterShotTargetId, setHunterShotTargetId] = useState(
    initialState.hunterShotTargetId
  );
  const [hunterShotUsed, setHunterShotUsed] = useState(initialState.hunterShotUsed);
  const [hunterShotMessage, setHunterShotMessage] = useState(
    initialState.hunterShotMessage
  );
  const [hunterShotEnglish, setHunterShotEnglish] = useState(
    initialState.hunterShotEnglish
  );

  const [whiteWolfKingExploded, setWhiteWolfKingExploded] = useState(
    initialState.whiteWolfKingExploded
  );
  const [whiteWolfKingExplodeTargetId, setWhiteWolfKingExplodeTargetId] = useState(
    initialState.whiteWolfKingExplodeTargetId
  );
  const [whiteWolfKingMessage, setWhiteWolfKingMessage] = useState(
    initialState.whiteWolfKingMessage
  );
  const [whiteWolfKingEnglish, setWhiteWolfKingEnglish] = useState(
    initialState.whiteWolfKingEnglish
  );

  const [wolfBeautyLoverMessage, setWolfBeautyLoverMessage] = useState(
    initialState.wolfBeautyLoverMessage
  );
  const [wolfBeautyLoverEnglish, setWolfBeautyLoverEnglish] = useState(
    initialState.wolfBeautyLoverEnglish
  );

  return {
    // 猎人开枪
    hunterShootSource,
    setHunterShootSource,
    hunterShotTargetId,
    setHunterShotTargetId,
    hunterShotUsed,
    setHunterShotUsed,
    hunterShotMessage,
    setHunterShotMessage,
    hunterShotEnglish,
    setHunterShotEnglish,

    // 白狼王自爆
    whiteWolfKingExploded,
    setWhiteWolfKingExploded,
    whiteWolfKingExplodeTargetId,
    setWhiteWolfKingExplodeTargetId,
    whiteWolfKingMessage,
    setWhiteWolfKingMessage,
    whiteWolfKingEnglish,
    setWhiteWolfKingEnglish,

    // 狼美人殉情
    wolfBeautyLoverMessage,
    setWolfBeautyLoverMessage,
    wolfBeautyLoverEnglish,
    setWolfBeautyLoverEnglish,
  };
}
