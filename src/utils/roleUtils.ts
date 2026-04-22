import type { Role } from '../types';

// 判断是否神职
export function isGod(role: Role | null): boolean {
  return (
    role === '预言家' ||
    role === '女巫' ||
    role === '守卫' ||
    role === '猎人'
  );
}

// 判断是否狼人（顺手一起做）
export function isWolf(role: Role | null): boolean {
  return role === '狼人';
}

// 判断是否村民
export function isVillager(role: Role | null): boolean {
  return role === '村民';
}