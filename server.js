const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stockOpnameRoutes = require('./routes/stockOpname');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/stock-opname', stockOpnameRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});