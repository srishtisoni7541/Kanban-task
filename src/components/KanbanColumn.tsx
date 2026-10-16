
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
    <section className="flex w-[290px] shrink-0 flex-col rounded-xl bg-gray-100 p-3 sm:w-[320px]">
      <div className="mb-3 flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-800">
            {column.title}
          </h2>

          <span className="rounded-full bg-white px-2 py-0.5 text-xs text-gray-600">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(column.id)}
          aria-label={`Add task to ${column.title}`}
          className="rounded-lg p-2 text-gray-500 hover:bg-white hover:text-indigo-600"
        >
          <Plus size={18} />
        </button>
      </div>

      <SortableContext
        items={taskIds}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`flex min-h-36 flex-1 flex-col gap-3 rounded-lg transition ${
            isOver ? "bg-indigo-50 ring-2 ring-indigo-300" : ""
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
              className="flex min-h-24 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 text-sm text-gray-500 hover:border-indigo-400 hover:text-indigo-600"
            >
              + Add your first task
            </button>
          )}
        </div>
      </SortableContext>
    </section>
  );
}
