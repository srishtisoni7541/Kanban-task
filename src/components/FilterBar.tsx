import { Search, SlidersHorizontal, X } from "lucide-react";
import type { Priority, User } from "../types";

interface FilterBarProps {
  search: string;
  setSearch: (value: string) => void;
  priority: Priority | "All";
  setPriority: (value: Priority | "All") => void;
  assigneeId: string;
  setAssigneeId: (value: string) => void;
  users: User[];
}

const selectClass =
  "rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-sm text-slate-200 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/30";

export default function FilterBar({
  search,
  setSearch,
  priority,
  setPriority,
  assigneeId,
  setAssigneeId,
  users,
}: FilterBarProps) {
  const hasFilters =
    search !== "" || priority !== "All" || assigneeId !== "All";

  function clearFilters() {
    setSearch("");
    setPriority("All");
    setAssigneeId("All");
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-900 p-3 ring-1 ring-white/10 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/30"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal size={17} className="text-slate-500" />

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as Priority | "All")
          }
          className={`min-w-28 ${selectClass}`}
          aria-label="Filter by priority"
        >
          <option value="All">All priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={assigneeId}
          onChange={(event) => setAssigneeId(event.target.value)}
          className={`min-w-32 ${selectClass}`}
          aria-label="Filter by assignee"
        >
          <option value="All">All assignees</option>
          <option value="Unassigned">Unassigned</option>

          {users.map((user) => (
            <option key={user.id} value={String(user.id)}>
              {user.firstName} {user.lastName}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 rounded-xl bg-rose-500/10 px-3 py-2.5 text-sm font-medium text-rose-300 ring-1 ring-rose-400/30 transition hover:bg-rose-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <X size={15} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}