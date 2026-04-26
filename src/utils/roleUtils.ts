import type { Role } from '../types';

const GOD_ROLES: Role[] = ['预言家', '女巫', '守卫', '猎人', '白痴', '熊'];
const WOLF_ROLES: Role[] = ['狼人', '白狼王', '狼美人'];
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