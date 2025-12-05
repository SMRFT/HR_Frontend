import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import {
  LayoutGrid,
  UserPlus,
  Users,
  FileBarChart,
  ScanFace,
  MonitorSmartphone,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle
} from 'lucide-react';

// Global Styles
const GlobalStyle = createGlobalStyle`
  :root {
    --bg1: #0f172a;
    --bg2: #1e293b;
    --primary: #6366f1;
    --primary-2: #8b5cf6;
    --accent: #22d3ee;
    --success: #10b981;
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
  html, body, #root { height: 100%; }
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
`;

// Styled Components
const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: ${props => props.$isCollapsed ? '88px' : '280px'};
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.98) 100%);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  z-index: 1000;
  display: ${props => props.$hidden ? 'none' : 'flex'};
  flex-direction: column;
  overflow: hidden;

  @media (max-width: 768px) {
    width: ${props => props.$isOpen ? '280px' : '0'};
    transform: translateX(${props => props.$isOpen ? '0' : '-100%'});
    border-right: ${props => props.$isOpen ? '1px solid var(--border)' : 'none'};
  }
`;

const SidebarHeader = styled.div`
  padding: ${props => props.$isCollapsed ? '24px 0' : '24px 20px'};
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: ${props => props.$isCollapsed ? 'column' : 'row'};
  align-items: center;
  justify-content: ${props => props.$isCollapsed ? 'center' : 'space-between'};
  gap: ${props => props.$isCollapsed ? '16px' : '12px'};
  min-height: 80px;
  transition: all 0.3s ease;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.$isCollapsed ? '0' : '12px'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const LogoIcon = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const LogoText = styled.div`
  opacity: ${props => props.$isCollapsed ? '0' : '1'};
  width: ${props => props.$isCollapsed ? '0' : 'auto'};
  transition: all 0.2s ease;
  white-space: nowrap;
  overflow: hidden;

  @media (max-width: 768px) {
    opacity: 1;
    width: auto;
  }
`;

const CompanyName = styled.h1`
  font-size: 19px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

const CompanyTagline = styled.p`
  font-size: 11px;
  color: var(--muted);
  margin: 0;
  font-weight: 500;
`;

const CollapseButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: rgba(255,255,255,0.05);
  color: var(--muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition);
  flex-shrink: 0;

  &:hover {
    background: rgba(255,255,255,0.1);
    color: white;
    border-color: rgba(255,255,255,0.3);
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const Nav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255,255,255,0.2);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const NavSection = styled.div`
  margin-bottom: 24px;
`;

const NavSectionTitle = styled.div`
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #64748b;
  padding: 0 18px;
  margin: 24px 0 12px;
  opacity: ${props => props.$isCollapsed ? '0' : '1'};
  height: ${props => props.$isCollapsed ? '0' : 'auto'};
  overflow: hidden;
  transition: all 0.3s ease;
  white-space: nowrap;

  @media (max-width: 768px) {
    opacity: 1;
    height: auto;
  }
`;

const PortalTooltip = styled.div`
  position: fixed;
  z-index: 9999;
  background: #1e293b;
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255,255,255,0.1);
  transform: translateY(-50%);
  animation: tooltipFade 0.2s ease;

  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: transparent #1e293b transparent transparent;
  }

  @keyframes tooltipFade {
    from { opacity: 0; transform: translateY(-50%) translateX(-5px); }
    to { opacity: 1; transform: translateY(-50%) translateX(0); }
  }
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};
  gap: ${props => props.$isCollapsed ? '0' : '14px'};
  padding: ${props => props.$isCollapsed ? '14px 0' : '14px 18px'};
  margin: 4px 12px;
  border-radius: 12px;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  overflow: visible;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #f1f5f9;

    ${PortalTooltip} {
      opacity: 1;
      visibility: visible;
      transform: translateY(-50%) translateX(0);
    }
  }

  &.active {
    background: ${props => props.$isCollapsed ? 'transparent' : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))'};
    color: #818cf8;
    box-shadow: ${props => props.$isCollapsed ? 'none' : '0 0 0 1px rgba(99, 102, 241, 0.2)'};

    svg {
      filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
    }
  }
  svg {
    flex-shrink: 0;
  }
`;

const NavItemText = styled.span`
  opacity: ${props => props.$isCollapsed ? '0' : '1'};
  width: ${props => props.$isCollapsed ? '0' : 'auto'};
  overflow: hidden;
  transition: all 0.2s ease;
  flex: 1;
  white-space: nowrap;

  @media (max-width: 768px) {
    opacity: 1;
    width: auto;
  }
`;

const SidebarFooter = styled.div`
  padding: 16px 12px;
  border-top: 1px solid var(--border);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #f43f5e, #e11d48);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 15px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.3);
