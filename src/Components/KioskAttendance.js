import React, { useRef, useCallback, useMemo, useState, useEffect } from "react";
import Webcam from "react-webcam";
import axios from "axios";
import styled, { createGlobalStyle, keyframes } from "styled-components";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

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
  html, body, #root { height: 100%; margin: 0; overflow: hidden; }
  body {
    color: var(--text);
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    background:
      radial-gradient(1200px 800px at -10% -10%, rgba(34,211,238,.25) 0%, transparent 60%),
      radial-gradient(1400px 900px at 110% 10%, rgba(139,92,246,.25) 0%, transparent 55%),
      linear-gradient(180deg, var(--bg1), var(--bg2));
  }
`;

// Responsive layout - NO SCROLL
const Shell = styled.div`
  height: 100vh;
  width: 100vw;
  display: grid;
  place-items: center;
  padding: 2vh 2vw;
  background: transparent;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1vh 1vw;
  }
`;

const Card = styled.div`
  width: 100%;
  max-width: 680px;
  max-height: 96vh;
  background: linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.06));
  border: 1px solid var(--border);
  backdrop-filter: blur(14px) saturate(140%);
  border-radius: 18px;
  box-shadow: var(--shadow);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  @media (max-width: 900px) {
    max-width: 96vw;
    max-height: 98vh;
    border-radius: 11px;
  }
  @media (max-width: 600px) {
    max-width: 98vw;
    border-radius: 8px;
  }
`;

const Header = styled.header`
  padding: 14px 18px;
  border-bottom: 1px solid rgba(255,255,255,0.14);
  background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(34,211,238,0.18));
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoutButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: var(--text);
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: var(--danger);
  }
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(1rem, 2vw, 1.25rem);
  letter-spacing: .2px;
`;

const Body = styled.div`
  padding: clamp(8px, 2vh, 18px) clamp(10px, 2vw, 20px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar { width: 6px; }
  &::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); }
  &::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
`;

const SelectionScreen = styled.div`
  padding: 6vh 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  justify-content: center;
  min-height: 100%;
`;

const SelectionTitle = styled.h3`
  margin: 0;
  font-size: clamp(1.2rem, 2.5vw, 1.5rem);
  font-weight: 600;
  text-align: center;
  color: var(--text);
`;

const SelectionSubtitle = styled.p`
  margin: 0;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  color: var(--muted);
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 14px;
  width: 100%;
  max-width: 380px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const CameraWrap = styled.div`
  position: relative;
  background: var(--glass);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: var(--radius);
  overflow: hidden;
  aspect-ratio: 4 / 3;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;

  @media (max-width: 900px) {
    max-width: 92vw;
  }
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
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  border: 1px solid rgba(255,255,255,0.16);
  background: linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25));
  color: var(--text);
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 600;
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  min-width: 100px;
  cursor: pointer;
  transition: var(--transition);
  flex: 1;
  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: .55; cursor: not-allowed; transform: none; }
  &:focus-visible { outline: none; box-shadow: var(--ring); }
`;

const InBtn = styled(Button)`
  background: linear-gradient(135deg, rgba(16,185,129,0.28), rgba(45,212,191,0.28));
  border-color: rgba(16,185,129,0.45);
  padding: 14px 20px;
`;

const OutBtn = styled(Button)`
  background: linear-gradient(135deg, rgba(239,68,68,0.25), rgba(248,113,113,0.28));
  border-color: rgba(239,68,68,0.40);
  padding: 14px 20px;
`;

const Hint = styled.span`
  font-size: 11px;
  color: var(--muted);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const BackButton = styled(Button)`
  background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06));
  padding: 7px 12px;
  font-size: 13px;
  flex: none;
  min-width: auto;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const SuccessScreen = styled.div`
  padding: 3vh 2vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  animation: ${fadeIn} 0.5s ease-out;
  max-height: 100%;
  overflow-y: auto;
`;

const SuccessIcon = styled.div`
  width: clamp(60px, 10vw, 70px);
  height: clamp(60px, 10vw, 70px);
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
  font-size: clamp(28px, 5vw, 36px);
  flex-shrink: 0;
`;

const SuccessTitle = styled.h3`
  margin: 0;
  font-size: clamp(1.1rem, 2.2vw, 1.3rem);
  font-weight: 700;
  text-align: center;
  color: var(--text);
`;

const SuccessSubtitle = styled.p`
  margin: 0;
  font-size: clamp(0.85rem, 1.6vw, 0.95rem);
  color: var(--muted);
  text-align: center;
`;

