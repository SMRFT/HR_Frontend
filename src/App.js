import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import './App.css';
import Login from './Components/Login';
import Register from './Components/Register';
import WebcamCapture from './Components/WebcamCapture';
import HRregister from './Components/HRregister';
import EmployeeHR from './Components/EmployeeHR';
import AttendanceReport from './Components/AttendanceReport';
import Faceencoding from './Components/Faceencoding';
import AudioUpload from './Components/AudioUpload';
import Fingerprontid from './Components/Deviceid';
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
  margin-left: ${props => props.$noSidebar ? '0' : '280px'};
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const ContentWrapper = styled.div`
  padding: ${props => props.$noSidebar ? '0' : '20px'};
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: ${props => props.$noSidebar ? '0' : '80px 15px 15px'};
  }
`;

// Protected Routes Component
function ProtectedLayout({ children }) {
  const location = useLocation();
  const noSidebar = location.pathname === '/';

  return (
    <AppLayout>
      <Sidebar />
      <MainContent $noSidebar={noSidebar}>
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
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes with Conditional Sidebar */}
        <Route path="/" element={
          <ProtectedLayout>
            <WebcamCapture />
          </ProtectedLayout>
        } />
        
        <Route path="/register" element={
          <ProtectedLayout>
            <Register />
          </ProtectedLayout>
        } />
        
        <Route path="/Hrregister" element={
          <ProtectedLayout>
            <HRregister />
          </ProtectedLayout>
        } />
                <Route path="/Finger" element={
          <ProtectedLayout>
            <Fingerprontid />
          </ProtectedLayout>
        } />
        <Route path="/HRAction" element={
          <ProtectedLayout>
            <EmployeeHR />
          </ProtectedLayout>
        } />
        
        <Route path="/AttendanceReport" element={
          <ProtectedLayout>
            <AttendanceReport />
          </ProtectedLayout>
        } />
        
        <Route path="/Faceencoding" element={
          <ProtectedLayout>
            <Faceencoding />
          </ProtectedLayout>
        } />
                <Route path="/AudioUpload" element={
          <ProtectedLayout>
            <AudioUpload />
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
