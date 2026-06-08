import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import GlobalStyle from './styles/globalStyles';
import Login from './Components/Login';
import EmployeeRegistration from './Components/EmployeeRegistration';
import KioskAttendance from './Components/KioskAttendance';
import DeviceRegistration from './Components/DeviceRegistration';
import EmployeeManagement from './Components/EmployeeManagement';
import AttendanceReport from './Components/AttendanceReport';
import FaceEnrollment from './Components/FaceEnrollment';
import DeviceIdentifier from './Components/DeviceIdentifier';
import DailyAttendance from './Components/DailyAttendance';
import SpoofingReports from './Components/SpoofingReports';
import Sidebar from './Components/Sidebar';
import ShiftManagement from './Components/ShiftManagement';
import RosterReport from './Components/RosterReport';
import UserRegistration from './Components/UserRegistration';
import UserManagement from './Components/UserManagement';
import RosterAttendanceReport from './Components/RosterAttendanceReport';
import RegisteredDevices from './Components/RegisteredDevices';
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

// Protected Routes Component (Requires Login)
function ProtectedLayout({ children }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const noSidebar = location.pathname === '/webcam';

  // Authentication check
  const token = localStorage.getItem("access_token");

  if (!token) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
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

// Public Routes Component (Redirects to dashboard if already logged in)
function PublicRoute({ children }) {
  const token = localStorage.getItem("access_token");

  if (token) {
    // Redirect to dashboard if already authenticated
    const role = localStorage.getItem("role");
    return <Navigate to={role === "Admin" ? "/HRAction" : "/daily-attendance"} replace />;
  }

  return children;
}

function App() {
  React.useEffect(() => {
    // Clear session data to ensure the app always starts at the login page
    localStorage.clear();
  }, []);

  return (
    // In hr_frontend/src/App.js
    <Router>

      <GlobalStyle />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

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
        <Route path="/hraction" element={
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

        <Route path="/spoofing-attempts" element={
          <ProtectedLayout>
            <SpoofingReports />
          </ProtectedLayout>
        } />


        <Route path="/shifts" element={
          <ProtectedLayout>
            <ShiftManagement />
          </ProtectedLayout>
        } />

        <Route path="/roster-report" element={
          <ProtectedLayout>
            <RosterReport />
          </ProtectedLayout>
        } />

        <Route path="/user-register" element={
          <ProtectedLayout>
            <UserRegistration />
          </ProtectedLayout>
        } />

        <Route path="/roster-attendance-report" element={
          <ProtectedLayout>
            <RosterAttendanceReport />
          </ProtectedLayout>
        } />

        <Route path="/user-management" element={
          <ProtectedLayout>
            <UserManagement />
          </ProtectedLayout>
        } />

        <Route path="/registered-devices" element={
          <ProtectedLayout>
            <RegisteredDevices />
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
