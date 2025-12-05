import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "axios";
import styled, { createGlobalStyle, keyframes } from "styled-components";

// --- START STYLED COMPONENTS ---

// Global palette and dark gradient background
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
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  min-height: 100vh;
  padding: clamp(1.5rem, 4vw, 3rem);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Card = styled.div`
  width: 100%;
  max-width: 1400px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  animation: ${fadeIn} 0.4s ease both;
`;

const Header = styled.div`
  padding: clamp(1.25rem, 3vw, 2rem);
  border-bottom: 1px solid rgba(255,255,255,0.12);
  background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(34,211,238,0.1));
`;

const Title = styled.h2`
  margin: 0;
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.3px;
`;

const Subtitle = styled.p`
  margin: 0.5rem 0 0 0;
  font-size: clamp(0.85rem, 1.5vw, 0.95rem);
  color: var(--muted);
`;

const FiltersBar = styled.div`
  padding: clamp(1rem, 2vw, 1.5rem);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  flex: 1;
  min-width: 250px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  padding: 0 1rem 0 3rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 0.95rem;
  transition: var(--transition);
  
  &::placeholder {
    color: var(--muted);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary-2);
    box-shadow: var(--ring);
    background: rgba(255,255,255,0.10);
  }
`;

const FilterSelect = styled.select`
  height: 48px;
  padding: 0 2.5rem 0 1rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25em;
  
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
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StatsBar = styled.div`
  padding: 0.75rem clamp(1rem, 2vw, 1.5rem);
  background: rgba(255,255,255,0.03);
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  font-size: 0.85rem;
  color: var(--muted);
`;

const Stat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  strong {
    color: var(--text);
    font-weight: 600;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
`;

const THead = styled.thead`
  background: rgba(255,255,255,0.05);
`;

const TH = styled.th`
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--muted);
  border-bottom: 1px solid rgba(255,255,255,0.1);
`;

const TBody = styled.tbody`
  tr {
    border-bottom: 1px solid rgba(255,255,255,0.08);
    transition: var(--transition);
    
    &:hover {
      background: rgba(255,255,255,0.05);
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
`;

const TD = styled.td`
  padding: 1rem 1.25rem;
  color: var(--text);
  font-size: 0.95rem;
  vertical-align: middle;
`;

const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255,255,255,0.08);
  border: 2px solid rgba(255,255,255,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &:hover {
    transform: scale(1.05);
    border-color: var(--primary);
    cursor: pointer;
  }
  
  transition: var(--transition);
`;

const AvatarPlaceholder = styled.div`
  font-size: 24px;
  color: var(--muted);
  user-select: none;
`;

const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const EmployeeName = styled.div`
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text);
`;

const EmployeeId = styled.div`
  font-size: 0.8rem;
  color: var(--muted);
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  background: ${p => p.active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'};
  color: ${p => p.active ? '#6ee7b7' : '#fca5a5'};
  border: 1px solid ${p => p.active ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'};
`;

const StatusDot = styled.span`
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.active ? '#10b981' : '#ef4444'};
  box-shadow: 0 0 8px ${p => p.active ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)'};
`;

const RadioGroup = styled.div`
  display: inline-flex;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 3px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const RadioOption = styled.label`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  background: ${props => {
    if (!props.$active) return 'transparent';
    return props.$type === 'enable' ? 'var(--success)' : 'var(--danger)';
  }};
  opacity: ${props => props.$disabled ? 0.6 : 1};
  transition: all 0.2s ease;
  user-select: none;
  min-width: 80px;

  &:hover {
    color: ${props => !props.$active && !props.$disabled && 'rgba(255, 255, 255, 0.8)'};
    background: ${props => !props.$active && !props.$disabled && 'rgba(255, 255, 255, 0.05)'};
  }

  input {
    display: none;
  }
`;

const LoadingState = styled.div`
  padding: 3rem;
  text-align: center;
  color: var(--muted);
  font-size: 0.95rem;
`;

const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  color: var(--muted);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
`;

const ErrorBanner = styled.div`
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger);
  padding: 1rem;
  margin: 0.5rem clamp(1rem, 2vw, 1.5rem);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(239, 68, 68, 0.4);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// Modal for full-size image preview
const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: ${fadeIn} 0.2s ease;
  cursor: pointer;
