# Voice Chat Web App

Упрощённый self-hosted voice chat на Next.js 15 + SQLite (Prisma) + WebRTC/WebSocket.

## Локальная разработка

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Опционально signalling-сервер можно запускать отдельно:

```bash
npm run ws:start
```

## Продакшен-деплой на Ubuntu VPS (Docker)

### 1) Подготовить сервер

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker $USER
```

Перелогиньтесь после `usermod`.

### 2) Подготовить переменные окружения

```bash
cp .env.production.example .env.production
```

Минимум, что нужно заполнить:

- `DATABASE_URL` (по умолчанию указывает на persistent volume `/app/data/voicechat.db`)
- `ADMIN_GUIDS`
- `NEXT_PUBLIC_WS_URL` (например, `wss://voice.example.com/ws` при reverse proxy)

### 3) Собрать и запустить контейнеры

```bash
docker compose --env-file .env.production up -d --build
```

Сервисы:

- `app` — Next.js (порт `3000`)
- `ws` — WebSocket signalling (порт `3001`)

SQLite хранится в volume `sqlite_data` и переживает перезапуск контейнеров.

### 4) Проверка состояния

```bash
docker compose ps
docker compose logs -f app
docker compose logs -f ws
```

### 5) Обновление приложения

```bash
git pull
docker compose --env-file .env.production up -d --build
```

## Рекомендации для продакшена

- Держите `3000` и `3001` закрытыми извне и публикуйте приложение через Nginx/Caddy с TLS.
- Проксируйте `/ws` на контейнер `ws:3001` с поддержкой Upgrade-заголовков WebSocket.
- Настройте бэкапы Docker volume `sqlite_data`.
- Для нескольких инстансов приложения SQLite не подходит — используйте PostgreSQL.

## Что реализовано

- Вход по нику и cookie GUID (`/api/auth`)
- Роли USER/MODERATOR/ADMIN
- Комнаты с паролем, вход, кик, смена роли
- Лобби + экран комнаты + базовый чат UI
- Prisma-схема для User/Room/RoomMember/Message
