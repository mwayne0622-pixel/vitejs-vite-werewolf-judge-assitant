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
  includedGodCount,
  onUpdateConfig,
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

        <div style={styles.roleGroup}>
          <div style={styles.roleGroupTitle}>
            <Bilingual zh="神职角色" en="God roles" small />
          </div>

          <div style={styles.toggleWrap}>
            <label style={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={config.hasSeer}
                onChange={(e) => onUpdateConfig({ hasSeer: e.target.checked })}
              />
              <span>
                预言家
                <br />
                <small>Seer</small>
              </span>
            </label>

            <label style={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={config.hasWitch}
                onChange={(e) => onUpdateConfig({ hasWitch: e.target.checked })}
              />
              <span>
                女巫
                <br />
                <small>Witch</small>
              </span>
            </label>

            <label style={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={config.hasGuard}
                onChange={(e) => onUpdateConfig({ hasGuard: e.target.checked })}
              />
              <span>
                守卫
                <br />
                <small>Guard</small>
              </span>
            </label>

            <label style={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={config.hasHunter}
                onChange={(e) =>
                  onUpdateConfig({ hasHunter: e.target.checked })
                }
              />
              <span>
                猎人
                <br />
                <small>Hunter</small>
              </span>
            </label>

            <label style={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={config.hasBear}
                onChange={(e) => onUpdateConfig({ hasBear: e.target.checked })}
              />
              <span>
                熊
                <br />
                <small>Bear</small>
              </span>
            </label>

            <label style={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={config.hasIdiot}
                onChange={(e) => onUpdateConfig({ hasIdiot: e.target.checked })}
              />
              <span>
                白痴
                <br />
                <small>Idiot</small>
              </span>
            </label>
          </div>
        </div>

        <div style={styles.roleGroup}>
          <div style={styles.roleGroupTitle}>
            <Bilingual zh="狼人阵营角色" en="Wolf camp roles" small />
          </div>

          <div style={styles.toggleWrap}>
            <label style={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={config.hasWhiteWolfKing}
                onChange={(e) =>
                  onUpdateConfig({ hasWhiteWolfKing: e.target.checked })
                }
              />
              <span>
                白狼王
                <br />
                <small>White Wolf King</small>
              </span>
            </label>

            <label style={styles.checkboxCard}>
              <input
                type="checkbox"
                checked={config.hasWolfBeauty}
                onChange={(e) =>
                  onUpdateConfig({ hasWolfBeauty: e.target.checked })
                }
              />
              <span>
                狼美人
                <br />
                <small>Wolf Beauty</small>
              </span>
            </label>
          </div>
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
              白狼王和狼美人属于狼人阵营，占用一个狼位，不额外增加总人数。
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
              The White Wolf King and The Wolf Beauty belong to the wolf camp,
              occupy wolf slots, and do not increase the total player count.
            </>
          }
          small
        />
      </div>

      <div style={styles.summaryBox}>
        <div style={styles.summaryGrid}>
          <div style={styles.summaryItem}>
            <strong>狼人</strong>
            <span>{config.wolfCount}</span>
          </div>

          <div style={styles.summaryItem}>
            <strong>神职</strong>
            <span>{includedGodCount}</span>
          </div>

          <div style={styles.summaryItem}>
            <strong>村民</strong>
            <span>{config.villagerCount}</span>
          </div>

          <div style={styles.summaryItem}>
            <strong>总人数</strong>
            <span>{playerCount}</span>
          </div>

          <div style={styles.summaryItem}>
            <strong>状态</strong>
            <span>{configValid ? '可开始' : '需调整'}</span>
          </div>
        </div>

        <div style={styles.roleSummary}>
          <span style={styles.roleChip}>
            熊：{config.hasBear ? '开启' : '关闭'}
          </span>
          <span style={styles.roleChip}>
            白痴：{config.hasIdiot ? '开启' : '关闭'}
          </span>
          <span style={styles.roleChip}>
            白狼王：{config.hasWhiteWolfKing ? '开启' : '关闭'}
          </span>
          <span style={styles.roleChip}>
            狼美人：{config.hasWolfBeauty ? '开启' : '关闭'}
          </span>
        </div>
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
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: 10,
  },
  summaryItem: {
    padding: 12,
    borderRadius: 14,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    alignItems: 'center',
  },
  roleSummary: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  roleChip: {
    padding: '6px 10px',
    borderRadius: 999,
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    fontSize: 13,
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
  roleGroup: {
    marginTop: 14,
  },
  roleGroupTitle: {
    marginBottom: 8,
    fontWeight: 700,
    color: '#374151',
  },
};