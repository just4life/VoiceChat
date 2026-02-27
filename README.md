# Voice Chat Web App

Упрощённый self-hosted voice chat на Next.js 15 + SQLite + WebRTC/WebSocket.

## Быстрый старт

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run dev
```

Отдельно (опционально) запускается signalling-сервер:

```bash
npx tsx server/ws-server.ts
```

## Реализовано по ТЗ

- Вход по нику и cookie GUID (`/api/auth`)
- Роли USER/MODERATOR/ADMIN
- Комнаты с паролем, вход, кик, смена роли
- Лобби + экран комнаты + базовый чат UI
- Prisma-схема для User/Room/RoomMember/Message
