import React, { useState, useEffect } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import "@fontsource/poppins";
import { FaEye, FaEyeSlash, FaDesktop } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

// ─── Animations ───────────────────────────────────────────────────────────────
const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const floatUp = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
`;

const blobPulse = keyframes`
  0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.55; }
  33%       { transform: scale(1.15) translate(8px, -12px); opacity: 0.7; }
  66%       { transform: scale(0.9) translate(-6px, 8px); opacity: 0.45; }
`;

const blobPulse2 = keyframes`
  0%, 100% { transform: scale(1) translate(0, 0); opacity: 0.4; }
  40%       { transform: scale(1.2) translate(-10px, 14px); opacity: 0.62; }
  70%       { transform: scale(0.88) translate(12px, -8px); opacity: 0.35; }
`;

const spinSlow = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

const spinSlowRev = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
`;

const LeftPanel = styled.div`
  flex: 1.1;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 48px;
  overflow: hidden;
  animation: ${slideInLeft} 0.6s ease both;

  /* Rich layered background */
  background:
    radial-gradient(ellipse at 20% 20%, rgba(99,102,241,0.22) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 75%, rgba(6,182,212,0.18) 0%, transparent 50%),
    radial-gradient(ellipse at 60% 10%, rgba(139,92,246,0.14) 0%, transparent 45%),
    linear-gradient(160deg, #060d1e 0%, #0d1535 40%, #071020 100%);

  /* Dot grid overlay */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle, rgba(99,102,241,0.25) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 768px) {
    flex: none;
    min-height: 300px;
    padding: 32px 28px;
    justify-content: center;
  }
`;

/* ── Decorative blobs ── */
const Blob = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
  z-index: 0;
`;

const Blob1 = styled(Blob)`
  width: 320px; height: 320px;
  background: radial-gradient(circle, rgba(99,102,241,0.55) 0%, transparent 70%);
  top: -60px; left: -60px;
  animation: ${blobPulse} 9s ease-in-out infinite;
`;

const Blob2 = styled(Blob)`
  width: 280px; height: 280px;
  background: radial-gradient(circle, rgba(6,182,212,0.45) 0%, transparent 70%);
  bottom: 40px; right: -60px;
  animation: ${blobPulse2} 11s ease-in-out infinite;
`;

const Blob3 = styled(Blob)`
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(139,92,246,0.4) 0%, transparent 70%);
  top: 45%; left: 55%;
  animation: ${blobPulse} 13s 2s ease-in-out infinite;
`;

/* ── Decorative rings ── */
const Ring = styled.div`
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
  pointer-events: none;
  z-index: 0;
`;

const Ring1 = styled(Ring)`
  width: 380px; height: 380px;
  border-color: rgba(99,102,241,0.12);
  top: -100px; left: -100px;
  animation: ${spinSlow} 40s linear infinite;
`;

const Ring2 = styled(Ring)`
  width: 260px; height: 260px;
  border-color: rgba(6,182,212,0.1);
  bottom: 60px; right: -80px;
  animation: ${spinSlowRev} 30s linear infinite;
`;

const Ring3 = styled(Ring)`
  width: 160px; height: 160px;
  border-color: rgba(139,92,246,0.14);
  top: 40%; left: 60%;
  animation: ${spinSlow} 20s linear infinite;
`;


const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  background: #0b0f1a;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LeftOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(6,13,30,0.05) 0%,
    rgba(6,13,30,0.25) 50%,
    rgba(6,13,30,0.8) 100%
  );
  z-index: 1;
  pointer-events: none;
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 2;
  animation: ${floatUp} 6s ease-in-out infinite;
`;

const BrandBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(99, 102, 241, 0.18);
  border: 1px solid rgba(99, 102, 241, 0.35);
  border-radius: 30px;
  padding: 6px 14px;
  font-size: 11.5px;
  font-weight: 600;
  color: #a5b4fc;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  margin-bottom: 18px;
`;

const Dot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #6366f1;
  box-shadow: 0 0 8px #6366f1;
`;

const BrandTitle = styled.h1`
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #fff 30%, #a5b4fc 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const BrandSub = styled.p`
  font-size: clamp(13px, 1.6vw, 16px);
  color: rgba(148, 163, 184, 0.9);
  line-height: 1.6;
  margin: 0 0 28px;
  max-width: 380px;
`;

const Features = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: rgba(203, 213, 225, 0.85);
  font-weight: 500;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #06b6d4);
    flex-shrink: 0;
    box-shadow: 0 0 10px rgba(99,102,241,0.6);
  }
`;

