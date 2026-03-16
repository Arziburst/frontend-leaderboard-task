// Типи мають збігатися з умовою задачі
export enum Color {
  RED,
  GREEN,
  BLUE
}

// Позиція в рейтингу відповідає індексу елемента
export interface User {
  color: Color;
  name: string;
  speed: number;
  time: number;
}

