# Feedback Backend (Node.js + Express + SQLite + Telegram)

Эндпоинт для сайта:
`POST /api/feedback`

Сохраняет заявку в SQLite и отправляет уведомление в Telegram.

## 1) Что нужно подготовить в Telegram
1. Создай бота через `@BotFather`.
2. Получи токен `TELEGRAM_BOT_TOKEN`.
3. Узнай `TELEGRAM_CHAT_ID` (куда отправлять сообщения):
   - самый простой способ: напиши сообщение боту и открой в браузере:
     `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - найди в ответе `chat.id` и вставь это значение как `TELEGRAM_CHAT_ID`.

## 2) Настрой переменные окружения
Скопируй `.env.example` в `.env` и заполни:
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## 3) Инициализация SQLite (локально)
> Если ты не хочешь запускать локально, этот шаг можно пропустить: при деплое мы автоматически делаем `db:push` перед стартом.

Если хочешь просто локально проверить:
1. Убедись, что есть папка `data/` (она уже создана в шаблоне).
2. `npm run db:push`
3. `npm run dev`

## 4) Проверка endpoint
Пример запроса:
```bash
curl -X POST http://localhost:3000/api/feedback ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Иван\",\"email\":\"ivan@test.com\",\"message\":\"Привет\"}"
```

## 5) Telegram формат “в одном блоке”
Сообщение формируется так:
```
Новая заявка обратной связи
Имя: ...
Почта: ...
Сообщение: ...
```

## 6) Деплой на Railway (SQLite + Volume)
В проект уже добавлен `railway.json`, поэтому отдельную start-команду прописывать не нужно:
Railway запустит `npm run db:push && npm start` автоматически.

1. Создай новый проект на [Railway](https://railway.app).
2. Добавь сервис из этого репозитория/папки (`feedback-backend-telegram`).
3. Добавь **Volume** и примонтируй его в путь `/data`.
4. В `Environment` добавь переменные:
   - `DATABASE_URL="file:/data/dev.db"`
   - `TELEGRAM_BOT_TOKEN="ТВОЙ_TOKEN_ОТ_BOTFATHER"`
   - `TELEGRAM_CHAT_ID="ТВОЙ_CHAT_ID"`
5. Нажми `Deploy`.

Проверка после деплоя:
- `GET /health` должен вернуть `{ "ok": true }`
- `POST /api/feedback` должен сохранить запись в БД и отправить сообщение в Telegram.

Важно:
- Токены не коммитим, храним только в `Railway Environment`.
- Если токен однажды попал в `.env` и был куда-то опубликован, его нужно перевыпустить в `@BotFather`.

## Статика HTML
Этот шаблон отдаёт страницу `public/index.html` на корневом пути `/`.
Форма отправляет запрос на `POST /api/feedback`.

