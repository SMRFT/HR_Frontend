import React, { useState, useEffect, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import {
    Calendar, Download, ChevronLeft, ChevronRight,
    Search, FileText, User as UserIcon, Layers, Clock, Shield,
    CheckCircle, XCircle, AlertTriangle, Building2, BadgeCheck
} from 'lucide-react';

const GlobalStyle = createGlobalStyle`
  :root {
    --bg1: #0a0e1a;
    --bg2: #0f172a;
    --bg3: #1e293b;
    --primary: #667eea;
    --primary-dark: #5a67d8;
    --primary-light: #8ba4f9;
    --accent: #22d3ee;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
    --text: #f1f5f9;
    --text-muted: #94a3b8;
    --text-dim: #64748b;
    --glass: rgba(255,255,255,0.08);
    --glass-dark: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.12);
    --border-light: rgba(255,255,255,0.06);
    --shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    --shadow-lg: 0 35px 60px -12px rgba(0,0,0,0.6);
    --radius: 20px;
    --radius-sm: 14px;
    --ring: 0 0 0 4px rgba(102, 126, 234, 0.2);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  * { 
    box-sizing: border-box; 
    -webkit-tap-highlight-color: transparent;
  }

  html, body, #root { 
    height: 100%; 
    overflow-x: hidden; 
    scroll-behavior: smooth;
  }

  body {
    margin: 0;
    color: var(--text);
    font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    background: 
      radial-gradient(1200px 800px at 20% 80%, rgba(102,126,234,0.15) 0%, transparent 50%),
      radial-gradient(800px 600px at 80% 20%, rgba(34,211,238,0.12) 0%, transparent 50%),
      linear-gradient(135deg, var(--bg1) 0%, var(--bg2) 50%, var(--bg3) 100%);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
  }
`;

const Page = styled.div`
  min-height: 100vh;
  padding: clamp(16px, 5vw, 32px);
  @media (min-width: 1200px) {
    padding: clamp(32px, 4vw, 48px);
  }
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: clamp(32px, 5vw, 48px);
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  margin: 0 0 12px 0;
  font-size: clamp(28px, 5vw, 42px);
  font-weight: 900;
  background: linear-gradient(135deg, var(--primary), var(--accent), var(--primary-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
`;

const Subtitle = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: clamp(14px, 2vw, 16px);
  font-weight: 500;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 100%;
    justify-content: stretch;
    flex-direction: column;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  position: relative;
  overflow: hidden;
  transition: var(--transition);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
  }
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
    border-color: var(--primary);
  }
`;

const StatLabel = styled.div`
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  color: var(--text);
  font-size: clamp(24px, 4vw, 32px);
  font-weight: 900;
  line-height: 1.1;
`;

const Controls = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto auto 1fr;
  gap: 16px;
  align-items: end;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  min-width: 320px;
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid var(--border-light);
  background: var(--glass-dark);
  color: var(--text);
  border-radius: var(--radius-sm);
  padding: 0 20px 0 52px;
  font-size: 15px;
  transition: var(--transition);
  
  &::placeholder {
    color: var(--text-dim);
  }
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    background: rgba(255,255,255,0.1);
    box-shadow: var(--ring);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-dim);
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--glass-dark);
  padding: 12px 20px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  font-weight: 600;
  font-size: 15px;
  min-height: 48px;
  white-space: nowrap;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 8px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  transition: var(--transition);
  width: 40px;
  height: 40px;
  justify-content: center;
  
  &:hover {
    background: rgba(255,255,255,0.08);
    color: var(--primary);
    transform: translateY(-1px);
  }
`;

const FilterSelect = styled.select`
  height: 48px;
  background: var(--glass-dark);
  color: var(--text);
  border: 1px solid var(--border-light);
  padding: 0 20px;
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-weight: 500;
  min-width: 180px;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: var(--ring);
  }
`;

