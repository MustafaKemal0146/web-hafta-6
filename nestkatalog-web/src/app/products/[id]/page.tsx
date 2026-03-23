'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { productsApi, type Product } from '@/lib/api';
import { getUser, isAdmin } from '@/lib/auth';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productsApi.get(Number(id))
      .then(setProduct)
      .catch(() => setError('Ürün bulunamadı'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await productsApi.delete(Number(id));
      router.push('/products');
    } catch (err: any) {
      alert(err.message);
    }
  }

  if (loading) return <><Navbar /><div className="loading-center"><span className="spinner" /></div></>;
  if (error || !product) return (
    <>
      <Navbar />
      <div className="container">
        <div className="empty-state"><div className="icon">❌</div><p>{error}</p><Link href="/products" className="btn btn-primary" style={{ marginTop: '1rem' }}>Geri Dön</Link></div>
      </div>
    </>
  );

  const user = getUser();

  return (
    <>
      <Navbar />
      <div className="container">
        <div style={{ marginBottom: '1rem' }}>
          <Link href="/products" style={{ color: 'var(--muted)', fontSize: '.875rem' }}>← Ürünlere Dön</Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Görsel */}
          <div style={{ background: 'var(--primary-light)', borderRadius: '12px', minHeight: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '5rem', overflow: 'hidden' }}>
            {product.imageUrl
              ? <img src={`http://localhost:3000/${product.imageUrl}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : '📦'}
          </div>

          {/* Bilgiler */}
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.5rem' }}>{product.name}</h1>

            {product.categories.length > 0 && (
              <div className="product-cats" style={{ marginBottom: '1rem' }}>
                {product.categories.map(c => <span key={c.id} className="cat-badge">{c.name}</span>)}
              </div>
            )}

            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '1rem' }}>
              ₺{product.price.toLocaleString('tr-TR')}
            </div>

            {product.description && (
              <p style={{ color: 'var(--muted)', marginBottom: '1.25rem', lineHeight: 1.7 }}>{product.description}</p>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="card" style={{ flex: 1 }}>
                <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>Stok</div>
                  <div>
                    <span className={`badge ${product.stock > 0 ? 'badge-stock' : 'badge-nostock'}`} style={{ fontSize: '1rem', marginTop: '.25rem' }}>
                      {product.stock > 0 ? `${product.stock} adet` : 'Tükendi'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="card" style={{ flex: 1 }}>
                <div className="card-body" style={{ textAlign: 'center', padding: '1rem' }}>
                  <div style={{ fontSize: '.75rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>ID</div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>#{product.id}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              {user && (
                <Link href={`/admin/products?edit=${product.id}`} className="btn btn-outline">
                  ✏️ Düzenle
                </Link>
              )}
              {isAdmin() && (
                <button className="btn btn-danger" onClick={handleDelete}>
                  🗑 Sil
                </button>
              )}
            </div>

            <div style={{ marginTop: '1.5rem', fontSize: '.8rem', color: 'var(--muted)' }}>
              <div>Oluşturulma: {new Date(product.createdAt).toLocaleDateString('tr-TR')}</div>
              <div>Güncelleme: {new Date(product.updatedAt).toLocaleDateString('tr-TR')}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
