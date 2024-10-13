import { Anomaly, AnomalyItemRow } from "../types";

type AnomalyDb = AnomalyItemRow[];

let inMemoryAnomalyDataDb: AnomalyDb = [];

const postItem = (deviceId: string, anomaly: Anomaly) => {
  const newAnomaly = { ...anomaly, deviceId };
  inMemoryAnomalyDataDb.push(newAnomaly);
};

const updateItem = (anomalyId: string, anomalyUpdates: Partial<Anomaly>) => {
  const anomalyIndex = inMemoryAnomalyDataDb.findIndex(
    (anomaly) => anomaly.id === anomalyId
  );

  if (anomalyIndex === -1) {
    throw new Error("Couldn't find anomaly during update (404)");
  }

  const existingAnomaly = inMemoryAnomalyDataDb[anomalyIndex];
  const updatedAnomaly = { ...existingAnomaly, ...anomalyUpdates };

  inMemoryAnomalyDataDb[anomalyIndex] = updatedAnomaly;
};

const getItem = (anomalyId: string) => {
  return (
    inMemoryAnomalyDataDb.find((anomaly) => anomaly.id === anomalyId) ?? null
  );
};

const getItems = () => {
  return inMemoryAnomalyDataDb;
};

export default { postItem, getItem, updateItem, getItems };
