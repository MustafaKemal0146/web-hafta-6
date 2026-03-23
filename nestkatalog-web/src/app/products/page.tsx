'use client';
import { Suspense } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { productsApi, categoriesApi, type Product, type Category, type Meta } from '@/lib/api';

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 12, totalPages: 0 });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page') || 1);
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : undefined;

  const [searchInput, setSearchInput] = useState(search);

  const load = useCallback(() => {
    setLoading(true);
    productsApi.list({ page, limit: 12, search: search || undefined, categoryId })
      .then(r => { setProducts(r.data); setMeta(r.meta); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, categoryId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { categoriesApi.list().then(setCategories).catch(() => {}); }, []);

  function setParam(key: string, value: string | null) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value); else p.delete(key);
    p.set('page', '1');
    router.push(`/products?${p}`);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setParam('search', searchInput || null);
  }

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Ürünler</h1>
            <p className="page-subtitle">{meta.total} ürün listeleniyor</p>
          </div>
        </div>

        {/* Filtreler */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="card-body" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <form onSubmit={handleSearch} className="search-bar" style={{ flex: 1 }}>
              <input
                className="form-control search-input"
                placeholder="Ürün ara..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">Ara</button>
              {search && (
                <button type="button" className="btn btn-outline btn-sm"
                  onClick={() => { setSearchInput(''); setParam('search', null); }}>
                  Temizle ×
                </button>
              )}
            </form>

            <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
              <button
                className={`btn btn-sm ${!categoryId ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setParam('categoryId', null)}>
                Tümü
              </button>
              {categories.map(c => (
                <button
                  key={c.id}
                  className={`btn btn-sm ${categoryId === c.id ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setParam('categoryId', String(c.id))}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-center"><span className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <p>Ürün bulunamadı.</p>
          </div>
        ) : (
          <div className="product-grid">
            {products.map(p => (
              <Link key={p.id} href={`/products/${p.id}`} className="product-card">
                <div className="product-card-img">
                  {p.imageUrl
                    ? <img src={`http://localhost:3000/${p.imageUrl}`} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '📦'}
                </div>
                <div className="product-card-body">
                  <div className="product-name">{p.name}</div>
                  <div className="product-price">₺{p.price.toLocaleString('tr-TR')}</div>
                  <div className="product-stock">
                    <span className={`badge ${p.stock > 0 ? 'badge-stock' : 'badge-nostock'}`}>
                      {p.stock > 0 ? `${p.stock} adet` : 'Stok yok'}
                    </span>
                  </div>
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

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="pagination">
            <button disabled={page <= 1} onClick={() => setParam('page', String(page - 1))}>‹</button>
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={p === page ? 'active' : ''} onClick={() => setParam('page', String(p))}>{p}</button>
            ))}
            <button disabled={page >= meta.totalPages} onClick={() => setParam('page', String(page + 1))}>›</button>
          </div>
        )}
      </div>
    </>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="loading-center"><span className="spinner" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}
