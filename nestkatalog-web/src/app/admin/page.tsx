'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { productsApi, categoriesApi } from '@/lib/api';
import { getUser } from '@/lib/auth';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ products: 0, categories: 0, totalPages: 0 });
  const [recent, setRecent] = useState<any[]>([]);
  const user = typeof window !== 'undefined' ? getUser() : null;

  useEffect(() => {
    Promise.all([
      productsApi.list({ limit: 5 }),
      categoriesApi.list(),
    ]).then(([pr, cats]) => {
      setStats({ products: pr.meta.total, categories: cats.length, totalPages: pr.meta.totalPages });
      setRecent(pr.data);
    }).catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Hoş geldiniz, {user?.name} 👋</p>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Toplam Ürün</div>
          <div className="stat-value">{stats.products}</div>
          <div className="stat-sub">katalogda</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Kategori</div>
          <div className="stat-value">{stats.categories}</div>
          <div className="stat-sub">aktif kategori</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Sayfa</div>
          <div className="stat-value">{stats.totalPages}</div>
          <div className="stat-sub">ürün sayfası</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">API Durumu</div>
          <div className="stat-value" style={{ color: 'var(--success)', fontSize: '1.5rem' }}>✓</div>
          <div className="stat-sub">localhost:3000</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Son Eklenen Ürünler</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Ürün Adı</th>
                <th>Fiyat</th>
                <th>Stok</th>
                <th>Kategoriler</th>
                <th>Tarih</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Ürün yok</td></tr>
              ) : recent.map(p => (
                <tr key={p.id}>
                  <td style={{ color: 'var(--muted)' }}>#{p.id}</td>
                  <td style={{ fontWeight: 600 }}>{p.name}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₺{p.price.toLocaleString('tr-TR')}</td>
                  <td><span className={`badge ${p.stock > 0 ? 'badge-stock' : 'badge-nostock'}`}>{p.stock}</span></td>
                  <td>{p.categories.map((c: any) => <span key={c.id} className="cat-badge" style={{ marginRight: '.25rem' }}>{c.name}</span>)}</td>
                  <td style={{ color: 'var(--muted)', fontSize: '.8rem' }}>{new Date(p.createdAt).toLocaleDateString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
