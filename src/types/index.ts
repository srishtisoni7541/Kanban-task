
export type Priority = "Low" | "Medium" | "High";

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  priority: Priority;
  assigneeId: number | null;
  labels: string[];
  dueDate: string | null;
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  title: string;
  columns: Column[];
  tasks: Record<string, Task>;
}
