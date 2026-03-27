import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { User, Edit, Trash2, Key, Users, Search, X, Check, Save } from 'lucide-react';

const Container = styled.div`
  padding: 40px;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(30, 41, 59, 0.4);
  padding: 8px 16px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 300px;

  input {
    background: transparent;
    border: none;
    color: white;
    outline: none;
    width: 100%;
    font-size: 14px;
  }
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow-y: auto;
  max-height: calc(100vh - 220px);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 20px 24px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  background: #1e293b;
  z-index: 10;
`;

const Td = styled.td`
  padding: 20px 24px;
  color: #e2e8f0;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Tr = styled.tr`
  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

const Badge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => {
        if (props.role === 'Admin') return 'rgba(239, 68, 68, 0.15)';
        if (props.role === 'HR') return 'rgba(16, 185, 129, 0.15)';
        return 'rgba(99, 102, 241, 0.15)';
    }};
  color: ${props => {
        if (props.role === 'Admin') return '#f87171';
        if (props.role === 'HR') return '#34d399';
        return '#818cf8';
    }};
  border: 1px solid ${props => {
        if (props.role === 'Admin') return 'rgba(239, 68, 68, 0.2)';
        if (props.role === 'HR') return 'rgba(16, 185, 129, 0.2)';
        return 'rgba(99, 102, 241, 0.2)';
    }};
`;

const ActionButton = styled.button`
  background: ${props => props.bg || 'rgba(255,255,255,0.05)'};
  color: ${props => props.color || '#e2e8f0'};
  border: 1px solid ${props => props.borderColor || 'rgba(255,255,255,0.1)'};
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.hoverBg || 'rgba(255,255,255,0.1)'};
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  width: 100%;
  max-width: 800px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
`;

const Input = styled.input`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #6366f1;
  }
