import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import Login from './Components/Login';
import EmployeeRegistration from './Components/EmployeeRegistration';
import KioskAttendance from './Components/KioskAttendance';
import DeviceRegistration from './Components/DeviceRegistration';
import EmployeeManagement from './Components/EmployeeManagement';
import AttendanceReport from './Components/AttendanceReport';
import FaceEnrollment from './Components/FaceEnrollment';
import DeviceIdentifier from './Components/DeviceIdentifier';
import DailyAttendance from './Components/DailyAttendance';
import Sidebar from './Components/Sidebar';
import { useLocation } from 'react-router-dom';

// Layout with Sidebar
const AppLayout = styled.div`
  display: flex;
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: ${props => props.$noSidebar ? '0' : (props.$isCollapsed ? '80px' : '280px')};
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: 0;
  min-height: 100vh;
`;

// Protected Routes Component
function ProtectedLayout({ children }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const noSidebar = location.pathname === '/webcam';

  // Authentication check
  const token = localStorage.getItem("token") || localStorage.getItem("access_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <AppLayout>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <MainContent $noSidebar={noSidebar} $isCollapsed={isCollapsed}>
        <ContentWrapper $noSidebar={noSidebar}>
          {children}
        </ContentWrapper>
      </MainContent>
    </AppLayout>
  );
}

function App() {
  return (
    <Router basename="/HR">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes with Conditional Sidebar */}
        <Route path="/webcam" element={
          <ProtectedLayout>
            <KioskAttendance />
          </ProtectedLayout>
        } />

        <Route path="/register" element={
          <ProtectedLayout>
            <EmployeeRegistration />
          </ProtectedLayout>
        } />

        <Route path="/Hrregister" element={
          <ProtectedLayout>
            <DeviceRegistration />
          </ProtectedLayout>
        } />
        <Route path="/Finger" element={
          <ProtectedLayout>
            <DeviceIdentifier />
          </ProtectedLayout>
        } />
        <Route path="/HRAction" element={
          <ProtectedLayout>
            <EmployeeManagement />
          </ProtectedLayout>
        } />

        <Route path="/AttendanceReport" element={
          <ProtectedLayout>
            <AttendanceReport />
          </ProtectedLayout>
        } />

        <Route path="/daily-attendance" element={
          <ProtectedLayout>
            <DailyAttendance />
          </ProtectedLayout>
        } />

        <Route path="/Faceencoding" element={
          <ProtectedLayout>
            <FaceEnrollment />
          </ProtectedLayout>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <ProtectedLayout>
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>404</h1>
              <p style={{ color: 'var(--muted)' }}>Page Not Found</p>
            </div>
          </ProtectedLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;
