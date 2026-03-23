'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { productsApi, categoriesApi, type Product, type Category } from '@/lib/api';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stats, setStats] = useState({ total: 0 });

  useEffect(() => {
    productsApi.list({ limit: 6 }).then(r => {
      setFeatured(r.data);
      setStats({ total: r.meta.total });
    }).catch(() => {});
    categoriesApi.list().then(setCategories).catch(() => {});
  }, []);

  return (
    <>
      <Navbar />
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#fff', padding: '4rem 1.5rem', textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>
          🛍 NestKatalog
        </h1>
        <p style={{ fontSize: '1.15rem', opacity: .85, maxWidth: 520, margin: '0 auto 2rem' }}>
          NestJS + Next.js + Prisma ile geliştirilmiş profesyonel e-ticaret ürün kataloğu
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/products" className="btn btn-primary" style={{ background: '#fff', color: '#6366f1', fontWeight: 700 }}>
            Ürünleri Gör →
          </Link>
          <Link href="/register" className="btn btn-outline" style={{ border: '2px solid rgba(255,255,255,.6)', color: '#fff' }}>
            Üye Ol
          </Link>
        </div>
      </section>

      {/* Stats */}
      <div className="container">
        <div className="stats-grid" style={{ marginTop: '2rem' }}>
          <div className="stat-card">
            <div className="stat-label">Toplam Ürün</div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-sub">aktif katalogda</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Kategori</div>
            <div className="stat-value">{categories.length}</div>
            <div className="stat-sub">farklı kategori</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">API Durumu</div>
            <div className="stat-value" style={{ color: 'var(--success)', fontSize: '1.5rem' }}>✓ Aktif</div>
            <div className="stat-sub">localhost:3000</div>
          </div>
        </div>

        {/* Kategoriler */}
        {categories.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Kategoriler</h2>
            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              {categories.map(c => (
                <Link key={c.id} href={`/products?categoryId=${c.id}`}
                  style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '.5rem 1.25rem', borderRadius: '999px', fontWeight: 600, fontSize: '.875rem' }}>
                  {c.name} {c._count && <span style={{ opacity: .7 }}>({c._count.products})</span>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Öne Çıkan Ürünler */}
        <div className="page-header">
          <div>
            <h2 className="page-title">Öne Çıkan Ürünler</h2>
          </div>
          <Link href="/products" className="btn btn-outline btn-sm">Tümünü Gör →</Link>
        </div>

        {featured.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📦</div>
            <p>Henüz ürün yok. <Link href="/admin/products" style={{ color: 'var(--primary)' }}>Admin panelinden ürün ekleyin.</Link></p>
          </div>
        ) : (
          <div className="product-grid">
            {featured.map(p => (
              <Link key={p.id} href={`/products/${p.id}`} className="product-card">
                <div className="product-card-img">
                  {p.imageUrl
                    ? <img src={`http://localhost:3000/${p.imageUrl}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '📦'}
                </div>
                <div className="product-card-body">
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">₺{p.price.toLocaleString('tr-TR')}</div>
                  <div className="product-stock">Stok: {p.stock}</div>
                  {p.categories.length > 0 && (
                    <div className="product-cats">
                      {p.categories.map(c => <span key={c.id} className="cat-badge">{c.name}</span>)}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: '.875rem', marginTop: '3rem' }}>
        NestKatalog — Web Tabanlı Programlama Hafta 6 Lab · NestJS + Next.js + Prisma + PostgreSQL
      </footer>
    </>
  );
}
