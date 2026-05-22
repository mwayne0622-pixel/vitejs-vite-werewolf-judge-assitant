import type { Role } from '../types';

const GOD_ROLES: Role[] = ['预言家', '女巫', '守卫', '猎人', '白痴', '熊', '骑士'];
const WOLF_ROLES: Role[] = ['狼人', '白狼王', '狼美人', '隐狼'];
const VILLAGER_ROLES: Role[] = ['村民'];

export function isGod(role: Role | null): boolean {
  return role !== null && GOD_ROLES.includes(role);
}

export function isWolf(role: Role | null): boolean {
  return role !== null && WOLF_ROLES.includes(role);
}

export function isVillager(role: Role | null): boolean {
  return role !== null && VILLAGER_ROLES.includes(role);
}

// 隐狼对预言家查验显示为好人阵营
export function isWolfToSeer(role: Role | null): boolean {
  if (role === '隐狼') return false;
  return isWolf(role);
}