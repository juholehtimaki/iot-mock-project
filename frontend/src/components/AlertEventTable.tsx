import React, { useEffect, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import anomaliesService from "../services/anomaliesService";
import { AnomalyWithDeviceId } from "../types";

const columns: GridColDef<AnomalyWithDeviceId>[] = [
  { field: "deviceId", headerName: "Device ID", width: 100 },
  { field: "type", headerName: "type", width: 70 },
  { field: "startTime", headerName: "Start time", width: 200 },
  { field: "triggerTime", headerName: "Trigger time", width: 200 },
  { field: "endTime", headerName: "End time", width: 200 },
];

export const AlertEventTable = () => {
  const [rows, setRows] = useState<AnomalyWithDeviceId[]>();

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const alerts = await anomaliesService.fetchAnomalies();
        setRows(alerts);
      } catch (e) {
        console.error(e);
      }
    };
    fetchTableData();
  }, []);

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid rows={rows} columns={columns} sx={{ border: 0 }} />
    </Paper>
  );
};
