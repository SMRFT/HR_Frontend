import React, { useState } from 'react';
import axios from 'axios';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// Global palette and dark gradient background
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
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

// Floating animation for decorative elements
const float = keyframes`
  0% { transform: translateY(0px) }
  50% { transform: translateY(-12px) }
  100% { transform: translateY(0px) }
`;

// Fade in animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Page container
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
  position: relative;
  overflow: hidden;
`;

// Decorative floating blobs
const Blob = styled.div`
  position: absolute;
  width: ${p => p.size || 300}px;
  height: ${p => p.size || 300}px;
  border-radius: 50%;
  filter: blur(${p => p.blur || 60}px);
  opacity: ${p => p.opacity || 0.35};
  background: ${p => p.bg || 'linear-gradient(135deg,#7c5cff,#22d3ee)'};
  top: ${p => p.top || '10%'};
  left: ${p => p.left || '60%'};
  animation: ${float} ${p => p.speed || 12}s ease-in-out infinite;
  pointer-events: none;
`;

// Glass card with responsive layout
const Card = styled.div`
  display: flex;
  width: 100%;
  max-width: 1100px;
  min-height: 620px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid var(--border);
  border-radius: 22px;
  overflow: hidden;
  box-shadow: var(--shadow);
  animation: ${fadeIn} 0.4s ease both;

  @media (max-width: 900px) {
    flex-direction: column;
    min-height: auto;
  }
`;

// Image/hero section
const ImageSection = styled.div`
  flex: 1;
  position: relative;
  background:
    radial-gradient(800px 600px at 20% 30%, rgba(99,102,241,0.25), transparent 70%),
    radial-gradient(600px 500px at 80% 70%, rgba(34,211,238,0.25), transparent 65%),
    linear-gradient(135deg, #1e293b, #0f172a);
  background-size: cover;
  background-position: center;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(16,24,40,0.3) 0%, rgba(16,24,40,0.7) 100%);
  }

  @media (max-width: 900px) { 
    height: 240px;
  }
`;

const ContentOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 3rem;
  z-index: 2;
  color: var(--text);

  @media (max-width: 900px) { 
    padding: 1.5rem;
  }
`;

const ImageTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 800;
  margin: 0;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
`;

const ImageSubtitle = styled.p`
  font-size: clamp(0.9rem, 1.8vw, 1.05rem);
  margin-top: 0.55rem;
  opacity: 0.92;
  max-width: 420px;
  text-shadow: 0 2px 6px rgba(0,0,0,0.4);
  color: var(--muted);
