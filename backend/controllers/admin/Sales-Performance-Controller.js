const Order = require("../../models/order");
const moment = require("moment"); // Ensure moment is installed

// Function to get sales stats (daily, monthly, yearly)
const getSalesStats = async (req, res) => {
  try {
    const startOfDay = moment().startOf("day").toDate();
    const startOfMonth = moment().startOf("month").toDate();
    const startOfYear = moment().startOf("year").toDate();

    // Daily Sales
    const dailySales = await Order.aggregate([
      { $match: { orderStatus: "delivered", orderDate: { $gte: startOfDay } } },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
            day: { $dayOfMonth: "$orderDate" },
            hour: { $hour: "$orderDate" },
          },
          totalAmount: { $sum: "$totalAmount" },
          totalProducts: { $sum: { $sum: "$cartItems.quantity" } },
        },
      },
    ]);

    // Monthly Sales
    const monthlySales = await Order.aggregate([
      { $match: { orderStatus: "delivered", orderDate: { $gte: startOfMonth } } },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
            day: { $dayOfMonth: "$orderDate" },
          },
          totalAmount: { $sum: "$totalAmount" },
          totalProducts: { $sum: { $sum: "$cartItems.quantity" } },
        },
      },
    ]);

    // Yearly Sales
    const yearlySales = await Order.aggregate([
      { $match: { orderStatus: "delivered", orderDate: { $gte: startOfYear } } },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" },
          },
          totalAmount: { $sum: "$totalAmount" },
          totalProducts: { $sum: { $sum: "$cartItems.quantity" } },
        },
      },
    ]);

    res.json({
      dailySales,
      monthlySales,
      yearlySales,
    });
  } catch (error) {
    console.error("Error fetching sales stats:", error);
    res.status(500).json({ message: "Error fetching sales data" });
  }
};

// Function to get sales graph data based on the period (daily, monthly, yearly)
const getSalesGraphData = async (req, res) => {
  try {
    const period = req.query.period; // 'daily', 'monthly', 'yearly'
    const now = new Date();
    let graphData = [];

    if (period === "daily") {
      const startOfDay = moment().startOf("day").toDate();
      const endOfDay = moment().endOf("day").toDate();

      graphData = await Order.aggregate([
        { $match: { orderStatus: "delivered", orderDate: { $gte: startOfDay, $lt: endOfDay } } },
        {
          $group: {
            _id: { hour: { $hour: "$orderDate" } },
            totalAmount: { $sum: "$totalAmount" },
            totalProducts: { $sum: { $sum: "$cartItems.quantity" } },
          },
        },
        { $sort: { "_id.hour": 1 } },
      ]);
    } else if (period === "monthly") {
      const startOfMonth = moment().startOf("month").toDate();
      const endOfMonth = moment().endOf("month").toDate();

      graphData = await Order.aggregate([
        { $match: { orderStatus: "delivered", orderDate: { $gte: startOfMonth, $lt: endOfMonth } } },
        {
          $group: {
            _id: { day: { $dayOfMonth: "$orderDate" } },
            totalAmount: { $sum: "$totalAmount" },
            totalProducts: { $sum: { $sum: "$cartItems.quantity" } },
          },
        },
        { $sort: { "_id.day": 1 } },
      ]);
    } else if (period === "yearly") {
      const startOfYear = moment().startOf("year").toDate();
      const endOfYear = moment().endOf("year").toDate();

      graphData = await Order.aggregate([
        { $match: { orderStatus: "delivered", orderDate: { $gte: startOfYear, $lt: endOfYear } } },
        {
          $group: {
            _id: { month: { $month: "$orderDate" } },
            totalAmount: { $sum: "$totalAmount" },
            totalProducts: { $sum: { $sum: "$cartItems.quantity" } },
          },
        },
        { $sort: { "_id.month": 1 } },
      ]);
    }

    res.json(graphData);
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({ message: "Error fetching graph data" });
  }
};

module.exports = { getSalesStats, getSalesGraphData };
