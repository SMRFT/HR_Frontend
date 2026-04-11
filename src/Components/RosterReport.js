import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
    Calendar, Download, ChevronLeft, ChevronRight,
    Search, FileText, User, Layers, Clock, Shield
} from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Page = styled.div`
  min-height: 100vh;
  padding: clamp(20px, 4vw, 40px);
  background: linear-gradient(180deg, var(--bg1), var(--bg2));
`;

const Container = styled.div`
  max-width: 1400px; /* Wider for roster table */
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
`;

const StatCard = styled.div`
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  box-shadow: var(--shadow);
  transition: var(--transition);

  &:hover {
    transform: translateY(-4px);
  }
`;

const StatLabel = styled.div`
  color: var(--muted);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatValue = styled.div`
  color: var(--text);
  font-size: 28px;
  font-weight: 800;
`;

const Controls = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
`;

const MonthSelector = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(255, 255, 255, 0.05);
    padding: 6px 12px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    font-weight: 500;
    font-size: 14px;
    height: 44px;
`;

const IconButton = styled.button`
    background: transparent;
    border: none;
    color: var(--muted);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    transition: color 0.2s;

    &:hover {
        color: var(--text);
    }
`;

const SearchInput = styled.input`
  height: 44px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.05);
  color: var(--text);
  border-radius: var(--radius-sm);
  padding: 0 16px 0 40px;
  font-size: 14px;
  width: 250px;

  &:focus {
    outline: none;
    border-color: var(--primary);
    background: rgba(255,255,255,0.08);
  }
