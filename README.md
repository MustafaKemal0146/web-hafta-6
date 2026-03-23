# 🛍 NestKatalog — E-ticaret Ürün Kataloğu

> **Web Tabanlı Programlama — Hafta 6 Lab**
> Profesyonel Full-Stack Mimari: NestJS + Next.js + Prisma + PostgreSQL

> 🤖 Bu proje **[Claude Code](https://claude.ai/claude-code)** (Anthropic) ile birlikte geliştirilmiştir.

---

## 📋 İçindekiler

- [Proje Hakkında](#-proje-hakkında)
- [Teknoloji Yığını](#-teknoloji-yığını)
- [Kurulum](#-kurulum)
- [API Endpoint Haritası](#-api-endpoint-haritası)
- [Frontend Sayfaları](#-frontend-sayfaları)
- [NestJS Özellikleri](#-nestjs-özellikleri-12-adım)
- [Proje Yapısı](#-proje-yapısı)

---

## 🎯 Proje Hakkında

NestJS framework'ünün tüm temel ve orta seviye özelliklerini uygulayarak inşa edilmiş **production-ready** bir e-ticaret ürün kataloğu API'si ve Next.js frontend'i.

---

## 🛠 Teknoloji Yığını

| Katman | Teknoloji | Port |
|--------|-----------|------|
| Frontend | Next.js 14+ | 3001 |
| Backend | NestJS 10+ | 3000 |
| ORM | Prisma 5+ | — |
| Veritabanı | PostgreSQL 15+ | 5432 |

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- Docker

### 1. Repoyu Klonla

```bash
git clone https://github.com/MustafaKemal0146/web-hafta-6.git
cd web-hafta-6
```

### 2. PostgreSQL'i Başlat (Docker)

```bash
docker run -d \
  --name nestkatalog-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nestkatalog \
  -p 5432:5432 \
  postgres:15-alpine
```

### 3. Backend Kurulumu

```bash
cd nestkatalog-api
npm install

# .env dosyasını oluştur
cp .env.example .env
# DATABASE_URL, JWT_SECRET değerlerini doldur

# Prisma migration
npx prisma migrate dev --name init

# Başlat
npm run start:dev
```

### 4. Frontend Kurulumu

```bash
cd nestkatalog-web
npm install
npm run dev
```

### 5. Erişim

| Servis | URL |
|--------|-----|
| Frontend | http://localhost:3001 |
| API | http://localhost:3000/api |
| Swagger | http://localhost:3000/api-docs |

---

## 📡 API Endpoint Haritası

### `/api/products` — Ürün Yönetimi

| Metod | Endpoint | Açıklama | Auth |
|-------|----------|----------|------|
| GET | `/api/products` | Liste + pagination + arama + filtre | — |
| GET | `/api/products/:id` | Tek ürün detayı | — |
| POST | `/api/products` | Ürün oluştur (DTO doğrulama) | JWT |
| PUT | `/api/products/:id` | Ürün güncelle (PartialType) | JWT |
| DELETE | `/api/products/:id` | Ürün sil | Admin |
| POST | `/api/products/:id/image` | Görsel yükle (max 5MB) | JWT |

### `/api/auth` — Kimlik Doğrulama

| Metod | Endpoint | Açıklama | Auth |
|-------|----------|----------|------|
| POST | `/api/auth/register` | Kayıt ol → JWT token | — |
| POST | `/api/auth/login` | Giriş yap → JWT token | — |
| GET | `/api/auth/me` | Aktif kullanıcı bilgisi | JWT |

### `/api/categories` — Kategori Yönetimi

| Metod | Endpoint | Açıklama | Auth |
|-------|----------|----------|------|
| GET | `/api/categories` | Tüm kategoriler | — |
| POST | `/api/categories` | Kategori oluştur | Admin |
| GET | `/api/categories/:id` | Kategorideki ürünler | — |

> 💡 Tüm endpoint'ler **http://localhost:3000/api-docs** adresinden Swagger UI ile interaktif test edilebilir.

---

## 🌐 Frontend Sayfaları

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Ana Sayfa | `/` | Öne çıkan ürünler, kategoriler, istatistikler |
| Ürün Listesi | `/products` | Arama, filtre, pagination |
| Ürün Detay | `/products/:id` | Detaylı ürün görünümü |
| Giriş | `/login` | JWT kimlik doğrulama |
| Kayıt | `/register` | Kullanıcı / Admin kaydı |
| Admin Dashboard | `/admin` | İstatistikler, son ürünler |
| Ürün Yönetimi | `/admin/products` | CRUD + görsel yükleme |
| Kategori Yönetimi | `/admin/categories` | Kategori CRUD |

---

## ✅ NestJS Özellikleri (12 Adım)

| # | Özellik | Açıklama |
|---|---------|----------|
| 1 | Module, Controller, Service | Temel NestJS yapısı, Global Prefix `/api` |
| 2 | PrismaService, Lifecycle Hooks | `OnModuleInit`, `OnModuleDestroy` |
| 3 | DTO + class-validator | `@IsString`, `@Min`, `PartialType`, Global `ValidationPipe` |
| 4 | CRUD + Pagination | `@Query`, `@Param`, `@Body`, pagination + search + category filter |
| 5 | Serialization | `@Exclude` ile password gizleme, `class-transformer` |
| 6 | JWT Auth + Guards | `AuthGuard`, `RoleGuard`, `@CurrentUser` custom decorator |
| 7 | Exception Filter | Standart hata formatı: `{success, statusCode, message, timestamp}` |
| 8 | Interceptors | `LoggingInterceptor` + `TransformInterceptor` |
| 9 | Rate Limiting + Helmet | Throttler (20 req/60s), güvenlik header'ları |
| 10 | File Upload | Multer, `ParseFilePipe`, `MaxFileSizeValidator` (5MB) |
| 11 | Swagger / OpenAPI | `DocumentBuilder`, `@ApiTags`, `@ApiBearerAuth` |
| 12 | Unit Test | `@nestjs/testing`, Jest mock, 6 test |

---

## 📁 Proje Yapısı

```
web-hafta-6/
├── nestkatalog-api/          # NestJS Backend
│   ├── src/
│   │   ├── main.ts           # Bootstrap, Swagger, Helmet, Pipes
│   │   ├── app.module.ts     # Root module, Throttler
│   │   ├── prisma/           # PrismaService (Lifecycle Hooks)
│   │   ├── auth/             # JWT, Guard, Decorator
│   │   ├── products/         # CRUD, Pagination, Upload
│   │   ├── categories/       # Kategori yönetimi
│   │   └── common/
│   │       ├── filters/      # HttpExceptionFilter
│   │       └── interceptors/ # Logging + Transform
│   ├── prisma/
│   │   └── schema.prisma     # User, Product, Category modelleri
│   └── .env.example
│
├── nestkatalog-web/          # Next.js Frontend
│   └── src/app/
│       ├── page.tsx          # Ana sayfa
│       ├── login/            # Giriş
│       ├── register/         # Kayıt
│       ├── products/         # Ürün listesi + detay
│       └── admin/            # Admin paneli
│
└── baslat.sh                 # Tek komutla başlatma scripti
```

---

## 🧪 Testleri Çalıştır

```bash
cd nestkatalog-api
npm test
```

```
PASS src/products/products.service.spec.ts
  ProductsService
    ✓ tanımlanmış olmalı
    ✓ ürünleri sayfalı şekilde döndürmeli
    ✓ tek ürün döndürmeli
    ✓ yeni ürün oluşturmalı
    ✓ ürün güncellemeli
    ✓ ürün silmeli

Tests: 6 passed, 6 total
```

---

## 📚 Kaynaklar

- [NestJS Resmi Dokümantasyon](https://docs.nestjs.com)
- [Next.js Dokümantasyon](https://nextjs.org/docs)
- [Prisma Dokümantasyon](https://www.prisma.io/docs)
- [NestJS + Prisma Rehber](https://www.prisma.io/docs/guides/nestjs)
- [NestJS Swagger Entegrasyonu](https://docs.nestjs.com/openapi/introduction)

---

## 👥 Katkıda Bulunanlar

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/MustafaKemal0146">
        <img src="https://github.com/MustafaKemal0146.png" width="80px" alt="MustafaKemal0146"/><br/>
        <b>Mustafa Kemal</b><br/>
        <sub>Geliştirici</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://claude.ai/claude-code">
        <img src="https://avatars.githubusercontent.com/u/132554157?s=80" width="80px" alt="Claude"/><br/>
        <b>Claude Sonnet 4.6</b><br/>
        <sub>AI Pair Programmer</sub>
      </a>
    </td>
  </tr>
</table>

> 🤖 Projenin tamamı **[Claude Code](https://claude.ai/claude-code)** ile pair programming yapılarak geliştirilmiştir.
> Backend mimarisi, frontend tasarımı, tüm NestJS özellikleri ve testler Claude Sonnet 4.6 tarafından yazılmıştır.
