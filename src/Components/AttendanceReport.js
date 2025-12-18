import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CSVLink } from "react-csv";
import styled, { createGlobalStyle } from "styled-components";
import {
  Search,
  Calendar,
  Download,
  Users,
  Clock,
  TrendingUp,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// Global Styles (keeping existing styles)
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
    --glass: rgba(255,255,255,0.10);
    --border: rgba(255,255,255,0.28);
    --shadow: 0 12px 30px rgba(0,0,0,0.30);
    --radius: 16px;
    --radius-sm: 12px;
    --ring: 0 0 0 3px rgba(99,102,241,0.25);
    --transition: all .2s ease;
  }
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; overflow-x: hidden; }
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

  .react-datepicker-wrapper {
    width: 100%;
  }

  .react-datepicker {
    font-family: inherit;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg2);
    box-shadow: var(--shadow);
  }

  .react-datepicker__header {
    background: var(--glass);
    border-bottom: 1px solid var(--border);
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: var(--text);
  }

  .react-datepicker__day {
    color: var(--muted);
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: var(--primary);
    color: white;
  }

  .react-datepicker__day:hover {
    background: var(--primary-2);
    color: white;
  }
`;

// Styled Components (keeping all existing styled components)
const Page = styled.div`
  min-height: 100vh;
  padding: clamp(20px, 4vw, 40px);
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 32px;
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: clamp(24px, 3vw, 32px);
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Subtitle = styled.p`
  margin: 8px 0 0 0;
  color: var(--muted);
  font-size: 14px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 28px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  transition: var(--transition);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  }
`;

const StatLabel = styled.div`
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  color: var(--text);
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
`;

const Card = styled.div`
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid var(--border);
  background: rgba(255,255,255,0.02);
`;

const CardTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
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

const SearchInput = styled.input`
  width: 100%;
  height: 44px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.05);
  color: var(--text);
  border-radius: var(--radius-sm);
  padding: 0 16px 0 44px;
  font-size: 14px;
  transition: var(--transition);

  &::placeholder {
    color: var(--muted);
  }

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: rgba(255,255,255,0.08);
    box-shadow: var(--ring);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted);
  pointer-events: none;
`;

const DatePickerWrapper = styled.div`
  position: relative;
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.05);
  border-radius: var(--radius-sm);
  min-width: 200px;
  transition: var(--transition);

  &:hover {
    border-color: var(--primary);
  }

  input {
    width: 100%;
    border: none;
    background: transparent;
    color: var(--text);
    font-size: 14px;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: var(--muted);
    }
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  height: 44px;
  padding: 0 20px;
  border: 1px solid var(--border);
  background: ${props => props.$primary
    ? 'linear-gradient(135deg, var(--primary), var(--primary-2))'
    : 'rgba(255,255,255,0.05)'};
  color: var(--text);
  font-weight: 600;
  font-size: 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99,102,241,0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  padding: 24px;

  &::-webkit-scrollbar {
    height: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
`;

const THead = styled.thead`
  background: rgba(255,255,255,0.05);
  border-bottom: 2px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TH = styled.th`
  padding: 12px 16px;
  text-align: left;
  color: var(--text);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: nowrap;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  
  &.date-header {
    text-align: center;
    min-width: 90px;
  }
