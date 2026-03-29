# Feedback Backend (Node.js + Express + PostgreSQL + Telegram)

Эндпоинт для сайта:
`POST /api/feedback`

Сохраняет заявку в PostgreSQL и отправляет уведомление в Telegram.

## 1) Что нужно подготовить в Telegram
1. Создай бота через `@BotFather`.
2. Получи токен `TELEGRAM_BOT_TOKEN`.
3. Узнай `TELEGRAM_CHAT_ID` (куда отправлять сообщения):
   - самый простой способ: напиши сообщение боту и открой в браузере:
     `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - найди в ответе `chat.id` и вставь это значение как `TELEGRAM_CHAT_ID`.

## 2) Настрой переменных окружения

### Для Render
В Render dashboard добавь environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `TELEGRAM_BOT_TOKEN` - Токен от @BotFather
- `TELEGRAM_CHAT_ID` - ID чата для уведомлений

### Для локальной разработки
Скопируй `.env.example` в `.env` и заполни:
- `DATABASE_URL` - PostgreSQL connection string
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

## 3) Деплой на Render

1. Подключи GitHub репозиторий к Render
2. Добавь environment variables выше
3. Render автоматически запустит:
   - `npm install`
   - `prisma generate`
   - `npm start`

Health check: `/health`

## 4) Проверка endpoint
Пример запроса:
```bash
curl -X POST http://localhost:3000/api/feedback ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Иван\",\"email\":\"ivan@test.com\",\"message\":\"Привет\"}"
```

## 5) Telegram формат "в одном блоке"
Сообщение формируется так:
```
Новая заявка обратной связи
Имя: ...
Почта: ...
Сообщение: ...
```

## 6) API Endpoints
- `GET /` - История обращений (HTML)
- `GET /form` - Форма обратной связи
- `POST /api/feedback` - Создать новое обращение
- `GET /health` - Health check для Render

## 7) База данных
Использует PostgreSQL с Prisma ORM. Схема создается автоматически при первом запуске.

Важно:
- Токены не коммитим, храним только в Environment Variables.
- Если токен однажды попал в `.env` и был куда-то опубликован, его нужно перевыпустить в `@BotFather`.