// RIGHT PANEL ────────────────────────────────────────────────────────────────
const RightPanel = styled.div`
  flex: 0.9;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: clamp(28px, 5vw, 56px) clamp(24px, 6vw, 64px);
  background: #0f172a;
  animation: ${slideInRight} 0.6s ease both;

  @media (max-width: 768px) {
    flex: none;
    padding: 32px 24px 40px;
  }
`;

const FormBox = styled.div`
  width: 100%;
  max-width: 400px;
`;

const WelcomeText = styled.div`
  margin-bottom: 32px;
`;

const WelcomeTitle = styled.h2`
  font-size: clamp(22px, 2.8vw, 30px);
  font-weight: 800;
  color: #f1f5f9;
  margin: 0 0 6px;
`;

const GradientUnderline = styled.span`
  display: inline-block;
  background: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${shimmer} 4s linear infinite;
`;

const WelcomeSub = styled.p`
  font-size: 13.5px;
  color: #64748b;
  margin: 0;
`;

// Tabs
const TabContainer = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 26px;
  background: rgba(255,255,255,0.04);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.07);
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px 14px;
  border: none;
  border-radius: 9px;
  background: ${props => props.$active
    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
    : 'transparent'};
  color: ${props => props.$active ? '#fff' : '#64748b'};
  font-weight: 600;
  font-size: 13.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: 'Poppins', sans-serif;
  box-shadow: ${props => props.$active ? '0 4px 16px rgba(99,102,241,0.3)' : 'none'};

  &:hover {
    color: ${props => props.$active ? '#fff' : '#94a3b8'};
  }
`;

// Form
const Form = styled.form`
  display: grid;
  gap: 18px;
`;

const Field = styled.div`
  position: relative;
  display: grid;
  gap: 7px;
