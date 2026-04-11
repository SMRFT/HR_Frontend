import React, { useState, useEffect, useMemo } from 'react';
import api from '../api';
import styled from 'styled-components';
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
  ArrowUpDown,
  Search as SearchIcon,
  Download
} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  border-radius: var(--radius);
  color: white;
  font-weight: 600;
  gap: 12px;
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
  .react-datepicker-wrapper {
    width: auto;
  }
`;

const CustomDateInput = React.forwardRef(({ value, onClick, label }, ref) => (
  <div
    onClick={onClick}
    ref={ref}
    style={{
      background: 'rgba(0,0,0,0.2)',
      padding: '10px 16px',
      border: '1px solid var(--border)',
      borderRadius: '10px',
      color: 'var(--text)',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      minWidth: '160px'
    }}
  >
    <Calendar size={18} color="var(--primary)" />
    <div>
      <div style={{ fontSize: '10px', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 700 }}>{label}</div>
      {value || "Select Date"}
    </div>
  </div>
));


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
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg2);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--border);
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 20px;
  width: 100%;
`;

const DeptChip = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
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
    transform: translateY(-1px);
  }
`;

/* Top-scroll: flip outer so scrollbar appears at top */
const TableWrapper = styled.div`
  transform: rotateX(180deg);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { height: 8px; }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.25);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.05);
    border-radius: 4px;
  }
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.25) rgba(255,255,255,0.05);
`;

/* Counter-flip so content renders normally */
const TableInner = styled.div`
  transform: rotateX(180deg);
  padding: clamp(12px, 2vw, 20px);
