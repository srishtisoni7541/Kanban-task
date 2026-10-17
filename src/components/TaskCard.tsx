import type { Task, User } from "../types";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  users: User[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityStyles = {
  Low: {
    badge: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/30",
    dot: "bg-emerald-500",
    edge: "border-l-emerald-400",
  },
  Medium: {
    badge: "bg-amber-500/10 text-amber-300 ring-amber-400/30",
    dot: "bg-amber-500",
    edge: "border-l-amber-400",
  },
  High: {
    badge: "bg-rose-500/10 text-rose-300 ring-rose-400/30",
    dot: "bg-rose-500",
    edge: "border-l-rose-500",
  },
};

export default function TaskCard({
  task,
  users,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const assignee = users.find((user) => user.id === task.assigneeId);

  const isOverdue =
    task.dueDate !== null &&
    task.dueDate < new Date().toISOString().slice(0, 10);

  const style = priorityStyles[task.priority];

  return (
    <article
      className={`rounded-xl border-l-4 bg-slate-800 p-4 shadow-sm ring-1 ring-white/10 transition hover:bg-slate-700/80 hover:shadow-xl hover:shadow-black/40 ${style.edge}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="break-words font-semibold leading-snug text-slate-100">
          {task.title}
        </h3>

        <div className="flex shrink-0 gap-0.5">
          <button
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-indigo-500/20 hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-500/20 hover:text-red-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mb-3 text-sm leading-6 text-slate-400">
          {task.description}
        </p>
      )}

      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${style.badge}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
        {task.priority} Priority
      </span>

      {task.labels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {task.labels.map((label) => (
            <span
              key={label}
              className="rounded-md bg-slate-700 px-2 py-1 text-xs font-medium text-slate-300"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-700 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          {assignee?.image ? (
            <img
              src={assignee.image}
              alt=""
              className="h-7 w-7 rounded-full object-cover ring-2 ring-slate-800"
            />
          ) : (
            assignee && (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300">
                {assignee.firstName.charAt(0)}
              </span>
            )
          )}

          <span className="truncate text-xs font-medium text-slate-300">
            {assignee
              ? `${assignee.firstName} ${assignee.lastName}`
              : "Unassigned"}
          </span>
        </div>

        {task.dueDate && (
          <span
            className={`flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
              isOverdue ? "bg-red-500/15 text-red-300" : "bg-slate-700 text-slate-400"
            }`}
          >
            <CalendarDays size={14} />
            {task.dueDate}
          </span>
        )}
      </div>
    </article>
  );
}