`;

const Label = styled.label`
  font-size: 12.5px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.6px;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 12px;
  padding: 0 46px 0 16px;
  background: rgba(255,255,255,0.04);
  font-size: 14.5px;
  color: #f1f5f9;
  transition: 0.2s ease;
  font-family: 'Poppins', sans-serif;
  box-sizing: border-box;

  &::placeholder { color: #475569; }
  &:focus {
    outline: none;
    border-color: rgba(99,102,241,0.5);
    box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
    background: rgba(255,255,255,0.07);
  }
`;

const TogglePassword = styled.button`
  position: absolute;
  right: 12px;
  top: 38px;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  background: transparent;
  color: #475569;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #94a3b8; }
`;

const Submit = styled.button`
  height: 52px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 60%, #06b6d4 100%);
  background-size: 200% auto;
  box-shadow: 0 8px 28px rgba(99, 102, 241, 0.32);
  transition: all 0.25s ease;
  font-family: 'Poppins', sans-serif;
  letter-spacing: 0.4px;
  animation: ${shimmer} 5s linear infinite;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(99, 102, 241, 0.45);
  }
  &:active:not(:disabled) { transform: translateY(0); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const DeviceCard = styled.div`
  background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.06) 100%);
  border: 1px solid rgba(99,102,241,0.2);
  padding: 18px 20px;
  border-radius: 14px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const DeviceIcon = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: rgba(99,102,241,0.15);
  display: grid;
  place-items: center;
  flex-shrink: 0;
`;

const DeviceText = styled.div`
  font-size: 12.5px;
  color: #94a3b8;
  line-height: 1.6;

  strong {
    display: block;
    font-size: 13.5px;
    color: #c7d2fe;
    margin-bottom: 4px;
  }
  code {
    background: rgba(99,102,241,0.15);
    padding: 2px 8px;
    border-radius: 6px;
    font-size: 13px;
    color: #a5b4fc;
    font-family: monospace;
  }
`;

const Divider = styled.div`
  text-align: center;
  margin: 20px 0 0;
  font-size: 12px;
  color: #334155;

  span {
    display: inline-block;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.18);
    border-radius: 20px;
    padding: 4px 14px;
    color: #6366f1;
    font-weight: 600;
    font-size: 11px;
    letter-spacing: 0.5px;
  }
`;

// ─── Component ─────────────────────────────────────────────────────────────────
const Login = () => {
  const [loginMethod, setLoginMethod] = useState("device");
  const [form, setForm] = useState({ employee_id: "", password: "" });
  const [fingerprint, setFingerprint] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ipLoginLoading, setIpLoginLoading] = useState(false);
  const navigate = useNavigate();
  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  // Initialize Fingerprint
  useEffect(() => {
    const initFingerprint = async () => {
      try {
        const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch (err) {
        console.error("Fingerprint initialization failed", err);
      }
    };
    initFingerprint();
  }, []);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmitPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("login/", {
        employee_id: form.employee_id,
        password: form.password,
      });
      toast.success("Login Successfully!", { autoClose: 2000 });
      localStorage.setItem("device", data.device);
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("role", data.role);
      localStorage.setItem("department", data.department);
      localStorage.setItem("department_id", data.department_id);
      localStorage.setItem("department_name", data.department_name);
      localStorage.setItem("employee_id", data.employee_id);
      setTimeout(() => {
        if (data.role === "Admin") {
          navigate("/HRAction");
        } else {
          navigate("/daily-attendance");
        }
      }, 1500);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      toast.error(msg, { autoClose: 2500 });
    } finally {
      setLoading(false);
    }
  };



  const onSubmitIPLogin = async (e) => {
    e.preventDefault();
    setIpLoginLoading(true);
    try {

      const { data } = await api.post("ip-login/", {
        fingerprint: fingerprint
      });
      toast.success("Kiosk Access Granted!", { autoClose: 1000 });
      localStorage.setItem("device", data.device);
      localStorage.setItem("access_token", data.token);
      localStorage.setItem("name", data.name);
      localStorage.setItem("role", data.role);
      localStorage.setItem("department", data.department || "");
      localStorage.setItem("department_id", data.department_id || "");
      localStorage.setItem("department_name", data.department_name || "");
      localStorage.setItem("employee_id", data.employee_id || "");
      // Navigate immediately for "match and go" experience
      navigate("/webcam");
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        "This device is not authorized for Kiosk Attendance.";
      toast.error(msg, { autoClose: 3500 });
    } finally {
      setIpLoginLoading(false);
    }
  };

  return (
    <>
      <Page>
        <ToastContainer position="top-right" autoClose={2500} />

        {/* ── LEFT: Branding Panel ── */}
        <LeftPanel>
          {/* Animated blobs */}
          <Blob1 />
          <Blob2 />
          <Blob3 />
          {/* Spinning rings */}
          <Ring1 />
          <Ring2 />
          <Ring3 />
          {/* Gradient overlay toward bottom */}
          <LeftOverlay />
          <LeftContent>
            <BrandBadge>
              <Dot />
              HR Management System
            </BrandBadge>
            <BrandTitle>Shanmuga<br />Innovation</BrandTitle>
            <BrandSub>
              Empower your workforce with intelligent HR tools — attendance,
              rosters, shifts, and reports all in one place.
            </BrandSub>
            <Features>
              <FeatureItem>Real-time Attendance Tracking</FeatureItem>
              <FeatureItem>Smart Shift & Roster Management</FeatureItem>
              <FeatureItem>Department-wise Analytics</FeatureItem>
              <FeatureItem>Secure Role-based Access</FeatureItem>
            </Features>
          </LeftContent>
        </LeftPanel>

        {/* ── RIGHT: Login Panel ── */}
        <RightPanel>
          <FormBox>
            <WelcomeText>
              <WelcomeTitle>
                Welcome <GradientUnderline>back</GradientUnderline> 👋
              </WelcomeTitle>
              <WelcomeSub>Sign in to your HR account to continue</WelcomeSub>
            </WelcomeText>

            <TabContainer>
              <Tab
                $active={loginMethod === "password"}
                onClick={() => setLoginMethod("password")}
                type="button"
              >
                <FaEye size={14} />
                Password
              </Tab>
              <Tab
                $active={loginMethod === "device"}
                onClick={() => setLoginMethod("device")}
                type="button"
              >
                <FaDesktop size={14} />
                Kiosk Login
              </Tab>
            </TabContainer>

            {loginMethod === "password" ? (
              <Form onSubmit={onSubmitPassword}>
                <Field>
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    name="employee_id"
                    type="text"
                    placeholder="Enter your Employee ID"
                    value={form.employee_id}
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
                  >
                    {showPassword ? <FaEyeSlash size={17} /> : <FaEye size={17} />}
                  </TogglePassword>
                </Field>

                <Submit type="submit" disabled={loading}>
                  {loading ? "Signing in…" : "Sign In →"}
                </Submit>
              </Form>
            ) : (
              <Form onSubmit={onSubmitIPLogin}>
                <DeviceCard>
                  <DeviceIcon>
                    <FaDesktop size={22} color="#818cf8" />
                  </DeviceIcon>
                  <DeviceText>
                    <strong>Face Attendance Terminal</strong>
                    Hardware fingerprint detected. Click below to verify and enter the attendance screen.
                    <br />
                    <em>(Registered devices only)</em>
                  </DeviceText>
                </DeviceCard>

                <Submit type="submit" disabled={ipLoginLoading}>
                  {ipLoginLoading ? "Authenticating…" : "Enter Face Attendance Mode →"}
                </Submit>
              </Form>
            )}

            <Divider>
              <span>Shanmuga Innovation © {new Date().getFullYear()}</span>
            </Divider>
          </FormBox>
        </RightPanel>
      </Page>
    </>
  );
};

export default Login;
