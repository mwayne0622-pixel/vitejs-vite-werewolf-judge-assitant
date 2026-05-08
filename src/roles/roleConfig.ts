import type { Role, Phase } from '../types';

export type StandardRoleConfig = {
  name: Role;
  chineseName: string;
  isGod: boolean;
  type: 'standard'; // seer, witch, guard, hunter, idiot, bear 的标准流程
  firstNightPhase: Phase;
};

export type MultiSelectRoleConfig = {
  name: 'wolves' | 'white-wolf-king' | 'wolf-beauty';
  chineseName: string;
  isGod: boolean;
  type: 'multi-select'; // wolves, white-wolf-king, wolf-beauty 特殊逻辑
  firstNightPhase: Phase;
};

export type RoleConfig = StandardRoleConfig | MultiSelectRoleConfig;

export const ROLE_CONFIGS: RoleConfig[] = [
  // 标准 role
  {
    name: '预言家',
    chineseName: '预言家',
    isGod: true,
    type: 'standard',
    firstNightPhase: 'first-night-seer',
  },
  {
    name: '女巫',
    chineseName: '女巫',
    isGod: true,
    type: 'standard',
    firstNightPhase: 'first-night-witch',
  },
  {
    name: '守卫',
    chineseName: '守卫',
    isGod: true,
    type: 'standard',
    firstNightPhase: 'first-night-guard',
  },
  {
    name: '猎人',
    chineseName: '猎人',
    isGod: true,
    type: 'standard',
    firstNightPhase: 'first-night-hunter',
  },
  {
    name: '白痴',
    chineseName: '白痴',
    isGod: true,
    type: 'standard',
    firstNightPhase: 'first-night-idiot',
  },
  {
    name: '熊',
    chineseName: '熊',
    isGod: true,
    type: 'standard',
    firstNightPhase: 'first-night-bear',
  },
  // 特殊 role
  {
    name: 'white-wolf-king',
    chineseName: '白狼王',
    isGod: false,
    type: 'multi-select',
    firstNightPhase: 'first-night-white-wolf-king',
  },
  {
    name: 'wolf-beauty',
    chineseName: '狼美人',
    isGod: false,
    type: 'multi-select',
    firstNightPhase: 'first-night-wolf-beauty',
  },
];

// 用于快速查找的映射表
const roleNameMap = new Map<Role | string, RoleConfig>();
ROLE_CONFIGS.forEach(config => {
  roleNameMap.set(config.name, config);
});

export function getRoleConfig(name: Role | string): RoleConfig | undefined {
  return roleNameMap.get(name);
}

export function isStandardRole(config: RoleConfig): config is StandardRoleConfig {
  return config.type === 'standard';
}

export function isMultiSelectRole(config: RoleConfig): config is MultiSelectRoleConfig {
  return config.type === 'multi-select';
}
