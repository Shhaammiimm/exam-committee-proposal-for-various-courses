import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examRelatedApi, proposalsApi } from '../api/service';
import { useProposal } from '../context/ProposalContext';

function ExamRelatedTopics() {
  const navigate = useNavigate();
  const { currentProposalId } = useProposal();
  const [teachers, setTeachers] = useState([]);
  const [externalList, setExternalList] = useState([]);
  const [questionMaker, setQuestionMaker] = useState(null);
  const [internalTeacher1, setInternalTeacher1] = useState(null);
  const [internalTeacher2, setInternalTeacher2] = useState(null);
  const [scrutinizer, setScrutinizer] = useState(null);
  const [externalExaminer, setExternalExaminer] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setError('');
      setLoading(true);
      try {
        const { data } = await examRelatedApi.getData();
        setTeachers(data.teachers || []);
        setExternalList(data.external || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!questionMaker || !internalTeacher1 || !internalTeacher2 || !scrutinizer || !externalExaminer) {
      setError('Please select all required fields.');
      return;
    }

    setLoading(true);
    try {
      await examRelatedApi.save({
        questionMaker: questionMaker.name,
        questionMakerDesignation: questionMaker.designation,
        internalTeacher1: internalTeacher1.name,
        internalTeacher1Designation: internalTeacher1.designation,
        internalTeacher2: internalTeacher2.name,
        internalTeacher2Designation: internalTeacher2.designation,
        scrutinizer: scrutinizer.name,
        scrutinizerDesignation: scrutinizer.designation,
        externalName: externalExaminer.teacherName,
        externalDesignation: externalExaminer.designation,
        externalDepartment: externalExaminer.department,
        externalUniversity: externalExaminer.university,
      });
      const examRelatedList = [
        questionMaker.name, questionMaker.designation,
        internalTeacher1.name, internalTeacher1.designation,
        internalTeacher2.name, internalTeacher2.designation,
        scrutinizer.name, scrutinizer.designation
      ];
      if (currentProposalId) {
        await proposalsApi.update(currentProposalId, {
          examRelated: examRelatedList,
          external: {
            name: externalExaminer.teacherName,
            designation: externalExaminer.designation,
            dept: externalExaminer.department,
            uni: externalExaminer.university
          }
        });
      }
      navigate(currentProposalId ? `/summary/${currentProposalId}` : '/summary');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save.');
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
    </div>
  );

  return (
    <div className="form-card">
      <div className="step-indicator">
        <div className="step-dot active" />
        <div className="step-dot active" />
        <div className="step-dot active" />
        <div className="step-dot active" />
        <div className="step-dot" />
      </div>

      <h1 className="form-title">Exam Related Topics</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <TeacherRow label="Question Maker and Course Teacher (Theoretical)" teacher={questionMaker} setTeacher={setQuestionMaker} />
        <TeacherRow label="Internal Examiner 1 (Theoretical/Practical)" teacher={internalTeacher1} setTeacher={setInternalTeacher1} />
        <TeacherRow label="Internal Examiner 2 (Theoretical/Practical)" teacher={internalTeacher2} setTeacher={setInternalTeacher2} />
        <TeacherRow label="Scrutinizer (Committee member other than examiner)" teacher={scrutinizer} setTeacher={setScrutinizer} />

        <h3 style={{ marginTop: '1.5rem', marginBottom: '0.5rem', color: '#667eea' }}>
          Panel of External Examiners (Theoretical and/or Practical)
        </h3>
        <div className="form-group">
          <label>Select External Examiner</label>
          <select
            value={externalExaminer ? externalExaminer.teacherName : ''}
            onChange={(e) => {
              const ex = externalList.find((x) => x.teacherName === e.target.value);
              setExternalExaminer(ex || null);
            }}
            required
          >
            <option value="">Select External Examiner</option>
            {externalList.map((ex, i) => (
              <option key={i} value={ex.teacherName}>{ex.teacherName}</option>
            ))}
          </select>
          {externalExaminer && (
            <div className="form-row" style={{ marginTop: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.85rem', color: '#888' }}>Designation</label>
                <input type="text" value={externalExaminer.designation || ''} readOnly style={{ backgroundColor: '#888', cursor: 'default' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.85rem', color: '#888' }}>Department</label>
                <input type="text" value={externalExaminer.department || ''} readOnly style={{ backgroundColor: '#888', cursor: 'default' }} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label style={{ fontSize: '0.85rem', color: '#888' }}>University</label>
                <input type="text" value={externalExaminer.university || ''} readOnly style={{ backgroundColor: '#888', cursor: 'default' }} />
              </div>
            </div>
          )}
        </div>

        <div className="btn-group">
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/committee')}>
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

export default ExamRelatedTopics;