`;

const TBody = styled.tbody``;

const TR = styled.tr`
  border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: var(--transition);
  cursor: pointer;

  &:hover {
    background: rgba(255,255,255,0.05);
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TD = styled.td`
  padding: 14px 16px;
  color: var(--text);
  font-size: 14px;
  white-space: nowrap;
  
  &.date-cell {
    text-align: center;
    font-size: 12px;
    min-width: 90px;
    background: ${props => {
    if (props.$status === 'present') return 'rgba(16, 185, 129, 0.1)';
    if (props.$status === 'late') return 'rgba(245, 158, 11, 0.1)';
    if (props.$status === 'half-day') return 'rgba(245, 158, 11, 0.15)';
    if (props.$status === 'absent') return 'rgba(255, 255, 255, 0.05)';
    return 'transparent';
  }};
    border: 1px solid ${props => {
    if (props.$status === 'present') return 'rgba(16, 185, 129, 0.2)';
    if (props.$status === 'late') return 'rgba(245, 158, 11, 0.2)';
    if (props.$status === 'half-day') return 'rgba(245, 158, 11, 0.3)';
    if (props.$status === 'absent') return 'rgba(255, 255, 255, 0.1)';
    return 'transparent';
  }};
  }

  &.employee-cell {
    position: sticky;
    left: 0;
    background: var(--bg1);
    z-index: 5;
    min-width: 200px;
  }
`;

const EmployeeInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EmployeeName = styled.div`
  font-weight: 700;
  color: var(--text);
`;

const EmployeeMeta = styled.div`
  font-size: 12px;
  color: var(--muted);
`;

const AttendanceCell = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const TimeLabel = styled.span`
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  
  color: ${props => props.$type === 'IN' ? 'var(--success)' : 'var(--primary)'};
  background: ${props => props.$type === 'IN' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(99, 102, 241, 0.12)'};
`;

const HoursLabel = styled.div`
  font-size: 12px;
  font-weight: 800;
  margin: 3px 0;
  padding: 3px 8px;
  border-radius: 6px;
  
  color: ${props => {
    if (props.$hours >= 8) return 'var(--success)';
    if (props.$hours >= 4) return 'var(--warning)';
    return 'var(--danger)';
  }};
  
  background: ${props => {
    if (props.$hours >= 8) return 'rgba(16, 185, 129, 0.15)';
    if (props.$hours >= 4) return 'rgba(245, 158, 11, 0.15)';
    return 'rgba(239, 68, 68, 0.15)';
  }};
  
  border: 1px solid ${props => {
    if (props.$hours >= 8) return 'rgba(16, 185, 129, 0.3)';
    if (props.$hours >= 4) return 'rgba(245, 158, 11, 0.3)';
    return 'rgba(239, 68, 68, 0.3)';
  }};
`;

const StatusLabel = styled.div`
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 3px 8px;
  border-radius: 5px;
  
  color: ${props => {
    if (props.$type === 'present') return '#10b981';
    if (props.$type === 'late' || props.$type === 'half-day') return '#f59e0b';
    if (props.$type === 'absent') return 'var(--muted)';
    return 'var(--muted)';
  }};
  
  background: ${props => {
    if (props.$type === 'present') return 'rgba(16, 185, 129, 0.15)';
    if (props.$type === 'late' || props.$type === 'half-day') return 'rgba(245, 158, 11, 0.15)';
    if (props.$type === 'absent') return 'rgba(255, 255, 255, 0.08)';
    return 'transparent';
  }};
  
  border: 1px solid ${props => {
    if (props.$type === 'present') return 'rgba(16, 185, 129, 0.3)';
    if (props.$type === 'late') return 'rgba(245, 158, 11, 0.3)';
    if (props.$type === 'half-day') return 'rgba(245, 158, 11, 0.4)';
    if (props.$type === 'absent') return 'rgba(255, 255, 255, 0.15)';
    return 'transparent';
  }};
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: var(--transition);

  &:hover {
    color: var(--primary);
  }
`;

const DetailRow = styled.tr`
  background: rgba(255,255,255,0.02);
`;

const DetailCell = styled.td`
  padding: 12px 16px !important;
  font-size: 12px;
  color: var(--muted);
`;

const EmptyState = styled.div`
  padding: 80px 20px;
  text-align: center;
  color: var(--muted);
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 0.8s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px;
`;

// Helper Functions
const ymd = (d) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const monthRange = (d) => {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const getDaysInMonth = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = new Date(year, month, i + 1);
    return {
      date: day,
      dayNum: i + 1,
      dateStr: ymd(day)
    };
  });
};

const fmtTime = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

// NEW: Calculate work hours with day lapping support
const calculateWorkHours = (inTime, outTime) => {
  if (!inTime || !outTime) return 0;
  const inDate = new Date(inTime);
  const outDate = new Date(outTime);

  // Calculate difference in milliseconds
  let diffMs = outDate - inDate;

  // If OUT time is before IN time (negative), it's an overnight shift
  // Example: IN at 21:00, OUT at 06:00 next day
  if (diffMs < 0) {
    // This shouldn't happen if data is correct, but handle gracefully
    // by adding 24 hours
    diffMs += (24 * 60 * 60 * 1000);
  }

  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.max(0, Math.min(diffHours, 24)); // Cap at 24 hours max
};