`;

const UserInfo = styled.div`
  flex: 1;
  overflow: hidden;
  opacity: ${props => props.$isCollapsed ? '0' : '1'};
  width: ${props => props.$isCollapsed ? '0' : 'auto'};
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    opacity: 1;
    width: auto;
  }
`;

const UserName = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: 12px;
  color: var(--muted);
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: ${props => props.$isCollapsed ? 'center' : 'flex-start'};
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: var(--transition);

  @media (max-width: 768px) {
    justify-content: flex-start;
  }

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: rgba(239, 68, 68, 0.4);
    color: #fca5a5;
    transform: translateY(-1px);
  }

  svg {
    flex-shrink: 0;
  }
`;

const LogoutText = styled.span`
  display: ${props => props.$isCollapsed ? 'none' : 'block'};
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileOverlay = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  opacity: ${props => props.$isOpen ? '1' : '0'};
  pointer-events: ${props => props.$isOpen ? 'all' : 'none'};
  transition: opacity 0.3s ease;

  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--glass);
  backdrop-filter: blur(20px);
  color: var(--text);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow);
  transition: var(--transition);

  &:hover {
    background: rgba(255,255,255,0.15);
    border-color: var(--primary);
  }

  @media (max-width: 768px) {
    display: ${props => props.$hidden ? 'none' : 'flex'};
  }
`;

// Menu Items Configuration
const menuItems = [

  {
    section: 'Employee Management',
    items: [
      { path: '/register', icon: UserPlus, label: 'Register Employee' },
      { path: '/HRAction', icon: Users, label: 'All Employees' },
      { path: '/Faceencoding', icon: ScanFace, label: 'Face Encoding' },
    ]
  },
  {
    section: 'Analytics',
    items: [
      { path: '/AttendanceReport', icon: FileBarChart, label: 'Attendance Report' },
    ]
  },
  {
    section: 'System',
    items: [
      { path: '/Hrregister', icon: MonitorSmartphone, label: 'Device Registration' },
    ]
  }
];

// Main Sidebar Component
const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide sidebar for Face Recognition page
  const shouldHideSidebar = location.pathname === '/webcam';

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  const handleMouseEnter = (e, label) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setActiveTooltip({
      label,
      top: rect.top + rect.height / 2,
      left: rect.right + 12
    });
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  // Don't render sidebar for Face Recognition page
  if (shouldHideSidebar) {
    return null;
  }

  return (
    <>
      <GlobalStyle />

      {activeTooltip && isCollapsed && createPortal(
        <PortalTooltip style={{ top: activeTooltip.top, left: activeTooltip.left }}>
          {activeTooltip.label}
        </PortalTooltip>,
        document.body
      )}

      <MobileMenuButton
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        $hidden={shouldHideSidebar}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </MobileMenuButton>

      <MobileOverlay $isOpen={isMobileOpen} onClick={closeMobileMenu} />

      <SidebarContainer
        $isCollapsed={isCollapsed}
        $isOpen={isMobileOpen}
        $hidden={shouldHideSidebar}
      >
        <SidebarHeader $isCollapsed={isCollapsed}>
          <LogoSection $isCollapsed={isCollapsed}>
            <LogoIcon>
              <LayoutGrid size={24} color="white" />
            </LogoIcon>
            <LogoText $isCollapsed={isCollapsed}>
              <CompanyName>HR Portal</CompanyName>
              <CompanyTagline>Admin Dashboard</CompanyTagline>
            </LogoText>
          </LogoSection>
          <CollapseButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </CollapseButton>
        </SidebarHeader>

        <Nav>
          {menuItems.map((section, idx) => (
            <NavSection key={idx}>
              <NavSectionTitle $isCollapsed={isCollapsed}>
                {section.section}
              </NavSectionTitle>
              {section.items.map((item, itemIdx) => (
                <NavItem
                  key={itemIdx}
                  to={item.path}
                  $isCollapsed={isCollapsed}
                  onClick={closeMobileMenu}
                  onMouseEnter={(e) => handleMouseEnter(e, item.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <item.icon size={20} />
                  <NavItemText $isCollapsed={isCollapsed}>
                    {item.label}
                  </NavItemText>
                </NavItem>
              ))}
            </NavSection>
          ))}
        </Nav>

        <SidebarFooter>
          <UserSection>
            <UserAvatar>
              HR
            </UserAvatar>
            <UserInfo $isCollapsed={isCollapsed}>
              <UserName>HR Admin</UserName>
              <UserRole>Administrator</UserRole>
            </UserInfo>
          </UserSection>

          <LogoutButton
            onClick={handleLogout}
            $isCollapsed={isCollapsed}
          >
            <LogOut size={20} />
            <LogoutText $isCollapsed={isCollapsed}>Logout</LogoutText>
          </LogoutButton>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
