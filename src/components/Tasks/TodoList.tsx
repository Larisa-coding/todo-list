import React, { useRef, useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Todo } from '../../hooks/useTodos';
import { useI18n } from '../../i18n';
import { TaskFilter } from '../Layout/Sidebar';

type TodoListProps = {
  todos: Todo[];
  filter: TaskFilter;
  onAdd: (title: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onClearCompleted: () => void;
};

const cardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.78), rgba(32, 35, 37, 0.78))',
  border: '1px solid rgba(120, 120, 120, 0.3)',
};

const MAX_LENGTH = 300;

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onClearCompleted,
}) => {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'done') return todo.completed;
    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;
  const progress = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  const emptyText = {
    all: t('emptyAll'),
    active: t('emptyActive'),
    done: t('emptyDone'),
  }[filter];

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle('');
    inputRef.current?.focus();
  };

  const handleClearInput = () => {
    setTitle('');
    inputRef.current?.focus();
  };

  // Редактирование задачи
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingValue(todo.title);
  };

  const commitEdit = (id: string) => {
    const trimmed = editingValue.trim();
    if (trimmed) {
      onEdit(id, trimmed);
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') commitEdit(id);
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Прогресс */}
      <section className="rounded-2xl p-5 backdrop-blur-xl" style={cardStyle}>
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <p className="text-xs uppercase tracking-wider" style={{ color: '#8d8d8d' }}>
              {t('progress')}
            </p>
            <p className="text-2xl font-display mt-1" style={{ color: '#d8d8d8' }}>
              {activeCount}{' '}
              <span className="text-base font-accent" style={{ color: '#9a9a9a' }}>
                {t('left')}
              </span>
            </p>
          </div>
          <p className="text-sm" style={{ color: '#b0b0b0' }}>
            {completedCount} / {todos.length}
          </p>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(20, 22, 24, 0.55)' }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('progress')}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: '#b7b7b7' }}
          />
        </div>
      </section>

      {/* Форма добавления */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor="new-task">
          {t('addPlaceholder')}
        </label>
        <div className="relative flex-1">
          <input
            id="new-task"
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('addPlaceholder')}
            maxLength={MAX_LENGTH}
            className="w-full px-4 py-3 rounded-xl outline-none font-accent pr-16"
            style={{
              backgroundColor: 'rgba(26, 29, 31, 0.72)',
              border: '1px solid rgba(120, 120, 120, 0.35)',
              color: '#ececec',
            }}
          />
          {/* Счётчик символов + кнопка очистки */}
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5"
            style={{ color: '#6a6a6a' }}
          >
            {title.length > 0 && (
              <>
                <span className="text-xs tabular-nums">
                  {title.length}/{MAX_LENGTH}
                </span>
                <button
                  type="button"
                  onClick={handleClearInput}
                  aria-label="Очистить поле"
                  className="p-0.5 rounded transition-opacity hover:opacity-80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t('add')}
        </button>
      </form>

      {/* Список задач */}
      {visible.length === 0 ? (
        <div className="rounded-2xl px-6 py-14 text-center backdrop-blur-xl" style={cardStyle}>
          <p style={{ color: '#a0a0a0' }}>{emptyText}</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label={t('taskList')}>
          {visible.map((todo) => (
            <li
              key={todo.id}
              className="rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl animate-fade-in"
              style={cardStyle}
            >
              {/* Чекбокс */}
              <button
                type="button"
                onClick={() => onToggle(todo.id)}
                aria-label={todo.completed ? t('toggleUndo') : t('toggleDone')}
                aria-pressed={todo.completed}
                className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  border: '1px solid rgba(176, 176, 176, 0.55)',
                  backgroundColor: todo.completed ? 'rgba(192, 192, 192, 0.22)' : 'transparent',
                  color: '#e8e8e8',
                }}
              >
                {todo.completed && <Check className="w-4 h-4" />}
              </button>

              {/* Текст / поле редактирования */}
              {editingId === todo.id ? (
                <input
                  autoFocus
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value.slice(0, MAX_LENGTH))}
                  onBlur={() => commitEdit(todo.id)}
                  onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                  className="flex-1 px-2 py-0.5 rounded-lg outline-none font-accent text-sm"
                  style={{
                    backgroundColor: 'rgba(26, 29, 31, 0.72)',
                    border: '1px solid rgba(120, 120, 120, 0.5)',
                    color: '#ececec',
                  }}
                />
              ) : (
                <span
                  className="flex-1 font-accent break-words cursor-pointer select-none"
                  style={{
                    color: todo.completed ? '#8a8a8a' : '#e4e4e4',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                  }}
                  onDoubleClick={() => !todo.completed && startEditing(todo)}
                  title={!todo.completed ? t('editHint') : undefined}
                >
                  {todo.title}
                </span>
              )}

              {/* Кнопки действий */}
              {editingId !== todo.id && (
                <div className="flex items-center gap-1 shrink-0">
                  {!todo.completed && (
                    <button
                      type="button"
                      onClick={() => startEditing(todo)}
                      aria-label={t('edit')}
                      className="btn-icon"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onDelete(todo.id)}
                    aria-label={t('delete')}
                    className="btn-icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Очистить выполненные */}
      {completedCount > 0 && (
        <div className="flex justify-end">
          <button type="button" onClick={onClearCompleted} className="btn-danger text-sm">
            {t('clearDone')}
          </button>
        </div>
      )}
    </div>
  );
};
