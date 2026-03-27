import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import illustration from '../assets/hr_platform_illustration.png';

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
  overflow-y: auto;
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
  background-color: #4f46e5;
  background-image: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border: none;
  cursor: pointer;
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
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
  border-radius: var(--radius-sm);
  color: ${p => p.success ? '#d1fae5' : '#fecaca'};
  background-color: ${p => p.success ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};
  display: ${p => p.visible ? 'block' : 'none'};
`;

const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;
const DropdownHeader = styled.div`
  width: 100%;
  padding: 12px 14px;
  background: var(--input-bg, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border, rgba(255, 255, 255, 0.12));
  border-radius: var(--radius-sm, 10px);
  color: var(--text, #f8fafc);
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: rgba(99, 102, 241, 0.4);
    background: rgba(255, 255, 255, 0.08);
  }
`;
const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 250px;
  overflow-y: auto;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm, 10px);
  margin-top: 8px;
  z-index: 100;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const DropdownItem = styled.div`
  padding: 10px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  color: ${props => props.selected ? '#818cf8' : '#e2e8f0'};
  background: ${props => props.selected ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  font-size: 0.95rem;
  &:hover {
    background: ${props => props.selected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  }
`;
const Checkbox = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${props => props.checked ? '#6366f1' : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 4px;
  background: ${props => props.checked ? '#6366f1' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
`;

const UserRegistration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    employee_id: '',
    password: '',
    confirmPassword: '',
    role: 'Employee',
    department: '',
  });
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'Admin') {
      navigate('/HRAction');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await axios.get(`${HRbaseurl}global-departments/`);
        setDepartments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepts();
  }, [HRbaseurl]);

  useEffect(() => {
    const fetchEmployees = async () => {
      if (!formData.department) {
        setEmployees([]);
        return;
      }
      setLoadingEmployees(true);
      try {
        const res = await axios.get(`${HRbaseurl}employees_from_global/?department=${encodeURIComponent(formData.department)}`);
        setEmployees(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch employees", err);
        setEmployees([]);
      } finally {
        setLoadingEmployees(false);
      }
    };
    fetchEmployees();
  }, [formData.department, HRbaseurl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const toggleDepartment = (deptCode) => {
    let depts = formData.department ? formData.department.toString().split(',').filter(d => d !== '') : [];
    const deptCodeStr = deptCode.toString();
    if (depts.includes(deptCodeStr)) {
      depts = depts.filter(d => d !== deptCodeStr);
    } else {
      depts.push(deptCodeStr);
    }
    setFormData({ ...formData, department: depts.join(',') });
  };

  const selectedDeptsArray = formData.department ? formData.department.toString().split(',').filter(d => d !== '') : [];

  const getSelectedDeptsText = () => {
    if (selectedDeptsArray.length === 0) return "Select Departments";
    if (selectedDeptsArray.length === 1) {
      const d = departments.find(d => d.department_code.toString() === selectedDeptsArray[0]);
      return d ? d.department_name : "1 Selected";
    }
    return `${selectedDeptsArray.length} Selected`;
  };

  const handleEmployeeChange = (e) => {
    const selectedEmpId = e.target.value;
    const selectedEmp = employees.find(emp => emp.employeeId === selectedEmpId);
    if (selectedEmp) {
      setFormData({
        ...formData,
        name: selectedEmp.employeeName,
        employee_id: selectedEmp.employeeId
      });
    } else {
      setFormData({
        ...formData,
        name: '',
        employee_id: ''
      });
    }
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
                <FormGroup style={{ gridColumn: 'span 2' }}>
                  <Label>Departments (Select Multiple)</Label>
                  <DropdownContainer ref={dropdownRef}>
                    <DropdownHeader onClick={() => setDropdownOpen(!dropdownOpen)}>
                      <span>{getSelectedDeptsText()}</span>
                      <ChevronDown size={18} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                    </DropdownHeader>
                    {dropdownOpen && (
                      <DropdownList>
                        {departments.map(d => {
                          const isSelected = selectedDeptsArray.includes(d.department_code.toString());
                          return (
                            <DropdownItem
                              key={d.department_code}
                              selected={isSelected}
                              onClick={() => toggleDepartment(d.department_code)}
                            >
                              <Checkbox checked={isSelected}>
                                {isSelected && <Check size={14} color="white" />}
                              </Checkbox>
                              {d.department_name}
                            </DropdownItem>
                          );
                        })}
                      </DropdownList>
                    )}
                  </DropdownContainer>
                </FormGroup>

                <FormGroup>
                  <Label>Role</Label>
                  <Select name="role" value={formData.role} onChange={handleChange}>
                    <option value="Employee">Employee</option>
                    <option value="HR">HR / Dept Manager</option>
                    <option value="Admin">Admin</option>
                  </Select>
                </FormGroup>

                {formData.role !== 'Admin' && formData.department ? (
                  <FormGroup>
                    <Label>Select Employee</Label>
                    <Select
                      name="employee_select"
                      value={formData.employee_id}
                      onChange={handleEmployeeChange}
                      disabled={loadingEmployees}
                    >
                      <option value="">{loadingEmployees ? 'Loading...' : 'Choose Employee'}</option>
                      {employees.map(emp => (
                        <option key={emp.employeeId} value={emp.employeeId}>
                          {emp.employeeName} ({emp.employeeId})
                        </option>
                      ))}
                    </Select>
                  </FormGroup>
                ) : (
                  <FormGroup>
                    <Label>Full Name / Username</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" />
                  </FormGroup>
                )}

                <FormGroup>
                  <Label>Employee ID (Auto-filled)</Label>
                  <Input
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    placeholder="EMP123"
                    readOnly={formData.role !== 'Admin' && !!formData.employee_id && employees.length > 0}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Password</Label>
                  <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </FormGroup>

                <FormGroup style={{ gridColumn: 'span 2' }}>
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
