import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  alivePlayers: Player[];
  wolfBeautyPlayer: Player | null;
  wolfBeautyCharmTargetId: number | null;
  lastWolfBeautyCharmTargetId: number | null;
  wolfBeautyIsDead: boolean;
  onSelectCharmTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function NightWolfBeautyScreen({
  alivePlayers,
  wolfBeautyPlayer,
  wolfBeautyCharmTargetId,
  lastWolfBeautyCharmTargetId,
  wolfBeautyIsDead,
  onSelectCharmTarget,
  onBack,
  onNext,
}: Props) {
  const selectableTargets = alivePlayers.filter((player) => {
    if (wolfBeautyPlayer && player.id === wolfBeautyPlayer.id) return false;
    if (player.id === lastWolfBeautyCharmTargetId) return false;
    return true;
  });

  const selectedTarget =
    wolfBeautyCharmTargetId !== null
      ? alivePlayers.find((p) => p.id === wolfBeautyCharmTargetId) ?? null
      : null;

  return (
    <section style={styles.card}>
      <Bilingual zh="夜晚：狼美人魅惑" en="Night: Wolf Beauty charms" />

      {wolfBeautyIsDead && (
        <div style={styles.deadNotice}>
          <Bilingual
            zh="狼美人已死亡，本夜无实际操作。法官可继续宣读流程。"
            en="The Wolf Beauty is dead. No real action tonight. The judge may still read the process aloud."
            small
          />
        </div>
      )}

      {!wolfBeautyIsDead && wolfBeautyPlayer && (
        <div style={styles.tipBox}>
          <Bilingual
            zh={`${wolfBeautyPlayer.seat}号狼美人请选择一名玩家进行魅惑。不能连续两晚魅惑同一名玩家。`}
            en={`Wolf Beauty at Seat ${wolfBeautyPlayer.seat} chooses one player to charm. The same player cannot be charmed on two consecutive nights.`}
            small
          />
        </div>
      )}

      {!wolfBeautyIsDead && !wolfBeautyPlayer && (
        <div style={styles.deadNotice}>
          <Bilingual
            zh="本局尚未确认狼美人身份，本夜无实际操作。"
            en="The Wolf Beauty has not been confirmed in this game. No real action tonight."
            small
          />
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Bilingual zh="选择魅惑目标" en="Choose charm target" small />
      </div>

      <div style={styles.optionList}>
        {selectableTargets.map((player) => {
          const selected = wolfBeautyCharmTargetId === player.id;

          return (
            <button
              key={player.id}
              type="button"
              disabled={wolfBeautyIsDead || !wolfBeautyPlayer}
              style={{
                ...styles.optionButton,
                background: selected ? '#111827' : '#ffffff',
                color: selected ? '#ffffff' : '#111827',
                opacity: wolfBeautyIsDead || !wolfBeautyPlayer ? 0.45 : 1,
                cursor:
                  wolfBeautyIsDead || !wolfBeautyPlayer
                    ? 'not-allowed'
                    : 'pointer',
              }}
              onClick={() => {
                if (!wolfBeautyIsDead && wolfBeautyPlayer) {
                  onSelectCharmTarget(player.id);
                }
              }}
            >
              <Bilingual
                zh={`${player.seat}号 - ${
                  player.name?.trim() || `玩家${player.seat}`
                }`}
                en={`Seat ${player.seat} - ${
                  player.name?.trim() || `Player ${player.seat}`
                }`}
                small
              />
            </button>
          );
        })}
      </div>

      {lastWolfBeautyCharmTargetId !== null && (
        <div style={styles.lastBox}>
          <Bilingual
            zh={`上一次魅惑目标：${
              alivePlayers.find((p) => p.id === lastWolfBeautyCharmTargetId)
                ?.seat ?? ''
            }号，本夜不可再次选择。`}
            en={`Previous charm target: Seat ${
              alivePlayers.find((p) => p.id === lastWolfBeautyCharmTargetId)
                ?.seat ?? ''
            }. This player cannot be chosen again tonight.`}
            small
          />
        </div>
      )}

      {selectedTarget && (
        <div style={styles.resultBox}>
          <Bilingual
            zh={`本夜魅惑目标：${selectedTarget.seat}号`}
            en={`Charm target tonight: Seat ${selectedTarget.seat}`}
            small
          />
        </div>
      )}

      <div style={styles.tipBox}>
        <Bilingual
          zh="提示：狼美人若因投票、女巫毒药或猎人开枪出局，最后一次被魅惑的玩家会随之殉情；若被狼人刀死则不触发。"
          en="Note: If the Wolf Beauty is voted out, poisoned by the Witch, or shot by the Hunter, the last charmed player dies with her. If killed by the wolf attack, this does not trigger."
          small
        />
      </div>

      <div style={styles.actionRow}>
        <button type="button" style={styles.secondaryButton} onClick={onBack}>
          <Bilingual zh="上一步" en="Back" small />
        </button>

        <button
          type="button"
          style={styles.primaryButton}
          onClick={onNext}
        >
          <Bilingual zh="下一步" en="Next" small />
        </button>
      </div>
    </section>
  );
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: '#ffffff',
    borderRadius: 20,
    padding: 20,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    marginBottom: 20,
  },
  deadNotice: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#fff7ed',
    color: '#9a3412',
    border: '1px solid #fdba74',
  },
  tipBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    color: '#374151',
    border: '1px solid #e5e7eb',
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
  lastBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#fff7ed',
    color: '#9a3412',
    border: '1px solid #fdba74',
  },
  resultBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    background: '#eff6ff',
    color: '#1e3a8a',
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
};