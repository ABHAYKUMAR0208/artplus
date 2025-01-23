// import { useEffect, useState } from "react";
// import { Bar } from "react-chartjs-2";
// import { fetchSalesStats as fetchSalesStatsFromAPI, fetchGraphData as fetchGraphDataFromAPI } from "../../store/admin/sales-performance-slice";
// import { data } from "@/config/chartconfig";

import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

const AdminSalesPerformance = () => {
  const [stats, setStats] = useState({});
  const [graphData, setGraphData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchSalesStats(), fetchGraphData()])
      .then(([statsData, graphData]) => {
        setStats(statsData);
        setGraphData(graphData);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading data:", err);
        setError(`Failed to load data: ${err.message || "Unknown error"}`);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const graphLabels = graphData.map(data => `${data._id.month}-${data._id.year}`);
  const totalAmount = graphData.map(data => data.totalAmount);
  const totalProducts = graphData.map(data => data.totalProducts);

  const barData = {
    labels: graphLabels,
    datasets: [
      {
        label: "Total Revenue",
        data: totalAmount,
        backgroundColor: "rgba(75,192,192,0.6)",
      },
      {
        label: "Total Products Sold",
        data: totalProducts,
        backgroundColor: "rgba(153,102,255,0.6)",
      },
    ],
  };

  return (
    <div>
      <div className="font-bold text-2xl">Sales Performance</div>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Stats</h2>
        <p>Daily Sales: ₹{stats.dailySales?.totalAmount || 0} (Count: {stats.dailySales?.count || 0})</p>
        <p>Monthly Sales: ₹{stats.monthlySales?.totalAmount || 0} (Count: {stats.monthlySales?.count || 0})</p>
        <p>Yearly Sales: ₹{stats.yearlySales?.totalAmount || 0} (Count: {stats.yearlySales?.count || 0})</p>
      </div>
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Sales Graph</h2>
        <Bar
          data={barData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Sales Performance Overview",
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

const fetchSalesStats = async () => {
  const response = await fetch("/api/sales-performance/stats");
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

const fetchGraphData = async () => {
  const response = await fetch("/api/sales-performance/graph-data");
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

export default AdminSalesPerformance;
