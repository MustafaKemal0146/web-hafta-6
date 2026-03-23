'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { saveAuth } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      saveAuth(res.access_token, res.user);
      router.push(res.user.role === 'admin' ? '/admin' : '/products');
    } catch (err: any) {
      setError(err.message || 'Giriş başarısız');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <h1>🛍 NestKatalog</h1>
          <p>Hesabınıza giriş yapın</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-posta</label>
            <input
              type="email"
              className="form-control"
              placeholder="ornek@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Şifre</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Giriş Yap'}
          </button>
        </form>

        <div className="auth-footer">
          Hesabınız yok mu? <Link href="/register">Kayıt olun</Link>
        </div>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg)', borderRadius: '8px', fontSize: '.8rem', color: 'var(--muted)' }}>
          <strong>Test Hesapları:</strong><br />
          Admin: admin2@test.com / admin123<br />
          Normal: user2@test.com / user123
        </div>
      </div>
    </div>
  );
}
