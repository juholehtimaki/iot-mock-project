import {
  ThresholdConfig,
  DeviceProfileItemRow,
  DeviceDataType,
} from "../types";

type DeviceProfileDb = DeviceProfileItemRow[];

const inMemoryDeviceProfileDb: DeviceProfileDb = [];

// Overrides existing profile for the same type and device
const postItem = (deviceId: string, deviceProfile: ThresholdConfig) => {
  // Check if an existing profile for the same deviceId and profile type exists
  const index = inMemoryDeviceProfileDb.findIndex(
    (profile) =>
      profile.deviceId === deviceId && profile.type === deviceProfile.type
  );

  // If found, update the existing profile
  if (index !== -1) {
    inMemoryDeviceProfileDb[index] = {
      ...inMemoryDeviceProfileDb[index],
      ...deviceProfile,
    };
  } else {
    const newProfile: DeviceProfileItemRow = {
      ...deviceProfile,
      deviceId,
    };
    inMemoryDeviceProfileDb.push(newProfile);
  }
};

const getItem = (deviceId: string, profileType: DeviceDataType) => {
  return (
    inMemoryDeviceProfileDb.find(
      (profile) => profile.deviceId === deviceId && profile.type === profileType
    ) ?? null
  );
};

const getItems = () => {
  return inMemoryDeviceProfileDb;
};

export default { postItem, getItem, getItems };
