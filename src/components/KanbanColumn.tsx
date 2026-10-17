import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import type { Column, Task, User } from "../types";
import TaskCard from "./TaskCard";

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  users: User[];
  onAddTask: (columnId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

function SortableTask({
  task,
  users,
  onEditTask,
  onDeleteTask,
}: {
  task: Task;
  users: User[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
      }}
      {...attributes}
      {...listeners}
      className="touch-none cursor-grab active:cursor-grabbing"
    >
      <div
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;

          if (target.closest("button, input, select, textarea, a")) {
            event.stopPropagation();
          }
        }}
      >
        <TaskCard
          task={task}
          users={users}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
        />
      </div>
    </div>
  );
}

function columnDot(title: string) {
  const name = title.toLowerCase();
  if (name.includes("done")) return "bg-emerald-500";
  if (name.includes("progress")) return "bg-amber-500";
  if (name.includes("review")) return "bg-violet-500";
  return "bg-slate-400";
}

export default function KanbanColumn({
  column,
  tasks,
  users,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column" },
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <section className="flex w-[290px] shrink-0 flex-col rounded-2xl bg-slate-900 p-3 ring-1 ring-white/10 sm:w-[320px]">
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${columnDot(column.title)}`} />
          <h2 className="font-bold text-slate-100">{column.title}</h2>

          <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs font-semibold text-slate-200">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(column.id)}
          aria-label={`Add task to ${column.title}`}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-700 hover:text-indigo-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Plus size={18} />
        </button>
      </div>

      <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex min-h-36 flex-1 flex-col gap-3 rounded-xl p-1 transition ${
            isOver ? "bg-indigo-500/10 ring-2 ring-indigo-400" : ""
          }`}
        >
          {tasks.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              users={users}
              onEditTask={onEditTask}
              onDeleteTask={onDeleteTask}
            />
          ))}

          {tasks.length === 0 && (
            <button
              onClick={() => onAddTask(column.id)}
              className="flex min-h-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-700 text-sm font-medium text-slate-400 transition hover:border-indigo-400 hover:bg-slate-800/60 hover:text-indigo-300"
            >
              + Add your first task
            </button>
          )}
        </div>
      </SortableContext>
    </section>
  );
}