const PrimaryButton = styled.button`
  height: 48px;
  padding: 0 28px;
  border: none;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
  color: white;
  font-weight: 600;
  font-size: 15px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 25px rgba(102,126,234,0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(102,126,234,0.4);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const Card = styled.div`
  background: var(--glass);
  backdrop-filter: blur(20px);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
  }
  
  @media (max-width: 768px) {
    border-radius: 0;
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: 1400px;
  border-collapse: separate;
  border-spacing: 0;
`;

const THead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 20;
`;

const TH = styled.th`
  padding: 18px 24px;
  text-align: left;
  color: var(--text);
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  white-space: nowrap;
  background: var(--bg3);
  border-bottom: 2px solid var(--border);
`;

const TBody = styled.tbody``;

const TR = styled.tr`
  transition: var(--transition);
  
  &:nth-child(even) {
    background: rgba(255,255,255,0.02);
  }
  
  &:hover {
    background: rgba(102,126,234,0.1);
  }
`;

const TD = styled.td`
  padding: 20px 24px;
  color: var(--text);
  font-size: 14px;
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
`;

const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`;

const EmployeeAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
`;

const EmployeeInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const EmployeeName = styled.div`
  font-weight: 700;
  color: var(--text);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmployeeMeta = styled.div`
  font-size: 13px;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 25px;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  
  ${props => {
        switch (props.$status) {
            case 'Present':
                return `background: rgba(16, 185, 129, 0.15); 
                color: var(--success); 
                border: 1px solid rgba(16, 185, 129, 0.3);`;
            case 'Absent':
                return `background: rgba(239, 68, 68, 0.15); 
                color: var(--danger); 
                border: 1px solid rgba(239, 68, 68, 0.3);`;
            case 'Week Off':
            case 'Week Off/Holiday':
                return `background: rgba(99, 102, 241, 0.15); 
                color: var(--primary); 
                border: 1px solid rgba(99, 102, 241, 0.3);`;
            case 'Late Login':
                return `background: rgba(245, 158, 11, 0.15); 
                color: var(--warning); 
                border: 1px solid rgba(245, 158, 11, 0.3);`;
            case 'Early Checkout':
                return `background: rgba(251, 146, 60, 0.15); 
                color: #fb923c; 
                border: 1px solid rgba(251, 146, 60, 0.3);`;
            default:
                return `background: rgba(148, 163, 184, 0.15); 
                color: var(--text-muted); 
                border: 1px solid rgba(148, 163, 184, 0.3);`;
        }
    }}
`;

const ShiftBadge = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  
  ${props => {
        if (props.$off) {
            return `background: rgba(99, 102, 241, 0.15); 
              color: var(--primary); 
              border: 1px solid rgba(99, 102, 241, 0.25);`;
        }
        return `background: rgba(34, 211, 238, 0.15); 
            color: var(--accent); 
            border: 1px solid rgba(34, 211, 238, 0.3);`;
    }}
`;

const TimeBadge = styled.div`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255,255,255,0.08);
  color: var(--accent);
  border: 1px solid var(--border-light);
`;

const NoData = styled.div`
  padding: 80px 40px;
  text-align: center;
  color: var(--text-muted);
  
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  border-radius: 20px;
  background: var(--glass-dark);
  color: var(--text-dim);
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 40px;
  flex-direction: column;
  gap: 16px;
  
  @media (max-width: 768px) {
    padding: 80px 20px;
  }
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid rgba(102,126,234,0.2);
  border-top: 3px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

const RosterAttendanceReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedDept, setSelectedDept] = useState("All");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Departments
    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await axios.get(`${HRbaseurl}departments/`);
                setDepartments(res.data.map(d => d.name));
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        fetchDepts();
    }, []);

    // Set initial dept based on role
    useEffect(() => {
        const role = localStorage.getItem('role');
        const dept = localStorage.getItem('department');
        if (role && role !== 'Admin' && dept) {
            setSelectedDept(dept);
        }
    }, []);

    // Fetch Report Data
    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const monthStr = `${year}-${month}`;

                let url = `${HRbaseurl}roster-report/?month=${monthStr}`;
                const role = localStorage.getItem('role');
                const dept = localStorage.getItem('department');

                if (role && role !== 'Admin' && dept) {
                    url += `&department=${encodeURIComponent(dept)}`;
                } else if (selectedDept !== 'All') {
                    url += `&department=${encodeURIComponent(selectedDept)}`;
                }

                const res = await axios.get(url);
                setReportData(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to fetch roster attendance report", err);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [currentDate, selectedDept]);

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    // Filter Logic
    const filteredData = useMemo(() => {
        return reportData.filter(item => {
            const matchesSearch = item.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.designation?.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        }).sort((a, b) => {
            // Sort by employee name first, then date
            const nameCompare = (a.employee_name || '').localeCompare(b.employee_name || '');
            if (nameCompare !== 0) return nameCompare;
            return new Date(a.date) - new Date(b.date);
        });
    }, [reportData, searchTerm]);

    // Stats
    const stats = useMemo(() => {
        return {
            total: filteredData.length,
            present: filteredData.filter(i => i.status === 'Present').length,
            absent: filteredData.filter(i => i.status === 'Absent').length,
            exceptions: filteredData.filter(i =>
                ['Late Login', 'Early Checkout', 'Mismatched Punch'].includes(i.status)
            ).length
        };
    }, [filteredData]);

    // Generate days for the current month
    const daysInMonth = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        return Array.from({ length: days }, (_, i) => {
            const d = new Date(year, month, i + 1);
            return {
                day: i + 1,
                dateStr: `${year}-${String(month + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`,
                dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }) // S, M, T...
            };
        });
    }, [currentDate]);

    // Group Data for Matrix View (Row = Employee, Col = Date)
    const matrixData = useMemo(() => {
        const groups = {};

        // Use filteredData to respect Search & Department filters
        filteredData.forEach(item => {
            if (!groups[item.employee_id]) {
                groups[item.employee_id] = {
                    id: item.employee_id,
                    name: item.employee_name,
                    dept: item.department,
                    desg: item.designation,
                    records: {}
                };
            }
            groups[item.employee_id].records[item.date] = item;
        });

        return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
    }, [filteredData]);

    const getStatusColor = (status) => {
        if (!status) return 'transparent';
        if (status === 'Present') return 'var(--success)';
        if (status === 'Absent') return 'var(--danger)';
        if (status.includes('Off') || status.includes('Holiday')) return 'var(--primary)';
        if (['Late Login', 'Early Checkout', 'Mismatched Punch'].includes(status)) return 'var(--warning)';
        return 'var(--text-muted)';
    };

    const getStatusAbbr = (status) => {
        if (!status) return '-';
        if (status === 'Present') return 'P';
        if (status === 'Absent') return 'A';
        if (status.includes('Off')) return 'WO';
        if (status.includes('Holiday')) return 'PH';
        if (status === 'Late Login') return 'LL';
        if (status === 'Early Checkout') return 'EC';
        return '?';
    };

    const [viewMode, setViewMode] = useState('matrix'); // 'matrix' | 'list'

    const formatTimeIST = (dateStr) => {
        if (!dateStr || dateStr === '-' || dateStr === 'None') return '-';

        try {
            // Helper to format a Date object to IST 12-hour time
            const toIST = (dateObj) => {
                return new Intl.DateTimeFormat('en-US', {
                    timeZone: 'Asia/Kolkata',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                }).format(dateObj);
            };

            // Case 1: Full ISO Date String (e.g. 2023-10-27T08:30:00Z)
            if (dateStr.includes('T') || (dateStr.includes('-') && dateStr.includes(':'))) {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    return toIST(date);
                }
            }

            // Case 2: Time Only String (HH:mm:ss or HH:mm)
            // The user stated "roater attandance report have utc time".
            // So '09:30:00' is 9:30 AM UTC -> 3:00 PM IST.
            const timeParts = dateStr.split(':');
            if (timeParts.length >= 2) {
                const date = new Date();
                // Treat the input time as UTC
                date.setUTCHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2] || 0));

                // Convert to IST
                return toIST(date);
            }

            return dateStr;
        } catch (e) {
            console.error("Time conversion error:", e);
            return dateStr;
        }
    };

    const getShiftDeviations = (record) => {
        if (!record || !record.shift_timing || !record.check_in || record.check_in === '-' || record.check_in === 'None') return null;
        try {
            const shiftStr = record.shift_timing.replace(/\s+/g, '');
            const [startStr, endStr] = shiftStr.split('-');
            if (!startStr || !endStr) return null;

            const toMins = (timeStr) => {
                const parts = timeStr.split(':');
                if (parts.length < 2) return 0;
                return parseInt(parts[0]) * 60 + parseInt(parts[1]);
            };

            const shiftStartMins = toMins(startStr);
            let shiftEndMins = toMins(endStr);
            if (shiftEndMins < shiftStartMins) shiftEndMins += 24 * 60;

            const getLocalMins = (dateStr) => {
                if (!dateStr || dateStr === '-' || dateStr === 'None') return null;
                try {
                    const toIST24 = (dateObj) => new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(dateObj);
                    if (dateStr.includes('T') || (dateStr.includes('-') && dateStr.includes(':'))) {
                        return toMins(toIST24(new Date(dateStr)));
                    }
                    const parts = dateStr.split(':');
                    const d = new Date();
                    d.setUTCHours(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2] || 0));
                    return toMins(toIST24(d));
                } catch (e) { return null; }
            };

            const inMins = getLocalMins(record.check_in);
            const outMinsRaw = getLocalMins(record.check_out);
            let outMins = outMinsRaw;

            let result = [];

            if (inMins !== null) {
                const diff = inMins - shiftStartMins;
                if (diff > 5) { // late login assuming > 5 mins grace
                    const hrs = Math.floor(diff / 60);
                    const mins = diff % 60;
                    result.push(`Late: ${hrs > 0 ? hrs + 'h ' : ''}${mins}m`);
                }
            }

            if (outMinsRaw !== null) {
                if (outMinsRaw < shiftStartMins) outMins += 24 * 60;
                const outDiff = shiftEndMins - outMins;
                if (outDiff > 5) { // early checkout assuming > 5 mins early
                    const hrs = Math.floor(outDiff / 60);
                    const mins = outDiff % 60;
                    result.push(`Early: ${hrs > 0 ? hrs + 'h ' : ''}${mins}m`);
                }
            }

            return result.length > 0 ? result.join(' | ') : null;
        } catch (e) {
            return null;
        }
    };

    const handleExport = () => {
        if (viewMode === 'matrix') {
            const formatTime24 = (dateStr) => {
                if (!dateStr || dateStr === '-' || dateStr === 'None') return '-';
                try {
                    const toIST24 = (dateObj) => {
                        return new Intl.DateTimeFormat('en-GB', {
                            timeZone: 'Asia/Kolkata',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        }).format(dateObj);
                    };
                    if (dateStr.includes('T') || (dateStr.includes('-') && dateStr.includes(':'))) {
                        const date = new Date(dateStr);
                        if (!isNaN(date.getTime())) return toIST24(date);
                    }
                    const timeParts = dateStr.split(':');
                    if (timeParts.length >= 2) {
                        const date = new Date();
                        date.setUTCHours(parseInt(timeParts[0]), parseInt(timeParts[1]), parseInt(timeParts[2] || 0));
                        return toIST24(date);
                    }
                    return dateStr;
                } catch (e) { return dateStr; }
            };

            // Matrix Export (Excel Wide Grouped Format)
            // Header Row 1: Groups by Date
            const headerRow1 = [
                "Employee Name", "Department",
                ...daysInMonth.flatMap(d => [
                    `${d.dateStr} ${d.dayName}`, "", "", "" // Empty strings span the columns
                ])
            ];

            // Header Row 2: Sub-columns
            const headerRow2 = [
                "", "",
                ...daysInMonth.flatMap(() => [
                    "Shift", "In", "Out", "Total"
                ])
            ];

            const dataRows = matrixData.map(emp => {
                const rowData = [
                    emp.name || '', emp.dept || ''
                ];

                daysInMonth.forEach(dayInfo => {
                    const record = emp.records[dayInfo.dateStr];
                    if (!record) {
                        rowData.push("-", "-", "-", "-");
                        return;
                    }

                    let shiftVal = '-';
                    if (record.shift_name) {
                        const shiftPrefix = record.shift_name.charAt(0).toUpperCase();
                        const shiftTimings = record.shift_timing ? record.shift_timing.replace(/\s+/g, '') : '';
                        shiftVal = `${shiftPrefix}(${shiftTimings})`;
                    } else if (record.status === 'Absent' || record.status === 'Week Off') {
                        shiftVal = record.status;
                    } else {
                        shiftVal = record.status || '-';
                    }

                    const inTime = formatTime24(record.check_in);
                    const outTime = formatTime24(record.check_out);

                    let totalHours = record.total_hours || '-';
                    if (totalHours === '-' && record.status === 'Absent') {
                        totalHours = '0.00';
                    }

                    rowData.push(shiftVal, inTime, outTime, totalHours);
                });

                return rowData;
            });

            const finalRows = [headerRow2, ...dataRows];
            downloadCSV(headerRow1, finalRows, `Roster_Matrix_${currentDate.toISOString().slice(0, 7)}.csv`);
        } else {
            // List Export (Detailed)
            const headers = [
                "Employee ID", "Employee Name", "Department", "Designation",
                "Date", "Roster Shift", "Shift Timings",
                "Check In", "Check Out", "Total Hours", "Status"
            ];
            const rows = filteredData.map(r => [
                r.employee_id || '', r.employee_name || '', r.department || '', r.designation || '',
                r.date || '', r.shift_name || '', r.shift_timing || '',
                formatTimeIST(r.check_in), formatTimeIST(r.check_out),
                r.total_hours || '', r.status || ''
            ]);
            downloadCSV(headers, rows, `Roster_List_${currentDate.toISOString().slice(0, 7)}.csv`);
        }
    };

    const downloadCSV = (headers, rows, filename) => {
        const csvContent = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <Page>
                <GlobalStyle />
                <Container>
                    <LoadingContainer>
                        <Spinner />
                        <div style={{ fontSize: 16, fontWeight: 500 }}>Loading roster attendance data...</div>
                    </LoadingContainer>
                </Container>
            </Page>
        );
    }

    return (
        <Page>
            <GlobalStyle />
            <Container>
                <Header>
                    <HeaderTop>
                        <TitleSection>
                            <Title>
                                <FileText size={32} />
                                Roster vs Actual Attendance
                            </Title>
                            <Subtitle>
                                {viewMode === 'matrix' ? 'Monthly attendance matrix view' : 'Detailed daily attendance list'} •{' '}
                                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </Subtitle>
                        </TitleSection>
                    </HeaderTop>

                    <StatsGrid>
                        <StatCard>
                            <StatLabel>
                                <Layers size={18} />
                                {viewMode === 'matrix' ? 'Total Employees' : 'Total Records'}
                            </StatLabel>
                            <StatValue>{viewMode === 'matrix' ? matrixData.length : stats.total}</StatValue>
                        </StatCard>
                        <StatCard>
                            <StatLabel style={{ color: 'var(--success)' }}>
                                <CheckCircle size={18} />
                                Present
                            </StatLabel>
                            <StatValue style={{ color: 'var(--success)' }}>{stats.present}</StatValue>
                        </StatCard>
                        <StatCard>
                            <StatLabel style={{ color: 'var(--danger)' }}>
                                <XCircle size={18} />
                                Absent
                            </StatLabel>
                            <StatValue style={{ color: 'var(--danger)' }}>{stats.absent}</StatValue>
                        </StatCard>
                        <StatCard>
                            <StatLabel style={{ color: 'var(--warning)' }}>
                                <AlertTriangle size={18} />
                                Exceptions
                            </StatLabel>
                            <StatValue style={{ color: 'var(--warning)' }}>{stats.exceptions}</StatValue>
                        </StatCard>
                    </StatsGrid>
                </Header>

                <Card>
                    <Controls>
                        <div style={{ display: 'flex', gap: '8px', background: 'var(--glass-dark)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
                            <IconButton
                                onClick={() => setViewMode('matrix')}
                                style={{
                                    background: viewMode === 'matrix' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: viewMode === 'matrix' ? 'var(--primary)' : 'var(--text-muted)'
                                }}
                                title="Matrix View"
                            >
                                <Layers size={18} />
                            </IconButton>
                            <IconButton
                                onClick={() => setViewMode('list')}
                                style={{
                                    background: viewMode === 'list' ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: viewMode === 'list' ? 'var(--primary)' : 'var(--text-muted)'
                                }}
                                title="List View"
                            >
                                <FileText size={18} />
                            </IconButton>
                        </div>

                        <SearchWrapper>
                            <SearchIcon>
                                <Search size={20} />
                            </SearchIcon>
                            <SearchInput
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </SearchWrapper>

                        <MonthSelector>
                            <IconButton onClick={() => changeMonth(-1)} title="Previous Month">
                                <ChevronLeft size={20} />
                            </IconButton>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Calendar size={20} style={{ color: 'var(--primary)' }} />
                                <span>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                            <IconButton onClick={() => changeMonth(1)} title="Next Month">
                                <ChevronRight size={20} />
                            </IconButton>
                        </MonthSelector>

                        <FilterSelect
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                        >
                            <option value="All">All Departments</option>
                            {departments.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </FilterSelect>

                        <PrimaryButton onClick={handleExport}>
                            <Download size={20} />
                            {viewMode === 'matrix' ? 'Export Matrix' : 'Export List'}
                        </PrimaryButton>
                    </Controls>

                    <TableWrapper>
                        {filteredData.length === 0 ? (
                            <NoData>
                                <EmptyIcon>📋</EmptyIcon>
                                <div style={{ fontSize: 'clamp(20px, 4vw, 28px)', fontWeight: 800, marginBottom: 12 }}>
                                    No records found
                                </div>
                                <div style={{ fontSize: 16, maxWidth: '500px', margin: '0 auto' }}>
                                    Try adjusting your search or filters.
                                </div>
                            </NoData>
                        ) : viewMode === 'matrix' ? (
                            <Table>
                                <THead>
                                    <tr>
                                        <TH style={{
                                            position: 'sticky',
                                            left: 0,
                                            background: 'var(--bg3)',
                                            zIndex: 30,
                                            minWidth: '250px',
                                            boxShadow: '4px 0 10px rgba(0,0,0,0.2)'
                                        }}>
                                            Employee Details
                                        </TH>
                                        {daysInMonth.map(dayInfo => (
                                            <TH key={dayInfo.day} style={{
                                                textAlign: 'center',
                                                minWidth: '130px',
                                                padding: '12px 8px',
                                                fontSize: '12px',
                                                background: 'var(--bg2)',
                                                borderBottom: '1px solid var(--border)'
                                            }}>
                                                <div style={{ color: 'var(--text-muted)' }}>{dayInfo.dateStr}</div>
                                                <div style={{ fontSize: '15px', color: 'var(--text)', fontWeight: 600 }}>{dayInfo.dayName}</div>
                                            </TH>
                                        ))}
                                    </tr>
                                </THead>
                                <TBody>
                                    {matrixData.map((emp) => (
                                        <TR key={emp.id}>
                                            <TD style={{
                                                position: 'sticky',
                                                left: 0,
                                                background: 'var(--bg2)',
                                                zIndex: 25,
                                                borderRight: '1px solid var(--border)',
                                                padding: '16px',
                                                verticalAlign: 'top'
                                            }}>
                                                <EmployeeCell>
                                                    <EmployeeAvatar style={{ width: 36, height: 36, fontSize: 14 }}>
                                                        {emp.name?.charAt(0) || 'U'}
                                                    </EmployeeAvatar>
                                                    <EmployeeInfo>
                                                        <EmployeeName style={{ fontSize: 14 }}>{emp.name}</EmployeeName>
                                                        <EmployeeMeta style={{ fontSize: 11 }}>{emp.id}</EmployeeMeta>
                                                    </EmployeeInfo>
                                                </EmployeeCell>
                                            </TD>
                                            {daysInMonth.map(dayInfo => {
                                                const record = emp.records[dayInfo.dateStr];
                                                const status = record?.status;
                                                const color = getStatusColor(status);

                                                if (!record) {
                                                    return (
                                                        <TD key={dayInfo.day} style={{ padding: '4px', verticalAlign: 'top', background: 'var(--bg1)' }}>
                                                            <div style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>-</div>
                                                        </TD>
                                                    );
                                                }

                                                const deviations = getShiftDeviations(record);

                                                return (
                                                    <TD key={dayInfo.day} style={{ padding: '6px', verticalAlign: 'top' }}>
                                                        <div style={{
                                                            background: status ? `${color}08` : 'transparent',
                                                            border: status ? `1px solid ${color}25` : '1px solid var(--border)',
                                                            borderRadius: '8px',
                                                            padding: '6px',
                                                            minHeight: '86px',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '3px',
                                                            textAlign: 'left'
                                                        }}>
                                                            {/* Status Header */}
                                                            <div style={{
                                                                fontSize: '10px',
                                                                fontWeight: 700,
                                                                color: color,
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                marginBottom: '2px'
                                                            }}>
                                                                <span>{status?.toUpperCase()}</span>
                                                            </div>

                                                            {/* Shift Details */}
                                                            <div style={{ fontSize: '10px', color: 'var(--text)' }}>
                                                                <div style={{ fontWeight: 600, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '115px' }}>
                                                                    {record.shift_name?.replace('Shift', '') || '-'}
                                                                </div>
                                                                <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
                                                                    {record.shift_timing || ''}
                                                                </div>
                                                            </div>

                                                            {/* Punch Times */}
                                                            {(status === 'Present' || status === 'Late Login' || status === 'Early Checkout' || status === 'Mismatched Punch' || status === 'Late In & Early Out') && (
                                                                <div style={{ marginTop: 'auto', paddingTop: '4px', borderTop: `1px solid ${color}15` }}>
                                                                    {deviations && (
                                                                        <div style={{ fontSize: '9px', color: 'var(--danger)', fontWeight: 600, background: 'rgba(239, 68, 68, 0.1)', padding: '2px 4px', borderRadius: '4px', textAlign: 'center', marginBottom: '4px' }}>
                                                                            {deviations}
                                                                        </div>
                                                                    )}
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '1px' }}>
                                                                        <span style={{ color: 'var(--text-muted)' }}>In</span>
                                                                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{formatTimeIST(record.check_in)}</span>
                                                                    </div>
                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                                                                        <span style={{ color: 'var(--text-muted)' }}>Out</span>
                                                                        <span style={{ fontWeight: 600, color: 'var(--text)' }}>{formatTimeIST(record.check_out)}</span>
                                                                    </div>
                                                                    {record.total_hours && (
                                                                        <div style={{ textAlign: 'center', fontSize: '10px', marginTop: '2px', color: 'var(--success)', fontWeight: 700 }}>
                                                                            {record.total_hours}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TD>
                                                );
                                            })}
                                        </TR>
                                    ))}
                                </TBody>
                            </Table>
                        ) : (
                            <Table>
                                <THead>
                                    <tr>
                                        <TH>Date</TH>
                                        <TH>Employee</TH>
                                        <TH>Shift Info</TH>
                                        <TH>Check In</TH>
                                        <TH>Check Out</TH>
                                        <TH>Total Hrs</TH>
                                        <TH>Status</TH>
                                    </tr>
                                </THead>
                                <TBody>
                                    {filteredData.map((row, idx) => (
                                        <TR key={idx}>
                                            <TD style={{ fontWeight: 600, color: 'var(--accent)' }}>{row.date}</TD>
                                            <TD>
                                                <EmployeeCell>
                                                    <EmployeeAvatar style={{ width: 32, height: 32, fontSize: 12 }}>{row.employee_name?.charAt(0)}</EmployeeAvatar>
                                                    <EmployeeInfo>
                                                        <EmployeeName style={{ fontSize: 13 }}>{row.employee_name}</EmployeeName>
                                                        <EmployeeMeta style={{ fontSize: 11 }}>{row.employee_id} • {row.department}</EmployeeMeta>
                                                    </EmployeeInfo>
                                                </EmployeeCell>
                                            </TD>
                                            <TD>
                                                <div style={{ fontSize: 13, fontWeight: 500 }}>{row.shift_name}</div>
                                                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.shift_timing}</div>
                                            </TD>
                                            <TD>
                                                <TimeBadge>{formatTimeIST(row.check_in)}</TimeBadge>
                                            </TD>
                                            <TD>
                                                <TimeBadge>{formatTimeIST(row.check_out)}</TimeBadge>
                                            </TD>
                                            <TD style={{ fontWeight: 700 }}>{row.total_hours}</TD>
                                            <TD>
                                                <StatusBadge $status={row.status}>{row.status}</StatusBadge>
                                            </TD>
                                        </TR>
                                    ))}
                                </TBody>
                            </Table>
                        )}
                    </TableWrapper>
                </Card>
            </Container>
        </Page>
    );
};

export default RosterAttendanceReport;
