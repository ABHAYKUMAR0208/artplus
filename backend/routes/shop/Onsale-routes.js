const express = require('express');
const { getSaleProducts } = require('../../controllers/shop/Onsale-controller');

const router = express.Router();

// Define route for fetching sale products
router.get('/', getSaleProducts);

module.exports = router;
