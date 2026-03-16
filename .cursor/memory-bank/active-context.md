# Active Context

- **Current focus:** Single-page leaderboard is feature-complete per README; UI follows light theme, purple selection (row background + avatar ring), no row border, full-width rows in scroll container.
- **Key files:** `app/page.tsx`, `app/layout.tsx`, `components/LeaderboardClient.tsx`, `components/LeaderboardRow.tsx`, `lib/mockUsers.ts`, `lib/leaderboard.ts`, `lib/constants.ts`, `lib/types.ts`, `lib/utils.ts`.
- **Avatars:** Images from `public/1.png`, `public/2.png`, `public/3.png`; `getAvatarImageForUser(user)` picks one by hash for deterministic variety.
- **Lint:** `eslint .` (flat config with typescript-eslint + react-hooks); eslint-config-next not used (FlatCompat circular ref with ESLint 9).
