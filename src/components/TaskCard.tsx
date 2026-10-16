
import type { Task, User } from "../types";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";

interface TaskCardProps {
  task: Task;
  users: User[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const priorityStyles = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

export default function TaskCard({
  task,
  users,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const assignee = users.find(
    (user) => user.id === task.assigneeId
  );

  const isOverdue =
    task.dueDate !== null &&
    task.dueDate < new Date().toISOString().slice(0, 10);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="break-words font-semibold text-gray-800">
          {task.title}
        </h3>

        <div className="flex shrink-0 gap-1">
          <button
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="mb-3 text-sm text-gray-500">
          {task.description}
        </p>
      )}

      <span
        className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${priorityStyles[task.priority]}`}
      >
        {task.priority} Priority
      </span>

      {task.labels.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {task.labels.map((label) => (
            <span
              key={label}
              className="rounded-md bg-indigo-50 px-2 py-1 text-xs text-indigo-700"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
        <div className="flex min-w-0 items-center gap-2">
          {assignee?.image && (
            <img
              src={assignee.image}
              alt=""
              className="h-7 w-7 rounded-full object-cover"
            />
          )}

          <span className="truncate text-xs text-gray-600">
            {assignee
              ? `${assignee.firstName} ${assignee.lastName}`
              : "Unassigned"}
          </span>
        </div>

        {task.dueDate && (
          <span
            className={`flex shrink-0 items-center gap-1 text-xs ${
              isOverdue ? "text-red-600" : "text-gray-500"
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
