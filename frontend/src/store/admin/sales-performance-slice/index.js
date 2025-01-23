export const fetchSalesStats = async () => {
    const response = await fetch("http://localhost:5000/api/admin/sales/stats");
    return response.json();
};

export const fetchGraphData = async () => {
    const response = await fetch("/api/admin/Sales-Performance/graph-data");
    return response.json();
};
