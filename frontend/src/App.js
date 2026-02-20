import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProposalProvider } from './context/ProposalContext';
import PageLayout from './components/PageLayout';
import Landing from './components/Landing';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ExamDetails from './components/ExamDetails';
import CourseSelection from './components/CourseSelection';
import ExamCommittee from './components/ExamCommittee';
import ExamRelatedTopics from './components/ExamRelatedTopics';
import FinalSummary from './components/FinalSummary';

function ProtectedChairman({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="form-card"><p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p></div>;
  if (!user || user.designation !== 'chairman') return <Navigate to="/" replace />;
  return children;
}

function ProtectedAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="form-card"><p style={{ textAlign: 'center', padding: '2rem' }}>Loading...</p></div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login/:role?" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<ProtectedAuth><Dashboard /></ProtectedAuth>} />

        <Route path="/exam-details" element={<ProtectedChairman><PageLayout pageName="Exam Details"><ExamDetails /></PageLayout></ProtectedChairman>} />
        <Route path="/course" element={<ProtectedChairman><PageLayout pageName="Course Selection"><CourseSelection /></PageLayout></ProtectedChairman>} />
        <Route path="/committee" element={<ProtectedChairman><PageLayout pageName="Exam Committee"><ExamCommittee /></PageLayout></ProtectedChairman>} />
        <Route path="/exam-related" element={<ProtectedChairman><PageLayout pageName="Exam Related Topics"><ExamRelatedTopics /></PageLayout></ProtectedChairman>} />
        <Route path="/summary" element={<ProtectedAuth><PageLayout pageName="Proposal Summary"><FinalSummary /></PageLayout></ProtectedAuth>} />
        <Route path="/summary/:id" element={<ProtectedAuth><PageLayout pageName="Proposal Summary"><FinalSummary /></PageLayout></ProtectedAuth>} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ProposalProvider>
        <AppRoutes />
      </ProposalProvider>
    </AuthProvider>
  );
}

export default App;