`;

// Form section
const FormSection = styled.div`
  flex: 1.1;
  padding: clamp(2rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255,255,255,0.02);

  @media (max-width: 900px) { 
    padding: 2rem 1.5rem;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 1.6rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: clamp(1.5rem, 2.5vw, 1.85rem);
  font-weight: 700;
  color: var(--text);
  margin: 0 0 .4rem 0;
`;

const Subtitle = styled.p`
  font-size: clamp(0.85rem, 1.5vw, 0.98rem);
  color: var(--muted);
  margin: 0;
`;

const Form = styled.form`
  width: 100%;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  margin-bottom: 1.2rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.45rem;
`;

const InputWrap = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  background-color: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-sm);
  padding: 0 1rem;
  font-size: 0.95rem;
  color: var(--text);
  transition: var(--transition);

  &:focus {
    outline: none;
    border-color: var(--primary-2);
    box-shadow: var(--ring);
    background-color: rgba(255,255,255,0.10);
  }

  &::placeholder {
    color: rgba(148,163,184,0.6);
  }
`;

const Select = styled.select`
  width: 100%;
  height: 50px;
  background-color: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-sm);
  padding: 0 1rem;
  font-size: 0.95rem;
  color: var(--text);
  transition: var(--transition);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(34,211,238,0.15);
    background-color: rgba(255,255,255,0.10);
  }

  option {
    background: var(--bg2);
    color: var(--text);
  }
`;

const ToggleBtn = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: 0;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  transition: var(--transition);

  &:hover {
    color: var(--text);
    background: rgba(255,255,255,0.08);
  }
`;

const Meter = styled.div`
  height: 8px;
  border-radius: 999px;
  background: rgba(255,255,255,0.10);
  overflow: hidden;
  margin-top: 0.5rem;

  & > span {
    display: block;
    height: 100%;
    width: ${p => p.width || 0}%;
    background: ${p => p.bg || 'rgba(255,255,255,0.10)'};
    transition: width 0.25s ease;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 0.4rem;
  border: none;
  border-radius: var(--radius-sm);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background-image: linear-gradient(135deg, var(--primary-2) 0%, var(--accent) 100%);
  box-shadow: 0 10px 24px rgba(139,92,246,0.25);
  transition: transform 0.15s ease, box-shadow 0.2s ease, filter 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    filter: grayscale(12%);
  }
`;

const Message = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
  border-radius: var(--radius-sm);
  color: ${p => p.success ? '#d1fae5' : '#fecaca'};
  background-color: ${p => p.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};
  border: 1px solid ${p => p.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};
  display: ${p => p.visible ? 'block' : 'none'};
  font-weight: 500;
`;

// Component
const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    password: '',
    confirmPassword: '',
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const strength = (() => {
    const p = formData.password || '';
    let score = 0;
    if (p.length >= 8) score += 25;
    if (/[A-Z]/.test(p)) score += 25;
    if (/[0-9]/.test(p)) score += 25;
    if (/[^A-Za-z0-9]/.test(p)) score += 25;
    const bg = score < 50 ? '#ef4444' : score < 75 ? '#f59e0b' : '#22c55e';
    return { score, bg };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setSuccess(false);
      return;
    }
    setLoading(true);
    try {
      const requestData = {
        name: formData.name,
        role: formData.role,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      };
      await axios.post(
        `${HRbaseurl}hrregistration/`,
        requestData
      );
      setMessage('Registration successful!');
      setSuccess(true);
      setFormData({ name: '', role: '', password: '', confirmPassword: '' });
    } catch (error) {
      setMessage(
        error?.response?.data?.error || 'Registration failed. Please try again.'
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <GlobalStyle />
      <PageContainer>
        <Blob
          size={420}
          blur={80}
          opacity={0.35}
          top="5%"
          left="65%"
          bg="linear-gradient(135deg,#7c5cff,#22d3ee)"
          speed={16}
        />
        <Blob
          size={360}
          blur={70}
          opacity={0.30}
          top="75%"
          left="5%"
          bg="linear-gradient(135deg,#f472b6,#7c5cff)"
          speed={18}
        />
        <Card>
          <ImageSection>
            <ContentOverlay>
              <ImageTitle>Join Our Platform</ImageTitle>
              <ImageSubtitle>
                Create your account and unlock access to powerful tools and features
              </ImageSubtitle>
            </ContentOverlay>
          </ImageSection>

          <FormSection>
            <FormHeader>
              <Title>Create an Account</Title>
              <Subtitle>Please fill in the form to register</Subtitle>
            </FormHeader>

            <Form onSubmit={handleSubmit}>
              <FormGrid>
                <FormGroup>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="role">Select Role</Label>
                  <Select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="Admin">Admin</option>
                    <option value="Company">Company</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <InputWrap>
                    <Input
                      id="password"
                      type={showPass ? 'text' : 'password'}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <ToggleBtn
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                    >
                      {showPass ? 'Hide' : 'Show'}
                    </ToggleBtn>
                  </InputWrap>
                  <Meter width={strength.score} bg={strength.bg}>
                    <span />
                  </Meter>
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <InputWrap>
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <ToggleBtn
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                    >
                      {showConfirm ? 'Hide' : 'Show'}
                    </ToggleBtn>
                  </InputWrap>
                </FormGroup>
              </FormGrid>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Account'}
              </SubmitButton>
            </Form>

            <Message visible={message !== ''} success={success}>
              {message}
            </Message>
          </FormSection>
        </Card>
      </PageContainer>
    </>
  );
};

export default Register;
