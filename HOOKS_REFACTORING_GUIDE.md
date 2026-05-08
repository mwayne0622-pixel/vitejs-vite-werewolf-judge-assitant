# Custom Hooks 重构指南

## 概述

这份指南说明如何使用新的 custom hooks 来重构 App.tsx，将其从 1800+ 行简化为 300-400 行。

## 新 Hooks 结构

### 1. useGameState - 基础游戏状态
**位置**: `src/hooks/useGameState.ts`

**管理**:
- `config` - 游戏配置（角色启用/禁用）
- `phase` - 当前游戏阶段
- `players` - 玩家列表
- `firstNightDone` - 首夜是否完成
- `gameOver` - 游戏是否结束
- `gameResult` - 游戏结果

**使用示例**:
```typescript
const gameState = useGameState(defaultGameState);

// 设置阶段
gameState.setPhase('day-vote');

// 更新玩家
gameState.setPlayers(updatedPlayers);

// 声明游戏结束
gameState.setGameOver(true);
gameState.setGameResult('好人阵营胜利');
```

### 2. useRoleOwners - Role 所有者管理
**位置**: `src/hooks/useRoleOwners.ts`

**管理**: 所有 role 的 confirmed 和 draft 所有者
- Seer (预言家)
- Witch (女巫)
- Guard (守卫)
- Hunter (猎人)
- Idiot (白痴)
- White Wolf King (白狼王)
- Wolf Beauty (狼美人)
- Bear (熊)

**使用示例**:
```typescript
const roleOwners = useRoleOwners(defaultRoleOwners);

// 设置预言家
roleOwners.setDraftSeerOwnerId(playerId);

// 确认选择
roleOwners.setSeerOwnerId(roleOwners.draftSeerOwnerId);
roleOwners.setDraftSeerOwnerId(null);
```

### 3. useNightActions - 夜间行动状态
**位置**: `src/hooks/useNightActions.ts`

**管理**:
- Wolf actions (狼人目标)
- Seer check (预言家检查)
- Witch save/poison (女巫救毒)
- Guard protection (守卫保护)
- Wolf Beauty charm (狼美人魅惑)

**使用示例**:
```typescript
const nightActions = useNightActions(defaultNightActions);

// 设置狼人目标
nightActions.setWolfTargetId(victimId);

// 女巫救人
nightActions.setWitchSave(true);

// 重置一夜的所有行动
nightActions.resetNightActions();
```

### 4. useVoting - 投票状态管理
**位置**: `src/hooks/useVoting.ts`

**管理**:
- `votes` - 投票记录
- `voteRound` - 投票轮次 (1 或 2)
- `voteApplied` - 投票是否已应用
- `appliedVoteSummary` - 已应用的投票结果
- `dayApplied` - 日间结果是否已应用

**使用示例**:
```typescript
const voting = useVoting(defaultVoting);

// 记录投票
voting.setVotes({...voting.votes, [voterId]: targetId});

// 应用投票结果
voting.setVoteApplied(true);
voting.setAppliedVoteSummary(summary);

// 进入第二轮投票
voting.setVoteRound(2);
voting.setRevoteCandidateIds(topTargets);

// 重置投票
voting.resetVoting();
```

### 5. useSpecialEvents - 特殊事件管理
**位置**: `src/hooks/useSpecialEvents.ts`

**管理**:
- Hunter shot (猎人开枪)
- White Wolf King explosion (白狼王自爆)
- Wolf Beauty lover death (狼美人殉情)

**使用示例**:
```typescript
const events = useSpecialEvents(defaultEvents);

// 猎人开枪
events.setHunterShootSource('night');
events.setHunterShotTargetId(targetId);

// 白狼王自爆
events.setWhiteWolfKingMessage('...');
events.setWhiteWolfKingExploded(true);

// 狼美人殉情消息
events.setWolfBeautyLoverMessage('...');
```

### 6. useGameStatePersistence - localStorage 管理
**位置**: `src/hooks/useGameStatePersistence.ts`

**功能**:
- 自动保存游戏状态到 localStorage
- 加载已保存的游戏状态

**使用示例**:
```typescript
import { useGameStatePersistence, loadGameStateFromStorage } from './hooks/useGameStatePersistence';

// 加载已保存的状态
const savedState = loadGameStateFromStorage();

// 自动保存当前状态
const { clearStorage } = useGameStatePersistence({
  ...gameState,
  ...roleOwners,
  ...nightActions,
  ...voting,
  ...specialEvents,
});
```

## App.tsx 重构步骤

### 第 1 步：引入 Hooks

```typescript
import { useGameState } from './hooks/useGameState';
import { useRoleOwners } from './hooks/useRoleOwners';
import { useNightActions } from './hooks/useNightActions';
import { useVoting } from './hooks/useVoting';
import { useSpecialEvents } from './hooks/useSpecialEvents';
import { useGameStatePersistence, loadGameStateFromStorage } from './hooks/useGameStatePersistence';
```

### 第 2 步：删除旧的 useState 调用

