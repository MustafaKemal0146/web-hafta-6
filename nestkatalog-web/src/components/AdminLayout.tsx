'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Navbar from './Navbar';
import { getUser } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const user = getUser();
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/products'); }
  }, [router]);

  return (
    <>
      <Navbar />
      <div className="admin-layout">
        <aside className="sidebar">
          <div className="sidebar-title">Yönetim</div>
          <Link href="/admin" className={`sidebar-link ${path === '/admin' ? 'active' : ''}`}>📊 Dashboard</Link>
          <Link href="/admin/products" className={`sidebar-link ${path.startsWith('/admin/products') ? 'active' : ''}`}>📦 Ürünler</Link>
          <Link href="/admin/categories" className={`sidebar-link ${path.startsWith('/admin/categories') ? 'active' : ''}`}>🏷 Kategoriler</Link>
          <div className="sidebar-title" style={{ marginTop: '1.5rem' }}>Site</div>
          <Link href="/products" className="sidebar-link">🛍 Mağaza →</Link>
        </aside>
        <main className="admin-content">{children}</main>
      </div>
    </>
  );
}
