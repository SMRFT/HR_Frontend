import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import {
    UserPlus, Clock, Layers, Power, CheckCircle, XCircle,
    Calendar, ChevronLeft, ChevronRight, User, Download, Edit,
    Copy, ClipboardPaste, Check, Users, Trash2, Upload
} from "lucide-react";
import api from "../api";

// ─── Styled Components ────────────────────────────────────────────────────────

const Container = styled.div`
  padding: 24px 20px;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }

  @media (max-width: 480px) {
    padding: 12px 8px;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 28px;

  @media (max-width: 480px) {
    margin-bottom: 18px;
  }
`;

const Title = styled.h1`
  font-size: clamp(18px, 4vw, 28px);
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Card = styled.div`
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    border-radius: 14px;
    margin-bottom: 20px;
  }
`;

// ── Table ──────────────────────────────────────────────────────────────────────

const TableScrollWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  overflow-y: auto;
  max-height: ${p => p.$maxHeight || 'auto'};
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.3);
    border-radius: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.4);
    border-radius: 8px;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 520px;
`;

const Th = styled.th`
  text-align: left;
  padding: 16px 20px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  white-space: nowrap;
  position: sticky;
  top: 0;
  background: #1e293b;
  z-index: 10;

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 11px;
  }
`;

const Td = styled.td`
  padding: 16px 20px;
  color: #e2e8f0;
  font-size: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;

  @media (max-width: 768px) {
    padding: 12px 14px;
    font-size: 13px;
  }
`;

const Tr = styled.tr`
  transition: all 0.2s ease;
  background: ${(p) => (p.$disabled ? "rgba(239, 68, 68, 0.05)" : "transparent")};
  opacity: ${(p) => (p.$disabled ? 0.7 : 1)};

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const Badge = styled.span`
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: ${(p) => p.color || "rgba(99, 102, 241, 0.1)"};
  color: ${(p) => p.textColor || "#818cf8"};
  border: 1px solid ${(p) => p.borderColor || "rgba(99, 102, 241, 0.2)"};
  white-space: nowrap;
`;

// ── Form ───────────────────────────────────────────────────────────────────────

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: rgba(30, 41, 59, 0.4);
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 768px) {
    padding: 14px;
    gap: 14px;
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 14px;
  align-items: flex-end;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  flex: 1;
  min-width: 160px;

  @media (max-width: 640px) {
    min-width: 100%;
  }
`;

const FormLabel = styled.label`
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  margin-left: 3px;
`;

const ChipGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 9px;
  padding: 14px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  max-height: 200px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.2);
    border-radius: 4px;
  }
`;

const ShiftChip = styled.div`
  padding: 7px 14px;
  border-radius: 100px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 7px;
  background: ${(p) => (p.selected ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.03)")};
  color: ${(p) => (p.selected ? "#818cf8" : "#64748b")};
  border: 1px solid ${(p) => (p.selected ? "rgba(99, 102, 241, 0.4)" : "transparent")};

  &:hover {
    background: ${(p) => (p.selected ? "rgba(99, 102, 241, 0.25)" : "rgba(255,255,255,0.08)")};
    color: ${(p) => (p.selected ? "#a5b4fc" : "#94a3b8")};
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    font-size: 11px;
    padding: 6px 10px;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 10px;
  padding: 18px 20px;
  background: rgba(15, 23, 42, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 768px) {
    padding: 14px;
    gap: 10px;
  }
`;

const Input = styled.input`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  padding: 10px 14px;
  border-radius: 11px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
  flex: 1;
  min-width: 160px;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  &[type="time"] {
    min-width: 130px;
    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
    }
  }

  @media (max-width: 640px) {
    min-width: 100%;
    width: 100%;
  }
`;

const Button = styled.button`
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 11px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 7px;
  white-space: nowrap;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  @media (max-width: 640px) {
    width: 100%;
    justify-content: center;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 640px) {
    flex-direction: column;
    width: 100%;
  }
`;

const ToggleButton = styled.button`
  background: ${(p) => (p.active ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)")};
  color: ${(p) => (p.active ? "#34d399" : "#f87171")};
  border: 1px solid ${(p) => (p.active ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)")};
  padding: 5px 11px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${(p) => (p.active ? "rgba(16, 185, 129, 0.3)" : "rgba(239, 68, 68, 0.3)")};
  }
`;

const StyledSelect = styled.select`
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f1f5f9;
  padding: 9px 36px 9px 14px;
  border-radius: 11px;
  font-size: 13px;
  outline: none;
  transition: all 0.2s;
  cursor: pointer;
  min-width: 160px;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 15px;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  option {
    background: #1e293b;
    color: #f1f5f9;
  }

  @media (max-width: 640px) {
    width: 100%;
  }
`;

// ── Tabs ───────────────────────────────────────────────────────────────────────

const ModernTabContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: rgba(15, 23, 42, 0.6);
  padding: 6px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 28px;
  backdrop-filter: blur(10px);
  gap: 6px;

  @media (max-width: 480px) {
    border-radius: 12px;
    padding: 4px;
    gap: 4px;
    margin-bottom: 18px;
  }
`;

const ModernTab = styled.button`
  background: ${(p) => (p.active ? "rgba(99, 102, 241, 0.2)" : "transparent")};
  color: ${(p) => (p.active ? "#818cf8" : "#94a3b8")};
  border: 1px solid ${(p) => (p.active ? "rgba(99, 102, 241, 0.1)" : "transparent")};
  padding: 9px 18px;
  border-radius: 11px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  white-space: nowrap;
  flex: 1;

  &:hover {
    color: #e2e8f0;
    background: ${(p) => (p.active ? "rgba(99, 102, 241, 0.25)" : "rgba(255, 255, 255, 0.04)")};
  }

  @media (max-width: 480px) {
    padding: 8px 10px;
    font-size: 11px;
    gap: 4px;

    svg { width: 14px; height: 14px; }
  }
`;

// ── Roster Controls ────────────────────────────────────────────────────────────

const RosterControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

const MonthSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  color: #e2e8f0;
  font-weight: 700;
  font-size: clamp(14px, 3vw, 18px);
  white-space: nowrap;
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #e2e8f0;
  padding: 7px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const RosterActionGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: stretch;
  }
`;

const ViewModeToggle = styled.div`
  background: rgba(15, 23, 42, 0.4);
  padding: 4px;
  border-radius: 11px;
  display: flex;
  gap: 3px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ViewModeBtn = styled.button`
  padding: 6px 14px;
  border-radius: 8px;
  border: none;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: ${(p) => (p.$active ? "rgba(99, 102, 241, 0.2)" : "transparent")};
  color: ${(p) => (p.$active ? "#818cf8" : "#64748b")};
  transition: all 0.2s;
  white-space: nowrap;
`;

const ExportBtn = styled.a`
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(16, 185, 129, 0.2);
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(16, 185, 129, 0.3);
  }

  @media (max-width: 480px) {
    flex: 1;
    justify-content: center;
  }
`;

const UploadLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(99, 102, 241, 0.2);
  color: #818cf8;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid rgba(99, 102, 241, 0.2);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: rgba(99, 102, 241, 0.3);
  }

  @media (max-width: 480px) {
    flex: 1;
    justify-content: center;
  }
