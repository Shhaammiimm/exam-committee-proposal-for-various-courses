import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/service';

const DESIGNATIONS = [
  { value: 'chairman', label: 'Chairman' },
  { value: 'dean', label: 'Dean' },
  { value: 'vc', label: 'VC' },
  { value: 'controller', label: 'Controller' },
];

function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [designation, setDesignation] = useState('chairman');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.signup(name, email, password, designation);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card auth-card">
      <h1 className="form-title">Create Account</h1>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div className="form-group">
          <label>Password (min 6 characters)</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
        </div>
        <div className="form-group">
          <label>Designation</label>
          <select value={designation} onChange={(e) => setDesignation(e.target.value)} required>
            {DESIGNATIONS.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
        </div>
        <div className="btn-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Sign up'}
          </button>
        </div>
      </form>
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
          Back
        </button>
      </p>
    </div>
  );
}

export default Signup;
