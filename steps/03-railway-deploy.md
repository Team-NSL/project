## Этап 3. Деплой на Railway (SQLite сохраняется через Volume)

### 1) Создай проект
1. Зайди в Railway и создайте новый проект
2. Подключи репозиторий или загрузить папку проекта

### 2) Volume для SQLite
1. Добавь `Volume`
2. Выставь Mount path: `/data`
3. Будет создан persistent диск, где лежит `dev.db`

### 3) Настрой переменные окружения
В Railway -> Environment добавь:
- `DATABASE_URL="file:/data/dev.db"`
- `TELEGRAM_BOT_TOKEN="ТВОЙ_TOKEN_ОТ_BOTFATHER"`
- `TELEGRAM_CHAT_ID="ID_ЧАТА_КОМАНДЫ"`

> Для вашего чата можно поставить `TELEGRAM_CHAT_ID="-5101328798"`.
> Токены в репозиторий не коммитим: хранить нужно только в Railway Environment.

### 4) Команда старта (чтобы с первого раза работало)
В Start command используй:
```bash
npm run db:push && npm start
```

Это создаст таблицы в SQLite и запустит сервер.

### 5) Проверка
Открой:
- `/health` (должно вернуть `{"ok":true}`)
- корень `/` (отдаст твой `public/index.html`)

И для Telegram-части:
- отправь форму (или сделай `POST /api/feedback` с валидным JSON)
- проверь, что новое сообщение прилетело в Telegram-чат команды

