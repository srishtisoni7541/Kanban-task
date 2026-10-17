import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Priority, Task, User } from "../types";
import { X } from "lucide-react";

interface TaskModelProps {
  users: User[];
  task: Task | null;
  columnId: string;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const labelClass = "mb-1.5 block text-sm font-semibold text-slate-300";
const fieldClass =
  "w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-slate-100 outline-none transition [color-scheme:dark] placeholder:text-slate-500 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/30";

export default function TaskModel({
  users,
  task,
  columnId,
  onClose,
  onSave,
}: TaskModelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [labels, setLabels] = useState("");

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setPriority(task?.priority ?? "Medium");
    setAssigneeId(task?.assigneeId != null ? String(task.assigneeId) : "");
    setDueDate(task?.dueDate ?? "");
    setLabels(task?.labels.join(", ") ?? "");
  }, [task]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) return;

    onSave({
      id: task?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      columnId: task?.columnId ?? columnId,
      priority,
      assigneeId: assigneeId ? Number(assigneeId) : null,
      dueDate: dueDate || null,
      labels: labels
        .split(",")
        .map((label) => label.trim())
        .filter(Boolean),
      createdAt: task?.createdAt ?? new Date().toISOString(),
    });

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[90vh] w-full max-w-lg space-y-5 overflow-y-auto rounded-3xl bg-slate-900 p-7 shadow-2xl ring-1 ring-white/10"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-100">
            {task ? "Edit Task" : "Create New Task"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <X size={20} />
          </button>
        </div>

        <div>
          <label className={labelClass}>Task Title *</label>
          <input
            required
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Build login page"
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe the task..."
            className={fieldClass}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Priority</label>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as Priority)}
              className={fieldClass}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Assign To</label>
            <select
              value={assigneeId}
              onChange={(event) => setAssigneeId(event.target.value)}
              className={fieldClass}
            >
              <option value="">Unassigned</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClass}>Due Date</label>
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            className={fieldClass}
          />
        </div>

        <div>
          <label className={labelClass}>Labels</label>
          <input
            value={labels}
            onChange={(event) => setLabels(event.target.value)}
            placeholder="Frontend, Bug, Design"
            className={fieldClass}
          />
          <p className="mt-1.5 text-xs text-slate-400">
            Multiple labels ko comma se separate karna.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-900/40 transition hover:bg-indigo-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 active:scale-95"
          >
            {task ? "Save Changes" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}