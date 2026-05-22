import { useState } from 'react';

type Faction = '狼人阵营' | '神职阵营' | '村民阵营';

type RoleInfo = {
  name: string;
  icon: string;
  faction: Faction;
  skill: string;
  trigger: string;
  onDeath: string;
  notes?: string;
};

const ROLES: RoleInfo[] = [
  {
    name: '狼人',
    icon: '🐺',
    faction: '狼人阵营',
    skill: '每晚与狼队友协商，共同击杀一名存活玩家',
    trigger: '每夜行动阶段集体睁眼，统一指定击杀目标',
    onDeath: '无特殊效果',
    notes: '多只狼须达成共识，每晚只能共同击杀一人',
  },
  {
    name: '白狼王',
    icon: '👑',
    faction: '狼人阵营',
    skill: '白天发言阶段可随时选择自爆，强行带走一名存活玩家双双出局，白天立即结束进入黑夜',
    trigger: '白天发言阶段主动触发，自爆后白天流程强制中断',
    onDeath: '自爆带走的目标无法发动任何技能（猎人被带走不能开枪）',
    notes: '自爆为主动选择，可放弃；被骑士决斗击杀时不能自爆',
  },
  {
    name: '狼美人',
    icon: '🌹',
    faction: '狼人阵营',
    skill: '每晚魅惑一名存活玩家。被投票放逐或被猎人开枪击杀时，当晚魅惑的玩家随之殉情出局',
    trigger: '每夜狼人行动结束后单独睁眼，指定魅惑目标',
    onDeath: '被女巫毒死或骑士决斗击杀时技能失效，不连带任何人；被投票或猎人击杀才触发连带',
    notes: '不能连续两夜魅惑同一人；被连带殉情的玩家无法发动技能（猎人被连不能开枪）',
  },
  {
    name: '隐狼',
    icon: '🎭',
    faction: '狼人阵营',
    skill: '开局隐狼知晓所有狼队友，但狼队友不知道谁是隐狼。预言家查验显示"好人"，熊不因隐狼咆哮',
    trigger: '始终生效；夜间不进狼窝、不参与夜间击杀，无夜间刀人权利',
    onDeath: '当场上所有其他狼人全部出局时，隐狼自动出局',
    notes: '好人淘汰全部明面狼人即可获胜，无需单独找出隐狼；隐狼无法主动自爆',
  },
  {
    name: '预言家',
    icon: '🔮',
    faction: '神职阵营',
    skill: '每晚查验一名存活玩家的阵营（好人 / 狼人），无法分辨具体职业',
    trigger: '每夜狼人行动结束后睁眼，指定查验目标',
    onDeath: '无特殊效果',
    notes: '查验"隐狼"结果显示为"好人"；只能知道黑白阵营，无法区分村民与女巫、普通狼与功能狼',
  },
  {
    name: '女巫',
    icon: '🧪',
    faction: '神职阵营',
    skill: '拥有解药一瓶（救人）和毒药一瓶（毒杀），每瓶全局仅能使用一次',
    trigger: '每夜得知当晚被狼人击杀的目标后，决定是否用药',
    onDeath: '无特殊效果',
    notes: '官方规则全场不可自救；同一夜不能既用解药又用毒药；解药用完后，后续夜晚不再获得"谁被刀"的信息',
  },
  {
    name: '守卫',
    icon: '🛡️',
    faction: '神职阵营',
    skill: '每晚守护一名存活玩家（含自己），使其免受当晚狼人击杀',
    trigger: '每夜行动阶段独立结算，与女巫互不干扰',
    onDeath: '无特殊效果',
    notes: '不能连续两夜守护同一人；守卫与女巫同夜救同一目标会产生冲突，导致该玩家仍然死亡（奶穿）；只防狼刀，不防女巫毒、白狼王自爆、猎人子弹',
  },
  {
    name: '猎人',
    icon: '🏹',
    faction: '神职阵营',
    skill: '被狼人击杀或被投票放逐时，可翻牌开枪射杀一名存活玩家',
    trigger: '死亡结算时触发，法官询问猎人是否开枪',
    onDeath: '可选择开枪带走一名存活玩家；也可选择不开枪、不翻牌',
    notes: '以下情况技能失效不能开枪：被女巫毒死、被白狼王自爆带走、因特殊被动死亡（如狼美人连带殉情）',
  },
  {
    name: '骑士',
    icon: '⚔️',
    faction: '神职阵营',
    skill: '白天发言阶段可随时翻牌打断发言，宣布与目标玩家决斗（每局仅限一次）',
    trigger: '白天发言阶段主动触发',
    onDeath: '决斗失败（目标为好人）时骑士直接出局',
    notes: '决斗成功（目标为狼人）：狼人出局，白天立即结束直接进入黑夜，无投票；功能狼被骑士击杀时无法触发出局技能（白狼王不能爆、狼美人不能连）；决斗失败（目标为好人）：骑士出局，被打断的玩家继续发言，正常进入投票',
  },
  {
    name: '熊',
    icon: '🐻',
    faction: '神职阵营',
    skill: '每天白天开始前，若左右两侧最近的存活邻座中有狼人，法官宣布"熊咆哮"；否则宣布"熊未咆哮"',
    trigger: '每天白天结算开始前自动判定，法官告知结果',
    onDeath: '熊死亡后不再触发咆哮判定',
    notes: '邻座判定越过已出局玩家，取最近存活邻座；隐狼不触发咆哮；熊在夜间死亡则当天不咆哮',
  },
  {
    name: '白痴',
    icon: '🃏',
    faction: '神职阵营',
    skill: '被投票放逐时可翻牌亮出身份，免疫本次放逐继续存活，但永久失去投票权',
    trigger: '被投票淘汰时触发，法官询问是否翻牌',
    onDeath: '翻牌后存活但永久失去投票权；翻牌后再次被投票淘汰则真正出局',
    notes: '翻牌为主动选择，可以放弃；翻牌后仍可正常发言；狼人"屠神"胜利条件下，白痴须被夜间刀死才算神职出局，仅在白天票出翻牌不计入出局',
  },
  {
    name: '村民',
    icon: '👤',
    faction: '村民阵营',
    skill: '无特殊技能，通过白天发言、逻辑推理与投票协助好人阵营找出狼人',
    trigger: '白天投票阶段正常参与',
    onDeath: '无特殊效果',
  },
];

