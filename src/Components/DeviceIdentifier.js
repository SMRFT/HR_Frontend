import React, { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import styled from "styled-components";
import { Copy, Check } from "lucide-react";

const Container = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 20px;
`;

const Card = styled.div`
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h3`
  margin: 0 0 20px 0;
  font-size: 1.5rem;
  font-weight: 700;
`;

const CodeBox = styled.div`
  background: rgba(0,0,0,0.3);
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.1);
  font-family: monospace;
  font-size: 1.1rem;
  color: var(--accent);
  margin-bottom: 20px;
  word-break: break-all;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Button = styled.button`
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export default function DeviceIdentifier() {
  const [deviceId, setDeviceId] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setDeviceId(result.visitorId);
    };
    getFingerprint();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(deviceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Container>
        <Card>
          <Title>Device Identifier</Title>
          <CodeBox>
            {deviceId || "Generating..."}
          </CodeBox>
          {deviceId && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
              <Button onClick={handleCopy}>
                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy ID"}
              </Button>
              
              <Button 
                onClick={async () => {
                  try {
                    const label = prompt("Enter a label for this device (e.g. Kiosk 1):", "Kiosk");
                    if (!label) return;
                    
                    const response = await fetch(`${process.env.REACT_APP_BACKEND_HR_BASE_URL}allowed-devices/`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'X-User-Role': 'Admin' // Assuming the person using this is an admin or we bypass for this specific action
                      },
                      body: JSON.stringify({
                        label: label,
                        fingerprint: deviceId,
                        requester_role: 'Admin'
                      })
                    });
                    
                    const data = await response.json();
                    if (response.ok) {
                      alert("Device Registered Successfully!");
                    } else {
                      alert("Error: " + (data.error || "Failed to register"));
                    }
                  } catch (err) {
                    alert("Failed to connect to server");
                  }
                }}
                style={{ background: 'var(--accent)', color: '#000' }}
              >
                Register this Device
              </Button>
            </div>
          )}
        </Card>
      </Container>
    </>
  );
}
