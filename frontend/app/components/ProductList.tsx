'use client';

import { useEffect, useState } from 'react';
import ProductModal from './ProductModal';
import { Product, ProductInput } from '../types/product';

interface FilterOptions {
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'name' | 'price' | 'createdAt';
  order?: 'asc' | 'desc';
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  const fetchProducts = async (options: FilterOptions = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (options.minPrice) queryParams.append('minPrice', options.minPrice.toString());
      if (options.maxPrice) queryParams.append('maxPrice', options.maxPrice.toString());
      if (options.inStock !== undefined) queryParams.append('inStock', options.inStock.toString());
      if (options.sort) queryParams.append('sort', options.sort);
      if (options.order) queryParams.append('order', options.order);

      const response = await fetch(`${API_URL}/products?${queryParams}`);
      if (!response.ok) throw new Error('Ürünler yüklenirken bir hata oluştu');
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const handleCreate = () => {
    setSelectedProduct(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`${API_URL}/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Ürün silinirken bir hata oluştu');
      
      // Ürün listesini güncelle
      fetchProducts(filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  const handleSave = async (productData: ProductInput & { _id?: string }) => {
    try {
      if (modalMode === 'edit' && productData._id) {
        const response = await fetch(`${API_URL}/products/${productData._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) throw new Error('Ürün güncellenirken bir hata oluştu');
      } else {
        const response = await fetch(`${API_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(productData),
        });

        if (!response.ok) throw new Error('Ürün eklenirken bir hata oluştu');
      }
      
      // Ürün listesini güncelle
      fetchProducts(filters);
    } catch (err) {
      throw err;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="mb-6 flex flex-col gap-4">
        <div className="w-full">
          <button
            onClick={handleCreate}
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Yeni Ürün Ekle
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <select
            onChange={(e) => {
              const [sort, order] = e.target.value.split('-');
              setFilters(prev => ({ ...prev, sort: sort as 'name' | 'price' | 'createdAt', order: order as 'asc' | 'desc' }));
            }}
            value={`${filters.sort || 'createdAt'}-${filters.order || 'desc'}`}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt-desc">En Yeniler</option>
            <option value="createdAt-asc">En Eskiler</option>
            <option value="name-asc">İsim (A-Z)</option>
            <option value="name-desc">İsim (Z-A)</option>
            <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
            <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
          </select>

          <select
            onChange={(e) => {
              const value = e.target.value;
              setFilters(prev => ({
                ...prev,
                inStock: value === '' ? undefined : value === 'true'
              }));
            }}
            value={filters.inStock === undefined ? '' : filters.inStock.toString()}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tüm Ürünler</option>
            <option value="true">Stoktaki Ürünler</option>
            <option value="false">Tükenmiş Ürünler</option>
          </select>

          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min Fiyat"
              value={filters.minPrice || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                minPrice: e.target.value ? Number(e.target.value) : undefined
              }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              placeholder="Max Fiyat"
              value={filters.maxPrice || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                maxPrice: e.target.value ? Number(e.target.value) : undefined
              }))}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center p-4">Yükleniyor...</div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : (
        <>
          {/* Masaüstü için tablo görünümü */}
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Resim
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ürün Adı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Açıklama
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fiyat
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok Durumu
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.featuredImage}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{product.description}</div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.price.toFixed(2)} TL</div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${
                        product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock} Adet` : 'Stokta Yok'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200 mr-2"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-200"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobil için liste görünümü */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <div key={product._id} className="bg-white p-4 rounded-lg shadow space-y-3">
                <div className="flex justify-center">
                  <img
                    src={product.featuredImage}
                    alt={product.name}
                    className="h-32 w-32 object-cover rounded"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128';
                    }}
                  />
                </div>
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors duration-200"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors duration-200"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-gray-900">
                    {product.price.toFixed(2)} TL
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? `${product.stock} Adet` : 'Stokta Yok'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow">
              Ürün bulunamadı
            </div>
          )}
        </>
      )}

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
        mode={modalMode}
      />
    </div>
  );
} 