`;

const DatePickerWrapper = styled.div`
  .custom-date-input {
    background: transparent;
    border: none;
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
    width: 100px;
    outline: none;
    cursor: pointer;
    text-align: center;
    border-radius: 4px;
    transition: all 0.2s;
    
    &:hover {
      background: rgba(255,255,255,0.05);
    }
  }

  .react-datepicker {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 12px;
    font-family: inherit;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    overflow: hidden;
  }

  .react-datepicker__header {
    background: rgba(0,0,0,0.2);
    border-bottom: 1px solid var(--border);
    padding-top: 12px;
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name {
    color: var(--text);
  }

  .react-datepicker__day {
    color: var(--text);
    border-radius: 8px;
    
    &:hover {
      background: var(--primary);
      color: white;
    }
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-range {
    background: var(--primary) !important;
    color: white !important;
  }

  .react-datepicker__day--disabled {
    color: var(--muted);
    opacity: 0.3;
  }
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
  min-width: 150px;

  option {
    background: var(--bg2);
  }
`;

const StyledSelect = styled.select`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  cursor: pointer;
  min-width: 250px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 16px;
  padding-right: 40px;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  option {
    background: #1e293b;
    color: #f1f5f9;
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
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.selected ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateY(-1px);
  }
`;

const Button = styled.a`
  height: 44px;
  padding: 0 20px;
  border: 1px solid var(--border);
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  color: white;
  font-weight: 600;
  font-size: 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: var(--transition);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99,102,241,0.3);
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
  border-collapse: collapse;
  min-width: 1500px;
`;

const TH = styled.th`
  padding: 12px 16px;
  text-align: center;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  background: rgba(15, 23, 42, 0.95);
  border-bottom: 2px solid var(--border);
  white-space: nowrap;
  
  &:first-child, &:nth-child(2) {
    text-align: left;
    position: sticky;
    z-index: 10;
    background: rgba(15, 23, 42, 0.98); 
  }
  &:first-child { left: 0; }
  &:nth-child(2) { left: 200px; }
`;

const TD = styled.td`
  padding: 12px 16px;
  color: var(--text);
  font-size: 13px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  white-space: nowrap;
  text-align: center;

  &:first-child, &:nth-child(2) {
    text-align: left;
    position: sticky;
    z-index: 5;
    background: var(--bg1);
  }
  &:first-child { left: 0; }
  &:nth-child(2) { left: 200px; }
`;

const ShiftBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  min-width: 30px;
  
  background: ${props => props.isOff ? 'rgba(255,255,255,0.05)' : 'rgba(99,102,241,0.15)'};
  color: ${props => props.isOff ? 'var(--muted)' : 'var(--accent)'};
  border: 1px solid ${props => props.isOff ? 'transparent' : 'rgba(99,102,241,0.3)'};
`;

const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

const RosterReport = () => {
    const [employees, setEmployees] = useState([]);
    const [rosterData, setRosterData] = useState([]);
    
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate, setEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));

    const [departments, setDepartments] = useState([]);
    const [selectedDepts, setSelectedDepts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('matrix'); // 'matrix' | 'list'

    useEffect(() => {
        const role = localStorage.getItem('role');
        const dept = localStorage.getItem('department_id');
        if (role && role !== 'Admin' && dept) {
            setSelectedDepts([dept]);
        }
    }, []);

    const ymd = (d) => {
        if (!d) return null;
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const dmy = (d) => {
        if (!d) return '';
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const fetchReportData = async () => {
        const role = localStorage.getItem('role');
        const dept = localStorage.getItem('department_id');

        const from_date = ymd(startDate);
        const to_date = endDate ? ymd(new Date(endDate.getTime() + 86400000)) : ymd(startDate);

        try {
            let empUrl = `${HRbaseurl}employees_from_global/`;
            let rosterUrl = `${HRbaseurl}roster/?from_date=${from_date}&to_date=${to_date}`;

            if (role && role !== 'Admin' && dept) {
                empUrl += `?department=${encodeURIComponent(dept)}`;
                rosterUrl += `&department=${encodeURIComponent(dept)}`;
            } else if (selectedDepts.length > 0) {
                const dStr = selectedDepts.join(',');
                empUrl += `?department=${encodeURIComponent(dStr)}`;
                rosterUrl += `&department=${encodeURIComponent(dStr)}`;
            }

            const [empRes, rosterRes] = await Promise.all([
                axios.get(empUrl),
                axios.get(rosterUrl)
            ]);

            const formattedEmps = empRes.data.map(e => ({
                id: e.employeeId,
                name: e.employeeName || e.name || e.employeeId,
                department: e.department || 'Unassigned',
                department_id: e.departmentId || e.department_id
            }));

            setEmployees(formattedEmps);
            setRosterData(rosterRes.data);
        } catch (error) {
            console.error("Error fetching report data", error);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [startDate, endDate, selectedDepts]);

    useEffect(() => {
        const fetchDepts = async () => {
            try {
                const res = await axios.get(`${HRbaseurl}departments/`);
                setDepartments(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Failed to fetch departments", err);
            }
        };
        fetchDepts();
    }, []);

    const toggleDepartment = (deptId) => {
        if (deptId === 'All') {
            setSelectedDepts([]);
        } else {
            setSelectedDepts([deptId]);
        }
    };

    const changeMonth = (delta) => {
        const newDate = new Date(startDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setStartDate(new Date(newDate.getFullYear(), newDate.getMonth(), 1));
        setEndDate(new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0));
    };

    const uniqueDepartments = useMemo(() => {
        return ['All', ...new Set(employees.map(e => e.department).filter(Boolean))];
    }, [employees]);

    // Filter logic
    const filteredEmployees = useMemo(() => {
        return employees.filter(e => {
            const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesSearch;
        });
    }, [employees, searchTerm]);

    const filteredRosterData = useMemo(() => {
        // For List View: Filter rosterData based on filteredEmployees and Departments
        // Also apply search items if needed (already covered by filtering employees usually, but rosterData needs linking)
        const allowedEmpIds = new Set(filteredEmployees.map(e => e.id));
        return rosterData.filter(r => allowedEmpIds.has(r.employee))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [rosterData, filteredEmployees]);

    const daysArray = useMemo(() => {
        const days = [];
        let curr = new Date(startDate);
        while (curr <= endDate) {
            days.push(new Date(curr));
            curr.setDate(curr.getDate() + 1);
        }
        return days;
    }, [startDate, endDate]);

    const getShiftCode = (empId, dateObj) => {
        const dateStr = dateObj.toISOString().split('T')[0];
        const schedule = rosterData.find(s => s.employee == empId && s.date === dateStr);
        return schedule ? schedule.shift_name : null;
    };

    // Construct Export URL (Matrix)
    const getMatrixExportUrl = () => {
        const from_date = startDate.toISOString().split('T')[0];
        const to_date = endDate.toISOString().split('T')[0];
        let url = `${HRbaseurl}roster/export/?from_date=${from_date}&to_date=${to_date}`;
        if (selectedDepts.length > 0) {
            url += `&department=${encodeURIComponent(selectedDepts.join(','))}`;
        }
        return url;
    };

    // CSV Download for List Mode
    const downloadListCSV = () => {
        const headers = ["Date", "Employee ID", "Employee Name", "Department", "Shift", "Start Time", "End Time"];
        const rows = filteredRosterData.map(r => {
            // Find dept from employee list
            const emp = employees.find(e => e.id === r.employee);
            const rDate = new Date(r.date);
            return [
                dmy(rDate),
                r.employee,
                r.employee_name,
                emp ? emp.department : 'Unassigned',
                r.shift_name,
                r.start_time,
                r.end_time
            ];
        });

        const csvContent = [
            headers.join(","),
            ...rows.map(row => row.map(item => `"${item}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `Roster_List_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Stats
    const totalEmployees = filteredEmployees.length;
    const totalAssignments = useMemo(() => {
        return rosterData.filter(r => filteredEmployees.some(e => e.id == r.employee)).length;
    }, [rosterData, filteredEmployees]);

    return (
        <Page>

            <Container>
                <Header>
                    <HeaderTop>
                        <div>
                            <Title>
                                <FileText size={28} />
                                Duty Roster Report
                            </Title>
                            <Subtitle>Overview of assigned shifts and schedules</Subtitle>
                        </div>

                        <Controls>
                            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', border: '1px solid var(--border)' }}>
                                <IconButton
                                    onClick={() => setViewMode('matrix')}
                                    style={{ color: viewMode === 'matrix' ? '#818cf8' : 'var(--muted)', background: viewMode === 'matrix' ? 'rgba(255,255,255,0.05)' : 'transparent', borderRadius: '8px' }}
                                >
                                    <Layers size={18} />
                                </IconButton>
                                <IconButton
                                    onClick={() => setViewMode('list')}
                                    style={{ color: viewMode === 'list' ? '#818cf8' : 'var(--muted)', background: viewMode === 'list' ? 'rgba(255,255,255,0.05)' : 'transparent', borderRadius: '8px' }}
                                >
                                    <FileText size={18} />
                                </IconButton>
                            </div>

                            <div style={{ position: 'relative' }}>
                                <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                                <SearchInput
                                    placeholder="Search employee..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: '12px', border: '1px solid var(--border)', height: '44px' }}>
                                <Calendar size={16} color="#818cf8" />
                                <DatePicker
                                    selectsRange={true}
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(update) => {
                                        const [start, end] = update;
                                        setStartDate(start);
                                        setEndDate(end);
                                    }}
                                    dateFormat="dd MMM yyyy"
                                    className="custom-date-input"
                                    placeholderText="Select date range"
                                />
                            </div>

                            {viewMode === 'matrix' ? (
                                <Button href={getMatrixExportUrl()} target="_blank" download>
                                    <Download size={18} />
                                    Export Matrix
                                </Button>
                            ) : (
                                <Button as="button" onClick={downloadListCSV}>
                                    <Download size={18} />
                                    Export List
                                </Button>
                            )}
                        </Controls>
                    </HeaderTop>

                    {(localStorage.getItem('role') === 'Admin' || !localStorage.getItem('department_id')) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                            <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: '500' }}>Filter by Department:</span>
                            <StyledSelect 
                                value={selectedDepts.length === 0 ? 'All' : selectedDepts[0]} 
                                onChange={(e) => toggleDepartment(e.target.value)}
                            >
                                <option value="All">All Departments</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={String(dept.id)}>
                                        {dept.name}
                                    </option>
                                ))}
                            </StyledSelect>
                        </div>
                    )}
                </Header>

                <StatsGrid>
                    <StatCard>
                        <StatLabel><User size={14} /> Total Staff</StatLabel>
                        <StatValue>{totalEmployees}</StatValue>
                    </StatCard>
                    <StatCard>
                        <StatLabel><Layers size={14} /> Shift Assignments</StatLabel>
                        <StatValue>{totalAssignments}</StatValue>
                    </StatCard>
                    <StatCard>
                        <StatLabel><Clock size={14} /> Month Days</StatLabel>
                        <StatValue>{daysArray.length}</StatValue>
                    </StatCard>
                    <StatCard>
                        <StatLabel><Shield size={14} /> Departments</StatLabel>
                        <StatValue>{uniqueDepartments.length - 1}</StatValue>
                    </StatCard>
                </StatsGrid>

                <Card>
                    <TableWrapper>
                        <TableInner>
                            {viewMode === 'matrix' ? (
                                <Table>
                                    <thead>
                                        <tr>
                                            <TH>Employee</TH>
                                            <TH>Department</TH>
                                            {daysArray.map((dateObj, idx) => {
                                                const isSunday = dateObj.getDay() === 0;
                                                return (
                                                    <TH key={idx} style={{ minWidth: '40px', textAlign: 'center', color: isSunday ? '#ef4444' : 'var(--muted)' }}>
                                                    <div style={{ fontSize: '13px', fontWeight: 800 }}>{dmy(dateObj)}</div>
                                                    <div style={{ fontSize: '10px', opacity: 0.7 }}>{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                                    </TH>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEmployees.length > 0 ? (
                                            filteredEmployees.map(emp => (
                                                <tr key={emp.id}>
                                                    <TD>
                                                        <div style={{ fontWeight: 600 }}>{emp.name}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{emp.id}</div>
                                                    </TD>
                                                    <TD>{emp.department}</TD>
                                                    {daysArray.map((dateObj, idx) => {
                                                        const shiftName = getShiftCode(emp.id, dateObj);
                                                        return (
                                                            <TD key={idx}>
                                                                {shiftName ? (
                                                                    <ShiftBadge isOff={false}>{shiftName}</ShiftBadge>
                                                                ) : (
                                                                    <ShiftBadge isOff={true}>-</ShiftBadge>
                                                                )}
                                                            </TD>
                                                        );
                                                    })}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <TD colSpan={daysArray.length + 2} style={{ textAlign: 'center', padding: '40px' }}>
                                                    No employees found.
                                                </TD>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            ) : (
                                <Table style={{ minWidth: '100%' }}>
                                    <thead>
                                        <tr>
                                            <TH style={{ textAlign: 'left', position: 'static' }}>Date</TH>
                                            <TH style={{ textAlign: 'left', position: 'static' }}>Employee</TH>
                                            <TH style={{ textAlign: 'left', position: 'static' }}>Department</TH>
                                            <TH style={{ textAlign: 'center' }}>Shift</TH>
                                            <TH style={{ textAlign: 'center' }}>Start Time</TH>
                                            <TH style={{ textAlign: 'center' }}>End Time</TH>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRosterData.length > 0 ? (
                                            filteredRosterData.map((row, idx) => {
                                                const emp = employees.find(e => e.id === row.employee);
                                                const dept = emp ? emp.department : 'Unassigned';
                                                return (
                                                    <tr key={row.id || idx}>
                                                        <TD style={{ textAlign: 'left', position: 'static', background: 'transparent' }}>{dmy(new Date(row.date))}</TD>
                                                        <TD style={{ textAlign: 'left', position: 'static', background: 'transparent' }}>
                                                            <div style={{ fontWeight: 600 }}>{row.employee_name}</div>
                                                            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{row.employee}</div>
                                                        </TD>
                                                        <TD style={{ textAlign: 'left', background: 'transparent' }}>{dept}</TD>
                                                        <TD>
                                                            <ShiftBadge isOff={false}>{row.shift_name}</ShiftBadge>
                                                        </TD>
                                                        <TD>{row.start_time}</TD>
                                                        <TD>{row.end_time}</TD>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <TD colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                                                    No shifts assigned for current selection.
                                                </TD>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            )}
                        </TableInner>
                    </TableWrapper>
                </Card>
            </Container>
        </Page>
    );
};

export default RosterReport;