const CapturedImageWrap = styled.div`
  width: 100%;
  max-width: 240px;
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid ${props => props.$mode === 'IN'
    ? 'rgba(16,185,129,0.45)'
    : 'rgba(239,68,68,0.40)'};
  box-shadow: 0 6px 18px rgba(0,0,0,0.25);
  flex-shrink: 0;

  @media (max-width: 600px) {
    max-width: 82vw;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
  }
`;

const ResultCard = styled.div`
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.16);
  display: grid;
  gap: 8px;
  max-width: 360px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    max-width: 92vw;
    padding: 10px;
  }
`;

const ResultLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: clamp(12px, 1.8vw, 13px);
  color: var(--text);
  padding: 6px 0;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  
  &:last-child { border-bottom: none; }
  
  span.key { 
    color: var(--muted); 
    font-weight: 500; 
    flex-shrink: 0;
  }
  span.val { 
    font-weight: 600;
    text-align: right;
    word-break: break-word;
  }
`;

const ModeIndicator = styled.div`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.$mode === 'IN'
    ? 'linear-gradient(135deg, rgba(16,185,129,0.28), rgba(45,212,191,0.28))'
    : 'linear-gradient(135deg, rgba(239,68,68,0.25), rgba(248,113,113,0.28))'};
  border: 1px solid ${props => props.$mode === 'IN'
    ? 'rgba(16,185,129,0.45)'
    : 'rgba(239,68,68,0.40)'};
`;

const CountdownText = styled.p`
  margin: 8px 0 0 0;
  font-size: clamp(11px, 1.6vw, 12px);
  color: var(--muted);
  text-align: center;
`;

const TopLeftLogout = styled.button`
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 50;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--text);
  width: 40px;
  height: 40px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  transition: var(--transition);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.4);
    color: var(--danger);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
  }
