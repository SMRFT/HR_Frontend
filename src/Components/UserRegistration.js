import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import illustration from '../assets/hr_platform_illustration.png';

// Global styles (similar to DeviceRegistration)
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
`;

const float = keyframes`
  0% { transform: translateY(0px) }
  50% { transform: translateY(-12px) }
  100% { transform: translateY(0px) }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1rem, 3vw, 2rem);
  position: relative;
  overflow: hidden;
`;

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

const Card = styled.div`
  display: flex;
  width: 100%;
  max-width: 1100px;
  min-height: 620px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(140%);
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
`;

const ImageTitle = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  font-weight: 800;
  margin: 0;
`;

const ImageSubtitle = styled.p`
  font-size: clamp(0.9rem, 1.8vw, 1.05rem);
  margin-top: 0.55rem;
  opacity: 0.92;
  max-width: 420px;
  color: var(--muted);
`;

const Illustration = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  margin-bottom: 2rem;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.2));
  animation: ${float} 6s ease-in-out infinite;
`;

const FormSection = styled.div`
  flex: 1.1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: rgba(255,255,255,0.02);
`;

const FormHeader = styled.div`
  margin-bottom: 1.6rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 1.85rem;
  font-weight: 700;
  margin: 0 0 .4rem 0;
`;

const Subtitle = styled.p`
  font-size: 0.98rem;
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
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 0.86rem;
  font-weight: 600;
  margin-bottom: 0.45rem;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  background-color: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-sm);
  padding: 0 1rem;
  color: var(--text);
  &:focus { outline: none; border-color: var(--primary-2); box-shadow: var(--ring); }
`;

const Select = styled.select`
  width: 100%;
  height: 50px;
  background-color: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-sm);
  padding: 0 1rem;
  color: var(--text);
  &:focus { outline: none; border-color: var(--primary-2); box-shadow: var(--ring); }
  option { background: var(--bg2); }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  color: #fff;
  background-image: linear-gradient(135deg, var(--primary-2) 0%, var(--accent) 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 24px rgba(139,92,246,0.25);
  &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const Message = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
  border-radius: var(--radius-sm);
  color: ${p => p.success ? '#d1fae5' : '#fecaca'};
  background-color: ${p => p.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};
  display: ${p => p.visible ? 'block' : 'none'};
`;

const UserRegistration = () => {
    const [formData, setFormData] = useState({
        name: '',
        employee_id: '',
        password: '',
        confirmPassword: '',
        role: 'Employee',
        department: '',
    });
    const [departments, setDepartments] = useState([]);
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

    useEffect(() => {
        // Fetch departments
        const fetchDepts = async () => {
            try {
                const res = await axios.get(`${HRbaseurl}departments/`);
                setDepartments(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        fetchDepts();
    }, [HRbaseurl]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        if (formData.password !== formData.confirmPassword) {
            setMessage('Passwords do not match');
            setSuccess(false);
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${HRbaseurl}hrregistration/`, formData);
            setMessage('User Registered Successfully!');
            setSuccess(true);
            setFormData({
                name: '',
                employee_id: '',
                password: '',
                confirmPassword: '',
                role: 'Employee',
                department: '',
            });
        } catch (error) {
            setMessage(error.response?.data?.error || 'Registration failed');
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <GlobalStyle />
            <PageContainer>
                <Blob size={420} blur={80} opacity={0.35} top="5%" left="65%" />
                <Blob size={360} blur={70} opacity={0.30} top="75%" left="5%" bg="linear-gradient(135deg,#f472b6,#7c5cff)" />

                <Card>
                    <ImageSection>
                        <ContentOverlay>
                            <Illustration src={illustration} alt="Illustration" />
                            <ImageTitle>Access Management</ImageTitle>
                            <ImageSubtitle>Create new user accounts and assign specific departments for role-based access.</ImageSubtitle>
                        </ContentOverlay>
                    </ImageSection>

                    <FormSection>
                        <FormHeader>
                            <Title>User Registration</Title>
                            <Subtitle>Create a new account with department access</Subtitle>
                        </FormHeader>

                        <Form onSubmit={handleSubmit}>
                            <FormGrid>
                                <FormGroup>
                                    <Label>Full Name / Username</Label>
                                    <Input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Employee ID (Optional)</Label>
                                    <Input name="employee_id" value={formData.employee_id} onChange={handleChange} placeholder="EMP123" />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Role</Label>
                                    <Select name="role" value={formData.role} onChange={handleChange}>
                                        <option value="Employee">Employee</option>
                                        <option value="HR">HR / Dept Manager</option>
                                        <option value="Admin">Admin</option>
                                    </Select>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Department</Label>
                                    <Select name="department" value={formData.department} onChange={handleChange} required={formData.role !== 'Admin'}>
                                        <option value="">Select Department</option>
                                        {departments.map(d => (
                                            <option key={d.id} value={d.name}>{d.name}</option>
                                        ))}
                                    </Select>
                                </FormGroup>
                                <FormGroup>
                                    <Label>Password</Label>
                                    <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
                                </FormGroup>
                                <FormGroup>
                                    <Label>Confirm Password</Label>
                                    <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                                </FormGroup>
                            </FormGrid>

                            <SubmitButton type="submit" disabled={loading}>
                                {loading ? 'Creating...' : 'Create Account'}
                            </SubmitButton>

                            <Message visible={!!message} success={success}>{message}</Message>
                        </Form>
                    </FormSection>
                </Card>
            </PageContainer>
        </>
    );
};

export default UserRegistration;
