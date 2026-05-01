import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import type { Player } from '../types';

type Props = {
  players: Player[];
  draftIdiotOwnerId: number | null;
  selectablePlayers: Player[];
  canGoNext: boolean;
  onSelectIdiot: (playerId: number) => void;
  onBack: () => void;
  onNext: () => void;
};

export default function FirstNightIdiotScreen({
  players,
  draftIdiotOwnerId,
  selectablePlayers,
  canGoNext,
  onSelectIdiot,
  onBack,
  onNext,
}: Props) {
  const selectedIdiot = players.find((p) => p.id === draftIdiotOwnerId);

  return (
    <section style={styles.card}>
      <Bilingual zh="第一夜：白痴" en="First night: Idiot" />

      <div style={styles.judgePanel}>
        <div style={styles.judgeHeader}>
          <Bilingual zh="法官宣读" en="Judge script" small />
        </div>

        <div style={styles.judgeContent}>
          <Bilingual
            zh={
              <>
                白痴请睁眼。
                <br />
                请确认你的身份。
              </>
            }
            en={
              <>
                Idiot, please open your eyes.
                <br />
                Confirm your identity.
              </>
            }
          />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Bilingual
          zh="先选中谁是白痴，点击下一步后才保存"
          en="Choose who the Idiot is first. It is saved only when you click Next."
          small
        />
      </div>

      <div style={styles.optionList}>
        {selectablePlayers.map((player) => (
          <button
            key={player.id}
            type="button"
            style={{
              ...styles.optionButton,
              background:
                draftIdiotOwnerId === player.id ? '#111827' : '#ffffff',
              color:
                draftIdiotOwnerId === player.id ? '#ffffff' : '#111827',
            }}
            onClick={() => onSelectIdiot(player.id)}
          >
            <Bilingual
              zh={`${player.seat}号 - ${player.name}`}
              en={`Seat ${player.seat} - ${player.name}`}
              small
            />
          </button>
        ))}
      </div>

      <div style={{ marginTop: 8 }}>
        <Bilingual
          zh={`已选白痴：${selectedIdiot ? `${selectedIdiot.seat}号` : '无'}`}
          en={`Selected idiot: ${
            selectedIdiot ? `Seat ${selectedIdiot.seat}` : 'None'
          }`}
          small
        />
      </div>

      <div style={styles.tipBox}>
        <Bilingual
          zh="白痴仅在白天投票被放逐时可翻牌免于出局；若夜晚死亡、被猎人带走或被白狼王自爆带走，则直接死亡。"
          en="The Idiot only reveals and survives when voted out during the day. If killed at night, shot by the Hunter, or taken down by the White Wolf King, the Idiot dies immediately."
          small
        />
      </div>

      <div style={styles.actionRow}>
        <button type="button" style={styles.secondaryButton} onClick={onBack}>
          <Bilingual zh="上一步" en="Back" small />
        </button>

        <button
          type="button"
          style={{
            ...styles.primaryButton,
            opacity: canGoNext ? 1 : 0.5,
            cursor: canGoNext ? 'pointer' : 'not-allowed',
          }}
          disabled={!canGoNext}
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
  judgePanel: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    background: '#f5f3ff',
    border: '1px solid #ddd6fe',
  },
  judgeHeader: {
    fontSize: 14,
    fontWeight: 700,
    color: '#6d28d9',
    marginBottom: 8,
  },
  judgeContent: {
    fontSize: 16,
    fontWeight: 600,
    color: '#111827',
    lineHeight: 1.7,
  },
  optionList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 14,
  },
  optionButton: {
    border: '1px solid #d1d5db',
    borderRadius: 14,
    padding: '12px 14px',
    cursor: 'pointer',
    fontSize: 14,
    background: '#ffffff',
  },
  tipBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    color: '#374151',
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