interface ValidationError {
  field: string;
  message: string;
}

export interface ProductFormData {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  featuredImage?: string;
}

export const validateProduct = (data: ProductFormData, isCreateMode: boolean): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name?.trim()) {
    errors.push({
      field: 'name',
      message: 'Ürün adı zorunludur'
    });
  }

  // Description validation
  if (!data.description?.trim()) {
    errors.push({
      field: 'description',
      message: 'Ürün açıklaması zorunludur'
    });
  }

  // Price validation
  if (data.price === undefined || data.price <= 0) {
    errors.push({
      field: 'price',
      message: 'Geçerli bir fiyat giriniz'
    });
  } else if (!Number.isInteger(data.price * 100)) {
    errors.push({
      field: 'price',
      message: 'Fiyat en fazla 2 ondalık basamak içerebilir'
    });
  }

  // Stock validation
  if (data.stock === undefined || data.stock < 0) {
    errors.push({
      field: 'stock',
      message: 'Geçerli bir stok miktarı giriniz'
    });
  }

  // Image validation
  if (!data.featuredImage && isCreateMode) {
    errors.push({
      field: 'featuredImage',
      message: 'Ürün resmi zorunludur'
    });
  } else if (data.featuredImage && data.featuredImage.length > 13 * 1024 * 1024) {
    errors.push({
      field: 'featuredImage',
      message: 'Resim boyutu çok büyük (max 10MB)'
    });
  }

  return errors;
}; 