`;

const Table = styled.table`
  width: 100%;
  min-width: 900px;
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
  const [availableCount, setAvailableCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // State for Filters & Sorting
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [search, setSearch] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'firstIn', direction: 'asc' });

  const role = (localStorage.getItem('role') || '').toLowerCase();
  const userDeptId = localStorage.getItem('department_id');
  const userDeptName = (localStorage.getItem('department_name') || '').toLowerCase();

  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  const fetchData = async () => {
    setLoading(true);
    try {
      const ymd = (d) => {
        if (!d) return null;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const params = {
        from_date: ymd(fromDate),
        to_date: ymd(toDate || fromDate)
      };

      const uRole = (localStorage.getItem('role') || '').toLowerCase();
      const uDept = localStorage.getItem('department_id') || localStorage.getItem('dept');

      let deptParam = '';
      if (uRole && uRole !== 'admin' && uDept) {
        params.department = uDept;
        deptParam = `?department=${uDept}`;
      } else if (selectedDepts.length > 0) {
        const dStr = selectedDepts.join(',');
        params.department = dStr;
        deptParam = `?department=${encodeURIComponent(dStr)}`;
      }

      const [res, empRes] = await Promise.all([
          api.get(`attendance-report/`, { params }),
          api.get(`employees_from_global/${deptParam}`)
      ]);

      setData(Array.isArray(res.data) ? res.data : []);
      setAvailableCount(Array.isArray(empRes.data) ? empRes.data.length : 0);
      console.log("DailyAttendance: Fetched", res.data?.length, "records of", empRes.data?.length, "avail");
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Only auto-refresh if looking at Today range
    const todayStr = new Date().toDateString();
    let interval;
    if (fromDate?.toDateString() === todayStr) {
      interval = setInterval(fetchData, 60000);
    }
    return () => {
      if (interval) clearInterval(interval);
    }
  }, [fromDate, toDate, selectedDepts]);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const res = await api.get(`departments/`);
        setDepartments(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Failed to fetch departments", err);
      }
    };
    fetchDepts();
  }, []);

  const toggleDepartment = (deptId) => {
    setSelectedDepts(prev =>
      prev.includes(deptId)
        ? prev.filter(d => d !== deptId)
        : [...prev, deptId]
    );
  };

  const dmy = (d) => {
    if (!d || isNaN(new Date(d).getTime())) return "--/--/----";
    const dateObj = new Date(d);
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const yyyy = dateObj.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const ymd = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleExportExcel = () => {
    const from_date = ymd(fromDate);
    const to_date = ymd(toDate);
    let url = `${HRbaseurl}attendance-report/?from_date=${from_date}&to_date=${to_date}&export=xlsx`;
    if (selectedDepts.length > 0) {
      url += `&department=${selectedDepts.join(',')}`;
    }
    window.open(url, '_blank');
  };

  // Process Data for View
  const processed = useMemo(() => {
    const map = new Map();
    const isSingleDay = fromDate?.toDateString() === toDate?.toDateString();
    const isToday = isSingleDay && fromDate?.toDateString() === new Date().toDateString();

    const sorted = [...data].sort((a, b) => new Date(a.attendence_time) - new Date(b.attendence_time));

    sorted.forEach(record => {
      const eid = String(record.employee_id);
      if (!record.attendence_time) return;

      const attDate = new Date(record.attendence_time);
      if (isNaN(attDate.getTime())) return;

      const recordDate = dmy(attDate);
      const groupKey = `${eid}_${recordDate}`;

      if (!map.has(groupKey)) {
        map.set(groupKey, {
          ...record,
          date: recordDate,
          employee_id: eid,
          firstIn: null,
          lastOut: null,
          lastPunch: null,
          status: 'absent',
          totalMs: 0,
          pendingInTime: null
        });
      }

      const emp = map.get(groupKey);
      emp.lastPunch = record.attendence_time;

      const type = (record.attendence_type || '').toUpperCase();
      if (type === 'IN') {
        if (!emp.firstIn) emp.firstIn = record.attendence_time;
        emp.status = 'present';
        emp.pendingInTime = record.attendence_time;
      } else if (type === 'OUT') {
        emp.lastOut = record.attendence_time;
        emp.status = 'out';
        emp.pendingInTime = null;
      }
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
  }, [data, fromDate, toDate]); // Keep dependencies as is, but ensuring it runs on data change

  // Derived Filters
  const activeDepartments = useMemo(() => {
    const depts = new Set(processed.map(p => p.department).filter(Boolean));
    return ['All', ...Array.from(depts)];
  }, [processed]);

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let result = [...processed];

    // Filter: Search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        String(p.employee_name || '').toLowerCase().includes(q) ||
        String(p.employee_id || '').toLowerCase().includes(q)
      );
    }

    // Default: Show only checked (not absent) records in Daily Attendance
    result = result.filter(p => p.status !== 'absent');

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
  }, [processed, search, selectedDepts, statusFilter, sortConfig, departments]); // Added departments to dependencies


  // Stats
  const stats = useMemo(() => {
    const punchedEmployees = processed.filter(p => p.status !== 'absent');
    const presentCount = punchedEmployees.filter(p => p.status === 'present').length;
    const totalPunched = punchedEmployees.length;
    const lateCount = punchedEmployees.filter(p => {
        if (!p.firstIn) return false;
        const d = new Date(p.firstIn);
        const hour = d.getHours() + d.getMinutes() / 60;
        return hour > 9.25;
      }).length;

    return {
      available: availableCount,
      total: totalPunched, // Total who showed up (status !== absent)
      present: presentCount, // Currently checked-in
      out: punchedEmployees.filter(p => p.status === 'out').length,
      late: lateCount,
      onTime: totalPunched - lateCount,
      absent: Math.max(0, availableCount - totalPunched)
    };
  }, [processed, availableCount]);

  // Handlers
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = direction === 'asc' ? 'desc' : 'asc';
    }
    setSortConfig({ key, direction });
  };

  const fmtTime = (t) => t ? new Date(t).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-';

  return (
    <Page>
      <Container>
        {loading && <LoadingOverlay><RefreshCw className="spin" /> Loading attendance...</LoadingOverlay>}
        
        <Header>
          <TitleBlock>
            <Title>Daily Monitoring</Title>
            <Subtitle>
              Real-time attendance tracking for {activeDepartments.length - 1 || departments.length} departments
            </Subtitle>
          </TitleBlock>

          <CurrentDate>
            <Calendar size={16} />
            {dmy(fromDate)}
            {toDate && toDate.toDateString() !== fromDate?.toDateString() && (
              <> - {dmy(toDate)}</>
            )}
          </CurrentDate>
        </Header>

        <StatsGrid>
          <StatCard $color="var(--primary, #6366f1)">
            <StatLabel><Users size={16} /> Total Available</StatLabel>
            <StatValue>{stats.available}</StatValue>
          </StatCard>

          <StatCard $color="#10b981">
            <StatLabel><CheckCircle size={16} /> Today Total Present</StatLabel>
            <StatValue>{stats.total}</StatValue>
          </StatCard>

          <StatCard $color="#ef4444">
            <StatLabel><AlertTriangle size={16} /> Today Total Absent</StatLabel>
            <StatValue>{stats.absent}</StatValue>
          </StatCard>

          <StatCard $color="#10b981">
            <StatLabel><ArrowUpRight size={16} /> Today On Time</StatLabel>
            <StatValue>{stats.onTime}</StatValue>
          </StatCard>

          <StatCard $color="#f59e0b">
            <StatLabel><Clock size={16} /> Today Late Arrivals</StatLabel>
            <StatValue>{stats.late}</StatValue>
          </StatCard>
        </StatsGrid>

          <MainCard>
            <Toolbar>
              <LeftToolbar>
                <DatePickerWrapper style={{ display: 'flex', gap: '10px' }}>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    customInput={<CustomDateInput label="From" />}
                    dateFormat="MMM d, yyyy"
                    portalId="root"
                  />
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    customInput={<CustomDateInput label="To" />}
                    dateFormat="MMM d, yyyy"
                    portalId="root"
                  />
                </DatePickerWrapper>

                <SearchBox>
                  <SearchIcon size={18} />
                  <input
                    placeholder="Search employee or ID..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </SearchBox>

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

                {(role === 'admin' || !localStorage.getItem('department')) && (
                  <SelectBox
                    value={selectedDepts.length === 0 ? "all" : selectedDepts[0]}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSelectedDepts(val === "all" ? [] : [val]);
                    }}
                  >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </SelectBox>
                )}
              </LeftToolbar>

              <RefreshBtn onClick={fetchData} disabled={loading}>
                <RefreshCw size={18} className={loading ? 'spin' : ''} />
                Refresh
              </RefreshBtn>

              <RefreshBtn
                onClick={handleExportExcel}
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  border: 'none'
                }}
              >
                <Download size={18} />
                Export Excel
              </RefreshBtn>

              {(search || selectedDepts.length > 0 || statusFilter !== 'All') && (
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedDepts([]);
                    setStatusFilter('All');
                    setFromDate(new Date());
                    setToDate(new Date());
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#f87171',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Reset Filters
                </button>
              )}
            </Toolbar>


            {filteredAndSorted.length === 0 ? (
              <EmptyState>
                No attendance records found for this range.
                <div style={{ fontSize: 11, marginTop: 8, opacity: 0.7 }}>
                  (Raw: {data.length}, Processed: {processed.length}, Role: {role})
                </div>
              </EmptyState>
            ) : (
              <TableWrapper><TableInner><Table>
                <thead>
                  <tr>
                    <Th onClick={() => handleSort('employee_name')}>
                      Employee
                      {sortConfig.key === 'employee_name' && <ArrowUpDown size={12} />}
                    </Th>
                    <Th onClick={() => handleSort('date')}>
                      Date
                      {sortConfig.key === 'date' && <ArrowUpDown size={12} />}
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
                      <Tr key={`${emp.employee_id}_${emp.date}`}>
                        <Td>
                          <EmpName>{emp.employee_name}</EmpName>
                          <EmpMeta>#{emp.employee_id}</EmpMeta>
                        </Td>
                        <Td>
                          <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                            {emp.date}
                          </span>
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
                            {(!isNaN(emp.workHours) ? emp.workHours.toFixed(2) : '0.00')} hrs
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
              </Table></TableInner></TableWrapper>
            )}
          </MainCard>
      </Container>
    </Page>
  );
}
