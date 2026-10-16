
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
    <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-3 sm:flex-row sm:items-center">
      <div className="relative min-w-0 flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search tasks..."
          className="w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-sm outline-none focus:border-indigo-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <SlidersHorizontal size={17} className="text-gray-500" />

        <select
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as Priority | "All")
          }
          className="min-w-28 rounded-lg border border-gray-200 px-3 py-2 text-sm"
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
          className="min-w-32 rounded-lg border border-gray-200 px-3 py-2 text-sm"
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
            className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-gray-500 hover:bg-gray-100"
          >
            <X size={15} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
