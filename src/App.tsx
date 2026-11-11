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
  const { todos, addTodo, toggleTodo, deleteTodo, editTodo, clearCompleted } = useTodos();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<TaskFilter>('all');

  const counts = {
    all: todos.length,
    active: todos.filter((todo) => !todo.completed).length,
    done: todos.filter((todo) => todo.completed).length,
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(to bottom right, #1a1d1f, #292d2f, #1f2224)' }}
    >
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
              onDelete={deleteTodo}
              onEdit={editTodo}
              onClearCompleted={clearCompleted}
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
