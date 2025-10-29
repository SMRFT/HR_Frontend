import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import {
  LayoutDashboard,
  UserPlus,
  Users,
  FileText,
  Camera,
  Scan,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
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
  width: ${props => props.$isCollapsed ? '80px' : '280px'};
  background: var(--glass);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-right: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  padding: 24px 20px;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 80px;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  overflow: hidden;
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--primary-2));
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
`;

const LogoText = styled.div`
  opacity: ${props => props.$isCollapsed ? '0' : '1'};
  transition: opacity 0.2s ease;
  white-space: nowrap;
`;

const CompanyName = styled.h1`
  font-size: 18px;
  font-weight: 800;
  margin: 0;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
    color: var(--text);
    border-color: var(--primary);
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
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--muted);
  padding: 8px 16px;
  margin-bottom: 4px;
  opacity: ${props => props.$isCollapsed ? '0' : '1'};
  transition: opacity 0.2s ease;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  color: var(--muted);
  text-decoration: none;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
  margin-bottom: 4px;
  white-space: nowrap;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 3px;
    background: var(--primary);
    transform: scaleY(0);
    transition: transform 0.2s ease;
  }

  &:hover {
    background: rgba(255,255,255,0.08);
    color: var(--text);

    &::before {
      transform: scaleY(1);
    }
  }

  &.active {
    background: linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.15));
    color: var(--primary);
    font-weight: 600;

    &::before {
      transform: scaleY(1);
    }
  }

  svg {
    flex-shrink: 0;
  }
`;

const NavItemText = styled.span`
  opacity: ${props => props.$isCollapsed ? '0' : '1'};
  transition: opacity 0.2s ease;
  flex: 1;
`;

const SidebarFooter = styled.div`
  padding: 16px 12px;
  border-top: 1px solid var(--border);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.05);
  margin-bottom: 8px;
`;

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent), var(--primary));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
  flex: 1;
  overflow: hidden;
  opacity: ${props => props.$isCollapsed ? '0' : '1'};
  transition: opacity 0.2s ease;
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

  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: var(--danger);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }

  svg {
    flex-shrink: 0;
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
    section: 'Reports',
    items: [
      { path: '/AttendanceReport', icon: FileText, label: 'Attendance Report' },
    ]
  },
  {
    section: 'Management',
    items: [
      { path: '/register', icon: UserPlus, label: 'Register Employee' },
      { path: '/Hrregister', icon: UserPlus, label: 'HR Register' },
      { path: '/HRAction', icon: Users, label: 'Employee Management' },
      { path: '/Faceencoding', icon: Scan, label: 'Face Encoding' },
    ]
  }
];

// Main Sidebar Component
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Hide sidebar for Face Recognition page
  const shouldHideSidebar = location.pathname === '/';

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setIsMobileOpen(false);
  };

  // Don't render sidebar for Face Recognition page
  if (shouldHideSidebar) {
    return null;
  }

  return (
    <>
      <GlobalStyle />
      
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
        <SidebarHeader>
          <LogoSection>
            <LogoIcon>
              <LayoutDashboard size={22} color="white" />
            </LogoIcon>
            <LogoText $isCollapsed={isCollapsed}>
              <CompanyName>HR System</CompanyName>
              <CompanyTagline>Attendance & Management</CompanyTagline>
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
                  onClick={closeMobileMenu}
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
            {!isCollapsed && <span>Logout</span>}
          </LogoutButton>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
