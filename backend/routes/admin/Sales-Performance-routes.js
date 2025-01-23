const express = require("express");
const { getSalesStats, getSalesGraphData } = require("../../controllers/admin/Sales-Performance-Controller");
const router = express.Router();

router.get("/stats", getSalesStats);
router.get("/graph-data", getSalesGraphData);

module.exports = router;
