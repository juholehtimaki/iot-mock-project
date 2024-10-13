import { DeviceDataItem, DeviceDataWithTimestamp } from "../types";

type DeviceDataDb = Record<string, DeviceDataWithTimestamp[]>;

const inMemoryDeviceDataDb: DeviceDataDb = {};

const postItem = (deviceDataItem: DeviceDataItem) => {
  const { deviceId, data } = deviceDataItem;
  const timestamp = new Date().toISOString();
  const dataWithTimestamp = { ...data, timestamp };
  inMemoryDeviceDataDb[deviceId] = [
    ...(inMemoryDeviceDataDb[deviceId] ?? []),
    dataWithTimestamp,
  ];
};

const getItems = () => {
  return inMemoryDeviceDataDb;
};

export default { postItem, getItems };
