import React from 'react';
import { CheckCircle2, CheckSquare, Circle, ListTodo } from 'lucide-react';
import { useI18n, CopyKey } from '../../i18n';

export type TaskFilter = 'all' | 'active' | 'done';

type SidebarProps = {
  isOpen: boolean;
  currentFilter: TaskFilter;
  counts: Record<TaskFilter, number>;
  onClose: () => void;
  onFilter: (filter: TaskFilter) => void;
};

const items: { id: TaskFilter; label: CopyKey; icon: typeof ListTodo }[] = [
  { id: 'all', label: 'all', icon: ListTodo },
  { id: 'active', label: 'active', icon: Circle },
  { id: 'done', label: 'done', icon: CheckCircle2 },
];

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  currentFilter,
  counts,
  onClose,
  onFilter,
}) => {
  const { t } = useI18n();

  const handleFilter = (filter: TaskFilter) => {
    onFilter(filter);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-80 shadow-lg transform transition-transform duration-300 ease-in-out z-50 backdrop-blur-xl sidebar-surface
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:shadow-none lg:w-64
        `}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg"
              style={{
                background: 'var(--surface)',
                border: '2px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <CheckSquare className="w-7 h-7" style={{ color: 'var(--brand-color)' }} />
            </div>
            <div>
              <h2 className="text-xl font-display leading-tight" style={{ color: 'var(--text-primary)' }}>
                {t('brand')}
              </h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                {t('tagline')}
              </p>
            </div>
          </div>

          <nav className="space-y-2" aria-label={t('taskList')}>
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = currentFilter === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleFilter(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-300"
                  style={{
                    backgroundColor: isActive ? 'var(--active-nav-bg)' : 'transparent',
                    borderRight: isActive
                      ? '3px solid var(--active-nav-border)'
                      : '3px solid transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                >
                  <span className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-accent font-medium">{t(item.label)}</span>
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-accent"
                    style={{
                      backgroundColor: 'var(--pill-bg)',
                      color: 'var(--pill-color)',
                    }}
                  >
                    {counts[item.id]}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
};
