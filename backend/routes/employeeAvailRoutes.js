const express = require('express');
const router = express.Router();
const date = new Date();
const { executeQuery } = require('../dbUtils');

// Fix the date formatting (ensure two digits for month and day)
const dateFull = `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;

router.get('/get/:employee_name', async (req, res) => {
  const employee_name = req.params.employee_name;

  try {
    // Query for availability based on employee name and current date
    const result = await executeQuery(
      'SELECT Date, Availability FROM Employee_Availability WHERE Employee_Name = ?;',
      [employee_name, dateFull]
    );

    // Check if no availability data exists for the given employee on the current date

    // Return the availability from the database
    return res.status(200).json({ Availability: result});
  } catch (error) {
    // Handle any errors that occur during the query
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
