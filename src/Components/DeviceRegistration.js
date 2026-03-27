import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';

import illustration from '../assets/hr_platform_illustration.png';

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
  max-width: 1000px;
  min-height: 580px;
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
    height: 200px;
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

const Illustration = styled.img`
  width: 100%;
  max-width: 260px;
  height: auto;
  margin-bottom: 2rem;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
  animation: ${float} 6s ease-in-out infinite;
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
  margin-bottom: 2rem;
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

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.45rem;
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

  &:read-only {
    background-color: rgba(0,0,0,0.2);
    color: var(--muted);
    cursor: default;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  margin-top: 1rem;
  border: none;
  border-radius: var(--radius-sm);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  background-color: #4f46e5;
  background-image: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.35);
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 28px rgba(79, 70, 229, 0.45);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Message = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  text-align: center;
  border-radius: var(--radius-sm);
  color: ${p => p.success ? '#d1fae5' : '#fecaca'};
  background-color: ${p => p.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};
  border: 1px solid ${p => p.success ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};
  display: ${p => p.visible ? 'block' : 'none'};
  font-weight: 500;
`;

const DeviceRegistration = () => {
  const [formData, setFormData] = useState({
    device_name: '',
    fingerprint: '',
    ip_address: '',
    admin_password: '',
  });
  
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [existingDevices, setExistingDevices] = useState([]);
  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  const fetchExisting = async () => {
    try {
      const res = await axios.get(`${HRbaseurl}allowed-devices/`, {
        headers: { 'X-User-Role': localStorage.getItem('role') }
      });
      setExistingDevices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch existing devices", err);
    }
  };

  // Initialize Fingerprint
  useEffect(() => {
    const initFingerprint = async () => {
      try {
        const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFormData(prev => ({ ...prev, fingerprint: result.visitorId }));
      } catch (err) {
        console.error("Fingerprint initialization failed", err);
      }
    };
    initFingerprint();
    fetchExisting();
  }, [HRbaseurl]);

  // Fetch Device IP
  useEffect(() => {
    const getDeviceIP = async () => {
      try {
        const res = await axios.get(`${HRbaseurl}my-ip/`);
        setFormData(prev => ({ ...prev, ip_address: res.data.ip }));
      } catch (err) {
        console.error("Failed to fetch device IP", err);
      }
    };
    if (HRbaseurl) getDeviceIP();
  }, [HRbaseurl]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const requestData = {
        label: formData.device_name,
        fingerprint: formData.fingerprint,
        ip_address: formData.ip_address,
        password: formData.admin_password,
      };
      
      const response = await axios.post(
        `${HRbaseurl}register-device/`,
        requestData
      );
      
      setMessage(response.data.message || 'Device registered successfully!');
      setSuccess(true);
      setFormData(prev => ({
        ...prev,
        device_name: '',
        admin_password: ''
      }));
    } catch (error) {
      setMessage(
        error?.response?.data?.error || 'Failed to register device. Check your account password.'
      );
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Blob size={420} blur={80} opacity={0.35} top="5%" left="65%" bg="linear-gradient(135deg,#7c5cff,#22d3ee)" speed={16} />
      <Blob size={360} blur={70} opacity={0.30} top="75%" left="5%" bg="linear-gradient(135deg,#f472b6,#10b981)" speed={18} />
      
      <Card>
        <ImageSection>
          <ContentOverlay>
            <Illustration src={illustration} alt="Kiosk Illustration" />
            <ImageTitle>Device Activation</ImageTitle>
            <ImageSubtitle>
              Securely whitelist this device to enable face recognition attendance within your local network. Any registered user can activate a new terminal.
            </ImageSubtitle>
          </ContentOverlay>
        </ImageSection>

        <FormSection>
          <FormHeader>
            <Title>Setup Device</Title>
            <Subtitle>Whitelist this terminal for attendance</Subtitle>
          </FormHeader>

          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="device_name">Device Name / Label</Label>
              <Input
                id="device_name"
                name="device_name"
                placeholder="e.g. Reception Kiosk, Floor 2 Tablet"
                value={formData.device_name}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Device Fingerprint</Label>
              <Input
                name="fingerprint"
                value={formData.fingerprint}
                readOnly
                placeholder="Generating ID..."
                style={{ fontFamily: 'monospace', color: 'var(--accent)' }}
              />
            </FormGroup>

            <FormGroup>
              <Label>Terminal IP Address</Label>
              <Input
                name="ip_address"
                value={formData.ip_address}
                readOnly
                placeholder="Detecting IP..."
                style={{ fontFamily: 'monospace' }}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="admin_password">Account Verification Password</Label>
              <Input
                id="admin_password"
                type="password"
                name="admin_password"
                placeholder="Enter your login password to authorize"
                value={formData.admin_password}
                onChange={handleChange}
                required
              />
            </FormGroup>

            <SubmitButton type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Whitelist This Device'}
            </SubmitButton>
          </Form>

          <Message visible={!!message} success={success}>
            {message}
          </Message>

          {existingDevices.length > 0 && (
            <div style={{ marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
              <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: 'var(--text)' }}>Recently Registered Devices</h3>
              <div style={{ maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                {existingDevices.slice(0, 5).map(device => (
                  <div key={device.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    padding: '8px 12px', 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '8px',
                    marginBottom: '6px',
                    fontSize: '12px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <span style={{ fontWeight: '600' }}>{device.label}</span>
                    <span style={{ color: 'var(--muted)', fontFamily: 'monospace' }}>{device.ip_address}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </FormSection>
      </Card>
    </PageContainer>
  );
};

export default DeviceRegistration;