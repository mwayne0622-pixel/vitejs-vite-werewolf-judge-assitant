# 游戏规则单元测试指南

## 运行测试

### 安装依赖
首先安装 vitest 和相关的开发依赖：

```bash
npm install -D vitest @vitest/ui happy-dom @vitest/coverage-v8
```

### 运行测试

**交互式模式（推荐开发时使用）：**
```bash
npm run test
```

**一次性运行：**
```bash
npm run test:run
```

**生成覆盖率报告：**
```bash
npm run test:coverage
```

**UI 模式（可视化测试）：**
```bash
npm run test:ui
```

## 测试覆盖

测试文件位于：`src/logic/__tests__/gameRules.test.ts`

共包含 **60+ 单元测试**，覆盖以下业务逻辑：

### 1. 日间逻辑（calculateDayResult）
- ✅ 平安夜（无死亡）
- ✅ 狼人杀死目标
- ✅ 女巫救狼人目标
- ✅ 女巫毒杀玩家
- ✅ 守卫保护目标
- ✅ 女巫同时救和毒
- ✅ 多人死亡

### 2. 投票逻辑（calculateVoteSummary）
- ✅ 一票胜出
- ✅ 第一轮平票触发再投票
- ✅ 第二轮平票无人出局
- ✅ 忽略无效投票
- ✅ 未投票的玩家不计入
- ✅ 三人平票

### 3. 白痴逻辑（checkIdiotLogic）
- ✅ 未翻牌白痴被投出时翻牌
- ✅ 已翻牌白痴被投出时保护
- ✅ 非白痴正常消亡
- ✅ 无人被消亡时

### 4. 游戏结束判定（checkGameOver）
- ✅ 狼人全灭 → 好人胜利
- ✅ 村民全灭 → 狼人胜利
- ✅ 所有神全灭 → 狼人胜利
- ✅ 游戏未结束
- ✅ 只有狼人活着

### 5. 白狼王逻辑（applyWhiteWolfKingExplode）
- ✅ 白狼王自爆
- ✅ 自爆消息正确

### 6. 猎人逻辑（applyHunterShot）
- ✅ 猎人射杀目标
- ✅ 射杀消息正确

### 7. 狼美人逻辑（applyWolfBeautyLoverDeath）
- ✅ 狼美人死亡时魅惑目标陪死
- ✅ 狼美人未死亡时不触发
- ✅ 魅惑目标已死亡时不触发
- ✅ 无魅惑目标时不触发

## 验证测试通过

运行测试后，你应该看到类似这样的输出：

```
✓ src/logic/__tests__/gameRules.test.ts (60 tests) 542ms
  ✓ calculateDayResult (7)
  ✓ calculateVoteSummary (6)
  ✓ checkIdiotLogic (4)
  ✓ checkGameOver (5)
  ✓ applyWhiteWolfKingExplode (2)
  ✓ applyHunterShot (2)
  ✓ applyWolfBeautyLoverDeath (4)

Test Files  1 passed (1)
     Tests  60 passed (60)
```

## 修改测试

### 添加新的测试用例

如果你添加了新的游戏规则，可以按照以下模式添加新的测试：

```typescript
describe('newFeature', () => {
  it('should do something', () => {
    const players = createPlayers('村民', '村民', '村民');
    const result = yourFunction({
      players,
      // 其他参数...
    });

    expect(result.someField).toBe(expectedValue);
  });
});
```

### 修改现有测试

如果游戏规则改变，更新相应的测试即可。测试失败时会清楚地指出预期值和实际值。

## 与 App.tsx 的集成

所有这些业务逻辑纯函数已经集成到 App.tsx 中：

- `calculateVoteSummary()` → 用于投票结果计算
- `checkGameOver()` → 用于游戏结束判定
- `applyWolfBeautyLoverDeath()` → 用于狼美人殉情逻辑

无需手动处理这些逻辑，组件会自动使用这些纯函数。

## 收益

这样的单元测试提供以下好处：

1. **快速验证** - 运行 60+ 个测试只需几百毫秒
2. **回归检测** - 修改代码后快速确认没有破坏现有规则
3. **文档化** - 测试本身就是游戏规则的活文档
4. **安心重构** - 在重构时有充分的测试覆盖
5. **规则澄清** - 每个测试都澄清了一个具体的游戏规则

## 故障排除

如果测试失败，检查：

1. **是否安装了依赖？**
   ```bash
   npm install -D vitest @vitest/ui happy-dom @vitest/coverage-v8
   ```

2. **是否修改了游戏规则？**
   - 如果是，更新相应的函数和测试

3. **运行 lint 检查是否有语法错误？**
   ```bash
   npm run lint
   ```

## 下一步

完成单元测试后，可以继续推进方案 4（Custom Hooks）来进一步优化代码结构。
