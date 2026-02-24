import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import styled, { createGlobalStyle } from 'styled-components';
import {
  AlertTriangle,
  Trash2,
  RefreshCw,
  CheckSquare,
  Square,
  Calendar
} from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';

// --- Styles Reuse ---
const GlobalStyle = createGlobalStyle`
  :root {
    --bg1: #0f172a;
    --bg2: #1e293b;
    --primary: #ef4444; /* Red for danger/spoofing */
    --text: #e5e7eb;
    --muted: #94a3b8;
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
  background: linear-gradient(135deg, var(--primary), #f87171);
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

const Toolbar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  background: var(--bg2);
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const FilterSelect = styled.select`
  background: rgba(0,0,0,0.2);
  color: var(--text);
  border: 1px solid var(--border);
  padding: 10px 16px;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  min-width: 150px;

  option {
      background: var(--bg2);
      color: var(--text);
  }
`;

const ActionBtn = styled.button`
  background: ${props => props.$danger ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255,255,255,0.05)'};
  color: ${props => props.$danger ? '#ef4444' : 'var(--text)'};
  border: 1px solid ${props => props.$danger ? 'rgba(239, 68, 68, 0.4)' : 'var(--border)'};
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: ${props => props.$danger ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const TableWrapper = styled.div`
  background: var(--bg2);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
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
  user-select: none;
`;

const Tr = styled.tr`
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
  background: ${props => props.$selected ? 'rgba(99, 102, 241, 0.1)' : 'transparent'};
  
  &:hover {
    background: ${props => props.$selected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255,255,255,0.03)'};
  }
`;

const Td = styled.td`
  padding: 16px 24px;
  vertical-align: middle;
`;

const Checkbox = styled.div`
  cursor: pointer;
  display: flex;
  color: ${props => props.$checked ? 'var(--primary)' : 'var(--muted)'};
  &:hover { color: var(--text); }
`;

const ImageThumbnail = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #000;
  border: 1px solid var(--border);
  cursor: zoom-in;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const IdBadge = styled.span`
  background: rgba(255,255,255,0.08);
  padding: 4px 8px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 13px;
`;

const EmptyState = styled.div`
  padding: 60px;
  text-align: center;
  color: var(--muted);
`;

// Modal logic for image preview could be added, but simple for now
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: zoom-out;
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 90vh;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
`;

export default function SpoofingReports() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [previewImage, setPreviewImage] = useState(null);

  const HRbaseurl = process.env.REACT_APP_BACKEND_HR_BASE_URL;

  const fetchData = async () => {
    setLoading(true);
    try {
      const role = localStorage.getItem('role');
      const dept = localStorage.getItem('department');
      const params = { month: filterMonth, year: filterYear };

      if (role && role !== 'Admin' && dept) {
        params.department = dept;
      }

      const res = await axios.get(`${HRbaseurl}spoofing-reports/`, { params });
      setAttempts(res.data || []);
      setSelectedIds(new Set()); // Reset selection on fetch
    } catch (err) {
      console.error(err);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterMonth, filterYear]);

  // Handlers
  const handleSelectAll = () => {
    if (selectedIds.size === attempts.length && attempts.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(attempts.map(a => a.id)));
    }
  };

  const handleSelectOne = (id) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} records?`)) return;

    try {
      await axios.post(`${HRbaseurl}spoofing-reports/delete/`, {
        ids: Array.from(selectedIds)
      });
      toast.success("Deleted successfully");
      fetchData(); // Refresh
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete records");
    }
  };

  const fmtTime = (iso) => {
    if (!iso) return '-';
    return new Date(iso).toLocaleString();
  };

  const months = [
    { v: 1, l: 'January' }, { v: 2, l: 'February' }, { v: 3, l: 'March' },
    { v: 4, l: 'April' }, { v: 5, l: 'May' }, { v: 6, l: 'June' },
    { v: 7, l: 'July' }, { v: 8, l: 'August' }, { v: 9, l: 'September' },
    { v: 10, l: 'October' }, { v: 11, l: 'November' }, { v: 12, l: 'December' }
  ];

  return (
    <>
      <GlobalStyle />
      <ToastContainer position="top-right" theme="dark" />

      {previewImage && (
        <ModalOverlay onClick={() => setPreviewImage(null)}>
          <ModalImage src={previewImage} onClick={e => e.stopPropagation()} />
        </ModalOverlay>
      )}

      <Page>
        <Container>
          <Header>
            <TitleBlock>
              <Title>
                <AlertTriangle size={32} />
                Spoofing Attempts
              </Title>
              <Subtitle>Review and manage detected security incidents</Subtitle>
            </TitleBlock>
          </Header>

          <Toolbar>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginRight: 'auto' }}>
              <Calendar size={18} color="var(--muted)" />
              <FilterSelect value={filterMonth} onChange={e => setFilterMonth(Number(e.target.value))}>
                {months.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
              </FilterSelect>
              <FilterSelect value={filterYear} onChange={e => setFilterYear(Number(e.target.value))}>
                {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </FilterSelect>
              <ActionBtn onClick={fetchData} disabled={loading}>
                <RefreshCw size={16} className={loading ? 'spin' : ''} />
                Refresh
              </ActionBtn>
            </div>

            {/* Actions */}
            <ActionBtn
              $danger
              disabled={selectedIds.size === 0}
              onClick={handleDelete}
            >
              <Trash2 size={16} />
              Delete {selectedIds.size > 0 ? `(${selectedIds.size})` : ''}
            </ActionBtn>
          </Toolbar>

          <TableWrapper>
            <Table>
              <thead>
                <tr>
                  <Th style={{ width: 40 }}>
                    <Checkbox onClick={handleSelectAll} $checked={selectedIds.size === attempts.length && attempts.length > 0}>
                      {selectedIds.size === attempts.length && attempts.length > 0 ? <CheckSquare size={20} /> : <Square size={20} />}
                    </Checkbox>
                  </Th>
                  <Th>Evidence</Th>
                  <Th>Date & Time</Th>
                  <Th>Claimed ID</Th>
                  <Th>Device Info</Th>
                </tr>
              </thead>
              <tbody>
                {attempts.length === 0 ? (
                  <tr>
                    <td colSpan="5">
                      <EmptyState>No records found for this period.</EmptyState>
                    </td>
                  </tr>
                ) : (
                  attempts.map(item => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                      <Tr key={item.id} $selected={isSelected}>
                        <Td>
                          <Checkbox onClick={() => handleSelectOne(item.id)} $checked={isSelected}>
                            {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                          </Checkbox>
                        </Td>
                        <Td>
                          <ImageThumbnail onClick={() => setPreviewImage(item.image)}>
                            <img src={item.image} alt="proof" loading="lazy" />
                          </ImageThumbnail>
                        </Td>
                        <Td style={{ fontWeight: 500 }}>
                          {fmtTime(item.timestamp)}
                        </Td>
                        <Td>
                          <IdBadge>{item.employee_id || 'Unknown'}</IdBadge>
                        </Td>
                        <Td style={{ color: 'var(--muted)', fontSize: 13 }}>
                          {item.device_id || 'N/A'}
                        </Td>
                      </Tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </TableWrapper>

        </Container>
      </Page>
    </>
  );
}
