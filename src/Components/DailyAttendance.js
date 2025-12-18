import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import {
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Search,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Filter,
  ArrowUpDown
} from 'lucide-react';

// --- Styles (Consistent with AttendanceReport) ---
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
    --muted: #94a3b8;
    --glass: rgba(30, 41, 59, 0.7);
    --border: rgba(255,255,255,0.1);
    --radius: 16px;
  }
`;

const Page = styled.div`
  min-height: 100vh;
  padding: 24px;
  color: var(--text);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const TitleBlock = styled.div``;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 14px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.$color || 'var(--primary)'};
  }
`;

const StatLabel = styled.div`
  color: var(--muted);
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: var(--text);
`;

const MainCard = styled.div`
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
`;

const Toolbar = styled.div`
  padding: 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
`;

const LeftToolbar = styled.div`
    display: flex;
    gap: 12px;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
`;

const DatePickerWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(0,0,0,0.2);
  padding: 4px 12px;
  border: 1px solid var(--border);
  border-radius: 10px;
  
  input {
      background: transparent;
      border: none;
      color: var(--text);
      font-size: 14px;
      padding: 8px;
      outline: none;
      
      &::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
      }
  }
`;


const SearchBox = styled.div`
  position: relative;
  min-width: 240px;

  input {
    width: 100%;
    background: rgba(0,0,0,0.2);
    border: 1px solid var(--border);
    padding: 12px 16px 12px 40px;
    border-radius: 10px;
    color: var(--text);
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: var(--primary);
      background: rgba(0,0,0,0.4);
    }
  }

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
  }
`;

const SelectBox = styled.select`
  background: rgba(0,0,0,0.2);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 12px 16px;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  
  option {
      background: var(--bg2);
      color: var(--text);
  }
`;

const RefreshBtn = styled.button`
  background: var(--primary);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    filter: brightness(1.1);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px 24px;
  color: var(--muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 1px solid var(--border);
  background: rgba(0,0,0,0.2);
  cursor: pointer;
  user-select: none;
  
  &:hover {
      color: var(--text);
      background: rgba(255,255,255,0.05);
  }
  
  svg {
      vertical-align: middle;
      margin-left: 6px;
      opacity: 0.5;
  }
`;

const Tr = styled.tr`
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
  
  &:hover {
    background: rgba(255,255,255,0.03);
  }
`;

const Td = styled.td`
  padding: 16px 24px;
`;

const StatusTag = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  
  ${props => props.$status === 'late' && `
    background: rgba(245, 158, 11, 0.15);
    color: #fbbf24;
    border: 1px solid rgba(245, 158, 11, 0.3);
  `}
  
  ${props => props.$status === 'ontime' && `
    background: rgba(16, 185, 129, 0.15);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.3);
  `}

  ${props => props.$status === 'out' && `
    background: rgba(99, 102, 241, 0.15);
    color: #818cf8;
    border: 1px solid rgba(99, 102, 241, 0.3);
  `}

  ${props => props.$status === 'absent' && `
    background: rgba(239, 68, 68, 0.15);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.3);
  `}
`;

const TimeDisplay = styled.div`
  font-variant-numeric: tabular-nums;
  font-weight: 500;
  color: var(--text);
`;

const EmpName = styled.div`
  font-weight: 600;
  color: var(--text);
`;
const EmpMeta = styled.div`
  font-size: 12px;
  color: var(--muted);
  margin-top: 2px;
`;

const EmptyState = styled.div`
  padding: 60px;
  text-align: center;
  color: var(--muted);
`;

const CurrentDate = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.05);
  padding: 8px 16px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid var(--border);
`;