const FACTIONS: Faction[] = ['狼人阵营', '神职阵营', '村民阵营'];

const FACTION_COLORS: Record<Faction, { tab: string; badge: string; badgeText: string }> = {
  '狼人阵营': {
    tab: 'bg-[var(--color-blood)] text-white',
    badge: 'bg-[var(--color-blood-dim)] text-[var(--color-blood)]',
    badgeText: '狼',
  },
  '神职阵营': {
    tab: 'bg-[#3730a3] text-white',
    badge: 'bg-[#1e1b4b] text-[#818cf8]',
    badgeText: '神',
  },
  '村民阵营': {
    tab: 'bg-[var(--color-amber-wolf)] text-black',
    badge: 'bg-[var(--color-amber-dim)] text-[var(--color-amber-wolf)]',
    badgeText: '民',
  },
};

export default function RoleHelpModal({ onClose }: { onClose: () => void }) {
  const [activeFaction, setActiveFaction] = useState<Faction>('狼人阵营');

  const filtered = ROLES.filter(r => r.faction === activeFaction);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/75"
        onClick={onClose}
      />

      {/* Bottom sheet panel */}
      <div
        className="fixed inset-x-0 bottom-0 top-2 z-50 flex flex-col rounded-t-2xl bg-[var(--color-wolf-surface)] border-t border-[var(--color-wolf-border)] sm:top-4"
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[var(--color-wolf-border-hi)]" />
        </div>

        {/* Sticky header: title + close */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-2">
          <span className="text-base font-bold text-[var(--color-moon-bright)] tracking-wide">
            角色技能说明
          </span>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-moon-dim)] hover:text-[var(--color-moon-bright)] hover:bg-[var(--color-wolf-card-alt)] transition-colors text-lg leading-none cursor-pointer"
            aria-label="关闭"
          >
            ×
          </button>
        </div>

        {/* Sticky Tab bar */}
        <div className="flex-shrink-0 flex gap-2 px-4 pb-3">
          {FACTIONS.map(f => {
            const isActive = f === activeFaction;
            const colors = FACTION_COLORS[f];
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFaction(f)}
                className={`flex-1 rounded-xl text-sm font-semibold transition-colors cursor-pointer border ${
                  isActive
                    ? `${colors.tab} border-transparent`
                    : 'bg-[var(--color-wolf-card-alt)] text-[var(--color-moon-dim)] border-[var(--color-wolf-border)]'
                }`}
                style={{ minHeight: 44 }}
              >
                {f}
              </button>
            );
          })}
        </div>

        {/* Scrollable role cards */}
        <div
          className="flex-1 min-h-0 overflow-y-auto px-4 pb-4 flex flex-col gap-3"
          style={{ WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        >
          {filtered.map(role => {
            const colors = FACTION_COLORS[role.faction];
            return (
              <div
                key={role.name}
                className="shrink-0 rounded-xl border border-[var(--color-wolf-border)] bg-[var(--color-wolf-card)] shadow-[var(--shadow-card)] overflow-hidden"
              >
                {/* Card header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-[var(--color-wolf-border)]">
                  <span className="text-xl select-none">{role.icon}</span>
                  <span className="font-bold text-[var(--color-moon-bright)] text-base flex-1">
                    {role.name}
                  </span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                    {colors.badgeText}
                  </span>
                </div>

                {/* Card body */}
                <div className="px-4 py-3 flex flex-col gap-2">
                  <InfoRow label="技能" value={role.skill} />
                  <InfoRow label="触发时机" value={role.trigger} />
                  <InfoRow label="死亡特效" value={role.onDeath} />
                  {role.notes && <InfoRow label="注意" value={role.notes} highlight />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function InfoRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex gap-2 items-start">
      <span
        className="flex-shrink-0 text-[11px] font-semibold px-1.5 py-0.5 rounded mt-0.5"
        style={{
          background: 'var(--color-wolf-card-alt)',
          color: 'var(--color-moon-dim)',
          minWidth: '4.5em',
          textAlign: 'center',
        }}
      >
        {label}
      </span>
      <span
        className={`text-sm leading-snug ${highlight ? 'text-[var(--color-amber-wolf)]' : 'text-[var(--color-moon)]'}`}
      >
        {value}
      </span>
    </div>
  );
}
