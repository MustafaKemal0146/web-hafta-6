'use client';
import { Suspense } from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import Modal from '@/components/Modal';
import { productsApi, categoriesApi, type Product, type Category } from '@/lib/api';

const EMPTY_FORM = { name: '', price: '', description: '', stock: '0', categoryIds: [] as number[] };

function AdminProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [modal, setModal] = useState<'create' | 'edit' | 'image' | null>(null);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);

  const page = Number(searchParams.get('page') || 1);

  const load = useCallback(() => {
    setLoading(true);
    productsApi.list({ page, limit: 10, search: search || undefined })
      .then(r => { setProducts(r.data); setMeta(r.meta); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { categoriesApi.list().then(setCategories).catch(() => {}); }, []);

  // auto-open edit modal from URL
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && products.length > 0) {
      const p = products.find(x => x.id === Number(editId));
      if (p) openEdit(p);
    }
  }, [products, searchParams]);

  function openCreate() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setError('');
    setModal('create');
  }

  function openEdit(p: Product) {
    setEditTarget(p);
    setForm({
      name: p.name,
      price: String(p.price),
      description: p.description || '',
      stock: String(p.stock),
      categoryIds: p.categories.map(c => c.id),
    });
    setError('');
    setModal('edit');
  }

  function openImage(p: Product) {
    setEditTarget(p);
    setImageFile(null);
    setModal('image');
  }

  function closeModal() {
    setModal(null);
    router.replace('/admin/products');
  }

  function setField(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function toggleCategory(id: number) {
    setForm(f => ({
      ...f,
      categoryIds: f.categoryIds.includes(id)
        ? f.categoryIds.filter(x => x !== id)
        : [...f.categoryIds, id],
    }));
  }

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      const data = {
        name: form.name,
        price: Number(form.price),
        description: form.description || undefined,
        stock: Number(form.stock),
        categoryIds: form.categoryIds,
      };
      if (modal === 'edit' && editTarget) {
        await productsApi.update(editTarget.id, data);
      } else {
        await productsApi.create(data);
      }
      closeModal();
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Ürünü silmek istediğinize emin misiniz?')) return;
    try {
      await productsApi.delete(id);
      load();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleImageUpload() {
    if (!imageFile || !editTarget) return;
    setSaving(true);
    try {
      await productsApi.uploadImage(editTarget.id, imageFile);
      closeModal();
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setSearch(searchInput);
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Ürün Yönetimi</h1>
          <p className="page-subtitle">Toplam {meta.total} ürün</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Yeni Ürün</button>
      </div>

      {/* Arama */}
      <form onSubmit={handleSearch} className="search-bar" style={{ marginBottom: '1.5rem' }}>
        <input className="form-control search-input" placeholder="Ürün ara..." value={searchInput} onChange={e => setSearchInput(e.target.value)} />
        <button type="submit" className="btn btn-primary btn-sm">Ara</button>
        {search && <button type="button" className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setSearchInput(''); }}>× Temizle</button>}
      </form>

      <div className="card">
        <div className="table-wrap">
          {loading ? (
            <div className="loading-center"><span className="spinner" /></div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Ürün</th>
                  <th>Fiyat</th>
                  <th>Stok</th>
                  <th>Kategoriler</th>
                  <th>Görsel</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Ürün bulunamadı</td></tr>
                ) : products.map(p => (
                  <tr key={p.id}>
                    <td style={{ color: 'var(--muted)' }}>#{p.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      {p.description && <div style={{ fontSize: '.75rem', color: 'var(--muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.description}</div>}
                    </td>
                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>₺{p.price.toLocaleString('tr-TR')}</td>
                    <td><span className={`badge ${p.stock > 0 ? 'badge-stock' : 'badge-nostock'}`}>{p.stock}</span></td>
                    <td>{p.categories.map(c => <span key={c.id} className="cat-badge" style={{ marginRight: '.25rem' }}>{c.name}</span>)}</td>
                    <td>
                      {p.imageUrl
                        ? <img src={`http://localhost:3000/${p.imageUrl}`} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} />
                        : <span style={{ color: 'var(--muted)', fontSize: '.8rem' }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '.4rem' }}>
                        <button className="btn btn-outline btn-sm" onClick={() => openEdit(p)}>✏️</button>
                        <button className="btn btn-outline btn-sm" onClick={() => openImage(p)} title="Görsel yükle">🖼</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}>🗑</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => router.push(`/admin/products?page=${page - 1}`)}>‹</button>
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} className={p === page ? 'active' : ''} onClick={() => router.push(`/admin/products?page=${p}`)}>{p}</button>
          ))}
          <button disabled={page >= meta.totalPages} onClick={() => router.push(`/admin/products?page=${page + 1}`)}>›</button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(modal === 'create' || modal === 'edit') && (
        <Modal
          title={modal === 'create' ? 'Yeni Ürün Ekle' : 'Ürünü Düzenle'}
          onClose={closeModal}
          footer={
            <>
              <button className="btn btn-outline" onClick={closeModal}>İptal</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? <span className="spinner" /> : (modal === 'create' ? 'Ekle' : 'Kaydet')}
              </button>
            </>
          }
        >
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Ürün Adı *</label>
            <input className="form-control" value={form.name} onChange={setField('name')} placeholder="iPhone 15 Pro" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Fiyat (₺) *</label>
              <input type="number" className="form-control" value={form.price} onChange={setField('price')} placeholder="49999" min="0" />
            </div>
            <div className="form-group">
              <label className="form-label">Stok</label>
              <input type="number" className="form-control" value={form.stock} onChange={setField('stock')} min="0" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Açıklama</label>
            <textarea className="form-control" value={form.description} onChange={setField('description')} placeholder="Ürün hakkında kısa açıklama..." />
          </div>
          {categories.length > 0 && (
            <div className="form-group">
              <label className="form-label">Kategoriler</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem' }}>
                {categories.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    className={`btn btn-sm ${form.categoryIds.includes(c.id) ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => toggleCategory(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Image Upload Modal */}
      {modal === 'image' && editTarget && (
        <Modal
          title={`Görsel Yükle — ${editTarget.name}`}
          onClose={closeModal}
          footer={
            <>
              <button className="btn btn-outline" onClick={closeModal}>İptal</button>
              <button className="btn btn-primary" onClick={handleImageUpload} disabled={!imageFile || saving}>
                {saving ? <span className="spinner" /> : 'Yükle'}
              </button>
            </>
          }
        >
          {error && <div className="alert alert-error">{error}</div>}
          {editTarget.imageUrl && (
            <img src={`http://localhost:3000/${editTarget.imageUrl}`} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: '1rem', maxHeight: 200, objectFit: 'cover' }} />
          )}
          <div className="form-group">
            <label className="form-label">Görsel Seç (max 5MB)</label>
            <input type="file" className="form-control" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} />
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="loading-center"><span className="spinner" /></div>}>
      <AdminProductsContent />
    </Suspense>
  );
}
