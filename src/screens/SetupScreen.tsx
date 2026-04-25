import type { CSSProperties } from 'react';
import Bilingual from '../components/Bilingual';
import NumberStepper from '../components/NumberStepper';
import type { GameConfig, Player } from '../types';

type Props = {
  config: GameConfig;
  playerCount: number;
  configValid: boolean;
  players: Player[];
  includedGodCount: number;
  onUpdateConfig: (patch: Partial<GameConfig>) => void;
  onUpdatePlayerName: (id: number, value: string) => void;
  onResetPlayersLength: () => void;
  onStartGame: () => void;
};

export default function SetupScreen({
  config,
  playerCount,
  configValid,
  players,
  includedGodCount,
  onUpdateConfig,
  onUpdatePlayerName,
  onResetPlayersLength,
  onStartGame,
}: Props) {
  return (
    <section style={styles.card}>
      <Bilingual zh="1. 开局设置" en="Game setup" />

      <div style={styles.grid2}>
        <NumberStepper
          labelZh="狼人数量"
          labelEn="Number of wolves"
          value={config.wolfCount}
          min={1}
          max={8}
          onChange={(next) => onUpdateConfig({ wolfCount: next })}
          unitZh="狼"
        />

        <NumberStepper
          labelZh="村民数量"
          labelEn="Number of villagers"
          value={config.villagerCount}
          min={1}
          max={8}
          onChange={(next) => onUpdateConfig({ villagerCount: next })}
          unitZh="民"
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={styles.label}>
          <Bilingual zh="本局加入的角色" en="Special roles included" small />
        </label>

        <div style={styles.toggleWrap}>
          <label style={styles.checkboxCard}>
            <input
              type="checkbox"
              checked={config.hasSeer}
              onChange={(e) => onUpdateConfig({ hasSeer: e.target.checked })}
            />
            <Bilingual zh="预言家" en="Seer" small />
          </label>

          <label style={styles.checkboxCard}>
            <input
              type="checkbox"
              checked={config.hasWitch}
              onChange={(e) => onUpdateConfig({ hasWitch: e.target.checked })}
            />
            <Bilingual zh="女巫" en="Witch" small />
          </label>

          <label style={styles.checkboxCard}>
            <input
              type="checkbox"
              checked={config.hasGuard}
              onChange={(e) => onUpdateConfig({ hasGuard: e.target.checked })}
            />
            <Bilingual zh="守卫" en="Guard" small />
          </label>

          <label style={styles.checkboxCard}>
            <input
              type="checkbox"
              checked={config.hasHunter}
              onChange={(e) => onUpdateConfig({ hasHunter: e.target.checked })}
            />
            <Bilingual zh="猎人" en="Hunter" small />
          </label>

          <label style={styles.checkboxCard}>
            <input
              type="checkbox"
              checked={config.hasIdiot}
              onChange={(e) => onUpdateConfig({ hasIdiot: e.target.checked })}
            />
            <Bilingual zh="白痴" en="Idiot" small />
          </label>

          <label style={styles.checkboxCard}>
            <input
              type="checkbox"
              checked={config.hasWhiteWolfKing}
              onChange={(e) =>
                onUpdateConfig({ hasWhiteWolfKing: e.target.checked })
              }
            />
            <Bilingual zh="白狼王" en="White Wolf King" small />
          </label>

          <label style={styles.checkboxCard}>
            <input
              type="checkbox"
              checked={config.hasBear}
              onChange={(e) =>
                onUpdateConfig({ hasBear: e.target.checked })
              }
            />
            <Bilingual zh="熊" en="Bear" small />
          </label>
        </div>
      </div>

      <div style={styles.tipBox}>
        <Bilingual
          zh={
            <>
              请设置狼人数量、村民数量，以及加入的角色。
              <br />
              系统会自动计算总人数。
              <br />
              公式：总人数 = 狼人 + 神职 + 村民
              <br />
              白狼王属于狼人阵营，占用一个狼位，不额外增加总人数。
            </>
          }
          en={
            <>
              Set the number of wolves, villagers, and special roles.
              <br />
              The total player count is calculated automatically.
              <br />
              Formula: total = wolves + special roles + villagers
              <br />
              The White Wolf King belongs to the wolf camp, occupies one wolf
              slot, and does not increase the total player count.
            </>
          }
          small
        />
      </div>

      <div style={styles.summaryBox}>
        <div>
          <strong>狼人数量：</strong>
          {config.wolfCount}
        </div>
        <div>
          <strong>神职数量：</strong>
          {includedGodCount}
        </div>
        <div>
          <strong>村民数量：</strong>
          {config.villagerCount}
        </div>
        <div>
          <strong>白痴：</strong>
          {config.hasIdiot ? '开启' : '关闭'}
        </div>
        <div>
          <strong>白狼王：</strong>
          {config.hasWhiteWolfKing ? '开启' : '关闭'}
        </div>
        <div>
          <strong>熊：</strong>
          {config.hasBear ? '开启' : '关闭'}
        </div>
        <div>
          <strong>总人数：</strong>
          {playerCount}
        </div>
        <div>
          <strong>状态：</strong>
          {configValid ? '可开始' : '配置无效'}
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <Bilingual
          zh="玩家姓名（可先改名）"
          en="Player names (optional before starting)"
          small
        />
      </div>

      <div
        style={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {Array.from({ length: playerCount }, (_, index) => {
          const templateId = index + 1;
          const player = players[index] ?? {
            id: templateId,
            seat: templateId,
            name: `玩家${templateId}`,
            role: null,
            alive: true,
          };

          return (
            <div key={templateId} style={styles.playerRow}>
              <div style={styles.seatTag}>{templateId}号</div>
              <input
                style={styles.input}
                value={player.name}
                onChange={(e) => {
                  if (players.length !== playerCount) {
                    onResetPlayersLength();
                  }
                  onUpdatePlayerName(templateId, e.target.value);
                }}
              />
            </div>
          );
        })}
      </div>

      <div style={styles.actionRow}>
        <button
          style={{
            ...styles.primaryButton,
            opacity: configValid ? 1 : 0.5,
            cursor: configValid ? 'pointer' : 'not-allowed',
          }}
          onClick={onStartGame}
          disabled={!configValid}
        >
          <Bilingual zh="开始第一夜" en="Start first night" small />
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
  label: {
    display: 'block',
    marginBottom: 8,
    color: '#111827',
    fontWeight: 700,
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 14,
  },
  toggleWrap: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },
  checkboxCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 12,
    background: '#fff',
  },
  tipBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: '#f9fafb',
    color: '#374151',
    border: '1px solid #e5e7eb',
  },
  summaryBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    background: '#f9fafb',
    color: '#111827',
    display: 'grid',
    gap: 8,
  },
  playerRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center',
    padding: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 14,
  },
  seatTag: {
    minWidth: 56,
    textAlign: 'center',
    padding: '8px 10px',
    borderRadius: 12,
    background: '#111827',
    color: '#ffffff',
    fontWeight: 700,
  },
  input: {
    flex: 1,
    minWidth: 160,
    padding: '10px 12px',
    borderRadius: 12,
    border: '1px solid #d1d5db',
    fontSize: 14,
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
};