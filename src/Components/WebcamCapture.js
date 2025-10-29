import React, { useRef, useCallback, useMemo, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import styled, { createGlobalStyle, keyframes } from "styled-components";

// Global visual baseline
const GlobalStyle = createGlobalStyle`
  :root {
    --bg1: #0f172a;
    --bg2: #1e293b;
    --primary: #6366f1;
    --primary-2: #8b5cf6;
    --accent: #22d3ee;
    --success: #10b981;
    --danger: #ef4444;
    --text: #e5e7eb;
    --muted: #94a3b8;
    --glass: rgba(255,255,255,0.10);
    --border: rgba(255,255,255,0.28);
    --shadow: 0 12px 30px rgba(0,0,0,0.30);
    --radius: 16px;
    --radius-sm: 12px;
    --ring: 0 0 0 3px rgba(99,102,241,0.25);
    --transition: all .2s ease;
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

const Shell = styled.div`
  min-height: 100%;
  display: grid;
  place-items: center;
  padding: 28px 16px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 720px;
  background: linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06));
  border: 1px solid var(--border);
  backdrop-filter: blur(14px) saturate(140%);
  border-radius: 18px;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const Header = styled.header`
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.14);
  background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.18));
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  letter-spacing: .2px;
`;

const Body = styled.div`
  padding: 18px;
  display: grid;
  gap: 14px;
`;

// Initial selection screen
const SelectionScreen = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

const SelectionTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  color: var(--text);
`;

const SelectionSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--muted);
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  max-width: 400px;
`;

const CameraWrap = styled.div`
  position: relative;
  background: var(--glass);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: var(--radius);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  display: grid;
  place-items: center;
`;

const WebcamBox = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  overflow: hidden;
  video, img { width: 100%; height: 100%; object-fit: cover; }
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(520px 360px at 10% 10%, rgba(255,255,255,0.10), transparent 60%),
    linear-gradient(180deg, transparent, rgba(0,0,0,0.12) 85%);
`;

const Controls = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

const Button = styled.button`
  appearance: none;
  border: 1px solid rgba(255,255,255,0.16);
  background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25));
  color: var(--text);
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: .2px;
  cursor: pointer;
  transition: var(--transition);
  flex: 1;
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: .55; cursor: not-allowed; transform: none; }
  &:focus-visible { outline: none; box-shadow: var(--ring); }
`;

const Secondary = styled(Button)`
  background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06));
`;

const InBtn = styled(Button)`
  background: linear-gradient(135deg, rgba(16,185,129,0.28), rgba(45,212,191,0.28));
  border-color: rgba(16,185,129,0.45);
  font-size: 16px;
  padding: 16px 24px;
`;

const OutBtn = styled(Button)`
  background: linear-gradient(135deg, rgba(239,68,68,0.25), rgba(248,113,113,0.28));
  border-color: rgba(239,68,68,0.40);
  font-size: 16px;
  padding: 16px 24px;
`;

const Hint = styled.span`
  font-size: 12px;
  color: var(--muted);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const BackButton = styled(Button)`
  background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06));
  padding: 8px 16px;
  font-size: 14px;
  flex: none;
`;

// Success screen animation
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SuccessScreen = styled.div`
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: ${props => props.$mode === 'IN' 
    ? 'linear-gradient(135deg, rgba(16,185,129,0.28), rgba(45,212,191,0.28))' 
    : 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(248,113,113,0.28))'};
  border: 2px solid ${props => props.$mode === 'IN' 
    ? 'rgba(16,185,129,0.45)' 
    : 'rgba(239,68,68,0.40)'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
`;

const SuccessTitle = styled.h3`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  text-align: center;
  color: var(--text);
`;

const SuccessSubtitle = styled.p`
  margin: 0;
  font-size: 14px;
  color: var(--muted);
  text-align: center;
`;

// Result card styles
const ResultCard = styled.div`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.16);
  display: grid;
  gap: 12px;
`;

const ResultLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: var(--text);
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  
  &:last-child {
    border-bottom: none;
  }
  
  span.key { 
    color: var(--muted); 
    font-weight: 500;
  }
  span.val { 
    font-weight: 600;
    text-align: right;
  }
`;

const ModeIndicator = styled.div`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$mode === 'IN' 
    ? 'linear-gradient(135deg, rgba(16,185,129,0.28), rgba(45,212,191,0.28))' 
    : 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(248,113,113,0.28))'};
  border: 1px solid ${props => props.$mode === 'IN' 
    ? 'rgba(16,185,129,0.45)' 
    : 'rgba(239,68,68,0.40)'};
`;

const CountdownText = styled.p`
  margin: 12px 0 0 0;
  font-size: 13px;
  color: var(--muted);
  text-align: center;