// NEW: Enhanced status calculation with single punch detection
const getAttendanceStatus = (inTime, outTime, workHours) => {
  const STANDARD_START_TIME = 9; // 8:30 AM
  const HALF_DAY_HOURS = 4;
  const FULL_DAY_HOURS = 8;

  // NEW: Single punch detection (only IN or only OUT = Half Day)
  if (inTime && !outTime) {
    return { status: 'Absent', label: 'Absent (No OUT)' };
  }

  if (!inTime && outTime) {
    return { status: 'Absent', label: 'Absent (No IN)' };
  }

  // No punches at all
  if (!inTime && !outTime) {
    return { status: 'absent', label: 'Absent' };
  }

  // Both IN and OUT present - calculate based on hours
  const inDate = new Date(inTime);
  const inHour = inDate.getHours() + inDate.getMinutes() / 60;

  const isLate = inHour > STANDARD_START_TIME;

  if (workHours < HALF_DAY_HOURS) {
    return { status: 'half-day', label: 'Absent (<4h)' };
  } else if (workHours < FULL_DAY_HOURS) {
    return { status: 'half-day', label: isLate ? 'Late/Half Day' : 'Half Day' };
  } else {
    return { status: isLate ? 'late' : 'present', label: isLate ? 'Late' : 'Present' };
  }
};

