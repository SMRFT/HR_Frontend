import React, { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function DeviceIdentifier() {
  const [deviceId, setDeviceId] = useState("");

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId); // unique per device/browser
      console.log("Device ID:", result.visitorId);
    };
    getFingerprint();
  }, []);

  return (
    <div>
      <h3>Device ID:</h3>
      <code>{deviceId || "Generating..."}</code>
    </div>
  );
}
