import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/admin/sales';

export const getSalesStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/stats`);
  return response.data;
};

export const getSalesGraphData = async () => {
  const response = await axios.get(`${API_BASE_URL}/graph-data`);
  return response.data;
};
