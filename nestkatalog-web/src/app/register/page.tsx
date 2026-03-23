'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { saveAuth } from '@/lib/auth';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.register(form.email, form.password, form.name, form.role);
      saveAuth(res.access_token, res.user);
      router.push(res.user.role === 'admin' ? '/admin' : '/products');
    } catch (err: any) {
      setError(err.message || 'Kayıt başarısız');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🛍 NestKatalog</h1>
          <p>Yeni hesap oluşturun</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Ad Soyad</label>
            <input className="form-control" placeholder="Ahmet Yılmaz" value={form.name} onChange={set('name')} required />
          </div>
          <div className="form-group">
            <label className="form-label">E-posta</label>
            <input type="email" className="form-control" placeholder="ornek@email.com" value={form.email} onChange={set('email')} required />
          </div>
          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input type="password" className="form-control" placeholder="En az 6 karakter" value={form.password} onChange={set('password')} minLength={6} required />
          </div>
          <div className="form-group">
            <label className="form-label">Hesap Türü</label>
            <select className="form-control" value={form.role} onChange={set('role')}>
              <option value="user">Kullanıcı</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Kayıt Ol'}
          </button>
        </form>

        <div className="auth-footer">
          Zaten hesabınız var mı? <Link href="/login">Giriş yapın</Link>
        </div>
      </div>
    </div>
  );
}
