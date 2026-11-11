import React from 'react';
import { Menu } from 'lucide-react';
import { useI18n, Lang } from '../../i18n';

type HeaderProps = {
  title: string;
  onMenuClick: () => void;
};

const languages: Lang[] = ['ru', 'en'];

export const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const { lang, setLang, t } = useI18n();

  return (
    <header
      className="shadow-sm border-b px-4 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl"
      style={{
        background: 'linear-gradient(135deg, rgba(41, 45, 47, 0.95), rgba(35, 39, 41, 0.95))',
        borderColor: 'rgba(120, 120, 120, 0.3)',
      }}
    >
      <div className="flex items-center space-x-3 min-w-0">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-all duration-300 lg:hidden"
          style={{
            backgroundColor: 'rgba(80, 80, 80, 0.2)',
            border: '1px solid rgba(120, 120, 120, 0.3)',
          }}
          aria-label={t('menu')}
        >
          <Menu className="w-5 h-5" style={{ color: '#c0c0c0' }} />
        </button>
        <h1 className="text-xl font-heading truncate" style={{ color: '#c0c0c0' }}>
          {title}
        </h1>
      </div>

      <div
        className="flex items-center rounded-lg p-1"
        style={{
          backgroundColor: 'rgba(20, 22, 24, 0.45)',
          border: '1px solid rgba(120, 120, 120, 0.3)',
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
                backgroundColor: isActive ? 'rgba(192, 192, 192, 0.18)' : 'transparent',
                color: isActive ? '#f0f0f0' : '#9a9a9a',
              }}
            >
              {code}
            </button>
          );
        })}
      </div>
    </header>
  );
};
