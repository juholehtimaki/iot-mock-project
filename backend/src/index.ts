import express from "express";
import cors from "cors";
import { uid } from "uid";
import deviceDataDb from "./db/deviceDataDb";
import {
  ThresholdConfig,
  DeviceDataItem,
  DeviceDataType,
  Thresholds,
} from "./types";
import { SinWaveGenerator } from "./utils/SinWaveGenerator";
import deviceProfileDb from "./db/deviceProfileDb";
import thresholdDb from "./db/thresholdDb";
import anomalyDb from "./db/anomalyDb";
import { isWithinThreshold } from "./utils/utils";

const app = express();
const port = process.env.PORT ?? 4000;
app.use(cors());

const onIncomingDeviceData = (dataEvent: DeviceDataItem) => {
  const { deviceId } = dataEvent;
  const { type, value } = dataEvent.data;

  // Post reading to deviceDb (not needed for the requirements)
  deviceDataDb.postItem(dataEvent);

  // Get the profile for the specific device and type
  const profileForTheType = deviceProfileDb.getItem(deviceId, type);
  if (!profileForTheType) return;

  // Get the ongoing threshold activity
  const thresholdActivity = thresholdDb.getItem(deviceId, type);
  const currentTime = new Date();

  // Check if the value is within the defined thresholds
  if (isWithinThreshold(value, profileForTheType.thresholds)) {
    // Value is within bounds, reset if there was any out-of-bounds activity
    if (thresholdActivity && thresholdActivity.anomalyId) {
      anomalyDb.updateItem(thresholdActivity.anomalyId, {
        endTime: currentTime.toISOString(),
      });

      // Clear the threshold activity after updating the anomaly
      thresholdDb.deleteItem(deviceId, type);
    }
    return;
  }

  // Value is out of bounds
  // No existing threshold activity
  if (!thresholdActivity) {
    // Start tracking the out-of-bounds state
    const startTime = currentTime.toISOString();
    thresholdDb.postItem(deviceId, {
      ...profileForTheType,
      startTime,
    });
  } else {
    // Check how long the value has been out of bounds
    const startTime = new Date(thresholdActivity.startTime);
    const elapsedSeconds = (currentTime.getTime() - startTime.getTime()) / 1000;

    // If the value has been out of bounds longer than the window, trigger an anomaly
    if (elapsedSeconds > profileForTheType.window) {
      if (!thresholdActivity.anomalyId) {
        // Create a new anomaly since the window has passed
        const anomalyId = uid();
        anomalyDb.postItem(deviceId, {
          id: anomalyId,
          startTime: startTime.toISOString(),
          triggerTime: currentTime.toISOString(),
          type,
        });

        // Store the anomaly ID in the threshold activity
        thresholdDb.updateItem(deviceId, type, {
          anomalyId,
        });
      }
    }
  }
};

const outputEvents = () => {
  const anomalies = anomalyDb.getItems();

  if (anomalies.length === 0) return;

  const counts = anomalies.reduce((acc, anomaly) => {
    const { deviceId } = anomaly;
    acc[deviceId] = (acc[deviceId] || 0) + 1;
    return acc;
  }, {} as { [deviceId: string]: number });

  // Convert counts to array and sort in descending order
  const sortedCounts = Object.entries(counts).sort(
    ([, countA], [, countB]) => countB - countA
  );

  // Format the output according to assignment
  const outputs = sortedCounts.map(
    ([deviceId, count]) => `${deviceId},${count}`
  );

  for (const output of outputs) {
    console.log(output);
  }
  console.log("\n");
};

app.listen(port, () => {
  // Initialize mock profiles
  mockDevices.forEach((device) => {
    const { window, thresholds } = device.config;
    const { type } = device;
    const profileConfig: ThresholdConfig = {
      type,
      window,
      thresholds,
    };
    deviceProfileDb.postItem(device.deviceId, profileConfig);
  });
  console.log(`Server is running on http://localhost:${port}`);
});

const mockDevices = [
  {
    deviceId: "abc",
    type: "load",
    config: {
      window: 10,
      thresholds: {
        upper: 50,
        lower: 20,
      },
    },
    mockValues: new SinWaveGenerator(0.05, 100),
  },
  {
    deviceId: "abc",
    type: "latency",
    config: {
      window: 10,
      thresholds: {
        upper: 50,
        lower: 20,
      },
    },
    mockValues: new SinWaveGenerator(0.02, 75),
  },
  {
    deviceId: "def",
    type: "load",
    config: {
      window: 10,
      thresholds: {
        upper: 100,
        lower: 50,
      },
    },
    mockValues: new SinWaveGenerator(0.02, 80),
  },
];

// Send mock data being send every 1 seconnd
setInterval(() => {
  mockDevices.forEach((device) => {
    const mockData: DeviceDataItem = {
      deviceId: device.deviceId,
      data: {
        type: device.type as DeviceDataType,
        value: device.mockValues.getValue(),
      },
    };
    onIncomingDeviceData(mockData);
    outputEvents();
  });
}, 1000);

app.get("/anomalies", (_req, res) => {
  res.send(anomalyDb.getItems());
});

app.get("/profiles", (_req, res) => {
  res.send(deviceProfileDb.getItems());
});

app.post("/profiles", (req, res) => {
  // Probably validate the body with e.g. Zod
  const { deviceId, type, thresholds, window } = req.body.deviceId;
  const newProfile: ThresholdConfig = {
    type,
    thresholds,
    window,
  };

  deviceProfileDb.postItem(deviceId, newProfile);

  // Remove existing activity & end anomaly
  const thresholdActivity = thresholdDb.getItem(deviceId, type);
  if (thresholdActivity?.anomalyId) {
    const ongoingAnomaly = anomalyDb.getItem(thresholdActivity.anomalyId);
    if (ongoingAnomaly) {
      anomalyDb.updateItem(ongoingAnomaly.id, {
        endTime: new Date().toISOString(),
      });
    }
  }
  thresholdDb.deleteItem(deviceId, type);
});
