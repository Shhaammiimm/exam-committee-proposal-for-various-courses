import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { summaryApi, proposalsApi } from '../api/service';
import { useAuth } from '../context/AuthContext';
import { useProposal } from '../context/ProposalContext';

function FinalSummary() {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const { user } = useAuth();
  const { currentProposalId } = useProposal();
  const proposalId = paramId || currentProposalId;
  const [data, setData] = useState(null);
  const [proposal, setProposal] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [signature, setSignature] = useState('');
  const [approving, setApproving] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      setError('');
      try {
        if (proposalId) {
          const { data: p } = await proposalsApi.get(proposalId);
          setProposal(p);
          setData({
            exam: p.exam || {},
            course: p.course || {},
            committee: p.committee || {},
            examRelated: p.examRelated || [],
            external: p.external || {},
            signatures: p.signatures || {}
          });
        } else {
          const { data: res } = await summaryApi.get();
          setData(res);
        }
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [proposalId]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => setSignature(reader.result);
    reader.readAsDataURL(file);
  };

  const handleApprove = async () => {
    if (!proposalId || !user) return;
    const role = user.designation;
    const canApprove =
      (role === 'chairman' && proposal?.status === 'draft') ||
      (role === 'dean' && proposal?.status === 'pending_dean') ||
      (role === 'vc' && proposal?.status === 'pending_vc') ||
      (role === 'controller' && proposal?.status === 'pending_controller');
    if (!canApprove) return;
    setApproving(true);
    try {
      await proposalsApi.sign(proposalId, signature || undefined);
      const { data: p } = await proposalsApi.get(proposalId);
      setProposal(p);
      setSignature('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (role === 'chairman') navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Approve failed');
    } finally {
      setApproving(false);
    }
  };

  const handleCancel = async () => {
    if (!proposalId || !user || !['dean', 'vc', 'controller'].includes(user.designation)) return;
    if (!window.confirm('Reject this proposal? It will move to Chairman\'s cancelled list.')) return;
    setCancelling(true);
    try {
      await proposalsApi.cancel(proposalId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject');
    } finally {
      setCancelling(false);
    }
  };

  const handleExit = () => {
    if (window.confirm('Are you sure you want to exit?')) {
      window.location.href = '/';
    }
  };

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

  if (loading) {
    return (
      <div className="form-card">
        <p style={{ textAlign: 'center', padding: '2rem' }}>Loading proposal...</p>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="form-card">
        <div className="alert alert-error">{error}</div>
        <div className="btn-group">
          <button className="btn btn-secondary" onClick={() => navigate(proposalId ? '/dashboard' : '/exam-related')}>Back</button>
        </div>
      </div>
    );
  }

  const exam = data?.exam || {};
  const course = data?.course || {};
  const committee = data?.committee || {};
  const examRelated = data?.examRelated || [];
  const external = data?.external || {};
  const signatures = data?.signatures || proposal?.signatures || {};

  const getExamRelated = (idx) => examRelated[idx] || '';

  const role = user?.designation;
  const canApprove =
    proposalId &&
    ((role === 'chairman' && proposal?.status === 'draft') ||
      (role === 'dean' && proposal?.status === 'pending_dean') ||
      (role === 'vc' && proposal?.status === 'pending_vc') ||
      (role === 'controller' && proposal?.status === 'pending_controller'));
  const canCancel = proposalId && ['dean', 'vc', 'controller'].includes(role) && proposal?.status === (role === 'dean' ? 'pending_dean' : role === 'vc' ? 'pending_vc' : 'pending_controller');
  const currentSignature = signature || (role === 'chairman' && signatures.chairman) || (role === 'dean' && signatures.dean) || (role === 'vc' && signatures.vc) || (role === 'controller' && signatures.controller) || '';

  return (
    <div className="form-card proposal-form">
      <div className="step-indicator">
        <div className="step-dot active" />
        <div className="step-dot active" />
        <div className="step-dot active" />
        <div className="step-dot active" />
        <div className="step-dot active" />
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="proposal-header">
        <h2 className="proposal-university">Hajee Mohammad Danesh Science and Technology University, Dinajpur</h2>
        <div className="proposal-meta">
          <span>Date: {today}</span>
          <span>Memo No.: _______________</span>
        </div>
        <h1 className="proposal-title">Proposal for Examination of Various Courses</h1>
      </div>

      <div className="proposal-body">
        <div className="proposal-row">
          <label>Department Name:</label>
          <span className="proposal-value">{exam.degree || '_______________'}</span>
        </div>
        <div className="proposal-row">
          <label>Level:</label>
          <span className="proposal-value">{exam.level || '_______________'}</span>
          <label style={{ marginLeft: '2rem' }}>Semester:</label>
          <span className="proposal-value">{exam.semester || '_______________'}</span>
        </div>
        <div className="proposal-row">
          <label>Course Title:</label>
          <span className="proposal-value">{course.courseTitle || course.name || '_______________'}</span>
        </div>
        <div className="proposal-row">
          <label>Exam Name:</label>
          <span className="proposal-value">_______________</span>
        </div>
        <div className="proposal-row">
          <label>Exam Type:</label>
          <span className="proposal-value">
            Theoretical ({course.courseCode || '___'} {course.credit || '___'} Credit) / Practical ({course.courseCode || '___'} {course.credit || '___'} Credits)
          </span>
        </div>

        <section className="proposal-section">
          <h3>(1) Exam Committee</h3>
          <div className="proposal-row">
            <label>1. Chairman,</label>
            <span className="proposal-value">{committee.chairman || '_______________'}</span>
            <label>Designation:</label>
            <span className="proposal-value">{committee.chairmanDesignation || '_______________'}</span>
          </div>
          <div className="proposal-row">
            <label>2. Member,</label>
            <span className="proposal-value">{committee.member1 || '_______________'}</span>
            <label>Designation:</label>
            <span className="proposal-value">{committee.member1Designation || '_______________'}</span>
          </div>
          <div className="proposal-row">
            <label>3. Member,</label>
            <span className="proposal-value">{committee.member2 || '_______________'}</span>
            <label>Designation:</label>
            <span className="proposal-value">{committee.member2Designation || '_______________'}</span>
          </div>
        </section>

        <section className="proposal-section">
          <h3>(2) Exam Related Topics</h3>
          <h4>a) Name of Question Setter and Course Teacher (Theoretical):</h4>
          <div className="proposal-row">
            <label>1. Dr./Mr.</label>
            <span className="proposal-value">{getExamRelated(0) || '_______________'}</span>
            <label>Designation:</label>
            <span className="proposal-value">{getExamRelated(1) || '_______________'}</span>
            <label>Department:</label>
            <span className="proposal-value">_______________</span>
            <label>University:</label>
            <span className="proposal-value">_______________</span>
          </div>
          <h4>Name of Internal Examiner (Theoretical/Practical):</h4>
          <div className="proposal-row">
            <label>1. Dr./Mr.</label>
            <span className="proposal-value">{getExamRelated(2) || '_______________'}</span>
            <label>Designation:</label>
            <span className="proposal-value">{getExamRelated(3) || '_______________'}</span>
          </div>
          <div className="proposal-row">
            <label>2. Dr./Mr.</label>
            <span className="proposal-value">{getExamRelated(4) || '_______________'}</span>
            <label>Designation:</label>
            <span className="proposal-value">{getExamRelated(5) || '_______________'}</span>
          </div>
          <h4>b) Name of Scrutinizer:</h4>
          <div className="proposal-row">
            <label>1. Dr./Mr.</label>
            <span className="proposal-value">{getExamRelated(6) || '_______________'}</span>
            <label>Designation:</label>
            <span className="proposal-value">{getExamRelated(7) || '_______________'}</span>
          </div>
          <h4>c) Panel of External Examiners:</h4>
          <div className="proposal-row">
            <label>1. Dr./Mr.</label>
            <span className="proposal-value">{external.name || '_______________'}</span>
            <label>Designation:</label>
            <span className="proposal-value">{external.designation || '_______________'}</span>
            <label>Department:</label>
            <span className="proposal-value">{external.dept || '_______________'}</span>
            <label>University:</label>
            <span className="proposal-value">{external.uni || '_______________'}</span>
          </div>
        </section>

        <section className="proposal-section approval-section">
          <p className="approval-text">This proposal has been sent in accordance with the decision of the Departmental Academic Committee meeting.</p>
          <div className="approval-block">
            {signatures.chairman ? <img src={signatures.chairman} alt="Chairman signature" style={{ maxWidth: '160px', maxHeight: '60px', objectFit: 'contain' }} /> : <span>(Signature and Seal of Departmental Chairman)</span>}
          </div>
          <p className="approval-text">Recommended.</p>
          <div className="approval-block">
            {signatures.dean ? <img src={signatures.dean} alt="Dean signature" style={{ maxWidth: '160px', maxHeight: '60px', objectFit: 'contain' }} /> : <span>Approved / Not Approved (Signature and Seal of Faculty Dean)</span>}
          </div>
          <div className="approval-block">
            {signatures.vc ? <img src={signatures.vc} alt="VC signature" style={{ maxWidth: '160px', maxHeight: '60px', objectFit: 'contain' }} /> : <span>(Signature of Honorable Vice-Chancellor)</span>}
          </div>
        </section>

        <section className="proposal-section exam-control-section">
          <h4>To be filled by the Examination Control Branch</h4>
          <div className="proposal-row">
            <label>Date:</label>
            <span className="proposal-value">{today}</span>
            <label>Memo No.-P.Sha-</label>
            <span className="proposal-value">_______________</span>
          </div>
          <p className="approval-text">The Honorable Departmental Chairman is requested to take necessary action regarding the internal examiner.</p>
          <div className="approval-block">
            {signatures.controller ? <img src={signatures.controller} alt="Controller signature" style={{ maxWidth: '160px', maxHeight: '60px', objectFit: 'contain' }} /> : <span>Controller of Examinations</span>}
          </div>
        </section>

        {canApprove && (
          <div className="signature-upload" style={{ marginTop: '1.5rem' }}>
            <label>Upload your signature (image)</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} />
            {currentSignature && <img src={currentSignature} alt="Your signature" />}
            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button type="button" className="btn-approve" onClick={handleApprove} disabled={approving}>
                {approving ? 'Sending...' : 'Approved'}
              </button>
              {canCancel && (
                <button type="button" className="btn btn-secondary" onClick={handleCancel} disabled={cancelling}>
                  {cancelling ? 'Rejecting...' : 'Reject (Not Approved)'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="btn-group" style={{ marginTop: '1.5rem' }}>
        {proposalId ? (
          <button className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        ) : (
          <button className="btn btn-secondary" onClick={() => navigate('/exam-related')}>Back</button>
        )}
        <button className="btn btn-secondary" onClick={handleExit}>Exit</button>
      </div>
    </div>
  );
}

export default FinalSummary;
