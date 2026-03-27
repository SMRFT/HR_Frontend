import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { MonitorSmartphone, Edit, Trash2, Search, X, Check, Save, RefreshCw } from 'lucide-react';

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
  overflow: hidden;
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

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.$active ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.$active ? '#34d399' : '#f87171'};
  border: 1px solid ${props => props.$active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
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
`;

const ModalContent = styled.div`
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  width: 100%;
  max-width: 550px;
  padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
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
  
  &:disabled {
    background: rgba(0,0,0,0.3);
    color: #64748b;
  }
`;

const Button = styled.button`
  background: ${props => props.variant === 'primary' ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' : 'rgba(255,255,255,0.05)'};
  color: white;
  border: ${props => props.variant === 'primary' ? 'none' : '1px solid rgba(255,255,255,0.1)'};
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.variant === 'primary' ? 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)' : 'rgba(255,255,255,0.1)'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RegisteredDevices = () => {
    const [devices, setDevices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingDevice, setEditingDevice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [currentFingerprint, setCurrentFingerprint] = useState('');
    
    const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

    const fetchDevices = async () => {
        try {
            const role = localStorage.getItem('role');
            const res = await axios.get(`${HRbaseurl}allowed-devices/`, {
                headers: { 'X-User-Role': role }
            });
            setDevices(res.data);
        } catch (err) {
            console.error("Failed to fetch devices", err);
        }
    };

    const fetchCurrentFingerprint = async () => {
        try {
            const FingerprintJS = (await import("@fingerprintjs/fingerprintjs")).default;
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setCurrentFingerprint(result.visitorId);
        } catch (err) {
            console.error("Fingerprint detection failed", err);
        }
    };

    useEffect(() => {
        fetchDevices();
        fetchCurrentFingerprint();
    }, [HRbaseurl]);

    const handleUpdateDevice = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const role = localStorage.getItem('role');
            await axios.put(`${HRbaseurl}allowed-devices/${editingDevice.id}/`, editingDevice, {
                headers: { 'X-User-Role': role }
            });
            alert('Device updated successfully!');
            setEditingDevice(null);
            fetchDevices();
        } catch (err) {
            alert(err.response?.data?.error || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDevice = async (id) => {
        if (!window.confirm('Are you sure you want to remove this device? Face recognition will be disabled on it immediately.')) return;
        try {
            const role = localStorage.getItem('role');
            await axios.delete(`${HRbaseurl}allowed-devices/${id}/`, {
                headers: { 'X-User-Role': role }
            });
            alert('Device removed successfully!');
            fetchDevices();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const filteredDevices = devices.filter(d =>
        d.label?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.fingerprint?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Container>
            <Header>
                <Title>
                    <MonitorSmartphone size={32} color="#6366f1" />
                    Whitelisted Devices
                </Title>
                <SearchBar>
                    <Search size={18} color="#94a3b8" />
                    <input
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </SearchBar>
            </Header>

            <Card>
                <Table>
                    <thead>
                        <tr>
                            <Th>Device Name</Th>
                            <Th>IP Address</Th>
                            <Th>Fingerprint ID</Th>
                            <Th>Status</Th>
                            <Th style={{ textAlign: 'right' }}>Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDevices.map(d => (
                            <Tr key={d.id}>
                                <Td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ 
                                            width: '32px', height: '32px', borderRadius: '8px', 
                                            background: 'rgba(99, 102, 241, 0.1)', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center' 
                                        }}>
                                            <MonitorSmartphone size={16} color="#818cf8" />
                                        </div>
                                        {d.label}
                                    </div>
                                </Td>
                                <Td style={{ fontFamily: 'monospace' }}>{d.ip_address || 'Unfixed'}</Td>
                                <Td style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'monospace' }}>
                                    {d.fingerprint}
                                    {d.fingerprint === currentFingerprint && (
                                        <span style={{ marginLeft: '8px', color: '#34d399', fontSize: '10px' }}>
                                            [CURRENT DEVICE]
                                        </span>
                                    )}
                                </Td>
                                <Td><StatusBadge $active={d.is_active}>{d.is_active ? 'Active' : 'Disabled'}</StatusBadge></Td>
                                <Td>
                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                        <ActionButton
                                            onClick={() => setEditingDevice({ ...d })}
                                            hoverBg="rgba(99, 102, 241, 0.15)"
                                            color="#818cf8"
                                        >
                                            <Edit size={16} />
                                        </ActionButton>
                                        <ActionButton
                                            onClick={() => handleDeleteDevice(d.id)}
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

            {editingDevice && (
                <ModalOverlay onClick={() => setEditingDevice(null)}>
                    <ModalContent onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ margin: 0, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Edit size={24} color="#6366f1" />
                                Edit Device
                            </h2>
                            <ActionButton onClick={() => setEditingDevice(null)}>
                                <X size={20} />
                            </ActionButton>
                        </div>

                        <form onSubmit={handleUpdateDevice}>
                            <FormGroup>
                                <Label>Device Label</Label>
                                <Input
                                    value={editingDevice.label}
                                    onChange={e => setEditingDevice({ ...editingDevice, label: e.target.value })}
                                    placeholder="e.g. Front Desk Kiosk"
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label>Whitelisted IP Address</Label>
                                <Input
                                    value={editingDevice.ip_address}
                                    onChange={e => setEditingDevice({ ...editingDevice, ip_address: e.target.value })}
                                    placeholder="IPv4 or IPv6 (Optional)"
                                />
                            </FormGroup>

                            <FormGroup>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <Label>Device Fingerprint</Label>
                                    <button 
                                        type="button" 
                                        onClick={() => setEditingDevice({...editingDevice, fingerprint: currentFingerprint})}
                                        style={{ 
                                            background: 'none', border: 'none', color: '#818cf8', 
                                            fontSize: '11px', cursor: 'pointer', display: 'flex', 
                                            alignItems: 'center', gap: '4px' 
                                        }}
                                    >
                                        <RefreshCw size={12} />
                                        Use Current Device
                                    </button>
                                </div>
                                <Input
                                    value={editingDevice.fingerprint}
                                    onChange={e => setEditingDevice({ ...editingDevice, fingerprint: e.target.value })}
                                    style={{ fontFamily: 'monospace' }}
                                    required
                                />
                                {editingDevice.fingerprint === currentFingerprint && (
                                    <div style={{ fontSize: '11px', color: '#10b981', marginTop: '4px' }}>
                                        Matches current hardware ID
                                    </div>
                                )}
                            </FormGroup>

                            <FormGroup>
                                <Label>Device Status</Label>
                                <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                                    <ActionButton 
                                        type="button"
                                        bg={editingDevice.is_active ? 'rgba(16, 185, 129, 0.15)' : 'transparent'}
                                        color={editingDevice.is_active ? '#34d399' : '#94a3b8'}
                                        borderColor={editingDevice.is_active ? '#34d399' : 'rgba(255,255,255,0.1)'}
                                        style={{ flex: 1, padding: '12px' }}
                                        onClick={() => setEditingDevice({...editingDevice, is_active: true})}
                                    >
                                        Active
                                    </ActionButton>
                                    <ActionButton 
                                        type="button"
                                        bg={!editingDevice.is_active ? 'rgba(239, 68, 68, 0.15)' : 'transparent'}
                                        color={!editingDevice.is_active ? '#f87171' : '#94a3b8'}
                                        borderColor={!editingDevice.is_active ? '#f87171' : 'rgba(255,255,255,0.1)'}
                                        style={{ flex: 1, padding: '12px' }}
                                        onClick={() => setEditingDevice({...editingDevice, is_active: false})}
                                    >
                                        Disabled
                                    </ActionButton>
                                </div>
                            </FormGroup>

                            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
                                <Button type="submit" variant="primary" style={{ flex: 1 }} disabled={loading}>
                                    {loading ? 'Saving...' : <><Save size={18} /> Update Device</>}
                                </Button>
                            </div>
                        </form>
                    </ModalContent>
                </ModalOverlay>
            )}
        </Container>
    );
};

export default RegisteredDevices;