`;

const Select = styled.select`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  cursor: pointer;

  &:focus {
    border-color: #6366f1;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'danger' ? 'rgba(239, 68, 68, 0.1)' : 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'};
  color: ${props => props.variant === 'danger' ? '#f87171' : 'white'};
  border: ${props => props.variant === 'danger' ? '1px solid rgba(239, 68, 68, 0.2)' : 'none'};
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background: ${props => props.variant === 'danger' ? 'rgba(239, 68, 68, 0.2)' : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)'};
  }
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  min-height: 50px;
`;

const DeptChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: ${props => props.selected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.selected ? '#818cf8' : '#94a3b8'};
  border: 1px solid ${props => props.selected ? 'rgba(99, 102, 241, 0.3)' : 'transparent'};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.selected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const UserManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);

    const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

    const fetchUsers = async () => {
        try {
            const role = localStorage.getItem('role');
            const res = await axios.get(`${HRbaseurl}hrregistration/`, {
                headers: { 'X-User-Role': role }
            });
            setUsers(res.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
        }
    };

    const fetchDepts = async () => {
        try {
            const res = await axios.get(`${HRbaseurl}global-departments/`);
            setDepartments(res.data);
        } catch (err) {
            console.error("Failed to fetch departments", err);
        }
    };

    useEffect(() => {
        const role = localStorage.getItem('role');
        if (role !== 'Admin') {
            navigate('/HRAction');
        }
    }, [navigate]);

    useEffect(() => {
        fetchUsers();
        fetchDepts();
    }, [HRbaseurl]);

    const toggleDepartment = (deptCode) => {
        let depts = editingUser.department ? editingUser.department.toString().split(',').filter(d => d !== '') : [];
        const deptCodeStr = deptCode.toString();
        if (depts.includes(deptCodeStr)) {
            depts = depts.filter(d => d !== deptCodeStr);
        } else {
            depts.push(deptCodeStr);
        }
        setEditingUser({ ...editingUser, department: depts.join(',') });
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const role = localStorage.getItem('role');
            await axios.put(`${HRbaseurl}hrregistration/`, editingUser, {
                headers: { 'X-User-Role': role }
            });
            alert('User updated successfully!');
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.error || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            const role = localStorage.getItem('role');
            await axios.delete(`${HRbaseurl}hrregistration/?id=${id}`, {
                headers: { 'X-User-Role': role }
            });
            alert('User deleted successfully!');
            fetchUsers();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.employee_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <Header>
                <Title>
                    <Users size={32} color="#6366f1" />
                    User Management
                </Title>
                <SearchBar>
                    <Search size={18} color="#94a3b8" />
                    <input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchBar>
            </Header>

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <Th>Name</Th>
                            <Th>Employee ID</Th>
                            <Th>Department</Th>
                            <Th>Role</Th>
                            <Th>Device</Th>
                            <Th style={{ textAlign: 'right' }}>Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <Tr key={user.id}>
                                <Td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <User size={16} color="#818cf8" />
                                        </div>
                                        {user.name}
                                    </div>
                                </Td>
                                <Td>{user.employee_id || 'N/A'}</Td>
                                <Td>
                                    {user.department ? user.department.split(',').map(code => {
                                        const dept = departments.find(d => d.department_code.toString() === code.toString());
                                        return dept ? dept.department_name : code;
                                    }).join(', ') : 'N/A'}
                                </Td>
                                <Td><Badge role={user.role}>{user.role}</Badge></Td>
                                <Td style={{ fontSize: '12px', color: '#94a3b8' }}>{user.device || 'None'}</Td>
                                <Td>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <ActionButton
                                            onClick={() => setEditingUser({ ...user, password: '', confirmPassword: '' })}
                                            hoverBg="rgba(99, 102, 241, 0.15)"
                                            color="#818cf8"
                                        >
                                            <Edit size={16} />
                                        </ActionButton>
                                        <ActionButton
                                            onClick={() => handleDeleteUser(user.id)}
                                            hoverBg="rgba(239, 68, 68, 0.15)"
                                            color="#f87171"
                                        >
                                            <Trash2 size={16} />
                                        </ActionButton>
                                    </div>
                                </Td>
                            </Tr>
                        ))}
                    </tbody>
                </Table>
            </Card>

            {editingUser && (
                <ModalOverlay onClick={() => setEditingUser(null)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Edit size={24} color="#6366f1" />
                                Edit User
                            </h2>
                            <ActionButton onClick={() => setEditingUser(null)}>
                                <X size={20} />
                            </ActionButton>
                        </div>

                        <form onSubmit={handleUpdateUser}>
                            <FormGrid>
                                <FormGroup>
                                    <Label>Full Name / Username</Label>
                                    <Input
                                        value={editingUser.name}
                                        onChange={e => setEditingUser({ ...editingUser, name: e.target.value })}
                                        required
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Employee ID</Label>
                                    <Input
                                        value={editingUser.employee_id}
                                        onChange={e => setEditingUser({ ...editingUser, employee_id: e.target.value })}
                                    />
                                </FormGroup>

                                <FormGroup style={{ gridColumn: 'span 2' }}>
                                    <Label>Departments (Select Multiple)</Label>
                                    <ChipContainer>
                                        {departments.map(d => (
                                            <DeptChip
                                                key={d.department_code}
                                                selected={editingUser.department?.toString().split(',').includes(d.department_code.toString())}
                                                onClick={() => toggleDepartment(d.department_code)}
                                            >
                                                {d.department_name}
                                                {editingUser.department?.toString().split(',').includes(d.department_code.toString()) && <Check size={14} />}
                                            </DeptChip>
                                        ))}
                                    </ChipContainer>
                                </FormGroup>

                                <FormGroup style={{ gridColumn: 'span 2' }}>
                                    <Label>Role</Label>
                                    <Select
                                        value={editingUser.role}
                                        onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
                                    >
                                        <option value="Employee">Employee</option>
                                        <option value="HR">HR / Dept Manager</option>
                                        <option value="Admin">Admin</option>
                                    </Select>
                                </FormGroup>
                            </FormGrid>

                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '24px 0' }} />

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#94a3b8', fontSize: '13px' }}>
                                <Key size={14} />
                                Change Password (optional)
                            </div>

                            <FormGrid>
                                <FormGroup>
                                    <Label>New Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Leave blank to keep current"
                                        value={editingUser.password}
                                        onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                                    />
                                </FormGroup>

                                <FormGroup>
                                    <Label>Confirm New Password</Label>
                                    <Input
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={editingUser.confirmPassword}
                                        onChange={e => setEditingUser({ ...editingUser, confirmPassword: e.target.value })}
                                    />
                                </FormGroup>
                            </FormGrid>

                            <Button type="submit" disabled={loading}>
                                {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                            </Button>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default UserManagement;
