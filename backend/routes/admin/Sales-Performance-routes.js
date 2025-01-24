const express = require("express");
const { getSalesStats, getSalesGraphData } = require("../../controllers/admin/Sales-Performance-Controller");
const router = express.Router();

router.get("/stats", getSalesStats);
router.get("/graph-data", getSalesGraphData);

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { getSalesStats } = require('../controllers/salesController'); // Import the controller function

// // Define the route to fetch sales stats
// router.get('/api/admin/sales/stats', getSalesStats);

// module.exports = router;
