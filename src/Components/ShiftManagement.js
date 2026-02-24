import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { UserPlus, Clock, Layers, Power, CheckCircle, XCircle, Calendar, ChevronLeft, ChevronRight, User, Download, Edit } from "lucide-react";
import axios from "axios";

// Styled Components
const Container = styled.div`
  padding: 40px;
  max-width: 1600px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 40px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 20px 24px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const Td = styled.td`
  padding: 20px 24px;
  color: #e2e8f0;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
`;

const Tr = styled.tr`
  transition: all 0.2s ease;
  background: ${props => props.$disabled ? 'rgba(239, 68, 68, 0.05)' : 'transparent'};
  opacity: ${props => props.$disabled ? 0.7 : 1};

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: ${props => props.color || 'rgba(99, 102, 241, 0.1)'};
  color: ${props => props.textColor || '#818cf8'};
  border: 1px solid ${props => props.borderColor || 'rgba(99, 102, 241, 0.2)'};
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(30, 41, 59, 0.4);
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

const FormRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-end;
  
  @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const FormLabel = styled.label`
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
  margin-left: 4px;
`;

const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 16px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
`;

const ShiftChip = styled.div`
  padding: 8px 16px;
  border-radius: 100px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  
  background: ${props => props.selected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.03)'};
  color: ${props => props.selected ? '#818cf8' : '#64748b'};
  border: 1px solid ${props => props.selected ? 'rgba(99, 102, 241, 0.4)' : 'transparent'};

  &:hover {
    background: ${props => props.selected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255,255,255,0.08)'};
    color: ${props => props.selected ? '#a5b4fc' : '#94a3b8'};
    transform: translateY(-1px);
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  background: rgba(15, 23, 42, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;
  align-items: center;
`;

const Input = styled.input`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  flex: 1;
  min-width: 200px;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }
  
  &[type="time"] {
    min-width: 150px;
    &::-webkit-calendar-picker-indicator {
        filter: invert(1);
        cursor: pointer;
    }
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  color: ${props => props.active ? '#34d399' : '#f87171'};
  border: 1px solid ${props => props.active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.active ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
  }
`;

const MultiSelectContainer = styled.div`
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 8px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
`;

const ShiftOption = styled.div`
  padding: 4px 12px;
  border-radius: 16px;
  background: ${props => props.selected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${props => props.selected ? '#818cf8' : '#94a3b8'};
  border: 1px solid ${props => props.selected ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;

  &:hover {
    background: rgba(99, 102, 241, 0.1);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
  font-size: 14px;
  cursor: pointer;
  
  input {
    width: 16px;
    height: 16px;
    accent-color: #6366f1;
  }
`;

// Roster specific styles
const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  color: #e2e8f0;
  font-weight: 700;
  font-size: 18px;
`;

const IconButton = styled.button`
  background: rgba(255,255,255,0.05);
  border: none;
  color: #e2e8f0;
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  &:hover { background: rgba(255,255,255,0.1); }
`;

const RosterGrid = styled.div`
  overflow-x: auto;
  padding-bottom: 20px;
  position: relative;
`;

const RosterTable = styled(Table)`
  min-width: 1500px;
`;

const ShiftCell = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${props => props.color?.bg || 'rgba(255,255,255,0.05)'};
  color: ${props => props.color?.text || '#94a3b8'};
  border: 1px solid ${props => props.color?.border || 'rgba(255,255,255,0.1)'};
  transition: all 0.1s;
  
  &:hover {
    transform: scale(1.1);
    z-index: 10;
  }
`;

// Modern Glassmorphism Tabs
const ModernTabContainer = styled.div`
  display: inline-flex;
  flex-wrap: wrap; 
  background: rgba(15, 23, 42, 0.6);
  padding: 6px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 32px;
  position: relative;
  backdrop-filter: blur(10px);
  gap: 8px;
  max-width: 100%;

  @media (max-width: 640px) {
    display: flex;
    width: 100%;
    justify-content: center;
  }
`;

const ModernTab = styled.button`
  background: ${props => props.active ? 'rgba(99, 102, 241, 0.2)' : 'transparent'};
  color: ${props => props.active ? '#818cf8' : '#94a3b8'};
  border: 1px solid ${props => props.active ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  flex: 1;

  &:hover {
    color: #e2e8f0;
    background: ${props => props.active ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.03)'};
  }
`;

// Responsive Shift Selector Styles
const SelectorOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
`;

const SelectorContainer = styled.div`
  position: fixed;
  top: ${props => props.$top}px;
  left: ${props => props.$left}px;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.4);
  min-width: 280px;
  width: max-content;
  max-width: 340px;
  max-height: ${props => props.$maxHeight}px;
  overflow-y: auto;
  animation: fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  display: flex;
  flex-direction: column;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const DropdownHeader = styled.div`
  padding: 12px 16px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  background: rgba(0,0,0,0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-weight: 700;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
`;

const OptionItem = styled.div`
  padding: 12px 16px; 
  text-align: left;
  background: ${props => props.isClear ? 'rgba(239, 68, 68, 0.05)' : 'transparent'};
  color: ${props => props.isClear ? '#f87171' : '#e2e8f0'};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${props => props.isClear ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)'};
    color: ${props => props.isClear ? '#f87171' : '#fff'};
    padding-left: 20px;
  }
`;

const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

const ShiftSelector = ({ shifts, onSelect, onClose, position }) => {
    const dropdownRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, maxHeight: 400 });

    useEffect(() => {
        if (!position || !dropdownRef.current) return;

        const calculatePosition = () => {
            const { bottom: rectBottom, left: rectLeft, top: rectTop, right: rectRight } = position;
            const dropdownWidth = 300; // Approximate width
            const dropdownHeight = Math.min(400, shifts.length * 50 + 100); // Approximate height

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let top = rectBottom + 8; // Default: below the cell
            let left = rectLeft;
            let maxHeight = 400;

            // Check space below
            const spaceBelow = viewportHeight - rectBottom - 16;
            const spaceAbove = rectTop - 16;
            const spaceRight = viewportWidth - rectLeft - 16;
            const spaceLeft = rectLeft - 16;

            // Vertical positioning
            if (spaceBelow >= 200) {
                // Show below
                top = rectBottom + 8;
                maxHeight = Math.min(spaceBelow - 16, 400);
            } else if (spaceAbove > spaceBelow && spaceAbove >= 200) {
                // Show above
                top = rectTop - Math.min(dropdownHeight, spaceAbove - 16);
                maxHeight = Math.min(spaceAbove - 16, 400);
            } else {
                // Not enough space, show below and scroll
                top = rectBottom + 8;
                maxHeight = Math.max(spaceBelow - 16, 150);
            }

            // Horizontal positioning
            if (spaceRight >= dropdownWidth) {
                // Align to left edge of cell
                left = rectLeft;
            } else if (spaceLeft >= dropdownWidth) {
                // Align to right edge of cell
                left = rectRight - dropdownWidth;
            } else {
                // Center in viewport
                left = (viewportWidth - dropdownWidth) / 2;
            }

            // Ensure it doesn't go off-screen
            left = Math.max(10, Math.min(left, viewportWidth - dropdownWidth - 10));
            top = Math.max(10, Math.min(top, viewportHeight - 100));

            setDropdownPosition({ top, left, maxHeight });
        };

        calculatePosition();
        window.addEventListener('resize', calculatePosition);
        window.addEventListener('scroll', calculatePosition, true);

        return () => {
            window.removeEventListener('resize', calculatePosition);
            window.removeEventListener('scroll', calculatePosition, true);
        };
    }, [position, shifts.length]);

    return (
        <>
            <SelectorOverlay onClick={onClose} />
            <SelectorContainer
                ref={dropdownRef}
                $top={dropdownPosition.top}
                $left={dropdownPosition.left}
                $maxHeight={dropdownPosition.maxHeight}
            >
                <DropdownHeader>Quick Actions</DropdownHeader>
                <OptionItem
                    onClick={() => onSelect(null)}
                    isClear={true}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <XCircle size={16} />
                        <span>Clear Shift (OFF)</span>
                    </div>
                </OptionItem>
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '4px 0' }}></div>
                <DropdownHeader>Available Shifts</DropdownHeader>
                {shifts.filter(s => s.is_active).map(s => (
                    <OptionItem
                        key={s.id}
                        onClick={() => onSelect(s.id)}
                    >
                        <span>{s.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '4px 8px', borderRadius: '6px' }}>
                            <Clock size={10} />
                            {s.start_time?.slice(0, 5)} - {s.end_time?.slice(0, 5)}
                        </div>
                    </OptionItem>
                ))}
            </SelectorContainer>
        </>
    );
};

const ShiftManagement = () => {
    const [activeTab, setActiveTab] = useState('shifts');
    const [shifts, setShifts] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Roster States
    const [employees, setEmployees] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rosterData, setRosterData] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedDept, setSelectedDept] = useState('All');

    // Form states
    const [newShift, setNewShift] = useState({ name: '', start_time: '', end_time: '', is_active: true });
    const [newDept, setNewDept] = useState({ name: '', shift_ids: [] });

    const [editingDept, setEditingDept] = useState(null);

    const fetchAll = async () => {
        try {
            const role = localStorage.getItem('role');
            const dept = localStorage.getItem('department');
            let url = `${HRbaseurl}shifts/`;

            if (role && role !== 'Admin' && dept) {
                url += `?department=${encodeURIComponent(dept)}`;
            }

            const shiftRes = await axios.get(url);
            setShifts(shiftRes.data);

            let deptUrl = `${HRbaseurl}departments/`;
            if (role && role !== 'Admin' && dept) {
                deptUrl += `?department=${encodeURIComponent(dept)}`;
            }
            const deptRes = await axios.get(deptUrl);
            setDepartments(deptRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        }
    };

    useEffect(() => {
        const role = localStorage.getItem('role');
        const dept = localStorage.getItem('department');
        if (role && role !== 'Admin' && dept) {
            setSelectedDept(dept);
        }
    }, []);

    const fetchRosterData = async () => {
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
                department: e.department || 'Unassigned',
                image: e.profileImage
            }));

            setEmployees(formattedEmps);
            setRosterData(rosterRes.data);
        } catch (error) {
            console.error("Error fetching roster data", error);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        if (activeTab === 'roster') {
            fetchRosterData();
        }
    }, [activeTab, currentDate]);

    const getExportUrl = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const monthStr = `${year}-${String(month).padStart(2, '0')}`;
        let url = `${HRbaseurl}roster/export/?month=${monthStr}`;
        if (selectedDept !== 'All') {
            url += `&department=${encodeURIComponent(selectedDept)}`;
        }
        return url;
    };

    const handleCreateShift = async () => {
        if (!newShift.name || !newShift.start_time || !newShift.end_time) {
            alert("Please fill all shift details");
            return;
        }
        try {
            await axios.post(`${HRbaseurl}shifts/`, newShift);
            setNewShift({ name: '', start_time: '', end_time: '', is_active: true });
            fetchAll();
        } catch (error) {
            alert("Error creating shift. Name must be unique.");
        }
    };

    const handleToggleShift = async (shift) => {
        try {
            const updatedShift = { ...shift, is_active: !shift.is_active };
            await axios.put(`${HRbaseurl}shifts/${shift.id}/`, updatedShift);
            fetchAll();
        } catch (error) {
            console.error("Error updating shift status", error);
            alert("Failed to update status");
        }
    };

    const handleCreateDept = async () => {
        if (!newDept.name) {
            alert("Please enter department name");
            return;
        }
        try {
            await axios.post(`${HRbaseurl}departments/`, newDept);
            setNewDept({ name: '', shift_ids: [] });
            fetchAll();
        } catch (error) {
            alert("Error creating department.");
        }
    };

    const handleUpdateDept = async () => {
        if (!newDept.name) {
            alert("Please enter department name");
            return;
        }
        try {
            await axios.put(`${HRbaseurl}departments/${editingDept.id}/`, newDept);
            setNewDept({ name: '', shift_ids: [] });
            setEditingDept(null);
            fetchAll();
        } catch (error) {
            alert("Error updating department.");
        }
    };

    const handleEditDept = (dept) => {
        setEditingDept(dept);
        setNewDept({
            name: dept.name,
            shift_ids: dept.shifts.map(s => s.id)
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewDept({ name: '', shift_ids: [] });
        setEditingDept(null);
    };

    const toggleShiftSelection = (id) => {
        setNewDept(prev => {
            const exists = prev.shift_ids.includes(id);
            if (exists) {
                return { ...prev, shift_ids: prev.shift_ids.filter(sid => sid !== id) };
            } else {
                return { ...prev, shift_ids: [...prev.shift_ids, id] };
            }
        });
    };

    const assignShift = async (empId, dateStr, shiftId) => {
        try {
            await axios.post(`${HRbaseurl}roster/assign/`, {
                employee_id: empId,
                date: dateStr,
                shift_id: shiftId
            });
            fetchRosterData();
            setSelectedCell(null);
        } catch (error) {
            console.error("Assign error", error);
            alert("Failed to assign shift");
        }
    };

    const getShiftColor = (idx, name = '') => {
        if (name && (name.toLowerCase() === 'off' || name.toLowerCase().includes('week off'))) {
            return { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };
        }

        const colors = [
            { bg: 'rgba(16, 185, 129, 0.15)', text: '#34d399', border: 'rgba(16, 185, 129, 0.25)' },
            { bg: 'rgba(59, 130, 246, 0.15)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.25)' },
            { bg: 'rgba(239, 68, 68, 0.15)', text: '#f87171', border: 'rgba(239, 68, 68, 0.25)' },
            { bg: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', border: 'rgba(245, 158, 11, 0.25)' },
            { bg: 'rgba(168, 85, 247, 0.15)', text: '#c084fc', border: 'rgba(168, 85, 247, 0.25)' },
            { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.25)' },
            { bg: 'rgba(14, 165, 233, 0.15)', text: '#38bdf8', border: 'rgba(14, 165, 233, 0.25)' },
        ];
        return colors[idx % colors.length];
    };

    const shiftColorMap = {};
    shifts.forEach((s, i) => {
        shiftColorMap[s.id] = getShiftColor(i, s.name);
        shiftColorMap[s.name] = getShiftColor(i, s.name);
    });
    shiftColorMap['Off'] = { bg: 'rgba(148, 163, 184, 0.2)', text: '#94a3b8', border: 'rgba(148, 163, 184, 0.3)' };

    const calculateDuration = (start, end) => {
        if (!start || !end) return "--";
        const parse = (t) => {
            const [h, m] = t.split(':').map(Number);
            return h * 60 + m;
        };
        let startMins = parse(start);
        let endMins = parse(end);
        if (endMins < startMins) endMins += 24 * 60;
        const diff = endMins - startMins;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        return h > 0 && m > 0 ? `${h}h ${m}m` : (h > 0 ? `${h}h` : `${m}m`);
    };

    const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getDaysArray = () => {
        const days = [];
        const numDays = daysInMonth(currentDate);
        for (let i = 1; i <= numDays; i++) days.push(i);
        return days;
    };

    const changeMonth = (delta) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + delta);
        setCurrentDate(newDate);
    };

    const getShiftForCell = (empId, day) => {
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        const dateStr = `${year}-${month}-${dayStr}`;

        const schedule = rosterData.find(s => s.employee == empId && s.date === dateStr);
        return schedule;
    };

    const role = localStorage.getItem('role');
    const userDept = localStorage.getItem('department');
    const isRestricted = role && role !== 'Admin' && userDept;

    const uniqueDepartments = isRestricted
        ? [userDept]
        : ['All', ...new Set(employees.map(e => e.department).filter(Boolean))];
    const filteredEmployees = selectedDept === 'All'
        ? employees
        : employees.filter(e => e.department === selectedDept);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            if (selectedCell) {
                setSelectedCell(null);
            }
        };

        if (selectedCell) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [selectedCell]);

    return (
        <Container>
            <Header>
                <Title>
                    <Clock size={32} color="#818cf8" />
                    Shift Management
                </Title>
            </Header>

            <ModernTabContainer>
                <ModernTab active={activeTab === 'shifts'} onClick={() => setActiveTab('shifts')}>
                    <Layers size={18} /> Shift Configuration
                </ModernTab>
                <ModernTab active={activeTab === 'departments'} onClick={() => setActiveTab('departments')}>
                    <Layers size={18} /> Departments
                </ModernTab>
                <ModernTab active={activeTab === 'roster'} onClick={() => setActiveTab('roster')}>
                    <Calendar size={18} /> Duty Roster
                </ModernTab>
            </ModernTabContainer>

            {activeTab === 'shifts' && (
                <Card>
                    {role === 'Admin' && (
                        <InputGroup>
                            <Input
                                placeholder="Shift Name (e.g. A, B)"
                                value={newShift.name}
                                onChange={e => setNewShift({ ...newShift, name: e.target.value })}
                            />
                            <Input
                                type="time"
                                value={newShift.start_time}
                                onChange={e => setNewShift({ ...newShift, start_time: e.target.value })}
                            />
                            <span style={{ color: '#94a3b8' }}>to</span>
                            <Input
                                type="time"
                                value={newShift.end_time}
                                onChange={e => setNewShift({ ...newShift, end_time: e.target.value })}
                            />
                            <CheckboxLabel>
                                <input
                                    type="checkbox"
                                    checked={newShift.is_active}
                                    onChange={e => setNewShift({ ...newShift, is_active: e.target.checked })}
                                />
                                Active
                            </CheckboxLabel>
                            <Button onClick={handleCreateShift}>
                                <UserPlus size={18} /> Add Shift
                            </Button>
                        </InputGroup>
                    )}
                    <Table>
                        <thead>
                            <Tr>
                                <Th>S.No</Th>
                                <Th>Timings</Th>
                                <Th>Shift Name</Th>
                                <Th>Duration</Th>
                                <Th>Status</Th>
                            </Tr>
                        </thead>
                        <tbody>
                            {shifts.map((shift, idx) => {
                                const style = getShiftColor(idx);
                                const duration = calculateDuration(shift.start_time, shift.end_time);
                                return (
                                    <Tr key={shift.id} $disabled={!shift.is_active}>
                                        <Td>{idx + 1}</Td>
                                        <Td>
                                            <Badge color={style.bg} textColor={style.text} borderColor={style.border}>
                                                {shift.start_time} - {shift.end_time}
                                            </Badge>
                                        </Td>
                                        <Td style={{ fontWeight: 'bold' }}>{shift.name}</Td>
                                        <Td style={{ fontFamily: 'monospace', color: '#94a3b8' }}>{duration}</Td>
                                        <Td>
                                            <ToggleButton
                                                active={shift.is_active}
                                                onClick={() => role === 'Admin' && handleToggleShift(shift)}
                                                style={{ opacity: role === 'Admin' ? 1 : 0.5, cursor: role === 'Admin' ? 'pointer' : 'not-allowed' }}
                                            >
                                                {shift.is_active ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                                {shift.is_active ? 'Enabled' : 'Disabled'}
                                            </ToggleButton>
                                        </Td>
                                    </Tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </Card>
            )}

            {activeTab === 'departments' && (
                <Card>
                    {role === 'Admin' && (
                        <FormContainer>
                            <FormRow>
                                <FormField>
                                    <FormLabel>Department Name</FormLabel>
                                    <Input
                                        placeholder="e.g. Cardiology, Nursing, etc."
                                        value={newDept.name}
                                        onChange={e => setNewDept({ ...newDept, name: e.target.value })}
                                        disabled={!!editingDept} // Name might not be editable or needed, but let's allow renaming
                                    />
                                </FormField>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    {editingDept ? (
                                        <>
                                            <Button onClick={handleUpdateDept} style={{ height: '45px', marginBottom: '1px' }}>
                                                <Layers size={18} /> Update Department
                                            </Button>
                                            <Button onClick={handleCancelEdit} style={{ height: '45px', marginBottom: '1px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button onClick={handleCreateDept} style={{ height: '45px', marginBottom: '1px' }}>
                                            <Layers size={18} /> Create Department
                                        </Button>
                                    )}
                                </div>
                            </FormRow>

                            <FormField>
                                <FormLabel>Allowed Shifts (Select all that apply)</FormLabel>
                                <ChipGrid>
                                    {shifts.filter(s => s.is_active).map(shift => (
                                        <ShiftChip
                                            key={shift.id}
                                            selected={newDept.shift_ids.includes(shift.id)}
                                            onClick={() => toggleShiftSelection(shift.id)}
                                        >
                                            {newDept.shift_ids.includes(shift.id) && <CheckCircle size={14} />}
                                            <span>{shift.name}</span>
                                            <span style={{ fontSize: '11px', opacity: 0.6, borderLeft: '1px solid currentColor', paddingLeft: '6px' }}>
                                                {shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}
                                            </span>
                                        </ShiftChip>
                                    ))}
                                </ChipGrid>
                            </FormField>
                        </FormContainer>
                    )}
                    <Table>
                        <thead>
                            <Tr>
                                <Th>S.No</Th>
                                <Th>Department</Th>
                                <Th>Allowed Shifts</Th>
                                <Th>Count</Th>
                                {role === 'Admin' && <Th>Actions</Th>}
                            </Tr>
                        </thead>
                        <tbody>
                            {departments.map((dept, idx) => (
                                <Tr key={dept.id}>
                                    <Td>{idx + 1}</Td>
                                    <Td>{dept.name}</Td>
                                    <Td>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {dept.shifts.map((shift, sIdx) => {
                                                const style = shiftColorMap[shift.id] || getShiftColor(sIdx);
                                                return (
                                                    <Badge
                                                        key={shift.id}
                                                        color={style.bg}
                                                        textColor={style.text}
                                                        borderColor={style.border}
                                                    >
                                                        {shift.name}
                                                    </Badge>
                                                );
                                            })}
                                        </div>
                                    </Td>
                                    <Td>{dept.shifts.length}</Td>
                                    {role === 'Admin' && (
                                        <Td>
                                            <ToggleButton
                                                active={true}
                                                onClick={() => handleEditDept(dept)}
                                                style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.2)' }}
                                            >
                                                <Edit size={14} /> Edit
                                            </ToggleButton>
                                        </Td>
                                    )}
                                </Tr>
                            ))}
                        </tbody>
                    </Table>
                </Card>
            )}

            {activeTab === 'roster' && (
                <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <MonthSelector style={{ marginBottom: 0 }}>
                            <IconButton onClick={() => changeMonth(-1)}><ChevronLeft /></IconButton>
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            <IconButton onClick={() => changeMonth(1)}><ChevronRight /></IconButton>
                        </MonthSelector>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <select
                                value={selectedDept}
                                onChange={(e) => setSelectedDept(e.target.value)}
                                style={{
                                    background: 'rgba(30, 41, 59, 0.7)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    color: '#e2e8f0',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                            >
                                {uniqueDepartments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>

                            <a
                                href={getExportUrl()}
                                target="_blank"
                                download
                                style={{
                                    textDecoration: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    background: 'rgba(99, 102, 241, 0.2)',
                                    color: '#818cf8',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <Download size={16} /> Export CSV
                            </a>
                        </div>
                    </div>

                    <Card>
                        <RosterGrid>
                            <RosterTable>
                                <thead>
                                    <Tr>
                                        <Th style={{ minWidth: '200px', position: 'sticky', left: 0, background: '#1e293b', zIndex: 20 }}>Employee</Th>
                                        {getDaysArray().map(day => (
                                            <Th key={day} style={{ textAlign: 'center', minWidth: '40px' }}>{day}</Th>
                                        ))}
                                    </Tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map(emp => (
                                        <Tr key={emp.id}>
                                            <Td style={{ position: 'sticky', left: 0, background: 'rgba(30, 41, 59, 0.95)', zIndex: 10, fontWeight: 500 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <User size={14} color="#94a3b8" />
                                                    <div>
                                                        <div>{emp.name}</div>
                                                        <div style={{ fontSize: '10px', color: '#64748b' }}>{emp.department}</div>
                                                    </div>
                                                </div>
                                            </Td>
                                            {getDaysArray().map(day => {
                                                const schedule = getShiftForCell(emp.id, day);
                                                const shiftName = schedule ? schedule.shift_name : '';
                                                const shiftId = schedule ? schedule.shift : null;
                                                const style = shiftId ? shiftColorMap[shiftId] : null;

                                                const isSelected = selectedCell && selectedCell.empId === emp.id && selectedCell.day === day;

                                                return (
                                                    <Td key={day} style={{ position: 'relative', padding: '4px', height: '40px' }}>
                                                        <ShiftCell
                                                            color={style}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                const rect = e.currentTarget.getBoundingClientRect();
                                                                setSelectedCell({ empId: emp.id, day, rect });
                                                            }}
                                                        >
                                                            {shiftName}
                                                        </ShiftCell>
                                                    </Td>
                                                );
                                            })}
                                        </Tr>
                                    ))}
                                </tbody>
                            </RosterTable>
                        </RosterGrid>
                    </Card>

                    {selectedCell && (
                        <ShiftSelector
                            shifts={(() => {
                                const emp = employees.find(e => e.id === selectedCell.empId);
                                const empDept = departments.find(d => d.name === emp?.department);
                                return empDept ? empDept.shifts : shifts;
                            })()}
                            position={selectedCell.rect}
                            onSelect={(shiftId) => {
                                const year = currentDate.getFullYear();
                                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                                const dateStr = `${year}-${month}-${String(selectedCell.day).padStart(2, '0')}`;
                                assignShift(selectedCell.empId, dateStr, shiftId);
                            }}
                            onClose={() => setSelectedCell(null)}
                        />
                    )}

                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '-20px', marginBottom: '40px' }}>
                        * Click on a cell to assign a shift.
                    </div>
                </>
            )}
        </Container>
    );
};

export default ShiftManagement;
