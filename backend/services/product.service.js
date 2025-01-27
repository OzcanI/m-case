const Product = require('../models/Product');

class ProductService {
  async getAllProducts(filters) {
    try {
      let query = {};
      let sortOption = {};

      // Fiyat filtresi
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) {
          query.price.$gte = Number(filters.minPrice);
        }
        if (filters.maxPrice !== undefined) {
          query.price.$lte = Number(filters.maxPrice);
        }
      }

      // Stok durumu filtresi
      if (filters.inStock !== undefined) {
        query.stock = filters.inStock === 'true' ? { $gt: 0 } : { $lte: 0 };
      }

      // Sıralama seçenekleri
      if (filters.sort) {
        const sortOrder = filters.order === 'desc' ? -1 : 1;
        switch (filters.sort) {
          case 'name':
            sortOption.name = sortOrder;
            break;
          case 'price':
            sortOption.price = sortOrder;
            break;
          case 'createdAt':
            sortOption.createdAt = sortOrder;
            break;
          default:
            sortOption.createdAt = -1;
        }
      } else {
        sortOption.createdAt = -1;
      }

      return await Product.find(query).sort(sortOption);
    } catch (error) {
      throw new Error(`Error getting products: ${error.message}`);
    }
  }

  async createProduct(productData) {
    try {
      const product = new Product(productData);
      return await product.save();
    } catch (error) {
      throw new Error(`Error creating product: ${error.message}`);
    }
  }

  async updateProduct(id, productData) {
    try {
      const product = await Product.findByIdAndUpdate(
        id,
        productData,
        { new: true, runValidators: true }
      );
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    } catch (error) {
      throw new Error(`Error updating product: ${error.message}`);
    }
  }

  async deleteProduct(id) {
    try {
      const product = await Product.findByIdAndDelete(id);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      return product;
    } catch (error) {
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }
}

module.exports = new ProductService(); 