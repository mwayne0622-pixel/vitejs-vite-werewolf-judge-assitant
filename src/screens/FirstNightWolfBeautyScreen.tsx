import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  players: Player[];
  selectablePlayers: Player[];
  alivePlayers: Player[];
  draftWolfBeautyOwnerId: number | null;
  wolfBeautyCharmTargetId: number | null;
  canGoNext: boolean;
  onSelectWolfBeauty: (playerId: number) => void;
  onSelectCharmTarget: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightWolfBeautyScreen({
  players,
  selectablePlayers,
  alivePlayers,
  draftWolfBeautyOwnerId,
  wolfBeautyCharmTargetId,
  canGoNext,
  onSelectWolfBeauty,
  onSelectCharmTarget,
  onBack,
  onNext,
}: Props) {
  const selectedWolfBeauty =
    draftWolfBeautyOwnerId !== null
      ? players.find((p) => p.id === draftWolfBeautyOwnerId) ?? null
      : null;

  const selectedCharmTarget =
    wolfBeautyCharmTargetId !== null
      ? players.find((p) => p.id === wolfBeautyCharmTargetId) ?? null
      : null;

  const charmTargets = alivePlayers.filter(
    (player) => player.id !== draftWolfBeautyOwnerId
  );

  return (
    <section style={styles.card}>
      <Bilingual zh="确认狼美人" en="Confirm Wolf Beauty" />

      <div style={styles.tipBox}>
        <Bilingual
          zh="请从已选中的狼人中，再指定 1 名玩家为狼美人。狼美人属于狼人阵营，占用一个狼位。第一夜也需要同时选择魅惑目标。"
          en="Please choose 1 player from the selected wolves to be the Wolf Beauty. The Wolf Beauty belongs to the wolf camp and occupies one wolf slot. On the first night, also choose a charm target."
          small
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <Bilingual zh="当前狼人名单" en="Current wolf list" small />
      </div>

      <div style={styles.playerList}>
        {selectablePlayers.map((player) => {
          const selected = draftWolfBeautyOwnerId === player.id;
          const displayName = player.name?.trim() || `${player.seat}号玩家`;

          return (
            <button
              key={player.id}
              type="button"
              style={{
                ...styles.playerButton,
                background: selected ? '#111827' : '#ffffff',
                color: selected ? '#ffffff' : '#111827',
                borderColor: selected ? '#111827' : '#d1d5db',
              }}
              onClick={() => onSelectWolfBeauty(player.id)}
            >
              <div style={styles.playerMainLine}>
                <strong>{player.seat}号</strong>
                <span>{displayName}</span>
              </div>

              <div style={styles.playerSubLine}>
                <Bilingual
                  zh={selected ? '已设为狼美人' : '点击设为狼美人'}
                  en={selected ? 'Selected as Wolf Beauty' : 'Click to assign'}
                  small
                />
              </div>
            </button>
          );
        })}
      </div>

      {selectedWolfBeauty && (
        <div style={styles.summaryBox}>
          <Bilingual
            zh={`当前选择：${selectedWolfBeauty.seat}号为狼美人`}
            en={`Current selection: Seat ${selectedWolfBeauty.seat} as Wolf Beauty`}
            small
          />
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Bilingual zh="第一夜魅惑目标" en="First night charm target" small />
      </div>

      <div style={styles.charmTipBox}>
        <Bilingual
          zh="请选择狼美人第一夜魅惑的玩家。魅惑目标不会立即死亡，只有狼美人因投票、女巫毒药或猎人开枪出局时，最后一次被魅惑的玩家才会殉情。"
          en="Choose the Wolf Beauty's first-night charm target. The target does not die immediately. If the Wolf Beauty is later voted out, poisoned, or shot by the Hunter, the last charmed player dies with her."
          small
        />
      </div>

      <div style={styles.playerList}>
        {charmTargets.map((player) => {
          const selected = wolfBeautyCharmTargetId === player.id;
          const displayName = player.name?.trim() || `${player.seat}号玩家`;
          const disabled = draftWolfBeautyOwnerId === null;

          return (
            <button
              key={player.id}
              type="button"
              disabled={disabled}
              style={{
                ...styles.playerButton,
                background: selected ? '#111827' : '#ffffff',
                color: selected ? '#ffffff' : '#111827',
                borderColor: selected ? '#111827' : '#d1d5db',
                opacity: disabled ? 0.5 : 1,
                cursor: disabled ? 'not-allowed' : 'pointer',
              }}
              onClick={() => {
                if (!disabled) {
                  onSelectCharmTarget(player.id);
                }
              }}
            >
              <div style={styles.playerMainLine}>
                <strong>{player.seat}号</strong>
                <span>{displayName}</span>
              </div>

              <div style={styles.playerSubLine}>
                <Bilingual
                  zh={selected ? '已设为魅惑目标' : '点击设为魅惑目标'}
                  en={selected ? 'Selected as charm target' : 'Click to charm'}
                  small
                />
              </div>
            </button>
          );
        })}
      </div>

      {selectedCharmTarget && (
        <div style={styles.summaryBox}>
          <Bilingual
            zh={`当前魅惑目标：${selectedCharmTarget.seat}号`}
            en={`Current charm target: Seat ${selectedCharmTarget.seat}`}
            small
          />
        </div>
      )}

      <div style={styles.actionRow}>
        <button type="button" style={styles.secondaryButton} onClick={onBack}>
          <Bilingual zh="返回" en="Back" small />
        </button>

        <button
          type="button"
          style={{
            ...styles.primaryButton,
            opacity: canGoNext ? 1 : 0.5,
            cursor: canGoNext ? 'pointer' : 'not-allowed',
          }}
          onClick={onNext}
          disabled={!canGoNext}
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
  tipBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    color: '#374151',
    border: '1px solid #e5e7eb',
  },
  charmTipBox: {
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    background: '#fff7ed',
    color: '#9a3412',
    border: '1px solid #fdba74',
  },
  playerList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 12,
  },
  playerButton: {
    border: '1px solid #d1d5db',
    borderRadius: 16,
    padding: 14,
    background: '#ffffff',
    textAlign: 'left',
    cursor: 'pointer',
  },
  playerMainLine: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontSize: 15,
  },
  playerSubLine: {
    marginTop: 8,
    opacity: 0.9,
  },
  summaryBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
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