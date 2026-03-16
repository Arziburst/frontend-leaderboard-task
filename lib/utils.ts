// Детермінований ГВЧ для відтворюваних мок-даних
export function createSeededRng(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0xffffffff;
  };
}

export function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function randomInt(rng: () => number, min: number, max: number) {
  const n = rng();
  return Math.floor(n * (max - min + 1)) + min;
}