`;

const DeptRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    width: 100%;

    span { display: none; }
  }
`;

const WeekButtons = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 16px;
  background: rgba(15, 23, 42, 0.2);
  padding: 7px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  flex-wrap: wrap;
`;

const WeekBtn = styled.button`
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid ${(p) => (p.$active ? "rgba(99, 102, 241, 0.3)" : "transparent")};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  background: ${(p) => (p.$active ? "rgba(99, 102, 241, 0.2)" : "rgba(255,255,255,0.02)")};
  color: ${(p) => (p.$active ? "#818cf8" : "#94a3b8")};
  transition: all 0.2s;

  @media (max-width: 480px) {
    flex: 1;
    text-align: center;
  }
`;

// ── Roster Table ───────────────────────────────────────────────────────────────

const RosterGrid = styled.div`
  position: relative;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  transform: rotateX(180deg);

  &::-webkit-scrollbar {
    height: 10px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.3);
    border-radius: 8px;
    margin: 0 12px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(99, 102, 241, 0.3);
    border-radius: 8px;
    border: 2px solid rgba(15, 23, 42, 0.3);
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(99, 102, 241, 0.5);
  }
`;

const TableInner = styled.div`
  transform: rotateX(180deg);
  min-width: 1400px;
  /* Allowing full height instead of restricted 58vh */
  
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(148, 163, 184, 0.3);
    border-radius: 4px;
  }
`;

const RosterTable = styled(Table)`
  min-width: unset;
  thead {
    position: sticky;
    top: 0;
    z-index: 40;
  }
  thead th {
    background: #1e293b;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
    position: relative;
    z-index: 35;
  }
  thead th:first-child {
    z-index: 50;
  }
`;

const ShiftCell = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${(p) => p.color?.bg || "rgba(255,255,255,0.05)"};
  color: ${(p) => p.color?.text || "#94a3b8"};
  border: 1px solid ${(p) => p.color?.border || "rgba(255,255,255,0.1)"};
  transition: all 0.1s;
  user-select: none;

  &:hover {
    transform: scale(1.12);
    z-index: 10;
  }
`;

const CustomCheckbox = styled.div`
  width: 17px;
  height: 17px;
  border: 2px solid ${(p) => (p.checked ? "#6366f1" : "rgba(255, 255, 255, 0.2)")};
  border-radius: 4px;
  background: ${(p) => (p.checked ? "#6366f1" : "transparent")};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    border-color: #6366f1;
    background: ${(p) => (p.checked ? "#4f46e5" : "rgba(99, 102, 241, 0.1)")};
  }
`;

// ── Bulk Action Bar ────────────────────────────────────────────────────────────

const BulkActionBar = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(30, 41, 59, 0.95);
  border: 1px solid rgba(99, 102, 241, 0.4);
  padding: 10px 20px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 18px;
  z-index: 1000;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  max-width: calc(100vw - 32px);
  flex-wrap: wrap;
  justify-content: center;

  @keyframes slideUp {
    from { transform: translate(-50%, 100%); opacity: 0; }
    to   { transform: translate(-50%, 0);    opacity: 1; }
  }

  @media (max-width: 640px) {
    padding: 10px 14px;
    gap: 10px;
    bottom: 16px;
  }
`;

// ── Shift Selector Dropdown ────────────────────────────────────────────────────

const SelectorOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
`;

const SelectorContainer = styled.div`
  position: fixed;
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4);
  min-width: 260px;
  width: max-content;
  max-width: min(340px, calc(100vw - 20px));
  max-height: ${(p) => p.$maxHeight}px;
  overflow-y: auto;
  animation: fadeIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  display: flex;
  flex-direction: column;

  @keyframes fadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }

  @media (max-width: 480px) {
    /* Centre on mobile screen */
    left: 50% !important;
    transform: translateX(-50%);
    min-width: calc(100vw - 40px);
  }
`;

const DropdownHeader = styled.div`
  padding: 10px 14px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #94a3b8;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-weight: 700;
`;

const OptionItem = styled.div`
  padding: 10px 14px;
  text-align: left;
  background: ${(p) => (p.isClear ? "rgba(239, 68, 68, 0.05)" : "transparent")};
  color: ${(p) => (p.isClear ? "#f87171" : "#e2e8f0")};
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &:last-child { border-bottom: none; }

  &:hover {
    background: ${(p) => (p.isClear ? "rgba(239, 68, 68, 0.15)" : "rgba(99, 102, 241, 0.15)")};
    color: ${(p) => (p.isClear ? "#f87171" : "#fff")};
    padding-left: 18px;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #e2e8f0;
  font-size: 13px;
  cursor: pointer;

  input {
    width: 15px;
    height: 15px;
    accent-color: #6366f1;
  }
`;

const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

// ─── ShiftSelector Component ──────────────────────────────────────────────────

const ShiftSelector = ({
    position, shifts, onClose, onSelect,
    onCopy, onPaste, hasClipboard, selectedEmployeesCount,
}) => {
    const dropdownRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0, left: 0, maxHeight: 400,
    });

    useEffect(() => {
        if (!position || !dropdownRef.current) return;

        const calculate = () => {
            const { bottom, left, top, right } = position;
            const w = 300;
            const viewW = window.innerWidth;
            const viewH = window.innerHeight;

            const spaceBelow = viewH - bottom - 16;
            const spaceAbove = top - 16;

            let posTop = bottom + 8;
            let maxHeight = 400;

            if (spaceBelow >= 200) {
                posTop = bottom + 8;
                maxHeight = Math.min(spaceBelow - 16, 400);
            } else if (spaceAbove > spaceBelow && spaceAbove >= 200) {
                posTop = top - Math.min(400, spaceAbove - 16);
                maxHeight = Math.min(spaceAbove - 16, 400);
            } else {
                posTop = bottom + 8;
                maxHeight = Math.max(spaceBelow - 16, 150);
            }

            let posLeft = viewW - left >= w ? left : right - w;
            posLeft = Math.max(10, Math.min(posLeft, viewW - w - 10));
            posTop = Math.max(10, Math.min(posTop, viewH - 100));

            setDropdownPosition({ top: posTop, left: posLeft, maxHeight });
        };

        calculate();
        window.addEventListener("resize", calculate);
        window.addEventListener("scroll", calculate, true);
        return () => {
            window.removeEventListener("resize", calculate);
            window.removeEventListener("scroll", calculate, true);
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
                <DropdownHeader>
                    {selectedEmployeesCount > 0 ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#818cf8" }}>
                            <Users size={15} /> Apply to {selectedEmployeesCount} Employees
                        </div>
                    ) : "Quick Actions"}
                </DropdownHeader>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: "10px 14px", background: "rgba(0,0,0,0.1)" }}>
                    <IconButton
                        onClick={onCopy}
                        style={{ width: "100%", justifyContent: "center", gap: 7, fontSize: 12, background: "rgba(99, 102, 241, 0.1)", color: "#818cf8", border: "1px solid rgba(99, 102, 241, 0.2)" }}
                    >
                        <Copy size={13} /> Copy
                    </IconButton>
                    <IconButton
                        onClick={onPaste}
                        disabled={!hasClipboard}
                        style={{
                            width: "100%", justifyContent: "center", gap: 7, fontSize: 12,
                            background: hasClipboard ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.02)",
                            color: hasClipboard ? "#34d399" : "#64748b",
                            border: `1px solid ${hasClipboard ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)"}`,
                            cursor: hasClipboard ? "pointer" : "not-allowed",
                            opacity: hasClipboard ? 1 : 0.5,
                        }}
                    >
                        <ClipboardPaste size={13} /> Paste
                    </IconButton>
                </div>

                <OptionItem onClick={() => onSelect(null)} isClear>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <XCircle size={15} /> Clear Shift (OFF)
                    </div>
                </OptionItem>

                <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "3px 0" }} />
                <DropdownHeader>Available Shifts</DropdownHeader>

                {shifts.filter((s) => s.is_active).map((s) => (
                    <OptionItem key={s.id} onClick={() => onSelect(s.id)}>
                        <span>{s.name}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#94a3b8", background: "rgba(255,255,255,0.05)", padding: "3px 8px", borderRadius: 6 }}>
                            <Clock size={10} />
                            {s.start_time?.slice(0, 5)} – {s.end_time?.slice(0, 5)}
                        </div>
                    </OptionItem>
                ))}
            </SelectorContainer>
        </>
    );
};

