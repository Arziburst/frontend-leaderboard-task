import type { CSSProperties } from "react";
import { memo } from "react";
import { Color, type User } from "@/lib/types";
import { formatRaceTime, getAvatarImageForUser } from "@/lib/leaderboard";

type Props = {
  user: User;
  rank: number;
  selected: boolean;
  onSelect: () => void;
};

const colorToClassName: Record<Color, string> = {
  [Color.RED]: "bg-red-500",
  [Color.GREEN]: "bg-emerald-400",
  [Color.BLUE]: "bg-sky-400",
};

function LeaderboardRowBase(props: Props) {
  const { user, rank, selected, onSelect } = props;

  const avatarColor = colorToClassName[user.color] ?? "bg-slate-500";
  const avatarImage = getAvatarImageForUser(user);

  const rowStyle: CSSProperties = {
    height: "64px",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "leaderboard-row",
        "grid w-full items-center gap-1 px-2 py-2",
        "transition-[background-color,box-shadow,grid-template-columns] duration-200",
        "motion-reduce:transition-none",
        selected ? "bg-purple-50" : "bg-white hover:bg-slate-100",
        "text-left",
      ].join(" ")}
      style={{
        ...rowStyle,
        gridTemplateColumns: "var(--rank-col) auto minmax(0,1fr)",
      }}
    >
      <div className="text-sm text-center font-semibold text-slate-500 tabular-nums">
        {rank}
      </div>

      <div className="relative flex h-12 w-12 items-center justify-center">
        <div
          className={[
            "h-12 w-12 rounded-full",
            selected ? "ring-2 ring-purple-500" : "ring-2 ring-white/60",
            "transition-[ring-color,transform] duration-200",
            "shadow-sm",
            avatarColor,
          ].join(" ")}
          aria-hidden="true"
          style={{
            backgroundImage: `url(${avatarImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-slate-900">
          {user.name}
        </div>
        <div className="mt-0.5 text-xs text-slate-500">
          <span className="font-semibold text-purple-500">
            {formatRaceTime(user.time)}
          </span>{" "}
          <span className="text-slate-400">| {user.speed} km/h</span>
        </div>
      </div>
    </button>
  );
}

export const LeaderboardRow = memo(LeaderboardRowBase);