删除所有现有的：
```typescript
const [config, setConfig] = useState(...);
const [phase, setPhase] = useState(...);
// ... 共 50+ 个 useState 调用
```

替换为：
```typescript
const gameState = useGameState(defaultGameState);
const roleOwners = useRoleOwners(defaultRoleOwners);
const nightActions = useNightActions(defaultNightActions);
const voting = useVoting(defaultVoting);
const events = useSpecialEvents(defaultEvents);
```

### 第 3 步：更新 localStorage 加载逻辑

删除：
```typescript
useEffect(() => {
  const raw = localStorage.getItem(STORAGE_KEY);
  // ... 长段 localStorage 加载代码
}, []);
```

替换为：
```typescript
// 在初始化时加载
const savedState = loadGameStateFromStorage();
const gameState = useGameState(savedState?.config || defaultConfig, ...);
// ...
```

### 第 4 步：更新 localStorage 保存逻辑

删除长段的：
```typescript
useEffect(() => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({...}));
}, [config, phase, players, ...]);
```

替换为：
```typescript
// 自动保存
useGameStatePersistence({...});
```

### 第 5 步：更新所有使用

使用 find-and-replace：
- `setPhase(` → `gameState.setPhase(`
- `setPlayers(` → `gameState.setPlayers(`
- `setSeerOwnerId(` → `roleOwners.setSeerOwnerId(`
- `setWolfTargetId(` → `nightActions.setWolfTargetId(`
- 等等...

## 预期代码量变化

### 现在（App.tsx）
```
总行数：                1800+
useState 调用：        51 个
localStorage 逻辑：    100+ 行
函数定义：            30+ 个
```

### 重构后
```
总行数：               300-400
useState 调用：        6 个（hooks 中）
localStorage 逻辑：    集中在 hook 中
函数定义：            10-15 个（仅业务逻辑）
```

### 减少比例
- 代码行数：↓ 78%
- 认知复杂度：↓ 70%
- 维护难度：↓ 60%

## 益处

### 可读性
```typescript
// 重构前：找不到 phase 相关的所有代码
const [phase, setPhase] = useState<Phase>('setup');
// ... 500 行后
setPhase('day-vote');

// 重构后：所有游戏状态相关的代码在一个地方
const gameState = useGameState(...);
gameState.setPhase('day-vote');
```

### 复用性
```typescript
// 其他组件可以直接使用这些 hooks
function GameDebugPanel() {
  const gameState = useGameState(...);
  const nightActions = useNightActions(...);
  
  return (
    <div>
      <p>Current phase: {gameState.phase}</p>
      <p>Wolf target: {nightActions.wolfTargetId}</p>
    </div>
  );
}
```

### 测试性
```typescript
// 测试特定功能，无需整个 App 上下文
import { renderHook, act } from '@testing-library/react';
import { useVoting } from './hooks/useVoting';

test('voting logic', () => {
  const { result } = renderHook(() => useVoting(defaultVoting));
  
  act(() => {
    result.current.setVotes({1: 2, 2: 2});
  });
  
  expect(result.current.votes[1]).toBe(2);
});
```

## 渐进式迁移

你可以逐步进行此重构，而无需一次性完成：

1. **第 1 天**：引入 useGameState，替换所有游戏基础状态
2. **第 2 天**：引入 useRoleOwners，替换所有 role 相关状态
3. **第 3 天**：引入 useNightActions，替换所有夜间行动状态
4. **第 4 天**：引入 useVoting，替换投票状态
5. **第 5 天**：引入 useSpecialEvents 和 useGameStatePersistence

每一步都可以分开测试，确保功能不会破损。

## 常见问题

### Q: 如何在 hooks 中访问其他 hook 的数据？
A: Hooks 由 App.tsx 组织，App.tsx 可以访问所有 hooks 的数据：

```typescript
function App() {
  const gameState = useGameState(...);
  const nightActions = useNightActions(...);
  
  // 在一个处理程序中访问多个 hooks 的数据
  function handleApplyDayResult() {
    if (nightActions.wolfTargetId !== null) {
      // ...
    }
  }
}
```

### Q: localStorage 如何处理新增的状态？
A: `useGameStatePersistence` 会自动保存传入的所有状态。只需确保将新状态包含在传入的对象中。

### Q: 如何重置游戏？
A: 简单地调用每个 hook 的重置函数：

```typescript
gameState.setPhase('setup');
roleOwners.setSeerOwnerId(null);
nightActions.resetNightActions();
voting.resetVoting();
```

## 相关文件

- Hooks 代码：`src/hooks/`
- 主应用：`src/App.tsx`
- 业务逻辑（纯函数）：`src/logic/gameRules.ts`
- 业务逻辑测试：`src/logic/__tests__/gameRules.test.ts`

## 下一步

完成 App.tsx 重构后：

1. 运行所有测试确保功能完整
2. 测试游戏流程（所有 role 组合）
3. 测试 localStorage 恢复（刷新页面）
4. 考虑为 hooks 添加单元测试

祝重构愉快！ 🎉
