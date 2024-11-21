const express = require('express');
const router = express.Router();
const { executeQuery } = require('../dbUtils');

// Create a new service
router.post('/', async (req, res) => {
  const { Service_ID, Service_Name, Service_Description, Price } = req.body;
  try {
    const result = await executeQuery(
      'INSERT INTO Service (Service_ID, Service_Name, Service_Description, Price) VALUES (?, ?, ?, ?)',
      [Service_ID, Service_Name, Service_Description, Price]
    );
    res.status(201).json({ id: result.insertId, message: 'Service created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating service', error });
  }
});

// Get all services
router.get('/', async (req, res) => {
  try {
    const services = await executeQuery('SELECT * FROM Service');
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error });
  }
});

// Get a single service
router.get('/:service', async (req, res) => {
  try {
    const [service] = await executeQuery('SELECT Service_ID FROM Service WHERE Service_Name = ?', [req.params.service]);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error });
  }
});

// Update a service
router.put('/:id', async (req, res) => {
  const { Service_Name, Service_Description, Price } = req.body;
  try {
    const result = await executeQuery(
      'UPDATE Service SET Service_Name = ?, Service_Description = ?, Price = ? WHERE Service_ID = ?',
      [Service_Name, Service_Description, Price, req.params.id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Service updated successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating service', error });
  }
});

// Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const result = await executeQuery('DELETE FROM Service WHERE Service_ID = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Service deleted successfully' });
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error });
  }
});

module.exports = router;