export default function DailyAttendance() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for Filters & Sorting
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'firstIn', direction: 'asc' });

  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  const fetchData = async () => {
    setLoading(true);
    try {
      // Logic: From SelectedDate 00:00 to Next Day 00:00
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      const ymd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const res = await axios.get(`${HRbaseurl}attendance-report/`, {
        params: {
          from_date: ymd(start),
          to_date: ymd(end)
        }
      });

      setData(res.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Only auto-refresh if looking at Today
    const todayStr = new Date().toISOString().split('T')[0];
    let interval;
    if (selectedDate === todayStr) {
      interval = setInterval(fetchData, 60000);
    }
    return () => {
      if (interval) clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Process Data for View
  const processed = useMemo(() => {
    const map = new Map();
    const isToday = new Date(selectedDate).toDateString() === new Date().toDateString();

    const sorted = [...data].sort((a, b) => new Date(a.attendence_time) - new Date(b.attendence_time));

    sorted.forEach(record => {
      if (!map.has(record.employee_id)) {
        map.set(record.employee_id, {
          ...record,
          firstIn: null,
          lastOut: null,
          lastPunch: null,
          status: 'absent',
          totalMs: 0,
          pendingInTime: null
        });
      }

      const emp = map.get(record.employee_id);
      emp.lastPunch = record.attendence_time;

      if (record.attendence_type === 'IN') {
        if (!emp.firstIn) emp.firstIn = record.attendence_time;
        emp.status = 'present';
        emp.pendingInTime = record.attendence_time; // Keep for 'isToday' check if needed, though we'll use firstIn
      } else if (record.attendence_type === 'OUT') {
        emp.lastOut = record.attendence_time;
        emp.status = 'out';
        emp.pendingInTime = null;
      }
      // Update device
      emp.device_id = record.device_id;
    });

    return Array.from(map.values()).map(emp => {
      if (emp.firstIn) {
        let endTime = new Date(emp.lastPunch);

        // If currently checked in and it's today, show running time from First In
        if (emp.status === 'present' && isToday) {
          endTime = new Date();
        }

        // Calculate gross duration: End Time - First In
        // This ignores breaks (intermediary checkouts)
        const duration = endTime - new Date(emp.firstIn);
        emp.totalMs = duration > 0 ? duration : 0;
      } else {
        emp.totalMs = 0;
      }

      emp.workHours = emp.totalMs / (1000 * 60 * 60); // Convert to hours
      return emp;
    });
  }, [data, selectedDate]);

  // Derived Filters
  const departments = useMemo(() => {
    const depts = new Set(processed.map(p => p.department).filter(Boolean));
    return ['All', ...Array.from(depts)];
  }, [processed]);

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let result = processed;

    // Filter: Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.employee_name.toLowerCase().includes(q) ||
        p.employee_id.toLowerCase().includes(q)
      );
    }

    // Filter: Department
    if (departmentFilter !== 'All') {
      result = result.filter(p => p.department === departmentFilter);
    }

    // Filter: Status (Custom logic based on status string or lateness)
    if (statusFilter !== 'All') {
      result = result.filter(p => {
        const isLate = p.firstIn && (new Date(p.firstIn).getHours() + new Date(p.firstIn).getMinutes() / 60) > 9.25;
        const currentStatus = p.status === 'present' ? (isLate ? 'late' : 'ontime') : p.status;

        if (statusFilter === 'Late') return currentStatus === 'late';
        if (statusFilter === 'On Time') return currentStatus === 'ontime';
        if (statusFilter === 'Checked Out') return currentStatus === 'out';
        if (statusFilter === 'Working') return p.status === 'present';
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      // Handle nulls
      if (valA === null || valA === undefined) valA = '';
      if (valB === null || valB === undefined) valB = '';

      // Special handling for dates
      if (sortConfig.key === 'firstIn' || sortConfig.key === 'lastPunch') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      }

      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [processed, search, departmentFilter, statusFilter, sortConfig]);


  // Stats
  const stats = useMemo(() => {
    return {
      total: processed.length,
      present: processed.filter(p => p.status === 'present').length,
      out: processed.filter(p => p.status === 'out').length,
      late: processed.filter(p => {
        if (!p.firstIn) return false;
        const d = new Date(p.firstIn);
        const hour = d.getHours() + d.getMinutes() / 60;
        return hour > 9.25;
      }).length
    };
  }, [processed]);

  const onTime = stats.total - stats.late;

  // Handlers
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const fmtTime = (t) => t ? new Date(t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-';

  return (
    <>
      <GlobalStyle />
      <Page>
        <Container>
          <Header>
            <TitleBlock>
              <Title>
                <Clock size={32} />
                Daily Attendance
              </Title>
              <Subtitle>Monitor daily check-ins, status, and activity</Subtitle>
            </TitleBlock>

            <CurrentDate>
              <Calendar size={16} />
              {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </CurrentDate>
          </Header>

          <StatsGrid>
            <StatCard $color="#6366f1">
              <StatLabel><Users size={16} /> Total Present</StatLabel>
              <StatValue>{stats.total}</StatValue>
            </StatCard>

            <StatCard $color="#10b981">
              <StatLabel><CheckCircle size={16} /> On Time</StatLabel>
              <StatValue>{onTime}</StatValue>
            </StatCard>

            <StatCard $color="#f59e0b">
              <StatLabel><AlertTriangle size={16} /> Late Arrivals</StatLabel>
              <StatValue>{stats.late}</StatValue>
            </StatCard>

            <StatCard $color="#22d3ee">
              <StatLabel><RefreshCw size={16} /> Currently Active</StatLabel>
              <StatValue>{stats.present}</StatValue>
            </StatCard>
          </StatsGrid>

          <MainCard>
            <Toolbar>
              <LeftToolbar>
                <DatePickerWrapper>
                  <Calendar size={16} color="var(--muted)" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </DatePickerWrapper>

                <SearchBox>
                  <Search size={18} />
                  <input
                    placeholder="Search employee or ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </SearchBox>

                <SelectBox
                  value={departmentFilter}
                  onChange={e => setDepartmentFilter(e.target.value)}
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>
                  ))}
                </SelectBox>

                <SelectBox
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Working">Working</option>
                  <option value="Checked Out">Checked Out</option>
                  <option value="Late">Late</option>
                  <option value="On Time">On Time</option>
                </SelectBox>
              </LeftToolbar>

              <RefreshBtn onClick={fetchData} disabled={loading}>
                <RefreshCw size={18} className={loading ? 'spin' : ''} />
                Refresh
              </RefreshBtn>
            </Toolbar>

            {filteredAndSorted.length === 0 ? (
              <EmptyState>No attendance records found for this date.</EmptyState>
            ) : (
              <Table>
                <thead>
                  <tr>
                    <Th onClick={() => handleSort('employee_name')}>
                      Employee
                      {sortConfig.key === 'employee_name' && <ArrowUpDown size={12} />}
                    </Th>
                    <Th onClick={() => handleSort('department')}>
                      Department
                      {sortConfig.key === 'department' && <ArrowUpDown size={12} />}
                    </Th>
                    <Th onClick={() => handleSort('firstIn')}>
                      First Login
                      {sortConfig.key === 'firstIn' && <ArrowUpDown size={12} />}
                    </Th>
                    <Th onClick={() => handleSort('lastPunch')}>
                      Last Activity
                      {sortConfig.key === 'lastPunch' && <ArrowUpDown size={12} />}
                    </Th>
                    <Th onClick={() => handleSort('workHours')}>
                      Work Hours
                      {sortConfig.key === 'workHours' && <ArrowUpDown size={12} />}
                    </Th>
                    <Th>Status</Th>
                    <Th>Device</Th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSorted.map(emp => {
                    const isLate = emp.firstIn && (new Date(emp.firstIn).getHours() + new Date(emp.firstIn).getMinutes() / 60) > 9.25;

                    return (
                      <Tr key={emp.employee_id}>
                        <Td>
                          <EmpName>{emp.employee_name}</EmpName>
                          <EmpMeta>#{emp.employee_id}</EmpMeta>
                        </Td>
                        <Td>
                          {emp.department || '-'}
                          <EmpMeta>{emp.designation}</EmpMeta>
                        </Td>
                        <Td>
                          <TimeDisplay>
                            {fmtTime(emp.firstIn)}
                            {isLate && <span style={{ marginLeft: 8, fontSize: 10, color: '#f59e0b', fontWeight: 700 }}>LATE</span>}
                          </TimeDisplay>
                        </Td>
                        <Td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {emp.attendence_type === 'IN' ? <ArrowDownLeft size={14} color="#10b981" /> : <ArrowUpRight size={14} color="#f59e0b" />}
                            <TimeDisplay>{fmtTime(emp.lastPunch)}</TimeDisplay>
                          </div>
                        </Td>
                        <Td>
                          <span style={{ fontWeight: 600, color: emp.workHours >= 8 ? '#10b981' : 'var(--text)' }}>
                            {emp.workHours.toFixed(2)} hrs
                          </span>
                        </Td>
                        <Td>
                          <StatusTag $status={emp.status === 'present' ? (isLate ? 'late' : 'ontime') : 'out'}>
                            {emp.status === 'present' ? 'Working' : 'Checked Out'}
                          </StatusTag>
                        </Td>
                        <Td style={{ fontSize: 13, color: 'var(--muted)' }}>
                          {emp.device_id}
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </MainCard>
        </Container>
      </Page>
    </>
  );
}
