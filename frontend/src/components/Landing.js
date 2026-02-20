import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const { user, loading } = useAuth();
  if (loading) return <div className="landing-page"><p>Loading...</p></div>;
  if (user) return <Navigate to="/dashboard" replace />;
  return (
    <div className="landing-page">
      <h1 className="landing-title">Exam Committee Proposal</h1>
      <p className="landing-subtitle">Hajee Mohammad Danesh Science and Technology University, Dinajpur</p>
      <div className="login-options">
        <Link to="/login/chairman" className="login-option">
          <h3>Chairman Login</h3>
          <p>Create and submit new applications</p>
        </Link>
        <Link to="/login/dean" className="login-option">
          <h3>Dean Login</h3>
          <p>Review and approve pending proposals</p>
        </Link>
        <Link to="/login/vc" className="login-option">
          <h3>VC Login</h3>
          <p>Review and approve pending proposals</p>
        </Link>
        <Link to="/login/controller" className="login-option">
          <h3>Controller Login</h3>
          <p>Final approval and processing</p>
        </Link>
      </div>
      <p style={{ marginTop: '2rem', color: '#666' }}>
        Don&apos;t have an account? <Link to="/signup" style={{ color: '#a855f7' }}>Sign up</Link>
      </p>
    </div>
  );
}

export default Landing;
