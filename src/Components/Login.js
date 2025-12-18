import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled, { keyframes, createGlobalStyle } from "styled-components";
import "@fontsource/poppins";
import { FaEye, FaEyeSlash, FaFingerprint } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import FingerprintJS from "@fingerprintjs/fingerprintjs";



// Global palette + responsive background (one-time injection)
// Global palette + responsive background
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
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    background:
      radial-gradient(1200px 800px at -10% -10%, rgba(34,211,238,.25) 0%, transparent 60%),
      radial-gradient(1400px 900px at 110% 10%, rgba(139,92,246,.25) 0%, transparent 55%),
      linear-gradient(180deg, var(--bg1), var(--bg2));
    color: var(--text);
  }
`;

// Subtle entrance
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// Page shell centers the card, relies on GlobalStyle for background
const Page = styled.div`
  min-height: 100%;
  width: 100%;
  display: grid;
  place-items: center;
  padding: clamp(16px, 3vw, 32px);
`;

// Glass card using your palette
const Card = styled.div`
  width: min(92vw, 460px);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: clamp(18px, 3.5vw, 28px);
  animation: ${fadeIn} 0.35s ease both;
`;

// Typography
const Title = styled.h1`
  margin: 0 0 6px 0;
  font-size: clamp(20px, 2.4vw, 26px);
  font-weight: 700;
  color: var(--text);
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 0 0 18px 0;
  text-align: center;
  color: var(--muted);
  font-size: clamp(13px, 1.8vw, 14px);
`;

// Tab selector
const TabContainer = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: rgba(255,255,255,0.05);
  padding: 4px;
  border-radius: 12px;
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: ${props => props.$active ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%)' : 'transparent'};
  color: ${props => props.$active ? '#fff' : 'var(--muted)'};
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover {
    background: ${props => props.$active ? 'linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%)' : 'rgba(255,255,255,0.05)'};
    color: ${props => props.$active ? '#fff' : 'var(--text)'};
  }
`;

// Form layout
const Form = styled.form`
  display: grid;
  gap: clamp(12px, 2vw, 16px);
`;

const Field = styled.div`
  position: relative;
  display: grid;
  gap: 6px;
`;

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
`;

// Inputs with full width, accessible focus, mobile height
const Input = styled.input`
  width: 100%;
  height: clamp(48px, 6.5vh, 52px);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 12px;
  padding: 0 44px 0 14px;
  background: rgba(255,255,255,0.06);
  font-size: 15px;
  color: var(--text);
  transition: 0.2s ease;
  &::placeholder { color: var(--muted); }
  &:focus {
    outline: none;
    border-color: var(--primary-2);
    box-shadow: var(--ring);
    background: rgba(255,255,255,0.10);
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 10px;
  top: 34px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  &:hover { color: var(--text); }
`;

// Primary submit with gradient in your brand hues
const Submit = styled.button`
  height: clamp(48px, 6.5vh, 52px);
  border: 0;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  background-image: linear-gradient(135deg, var(--primary) 0%, var(--primary-2) 100%);
  box-shadow: 0 10px 24px rgba(99, 102, 241, 0.25);
  transition: transform 0.15s ease, filter 0.2s ease, box-shadow 0.2s ease;
  &:hover { transform: translateY(-1px); filter: brightness(1.02); }
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const FingerprintInfo = styled.div`
  background: linear-gradient(135deg, #ede9fe 0%, #dbeafe 100%);
  padding: 12px 16px;
  border-radius: 10px;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #c4b5fd;
`;

const FingerprintText = styled.div`
  font-size: 12px;
  color: #4c1d95;
  line-height: 1.4;
  
  strong {
    display: block;
    font-size: 13px;
    margin-bottom: 2px;
  }
`;

const Login = () => {
  const [loginMethod, setLoginMethod] = useState("password");
  const [form, setForm] = useState({ name: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fingerprint, setFingerprint] = useState(null);
  const [fingerprintLoading, setFingerprintLoading] = useState(false);
  const navigate = useNavigate();
  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  // Get device fingerprint at mount
  useEffect(() => {
    const initFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch (error) {
        toast.error("Failed to generate device fingerprint");
      }
    };
    initFingerprint();
  }, []);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  // On password login, navigate to /register after success
  const onSubmitPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${HRbaseurl}login/`, {
        name: form.name,
        password: form.password,
      });
      toast.success("Login Successfully!", { autoClose: 2000 });
      localStorage.setItem("device", data.device);
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("role", data.role);

      setTimeout(() => navigate("/register"), 1500); // Go to register page
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(msg, { autoClose: 2500 });
    } finally {
      setLoading(false);
    }
  };

  // On fingerprint login, navigate to / (root) after success
  const onSubmitFingerprint = async (e) => {
    e.preventDefault();
    if (!fingerprint) {
      toast.error("Device fingerprint not available");
      return;
    }
    setFingerprintLoading(true);
    try {
      const { data } = await axios.post(`${HRbaseurl}fingerprint-login/`, {
        fingerprint_id: fingerprint,
      });
      toast.success("Fingerprint Login Successfully!", { autoClose: 2000 });
      localStorage.setItem("device", data.device);
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("role", data.role);
      setTimeout(() => navigate("/webcam"), 1500); // Go to home/dashboard
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        "Fingerprint not recognized. Please register your device first.";
      toast.error(msg, { autoClose: 2500 });
    } finally {
      setFingerprintLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        <ToastContainer position="top-right" autoClose={2500} />
        <Card>
          <Title>Welcome back</Title>
          <Subtitle>Please sign in to continue</Subtitle>

          <TabContainer>
            <Tab
              $active={loginMethod === "password"}
              onClick={() => setLoginMethod("password")}
              type="button"
            >
              <FaEye size={16} />
              Password
            </Tab>
            <Tab
              $active={loginMethod === "fingerprint"}
              onClick={() => setLoginMethod("fingerprint")}
              type="button"
            >
              <FaFingerprint size={16} />
              Fingerprint
            </Tab>
          </TabContainer>

          {loginMethod === "password" ? (
            <Form onSubmit={onSubmitPassword}>
              <Field>
                <Label htmlFor="name">User Name</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your user name"
                  value={form.name}
                  onChange={onChange}
                  autoComplete="username"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={onChange}
                  autoComplete="current-password"
                  required
                />
                <TogglePassword
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </TogglePassword>
              </Field>

              <Submit type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Log In"}
              </Submit>
            </Form>
          ) : (
            <Form onSubmit={onSubmitFingerprint}>
              <FingerprintInfo>
                <FaFingerprint size={32} color="#7c3aed" />
                <FingerprintText>
                  <strong>Device Fingerprint Login</strong>
                  {fingerprint ? (
                    <>Your device: {fingerprint.substring(0, 12)}...</>
                  ) : (
                    <>Generating device fingerprint...</>
                  )}
                </FingerprintText>
              </FingerprintInfo>

              <Submit type="submit" disabled={fingerprintLoading || !fingerprint}>
                {fingerprintLoading ? "Authenticating..." : "Login with Fingerprint"}
              </Submit>
            </Form>
          )}
        </Card>
      </Page>
    </>
  );
};

export default Login;
