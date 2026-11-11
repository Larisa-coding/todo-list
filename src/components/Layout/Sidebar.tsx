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
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-80 shadow-lg transform transition-transform duration-300 ease-in-out z-50 backdrop-blur-xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:shadow-none lg:w-64
        `}
        style={{
          background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.95), rgba(35, 39, 41, 0.95))',
          borderRight: '1px solid rgba(120, 120, 120, 0.3)',
        }}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.9), rgba(35, 39, 41, 0.9))',
                border: '2px solid rgba(120, 120, 120, 0.4)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
            >
              <CheckSquare className="w-7 h-7" style={{ color: '#d0d0d0' }} />
            </div>
            <div>
              <h2 className="text-xl font-display leading-tight" style={{ color: '#c0c0c0' }}>
                {t('brand')}
              </h2>
              <p className="text-xs mt-1" style={{ color: '#8d8d8d' }}>
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
                    backgroundColor: isActive ? 'rgba(80, 80, 80, 0.3)' : 'transparent',
                    borderRight: isActive ? '3px solid #c0c0c0' : '3px solid transparent',
                    color: isActive ? '#d0d0d0' : '#b0b0b0',
                  }}
                >
                  <span className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-accent font-medium">{t(item.label)}</span>
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'rgba(20, 22, 24, 0.45)',
                      color: '#c0c0c0',
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
