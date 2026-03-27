import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes, css } from 'styled-components';
import {
    Calendar, Download, ChevronLeft, ChevronRight,
    Search, FileText, Layers, Clock, Shield,
    CheckCircle, XCircle, AlertTriangle, LayoutGrid, List,
    RefreshCw
} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api, { HR_BASE_URL } from '../api';

// ─── Animations ─────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -800px 0; }
  100% { background-position: 800px 0; }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// ─── Page Shell ──────────────────────────────────────────────────────────────
const Page = styled.div`
  min-height: 100vh;
  padding: clamp(16px, 4vw, 36px);
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  animation: ${fadeUp} 0.4s ease-out;
`;

// ─── Header ──────────────────────────────────────────────────────────────────
const PageHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TitleBlock = styled.div``;

const PageTitle = styled.h1`
  margin: 0 0 6px;
  font-size: clamp(22px, 4vw, 32px);
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.15;
`;

const PageSubtitle = styled.p`
  margin: 0;
  color: var(--text-muted);
  font-size: 14px;
  font-weight: 500;
`;

const ExportBtn = styled.button`
  height: 44px;
  padding: 0 22px;
  border: none;
  background: linear-gradient(135deg, var(--primary), var(--primary-dark, #4f46e5));
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(102,126,234,0.35);
  transition: transform 0.18s, box-shadow 0.18s;
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(102,126,234,0.45);
  }
`;

// ─── Stats Grid ───────────────────────────────────────────────────────────────
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: var(--glass, rgba(255,255,255,0.07));
  backdrop-filter: blur(18px);
  border: 1px solid var(--border, rgba(255,255,255,0.12));
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${props => props.$accent || 'var(--primary)'};
    border-radius: 16px 16px 0 0;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0,0,0,0.15);
  }
`;

const StatIconBox = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$bg || 'rgba(102,126,234,0.12)'};
  color: ${props => props.$color || 'var(--primary)'};
  flex-shrink: 0;
`;

const StatBody = styled.div``;

const StatLabel = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--text-muted);
  margin-bottom: 4px;
`;

const StatValue = styled.div`
  font-size: clamp(22px, 3.5vw, 30px);
  font-weight: 900;
  color: ${props => props.$color || 'var(--text)'};
  line-height: 1;
`;

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  margin-top: 12px;
  width: 100%;
`;

const ChipLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #64748b;
  margin-right: 4px;
  white-space: nowrap;
`;

const DeptChip = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 13px;
  background: ${props => props.selected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.selected ? '#818cf8' : '#94a3b8'};
  border: 1px solid ${props => props.selected ? 'rgba(99, 102, 241, 0.35)' : 'rgba(255,255,255,0.07)'};
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s;
  user-select: none;

  &:hover {
    background: ${props => props.selected ? 'rgba(99, 102, 241, 0.28)' : 'rgba(255, 255, 255, 0.09)'};
    transform: translateY(-1px);
    color: ${props => props.selected ? '#a5b4fc' : '#cbd5e1'};
  }
`;

// ─── Toolbar ─────────────────────────────────────────────────────────────────
const Toolbar = styled.div`
  background: var(--glass, rgba(255,255,255,0.07));
  backdrop-filter: blur(18px);
  border: 1px solid var(--border, rgba(255,255,255,0.12));
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  background: var(--glass-dark, rgba(0,0,0,0.15));
  border-radius: 10px;
  padding: 3px;
  gap: 2px;
  border: 1px solid var(--border-light, rgba(255,255,255,0.08));
  flex-shrink: 0;
`;

const ViewBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, color 0.18s;
  background: ${props => props.$active ? 'rgba(255,255,255,0.12)' : 'transparent'};
  color: ${props => props.$active ? 'var(--primary)' : 'var(--text-muted)'};

  &:hover { color: var(--primary); }
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 220px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-dim, #6b7280);
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 0 16px 0 44px;
  background: var(--glass-dark, rgba(0,0,0,0.15));
  border: 1px solid var(--border-light, rgba(255,255,255,0.08));
  border-radius: 10px;
  color: var(--text);
  font-size: 14px;
  transition: border-color 0.18s, box-shadow 0.18s;

  &::placeholder { color: var(--text-dim, #9ca3af); }
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(102,126,234,0.18);
  }
`;

const MonthNav = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--glass-dark, rgba(0,0,0,0.15));
  border: 1px solid var(--border-light, rgba(255,255,255,0.08));
  border-radius: 10px;
  padding: 4px 10px;
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const NavBtn = styled.button`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 7px;
  color: var(--text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: rgba(255,255,255,0.1);
    color: var(--primary);
  }
`;

const DeptSelect = styled.select`
  height: 42px;
  padding: 0 16px;
  background: var(--glass-dark, rgba(0,0,0,0.15));
  border: 1px solid var(--border-light, rgba(255,255,255,0.08));
  border-radius: 10px;
  color: var(--text);
  font-size: 14px;
  font-weight: 500;
  min-width: 170px;
  cursor: pointer;
  flex-shrink: 0;

  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(102,126,234,0.18);
  }

  option { background: var(--bg2, #1e293b); }
`;

// ─── Table Card ───────────────────────────────────────────────────────────────
const TableCard = styled.div`
  background: var(--glass, rgba(255,255,255,0.07));
  backdrop-filter: blur(18px);
  border: 1px solid var(--border, rgba(255,255,255,0.12));
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
`;

const TableCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border, rgba(255,255,255,0.12));
  gap: 12px;
  flex-wrap: wrap;
`;

const TableCardTitle = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RecordCount = styled.div`
  font-size: 12px;
  background: rgba(102,126,234,0.15);
  color: var(--primary);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 700;
  border: 1px solid rgba(102,126,234,0.25);
`;

// ─── Scrollable Table Shell ───────────────────────────────────────────────────
const ScrollShell = styled.div`
  width: 100%;
  overflow: auto;
  max-height: 70vh;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar { 
    width: 6px;
    height: 6px; 
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(255,255,255,0.04);
  }
`;

const Table = styled.table`
  width: 100%;
  min-width: ${props => props.$minWidth || '900px'};
  border-collapse: separate;
  border-spacing: 0;
`;

const THead = styled.thead`
  position: sticky;
  top: 0;
  z-index: 20;
`;

const TH = styled.th`
  padding: 14px 18px;
  text-align: left;
  color: var(--text-muted);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.7px;
  white-space: nowrap;
  background: var(--bg3, #0f172a);
  border-bottom: 1px solid var(--border, rgba(255,255,255,0.1));

  &.center { text-align: center; }
  &.weekend { color: var(--warning, #f59e0b); }
  &.sunday { color: #ef4444; }
`;

const TR = styled.tr`
  transition: background 0.15s;

  &:nth-child(even) {
    background: rgba(255,255,255,0.015);
  }
  &:hover {
    background: rgba(102,126,234,0.08);
  }
`;

const TD = styled.td`
  padding: 14px 18px;
  color: var(--text);
  font-size: 13px;
  border-bottom: 1px solid var(--border-light, rgba(255,255,255,0.05));
  vertical-align: middle;
  white-space: nowrap;
`;

// ─── Employee Cell ────────────────────────────────────────────────────────────
const EmployeeCell = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary, #667eea), var(--accent, #22d3ee));
  color: #fff;
  font-size: 14px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const EmpName = styled.div`
  font-weight: 700;
  font-size: 13px;
  color: var(--text);
  margin-bottom: 2px;
`;

const EmpMeta = styled.div`
  font-size: 11px;
  color: var(--text-muted);
`;

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  display: inline-block;
  background: currentColor;
  flex-shrink: 0;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2px;
  white-space: nowrap;

  ${({ $status }) => {
        switch ($status) {
            case 'Present':
                return css`background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.25);`;
            case 'Absent':
                return css`background: rgba(239,68,68,0.12); color: #ef4444; border: 1px solid rgba(239,68,68,0.25);`;
            case 'Week Off':
            case 'Week Off/Holiday':
                return css`background: rgba(99,102,241,0.12); color: var(--primary,#6366f1); border: 1px solid rgba(99,102,241,0.25);`;
            case 'Late Login':
            case 'Early Checkout':
            case 'Late In & Early Out':
            case 'Mismatched Punch':
            case 'Single Punch':
                return css`background: rgba(245,158,11,0.12); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25);`;
            default:
                return css`background: rgba(148,163,184,0.1); color: var(--text-muted); border: 1px solid rgba(148,163,184,0.2);`;
        }
    }}
`;

// ─── Time Pill ────────────────────────────────────────────────────────────────
const TimePill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  background: rgba(34,211,238,0.1);
  color: var(--accent, #22d3ee);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(34,211,238,0.2);
`;

// ─── Matrix Cell ──────────────────────────────────────────────────────────────
const MatrixCell = styled.div`
  background: ${props => props.$color ? `${props.$color}0d` : 'transparent'};
  border: 1px solid ${props => props.$color ? `${props.$color}30` : 'var(--border-light, rgba(255,255,255,0.05))'};
  border-radius: 8px;
  padding: 5px 6px;
  min-height: 82px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 10px;
`;

const MatrixStatus = styled.div`
  font-size: 10px;
  font-weight: 800;
  color: ${props => props.$color || 'var(--text-muted)'};
`;

const MatrixShift = styled.div`
  font-size: 9px;
  color: var(--text);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 115px;
`;

const MatrixMeta = styled.div`
  font-size: 9px;
  color: var(--text-muted);
`;

const MatrixDeviations = styled.div`
  font-size: 8px;
  font-weight: 700;
  color: #ef4444;
  background: rgba(239,68,68,0.1);
  border-radius: 4px;
  padding: 1px 4px;
  text-align: center;
`;

const MatrixTimes = styled.div`
  margin-top: auto;
  padding-top: 4px;
  border-top: 1px solid ${props => props.$color ? `${props.$color}20` : 'var(--border-light)'};
`;

const MatrixTimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: var(--text-muted);

  span:last-child {
    font-weight: 700;
    color: var(--text);
  }
`;

const MatrixTotal = styled.div`
  text-align: center;
  font-size: 9px;
  font-weight: 800;
  color: #10b981;
  margin-top: 1px;
`;

// ─── Empty / Loading States ───────────────────────────────────────────────────
const EmptyState = styled.div`
  padding: 72px 32px;
  text-align: center;
  color: var(--text-muted);
`;

const EmptyEmoji = styled.div`
  font-size: 52px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: var(--text);
  margin-bottom: 8px;
`;

const EmptyHint = styled.div`
  font-size: 14px;
  color: var(--text-muted);
  max-width: 380px;
  margin: 0 auto;
`;

const SkeletonRow = styled.div`
  height: 54px;
  border-radius: 8px;
  background: linear-gradient(90deg,
    rgba(255,255,255,0.04) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 75%
  );
  background-size: 800px 100%;
  animation: ${shimmer} 1.4s infinite linear;
  margin: 8px 16px;
`;

const LoadingState = () => (
    <TableCard>
        {[...Array(6)].map((_, i) => <SkeletonRow key={i} style={{ opacity: 1 - i * 0.12 }} />)}
    </TableCard>
);

// ─── Helper Functions ─────────────────────────────────────────────────────────
// const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

const isWeekend = (dateStr) => {
    const d = new Date(dateStr);
    const day = d.getDay();
    return day === 0 || day === 6;
};

const ymd = (d) => {
    if (!d || isNaN(new Date(d).getTime())) return "";
    const dateObj = new Date(d);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const getDaysInRange = (start, end) => {
    if (!start || !end) return [];
    const days = [];
    let curr = new Date(start);
    curr.setHours(0, 0, 0, 0);
    const endLimit = new Date(end);
    endLimit.setHours(23, 59, 59, 999);

    while (curr <= endLimit) {
        days.push({
            day: curr.getDate(),
            dateStr: ymd(curr),
            dayName: curr.toLocaleDateString('en-US', { weekday: 'narrow' }),
            isWeekend: curr.getDay() === 0 || curr.getDay() === 6,
            isSunday: curr.getDay() === 0,
        });
        curr.setDate(curr.getDate() + 1);
    }
    return days;
};

// ─── Main Component ───────────────────────────────────────────────────────────
const RosterAttendanceReport = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [selectedDepts, setSelectedDepts] = useState([]);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('matrix');

    // Fetch Departments
    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await api.get(`departments/`);
                setDepartments(res.data);
            } catch (err) { console.error('Failed to fetch departments', err); }
        };
        fetchDepts();
    }, []);

    // Role-based default dept
    useEffect(() => {
        const role = localStorage.getItem('role');
        const dept = localStorage.getItem('department_id');
        if (role && !['Admin', 'admin'].includes(role) && dept) setSelectedDepts([dept]);
    }, []);

    // Fetch Report
    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const from_date = ymd(startDate);
                const to_date = endDate ? ymd(new Date(endDate.getTime() + 86400000)) : ymd(startDate);

                let url = `roster-report/?from_date=${from_date}&to_date=${to_date}`;
                const role = localStorage.getItem('role');
                const dept = localStorage.getItem('department_id');

                if (role && !['Admin', 'admin'].includes(role) && dept) {
                    url += `&department=${encodeURIComponent(dept)}`;
                } else if (selectedDepts.length > 0) {
                    url += `&department=${encodeURIComponent(selectedDepts.join(','))}`;
                }

                const res = await api.get(url);
                setReportData(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Failed to fetch roster attendance report', err);
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [startDate, endDate, selectedDepts]);

    // ── Derived Data ────────────────────────────────────────────────────────────
    const filteredData = useMemo(() => {
        return reportData
            .filter(item => {
                const q = searchTerm.toLowerCase();
                return (
                    item.employee_name?.toLowerCase().includes(q) ||
                    item.employee_id?.toLowerCase().includes(q) ||
                    item.department?.toLowerCase().includes(q) ||
                    item.designation?.toLowerCase().includes(q)
                );
            })
            .sort((a, b) => {
                const n = (a.employee_name || '').localeCompare(b.employee_name || '');
                return n !== 0 ? n : new Date(a.date) - new Date(b.date);
            });
    }, [reportData, searchTerm]);

    const stats = useMemo(() => ({
        employees: [...new Set(filteredData.map(i => i.employee_id))].length,
        present: filteredData.filter(i => i.status === 'Present').length,
        absent: filteredData.filter(i => i.status === 'Absent').length,
        exceptions: filteredData.filter(i =>
            ['Late Login', 'Early Checkout', 'Mismatched Punch', 'Single Punch', 'Late In & Early Out'].includes(i.status)
        ).length,
    }), [filteredData]);

    const daysInMonth = useMemo(() => {
        return getDaysInRange(startDate, endDate);
    }, [startDate, endDate]);

    const matrixData = useMemo(() => {
        const groups = {};
        filteredData.forEach(item => {
            if (!groups[item.employee_id]) {
                groups[item.employee_id] = {
                    id: item.employee_id, name: item.employee_name,
                    dept: item.department, desg: item.designation, records: {},
                };
            }
            groups[item.employee_id].records[item.date] = item;
        });
        return Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
    }, [filteredData]);

    // ── Utilities ───────────────────────────────────────────────────────────────
    const getStatusColor = (status) => {
        if (!status) return null;
        if (status === 'Present') return '#10b981';
        if (status === 'Absent') return '#ef4444';
        if (status.includes('Off') || status.includes('Holiday')) return '#6366f1';
        if (['Late Login', 'Early Checkout', 'Mismatched Punch', 'Single Punch', 'Late In & Early Out'].includes(status))
            return '#f59e0b';
        return '#94a3b8';
    };

    const getStatusAbbr = (status) => {
        if (!status) return '-';
        const map = {
            Present: 'P', Absent: 'A', 'Week Off': 'WO',
            'Week Off/Holiday': 'PH', 'Single Punch': 'SP',
            'Mismatched Punch': 'SP', 'Late Login': 'LL',
            'Early Checkout': 'EC', 'Late In & Early Out': 'LI/EO',
        };
        return map[status] || status;
    };

    const formatTimeIST = (dateStr) => {
        if (!dateStr || dateStr === '-' || dateStr === 'None') return '-';
        try {
            const toIST = (d) => new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Kolkata', hour: 'numeric', minute: '2-digit', hour12: true,
            }).format(d);

            if (dateStr.includes('T') || (dateStr.includes('-') && dateStr.includes(':'))) {
                const d = new Date(dateStr);
                if (!isNaN(d.getTime())) return toIST(d);
            }
            const parts = dateStr.split(':');
            if (parts.length >= 2) {
                const d = new Date();
                d.setUTCHours(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2] || 0));
                return toIST(d);
            }
            return dateStr;
        } catch { return dateStr; }
    };

    // ── Export Logic (unchanged from original) ──────────────────────────────────
    const getHexColor = (status) => {
        if (!status) return '#000000';
        if (status === 'Present') return '#10b981';
        if (status === 'Absent') return '#ef4444';
        if (status.includes('Off') || status.includes('Holiday')) return '#3b82f6';
        if (['Late Login', 'Early Checkout', 'Mismatched Punch', 'Single Punch', 'Late In & Early Out'].includes(status))
            return '#f59e0b';
        return '#000000';
    };

    const downloadExcel = (headers, rows, filename) => {
        let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8" /></head><body>';
        html += '<table border="1" style="border-collapse:collapse;"><thead><tr>';
        headers.forEach(h => { html += `<th style="background:#f1f5f9;font-weight:bold;padding:5px;">${h}</th>`; });
        html += '</tr></thead><tbody>';
        rows.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                if (typeof cell === 'object' && cell?.value !== undefined)
                    html += `<td style="color:${cell.color};font-weight:bold;padding:5px;">${cell.value}</td>`;
                else html += `<td style="padding:5px;">${cell}</td>`;
            });
            html += '</tr>';
        });
        html += '</tbody></table></body></html>';
        const blob = new Blob([html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url; link.download = filename;
        document.body.appendChild(link); link.click(); document.body.removeChild(link);
    };

    const handleExport = () => {
        const formatTime24 = (dateStr) => {
            if (!dateStr || dateStr === '-' || dateStr === 'None') return '-';
            try {
                const toIST24 = (d) => new Intl.DateTimeFormat('en-GB', {
                    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false,
                }).format(d);
                if (dateStr.includes('T') || (dateStr.includes('-') && dateStr.includes(':'))) {
                    const d = new Date(dateStr); if (!isNaN(d.getTime())) return toIST24(d);
                }
                const parts = dateStr.split(':');
                if (parts.length >= 2) {
                    const d = new Date();
                    d.setUTCHours(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2] || 0));
                    return toIST24(d);
                }
                return dateStr;
            } catch { return dateStr; }
        };

        if (viewMode === 'matrix') {
            const headerRow1 = ['S.No', 'Employee ID', 'Employee Name', 'Department', 'Designation',
                ...daysInMonth.flatMap(d => [`${d.dateStr} ${d.dayName}`, '', '', '', ''])];
            const headerRow2 = ['', '', '', '', '', ...daysInMonth.flatMap(() => ['Shift', 'In', 'Out', 'Total', 'Late/Early'])];
            const dataRows = matrixData.map((emp, idx) => {
                const row = [idx + 1, emp.id || '', emp.name || '', emp.dept || '', emp.desg || ''];
                daysInMonth.forEach(dayInfo => {
                    const record = emp.records[dayInfo.dateStr];
                    if (!record) { row.push('-', '-', '-', '-', '-'); return; }
                    let sv = '-';
                    if (record.shift_name) sv = `${record.shift_name.charAt(0).toUpperCase()}(${record.shift_timing?.replace(/\s+/g, '') || ''})`;
                    else sv = getStatusAbbr(record.status) || '-';
                    row.push(
                        { value: sv, color: getHexColor(record.status) },
                        formatTime24(record.check_in), formatTime24(record.check_out),
                        record.total_hours || (record.status === 'Absent' ? '0.00' : '-'),
                        record.late_early_hrs || '-'
                    );
                });
                return row;
            });
            downloadExcel(headerRow1, [headerRow2, ...dataRows], `Roster_Matrix_${startDate.toISOString().slice(0, 7)}.xls`);
        } else {
            const from_date = ymd(startDate);
            const to_date = endDate ? ymd(new Date(endDate.getTime() + 86400000)) : ymd(startDate);
            let url = `${HR_BASE_URL}roster-report/?from_date=${from_date}&to_date=${to_date}&export=flat_xlsx`;
            
            const role = localStorage.getItem('role');
            const dept = localStorage.getItem('department_id');
            if (role && !['Admin', 'admin'].includes(role) && dept) {
                url += `&department=${encodeURIComponent(dept)}`;
            } else if (selectedDepts.length > 0) {
                url += `&department=${encodeURIComponent(selectedDepts.join(','))}`;
            }
            window.location.href = url;
        }
    };

    const handleExportDetailed = () => {
        const from_date = ymd(startDate);
        const to_date = endDate ? ymd(new Date(endDate.getTime() + 86400000)) : ymd(startDate);
        
        let url = `${HR_BASE_URL}roster-report/?from_date=${from_date}&to_date=${to_date}&export=xlsx`;
        
        const role = localStorage.getItem('role');
        const dept = localStorage.getItem('department_id');
        if (role && !['Admin', 'admin'].includes(role) && dept) {
            url += `&department=${encodeURIComponent(dept)}`;
        } else if (selectedDepts.length > 0) {
            url += `&department=${encodeURIComponent(selectedDepts.join(','))}`;
        }
        
        window.location.href = url;
    };

    const toggleDepartment = (deptId) => {
        setSelectedDepts(prev =>
            prev.includes(deptId)
                ? prev.filter(id => id !== deptId)
                : [...prev, deptId]
        );
    };

    // ─── Render ─────────────────────────────────────────────────────────────────
    return (
        <Page>
            <Container>

                {/* Page Header */}
                <PageHeader style={{ flexWrap: 'wrap', gap: '12px' }}>
                    <TitleBlock>
                        <PageTitle>
                            <FileText size={28} />
                            Roster vs Actual Attendance
                        </PageTitle>
                        <PageSubtitle>
                            Custom Date Range Report
                        </PageSubtitle>
                    </TitleBlock>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <ExportBtn onClick={handleExport}>
                            <Download size={16} />
                            {viewMode === 'matrix' ? 'Status Matrix' : 'Export List'}
                        </ExportBtn>
                        <ExportBtn onClick={handleExportDetailed} style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 6px 20px rgba(16,185,129,0.3)' }}>
                            <Download size={16} />
                            Detailed XLSX
                        </ExportBtn>
                    </div>

                    {['Admin', 'admin'].includes(localStorage.getItem('role')) && departments.length > 0 && (
                        <DeptSelect
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
                        </DeptSelect>
                    )}
                </PageHeader>

                {/* Stats Row */}
                <StatsRow>
                    <StatCard $accent="var(--primary,#6366f1)">
                        <StatIconBox $bg="rgba(99,102,241,0.12)" $color="var(--primary,#6366f1)">
                            <Layers size={22} />
                        </StatIconBox>
                        <StatBody>
                            <StatLabel>Employees</StatLabel>
                            <StatValue>{viewMode === 'matrix' ? matrixData.length : stats.employees}</StatValue>
                        </StatBody>
                    </StatCard>

                    <StatCard $accent="#10b981">
                        <StatIconBox $bg="rgba(16,185,129,0.12)" $color="#10b981">
                            <CheckCircle size={22} />
                        </StatIconBox>
                        <StatBody>
                            <StatLabel>Present</StatLabel>
                            <StatValue $color="#10b981">{stats.present}</StatValue>
                        </StatBody>
                    </StatCard>

                    <StatCard $accent="#ef4444">
                        <StatIconBox $bg="rgba(239,68,68,0.12)" $color="#ef4444">
                            <XCircle size={22} />
                        </StatIconBox>
                        <StatBody>
                            <StatLabel>Absent</StatLabel>
                            <StatValue $color="#ef4444">{stats.absent}</StatValue>
                        </StatBody>
                    </StatCard>

                    <StatCard $accent="#f59e0b">
                        <StatIconBox $bg="rgba(245,158,11,0.12)" $color="#f59e0b">
                            <AlertTriangle size={22} />
                        </StatIconBox>
                        <StatBody>
                            <StatLabel>Exceptions</StatLabel>
                            <StatValue $color="#f59e0b">{stats.exceptions}</StatValue>
                        </StatBody>
                    </StatCard>
                </StatsRow>



                {/* Toolbar */}
                <Toolbar>
                    {/* View Toggle */}
                    <ViewToggle>
                        <ViewBtn $active={viewMode === 'matrix'} onClick={() => setViewMode('matrix')}>
                            <LayoutGrid size={15} /> Matrix
                        </ViewBtn>
                        <ViewBtn $active={viewMode === 'list'} onClick={() => setViewMode('list')}>
                            <List size={15} /> List
                        </ViewBtn>
                    </ViewToggle>

                    {/* Search */}
                    <SearchBox>
                        <SearchIcon><Search size={17} /></SearchIcon>
                        <SearchInput
                            placeholder="Search employee, ID, department…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </SearchBox>

                    {/* Date Pickers */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        background: 'var(--glass-dark, rgba(0,0,0,0.15))',
                        border: '1px solid var(--border-light, rgba(255,255,255,0.08))',
                        borderRadius: 10, padding: '4px 12px', height: 42
                    }}>
                        <Calendar size={15} style={{ color: 'var(--primary,#6366f1)' }} />
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
                            className="custom-date-picker"
                            placeholderText="Select date range"
                            portalId="root"
                        />
                    </div>
                </Toolbar>

                {/* Table */}
                {loading ? (
                    <LoadingState />
                ) : filteredData.length === 0 ? (
                    <TableCard>
                        <EmptyState>
                            <EmptyEmoji>📋</EmptyEmoji>
                            <EmptyTitle>No records found</EmptyTitle>
                             <EmptyHint>Try adjusting your date range, department, or clear your search filter.</EmptyHint>
                        </EmptyState>
                    </TableCard>
                ) : (
                    <TableCard>
                        <TableCardHeader>
                            <TableCardTitle>
                                {viewMode === 'matrix' ? <LayoutGrid size={16} /> : <List size={16} />}
                                {viewMode === 'matrix'
                                    ? `Matrix — ${matrixData.length} Employees`
                                    : `Detailed List`}
                            </TableCardTitle>
                            <RecordCount>
                                {viewMode === 'matrix' ? matrixData.length : filteredData.length} records
                            </RecordCount>
                        </TableCardHeader>

                        <ScrollShell>
                            {/* ── MATRIX VIEW ─────────────────────────────────────── */}
                            {viewMode === 'matrix' ? (
                                <Table $minWidth={`${250 + daysInMonth.length * 130}px`}>
                                    <THead>
                                        <tr>
                                            <TH style={{
                                                position: 'sticky', left: 0, zIndex: 30,
                                                minWidth: 250, background: 'var(--bg3,#0f172a)',
                                                boxShadow: '4px 0 12px rgba(0,0,0,0.25)'
                                            }}>
                                                Employee
                                            </TH>
                                            {daysInMonth.map(d => (
                                                <TH
                                                    key={d.day}
                                                    className={`center${d.isWeekend ? ' weekend' : ''}${d.isSunday ? ' sunday' : ''}`}
                                                    style={{ minWidth: 130, padding: '10px 6px', fontSize: 11 }}
                                                >
                                                    <div style={{ fontSize: 9, opacity: 0.7 }}>{d.dateStr}</div>
                                                    <div style={{ fontSize: 13, fontWeight: 800 }}>{d.dayName}</div>
                                                </TH>
                                            ))}
                                        </tr>
                                    </THead>
                                    <tbody>
                                        {matrixData.map(emp => (
                                            <TR key={emp.id}>
                                                <TD style={{
                                                    position: 'sticky', left: 0, zIndex: 10,
                                                    background: 'var(--bg2,#1e293b)',
                                                    borderRight: '1px solid var(--border,rgba(255,255,255,0.1))',
                                                    boxShadow: '4px 0 12px rgba(0,0,0,0.15)'
                                                }}>
                                                    <EmployeeCell>
                                                        <Avatar>{emp.name?.charAt(0) || 'U'}</Avatar>
                                                        <div>
                                                            <EmpName>{emp.name}</EmpName>
                                                            <EmpMeta>
                                                                <span style={{ color: 'var(--accent,#22d3ee)' }}>{emp.id}</span>
                                                                {emp.desg && ` · ${emp.desg}`}
                                                            </EmpMeta>
                                                        </div>
                                                    </EmployeeCell>
                                                </TD>

                                                {daysInMonth.map(dayInfo => {
                                                    const record = emp.records[dayInfo.dateStr];
                                                    if (!record) return (
                                                        <TD key={dayInfo.day} style={{ padding: 5, verticalAlign: 'top', opacity: 0.3 }}>
                                                            <div style={{ textAlign: 'center', fontSize: 10, paddingTop: 14 }}>–</div>
                                                        </TD>
                                                    );

                                                    const color = getStatusColor(record.status);
                                                    const hasTimes = ['Present', 'Late Login', 'Early Checkout',
                                                        'Mismatched Punch', 'Single Punch', 'Late In & Early Out'].includes(record.status);

                                                    return (
                                                        <TD key={dayInfo.day} style={{ padding: 5, verticalAlign: 'top' }}>
                                                            <MatrixCell $color={color}>
                                                                <MatrixStatus $color={color}>{getStatusAbbr(record.status)}</MatrixStatus>
                                                                <MatrixShift>{record.shift_name?.replace('Shift', '') || '–'}</MatrixShift>
                                                                <MatrixMeta>{record.shift_timing || ''}</MatrixMeta>
                                                                {hasTimes && (
                                                                    <MatrixTimes $color={color}>
                                                                        {record.late_early_hrs && record.late_early_hrs !== '-' && (
                                                                            <MatrixDeviations>{record.late_early_hrs}</MatrixDeviations>
                                                                        )}
                                                                        <MatrixTimeRow>
                                                                            <span>In</span>
                                                                            <span>{formatTimeIST(record.check_in)}</span>
                                                                        </MatrixTimeRow>
                                                                        <MatrixTimeRow>
                                                                            <span>Out</span>
                                                                            <span>{formatTimeIST(record.check_out)}</span>
                                                                        </MatrixTimeRow>
                                                                        {record.total_hours && (
                                                                            <MatrixTotal>{record.total_hours}</MatrixTotal>
                                                                        )}
                                                                    </MatrixTimes>
                                                                )}
                                                            </MatrixCell>
                                                        </TD>
                                                    );
                                                })}
                                            </TR>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                /* ── LIST VIEW ────────────────────────────────────────── */
                                <Table $minWidth="1000px">
                                    <THead>
                                        <tr>
                                            <TH style={{ width: 50 }}>#</TH>
                                            <TH>Employee</TH>
                                            <TH>Designation</TH>
                                            <TH>Date</TH>
                                            <TH>Shift</TH>
                                            <TH>Check In</TH>
                                            <TH>Check Out</TH>
                                            <TH>Total Hrs</TH>
                                            <TH>Late / Early</TH>
                                            <TH>Status</TH>
                                        </tr>
                                    </THead>
                                    <tbody>
                                        {filteredData.map((row, idx) => (
                                            <TR key={idx}>
                                                <TD style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{idx + 1}</TD>
                                                <TD>
                                                    <EmployeeCell>
                                                        <Avatar style={{ width: 32, height: 32, fontSize: 12, borderRadius: 8 }}>
                                                            {row.employee_name?.charAt(0)}
                                                        </Avatar>
                                                        <div>
                                                            <EmpName>{row.employee_name}</EmpName>
                                                            <EmpMeta>
                                                                <span style={{ color: 'var(--accent,#22d3ee)', fontWeight: 600 }}>
                                                                    {row.employee_id}
                                                                </span>
                                                                {row.department && ` · ${row.department}`}
                                                            </EmpMeta>
                                                        </div>
                                                    </EmployeeCell>
                                                </TD>
                                                <TD style={{ color: 'var(--text-muted)' }}>{row.designation || '–'}</TD>
                                                <TD style={{ fontWeight: 700, color: 'var(--primary-light,#a5b4fc)' }}>{row.date}</TD>
                                                <TD>
                                                    <div style={{ fontSize: 13, fontWeight: 600 }}>{row.shift_name || '–'}</div>
                                                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.shift_timing}</div>
                                                </TD>
                                                <TD>
                                                    <TimePill><Clock size={11} />{formatTimeIST(row.check_in)}</TimePill>
                                                </TD>
                                                <TD>
                                                    <TimePill><Clock size={11} />{formatTimeIST(row.check_out)}</TimePill>
                                                </TD>
                                                <TD style={{ fontWeight: 700, color: '#10b981' }}>{row.total_hours || '–'}</TD>
                                                <TD style={{ fontWeight: 600, color: '#f59e0b' }}>{row.late_early_hrs || '–'}</TD>
                                                <TD>
                                                    <StatusBadge $status={row.status}>
                                                        <StatusDot />{row.status}
                                                    </StatusBadge>
                                                </TD>
                                            </TR>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </ScrollShell>
                    </TableCard>
                )}

            </Container>
        </Page>
    );
};

export default RosterAttendanceReport;
