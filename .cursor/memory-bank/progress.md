# Progress

## Done

- Next.js 16 App Router + React 19 + TypeScript + Tailwind v4 setup.
- Types from README (Color, User) in `lib/types.ts`, unchanged.
- Client-side mock: 1000 users, Ukrainian names, seeded RNG, 50 per page, simulated delay.
- Virtualized list (`@tanstack/react-virtual`), fixed row height, overscan.
- Infinite scroll with in-flight guard; load more when last visible index near end.
- Row: rank, avatar (circle with image + color), name (truncate), time (purple), speed; penalty time optional.
- Selection: purple row background, purple ring on avatar; no outer row border.
- Avatar column alignment via CSS variable `--rank-col` and grid; smooth transition when rank width changes; prefers-reduced-motion.
- Single scroll block, no header/counter/footer text; padding removed so rows full-width.
- Helpers in `lib/leaderboard.ts` and `lib/utils.ts`; constants in `lib/constants.ts`.
- `.gitignore` for .next, node_modules, env, IDE, etc.

## Not required by README (optional / deferred)

- Penalty time: README says not required; implemented as derived value in leaderboard.ts when needed.
- Real API or i18n: out of scope.
