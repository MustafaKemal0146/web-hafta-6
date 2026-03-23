#!/bin/bash
echo "🚀 NestKatalog başlatılıyor..."

# PostgreSQL Docker
echo "📦 PostgreSQL başlatılıyor..."
docker start nestkatalog-postgres 2>/dev/null || \
docker run -d --name nestkatalog-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nestkatalog \
  -p 5432:5432 \
  postgres:15-alpine

sleep 2

# Backend
echo "⚙️  NestJS Backend başlatılıyor (port 3000)..."
cd /home/ara/Desktop/davutari/nestkatalog-api
npm run start:dev &

sleep 4

# Frontend
echo "🌐 Next.js Frontend başlatılıyor (port 3001)..."
cd /home/ara/Desktop/davutari/nestkatalog-web
npm run dev &

echo ""
echo "✅ Hazır!"
echo "   Frontend : http://localhost:3001"
echo "   Backend  : http://localhost:3000/api"
echo "   Swagger  : http://localhost:3000/api-docs"
echo ""
echo "Test hesapları:"
echo "   Admin: admin2@test.com / admin123"
echo "   User:  user2@test.com / user123"
