import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type Lang = 'ru' | 'en';

const LANG_KEY = 'task-list-lang';
export const THEME_KEY = 'task-list-theme';
export type Theme = 'dark' | 'light';

const STRINGS = {
  ru: {
    brand: 'Список задач',
    tagline: 'Короткий список, который остаётся на месте',
    all: 'Все',
    active: 'Активные',
    done: 'Выполненные',
    pageAll: 'Мои задачи',
    pageActive: 'Активные',
    pageDone: 'Выполненные',
    addPlaceholder: 'Что нужно сделать?',
    add: 'Добавить',
    emptyAll: 'Пока пусто. Добавьте первую задачу.',
    emptyActive: 'Активных задач нет.',
    emptyDone: 'Выполненных задач пока нет.',
    delete: 'Удалить задачу',
    edit: 'Редактировать задачу',
    editHint: 'Двойной клик для редактирования',
    toggleDone: 'Отметить выполненной',
    toggleUndo: 'Вернуть в активные',
    left: 'осталось',
    clearDone: 'Убрать выполненные',
    undoClear: 'Отменить',
    menu: 'Открыть меню',
    progress: 'Прогресс',
    taskList: 'Список задач',
    urgent: 'Срочно',
    markUrgent: 'Пометить как срочное',
    unmarkUrgent: 'Снять пометку срочно',
    toggleTheme: 'Сменить тему',
  },
  en: {
    brand: 'Task list',
    tagline: 'A short list that stays put',
    all: 'All',
    active: 'Active',
    done: 'Done',
    pageAll: 'My tasks',
    pageActive: 'Active',
    pageDone: 'Completed',
    addPlaceholder: 'What needs to be done?',
    add: 'Add',
    emptyAll: 'Nothing here yet. Add the first task.',
    emptyActive: 'No active tasks.',
    emptyDone: 'No completed tasks yet.',
    delete: 'Delete task',
    edit: 'Edit task',
    editHint: 'Double-click to edit',
    toggleDone: 'Mark as done',
    toggleUndo: 'Mark as active',
    left: 'left',
    clearDone: 'Clear completed',
    undoClear: 'Undo',
    menu: 'Open menu',
    progress: 'Progress',
    taskList: 'Task list',
    urgent: 'Urgent',
    markUrgent: 'Mark as urgent',
    unmarkUrgent: 'Remove urgent mark',
    toggleTheme: 'Toggle theme',
  },
} as const;

export type CopyKey = keyof typeof STRINGS.ru;

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: CopyKey) => string;
  theme: Theme;
  toggleTheme: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const readLang = (): Lang => {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === 'en' ? 'en' : 'ru';
  } catch {
    return 'ru';
  }
};

const readTheme = (): Theme => {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(readLang);
  const [theme, setThemeState] = useState<Theme>(readTheme);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try { localStorage.setItem(LANG_KEY, next); } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch {}
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = STRINGS[lang].brand;
  }, [lang]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const value = useMemo<LanguageContextValue>(
    () => ({ lang, setLang, t: (key) => STRINGS[lang][key], theme, toggleTheme }),
    [lang, setLang, theme, toggleTheme]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useI18n must be used within LanguageProvider');
  return context;
};
