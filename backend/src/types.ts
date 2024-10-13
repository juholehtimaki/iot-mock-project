// What other data types should we support
export type DeviceDataType = "load" | "latency";

type DeviceData = {
  type: DeviceDataType;
  value: number;
};

export type DeviceDataItem = {
  deviceId: string;
  data: DeviceData;
};

export type DeviceDataWithTimestamp = DeviceData & { timestamp: string };

export type Thresholds = {
  upper: number;
  lower: number;
};

export type ThresholdConfig = {
  type: string;
  thresholds: Thresholds;
  window: number;
};

export type ThresholdActivityEntry = ThresholdConfig & {
  startTime: string;
  anomalyId?: string;
};

export type ThresholdActivityItemRow = ThresholdActivityEntry & {
  deviceId: string;
};

export type DeviceProfile = {
  deviceId: ThresholdConfig[];
};

export type DeviceProfileItemRow = ThresholdConfig & { deviceId: string };

export type Anomaly = {
  id: string;
  startTime: string;
  triggerTime: string;
  endTime?: string;
  type: DeviceDataType;
};

export type AnomalyItemRow = Anomaly & { deviceId: string };
