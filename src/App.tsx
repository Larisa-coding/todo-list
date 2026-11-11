import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Sidebar, TaskFilter } from './components/Layout/Sidebar';
import { TodoList } from './components/Tasks/TodoList';
import { useTodos } from './hooks/useTodos';
import { LanguageProvider, useI18n } from './i18n';

const pageTitle: Record<TaskFilter, 'pageAll' | 'pageActive' | 'pageDone'> = {
  all: 'pageAll',
  active: 'pageActive',
  done: 'pageDone',
};

const AppShell: React.FC = () => {
  const { t } = useI18n();
  const {
    todos,
    addTodo,
    toggleTodo,
    toggleUrgent,
    deleteTodo,
    editTodo,
    clearCompleted,
    restoreTodos,
  } = useTodos();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>('all');

  const counts = {
    all: todos.length,
    active: todos.filter((todo) => !todo.completed).length,
    done: todos.filter((todo) => todo.completed).length,
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-gradient)' }}>
      <div className="flex min-h-screen">
        <Sidebar
          isOpen={sidebarOpen}
          currentFilter={filter}
          counts={counts}
          onClose={() => setSidebarOpen(false)}
          onFilter={setFilter}
        />

        <div className="flex-1 min-w-0">
          <Header title={t(pageTitle[filter])} onMenuClick={() => setSidebarOpen(true)} />
          <main className="p-4 sm:p-6">
            <TodoList
              todos={todos}
              filter={filter}
              onAdd={addTodo}
              onToggle={toggleTodo}
              onToggleUrgent={toggleUrgent}
              onDelete={deleteTodo}
              onEdit={editTodo}
              onClearCompleted={clearCompleted}
              onRestoreTodos={restoreTodos}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppShell />
  </LanguageProvider>
);

export default App;