// ─── ShiftManagement Component ────────────────────────────────────────────────

const ShiftManagement = () => {
    const [activeTab, setActiveTab] = useState("shifts");
    const [shifts, setShifts] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [globalDepartments, setGlobalDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [rosterData, setRosterData] = useState([]);
    const [selectedCell, setSelectedCell] = useState(null);
    const [selectedDepts, setSelectedDepts] = useState(["All"]);
    const [searchTerm, setSearchTerm] = useState("");
    const [clipboardColumn, setClipboardColumn] = useState(null);
    const [clipboardCell, setClipboardCell] = useState(null);
    const [selectedEmployees, setSelectedEmployees] = useState([]);
    const [clipboardRow, setClipboardRow] = useState(null);
    const [viewMode, setViewMode] = useState("month");
    const [fromDate, setFromDate] = useState(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0];
    });
    const [toDate, setToDate] = useState(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split('T')[0];
    });
    const [currentWeek, setCurrentWeek] = useState(0);
    const [newShift, setNewShift] = useState({ name: "", start_time: "", end_time: "", is_active: true });
    const [editingShift, setEditingShift] = useState(null);
    const [newDept, setNewDept] = useState({ name: "", shift_ids: [] });
    const [editingDept, setEditingDept] = useState(null);

    // XLS Preview States
    const [previewData, setPreviewData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);

    const role = localStorage.getItem("role");
    const userDept = localStorage.getItem("department_id");
    const isRestricted = role && !["Admin", "admin"].includes(role) && userDept;

    const fetchAll = async () => {
        try {
            let url = `${HRbaseurl}shifts/`;
            if (isRestricted) url += `?department/`;
            const shiftRes = await api.get(url.replace(HRbaseurl, ""));
            setShifts(shiftRes.data);

            const deptRes = await api.get("departments/");
            setDepartments(deptRes.data);

            try {
                const globalRes = await api.get("global-departments/");
                let gData = Array.isArray(globalRes.data) ? globalRes.data : [];
                const deptCodes = localStorage.getItem("department");
                if (isRestricted) {
                    const assignedDepts = userDept ? userDept.split(",").map((d) => d.trim()) : [];
                    const assignedCodes = deptCodes ? deptCodes.split(",").map((d) => d.trim()) : [];
                    gData = gData.filter(
                        (d) => assignedDepts.includes(d.id?.toString()) || assignedCodes.includes(d.department_code)
                    );
                }
                setGlobalDepartments(gData);
            } catch (err) {
                console.error("Error fetching global departments", err);
            }
        } catch (error) {
            console.error("Error fetching admin data", error);
        }
    };

    const fetchRosterData = async () => {
        try {
            let empUrl = `${HRbaseurl}employees_from_global/`;
            let rosterUrl = `${HRbaseurl}roster/?from_date=${fromDate}&to_date=${toDate}`;

            if (isRestricted) {
                empUrl += (empUrl.includes('?') ? '&' : '?') + `department=${encodeURIComponent(userDept)}`;
                rosterUrl += `&department=${encodeURIComponent(userDept)}`;
            } else if (!selectedDepts.includes("All") && selectedDepts.length > 0) {
                const deptsStr = selectedDepts.join(",");
                empUrl += (empUrl.includes('?') ? '&' : '?') + `department=${encodeURIComponent(deptsStr)}`;
                rosterUrl += `&department=${encodeURIComponent(deptsStr)}`;
            }

            const [empRes, rosterRes] = await Promise.all([
                api.get(empUrl.replace(HRbaseurl, "")),
                api.get(rosterUrl.replace(HRbaseurl, "")),
            ]);

            setEmployees(
                empRes.data.map((e) => ({
                    id: e.employeeId,
                    name: e.employeeName || e.name || e.employeeId,
                    department: e.department || "Unassigned",
                    department_id: e.department_id,
                    image: e.profileImage,
                }))
            );
            setRosterData(rosterRes.data);
        } catch (error) {
            console.error("Error fetching roster data", error);
        }
    };

    useEffect(() => {
        if (isRestricted) setSelectedDepts(userDept.split(",").filter(Boolean));
    }, []);

    useEffect(() => { fetchAll(); }, []);
    useEffect(() => {
        if (activeTab === "roster") fetchRosterData();
    }, [activeTab, fromDate, toDate, selectedDepts]);

    const getExportUrl = (format = "csv") => {
        const ep = format === "xlsx" ? "roster/export-xlsx/" : "roster/export/";
        let url = `${HRbaseurl}${ep}?from_date=${fromDate}&to_date=${toDate}`;
        if (!selectedDepts.includes("All") && selectedDepts.length > 0)
            url += `&department=${encodeURIComponent(selectedDepts.join(","))}`;
        return url;
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append("file", file);
        fd.append("from_date", fromDate);
        fd.append("to_date", toDate);
        
        setIsUploading(true);
        try {
            const res = await api.post("roster/preview-xlsx/", fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setPreviewData(res.data);
            setUploadFile(file);
            setShowPreview(true);
        } catch (err) {
            alert("Failed to preview: " + (err.response?.data?.error || err.message));
        } finally {
            setIsUploading(false);
            e.target.value = ""; // Reset input
        }
    };

    const handleApproveImport = async (editedData) => {
        const payload = editedData || previewData;
        if (!payload) return;
        
        setIsUploading(true);
        try {
            const res = await api.post("roster/approve-data/", payload);
            alert(res.data.message);
            setShowPreview(false);
            setPreviewData(null);
            setUploadFile(null);
            fetchRosterData();
        } catch (err) {
            alert("Failed to upload: " + (err.response?.data?.error || err.message));
        } finally {
            setIsUploading(false);
        }
    };

    const handleCreateShift = async () => {
        if (!newShift.name || !newShift.start_time || !newShift.end_time) { alert("Please fill all fields"); return; }
        try { await api.post("shifts/", newShift); setNewShift({ name: "", start_time: "", end_time: "", is_active: true }); fetchAll(); }
        catch { alert("Error creating shift. Name must be unique."); }
    };

    const handleUpdateShift = async () => {
        if (!newShift.name || !newShift.start_time || !newShift.end_time) { alert("Please fill all fields"); return; }
        try { await api.put(`shifts/${editingShift.id}/`, newShift); setNewShift({ name: "", start_time: "", end_time: "", is_active: true }); setEditingShift(null); fetchAll(); }
        catch { alert("Error updating shift."); }
    };

    const handleEditShift = (shift) => {
        setEditingShift(shift);
        setNewShift({ name: shift.name, start_time: shift.start_time, end_time: shift.end_time, is_active: shift.is_active });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleToggleShift = async (shift) => {
        try { await api.put(`shifts/${shift.id}/`, { ...shift, is_active: !shift.is_active }); fetchAll(); }
        catch { alert("Failed to update status"); }
    };

    const handleCreateDept = async () => {
        if (!newDept.name) { alert("Please enter department name"); return; }
        try { await api.post("departments/", newDept); setNewDept({ name: "", shift_ids: [] }); fetchAll(); }
        catch { alert("Error creating department."); }
    };

    const handleUpdateDept = async () => {
        if (!newDept.name) { alert("Please enter department name"); return; }
        try { await api.put(`departments/${editingDept.id}/`, newDept); setNewDept({ name: "", shift_ids: [] }); setEditingDept(null); fetchAll(); }
        catch { alert("Error updating department."); }
    };

    const handleEditDept = (dept) => {
        setEditingDept(dept);
        setNewDept({ name: dept.name, shift_ids: dept.shifts.map((s) => s.id) });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const toggleShiftSelection = (id) =>
        setNewDept((prev) => ({
            ...prev,
            shift_ids: prev.shift_ids.includes(id)
                ? prev.shift_ids.filter((sid) => sid !== id)
                : [...prev.shift_ids, id],
        }));

    const assignShift = async (empId, date, shiftId) => {
        if (selectedEmployees.length > 0 && selectedEmployees.includes(empId)) {
            const payload = selectedEmployees.map((id) => ({ employee_id: id, date, shift_id: shiftId }));
            try { await api.post("roster/assign/", payload); fetchRosterData(); setSelectedCell(null); setSelectedEmployees([]); }
            catch { alert("Failed to assign shifts in bulk"); }
            return;
        }
        try { await api.post("roster/assign/", { employee_id: empId, date, shift_id: shiftId }); fetchRosterData(); setSelectedCell(null); }
        catch { alert("Failed to assign shift"); }
    };

    const handleCopyColumn = (d) => setClipboardColumn({ sourceDate: d, assignments: rosterData.filter((r) => r.date === d) });
    const handleCopyRow = (id) => setClipboardRow({ sourceEmpId: id, assignments: rosterData.filter((r) => r.employee == id || r.employee_id == id) });

    const handleCopyCell = () => {
        if (!selectedCell) return;
        const s = getShiftForCell(selectedCell.empId, { dateStr: selectedCell.day });
        if (s) { setClipboardCell(s.shift); setSelectedCell(null); }
    };

    const handlePasteCell = async () => {
        if (!selectedCell || !clipboardCell) return;
        if (selectedEmployees.length > 0) {
            const payload = selectedEmployees.map((id) => ({ employee_id: id, date: selectedCell.day, shift_id: clipboardCell }));
            try { await api.post("roster/assign/", payload); fetchRosterData(); setSelectedCell(null); setSelectedEmployees([]); }
            catch { alert("Failed bulk paste"); }
        } else {
            await assignShift(selectedCell.empId, selectedCell.day, clipboardCell);
            setSelectedCell(null);
        }
    };

    const handlePasteRow = async (targetEmpId) => {
        if (!clipboardRow) return;
        const payload = clipboardRow.assignments.map((a) => ({ employee_id: targetEmpId, date: a.date, shift_id: a.shift || a.shift_id }));
        try { await api.post("roster/assign/", payload); fetchRosterData(); }
        catch { alert("Failed to copy row schedule"); }
    };

    const handlePasteColumn = async (targetDate) => {
        if (!clipboardColumn) return;
        const payload = filteredEmployees.map((emp) => {
            const copied = clipboardColumn.assignments.find((a) => a.employee_id == emp.id || a.employee == emp.id);
            return { employee_id: emp.id, date: targetDate, shift_id: copied ? copied.shift : null };
        });
        try { await api.post("roster/assign/", payload); fetchRosterData(); setSelectedCell(null); }
        catch { alert("Failed to paste column"); }
    };

    const toggleEmployeeSelection = (id) =>
        setSelectedEmployees((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

    const toggleAllSelection = () =>
        setSelectedEmployees(selectedEmployees.length === filteredEmployees.length ? [] : filteredEmployees.map((e) => e.id));

    const getShiftColor = (idx, name = "") => {
        if (name && (name.toLowerCase() === "off" || name.toLowerCase().includes("week off")))
            return { bg: "rgba(148,163,184,0.2)", text: "#94a3b8", border: "rgba(148,163,184,0.3)" };
        const palette = [
            { bg: "rgba(16,185,129,0.15)", text: "#34d399", border: "rgba(16,185,129,0.25)" },
            { bg: "rgba(59,130,246,0.15)", text: "#60a5fa", border: "rgba(59,130,246,0.25)" },
            { bg: "rgba(239,68,68,0.15)", text: "#f87171", border: "rgba(239,68,68,0.25)" },
            { bg: "rgba(245,158,11,0.15)", text: "#fbbf24", border: "rgba(245,158,11,0.25)" },
            { bg: "rgba(168,85,247,0.15)", text: "#c084fc", border: "rgba(168,85,247,0.25)" },
            { bg: "rgba(236,72,153,0.15)", text: "#f472b6", border: "rgba(236,72,153,0.25)" },
            { bg: "rgba(14,165,233,0.15)", text: "#38bdf8", border: "rgba(14,165,233,0.25)" },
        ];
        return palette[idx % palette.length];
    };

    const shiftColorMap = {};
    shifts.forEach((s, i) => {
        shiftColorMap[s.id] = getShiftColor(i, s.name);
        shiftColorMap[s.name] = getShiftColor(i, s.name);
    });
    shiftColorMap["Off"] = { bg: "rgba(148,163,184,0.2)", text: "#94a3b8", border: "rgba(148,163,184,0.3)" };

    const calculateDuration = (start, end) => {
        if (!start || !end) return "--";
        const parse = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
        let s = parse(start), e = parse(end);
        if (e < s) e += 24 * 60;
        const diff = e - s;
        const h = Math.floor(diff / 60), m = diff % 60;
        return h > 0 && m > 0 ? `${h}h ${m}m` : h > 0 ? `${h}h` : `${m}m`;
    };

    const daysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

    const getDaysArray = () => {
        const start = new Date(fromDate);
        const end = new Date(toDate);
        const days = [];
        let curr = new Date(start);

        while (curr <= end) {
            const dateStr = curr.toISOString().split('T')[0];
            const dStr = String(curr.getDate()).padStart(2, "0");
            days.push({
                dateNum: curr.getDate(),
                dayName: curr.toLocaleString("default", { weekday: "short" }),
                dateStr,
                isToday: dateStr === new Date().toISOString().split('T')[0],
            });
            curr.setDate(curr.getDate() + 1);
            if (days.length > 62) break; // Limit to 2 months for performance
        }
        return days;
    };

    const getWeekButtons = () => {
        const numWeeks = Math.ceil(daysInMonth(currentDate) / 7);
        return Array.from({ length: numWeeks }, (_, i) => i);
    };

    const changeMonth = (delta) => {
        const d = new Date(currentDate);
        d.setMonth(d.getMonth() + delta);
        setCurrentDate(d);
        setCurrentWeek(0);
    };

    const getShiftForCell = (empId, dayObj) =>
        rosterData.find((s) => s.employee == empId && s.date === dayObj.dateStr);

    const availableDepts = useMemo(() => {
        return globalDepartments.map((gd) => ({ 
            id: (gd.id || gd.department_code || gd.id).toString(), 
            name: gd.department_name || gd.name 
        }));
    }, [globalDepartments]);

    const uniqueDepartments = useMemo(() => {
        if (isRestricted) return availableDepts.filter((d) => userDept.split(",").includes(d.id));
        return [{ id: "All", name: "All" }, ...availableDepts];
    }, [isRestricted, availableDepts, userDept]);

    const filteredEmployees = useMemo(() => {
        const selectedIds = new Set(selectedDepts.filter(d => d !== "All").map(d => d.toString()));
        const selectedNames = new Set(
            availableDepts
                .filter(d => selectedIds.has(d.id))
                .map(d => d.name)
        );
        const isAllDepts = selectedDepts.includes("All") || selectedDepts.length === 0;

        return employees.filter((e) => {
            const eid = e.id?.toString().toLowerCase() || "";
            const ename = e.name?.toLowerCase() || "";
            
            // Search filter
            if (searchTerm && !eid.includes(searchTerm.toLowerCase()) && !ename.includes(searchTerm.toLowerCase())) {
                return false;
            }

            // Department filter
            if (isAllDepts) return true;

            const deid = e.department_id?.toString();
            const dename = e.department?.toString();
            
            return (deid && selectedIds.has(deid)) || (dename && selectedNames.has(dename));
        });
    }, [employees, selectedDepts, availableDepts, searchTerm]);

    useEffect(() => {
        const handler = () => { if (selectedCell) setSelectedCell(null); };
        if (selectedCell) document.addEventListener("click", handler);
        return () => document.removeEventListener("click", handler);
    }, [selectedCell]);

    // ─── Render ─────────────────────────────────────────────────────────────────

    return (
        <Container>
            <PageHeader>
                <Title>
                    <Clock size={28} color="#818cf8" />
                    Shift Management
                </Title>
            </PageHeader>

            {/* ── Tabs ── */}
            <ModernTabContainer>
                <ModernTab active={activeTab === "shifts"} onClick={() => setActiveTab("shifts")}>
                    <Layers size={16} /> Shift Config
                </ModernTab>
                <ModernTab active={activeTab === "departments"} onClick={() => setActiveTab("departments")}>
                    <Layers size={16} /> Departments
                </ModernTab>
                <ModernTab active={activeTab === "roster"} onClick={() => setActiveTab("roster")}>
                    <Calendar size={16} /> Duty Roster
                </ModernTab>
            </ModernTabContainer>

            {/* ── Shifts Tab ── */}
            {activeTab === "shifts" && (
                <Card>
                    {role === "Admin" && (
                        <InputGroup>
                            <Input
                                placeholder="Shift Name (e.g. A, B)"
                                value={newShift.name}
                                onChange={(e) => setNewShift({ ...newShift, name: e.target.value })}
                            />
                            <Input
                                type="time"
                                value={newShift.start_time}
                                onChange={(e) => setNewShift({ ...newShift, start_time: e.target.value })}
                            />
                            <span style={{ color: "#94a3b8", whiteSpace: "nowrap" }}>to</span>
                            <Input
                                type="time"
                                value={newShift.end_time}
                                onChange={(e) => setNewShift({ ...newShift, end_time: e.target.value })}
                            />
                            <CheckboxLabel>
                                <input
                                    type="checkbox"
                                    checked={newShift.is_active}
                                    onChange={(e) => setNewShift({ ...newShift, is_active: e.target.checked })}
                                />
                                Active
                            </CheckboxLabel>
                            <ButtonGroup>
                                {editingShift ? (
                                    <>
                                        <Button onClick={handleUpdateShift}><Edit size={16} /> Update Shift</Button>
                                        <Button onClick={() => { setNewShift({ name: "", start_time: "", end_time: "", is_active: true }); setEditingShift(null); }}
                                            style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}>
                                            Cancel
                                        </Button>
                                    </>
                                ) : (
                                    <Button onClick={handleCreateShift}><UserPlus size={16} /> Add Shift</Button>
                                )}
                            </ButtonGroup>
                        </InputGroup>
                    )}

                    <TableScrollWrapper $maxHeight="450px">
                        <Table>
                            <thead>
                                <Tr>
                                    <Th>S.No</Th>
                                    <Th>Timings</Th>
                                    <Th>Shift</Th>
                                    <Th>Duration</Th>
                                    <Th>Status</Th>
                                    {role === "Admin" && <Th>Actions</Th>}
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
                                                    {shift.start_time} – {shift.end_time}
                                                </Badge>
                                            </Td>
                                            <Td style={{ fontWeight: 700 }}>{shift.name}</Td>
                                            <Td style={{ fontFamily: "monospace", color: "#94a3b8" }}>{duration}</Td>
                                            <Td>
                                                <ToggleButton
                                                    active={shift.is_active}
                                                    onClick={() => role === "Admin" && handleToggleShift(shift)}
                                                    style={{ opacity: role === "Admin" ? 1 : 0.5, cursor: role === "Admin" ? "pointer" : "not-allowed" }}
                                                >
                                                    {shift.is_active ? <CheckCircle size={13} /> : <XCircle size={13} />}
                                                    {shift.is_active ? "Enabled" : "Disabled"}
                                                </ToggleButton>
                                            </Td>
                                            {role === "Admin" && (
                                                <Td>
                                                    <ToggleButton active onClick={() => handleEditShift(shift)}
                                                        style={{ padding: "5px 11px", borderRadius: 8, background: "rgba(99,102,241,0.1)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.2)" }}>
                                                        <Edit size={13} /> Edit
                                                    </ToggleButton>
                                                </Td>
                                            )}
                                        </Tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </TableScrollWrapper>
                </Card>
            )}

            {/* ── Departments Tab ── */}
            {activeTab === "departments" && (
                <Card>
                    {role === "Admin" && (
                        <FormContainer>
                            <FormRow>
                                <FormField>
                                    <FormLabel>Department Name</FormLabel>
                                    <StyledSelect
                                        value={newDept.name}
                                        onChange={(e) => setNewDept({ ...newDept, name: e.target.value })}
                                        disabled={!!editingDept}
                                    >
                                        <option value="">Select Global Department</option>
                                        {globalDepartments.map((d, i) => (
                                            <option key={i} value={d.department_name || d.name}>{d.department_name || d.name}</option>
                                        ))}
                                    </StyledSelect>
                                </FormField>
                                <ButtonGroup>
                                    {editingDept ? (
                                        <>
                                            <Button onClick={handleUpdateDept}><Layers size={16} /> Update Dept</Button>
                                            <Button onClick={() => { setNewDept({ name: "", shift_ids: [] }); setEditingDept(null); }}
                                                style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)" }}>
                                                Cancel
                                            </Button>
                                        </>
                                    ) : (
                                        <Button onClick={handleCreateDept}><Layers size={16} /> Create Dept</Button>
                                    )}
                                </ButtonGroup>
                            </FormRow>
                            <FormField>
                                <FormLabel>Allowed Shifts</FormLabel>
                                <ChipGrid>
                                    {shifts.filter((s) => s.is_active).map((shift) => (
                                        <ShiftChip
                                            key={shift.id}
                                            selected={newDept.shift_ids.includes(shift.id)}
                                            onClick={() => toggleShiftSelection(shift.id)}
                                        >
                                            {newDept.shift_ids.includes(shift.id) && <CheckCircle size={13} />}
                                            <span>{shift.name}</span>
                                            <span style={{ fontSize: 10, opacity: 0.6, borderLeft: "1px solid currentColor", paddingLeft: 6 }}>
                                                {shift.start_time?.slice(0, 5)} – {shift.end_time?.slice(0, 5)}
                                            </span>
                                        </ShiftChip>
                                    ))}
                                </ChipGrid>
                            </FormField>
                        </FormContainer>
                    )}

                    <TableScrollWrapper $maxHeight="450px">
                        <Table>
                            <thead>
                                <Tr>
                                    <Th>S.No</Th>
                                    <Th>Department</Th>
                                    <Th>Allowed Shifts</Th>
                                    <Th>Count</Th>
                                    {role === "Admin" && <Th>Actions</Th>}
                                </Tr>
                            </thead>
                            <tbody>
                                {globalDepartments.map((gDept, idx) => {
                                    const gName = gDept.department_name || gDept.name;
                                    const localDept = departments.find((d) => d.name === gName);
                                    return (
                                        <Tr key={idx}>
                                            <Td>{idx + 1}</Td>
                                            <Td>{gName}</Td>
                                            <Td>
                                                {localDept ? (
                                                    <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
                                                        {localDept.shifts.map((shift, sIdx) => {
                                                            const s = shiftColorMap[shift.id] || getShiftColor(sIdx);
                                                            return <Badge key={shift.id} color={s.bg} textColor={s.text} borderColor={s.border}>{shift.name}</Badge>;
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span style={{ color: "#64748b", fontSize: 12, fontStyle: "italic" }}>No shifts configured</span>
                                                )}
                                            </Td>
                                            <Td>{localDept ? localDept.shifts.length : 0}</Td>
                                            {role === "Admin" && (
                                                <Td>
                                                    <ToggleButton
                                                        active={!!localDept}
                                                        onClick={() => {
                                                            if (localDept) { handleEditDept(localDept); }
                                                            else { setNewDept({ name: gName, shift_ids: [] }); setEditingDept(null); window.scrollTo({ top: 0, behavior: "smooth" }); }
                                                        }}
                                                        style={{ padding: "5px 11px", borderRadius: 8, background: localDept ? "rgba(99,102,241,0.1)" : "rgba(148,163,184,0.1)", color: localDept ? "#818cf8" : "#94a3b8", border: `1px solid ${localDept ? "rgba(99,102,241,0.2)" : "rgba(148,163,184,0.2)"}` }}
                                                    >
                                                        {localDept ? <Edit size={13} /> : <Layers size={13} />}
                                                        {localDept ? "Edit" : "Configure"}
                                                    </ToggleButton>
                                                </Td>
                                            )}
                                        </Tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </TableScrollWrapper>
                </Card>
            )}

            {/* ── Roster Tab ── */}
            {activeTab === "roster" && (
                <>
                    {/* Top Controls */}
                    <RosterControls>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", background: "rgba(255,255,255,0.05)", padding: "10px 16px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <label style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>From</label>
                                <input 
                                    type="date" 
                                    value={fromDate} 
                                    onChange={(e) => setFromDate(e.target.value)}
                                    style={{ background: "transparent", border: "none", color: "#f1f5f9", fontSize: 14, outline: "none" }}
                                />
                            </div>
                            <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
                            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                                <label style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>To</label>
                                <input 
                                    type="date" 
                                    value={toDate} 
                                    onChange={(e) => setToDate(e.target.value)}
                                    style={{ background: "transparent", border: "none", color: "#f1f5f9", fontSize: 14, outline: "none" }}
                                />
                            </div>
                        </div>

                        <RosterActionGroup>
                            <ViewModeToggle>
                                <ViewModeBtn $active={viewMode === "month"} onClick={() => setViewMode("month")}>Month</ViewModeBtn>
                                <ViewModeBtn $active={viewMode === "week"} onClick={() => setViewMode("week")}>Week</ViewModeBtn>
                            </ViewModeToggle>
                            <ExportBtn href={getExportUrl("xlsx")} target="_blank" download>
                                <Download size={15} /> Export
                            </ExportBtn>
                            <div style={{ position: "relative" }}>
                                <input
                                    type="file" accept=".xlsx,.xls"
                                    onChange={handleFileUpload}
                                    style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", zIndex: 10 }}
                                    id="roster-upload"
                                />
                                <UploadLabel htmlFor="roster-upload">
                                    <Upload size={15} /> Upload
                                </UploadLabel>
                            </div>
                        </RosterActionGroup>

                        {!isRestricted && (
                            <DeptRow>
                                <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>Search:</span>
                                <Input 
                                    placeholder="Search Employee ID or Name..." 
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ maxWidth: "250px" }}
                                />
                                <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500, marginLeft: 15 }}>Department:</span>
                                <StyledSelect
                                    value={selectedDepts[0] || "All"}
                                    onChange={(e) => setSelectedDepts([e.target.value])}
                                >
                                    <option value="All">All Departments</option>
                                    {uniqueDepartments.filter((d) => d.id !== "All").map((dept) => (
                                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                                    ))}
                                </StyledSelect>
                            </DeptRow>
                        )}
                    </RosterControls>

                    {/* Week Selector */}
                    {viewMode === "week" && (
                        <WeekButtons>
                            {getWeekButtons().map((weekIdx) => (
                                <WeekBtn key={weekIdx} $active={currentWeek === weekIdx} onClick={() => setCurrentWeek(weekIdx)}>
                                    Week {weekIdx + 1}
                                </WeekBtn>
                            ))}
                        </WeekButtons>
                    )}

                    {/* Roster Table */}
                    <Card>
                        <RosterGrid>
                            <TableWrapper>
                                <TableInner>
                                    <RosterTable>
                                        <thead>
                                            <Tr>
                                                <Th style={{ minWidth: 220, position: "sticky", left: 0, background: "#1e293b", zIndex: 50 }}>
                                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                        <CustomCheckbox
                                                            checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                                                            onClick={toggleAllSelection}
                                                        >
                                                            {selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0 && <Check size={11} color="white" />}
                                                        </CustomCheckbox>
                                                        Employee
                                                    </div>
                                                </Th>
                                                {getDaysArray().map((day) => (
                                                    <Th
                                                        key={day.dateStr}
                                                        style={{
                                                            textAlign: "center", minWidth: 64, padding: "7px 4px",
                                                            background: day.dayName === "Sun" ? "rgba(239,68,68,0.25)" : "transparent",
                                                            borderBottom: day.dayName === "Sun" ? "2px solid #ef4444" : "1px solid rgba(255,255,255,0.05)",
                                                        }}
                                                    >
                                                        <div style={{ color: day.dayName === "Sun" ? "#ef4444" : "#94a3b8", fontSize: 10, marginBottom: 2, fontWeight: day.dayName === "Sun" ? 700 : 400 }}>
                                                            {day.dayName}
                                                        </div>
                                                        <div style={{ fontSize: 13, color: day.dayName === "Sun" ? "#fca5a5" : "#e2e8f0", fontWeight: 700 }}>
                                                            {day.dateStr.slice(-2)}
                                                        </div>
                                                        {role === "Admin" && (
                                                            <div style={{ display: "flex", justifyContent: "center", gap: 3, marginTop: 5 }}>
                                                                <IconButton
                                                                    style={{ padding: 3, background: clipboardColumn?.sourceDate === day.dateStr ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)", color: clipboardColumn?.sourceDate === day.dateStr ? "#34d399" : "#94a3b8" }}
                                                                    onClick={() => handleCopyColumn(day.dateStr)}
                                                                    title="Copy column"
                                                                >
                                                                    <Copy size={11} />
                                                                </IconButton>
                                                                <IconButton
                                                                    style={{ padding: 3 }}
                                                                    onClick={() => handlePasteColumn(day.dateStr)}
                                                                    disabled={!clipboardColumn}
                                                                    title="Paste column"
                                                                >
                                                                    <ClipboardPaste size={11} opacity={clipboardColumn ? 1 : 0.3} />
                                                                </IconButton>
                                                            </div>
                                                        )}
                                                    </Th>
                                                ))}
                                            </Tr>
                                        </thead>
                                        <tbody>
                                            {filteredEmployees.map((emp) => (
                                                <Tr key={emp.id}>
                                                    <Td style={{ position: "sticky", left: 0, background: "rgba(30,41,59,0.95)", zIndex: 10, fontWeight: 500 }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                            <CustomCheckbox
                                                                checked={selectedEmployees.includes(emp.id)}
                                                                onClick={(e) => { e.stopPropagation(); toggleEmployeeSelection(emp.id); }}
                                                            >
                                                                {selectedEmployees.includes(emp.id) && <Check size={11} color="white" />}
                                                            </CustomCheckbox>
                                                            <User size={13} color="#94a3b8" />
                                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                                <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13 }}>{emp.name}</div>
                                                                <div style={{ fontSize: 10, color: "#64748b" }}>{emp.department}</div>
                                                            </div>
                                                            {role === "Admin" && (
                                                                <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
                                                                    <IconButton
                                                                        style={{ padding: 3, background: clipboardRow?.sourceEmpId === emp.id ? "rgba(99,102,241,0.2)" : "transparent", color: clipboardRow?.sourceEmpId === emp.id ? "#818cf8" : "#64748b" }}
                                                                        onClick={() => handleCopyRow(emp.id)} title="Copy row"
                                                                    ><Copy size={11} /></IconButton>
                                                                    <IconButton
                                                                        style={{ padding: 3, color: clipboardRow ? "#34d399" : "#475569" }}
                                                                        onClick={() => handlePasteRow(emp.id)} disabled={!clipboardRow} title="Paste row"
                                                                    ><ClipboardPaste size={11} /></IconButton>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </Td>
                                                    {getDaysArray().map((day) => {
                                                        const schedule = getShiftForCell(emp.id, day);
                                                        const shiftName = schedule ? schedule.shift_name : "";
                                                        const shiftId = schedule ? schedule.shift : null;
                                                        const cellStyle = shiftId ? shiftColorMap[shiftId] : null;
                                                        return (
                                                            <Td key={day.dateStr} style={{ padding: 4, height: 40, background: day.dayName === "Sun" ? "rgba(239,68,68,0.12)" : "transparent" }}>
                                                                <ShiftCell
                                                                    color={cellStyle}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedCell({ empId: emp.id, day: day.dateStr, rect: e.currentTarget.getBoundingClientRect() });
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
                                </TableInner>
                            </TableWrapper>
                        </RosterGrid>
                    </Card>

                    {/* Bulk Action Bar */}
                    {selectedEmployees.length > 0 && (
                        <BulkActionBar>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div style={{ background: "#6366f1", color: "white", width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                                    {selectedEmployees.length}
                                </div>
                                <span style={{ color: "#e2e8f0", fontWeight: 500, fontSize: 14 }}>Selected</span>
                            </div>
                            <div style={{ width: 1, height: 20, background: "rgba(255,255,255,0.1)" }} />
                            <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
                                <IconButton onClick={() => setSelectedEmployees([])} style={{ color: "#94a3b8", fontSize: 13, gap: 6 }}>
                                    <XCircle size={15} /> Cancel
                                </IconButton>
                                <div style={{ color: "#64748b", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
                                    <Clock size={13} /> Click any cell to assign
                                </div>
                            </div>
                        </BulkActionBar>
                    )}

                    {/* Shift Selector Popup */}
                    {selectedCell && (() => {
                        const emp = employees.find(e => e.id === selectedCell.empId);
                        const deptConfig = departments.find(d => d.name === emp?.department);
                        const allowedShiftIds = deptConfig ? deptConfig.shifts.map(s => s.id) : [];
                        const filteredShifts = shifts.filter(s => allowedShiftIds.includes(s.id));

                        return (
                            <ShiftSelector
                                position={selectedCell.rect}
                                shifts={filteredShifts}
                                hasClipboard={!!clipboardCell}
                                selectedEmployeesCount={selectedEmployees.includes(selectedCell.empId) ? selectedEmployees.length : 0}
                                onClose={() => setSelectedCell(null)}
                                onCopy={handleCopyCell}
                                onPaste={handlePasteCell}
                                onSelect={(shiftId) => assignShift(selectedCell.empId, selectedCell.day, shiftId)}
                            />
                        );
                    })()}

                    <div style={{ color: "#64748b", fontSize: 12, marginTop: -16, marginBottom: 32 }}>
                        * Click on any cell to assign or edit a shift.
                    </div>

                    {showPreview && previewData && (
                        <RosterPreviewModal
                            data={previewData}
                            onClose={() => { setShowPreview(false); setPreviewData(null); }}
                            onApprove={handleApproveImport}
                            isUploading={isUploading}
                            shifts={shifts}
                            departments={departments}
                        />
                    )}
                </>
            )}
        </Container>
    );
};

// ─── RosterPreviewModal ───────────────────────────────────────────────────────

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  width: 95vw;
  max-width: 1400px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const ModalHeader = styled.div`
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ModalBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

const ModalFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: rgba(0, 0, 0, 0.2);
`;

const RosterPreviewModal = ({ data, onClose, onApprove, isUploading, shifts = [], departments = [] }) => {
    const [localPreview, setLocalPreview] = useState(data.preview);

    const currentErrors = useMemo(() => {
        const errorMap = new Map(); // empName -> Set of error strings

        localPreview.forEach(emp => {
            Object.entries(emp.shifts).forEach(([date, shift]) => {
                if (shift && !shift.is_valid && shift.name !== "") {
                    const msg = `Shift '${shift.name}' is not configured for department '${emp.department}'`;
                    if (!errorMap.has(emp.name)) errorMap.set(emp.name, new Set());
                    errorMap.get(emp.name).add(msg);
                }
            });
        });

        // Add backend errors, grouping them where possible
        (data.errors || []).forEach(err => {
            const empInError = localPreview.find(emp => err.includes(emp.name));
            if (empInError) {
                // Only keep if the employee still has invalid shifts
                const hasInvalid = Object.values(empInError.shifts).some(s => s && !s.is_valid && s.name !== "");
                if (hasInvalid) {
                    // Extract the core message if it follows our new backend pattern
                    let coreMsg = err;
                    if (err.includes(':')) coreMsg = err.split(':').slice(1).join(':').split(' on ')[0].trim();
                    
                    if (!errorMap.has(empInError.name)) errorMap.set(empInError.name, new Set());
                    errorMap.get(empInError.name).add(coreMsg);
                }
            } else {
                // Global error
                if (!errorMap.has("General")) errorMap.set("General", new Set());
                errorMap.get("General").add(err);
            }
        });

        // Convert Map to flat list of strings
        const finalErrors = [];
        errorMap.forEach((msgs, name) => {
            msgs.forEach(msg => {
                finalErrors.push(name === "General" ? msg : `${name}: ${msg}`);
            });
        });

        return finalErrors;
    }, [localPreview, data.errors]);

    const handleCellChange = (empIdx, dateStr, newShiftName) => {
        const updated = [...localPreview];
        const emp = updated[empIdx];
        
        const trimmedNewShift = newShiftName.trim().toUpperCase();
        if (trimmedNewShift === "") {
            updated[empIdx].shifts[dateStr] = { name: "", is_valid: true };
            setLocalPreview(updated);
            return;
        }

        const shiftObj = shifts.find(s => s.name.trim().toUpperCase() === trimmedNewShift);
        const empDept = departments.find(d => d.name.trim().toUpperCase() === emp.department.trim().toUpperCase());
        const availableShifts = empDept ? empDept.shifts : shifts;
        const isAllowedInDept = availableShifts.some(s => s.name.trim().toUpperCase() === trimmedNewShift);

        updated[empIdx].shifts[dateStr] = {
            name: shiftObj ? shiftObj.name : newShiftName,
            is_valid: !!(shiftObj && isAllowedInDept)
        };
        setLocalPreview(updated);
    };

    const handleApprove = () => {
        onApprove({ ...data, preview: localPreview });
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={e => e.stopPropagation()}>
                <ModalHeader>
                    <div>
                        <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 20 }}>Roster Preview (Editable)</h2>
                        <p style={{ margin: "4px 0 0", color: "#94a3b8", fontSize: 13 }}>
                            Review and edit {data.total_employees} employees. Click on shift names to change them.
                        </p>
                    </div>
                    <IconButton onClick={onClose}><XCircle size={24} /></IconButton>
                </ModalHeader>
                
                <ModalBody>
                    {currentErrors.length > 0 && (
                        <div style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: 12, padding: 16, marginBottom: 20 }}>
                            <div style={{ color: "#f87171", fontWeight: 700, fontSize: 14, marginBottom: 8, display: "flex", alignItems: "center", gap: 8 }}>
                                <XCircle size={16} /> Validation Errors ({currentErrors.length})
                            </div>
                            <ul style={{ margin: 0, paddingLeft: 20, color: "#fca5a5", fontSize: 12 }}>
                                {currentErrors.slice(0, 10).map((err, i) => <li key={i}>{err}</li>)}
                                {currentErrors.length > 10 && <li>...and {currentErrors.length - 10} more</li>}
                            </ul>
                        </div>
                    )}

                    <TableScrollWrapper style={{ background: "rgba(15, 23, 42, 0.5)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
                        <Table>
                            <thead>
                                <Tr>
                                    <Th style={{ position: "sticky", left: 0, background: "rgba(15, 23, 42, 1)", zIndex: 2, minWidth: 150 }}>Employee</Th>
                                    <Th style={{ minWidth: 120 }}>Department</Th>
                                    {(data.headers || []).map(dateStr => {
                                        const d = new Date(dateStr);
                                        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                                        const dayNum = dateStr.split('-')[2];
                                        return (
                                            <Th key={dateStr} style={{ textAlign: "center", minWidth: 70 }}>
                                                <div style={{ fontSize: 10, color: "#94a3b8" }}>{dayName}</div>
                                                <div style={{ fontSize: 12 }}>{dayNum}</div>
                                            </Th>
                                        );
                                    })}
                                </Tr>
                            </thead>
                            <tbody>
                                {localPreview.map((emp, i) => (
                                    <Tr key={i}>
                                        <Td style={{ position: "sticky", left: 0, background: "rgba(30, 41, 59, 1)", zIndex: 1, minWidth: 150 }}>
                                            <div style={{ fontWeight: 600, fontSize: 13 }}>{emp.name}</div>
                                            <div style={{ fontSize: 10, color: "#64748b" }}>ID: {emp.id}</div>
                                        </Td>
                                        <Td style={{ minWidth: 120 }}>{emp.department}</Td>
                                        {(data.headers || []).map(dateStr => {
                                            const shift = emp.shifts[dateStr];
                                            
                                            // Filter shifts by department
                                            const empDept = departments.find(d => d.name.toUpperCase() === emp.department.toUpperCase());
                                            const availableShifts = empDept ? empDept.shifts : shifts;

                                            return (
                                                <Td key={dateStr} style={{ padding: "4px" }}>
                                                    <select
                                                        value={shift?.name || ""}
                                                        onChange={(e) => handleCellChange(i, dateStr, e.target.value)}
                                                        style={{
                                                            background: !shift ? "transparent" : (shift.is_valid ? "rgba(99, 102, 241, 0.15)" : "rgba(239, 68, 68, 0.2)"),
                                                            color: !shift ? "#475569" : (shift.is_valid ? "#a5b4fc" : "#f87171"),
                                                            border: shift?.is_valid ? "1px solid rgba(99, 102, 241, 0.3)" : (shift ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(255,255,255,0.05)"),
                                                            borderRadius: "6px",
                                                            fontSize: "11px",
                                                            width: "100%",
                                                            padding: "4px 2px",
                                                            outline: "none",
                                                            cursor: "pointer",
                                                            textAlign: "center"
                                                        }}
                                                    >
                                                        <option value="">Off</option>
                                                        {availableShifts.filter(s => s.is_active).map(s => (
                                                            <option key={s.id} value={s.name}>{s.name}</option>
                                                        ))}
                                                        {shift && !shift.is_valid && (
                                                            <option value={shift.name}>{shift.name} (Invalid)</option>
                                                        )}
                                                    </select>
                                                </Td>
                                            );
                                        })}
                                    </Tr>
                                ))}
                            </tbody>
                        </Table>
                    </TableScrollWrapper>
                </ModalBody>

                <ModalFooter>
                    <Button onClick={onClose} style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.1)" }}>Cancel</Button>
                    <Button 
                        onClick={handleApprove} 
                        disabled={isUploading || currentErrors.length > 0}
                        style={{
                            opacity: (isUploading || currentErrors.length > 0) ? 0.5 : 1,
                            cursor: (isUploading || currentErrors.length > 0) ? "not-allowed" : "pointer"
                        }}
                    >
                        {isUploading ? "Importing..." : "Approve & Import"}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ShiftManagement;