`;

export default function WebcamCapture({ onResult }) {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [result, setResult] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;
  
  const mirrored = facingMode === "user";
  const videoConstraints = useMemo(() => ({
    facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 },
  }), [facingMode]);

  // Auto-redirect countdown after success
  useEffect(() => {
    if (showSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 500);
      return () => clearTimeout(timer);
    } else if (showSuccess && countdown === 0) {
      handleReset();
    }
  }, [showSuccess, countdown]);

  // Handle mode selection (IN or OUT)
  const handleModeSelection = useCallback((mode) => {
    setSelectedMode(mode);
    setShowCamera(true);
    setShowSuccess(false);
  }, []);

  // Reset to initial screen
  const handleReset = useCallback(() => {
    setShowCamera(false);
    setShowSuccess(false);
    setSelectedMode(null);
    setResult(null);
    setCountdown(5);
  }, []);

  const flip = useCallback(() => {
    setFacingMode((m) => (m === "user" ? "environment" : "user"));
  }, []);

  // Capture and send immediately
const captureAndSend = useCallback(async () => {
  const imageSrc = webcamRef.current?.getScreenshot();
  if (!imageSrc) return alert("Failed to capture image");

  setLoading(true);
  try {
    // 🔹 Retrieve token (adjust based on where you store it)
    const token = localStorage.getItem("access_token");

    // 🔹 Make the POST request with Authorization header
    const res = await axios.post(
      `${HRbaseurl}mark/`,
      { image: imageSrc, mode: selectedMode },
      {
        headers: {
          Authorization: `${token}`,  // ✅ Add token
          "Content-Type": "application/json",
        },
      }
    );

    setResult(res.data);
    setShowSuccess(true);
    setShowCamera(false);
    onResult && onResult(res.data);
  } catch (err) {
    console.error(err);
    alert(err?.response?.data?.error || "Attendance marking failed");
  } finally {
    setLoading(false);
  }
}, [selectedMode, onResult]);


  // Format timestamp
  const fmtTimestamp = (iso) => {
    if (!iso) return "-";
    try { 
      return new Date(iso).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'medium'
      }); 
    } catch { 
      return String(iso); 
    }
  };

  return (
    <>
      <GlobalStyle />
      <Shell>
        <Card>
          <Header>
            <Title>Attendance System</Title>
          </Header>

          <Body>
            {!showCamera && !showSuccess ? (
              // Initial Selection Screen
              <SelectionScreen>
                <SelectionTitle>Mark Your Attendance</SelectionTitle>
                <SelectionSubtitle>
                  Please select your attendance type to continue
                </SelectionSubtitle>
                <ButtonGroup>
                  <InBtn onClick={() => handleModeSelection("IN")}>
                    Check IN
                  </InBtn>
                  <OutBtn onClick={() => handleModeSelection("OUT")}>
                    Check OUT
                  </OutBtn>
                </ButtonGroup>
              </SelectionScreen>
            ) : showSuccess ? (
              // Success Screen
              <SuccessScreen>
                <SuccessIcon $mode={result?.mode}>
                  {result?.mode === "IN" ? "✓" : "✓"}
                </SuccessIcon>
                <SuccessTitle>
                  {result?.mode === "IN" ? "Checked In Successfully!" : "Checked Out Successfully!"}
                </SuccessTitle>
                <SuccessSubtitle>
                  Your attendance has been recorded
                </SuccessSubtitle>

                <ResultCard>
                  <ResultLine>
                    <span className="key">Employee ID</span>
                    <span className="val">{result?.employee ?? "-"}</span>
                  </ResultLine>
                  <ResultLine>
                    <span className="key">Name</span>
                    <span className="val">{result?.name ?? "-"}</span>
                  </ResultLine>
                  <ResultLine>
                    <span className="key">Mode</span>
                    <span className="val">
                      <ModeIndicator $mode={result?.mode}>
                        {result?.mode ?? "-"}
                      </ModeIndicator>
                    </span>
                  </ResultLine>
                  <ResultLine>
                    <span className="key">Time</span>
                    <span className="val">{fmtTimestamp(result?.timestamp)}</span>
                  </ResultLine>
                </ResultCard>

                <CountdownText>
                  Redirecting to home in {countdown} seconds...
                </CountdownText>

                <Button onClick={handleReset}>
                  ← Back to Home
                </Button>
              </SuccessScreen>
            ) : (
              // Camera Screen
              <>
                <Row>
                  <BackButton onClick={handleReset}>
                    ← Back
                  </BackButton>
                  <ModeIndicator $mode={selectedMode}>
                    {selectedMode === "IN" ? "Check IN Mode" : "Check OUT Mode"}
                  </ModeIndicator>
                </Row>

                <CameraWrap>
                  <WebcamBox>
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      mirrored={mirrored}
                      screenshotFormat="image/jpeg"
                      screenshotQuality={0.92}
                      videoConstraints={videoConstraints}
                    />
                  </WebcamBox>
                  <Overlay />
                </CameraWrap>

                <Row>
                  <Hint>Position your face in the center</Hint>
                </Row>

                <Controls>
                  <Button onClick={captureAndSend} disabled={loading}>
                    {loading ? "Processing..." : `Capture & Submit`}
                  </Button>
                  {/* <Secondary onClick={flip}>
                    🔄 Flip Camera
                  </Secondary> */}
                </Controls>
              </>
            )}
          </Body>
        </Card>
      </Shell>
    </>
  );
}
