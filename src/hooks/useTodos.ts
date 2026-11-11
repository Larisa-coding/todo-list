import { useEffect, useState } from 'react';

export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

const STORAGE_KEY = 'task-list-items-v1';

const isTodo = (value: unknown): value is Todo => {
  if (!value || typeof value !== 'object') return false;
  const todo = value as Todo;
  return (
    typeof todo.id === 'string' &&
    typeof todo.title === 'string' &&
    typeof todo.completed === 'boolean' &&
    typeof todo.createdAt === 'number'
  );
};

const readTodos = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTodo);
  } catch {
    return [];
  }
};

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>(readTodos);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Keep the in-memory list if storage is unavailable.
    }
  }, [todos]);

  const addTodo = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;

    const next: Todo = {
      id: crypto.randomUUID(),
      title: trimmed.slice(0, 300),
      completed: false,
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

  const clearCompleted = () => {
    setTodos((current) => current.filter((todo) => !todo.completed));
  };

  return { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted };
};
