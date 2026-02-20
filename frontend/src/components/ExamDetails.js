import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examApi, proposalsApi } from '../api/service';
import { useProposal } from '../context/ProposalContext';

const DEGREES = ['CSE', 'ECE', 'EEE'];
const LEVELS = ['1', '2', '3', '4'];
const SEMESTERS = ['i', 'ii'];
const SESSIONS = ['2019', '2020', '2021', '2022', '2023'];

function ExamDetails() {
  const navigate = useNavigate();
  const { currentProposalId } = useProposal();
  const [degree, setDegree] = useState('');
  const [level, setLevel] = useState('');
  const [semester, setSemester] = useState('');
  const [session, setSession] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!degree || !level || !semester || !session) {
      setError('Please select all required fields.');
      return;
    }

    setLoading(true);
    try {
      await examApi.save({ degree, level, semester, session });
      if (currentProposalId) {
        await proposalsApi.update(currentProposalId, {
          exam: { degree, level, semester, year: session }
        });
      }
      navigate('/course');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save exam details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="step-indicator">
        <div className="step-dot active" />
        <div className="step-dot" />
        <div className="step-dot" />
        <div className="step-dot" />
        <div className="step-dot" />
      </div>

      <h1 className="form-title">Select Required Exam Details</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>DEGREE</label>
            <select value={degree} onChange={(e) => setDegree(e.target.value)} required>
              <option value="">Select Degree</option>
              {DEGREES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>LEVEL</label>
            <select value={level} onChange={(e) => setLevel(e.target.value)} required>
              <option value="">Select Level</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>SEMESTER</label>
            <select value={semester} onChange={(e) => setSemester(e.target.value)} required>
              <option value="">Select Semester</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>SESSION</label>
            <select value={session} onChange={(e) => setSession(e.target.value)} required>
              <option value="">Select Session</option>
              {SESSIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="btn-group">
          <button type="button" className="btn btn-secondary" onClick={() => navigate(currentProposalId ? '/dashboard' : '/')}>
            Back
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : 'Go'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExamDetails;
