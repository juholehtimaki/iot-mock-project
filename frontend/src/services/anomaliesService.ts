import axios from "axios";
import { AnomalyWithDeviceId } from "../types";

const API_BASE_URL = "http://localhost:4000";

const fetchAnomalies = async () => {
  const alerts = await axios.get(`${API_BASE_URL}/anomalies`);
  return alerts.data as AnomalyWithDeviceId[];
};

const anomaliesService = {
  fetchAnomalies,
};

export default anomaliesService;
