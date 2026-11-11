import { useEffect, useState } from 'react';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  urgent: boolean;
  createdAt: number;
};

const STORAGE_KEY = 'task-list-items-v1';

const isTodo = (value: unknown): value is Todo => {
  if (!value || typeof value !== 'object') return false;
  const todo = value as Record<string, unknown>;
  return (
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    typeof todo.completed === 'boolean' &&
    typeof todo.createdAt === 'number'
  );
};

const normalizeTodo = (raw: Record<string, unknown>): Todo => ({
  id: raw.id as string,
  title: raw.title as string,
  completed: raw.completed as boolean,
  urgent: typeof raw.urgent === 'boolean' ? raw.urgent : false,
  createdAt: raw.createdAt as number,
});

const readTodos = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTodo).map(normalizeTodo);
  } catch {
    return [];
  }
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(readTodos);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {}
  }, [todos]);

  const addTodo = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    const next: Todo = {
      id: crypto.randomUUID(),
      title: trimmed.slice(0, 300),
      completed: false,
      urgent: false,
      createdAt: Date.now(),
    };
    setTodos((current) => [next, ...current]);
  };

  const toggleTodo = (id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const toggleUrgent = (id: string) => {
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, urgent: !todo.urgent } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  };

  const editTodo = (id: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    setTodos((current) =>
      current.map((todo) =>
        todo.id === id ? { ...todo, title: trimmed.slice(0, 300) } : todo
      )
    );
  };

  const clearCompleted = (): Todo[] => {
    const removed = todos.filter((todo) => todo.completed);
    setTodos((current) => current.filter((todo) => !todo.completed));
    return removed;
  };

  const restoreTodos = (items: Todo[]) => {
    setTodos((current) => [...current, ...items]);
  };

  return { todos, addTodo, toggleTodo, toggleUrgent, deleteTodo, editTodo, clearCompleted, restoreTodos };
};
