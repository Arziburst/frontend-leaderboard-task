import { Color, type User } from './types';
import { createSeededRng, randomInt, sleep } from './utils';
import {
  LOAD_MAX_DELAY_MS,
  LOAD_MIN_DELAY_MS,
  MAX_USERS,
  PAGE_SIZE
} from './constants';

const SEED = 42;

// Генеруємо стабільний масив користувачів один раз на клієнті
const allUsers: User[] = (() => {
  const rng = createSeededRng(SEED);

  const firstNames = [
    'Катерина',
    'Олексій',
    'Марія',
    'Володимир',
    'Олена',
    'Дмитро',
    'Світлана',
    'Іван',
    'Наталія',
    'Андрій'
  ];

  const lastNames = [
    'Петренко',
    'Іванов',
    'Коваль',
    'Сидоренко',
    'Шевченко',
    'Бондаренко',
    'Лі',
    'Мельник',
    'Ткаченко',
    'Кравчук'
  ];

  const longNames = [
    'Катерина Петренко — королева нічних трас',
    'Олексій Іванов — чемпіон неонового міста',
    'Марія Коваль — тінь швидкісного автобану'
  ];

  const users: User[] = [];

  for (let i = 0; i < MAX_USERS; i += 1) {
    const useLongName = i % 17 === 0 && longNames[i % longNames.length];
    const name = useLongName
      ? longNames[i % longNames.length]
      : `${firstNames[i % firstNames.length]} ${
          lastNames[(i * 7) % lastNames.length]
        }`;

    const baseSpeed = randomInt(rng, 120, 260);
    const time = randomInt(rng, 40_000, 120_000);

    const colorIndex = randomInt(rng, 0, 2) as 0 | 1 | 2;
    const color = [Color.RED, Color.GREEN, Color.BLUE][colorIndex];

    users.push({
      color,
      name,
      speed: baseSpeed,
      time
    });
  }

  users.sort((a, b) => a.time - b.time || b.speed - a.speed);

  return users;
})();

// Імітуємо мережеву затримку для завантаження сторінок
async function loadPageSlice(offset: number, limit: number): Promise<User[]> {
  const delay =
    LOAD_MIN_DELAY_MS +
    Math.random() * (LOAD_MAX_DELAY_MS - LOAD_MIN_DELAY_MS);

  await sleep(delay);

  const start = offset;
  const end = Math.min(offset + limit, allUsers.length);

  return allUsers.slice(start, end);
}

export async function loadInitialUsers(): Promise<{
  users: User[];
  total: number;
}> {
  const users = await loadPageSlice(0, PAGE_SIZE);

  return {
    users,
    total: allUsers.length
  };
}

export async function loadMoreUsers(
  alreadyLoaded: number
): Promise<{ users: User[]; hasMore: boolean }> {
  if (alreadyLoaded >= allUsers.length) {
    return {
      users: [],
      hasMore: false
    };
  }

  const slice = await loadPageSlice(alreadyLoaded, PAGE_SIZE);

  return {
    users: slice,
    hasMore: alreadyLoaded + slice.length < allUsers.length
  };
}

