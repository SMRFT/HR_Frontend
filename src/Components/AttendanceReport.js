import React, { useState, useEffect, useMemo } from "react";
import api, { HR_BASE_URL } from "../api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
  ChevronUp,
  FileText,
  Layers
} from "lucide-react";
import { CSVLink } from "react-csv";
import styled from "styled-components";




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
  padding: clamp(14px, 2vw, 24px);
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
  font-size: clamp(20px, 3vw, 28px);
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
  padding: clamp(16px, 2vw, 24px);
  border-bottom: 1px solid var(--border);
  background: rgba(255,255,255,0.02);
`;


const CardTitle = styled.h3`
  margin: 0 0 clamp(12px, 2vw, 20px) 0;
  font-size: clamp(14px, 2vw, 18px);
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

  &::placeholder { color: var(--muted); }

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

  &:hover { border-color: var(--primary); }

  input {
    width: 100%;
    border: none;
    background: transparent;
    color: var(--text);
    font-size: 14px;
    cursor: pointer;
    &:focus { outline: none; }
    &::placeholder { color: var(--muted); }
  }

  @media (max-width: 768px) { width: 100%; }
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
  &:active { transform: translateY(0); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  @media (max-width: 768px) { width: 100%; justify-content: center; }
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


/* Top-scroll wrapper: flip the outer div so the scrollbar appears at the top */
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
  padding: clamp(12px, 2vw, 24px);
  max-height: 60vh;
  overflow-y: auto;
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
  background: #1e293b;
  position: sticky;
  top: 0;
  z-index: 10;

  &.sunday {
    color: var(--danger);
  }
`;


const TBody = styled.tbody``;


const TR = styled.tr`
  border-bottom: 1px solid rgba(255,255,255,0.08);
  transition: var(--transition);
  cursor: pointer;

  &:hover { background: rgba(255,255,255,0.05); }
  &:last-child { border-bottom: none; }
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
    if (props.$status === 'present') return 'rgba(16,185,129,0.1)';
    if (props.$status === 'late') return 'rgba(245,158,11,0.1)';
    if (props.$status === 'half-day') return 'rgba(245,158,11,0.15)';
    if (props.$status === 'absent') return 'rgba(255,255,255,0.05)';
    return 'transparent';
  }};
    border: 1px solid ${props => {
    if (props.$status === 'present') return 'rgba(16,185,129,0.2)';
    if (props.$status === 'late') return 'rgba(245,158,11,0.2)';
    if (props.$status === 'half-day') return 'rgba(245,158,11,0.3)';
    if (props.$status === 'absent') return 'rgba(255,255,255,0.1)';
    return 'transparent';
  }};
  }

  &.employee-cell {
    position: sticky;
    left: 0;
    background: var(--bg1);
    z-index: 5;
    min-width: 250px;
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
  background: ${props => props.$type === 'IN' ? 'rgba(16,185,129,0.12)' : 'rgba(99,102,241,0.12)'};
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
    if (props.$hours >= 8) return 'rgba(16,185,129,0.15)';
    if (props.$hours >= 4) return 'rgba(245,158,11,0.15)';
    return 'rgba(239,68,68,0.15)';
  }};
  border: 1px solid ${props => {
    if (props.$hours >= 8) return 'rgba(16,185,129,0.3)';
    if (props.$hours >= 4) return 'rgba(245,158,11,0.3)';
    return 'rgba(239,68,68,0.3)';
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
    if (props.$type === 'present') return 'rgba(16,185,129,0.15)';
    if (props.$type === 'late' || props.$type === 'half-day') return 'rgba(245,158,11,0.15)';
    if (props.$type === 'absent') return 'rgba(255,255,255,0.08)';
    return 'transparent';
  }};
  border: 1px solid ${props => {
    if (props.$type === 'present') return 'rgba(16,185,129,0.3)';
    if (props.$type === 'late') return 'rgba(245,158,11,0.3)';
    if (props.$type === 'half-day') return 'rgba(245,158,11,0.4)';
    if (props.$type === 'absent') return 'rgba(255,255,255,0.15)';
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

  &:hover { color: var(--primary); }
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


const FilterSelect = styled.select`
  height: 44px;
  background: rgba(255,255,255,0.05);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 0 16px;
  border-radius: var(--radius-sm);
  outline: none;
  cursor: pointer;
  font-size: 14px;
  transition: var(--transition);

  &:hover, &:focus {
    border-color: var(--primary);
    background: rgba(255,255,255,0.08);
  }

  option {
    background: var(--bg2);
    color: var(--text);
  }

  @media (max-width: 768px) { width: 100%; }
`;

// Helper Functions
const dmy = (d) => {
  if (!d || isNaN(new Date(d).getTime())) return "";
  const dateObj = new Date(d);
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const ymd = (d) => {
  if (!d || isNaN(new Date(d).getTime())) return "";
  const dateObj = new Date(d);
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};


// Deprecated: monthRange is now replaced by direct from/to date states
// const monthRange = (d) => {
//   const start = new Date(d.getFullYear(), d.getMonth(), 1);
//   const end = new Date(d.getFullYear(), d.getMonth() + 1, 0);
//   start.setHours(0, 0, 0, 0);
//   end.setHours(23, 59, 59, 999);
//   return { start, end };
// };


const getDaysInRange = (start, end) => {
  if (!start || !end) return [];
  const days = [];
  let curr = new Date(start);
  curr.setHours(0, 0, 0, 0);
  const endLimit = new Date(end);
  endLimit.setHours(23, 59, 59, 999);

  while (curr <= endLimit) {
    days.push({
      date: new Date(curr),
      dayNum: curr.getDate(),
      dateStr: ymd(curr),
      isSunday: curr.getDay() === 0
    });
    curr.setDate(curr.getDate() + 1);
  }
  return days;
};


const fmtTime = (dateStr) => {
  if (!dateStr || isNaN(new Date(dateStr).getTime())) return "-";
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
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedEmployee, setExpandedEmployee] = useState(null);
  const [viewMode, setViewMode] = useState('detailed'); // 'detailed' | 'matrix'
  const [departments, setDepartments] = useState([]);
  const [selectedDepts, setSelectedDepts] = useState([]);
  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  const role = (localStorage.getItem('role') || '').toLowerCase();
  const dept = (localStorage.getItem('department') || localStorage.getItem('dept') || '');

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, selectedDepts]);

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
  }, [HRbaseurl]);

  const toggleDepartment = (deptId) => {
    setSelectedDepts(prev =>
      prev.includes(deptId)
        ? prev.filter(d => d !== deptId)
        : [...prev, deptId]
    );
  };


  const fetchData = async () => {
    setLoading(true);
    try {
      const from_date = ymd(startDate);
      const to_date = ymd(endDate || startDate);
      const params = { from_date, to_date };

      if (role && role !== 'admin' && dept) {
        params.department = dept;
      } else if (selectedDepts.length > 0) {
        params.department = selectedDepts.join(',');
      }

      const res = await api.get(`attendance-report/`, { params });
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
          department_id: record.department_id, // NEW: Include ID
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
    let result = processedData;

    // 1. Filter by Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(emp =>
        (emp.employee_id || '').toLowerCase().includes(query) ||
        (emp.employee_name || '').toLowerCase().includes(query) ||
        (emp.department || '').toLowerCase().includes(query) ||
        (emp.designation || '').toLowerCase().includes(query)
      );
    }

    return result;
  }, [processedData, searchQuery, selectedDepts]);

  const daysInMonth = useMemo(() => getDaysInRange(startDate, endDate), [startDate, endDate]);


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

  // const toggleExpand = (empId) => {
  //   setExpandedEmployee(prev => prev === empId ? null : empId);
  // };

  const getStatusAbbr = (statusLabel) => {
    if (statusLabel === 'Absent' || statusLabel === 'Absent (<4h)' || statusLabel === 'Absent (No IN)' || statusLabel === 'Absent (No OUT)') return 'A';
    if (statusLabel === 'Present') return 'P';
    if (statusLabel === 'Late') return 'SP';
    if (statusLabel === 'Half Day' || statusLabel === 'Late/Half Day') return 'SP'; // Since 'single punch' is grouped here
    return 'A'; // Default absent
  };

  const getHexColor = (abbr) => {
    if (abbr === 'A') return '#ef4444'; // Red
    if (abbr === 'P') return '#10b981'; // Green
    if (abbr === 'SP' || abbr === 'LL') return '#f59e0b'; // Yellow
    if (abbr === 'WO') return '#3b82f6'; // Blue
    return '#000000';
  };

  const handleExportDetailed = () => {
    const from_date = ymd(startDate);
    const to_date = ymd(endDate || startDate);
    let url = `${HRbaseurl}attendance-report/?from_date=${from_date}&to_date=${to_date}&export=detailed_xlsx`;

    // Add department filter if active
    if (role && role !== 'admin' && dept) {
      url += `&department=${dept}`;
    } else if (selectedDepts.length > 0) {
      url += `&department=${selectedDepts.join(',')}`;
    }

    window.open(url, '_blank');
  };

  const handleExportStatus = () => {
    const headers = [
      "S.No", "Employee ID", "Employee Name", "Department", "Designation",
      ...daysInMonth.map(day => dmy(day.date))
    ];

    const rows = filteredEmployees.map((emp, idx) => {
      const rowData = [
        idx + 1,
        emp.employee_id,
        emp.employee_name,
        emp.department,
        emp.designation || '-'
      ];

      daysInMonth.forEach(day => {
        const dayData = emp.attendance.get(day.dateStr);
        let abbr = 'A';

        if (dayData && dayData.status) {
          abbr = getStatusAbbr(dayData.status.label);
        } else if (dayData && (dayData.in || dayData.out)) {
          // Fallback if status calculation failed but punches exist
          abbr = (dayData.in && dayData.out) ? 'P' : 'SP';
        }

        rowData.push({ value: abbr, color: getHexColor(abbr) });
      });

      return rowData;
    });

    downloadExcel(headers, rows, `Attendance_Status_${startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}.xls`);
  };

  const downloadExcel = (headers, rows, filename) => {
    let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8" /></head><body>';
    html += '<table border="1" style="border-collapse: collapse;"><thead><tr>';

    headers.forEach(header => {
      html += `<th style="background-color: #f1f5f9; font-weight: bold; padding: 5px;">${header}</th>`;
    });
    html += '</tr></thead><tbody>';

    rows.forEach(row => {
      html += '<tr>';
      row.forEach(cell => {
        if (typeof cell === 'object' && cell !== null && cell.value !== undefined) {
          html += `<td style="color: ${cell.color}; font-weight: bold; padding: 5px; text-align: center;">${cell.value}</td>`;
        } else {
          html += `<td style="padding: 5px;">${cell}</td>`;
        }
      });
      html += '</tr>';
    });

    html += '</tbody></table></body></html>';

    const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };



  const toggleExpand = (empId) => {
    setExpandedEmployee(expandedEmployee === empId ? null : empId);
  };


  return (
    <>

      <Page>
        <Container>
          <Header>
            <HeaderTop>
              <div>
                <Title>
                  <Users size={32} />
                  Monthly Attendance Report
                </Title>
                <Subtitle>View employee attendance reports by selecting a custom date range • Supports overnight shifts & single punch detection</Subtitle>
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

                {(localStorage.getItem('role') === 'Admin' || !localStorage.getItem('department')) && (
                  <FilterSelect
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
                  </FilterSelect>
                )}

                <DatePickerWrapper>
                  <Calendar size={18} style={{ marginRight: 8, color: 'var(--muted)' }} />
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(update) => {
                      const [start, end] = update;
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Select Date Range"
                    portalId="root"
                  />
                </DatePickerWrapper>


                <Button onClick={fetchData} disabled={loading}>
                  <RefreshCw size={16} />
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>


                <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                  <button
                    onClick={() => setViewMode('detailed')}
                    style={{
                      background: viewMode === 'detailed' ? 'rgba(255,255,255,0.1)' : 'transparent',
                      color: viewMode === 'detailed' ? 'var(--primary)' : 'var(--text-muted)',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Detailed View"
                  >
                    <FileText size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('matrix')}
                    style={{
                      background: viewMode === 'matrix' ? 'rgba(255,255,255,0.1)' : 'transparent',
                      color: viewMode === 'matrix' ? 'var(--primary)' : 'var(--text-muted)',
                      border: 'none',
                      padding: '8px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Matrix View"
                  >
                    <Layers size={18} />
                  </button>
                </div>

                {filteredEmployees.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <Button $primary onClick={handleExportDetailed}>
                      <Download size={16} />
                      Detailed Report
                    </Button>

                    <Button onClick={handleExportStatus} style={{ background: 'rgba(16, 185, 129, 0.2)', borderColor: '#10b981', color: '#10b981' }}>
                      <FileText size={16} />
                      Status Matrix
                    </Button>
                  </div>
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
                  <div>Try adjusting your filters or select a different date range</div>
                </EmptyState>
              ) : (
                <TableInner>
                  {viewMode === 'detailed' ? (
                    <Table>
                      <THead>
                        <tr>
                          <TH rowSpan="2" style={{ padding: '0', zIndex: 20 }}>
                            <div style={{ padding: '12px 16px', minWidth: '200px' }}>Employee</div>
                          </TH>
                          <TH rowSpan="2">Dept</TH>
                          <TH rowSpan="2">Designation</TH>
                          {daysInMonth.map(day => (
                            <TH key={day.dayNum} colSpan="3" className={day.isSunday ? "sunday" : ""} style={{ textAlign: 'center', borderLeft: '1px solid var(--border)' }}>
                              <div style={{ fontSize: '13px', fontWeight: 800 }}>{dmy(day.date)}</div>
                              <div style={{ fontSize: '11px', opacity: 0.7 }}>
                                {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </div>
                            </TH>
                          ))}
                        </tr>
                        <tr>
                          {daysInMonth.map(day => (
                            <React.Fragment key={day.dayNum}>
                              <TH style={{ minWidth: '60px', fontSize: '10px', borderLeft: '1px solid var(--border)', color: 'var(--success)', textAlign: 'center' }}>In</TH>
                              <TH style={{ minWidth: '60px', fontSize: '10px', color: 'var(--danger)', textAlign: 'center' }}>Out</TH>
                              <TH style={{ minWidth: '60px', fontSize: '10px', color: 'var(--warning)', textAlign: 'center' }}>Hrs</TH>
                            </React.Fragment>
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
                                // Base background color based on status
                                const bgColor = statusType === 'present' ? 'rgba(16, 185, 129, 0.05)' :
                                  statusType === 'absent' ? 'transparent' : 'rgba(245, 158, 11, 0.05)';


                                return (
                                  <React.Fragment key={day.dayNum}>
                                    <TD style={{ background: bgColor, borderLeft: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '12px' }}>
                                      {dayData && dayData.in ? (
                                        <span style={{ color: 'var(--success)', fontWeight: 600 }}>{fmtTime(dayData.in)}</span>
                                      ) : <span style={{ opacity: 0.3 }}>-</span>}
                                    </TD>
                                    <TD style={{ background: bgColor, textAlign: 'center', fontSize: '12px' }}>
                                      {dayData && dayData.out ? (
                                        <span style={{ color: 'var(--danger)', fontWeight: 600 }}>{fmtTime(dayData.out)}</span>
                                      ) : <span style={{ opacity: 0.3 }}>-</span>}
                                    </TD>
                                    <TD style={{ background: bgColor, textAlign: 'center', fontSize: '12px' }}>
                                      {dayData && dayData.workHours > 0 ? (
                                        <span style={{ fontWeight: 700 }}>{dayData.workHours.toFixed(1)}</span>
                                      ) : <span style={{ opacity: 0.3 }}>-</span>}
                                    </TD>
                                  </React.Fragment>
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
                                            <strong>{dmy(new Date(date))}:</strong>{' '}
                                            {dayData.records.map((rec, idx) => (
                                              <span key={idx} title={`Device: ${rec.device_id || 'Unknown'}`}>
                                                {rec.attendence_type} at {fmtTime(rec.attendence_time)} ({rec.device_id || 'N/A'})
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
                  ) : (
                    <Table style={{ minWidth: `${250 + (daysInMonth.length * 80)}px` }}>
                      <THead>
                        <tr>
                          <TH style={{ position: 'sticky', left: 0, background: 'var(--bg2)', zIndex: 30, minWidth: '250px', boxShadow: '4px 0 10px rgba(0,0,0,0.2)' }}>
                            Employee Details
                          </TH>
                            {daysInMonth.map(day => (
                              <TH key={day.dayNum} className={day.isSunday ? "sunday" : ""} style={{ textAlign: 'center', minWidth: '60px', padding: '12px 8px' }}>
                                <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{dmy(day.date)}</div>
                                <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: 700 }}>{day.date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                              </TH>
                            ))}
                        </tr>
                      </THead>
                      <TBody>
                        {filteredEmployees.map((emp) => (
                          <TR key={emp.employee_id}>
                            <TD style={{ position: 'sticky', left: 0, background: 'var(--bg2)', zIndex: 25, borderRight: '1px solid var(--border)' }}>
                              <EmployeeInfo>
                                <EmployeeName>{emp.employee_name || 'N/A'}</EmployeeName>
                                <EmployeeMeta>ID: {emp.employee_id} • {emp.department || 'N/A'}</EmployeeMeta>
                              </EmployeeInfo>
                            </TD>
                            {daysInMonth.map(day => {
                              const dayData = emp.attendance.get(day.dateStr);
                              let abbr = '-';
                              let bgColor = 'var(--bg1)';
                              let textColor = 'var(--muted)';

                              if (dayData && dayData.status) {
                                abbr = getStatusAbbr(dayData.status.label);
                                textColor = getHexColor(abbr);
                                if (abbr === 'P') bgColor = 'rgba(16,185,129,0.05)';
                                else if (abbr === 'A') bgColor = 'rgba(239,68,68,0.05)';
                                else bgColor = 'rgba(245,158,11,0.05)';
                              } else if (dayData && (dayData.in || dayData.out)) {
                                abbr = (dayData.in && dayData.out) ? 'P' : 'SP';
                                textColor = getHexColor(abbr);
                                bgColor = abbr === 'P' ? 'rgba(16,185,129,0.05)' : 'rgba(245,158,11,0.05)';
                              }

                              return (
                                <TD key={day.dayNum} style={{ textAlign: 'center', background: bgColor, borderLeft: '1px solid var(--border)' }}>
                                  <span style={{ color: textColor, fontWeight: 'bold' }}>{abbr}</span>
                                </TD>
                              );
                            })}
                          </TR>
                        ))}
                      </TBody>
                    </Table>
                  )}
                </TableInner>
              )}
            </TableWrapper>
          </Card>
        </Container>
      </Page>
    </>
  );
}