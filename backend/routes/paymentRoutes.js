const express = require('express');
const router = express.Router();
const { executeQuery } = require('../dbUtils');

// Create a new payment
router.post('/', async (req, res) => {
  const { Payment_ID, Amount, Payment_Type, Appointment_ID } = req.body;
  try {
    const result = await executeQuery(
      'INSERT INTO Payment (Payment_ID, Amount, Payment_Type, Appointment_ID) VALUES (?, ?, ?, ?)',
      [Payment_ID, Amount, Payment_Type, Appointment_ID]
    );
    res.status(201).json({ id: result.insertId, message: 'Payment created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating payment', error });
  }
});

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await executeQuery('SELECT * FROM Payment');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payments', error });
  }
});

// Get a single payment
router.get('/:id', async (req, res) => {
  try {
    const [payment] = await executeQuery('SELECT * FROM Payment WHERE Payment_ID = ?', [req.params.id]);
    if (payment) {
      res.json(payment);
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment', error });
  }
});

// Update a payment
router.put('/:id', async (req, res) => {
  const { Amount, Payment_Type, Appointment_ID } = req.body;
  try {
    const result = await executeQuery(
      'UPDATE Payment SET Amount = ?, Payment_Type = ?, Appointment_ID = ? WHERE Payment_ID = ?',
      [Amount, Payment_Type, Appointment_ID, req.params.id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Payment updated successfully' });
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating payment', error });
  }
});

// Delete a payment
router.delete('/:id', async (req, res) => {
  try {
    const result = await executeQuery('DELETE FROM Payment WHERE Payment_ID = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Payment deleted successfully' });
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting payment', error });
  }
});

module.exports = router;