import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import styled, { createGlobalStyle, keyframes } from "styled-components";

/* -------------------------------------------------------------------------- */
/* Global Theme - Modern Design System                                        */
/* -------------------------------------------------------------------------- */
const GlobalStyle = createGlobalStyle`
  :root {
    --bg1: #0f172a;
    --bg2: #1e293b;
    --primary: #6366f1;
    --primary-2: #8b5cf6;
    --accent: #22d3ee;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --text: #e5e7eb;
    --text-secondary: #94a3b8;
    --muted: #94a3b8;
    --glass: rgba(255,255,255,0.10);
    --border: rgba(255,255,255,0.28);
    --shadow: 0 12px 30px rgba(0,0,0,0.30);
    --radius: 16px;
    --radius-sm: 12px;
    --ring: 0 0 0 3px rgba(99,102,241,0.25);
    --transition: all .2s ease;
    
    /* Mappings for existing components in this file */
    --brand: var(--primary);
    --brand-light: var(--primary-2);
    --ok: var(--success);
    --err: var(--danger);
    --warn: var(--warning);
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

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.15);
    border-radius: 4px;
  }
`;

/* -------------------------------------------------------------------------- */
/* Animations                                                                 */
/* -------------------------------------------------------------------------- */
const fadeInUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(20px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
`;

const scaleIn = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.95);
  }
  to { 
    opacity: 1; 
    transform: scale(1);
  }
`;

/* -------------------------------------------------------------------------- */
/* Layout Components                                                          */
/* -------------------------------------------------------------------------- */
const Page = styled.div`
  min-height: 100vh;
  padding: clamp(20px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Container = styled.div`
  width: 100%; 
  max-width: 1400px;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const Header = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

const PageTitle = styled.h1`
  margin: 0 0 8px 0;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #48dbfb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

const PageSubtitle = styled.p`
  margin: 8px 0 0 0;
  color: var(--text-secondary);
  font-size: clamp(0.9rem, 1.8vw, 1rem);
  font-weight: 400;
`;

/* -------------------------------------------------------------------------- */
/* Search & Filter Bar                                                        */
/* -------------------------------------------------------------------------- */
const SearchBar = styled.div`
  width: 100%;
  margin-bottom: 32px;
  padding: 20px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.05);
    border-color: rgba(255,255,255,0.12);
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 16px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  pointer-events: none;
  z-index: 2;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  background: rgba(0,0,0,0.3);
  color: var(--text);
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--brand);
    background: rgba(0,0,0,0.4);
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder { 
    color: var(--text-secondary);
    font-weight: 400;
  }
`;

const FilterRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 16px;
`;

const FilterGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const FilterLabel = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FilterButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props.$active ? props.$color : 'rgba(255,255,255,0.12)'};
  border-radius: 10px;
  background: ${props => props.$active
    ? `linear-gradient(135deg, ${props.$color}22, ${props.$color}11)`
    : 'rgba(255,255,255,0.03)'};
  color: ${props => props.$active ? props.$color : 'var(--text-secondary)'};
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: ${props => `linear-gradient(135deg, ${props.$color}22, ${props.$color}11)`};
    border-color: ${props => props.$color};
    color: ${props => props.$color};
    transform: translateY(-2px);
  }
`;

const StatsBar = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
`;

const Stat = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  font-size: 0.85rem;
  color: var(--text-secondary);
  font-weight: 500;
  
  strong {
    color: var(--text);
    font-weight: 700;
    font-size: 1rem;
  }
`;

/* -------------------------------------------------------------------------- */
/* Compact Grid                                                               */
/* -------------------------------------------------------------------------- */
const Grid = styled.div`
  width: 100%;
  display: grid; 
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

/* -------------------------------------------------------------------------- */
/* Compact Card - Smaller Image                                              */
/* -------------------------------------------------------------------------- */
const Card = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  box-shadow: var(--shadow-md);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  animation: ${scaleIn} 0.4s ease-out both;
  animation-delay: ${props => props.delay || '0s'};
  cursor: pointer;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(102,126,234,0.1), rgba(118,75,162,0.1));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 48px rgba(0,0,0,0.5);
    border-color: rgba(102, 126, 234, 0.4);
    
    &::before {
      opacity: 1;
    }
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--brand), var(--brand-light));
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.08);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--brand), var(--brand-light));
  font-size: 3rem;
  color: white;
  font-weight: 700;
`;

const StatusOverlay = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
  z-index: 1;
`;

const StatusBadge = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.$active ? 'var(--ok)' : 'var(--err)'};
  border: 2px solid rgba(255,255,255,0.9);
  box-shadow: 0 2px 8px rgba(0,0,0,0.3), 
              0 0 16px ${p => p.$active ? 'rgba(0,217,163,0.6)' : 'rgba(255,71,87,0.6)'};
  animation: ${pulse} 2s ease-in-out infinite;
