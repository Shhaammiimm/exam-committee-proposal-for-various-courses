import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { courseApi, proposalsApi } from '../api/service';
import { useProposal } from '../context/ProposalContext';

function CourseSelection() {
  const navigate = useNavigate();
  const { currentProposalId } = useProposal();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      setError('');
      setLoading(true);
      try {
        const { data } = await courseApi.getCourses();
        setCourses(data.courses || []);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  const handleNext = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedCourse) {
      setError('Please select a course first.');
      return;
    }

    setLoading(true);
    try {
      await courseApi.save({
        courseName: selectedCourse.display,
        courseCode: selectedCourse.courseCode,
        courseTitle: selectedCourse.courseTitle,
        examType: selectedCourse.examType,
        credit: selectedCourse.credit
      });
      if (currentProposalId) {
        await proposalsApi.update(currentProposalId, {
          course: {
            name: selectedCourse.display,
            courseCode: selectedCourse.courseCode,
            courseTitle: selectedCourse.courseTitle,
            examType: selectedCourse.examType,
            credit: selectedCourse.credit
          }
        });
      }
      navigate('/committee');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save course selection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="step-indicator">
        <div className="step-dot active" />
        <div className="step-dot active" />
        <div className="step-dot" />
        <div className="step-dot" />
        <div className="step-dot" />
      </div>

      <h1 className="form-title">Course Details</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="form-group">
        <label>Select Course</label>
        <select
          value={selectedCourse ? selectedCourse.display : ''}
          onChange={(e) => {
            const val = e.target.value;
            const c = courses.find((x) => x.display === val);
            setSelectedCourse(c || null);
          }}
          disabled={!courses.length || loading}
        >
          <option value="">{courses.length ? 'Choose a course...' : loading ? 'Loading...' : 'No courses found'}</option>
          {courses.map((c, i) => (
            <option key={i} value={c.display}>{c.display}</option>
          ))}
        </select>
      </div>

      <div className="btn-group">
        <button type="button" className="btn btn-secondary" onClick={() => navigate(currentProposalId ? '/exam-details' : '/')}>
          Back
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!selectedCourse || loading}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

export default CourseSelection;
