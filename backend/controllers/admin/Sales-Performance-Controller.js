const Order = require("../../models/order");

const getSalesStats = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(startOfDay);
    startOfMonth.setDate(1);

    const startOfYear = new Date(startOfMonth);
    startOfYear.setMonth(0);

    const dailySales = await Order.aggregate([
      { $match: { orderStatus: "delivered", orderDate: { $gte: startOfDay } } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
    ]);

    const monthlySales = await Order.aggregate([
      { $match: { orderStatus: "delivered", orderDate: { $gte: startOfMonth } } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
    ]);

    const yearlySales = await Order.aggregate([
      { $match: { orderStatus: "delivered", orderDate: { $gte: startOfYear } } },
      { $group: { _id: null, totalAmount: { $sum: "$totalAmount" }, count: { $sum: 1 } } },
    ]);

    res.json({
      dailySales: dailySales[0] || { totalAmount: 0, count: 0 },
      monthlySales: monthlySales[0] || { totalAmount: 0, count: 0 },
      yearlySales: yearlySales[0] || { totalAmount: 0, count: 0 },
    });
  } catch (error) {
    console.error("Error fetching sales stats:", error);
    res.status(500).send("Internal Server Error");
  }
};

const getSalesGraphData = async (req, res) => {
  try {
    const graphData = await Order.aggregate([
      { $match: { orderStatus: "delivered" } },
      {
        $group: {
          _id: { year: { $year: "$orderDate" }, month: { $month: "$orderDate" } },
          totalAmount: { $sum: "$totalAmount" },
          totalProducts: { $sum: { $sum: "$cartItems.quantity" } },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(graphData);
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { getSalesStats, getSalesGraphData };
