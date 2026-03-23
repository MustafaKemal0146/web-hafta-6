'use client';
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import Modal from '@/components/Modal';
import { categoriesApi, type Category } from '@/lib/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function load() {
    setLoading(true);
    categoriesApi.list().then(setCategories).catch(() => {}).finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  async function handleCreate() {
    if (!name.trim()) return;
    setError('');
    setSaving(true);
    try {
      await categoriesApi.create(name.trim());
      setModal(false);
      setName('');
      setSuccess('Kategori oluşturuldu!');
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <div className="page-header">
        <div>
          <h1 className="page-title">Kategori Yönetimi</h1>
          <p className="page-subtitle">Toplam {categories.length} kategori</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setModal(true); setError(''); setName(''); }}>
          + Yeni Kategori
        </button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}

      {loading ? (
        <div className="loading-center"><span className="spinner" /></div>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Kategori Adı</th>
                  <th>Ürün Sayısı</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan={3} style={{ textAlign: 'center', color: 'var(--muted)', padding: '2rem' }}>Kategori yok</td></tr>
                ) : categories.map(c => (
                  <tr key={c.id}>
                    <td style={{ color: 'var(--muted)' }}>#{c.id}</td>
                    <td style={{ fontWeight: 600 }}>
                      <span style={{ fontSize: '1.1rem', marginRight: '.5rem' }}>🏷</span>
                      {c.name}
                    </td>
                    <td>
                      <span className="badge badge-user">{c._count?.products ?? 0} ürün</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {modal && (
        <Modal
          title="Yeni Kategori"
          onClose={() => setModal(false)}
          footer={
            <>
              <button className="btn btn-outline" onClick={() => setModal(false)}>İptal</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving || !name.trim()}>
                {saving ? <span className="spinner" /> : 'Oluştur'}
              </button>
            </>
          }
        >
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Kategori Adı *</label>
            <input
              className="form-control"
              placeholder="Elektronik"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCreate()}
              autoFocus
            />
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
