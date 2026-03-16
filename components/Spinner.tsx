'use client';

import React from 'react';

function lerp(x: number, x0: number, x1: number, y0: number, y1: number) {
  const t = (x - x0) / (x1 - x0);
  return y0 + t * (y1 - y0);
}

function lerpColor(
  x: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number
) {
  const b0 = y0 & 0xff;
  const g0 = (y0 & 0xff00) >> 8;
  const r0 = (y0 & 0xff0000) >> 16;
  const b1 = y1 & 0xff;
  const g1 = (y1 & 0xff00) >> 8;
  const r1 = (y1 & 0xff0000) >> 16;
  const r = Math.floor(lerp(x, x0, x1, r0, r1));
  const g = Math.floor(lerp(x, x0, x1, g0, g1));
  const b = Math.floor(lerp(x, x0, x1, b0, b1));
  return (
    '#' +
    ('00000' + ((r << 16) | (g << 8) | b).toString(16)).slice(-6)
  );
}

function lerpTable<T = number>(
  vIndex: number,
  tValue: number,
  table: number[][],
  canExtrapolate: boolean,
  lerpFunc: (x: number, x0: number, x1: number, y0: number, y1: number) => T = lerp as (x: number, x0: number, x1: number, y0: number, y1: number) => T
): T {
  const rowCount = table.length;
  for (let i = 0; i < rowCount; ++i) {
    const a = table[i][0];
    if (i === 0 && tValue < a) {
      if (canExtrapolate) {
        return lerpFunc(
          tValue,
          a,
          table[i + 1][0],
          table[i][vIndex],
          table[i + 1][vIndex]
        );
      }
      return lerpFunc(tValue, a, a, table[i][vIndex], table[i][vIndex]);
    }
    if (i === rowCount - 1 && tValue >= a) {
      if (canExtrapolate) {
        return lerpFunc(
          tValue,
          table[i - 1][0],
          a,
          table[i - 1][vIndex],
          table[i][vIndex]
        );
      }
      return lerpFunc(tValue, a, a, table[i][vIndex], table[i][vIndex]);
    }
    if (tValue >= a && tValue <= table[i + 1][0]) {
      return lerpFunc(
        tValue,
        a,
        table[i + 1][0],
        table[i][vIndex],
        table[i + 1][vIndex]
      );
    }
  }
  return lerpFunc(tValue, table[0][0], table[0][0], table[0][vIndex], table[0][vIndex]);
}

const PATH_WIDTH = 372;
const SPEED = 2;
const COLOR_TABLE: number[][] = [
  [0.0, 0xf15a31],
  [0.2, 0xffd31b],
  [0.33, 0xa6ce42],
  [0.4, 0x007ac1],
  [0.45, 0x007ac1],
  [0.55, 0x007ac1],
  [0.6, 0x007ac1],
  [0.67, 0xa6ce42],
  [0.8, 0xffd31b],
  [1.0, 0xf15a31]
];
const CYCLE_MS = 6000;

export function Spinner({ size = 80 }: { size?: number }) {
  const [stroke, setStroke] = React.useState('#ededed');
  const [offset, setOffset] = React.useState(445);
  const animStartRef = React.useRef<number>(0);
  const animIdRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    animStartRef.current = Date.now();

    function animate() {
      const currentAnim = Date.now();
      const t = ((currentAnim - animStartRef.current) % CYCLE_MS) / CYCLE_MS;
      const colorValue = lerpTable(1, t, COLOR_TABLE, false, lerpColor);
      setStroke(colorValue);
      setOffset((prev) => {
        let next = prev - SPEED;
        if (next < 0) next = PATH_WIDTH;
        return next;
      });
      animIdRef.current = window.requestAnimationFrame(animate);
    }

    animIdRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (animIdRef.current != null) {
        window.cancelAnimationFrame(animIdRef.current);
        animIdRef.current = null;
      }
    };
  }, []);

  const pathStyle: React.CSSProperties = {
    stroke,
    strokeDashoffset: offset
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 115 115"
      preserveAspectRatio="xMidYMid meet"
      className="inline-block"
      aria-hidden
    >
      <path
        opacity="0.05"
        fill="none"
        stroke="#000000"
        strokeWidth="3"
        d="M 85 85 C -5 16 -39 127 78 30 C 126 -9 57 -16 85 85 C 94 123 124 111 85 85 Z"
      />
      <path
        style={pathStyle}
        className="will-change-[stroke,stroke-dashoffset]"
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="60, 310"
        d="M 85 85 C -5 16 -39 127 78 30 C 126 -9 57 -16 85 85 C 94 123 124 111 85 85 Z"
      />
    </svg>
  );
}
