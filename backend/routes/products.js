const express = require('express');
const router = express.Router();
const productService = require('../services/product.service');

// Tüm ürünleri getir (filtreli ve sıralı)
router.get('/', async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.query);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Yeni ürün ekle
router.post('/', async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ürün güncelle
router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body);
        res.json(updatedProduct);
    } catch (error) {
        if (error.message === 'Product not found') {
            res.status(404).json({ message: 'Ürün bulunamadı' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// Ürün sil
router.delete('/:id', async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id);
        res.json({ message: 'Ürün silindi' });
    } catch (error) {
        if (error.message === 'Product not found') {
            res.status(404).json({ message: 'Ürün bulunamadı' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

module.exports = router; 