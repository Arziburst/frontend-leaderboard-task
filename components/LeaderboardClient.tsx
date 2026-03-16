'use client';

import React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { LeaderboardRow } from '@/components/LeaderboardRow';
import { PAGE_SIZE, ROW_HEIGHT_PX, VIRTUAL_OVERSCAN } from '@/lib/constants';
import { loadInitialUsers, loadMoreUsers } from '@/lib/mockUsers';
import type { User } from '@/lib/types';
import { makeUserKey, type SelectedKey } from '@/lib/leaderboard';

export function LeaderboardClient() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);
  const [selectedKey, setSelectedKey] = React.useState<SelectedKey>(null);

  const scrollParentRef = React.useRef<HTMLDivElement | null>(null);

  const rankDigits = React.useMemo(() => {
    const currentMaxRank = Math.max(users.length, 1);
    return String(currentMaxRank).length;
  }, [users.length]);

  const rankColumnWidth = React.useMemo(
    () => `calc(${rankDigits}ch + 0.75rem)`,
    [rankDigits]
  );

  // Віртуалізуємо список замість 1000+ DOM-рядків
  const rowVirtualizer = useVirtualizer({
    count: users.length,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => ROW_HEIGHT_PX,
    overscan: VIRTUAL_OVERSCAN
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  React.useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const { users: initialUsers } = await loadInitialUsers();
        if (cancelled) return;
        setUsers(initialUsers);
        setHasMore(true);
      } finally {
        if (!cancelled) {
          setIsInitialLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, []);

  // Захист від дублювання запитів при швидкому скролі
  const triggerLoadMore = React.useCallback(async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);
    try {
      const { users: nextUsers, hasMore: nextHasMore } = await loadMoreUsers(
        users.length
      );
      setUsers((prev) => [...prev, ...nextUsers]);
      setHasMore(nextHasMore);
    } finally {
      setIsLoadingMore(false);
    }
  }, [hasMore, isLoadingMore, users.length]);

  React.useEffect(() => {
    if (!hasMore || isLoadingMore || users.length === 0) {
      return;
    }

    if (virtualItems.length === 0) {
      return;
    }

    const last = virtualItems[virtualItems.length - 1];
    const threshold = users.length - Math.max(10, PAGE_SIZE / 5);

    if (last.index >= threshold) {
      void triggerLoadMore();
    }
  }, [hasMore, isLoadingMore, triggerLoadMore, users.length, virtualItems]);

  const handleSelect = React.useCallback((user: User, index: number) => {
    const key = makeUserKey(user, index);
    setSelectedKey((prev) => (prev === key ? null : key));
  }, []);

  const rankColumnStyle = React.useMemo<
    React.CSSProperties & { '--rank-col'?: string }
  >(
    () => ({
      '--rank-col': rankColumnWidth
    }),
    [rankColumnWidth]
  );

  const hasAnyData = users.length > 0;

  return (
    <section
      aria-label="Racing leaderboard"
      className="flex flex-col"
      style={rankColumnStyle}
    >
      <div
        ref={scrollParentRef}
        className="leaderboard-scroll mt-2 h-[520px] overflow-y-auto rounded-3xl bg-transparent p-0"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: 'relative',
            width: '100%'
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const index = virtualRow.index;
            const user = users[index];
            if (!user) return null;

            const key = makeUserKey(user, index);
            const selected = selectedKey === key;

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                <LeaderboardRow
                  user={user}
                  rank={index + 1}
                  selected={selected}
                  onSelect={() => handleSelect(user, index)}
                />
              </div>
            );
          })}
        </div>

        {isInitialLoading && !hasAnyData && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              Loading racers...
            </div>
          </div>
        )}

        {!isInitialLoading && !hasAnyData && (
          <div className="mt-6 flex justify-center">
            <div className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-slate-200">
              No racers to display
            </div>
          </div>
        )}

        {isLoadingMore && hasAnyData && (
          <div className="mt-3 flex justify-center pb-2">
            <div className="flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1.5 text-[11px] font-medium text-slate-200">
              <span className="h-1.5 w-8 animate-pulse rounded-full bg-emerald-400/80" />
              Loading more...
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

