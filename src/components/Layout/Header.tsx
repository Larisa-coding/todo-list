import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import { useI18n, Lang } from '../../i18n';

type HeaderProps = {
  title: string;
  onMenuClick: () => void;
};

const languages: Lang[] = ['ru', 'en'];

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { lang, setLang, t, theme, toggleTheme } = useI18n();

  return (
    <header
      className="shadow-sm px-4 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl surface-solid"
    >
      <div className="flex items-center space-x-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-all duration-300 lg:hidden btn-icon"
          aria-label={t('menu')}
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-heading truncate" style={{ color: 'var(--brand-color)' }}>
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Переключатель темы */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={t('toggleTheme')}
          className="p-2 rounded-lg transition-all duration-300 btn-icon"
          title={t('toggleTheme')}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4" style={{ color: '#f6c90e' }} />
          ) : (
            <Moon className="w-4 h-4" style={{ color: '#667eea' }} />
          )}
        </button>

        {/* Переключатель языка */}
        <div
          className="flex items-center rounded-lg p-1"
          style={{
            backgroundColor: 'var(--pill-bg)',
            border: '1px solid var(--border)',
          }}
          role="group"
          aria-label="Language"
        >
          {languages.map((code) => {
            const isActive = lang === code;
            return (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={isActive}
                className="px-3 py-1.5 rounded-md text-xs font-accent uppercase tracking-wide transition-all duration-300"
                style={{
                  backgroundColor: isActive ? 'var(--check-bg)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                }}
              >
                {code}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
