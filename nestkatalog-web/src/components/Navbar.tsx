'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getUser, logout } from '@/lib/auth';
import type { User } from '@/lib/api';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => { setUser(getUser()); }, [path]);

  function handleLogout() {
    logout();
    setUser(null);
    router.push('/login');
  }

  return (
    <nav className="navbar">
      <Link href="/" className="navbar-brand">🛍 NestKatalog</Link>
      <div className="navbar-links">
        <Link href="/products" className={`nav-link ${path.startsWith('/products') ? 'active' : ''}`}>Ürünler</Link>
        {user ? (
          <>
            {user.role === 'admin' && (
              <Link href="/admin" className={`nav-link ${path.startsWith('/admin') ? 'active' : ''}`}>
                Yönetim <span className="nav-badge">Admin</span>
              </Link>
            )}
            <span style={{ fontSize: '.85rem', color: 'var(--muted)' }}>👤 {user.name}</span>
            <button className="btn btn-outline btn-sm" onClick={handleLogout}>Çıkış</button>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-outline btn-sm">Giriş</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}
