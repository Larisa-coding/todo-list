# Список задач / Task List

Минималистичный To-Do лист с тёмным glassmorphism-дизайном и поддержкой двух языков.

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?logo=typescript&logoColor=white&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)

---

## Функционал

| Функция | Описание |
|---|---|
| ✅ Добавление задач | Поле ввода + кнопка «Добавить» или Enter |
| ✅ Отметка выполненных | Клик по кружку слева от задачи |
| ✅ Удаление задач | Кнопка корзины у каждой задачи |
| ✅ Редактирование | Двойной клик по тексту или кнопка карандаша |
| ✅ Пометка «Срочно» | Кнопка 🔴 — срочные поднимаются вверх списка |
| ✅ Фильтрация | Все / Активные / Выполненные |
| ✅ Прогресс-бар | Соотношение выполненных к общему числу |
| ✅ Очистка выполненных | Кнопка с отменой действия (5 секунд) |
| ✅ Тёмная / светлая тема | Переключатель ☀️ / 🌙 в шапке |
| ✅ Смена языка | RU / EN, оба языка полностью переведены |
| ✅ Сохранение данных | Задачи, язык и тема хранятся в `localStorage` |

---

## Стек

- **React 18** + **TypeScript** — основа приложения
- **Tailwind CSS v3** — стилизация через утилиты
- **Lucide React** — иконки
- **localStorage** — хранение задач, языка и темы без бэкенда
- **Create React App** — сборка и dev-сервер

---

## Запуск локально

```bash
# 1. Установить зависимости
npm install

# 2. Запустить dev-сервер
npm start
```

Приложение откроется на [http://localhost:3000](http://localhost:3000)

```bash
# Production-сборка
npm run build
```

---

## Структура проекта

```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx      # Шапка: заголовок, тема, язык
│   │   └── Sidebar.tsx     # Боковое меню с фильтрами
│   └── Tasks/
│       └── TodoList.tsx    # Список задач, форма добавления
├── hooks/
│   └── useTodos.ts         # Вся логика задач + localStorage
├── i18n.tsx                # Тексты RU/EN, тема, контекст
├── App.tsx                 # Корневой компонент
└── index.css               # CSS-переменные для тем, компоненты
```
