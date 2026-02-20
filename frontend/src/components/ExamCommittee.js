import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { committeeApi, proposalsApi } from '../api/service';
import { useProposal } from '../context/ProposalContext';

function ExamCommittee() {
  const navigate = useNavigate();
  const { currentProposalId } = useProposal();
  const [teachers, setTeachers] = useState([]);
  const [chairman, setChairman] = useState(null);
  const [member1, setMember1] = useState(null);
  const [member2, setMember2] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadTeachers = async () => {
      setError('');
      setLoading(true);
      try {
        const { data } = await committeeApi.getTeachers();
        setTeachers(data.teachers || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load teachers.');
      } finally {
        setLoading(false);
      }
    };
    loadTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!chairman || !member1 || !member2) {
      setError('Please select all committee members.');
      return;
    }

    setLoading(true);
    try {
      await committeeApi.save({
        chairman: chairman.name,
        chairmanDesignation: chairman.designation,
        member1: member1.name,
        member1Designation: member1.designation,
        member2: member2.name,
        member2Designation: member2.designation,
      });
      if (currentProposalId) {
        await proposalsApi.update(currentProposalId, {
          committee: {
            chairman: chairman.name,
            chairmanDesignation: chairman.designation,
            member1: member1.name,
            member1Designation: member1.designation,
            member2: member2.name,
            member2Designation: member2.designation,
          }
        });
      }
      navigate('/exam-related');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save exam committee.');
    } finally {
      setLoading(false);
    }
  };

  const TeacherRow = ({ label, teacher, setTeacher }) => (
    <div className="form-group">
      <label>{label}</label>
      <div className="form-row">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label style={{ fontSize: '0.85rem', color: '#888' }}>Teacher Name</label>
          <select
            value={teacher ? teacher.name : ''}
            onChange={(e) => {
              const t = teachers.find((x) => x.name === e.target.value);
              setTeacher(t || null);
            }}
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((t, i) => (
              <option key={i} value={t.name}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label style={{ fontSize: '0.85rem', color: '#888' }}>Designation</label>
          <input
            type="text"
            value={teacher ? teacher.designation : ''}
            readOnly
            placeholder="Auto-filled"
            style={{ backgroundColor: '#888', cursor: 'default' }}
          />
        </div>
      </div>
      {teacher && (teacher.department || teacher.university) && (
        <div className="form-row" style={{ marginTop: '0.5rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem', color: '#888' }}>Department</label>
            <input type="text" value={teacher.department || ''} readOnly style={{ backgroundColor: '#888', cursor: 'default' }} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label style={{ fontSize: '0.85rem', color: '#888' }}>University</label>
            <input type="text" value={teacher.university || ''} readOnly style={{ backgroundColor: '#888', cursor: 'default' }} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="form-card">
      <div className="step-indicator">
        <div className="step-dot active" />
        <div className="step-dot active" />
        <div className="step-dot active" />
        <div className="step-dot" />
        <div className="step-dot" />
      </div>

      <h1 className="form-title">Exam Committee</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <TeacherRow label="Chairman" teacher={chairman} setTeacher={setChairman} />
        <TeacherRow label="Member 1" teacher={member1} setTeacher={setMember1} />
        <TeacherRow label="Member 2" teacher={member2} setTeacher={setMember2} />

        <div className="btn-group">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/course')}>
            Back
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            Next Page
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExamCommittee;
