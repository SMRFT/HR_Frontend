import React, { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import styled, { createGlobalStyle } from "styled-components";
import { Copy, Check } from "lucide-react";

const GlobalStyle = createGlobalStyle`
  :root {
    --bg1: #0f172a;
    --bg2: #1e293b;
    --primary: #6366f1;
    --primary-2: #8b5cf6;
    --accent: #22d3ee;
    --text: #e5e7eb;
    --muted: #94a3b8;
    --glass: rgba(255,255,255,0.10);
    --border: rgba(255,255,255,0.28);
    --shadow: 0 12px 30px rgba(0,0,0,0.30);
    --radius: 16px;
  }
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    background:
      radial-gradient(1200px 800px at -10% -10%, rgba(34,211,238,.25) 0%, transparent 60%),
      radial-gradient(1400px 900px at 110% 10%, rgba(139,92,246,.25) 0%, transparent 55%),
      linear-gradient(180deg, var(--bg1), var(--bg2));
  }
`;

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
      <GlobalStyle />
      <Container>
        <Card>
          <Title>Device Identifier</Title>
          <CodeBox>
            {deviceId || "Generating..."}
          </CodeBox>
          {deviceId && (
            <Button onClick={handleCopy}>
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? "Copied!" : "Copy ID"}
            </Button>
          )}
        </Card>
      </Container>
    </>
  );
}
