import React, { useEffect, useRef, useState } from 'react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { Todo } from '../../hooks/useTodos';
import { useI18n } from '../../i18n';
import { TaskFilter } from '../Layout/Sidebar';

type TodoListProps = {
  todos: Todo[];
  filter: TaskFilter;
  onAdd: (title: string) => void;
  onToggle: (id: string) => void;
  onToggleUrgent: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onClearCompleted: () => Todo[];
  onRestoreTodos: (items: Todo[]) => void;
};

const UNDO_SECONDS = 5;
const MAX_LENGTH = 300;

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  onAdd,
  onToggle,
  onToggleUrgent,
  onDelete,
  onEdit,
  onClearCompleted,
  onRestoreTodos,
}) => {
  const { t } = useI18n();
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Отмена удаления
  const [undoItems, setUndoItems] = useState<Todo[] | null>(null);
  const [undoSeconds, setUndoSeconds] = useState(0);
  const undoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearUndoTimer = () => {
    if (undoTimerRef.current) {
      clearInterval(undoTimerRef.current);
      undoTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearUndoTimer();
  }, []);

  // Сортировка: срочные вверх, потом по дате создания
  const sorted = [...todos].sort((a, b) => {
    if (a.urgent && !b.urgent) return -1;
    if (!a.urgent && b.urgent) return 1;
    return b.createdAt - a.createdAt;
  });

  const visible = sorted.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'done') return todo.completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - completedCount;
  const progress = todos.length === 0 ? 0 : Math.round((completedCount / todos.length) * 100);

  const emptyText = {
    all: t('emptyAll'),
    active: t('emptyActive'),
    done: t('emptyDone'),
  }[filter];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title);
    setTitle('');
    inputRef.current?.focus();
  };

  const handleClearCompleted = () => {
    const removed = onClearCompleted();
    if (removed.length === 0) return;
    setUndoItems(removed);
    setUndoSeconds(UNDO_SECONDS);
    clearUndoTimer();
    undoTimerRef.current = setInterval(() => {
      setUndoSeconds((s) => {
        if (s <= 1) {
          clearUndoTimer();
          setUndoItems(null);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const handleUndo = () => {
    if (!undoItems) return;
    clearUndoTimer();
    onRestoreTodos(undoItems);
    setUndoItems(null);
    setUndoSeconds(0);
  };

  // Редактирование
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingValue(todo.title);
  };

  const commitEdit = (id: string) => {
    const trimmed = editingValue.trim();
    if (trimmed) onEdit(id, trimmed);
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') commitEdit(id);
    if (e.key === 'Escape') cancelEdit();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* ── Прогресс ── */}
      <section
        className="rounded-2xl p-5 backdrop-blur-xl card-surface"
      >
        <div className="flex items-end justify-between gap-4 mb-3">
          <div>
            <p className="text-xs uppercase tracking-wider font-accent" style={{ color: 'var(--text-muted)' }}>
              {t('progress')}
            </p>
            <p className="text-2xl font-display mt-1" style={{ color: 'var(--text-primary)' }}>
              {activeCount}{' '}
              <span className="text-base font-accent" style={{ color: 'var(--text-secondary)' }}>
                {t('left')}
              </span>
            </p>
          </div>
          <p className="text-sm font-accent" style={{ color: 'var(--text-secondary)' }}>
            {completedCount} / {todos.length}
          </p>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: 'var(--progress-track)' }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('progress')}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, backgroundColor: 'var(--progress-bar)' }}
          />
        </div>
      </section>

      {/* ── Форма добавления ── */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
        <label className="sr-only" htmlFor="new-task">{t('addPlaceholder')}</label>
        <div className="relative flex-1">
          <input
            id="new-task"
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t('addPlaceholder')}
            maxLength={MAX_LENGTH}
            className="w-full px-4 py-3 rounded-xl outline-none font-accent pr-16 transition-colors duration-200"
            style={{
              backgroundColor: 'var(--surface-input)',
              border: '1px solid var(--border)',
              color: 'var(--text-input)',
            }}
          />
          {title.length > 0 && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5"
              style={{ color: 'var(--text-muted)' }}
            >
              <span className="text-xs tabular-nums font-accent">
                {title.length}/{MAX_LENGTH}
              </span>
              <button
                type="button"
                onClick={() => { setTitle(''); inputRef.current?.focus(); }}
                aria-label="Очистить поле"
                className="p-0.5 rounded transition-opacity hover:opacity-80"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="btn-primary inline-flex items-center justify-center gap-2 rounded-xl shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t('add')}
        </button>
      </form>

      {/* ── Список задач ── */}
      {visible.length === 0 ? (
        <div className="rounded-2xl px-6 py-14 text-center backdrop-blur-xl card-surface">
          <p style={{ color: 'var(--text-muted)' }}>{emptyText}</p>
        </div>
      ) : (
        <ul className="space-y-3" aria-label={t('taskList')}>
          {visible.map((todo) => (
            <li
              key={todo.id}
              className="rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl animate-fade-in transition-all duration-200 card-surface"
              style={todo.urgent && !todo.completed ? {
                borderColor: 'var(--urgent-color)',
                backgroundColor: 'var(--urgent-bg)',
              } : undefined}
            >
              {/* Чекбокс */}
              <button
                type="button"
                onClick={() => onToggle(todo.id)}
                aria-label={todo.completed ? t('toggleUndo') : t('toggleDone')}
                aria-pressed={todo.completed}
                className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center transition-all duration-300"
                style={{
                  border: '1px solid var(--border-hover)',
                  backgroundColor: todo.completed ? 'var(--check-bg)' : 'transparent',
                  color: 'var(--text-primary)',
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
                    backgroundColor: 'var(--surface-input)',
                    border: '1px solid var(--border-hover)',
                    color: 'var(--text-input)',
                  }}
                />
              ) : (
                <span
                  className="flex-1 font-accent break-words cursor-pointer select-none"
                  style={{
                    color: todo.completed ? 'var(--text-done)' : 'var(--text-primary)',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                  }}
                  onDoubleClick={() => !todo.completed && startEditing(todo)}
                  title={!todo.completed ? t('editHint') : undefined}
                >
                  {/* Флажок срочно */}
                  {todo.urgent && !todo.completed && (
                    <span
                      className="inline-block text-xs font-accent mr-2 px-1.5 py-0.5 rounded-md align-middle"
                      style={{
                        color: 'var(--urgent-color)',
                        border: '1px solid var(--urgent-color)',
                        opacity: 0.85,
                      }}
                    >
                      {t('urgent')}
                    </span>
                  )}
                  {todo.title}
                </span>
              )}

              {/* Кнопки действий */}
              {editingId !== todo.id && (
                <div className="flex items-center gap-1 shrink-0">
                  {/* Кнопка срочно */}
                  {!todo.completed && (
                    <button
                      type="button"
                      onClick={() => onToggleUrgent(todo.id)}
                      aria-label={todo.urgent ? t('unmarkUrgent') : t('markUrgent')}
                      aria-pressed={todo.urgent}
                      className="btn-icon text-sm leading-none"
                      style={todo.urgent ? { color: 'var(--urgent-color)', borderColor: 'var(--urgent-color)' } : undefined}
                      title={todo.urgent ? t('unmarkUrgent') : t('markUrgent')}
                    >
                      🔴
                    </button>
                  )}
                  {/* Редактировать */}
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
                  {/* Удалить */}
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

      {/* ── Убрать выполненные / Отменить ── */}
      {completedCount > 0 && (
        <div className="flex justify-end items-center gap-3">
          {undoItems ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-accent" style={{ color: 'var(--text-muted)' }}>
                {undoSeconds}s
              </span>
              <button type="button" onClick={handleUndo} className="btn-undo text-sm">
                ↩ {t('undoClear')}
              </button>
            </div>
          ) : (
            <button type="button" onClick={handleClearCompleted} className="btn-danger text-sm">
              {t('clearDone')}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
