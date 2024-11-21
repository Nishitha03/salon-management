const express = require('express');
const router = express.Router();
const { executeQuery } = require('../dbUtils');

// Create a new employee
router.post('/', async (req, res) => {
  const { Employee_ID, Employee_Name, Role, Phone_Number } = req.body;
  try {
    const result = await executeQuery(
      'INSERT INTO Employee (Employee_ID, Employee_Name, Role, Phone_Number) VALUES (?, ?, ?, ?)',
      [Employee_ID, Employee_Name, Role, Phone_Number]
    );
    res.status(201).json({ id: result.insertId, message: 'Employee created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating employee', error });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await executeQuery('SELECT * FROM Employee');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees', error });
  }
});

// Get a single employee
router.get('/:id', async (req, res) => {
  try {
    const [employee] = await executeQuery('SELECT * FROM Employee WHERE Employee_ID = ?', [req.params.id]);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee', error });
  }
});

// Update an employee
router.put('/:id', async (req, res) => {
  const { Employee_Name, Role, Phone_Number } = req.body;
  try {
    const result = await executeQuery(
      'UPDATE Employee SET Employee_Name = ?, Role = ?, Phone_Number = ? WHERE Employee_ID = ?',
      [Employee_Name, Role, Phone_Number, req.params.id]
    );
    if (result.affectedRows > 0) {
      res.json({ message: 'Employee updated successfully' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating employee', error });
  }
});

// Delete an employee
router.delete('/:id', async (req, res) => {
  try {
    const result = await executeQuery('DELETE FROM Employee WHERE Employee_ID = ?', [req.params.id]);
    if (result.affectedRows > 0) {
      res.json({ message: 'Employee deleted successfully' });
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employee', error });
  }
});

module.exports = router;

