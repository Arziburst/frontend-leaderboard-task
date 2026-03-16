# Project Brief: Racing Leaderboard (Frontend Test Task)

## What this is

Demo SPA for a **racing mini-game leaderboard** ("Гоночки"): one page that shows a ranked list of players with avatar, name, race time, speed, and optional penalty time. Data is generated on the client (no real API); network delay is simulated with loaders. The list is virtualized and supports infinite scroll so it stays smooth with 1000+ rows.

## Purpose

- **Assignment:** Frontend test task from README: build a mobile-first leaderboard UI that meets given technical and UX requirements.
- **Use case:** Proof of implementation for React/Next.js, virtualization, infinite loading, and layout (avatar alignment, selection, truncation).

## How it's made

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `@tanstack/react-virtual`.
- **Data:** `lib/mockUsers.ts` — deterministic seeded RNG generates up to 1000 users (Ukrainian names), sorted by time/speed; `loadInitialUsers()` and `loadMoreUsers(offset)` return batches of 50 with 300–600 ms simulated delay.
- **Types:** `lib/types.ts` — `Color` enum and `User` interface **unchanged** from README (required).
- **UI:** Single route `/`; server `app/page.tsx` renders client `LeaderboardClient`, which owns state (users, loading, selection) and a virtualized scroll container. Rows are `LeaderboardRow` (memo): rank, circular avatar (image from `public/1–3.png` + color fallback), name (truncate), time (purple), speed; selection = light purple row background + purple ring on avatar; no outer row border.
- **Virtualization:** `useVirtualizer` with fixed row height (64px), overscan; only visible rows (+ overscan) are mounted so 1000+ items don’t hurt FPS.
- **Infinite scroll:** When the last visible virtual index gets within a threshold of the loaded length, `loadMoreUsers` is called once (in-flight guard prevents duplicate requests).
- **Avatar column:** CSS variable `--rank-col` on the section is set from `rankDigits` (e.g. `calc(Nch + 0.75rem)`); row grid uses `var(--rank-col) auto minmax(0,1fr)` so avatars stay on one vertical axis; transition on `grid-template-columns` + `motion-reduce:transition-none` in globals for smooth realignment when rank width grows (e.g. 99 → 100).
- **Helpers:** `lib/leaderboard.ts` — `formatRaceTime`, `formatPenaltyTime`, `getPenaltyTimeForUser`, `getAvatarImageForUser`, `makeUserKey`, `SelectedKey`. `lib/utils.ts` — `createSeededRng`, `sleep`, `randomInt`. `lib/constants.ts` — `PAGE_SIZE`, `MAX_USERS`, delays, row height, overscan.

## README requirements vs implementation

| Requirement | Status | Notes |
|-------------|--------|--------|
| React: only functional components + hooks | Done | All components are function components using hooks. |
| Do not change TypeScript interfaces (Color, User) | Done | `lib/types.ts` matches README; no new fields in User. |
| Data generated on client, simulate network delay | Done | `lib/mockUsers.ts` + delay in load functions. |
| Initial load: first 50 users | Done | `loadInitialUsers()` returns 50; PAGE_SIZE=50. |
| Infinite scroll: lazy-load 50 per batch near bottom | Done | Threshold based on last virtual index; in-flight guard. |
| Smooth with 1000+ users (no FPS drop) | Done | `@tanstack/react-virtual`; only visible + overscan in DOM. |
| Adaptive 320px–1920px | Done | Layout and Tailwind responsive; max-w-md, padding. |
| Truncate long name with ellipsis | Done | `truncate` on name in LeaderboardRow. |
| Click row → highlight (purple) | Done | Row: `bg-purple-50` when selected; avatar: `ring-2 ring-purple-500`. No row border. |
| Avatars on single vertical axis; smooth re-align when rank column widens | Done | `--rank-col` + grid + transition; prefers-reduced-motion respected in globals. |
| Visual close to provided mockup | Done | Light background, white rows, purple time, avatar ring on select. |
| Penalty time (README: "реалізовувати не потрібно") | Optional | README says not required; can be added via derived value (e.g. getPenaltyTimeForUser) without changing User. Current row may or may not show it depending on design choices. |

All mandatory README items are implemented. Penalty time was explicitly not required in README; if added later, it is an extra.