// Main Component
export default function AttendanceReport() {
  const [searchQuery, setSearchQuery] = useState("");
  const [month, setMonth] = useState(new Date());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;
  useEffect(() => {
    fetchData();
  }, [month]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { start, end } = monthRange(month);
      const res = await axios.get(
        `${HRbaseurl}attendance-report/`,
        {
          params: {
            from_date: ymd(start),
            to_date: ymd(end),
          },
        }
      );
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching attendance:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Enhanced data processing with day lapping and single punch detection
  const processedData = useMemo(() => {
    const employeeMap = new Map();

    // First pass: collect all punches
    data.forEach(record => {
      const empId = record.employee_id;
      if (!employeeMap.has(empId)) {
        employeeMap.set(empId, {
          employee_id: empId,
          employee_name: record.employee_name,
          department: record.department,
          designation: record.designation,
          attendance: new Map(),
          allRecords: []
        });
      }

      const employee = employeeMap.get(empId);
      employee.allRecords.push(record);
    });

    // Second pass: process shifts with day lapping logic
    employeeMap.forEach((employee) => {
      const sortedRecords = employee.allRecords.sort((a, b) =>
        new Date(a.attendence_time) - new Date(b.attendence_time)
      );

      let pendingIn = null;

      sortedRecords.forEach(record => {
        const recordDate = new Date(record.attendence_time);
        const dateStr = ymd(recordDate);

        if (record.attendence_type === 'IN') {
          // Store IN punch, waiting for matching OUT
          pendingIn = record;

          // Also ensure this date has an entry
          if (!employee.attendance.has(dateStr)) {
            employee.attendance.set(dateStr, {
              in: record.attendence_time,
              out: null,
              records: [record],
              workHours: 0,
              status: null
            });
          } else {
            const dayData = employee.attendance.get(dateStr);
            if (!dayData.in || new Date(record.attendence_time) < new Date(dayData.in)) {
              dayData.in = record.attendence_time;
            }
            dayData.records.push(record);
          }
        } else if (record.attendence_type === 'OUT') {
          if (pendingIn) {
            // Match OUT with previous IN
            const inDate = new Date(pendingIn.attendence_time);
            const outDate = new Date(record.attendence_time);
            const inDateStr = ymd(inDate);

            // Assign shift to IN date (even if OUT is next day)
            if (!employee.attendance.has(inDateStr)) {
              employee.attendance.set(inDateStr, {
                in: pendingIn.attendence_time,
                out: record.attendence_time,
                records: [pendingIn, record],
                workHours: 0,
                status: null
              });
            } else {
              const dayData = employee.attendance.get(inDateStr);
              dayData.out = record.attendence_time;
              dayData.records.push(record);
            }

            pendingIn = null;
          } else {
            // OUT without IN (single punch)
            if (!employee.attendance.has(dateStr)) {
              employee.attendance.set(dateStr, {
                in: null,
                out: record.attendence_time,
                records: [record],
                workHours: 0,
                status: null
              });
            } else {
              const dayData = employee.attendance.get(dateStr);
              if (!dayData.out || new Date(record.attendence_time) > new Date(dayData.out)) {
                dayData.out = record.attendence_time;
              }
              dayData.records.push(record);
            }
          }
        }
      });

      // Calculate hours and status for each day
      employee.attendance.forEach((dayData) => {
        if (dayData.in && dayData.out) {
          dayData.workHours = calculateWorkHours(dayData.in, dayData.out);
          dayData.status = getAttendanceStatus(dayData.in, dayData.out, dayData.workHours);
        } else if (dayData.in || dayData.out) {
          // Single punch - Half Day
          dayData.status = getAttendanceStatus(dayData.in, dayData.out, 0);
        }
      });
    });

    return Array.from(employeeMap.values());
  }, [data]);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery.trim()) return processedData;

    const query = searchQuery.toLowerCase();
    return processedData.filter(emp =>
      (emp.employee_id || '').toLowerCase().includes(query) ||
      (emp.employee_name || '').toLowerCase().includes(query) ||
      (emp.department || '').toLowerCase().includes(query) ||
      (emp.designation || '').toLowerCase().includes(query)
    );
  }, [processedData, searchQuery]);

  const daysInMonth = useMemo(() => getDaysInMonth(month), [month]);

  const stats = useMemo(() => {
    const uniqueEmployees = processedData.length;
    const totalRecords = data.length;
    const totalPresentDays = processedData.reduce((sum, emp) => {
      return sum + Array.from(emp.attendance.values()).filter(day =>
        day.status && day.status.status !== 'absent'
      ).length;
    }, 0);
    const avgAttendance = uniqueEmployees > 0
      ? (totalPresentDays / (uniqueEmployees * daysInMonth.length) * 100).toFixed(1)
      : 0;

    return {
      uniqueEmployees,
      totalRecords,
      totalPresentDays,
      avgAttendance
    };
  }, [processedData, data, daysInMonth]);

  const csvHeaders = [
    { label: "Employee ID", key: "employee_id" },
    { label: "Employee Name", key: "employee_name" },
    { label: "Department", key: "department" },
    { label: "Designation", key: "designation" },
    ...daysInMonth.map(day => ({
      label: `${day.dayNum}`,
      key: `day_${day.dayNum}`
    })),
    { label: "Total Working Hours", key: "total_working_hours" }
  ];

  const csvData = filteredEmployees.map(emp => {
    const row = {
      employee_id: emp.employee_id,
      employee_name: emp.employee_name,
      department: emp.department,
      designation: emp.designation
    };

    let totalMonthHours = 0;

    daysInMonth.forEach(day => {
      const dayData = emp.attendance.get(day.dateStr);
      if (dayData && dayData.in && dayData.out) {
        const inTime = fmtTime(dayData.in);
        const outTime = fmtTime(dayData.out);
        const hours = dayData.workHours;
        totalMonthHours += hours;

        const status = dayData.status?.label || '';
        row[`day_${day.dayNum}`] = `${inTime}-${outTime} (${hours.toFixed(1)}h) ${status}`;
      } else if (dayData && (dayData.in || dayData.out)) {
        const time = dayData.in ? `IN: ${fmtTime(dayData.in)}` : `OUT: ${fmtTime(dayData.out)}`;
        row[`day_${day.dayNum}`] = `${time} - ${dayData.status?.label || 'Half Day'}`;
      } else {
        row[`day_${day.dayNum}`] = 'Absent';
      }
    });

    row['total_working_hours'] = totalMonthHours.toFixed(2);

    return row;
  });

  const toggleExpand = (empId) => {
    setExpandedEmployee(expandedEmployee === empId ? null : empId);
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        <Container>
          <Header>
            <HeaderTop>
              <div>
                <Title>
                  <Users size={32} />
                  Monthly Attendance Report
                </Title>
                <Subtitle>View employee attendance by date for {month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • Supports overnight shifts & single punch detection</Subtitle>
              </div>
            </HeaderTop>

            <StatsGrid>
              <StatCard>
                <StatLabel>
                  <Users size={16} />
                  Employees
                </StatLabel>
                <StatValue>{stats.uniqueEmployees}</StatValue>
              </StatCard>

              <StatCard>
                <StatLabel>
                  <TrendingUp size={16} />
                  Avg Attendance
                </StatLabel>
                <StatValue style={{ color: 'var(--success)' }}>{stats.avgAttendance}%</StatValue>
              </StatCard>
            </StatsGrid>
          </Header>

          <Card>
            <CardHeader>
              <CardTitle>
                <Filter size={20} />
                Filters
              </CardTitle>
              <Filters>
                <SearchWrapper>
                  <SearchIcon>
                    <Search size={18} />
                  </SearchIcon>
                  <SearchInput
                    type="text"
                    placeholder="Search by ID, name, department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </SearchWrapper>

                <DatePickerWrapper>
                  <Calendar size={18} style={{ marginRight: 8, color: 'var(--muted)' }} />
                  <DatePicker
                    selected={month}
                    onChange={(d) => d && setMonth(d)}
                    dateFormat="MMM yyyy"
                    showMonthYearPicker
                    placeholderText="Select Month"
                  />
                </DatePickerWrapper>

                <Button onClick={fetchData} disabled={loading}>
                  <RefreshCw size={16} />
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>

                {filteredEmployees.length > 0 && (
                  <CSVLink
                    data={csvData}
                    headers={csvHeaders}
                    filename={`attendance_${month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.csv`}
                    target="_blank"
                  >
                    <Button $primary>
                      <Download size={16} />
                      Export CSV
                    </Button>
                  </CSVLink>
                )}
              </Filters>
            </CardHeader>

            <TableWrapper>
              {loading ? (
                <LoadingContainer>
                  <LoadingSpinner />
                </LoadingContainer>
              ) : filteredEmployees.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>📋</EmptyIcon>
                  <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                    No attendance records found
                  </div>
                  <div>Try adjusting your filters or select a different month</div>
                </EmptyState>
              ) : (
                <Table>
                  <THead>
                    <tr>
                      <TH style={{ minWidth: '200px' }}>Employee</TH>
                      <TH>Dept</TH>
                      <TH>Designation</TH>
                      {daysInMonth.map(day => (
                        <TH key={day.dayNum} className="date-header">
                          {day.dayNum}<br />
                          <span style={{ fontSize: '10px', opacity: 0.7 }}>
                            {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                        </TH>
                      ))}
                    </tr>
                  </THead>
                  <TBody>
                    {filteredEmployees.map((emp) => (
                      <React.Fragment key={emp.employee_id}>
                        <TR onClick={() => toggleExpand(emp.employee_id)}>
                          <TD className="employee-cell">
                            <EmployeeInfo>
                              <EmployeeName>
                                <ExpandButton as="span">
                                  {expandedEmployee === emp.employee_id ?
                                    <ChevronUp size={16} /> :
                                    <ChevronDown size={16} />
                                  }
                                </ExpandButton>
                                {emp.employee_name || 'N/A'}
                              </EmployeeName>
                              <EmployeeMeta>ID: {emp.employee_id}</EmployeeMeta>
                            </EmployeeInfo>
                          </TD>
                          <TD>{emp.department || 'N/A'}</TD>
                          <TD>{emp.designation || 'N/A'}</TD>
                          {daysInMonth.map(day => {
                            const dayData = emp.attendance.get(day.dateStr);
                            const statusType = dayData?.status?.status || 'absent';

                            return (
                              <TD
                                key={day.dayNum}
                                className="date-cell"
                                $status={statusType}
                              >
                                {dayData && (dayData.in || dayData.out) ? (
                                  <AttendanceCell>
                                    {dayData.in && (
                                      <TimeLabel $type="IN">IN: {fmtTime(dayData.in)}</TimeLabel>
                                    )}
                                    {dayData.out && (
                                      <TimeLabel $type="OUT">OUT: {fmtTime(dayData.out)}</TimeLabel>
                                    )}
                                    {dayData.workHours > 0 && (
                                      <HoursLabel $hours={dayData.workHours}>
                                        {dayData.workHours.toFixed(1)}h
                                      </HoursLabel>
                                    )}
                                    {dayData.status && (
                                      <StatusLabel $type={dayData.status.status}>
                                        {dayData.status.label}
                                      </StatusLabel>
                                    )}
                                  </AttendanceCell>
                                ) : (
                                  <StatusLabel $type="absent">Absent</StatusLabel>
                                )}
                              </TD>
                            );
                          })}
                        </TR>
                        {expandedEmployee === emp.employee_id && (
                          <DetailRow>
                            <DetailCell colSpan={3 + daysInMonth.length}>
                              <div style={{ padding: '8px' }}>
                                <strong>Detailed Records for {emp.employee_name}:</strong>
                                <div style={{ marginTop: '8px' }}>
                                  {Array.from(emp.attendance.entries())
                                    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
                                    .map(([date, dayData]) => (
                                      <div key={date} style={{ marginBottom: '4px' }}>
                                        <strong>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}:</strong>{' '}
                                        {dayData.records.map((rec, idx) => (
                                          <span key={idx}>
                                            {rec.attendence_type} at {fmtTime(rec.attendence_time)}
                                            {idx < dayData.records.length - 1 ? ', ' : ''}
                                          </span>
                                        ))}
                                        {dayData.workHours > 0 && (
                                          <span style={{ marginLeft: '8px', color: '#10b981', fontWeight: 'bold' }}>
                                            ({dayData.workHours.toFixed(1)} hours - {dayData.status?.label})
                                          </span>
                                        )}
                                        {!dayData.workHours && dayData.status && (
                                          <span style={{ marginLeft: '8px', color: '#f59e0b', fontWeight: 'bold' }}>
                                            ({dayData.status.label})
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </DetailCell>
                          </DetailRow>
                        )}
                      </React.Fragment>
                    ))}
                  </TBody>
                </Table>
              )}
            </TableWrapper>
          </Card>
        </Container>
      </Page>
    </>
  );
}