`;

const EncodingBadge = styled.div`
  padding: 4px 10px;
  background: ${p => p.$encoded ? 'rgba(0,217,163,0.95)' : 'rgba(255,184,0,0.95)'};
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  backdrop-filter: blur(4px);
`;

const CardBody = styled.div`
  padding: 16px;
  position: relative;
  z-index: 1;
`;

const Name = styled.h3`
  margin: 0 0 4px 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--text);
  letter-spacing: -0.2px;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Role = styled.p`
  margin: 0 0 2px 0;
  color: var(--brand);
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0;
  font-size: 0.75rem;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  span {
    font-size: 0.85rem;
  }
`;

const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  margin: 12px 0;
`;

const Button = styled.button`
  width: 100%;
  height: 40px;
  margin-top: 12px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--brand) 0%, var(--brand-light) 100%);
  color: white;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 24px rgba(102, 126, 234, 0.4);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  display: inline-block;
  animation: ${spin} 0.6s linear infinite;
`;

/* -------------------------------------------------------------------------- */
/* Empty States                                                               */
/* -------------------------------------------------------------------------- */
const Empty = styled.div`
  width: 100%;
  text-align: center;
  color: var(--text-secondary);
  padding: 60px 24px;
  font-size: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.4;
`;

const hasValue = (v) => v !== undefined && v !== null && String(v).trim() !== "";

/* -------------------------------------------------------------------------- */
/* Employee Card Component                                                    */
/* -------------------------------------------------------------------------- */
const EmployeeCard = ({ emp, onEncode, index }) => {
  const [busy, setBusy] = useState(false);

  const canEncode = hasValue(emp.profileImage) && !busy;

  const doEncode = async (e) => {
    e.stopPropagation();
    if (!canEncode) return;
    setBusy(true);
    try {
      await onEncode(emp.employeeId);
    } finally {
      setBusy(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card delay={`${index * 0.03}s`}>
      <ImageWrapper>
        {emp.profileImage ? (
          <ProfileImage src={emp.profileImage} alt={emp.employeeName || "Employee"} />
        ) : (
          <ImagePlaceholder>{getInitials(emp.employeeName)}</ImagePlaceholder>
        )}
        <StatusOverlay>
          <StatusBadge $active={emp.is_active} title={emp.is_active ? 'Active' : 'Inactive'} />
          <EncodingBadge $encoded={emp.encodingStatus === 'Encoded'}>
            {emp.encodingStatus === 'Encoded' ? '✓' : '⏳'}
          </EncodingBadge>
        </StatusOverlay>
      </ImageWrapper>

      <CardBody>
        <Name title={emp.employeeName}>{emp.employeeName || "Unknown"}</Name>
        <Role title={emp.department}>{emp.department || "No Role"}</Role>

        <Divider />

        <InfoLine>
          <span>🆔</span> {emp.employeeId || "-"}
        </InfoLine>

        {emp.department && (
          <InfoLine title={emp.department}>
            <span>🏢</span> {emp.department}
          </InfoLine>
        )}

        {emp.age && (
          <InfoLine>
            <span>🎂</span> {emp.age} years
            {emp.gender && ` • ${emp.gender === 'male' ? '👨' : '👩'}`}
          </InfoLine>
        )}

        <Button onClick={doEncode} disabled={!canEncode}>
          {busy && <Spinner />}
          {emp.encodingStatus === 'Encoded' ? "🔄 Update" : "✨ Encode"}
        </Button>
      </CardBody>
    </Card>
  );
};

/* -------------------------------------------------------------------------- */
/* Main Employee List Component                                               */
/* -------------------------------------------------------------------------- */
const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [encodingFilter, setEncodingFilter] = useState('all'); // 'all', 'encoded', 'pending'
  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await axios.get(`${HRbaseurl}employees_from_global/`);
        const rows = Array.isArray(res.data) ? res.data : [];
        const normalized = rows.map(r => ({
          employeeId: r.employeeId || r.employee_id,
          employeeName: r.employeeName || r.employee_name,
          profileImage: r.profileImage || r.profile_image,
          department: r.department,
          designation: r.designation,
          primaryRole: r.primaryRole || r.primary_role,
          email: r.email,
          mobileNumber: r.mobileNumber || r.mobile_number,
          age: r.age,
          gender: r.gender,
          is_active: r.is_active ?? false,
          encodingStatus: r.encodingStatus || r.encoding_status,
          current_face_encoding: r.current_face_encoding ?? null,
        }));
        if (mounted) setEmployees(normalized);
      } catch (err) {
        if (mounted) setError("Failed to load employees");
        console.error("Error fetching employees:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const filteredEmployees = useMemo(() => {
    let filtered = employees.filter(emp => hasValue(emp.profileImage));

    // Apply active/inactive filter
    if (activeFilter === 'active') {
      filtered = filtered.filter(emp => emp.is_active);
    } else if (activeFilter === 'inactive') {
      filtered = filtered.filter(emp => !emp.is_active);
    }

    // Apply encoding filter
    if (encodingFilter === 'encoded') {
      filtered = filtered.filter(emp => emp.encodingStatus === 'Encoded');
    } else if (encodingFilter === 'pending') {
      filtered = filtered.filter(emp => emp.encodingStatus !== 'Encoded');
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(emp => {
        const matchesName = (emp.employeeName || "").toLowerCase().includes(query);
        const matchesId = (String(emp.employeeId) || "").toLowerCase().includes(query);
        const matchesDept = (emp.department || "").toLowerCase().includes(query);
        const matchesEmail = (emp.email || "").toLowerCase().includes(query);
        const matchesRole = (emp.primaryRole || "").toLowerCase().includes(query);
        return matchesName || matchesId || matchesDept || matchesEmail || matchesRole;
      });
    }

    return filtered;
  }, [employees, searchQuery, activeFilter, encodingFilter]);

  const stats = useMemo(() => {
    const total = filteredEmployees.length;
    const active = filteredEmployees.filter(e => e.is_active).length;
    const encoded = filteredEmployees.filter(e => e.encodingStatus === 'Encoded').length;
    return { total, active, encoded };
  }, [filteredEmployees]);

  const encodeOne = async (employeeId) => {
    try {
      const res = await axios.post(
        `${HRbaseurl}employees/${employeeId}/encode_face/`
      );
      const { is_active, current_face_encoding } = res.data || {};
      setEmployees((prevEmployees) =>
        prevEmployees.map((emp) =>
          emp.employeeId === employeeId
            ? {
              ...emp,
              is_active: Boolean(is_active),
              encodingStatus: 'Encoded',
              current_face_encoding: current_face_encoding ?? true,
            }
            : emp
        )
      );
      return res.data;
    } catch (err) {
      alert(err?.response?.data?.error || "Failed to generate encoding");
      throw err;
    }
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        <Container>
          <Header>
            <PageTitle>Employee Directory</PageTitle>
            <PageSubtitle>Facial recognition management</PageSubtitle>
          </Header>

          <SearchBar>
            <SearchInputWrapper>
              <SearchIcon>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search by name, ID, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInputWrapper>

            <FilterRow>
              <FilterGroup>
                <FilterLabel>Status:</FilterLabel>
                <FilterButton
                  $active={activeFilter === 'all'}
                  $color="#667eea"
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </FilterButton>
                <FilterButton
                  $active={activeFilter === 'active'}
                  $color="#00d9a3"
                  onClick={() => setActiveFilter('active')}
                >
                  ✓ Active
                </FilterButton>
                <FilterButton
                  $active={activeFilter === 'inactive'}
                  $color="#ff4757"
                  onClick={() => setActiveFilter('inactive')}
                >
                  ✕ Inactive
                </FilterButton>
              </FilterGroup>

              <FilterGroup>
                <FilterLabel>Encoding:</FilterLabel>
                <FilterButton
                  $active={encodingFilter === 'all'}
                  $color="#667eea"
                  onClick={() => setEncodingFilter('all')}
                >
                  All
                </FilterButton>
                <FilterButton
                  $active={encodingFilter === 'encoded'}
                  $color="#00d9a3"
                  onClick={() => setEncodingFilter('encoded')}
                >
                  🔐 Encoded
                </FilterButton>
                <FilterButton
                  $active={encodingFilter === 'pending'}
                  $color="#ffb800"
                  onClick={() => setEncodingFilter('pending')}
                >
                  ⏳ Pending
                </FilterButton>
              </FilterGroup>
            </FilterRow>

            <StatsBar>
              <Stat>
                <span>👥</span> Total <strong>{stats.total}</strong>
              </Stat>
              <Stat>
                <span>✅</span> Active <strong>{stats.active}</strong>
              </Stat>
              <Stat>
                <span>🔐</span> Encoded <strong>{stats.encoded}</strong>
              </Stat>
            </StatsBar>
          </SearchBar>

          {loading && (
            <Empty>
              <Spinner style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
              <p style={{ marginTop: '20px', fontWeight: 500 }}>Loading employees...</p>
            </Empty>
          )}

          {!loading && error && (
            <Empty>
              <EmptyIcon>⚠️</EmptyIcon>
              <p style={{ fontWeight: 500 }}>{error}</p>
            </Empty>
          )}

          {!loading && !error && filteredEmployees.length === 0 && (
            <Empty>
              <EmptyIcon>🔍</EmptyIcon>
              <p style={{ fontWeight: 500 }}>No employees found.</p>
            </Empty>
          )}

          {!loading && !error && filteredEmployees.length > 0 && (
            <Grid>
              {filteredEmployees.map((emp, index) => (
                <EmployeeCard
                  key={emp.employeeId}
                  emp={emp}
                  onEncode={encodeOne}
                  index={index}
                />
              ))}
            </Grid>
          )}
        </Container>
      </Page>
    </>
  );
};

export default EmployeeList;