`;

const ModalContent = styled.div`
  max-width: 90%;
  max-height: 90%;
  position: relative;
  animation: ${fadeIn} 0.3s ease;
  
  img {
    max-width: 100%;
    max-height: 80vh;
    border-radius: var(--radius);
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -40px;
  right: 0;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
  
  &:hover {
    background: rgba(255,255,255,0.2);
    transform: scale(1.1);
  }
`;

// --- END STYLED COMPONENTS ---

export default function EmployeeHR() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  // Clear error message after a delay
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchEmployees = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await axios.get(
        `${HRbaseurl}employees/`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load employees. Please check your network or server connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const updateEmployeeStatus = useCallback((id, newStatus) => {
    setEmployees(prevEmployees =>
      prevEmployees.map(emp =>
        emp.employee_id === id ? { ...emp, is_active: newStatus } : emp
      )
    );
  }, []);

  const handleError = useCallback((err, action) => {
    const message = err.response?.data?.error
      ? `Error ${action}: ${err.response.data.error}`
      : `An unknown error occurred while trying to ${action}.`;
    setError(message);
    console.error(err);
  }, []);

  const handleEnable = async (employee_id) => {
    try {
      setProcessingId(employee_id);
      setError(null);

      await axios.post(
        `${HRbaseurl}employees/${employee_id}/enable_face/`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      updateEmployeeStatus(employee_id, true);

    } catch (err) {
      handleError(err, "enabling face recognition");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDisable = async (employee_id) => {
    try {
      setProcessingId(employee_id);
      setError(null);

      await axios.post(
        `${HRbaseurl}employees/${employee_id}/disable_face/`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      updateEmployeeStatus(employee_id, false);

    } catch (err) {
      handleError(err, "disabling face recognition");
    } finally {
      setProcessingId(null);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.employee_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.name?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "enabled" && emp.is_active) ||
        (statusFilter === "disabled" && !emp.is_active);

      return matchesSearch && matchesStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = employees.length;
    const enabled = employees.filter((e) => e.is_active).length;
    const disabled = total - enabled;
    return { total, enabled, disabled };
  }, [employees]);

  return (
    <>
      <GlobalStyle />
      <Container>
        <Card>
          <Header>
            <Title>Employee Management</Title>
            <Subtitle>Manage facial recognition settings for employees</Subtitle>
          </Header>

          {error && (
            <ErrorBanner>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ minWidth: '24px' }}><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
              {error}
            </ErrorBanner>
          )}

          <FiltersBar>
            <SearchWrapper>
              <SearchIcon
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search by ID or Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchWrapper>

            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Employees</option>
              <option value="enabled">Enabled Only</option>
              <option value="disabled">Disabled Only</option>
            </FilterSelect>
          </FiltersBar>

          <StatsBar>
            <Stat>
              Total: <strong>{stats.total}</strong>
            </Stat>
            <Stat>
              Enabled: <strong style={{ color: '#6ee7b7' }}>{stats.enabled}</strong>
            </Stat>
            <Stat>
              Disabled: <strong style={{ color: '#fca5a5' }}>{stats.disabled}</strong>
            </Stat>
            <Stat>
              Showing: <strong>{filteredEmployees.length}</strong>
            </Stat>
          </StatsBar>

          {loading ? (
            <LoadingState>Loading employees...</LoadingState>
          ) : filteredEmployees.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <p>No employees found matching your filters</p>
            </EmptyState>
          ) : (
            <TableWrapper>
              <Table>
                <THead>
                  <tr>
                    <TH>Employee</TH>
                    <TH>Face Recognition</TH>
                    <TH>Action</TH>
                  </tr>
                </THead>
                <TBody>
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.employee_id}>
                      <TD>
                        <EmployeeCell>
                          <Avatar onClick={() => emp.image_preview && setModalImage(emp.image_preview)}>
                            {emp.image_preview ? (
                              <img src={emp.image_preview} alt={emp.name || emp.employee_id} />
                            ) : (
                              <AvatarPlaceholder>👤</AvatarPlaceholder>
                            )}
                          </Avatar>
                          <EmployeeInfo>
                            <EmployeeName>{emp.name || "Unknown"}</EmployeeName>
                            <EmployeeId>ID: {emp.employee_id}</EmployeeId>
                          </EmployeeInfo>
                        </EmployeeCell>
                      </TD>
                      <TD>
                        <Badge active={emp.is_active}>
                          <StatusDot active={emp.is_active} />
                          {emp.is_active ? "Enabled" : "Disabled"}
                        </Badge>
                      </TD>
                      <TD>
                        <RadioGroup>
                          <RadioOption
                            $active={emp.is_active}
                            $type="enable"
                            $disabled={processingId === emp.employee_id}
                          >
                            <input
                              type="radio"
                              name={`status-${emp.employee_id}`}
                              checked={emp.is_active}
                              onChange={() => !emp.is_active && handleEnable(emp.employee_id)}
                              disabled={processingId === emp.employee_id}
                            />
                            {processingId === emp.employee_id && !emp.is_active ? "Enabling..." : "Enable"}
                          </RadioOption>
                          <RadioOption
                            $active={!emp.is_active}
                            $type="disable"
                            $disabled={processingId === emp.employee_id}
                          >
                            <input
                              type="radio"
                              name={`status-${emp.employee_id}`}
                              checked={!emp.is_active}
                              onChange={() => emp.is_active && handleDisable(emp.employee_id)}
                              disabled={processingId === emp.employee_id}
                            />
                            {processingId === emp.employee_id && emp.is_active ? "Disabling..." : "Disable"}
                          </RadioOption>
                        </RadioGroup>
                      </TD>
                    </tr>
                  ))}
                </TBody>
              </Table>
            </TableWrapper>
          )}
        </Card>
      </Container>

      {/* Image Preview Modal */}
      {modalImage && (
        <Modal onClick={() => setModalImage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setModalImage(null)}>✕</CloseButton>
            <img src={modalImage} alt="Employee Preview" />
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

