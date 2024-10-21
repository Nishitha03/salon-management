const express = require('express');
const router = express.Router();
const { executeQuery } = require('../dbUtils');

// Create a new customer
router.post('/', async (req, res) => {
  const { Customer_ID, First_Name, Last_Name, Phone_Number, Email } = req.body;
  try {
    const result = await executeQuery(
      'INSERT INTO Customer (Customer_ID, First_Name, Last_Name, Phone_Number, Email) VALUES (?, ?, ?, ?, ?)',
      [Customer_ID, First_Name, Last_Name, Phone_Number, Email]
    );
    res.status(201).json({ id: result.insertId, message: 'Customer created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating customer', error });
  }
});

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await executeQuery('SELECT * FROM Customer');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers', error });
  }
});

// Get a single customer
router.get('/:id', async (req, res) => {
  try {
    const [customer] = await executeQuery('SELECT * FROM Customer WHERE Customer_ID = ?', [req.params.id]);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer', error });
  }
});

// Update a customer
router.put('/:id', async (req, res) => {
  const { First_Name, Last_Name, Phone_Number, Email } = req.body;
  try {
    const result = await executeQuery(
      'UPDATE Customer SET First_Name = ?, Last_Name = ?, Phone_Number = ?, Email = ? WHERE Customer_ID = ?',
      [First_Name, Last_Name, Phone_Number, Email, req.params.id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Customer updated successfully' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating customer', error });
  }
});


// Delete a customer
router.delete('/:id', async (req, res) => {
  try {
    const result = await executeQuery('DELETE FROM Customer WHERE Customer_ID = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Customer deleted successfully' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting customer', error });
  }
});


module.exports = router;