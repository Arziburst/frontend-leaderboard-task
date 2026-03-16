# System Patterns

- **UI text:** Hardcoded strings in code are in English (per project rule).
- **Commits:** English; format `[BEAKPT-taskNumber]: type(scope): description`; no commits without explicit user permission.
- **Imports:** Use `@/` for app root (e.g. `@/lib/types`, `@/components/LeaderboardRow`).
- **Client boundary:** Only components that need state/effects use `'use client'` (LeaderboardClient); page and layout stay server.
- **Selection key:** Stable string from `makeUserKey(user, index)` so selection survives when row unmounts (virtualization).
