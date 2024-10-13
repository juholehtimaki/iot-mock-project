import {
  DeviceDataType,
  ThresholdActivityEntry,
  ThresholdActivityItemRow,
} from "../types";

type ThresholdDb = ThresholdActivityItemRow[];

const inMemoryThresholdDb: ThresholdDb = [];

const postItem = (deviceId: string, threshold: ThresholdActivityEntry) => {
  const newThresholdAcitivty = { ...threshold, deviceId };
  inMemoryThresholdDb.push(newThresholdAcitivty);
};

const getItem = (deviceId: string, type: DeviceDataType) => {
  return (
    inMemoryThresholdDb.find(
      (threshold) => threshold.deviceId === deviceId && threshold.type === type
    ) ?? null
  );
};

const deleteItem = (deviceId: string, type: DeviceDataType) => {
  const index = inMemoryThresholdDb.findIndex(
    (threshold) => threshold.deviceId === deviceId && threshold.type === type
  );

  if (index === -1) {
    throw new Error("Couldn't find threshold activity during deletion (404)");
  }

  inMemoryThresholdDb.splice(index, 1);
};

const getItems = () => {
  return inMemoryThresholdDb;
};

const updateItem = (
  deviceId: string,
  type: DeviceDataType,
  updatedData: Partial<ThresholdActivityEntry>
) => {
  const index = inMemoryThresholdDb.findIndex(
    (threshold) => threshold.deviceId === deviceId && threshold.type === type
  );

  if (index === -1) {
    throw new Error("Couldn't find threshold activity during update (404)");
  }

  inMemoryThresholdDb[index] = {
    ...inMemoryThresholdDb[index],
    ...updatedData,
  };
};

export default { postItem, updateItem, getItem, deleteItem, getItems };
