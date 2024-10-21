const express = require('express');
const router = express.Router();
const { executeQuery } = require('../dbUtils');

// Create a new product
router.post('/', async (req, res) => {
  const { Product_ID, Product_Name, Price, Supplier_ID } = req.body;
  try {
    const result = await executeQuery(
      'INSERT INTO Product (Product_ID, Product_Name, Price, Supplier_ID) VALUES (?, ?, ?, ?)',
      [Product_ID, Product_Name, Price, Supplier_ID]
    );
    res.status(201).json({ id: result.insertId, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await executeQuery('SELECT * FROM Product');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Get a single product
router.get('/:id', async (req, res) => {
  try {
    const [product] = await executeQuery('SELECT * FROM Product WHERE Product_ID = ?', [req.params.id]);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  const { Product_Name, Price, Supplier_ID } = req.body;
  try {
    const result = await executeQuery(
      'UPDATE Product SET Product_Name = ?, Price = ?, Supplier_ID = ? WHERE Product_ID = ?',
      [Product_Name, Price, Supplier_ID, req.params.id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const result = await executeQuery('DELETE FROM Product WHERE Product_ID = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

module.exports = router;