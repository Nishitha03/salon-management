const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./dbConfig'); // Assuming dbConfig is set up properly

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Function to safely import routes
function safeImport(routePath) {
  try {
    const router = require(routePath);
    if (typeof router !== 'function') {
      throw new Error(`Module ${routePath} does not export a valid router`);
    }
    return router;
  } catch (error) {
    console.error(`Error importing route ${routePath}:`, error);
    return express.Router(); // Return an empty router if import fails
  }
}

// Routes
const routes = [
  { path: '/api/customers', module: './routes/customerRoutes' },
  { path: '/api/employees', module: './routes/employeeRoutes' },
  { path: '/api/services', module: './routes/serviceRoutes' },
  { path: '/api/suppliers', module: './routes/supplierRoutes' },
  { path: '/api/products', module: './routes/productRoutes' },
  { path: '/api/appointments', module: './routes/appointmentRoutes' },
  { path: '/api/payments', module: './routes/paymentRoutes' }
];

// Register routes
routes.forEach(route => {
  const router = safeImport(route.module);
  console.log(`Route ${route.path} imported:`, !!router); // Log success or failure
  app.use(route.path, router);
});

// Test database connection
db.query('SELECT 1', (err, results) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Database connected successfully');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

