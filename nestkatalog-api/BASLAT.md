# NestKatalog API - Başlatma Kılavuzu

## Gereksinimler
- Node.js 18+
- Docker (PostgreSQL için)

## 1. PostgreSQL Başlat
```bash
docker start nestkatalog-postgres
# İlk kez çalıştırıyorsan:
# docker run -d --name nestkatalog-postgres -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=nestkatalog -p 5432:5432 postgres:15-alpine
```

## 2. API'yi Başlat
```bash
cd nestkatalog-api
npm run start:dev
```

## 3. Test Et
- API: http://localhost:3000/api
- Swagger: http://localhost:3000/api-docs

## Endpoint Özeti
| Metod | Endpoint | Auth | Açıklama |
|-------|----------|------|----------|
| GET | /api/products | - | Liste + pagination + arama |
| GET | /api/products/:id | - | Tek ürün |
| POST | /api/products | JWT | Ürün oluştur |
| PUT | /api/products/:id | JWT | Güncelle |
| DELETE | /api/products/:id | Admin | Sil |
| POST | /api/products/:id/image | JWT | Görsel yükle |
| POST | /api/auth/register | - | Kayıt ol |
| POST | /api/auth/login | - | Giriş yap |
| GET | /api/auth/me | JWT | Aktif kullanıcı |
| GET | /api/categories | - | Kategoriler |
| POST | /api/categories | Admin | Kategori oluştur |
| GET | /api/categories/:id | - | Kategorideki ürünler |

## Testleri Çalıştır
```bash
npm test
```
