import { useState, useEffect } from "react";
import * as Device from "expo-device";

export function useDeviceId(): string {
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    const id = Device.osInternalBuildId || Device.deviceName || "unknown-device";
    setDeviceId(id);
  }, []);

  return deviceId;
}
