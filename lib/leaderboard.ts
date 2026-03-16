import type { User } from './types';

export type SelectedKey = string | null;

export function formatRaceTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;

  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  const mmm = millis.toString().padStart(3, '0');

  return `${mm}:${ss}.${mmm}`;
}

export function formatPenaltyTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const millis = ms % 1000;

  const mm = minutes.toString().padStart(2, '0');
  const ss = seconds.toString().padStart(2, '0');
  const mmm = millis.toString().padStart(2, '0');

  return `${mm}:${ss}.${mmm}`;
}

export function getPenaltyTimeForUser(user: User): number {
  const base = (user.time % 15_000) + user.speed * 7;
  return base % 30_000;
}

export function makeUserKey(user: User, index: number): string {
  return `${index}-${user.name}-${user.time}-${user.speed}`;
}

export function getAvatarImageForUser(user: User): string {
  const source = `${user.name}-${user.time}-${user.speed}`;
  let hash = 0;

  for (let i = 0; i < source.length; i += 1) {
    const code = source.charCodeAt(i);
    hash = (hash * 31 + code) | 0;
  }

  const normalized = Math.abs(hash) % 3;
  const index = normalized + 1;

  return `/${index}.png`;
}


