import React, { useEffect, useState } from 'react';
import { getSalesStats, getSalesGraphData } from '../../store/admin/sales-performance-slice';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

const Dashboard = () => {
  const [salesStats, setSalesStats] = useState(null);
  const [graphData, setGraphData] = useState([]);
  const [activePeriod, setActivePeriod] = useState('daily'); // Default to daily

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sales stats (total amount and order count)
        const stats = await getSalesStats();

        // Fetch graph data for the active period
        const graph = await getSalesGraphData({ period: activePeriod });

        setSalesStats(stats);
        setGraphData(graph || []); // Fallback to empty array if graph data is null
      } catch (error) {
        console.error('Error fetching sales data:', error);
      }
    };

    fetchData();
  }, [activePeriod]); // Refetch data when activePeriod changes

  if (!salesStats) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  // Extract the data for the selected period (daily, monthly, yearly)
  const selectedSales = salesStats[`${activePeriod}Sales`] || { totalAmount: 0, count: 0 };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-8">Sales Dashboard</h1>

      {/* Tabs (Daily, Monthly, Yearly) */}
      <div className="flex justify-center my-4 space-x-4">
        {['daily', 'monthly', 'yearly'].map((period) => (
          <button
            key={period}
            onClick={() => setActivePeriod(period)}
            className={`px-4 py-2 rounded ${
              activePeriod === period ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {period.charAt(0).toUpperCase() + period.slice(1)} Sales
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold text-gray-700">{`${activePeriod.charAt(0).toUpperCase() + activePeriod.slice(1)} Sales`}</h3>
          <p className="mt-2 text-2xl text-blue-600">
            ₹{selectedSales.totalAmount} ({selectedSales.count} orders)
          </p>
        </div>
      </div>

      {/* Sales Graph */}
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Sales Trends</h2>
        <LineChart width={600} height={300} data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={(entry) => {
              if (activePeriod === 'daily') return `${entry._id.hour}:00`; // Hourly for daily
              if (activePeriod === 'monthly') return `Day ${entry._id.day}`; // Day for monthly
              return `Month ${entry._id.month}`; // Month for yearly
            }}
            label={{
              value: activePeriod === 'daily' ? 'Hour' : activePeriod === 'monthly' ? 'Day' : 'Month',
              angle: 0,
              position: 'insideBottom',
            }}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" fill="#8884d8" />
          <Line type="monotone" dataKey="totalProducts" stroke="#82ca9d" fill="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
};

export default Dashboard;