`;

export default function WebcamCapture({ onResult }) {
  const webcamRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState("user");
  const [result, setResult] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(2);
  const [capturedImage, setCapturedImage] = useState(null);
  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;
  const navigate = useNavigate();

  const [isAutoCapture, setIsAutoCapture] = useState(true);
  const isProcessing = useRef(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);

  const playSuccessSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();

      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.start(startTime);
        osc.stop(startTime + duration);
      };

      const now = ctx.currentTime;
      // Play a single pleasant "ding"
      playTone(880, now, 0.6);
    } catch (err) {
      console.warn("Audio playback failed", err);
    }
  }, []);

  const mirrored = facingMode === "user";
  const videoConstraints = useMemo(() => ({
    facingMode,
    width: { ideal: 1280 },
    height: { ideal: 720 },
  }), [facingMode]);

  useEffect(() => {
    if (showSuccess && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (showSuccess && countdown === 0) {
      handleReset();
    }
  }, [showSuccess, countdown]);

  // Auto-capture interval
  useEffect(() => {
    let interval;
    if (showCamera && isAutoCapture && !loading && !showSuccess) {
      interval = setInterval(() => {
        captureAndSend(true);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [showCamera, isAutoCapture, loading, showSuccess]);

  const handleModeSelection = useCallback((mode) => {
    setSelectedMode(mode);
    setShowCamera(true);
    setShowSuccess(false);
  }, []);

  const handleReset = useCallback(() => {
    setShowCamera(false);
    setShowSuccess(false);
    setSelectedMode(null);
    setResult(null);
    setResult(null);
    setCapturedImage(null);
    setCountdown(2);
    setFeedbackMessage(null);
  }, []);

  const captureAndSend = useCallback(async (isAuto = false) => {
    if (isProcessing.current) return;

    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) {
      if (!isAuto) toast.error("Failed to capture image", { autoClose: 2000 });
      return;
    }

    isProcessing.current = true;
    if (!isAuto) setLoading(true);
    setFeedbackMessage(null); // Clear previous messages

    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `${HRbaseurl}mark/`,
        { image: imageSrc, mode: selectedMode },
        {
          headers: {
            Authorization: `${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setResult(res.data);
      setShowSuccess(true);

      // Play success sound
      playSuccessSound();

      setShowCamera(false);

      // Success toast
      toast.success(
        `${selectedMode === "IN" ? "Checked In" : "Checked Out"} Successfully!`,
        { position: "top-center", autoClose: 2000 }
      );

      onResult && onResult(res.data);
    } catch (err) {
      console.error(err);

      const errorMsg = err?.response?.data?.error || "Attendance marking failed";

      // Determine if we should show this error
      // Show Spoofing and User Not Found even in auto mode
      const isSpoof = errorMsg.includes("Spoofing");
      const isNotFound = errorMsg.includes("User Not Found");
      const shouldShow = !isAuto || isSpoof || isNotFound;

      if (shouldShow) {
        // Show on-camera feedback
        setFeedbackMessage({ text: errorMsg, type: 'error' });

        // TOAST LOGIC:
        // 1. Spoofing: Critical, showing it separately so it isn't overwritten by "User Not Found"
        if (isSpoof) {
          toast.error(errorMsg, {
            position: "top-center",
            autoClose: 4000,
            toastId: 'spoofing-alert' // Unique ID for spoofing
          });
        }
        // 2. User Not Found / Other Auto errors: Throttled using a fixed ID
        else {
          toast.error(errorMsg, {
            position: "top-center",
            autoClose: 2000,
            toastId: 'auto-status-toast' // Constant ID prevents stacking
          });
        }
      }

      setCapturedImage(null);
    } finally {
      setLoading(false);
      isProcessing.current = false;
      // Clear feedback after 2s if it's an error
      if (feedbackMessage?.type === 'error') {
        setTimeout(() => setFeedbackMessage(null), 2000);
      }
    }
  }, [selectedMode, onResult, HRbaseurl, playSuccessSound]);

  const fmtTimestamp = (iso) => {
    if (!iso) return "-";
    try {
      return new Date(iso).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });
    } catch {
      return String(iso);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <>
      <GlobalStyle />
      <ToastContainer />
      <TopLeftLogout onClick={handleLogout} title="Exit / Admin Login">
        <LogOut size={18} />
      </TopLeftLogout>
      <Shell>
        <Card>
          <Header style={{ justifyContent: 'center' }}>
            <Title>Attendance System</Title>
          </Header>
          <Body>
            {!showCamera && !showSuccess ? (
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
              <SuccessScreen>
                <SuccessIcon $mode={result?.mode}>
                  ✓
                </SuccessIcon>
                <SuccessTitle>
                  {result?.mode === "IN" ? "Checked In Successfully!" : "Checked Out Successfully!"}
                </SuccessTitle>
                <SuccessSubtitle>
                  Your attendance has been recorded
                </SuccessSubtitle>

                {capturedImage && (
                  <CapturedImageWrap $mode={result?.mode}>
                    <img src={capturedImage} alt="Captured attendance" />
                  </CapturedImageWrap>
                )}

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
                  Redirecting in {countdown}s...
                </CountdownText>

                <Button onClick={handleReset}>
                  ← Back to Home
                </Button>
              </SuccessScreen>
            ) : (
              <>
                <Row>
                  <BackButton onClick={handleReset}>
                    ← Back
                  </BackButton>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <ModeIndicator $mode={selectedMode}>
                      {selectedMode === "IN" ? "Check IN" : "Check OUT"}
                    </ModeIndicator>
                    <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={isAutoCapture}
                        onChange={(e) => setIsAutoCapture(e.target.checked)}
                      />
                      Auto
                    </label>
                  </div>
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
                      style={{ width: "100%", height: "100%" }}
                    />
                  </WebcamBox>
                  <Overlay />
                  {/* Status Overlay */}
                  {feedbackMessage && (
                    <div style={{
                      position: 'absolute',
                      bottom: '50%',
                      left: '50%',
                      transform: 'translate(-50%, 50%)',
                      background: feedbackMessage.type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                      color: 'white',
                      padding: '12px 24px',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      textAlign: 'center',
                      backdropFilter: 'blur(4px)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                      zIndex: 10,
                      maxWidth: '80%'
                    }}>
                      {feedbackMessage.text}
                    </div>
                  )}

                  {isAutoCapture && !loading && !feedbackMessage && (
                    <div style={{
                      position: 'absolute',
                      bottom: '10px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <div className="pulse-dot" style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#22d3ee',
                        boxShadow: '0 0 8px #22d3ee'
                      }} />
                      Scanning...
                    </div>
                  )}
                </CameraWrap>
                <Row>
                  <Hint>Position your face in the center</Hint>
                </Row>

                <Controls>
                  <Button onClick={() => captureAndSend(false)} disabled={loading}>
                    {loading ? "Processing..." : `Capture & Submit`}
                  </Button>
                </Controls>
              </>
            )}
          </Body>
        </Card>
      </Shell>
    </>
  );
}
