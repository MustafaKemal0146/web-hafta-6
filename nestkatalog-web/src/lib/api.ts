const API_BASE = 'http://localhost:3000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || 'İstek başarısız');
  }
  return json.data ?? json;
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request<{ access_token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email: string, password: string, name: string, role = 'user') =>
    request<{ access_token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    }),
  me: () => request<User>('/auth/me'),
};

// Products
export const productsApi = {
  list: (params?: { page?: number; limit?: number; search?: string; categoryId?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    if (params?.search) q.set('search', params.search);
    if (params?.categoryId) q.set('categoryId', String(params.categoryId));
    return request<{ data: Product[]; meta: Meta }>(`/products?${q}`);
  },
  get: (id: number) => request<Product>(`/products/${id}`),
  create: (data: Partial<Product> & { categoryIds?: number[] }) =>
    request<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Product> & { categoryIds?: number[] }) =>
    request<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) =>
    request<Product>(`/products/${id}`, { method: 'DELETE' }),
  uploadImage: (id: number, file: File) => {
    const token = getToken();
    const form = new FormData();
    form.append('file', file);
    return fetch(`${API_BASE}/products/${id}/image`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    }).then(r => r.json()).then(j => j.data ?? j);
  },
};

// Categories
export const categoriesApi = {
  list: () => request<Category[]>('/categories'),
  get: (id: number) => request<Category & { products: Product[] }>(`/categories/${id}`),
  create: (name: string) =>
    request<Category>('/categories', { method: 'POST', body: JSON.stringify({ name }) }),
};

// Types
export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
  stock: number;
  imageUrl?: string;
  categories: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  _count?: { products: number };
}

export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
