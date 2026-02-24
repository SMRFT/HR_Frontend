import React, { useState, useEffect, useMemo } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import axios from 'axios';
import {
    Calendar, Download, ChevronLeft, ChevronRight,
    Search, FileText, User, Layers, Clock, Shield
} from 'lucide-react';

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
`;

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

const TableWrapper = styled.div`
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 4px;
  }
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
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDept, setSelectedDept] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('matrix'); // 'matrix' | 'list'

    useEffect(() => {
        const role = localStorage.getItem('role');
        const dept = localStorage.getItem('department');
        if (role && role !== 'Admin' && dept) {
            setSelectedDept(dept);
        }
    }, []);

    const fetchReportData = async () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;

        const role = localStorage.getItem('role');
        const dept = localStorage.getItem('department');
        const isRestricted = role && role !== 'Admin' && dept;

        try {
            let empUrl = `${HRbaseurl}employees_from_global/`;
            let rosterUrl = `${HRbaseurl}roster/?month=${monthStr}`;

            if (isRestricted) {
                empUrl += `?department=${encodeURIComponent(dept)}`;
                rosterUrl += `&department=${encodeURIComponent(dept)}`;
            }

            const [empRes, rosterRes] = await Promise.all([
                axios.get(empUrl),
                axios.get(rosterUrl)
            ]);

            const formattedEmps = empRes.data.map(e => ({
                id: e.employeeId,
                name: e.employeeName || e.name || e.employeeId,
                department: e.department || 'Unassigned'
            }));

            setEmployees(formattedEmps);
            setRosterData(rosterRes.data);
        } catch (error) {
            console.error("Error fetching report data", error);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [currentDate]);

    const changeMonth = (delta) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    const uniqueDepartments = useMemo(() => {
        return ['All', ...new Set(employees.map(e => e.department).filter(Boolean))];
    }, [employees]);

    // Filter logic
    const filteredEmployees = useMemo(() => {
        return employees.filter(e => {
            const matchesDept = selectedDept === 'All' || e.department === selectedDept;
            const matchesSearch = e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                e.id.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesDept && matchesSearch;
        });
    }, [employees, selectedDept, searchTerm]);

    const filteredRosterData = useMemo(() => {
        // For List View: Filter rosterData based on filteredEmployees and Departments
        // Also apply search items if needed (already covered by filtering employees usually, but rosterData needs linking)
        const allowedEmpIds = new Set(filteredEmployees.map(e => e.id));
        return rosterData.filter(r => allowedEmpIds.has(r.employee))
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }, [rosterData, filteredEmployees]);

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth(currentDate) }, (_, i) => i + 1);

    const getShiftCode = (empId, day) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${dayStr}`;
        const schedule = rosterData.find(s => s.employee == empId && s.date === dateStr);
        return schedule ? schedule.shift_name : null;
    };

    // Construct Export URL (Matrix)
    const getMatrixExportUrl = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        let url = `${HRbaseurl}roster/export/?month=${monthStr}`;
        if (selectedDept !== 'All') {
            url += `&department=${encodeURIComponent(selectedDept)}`;
        }
        return url;
    };

    // CSV Download for List Mode
    const downloadListCSV = () => {
        const headers = ["Date", "Employee ID", "Employee Name", "Department", "Shift", "Start Time", "End Time"];
        const rows = filteredRosterData.map(r => {
            // Find dept from employee list
            const emp = employees.find(e => e.id === r.employee);
            return [
                r.date,
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
        link.setAttribute("download", `Roster_List_${currentDate.toISOString().slice(0, 7)}.csv`);
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
            <GlobalStyle />
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

                            <MonthSelector>
                                <IconButton onClick={() => changeMonth(-1)}><ChevronLeft size={20} /></IconButton>
                                <Calendar size={16} color="#818cf8" />
                                <span>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                                <IconButton onClick={() => changeMonth(1)}><ChevronRight size={20} /></IconButton>
                            </MonthSelector>

                            <FilterSelect
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                            >
                                {uniqueDepartments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </FilterSelect>

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
                        {viewMode === 'matrix' ? (
                            <Table>
                                <thead>
                                    <tr>
                                        <TH>Employee</TH>
                                        <TH>Department</TH>
                                        {daysArray.map(d => (
                                            <TH key={d} style={{ minWidth: '40px', textAlign: 'center' }}>{d}</TH>
                                        ))}
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
                                                {daysArray.map(d => {
                                                    const shiftName = getShiftCode(emp.id, d);
                                                    return (
                                                        <TD key={d}>
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
                                                    <TD style={{ textAlign: 'left', position: 'static', background: 'transparent' }}>{row.date}</TD>
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
                    </TableWrapper>
                </Card>
            </Container>
        </Page>
    );
};

export default RosterReport;
