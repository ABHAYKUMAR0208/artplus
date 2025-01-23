// controllers/shop/Onsale-controller.js
const Onsale = require('../../models/Onsale');

// Controller to get sale products
const getSaleProducts = async (req, res) => {
    try {
      const saleProducts = await Product.find({ salePrice: { $gt: 0 } }); // Fetch products with salePrice > 0
      res.status(200).json({ success: true, data: saleProducts });
    } catch (error) {
      console.error('Error fetching sale products:', error);
      res.status(500).json({ success: false, message: 'Error fetching sale products' });
    }
  };