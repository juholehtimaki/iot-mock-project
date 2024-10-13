// What other data types should we support
export type DeviceDataType = "load";

export type Anomaly = {
  id: string;
  startTime: string;
  triggerTime: string;
  endTime?: string;
  type: DeviceDataType;
};

export type AnomalyWithDeviceId = Anomaly & { deviceId: string };
