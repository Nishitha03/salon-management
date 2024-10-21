const express = require('express');
const router = express.Router();
const { executeQuery } = require('../dbUtils');

// Create a new supplier
router.post('/', async (req, res) => {
  const { Supplier_ID, Supplier_Name, Phone_Number } = req.body;
  try {
    const result = await executeQuery(
      'INSERT INTO Supplier (Supplier_ID, Supplier_Name, Phone_Number) VALUES (?, ?, ?)',
      [Supplier_ID, Supplier_Name, Phone_Number]
    );
    res.status(201).json({ id: result.insertId, message: 'Supplier created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating supplier', error });
  }
});

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await executeQuery('SELECT * FROM Supplier');
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching suppliers', error });
  }
});

// Get a single supplier
router.get('/:id', async (req, res) => {
  try {
    const [supplier] = await executeQuery('SELECT * FROM Supplier WHERE Supplier_ID = ?', [req.params.id]);
    if (supplier) {
      res.json(supplier);
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching supplier', error });
  }
});

// Update a supplier
router.put('/:id', async (req, res) => {
  const { Supplier_Name, Phone_Number } = req.body;
  try {
    const result = await executeQuery(
      'UPDATE Supplier SET Supplier_Name = ?, Phone_Number = ? WHERE Supplier_ID = ?',
      [Supplier_Name, Phone_Number, req.params.id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Supplier updated successfully' });
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating supplier', error });
  }
});

// Delete a supplier
router.delete('/:id', async (req, res) => {
  try {
    const result = await executeQuery('DELETE FROM Supplier WHERE Supplier_ID = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Supplier deleted successfully' });
    } else {
      res.status(404).json({ message: 'Supplier not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting supplier', error });
  }
});

module.exports = router;