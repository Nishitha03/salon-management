const express = require('express');
const router = express.Router();
const { executeQuery } = require('../dbUtils');

// Create a new appointment
router.post('/', async (req, res) => {
  const { Appointment_ID, Appointment_Date, Customer_ID, Employee_ID, Service_ID, Product_Used, Price } = req.body;
  try {
    const result = await executeQuery(
      'INSERT INTO Appointment (Appointment_ID, Appointment_Date, Customer_ID, Employee_ID, Service_ID, Product_Used, Price) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [Appointment_ID, Appointment_Date, Customer_ID, Employee_ID, Service_ID, Product_Used, Price]
    );
    res.status(201).json({ id: result.insertId, message: 'Appointment created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating appointment', error });
  }
});

// Get all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await executeQuery('SELECT * FROM Appointment');
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error });
  }
});

// Get a single appointment
router.get('/:id', async (req, res) => {
  try {
    const [appointment] = await executeQuery('SELECT * FROM Appointment WHERE Appointment_ID = ?', [req.params.id]);
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointment', error });
  }
});

// Update an appointment
router.put('/:id', async (req, res) => {
  const { Appointment_Date, Customer_ID, Employee_ID, Service_ID, Product_Used, Price } = req.body;
  try {
    const result = await executeQuery(
      'UPDATE Appointment SET Appointment_Date = ?, Customer_ID = ?, Employee_ID = ?, Service_ID = ?, Product_Used = ?, Price = ? WHERE Appointment_ID = ?',
      [Appointment_Date, Customer_ID, Employee_ID, Service_ID, Product_Used, Price, req.params.id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Appointment updated successfully' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const result = await executeQuery('DELETE FROM Appointment WHERE Appointment_ID = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Appointment deleted successfully' });
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appointment', error });
  }
});

module.exports = router;

