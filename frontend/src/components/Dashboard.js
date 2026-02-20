import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProposal } from "../context/ProposalContext";
import { proposalsApi } from "../api/service";
// axios is no longer needed; we use the shared service instance which already handles auth headers

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuth();
  const { setCurrentProposalId } = useProposal();
  const [newList, setNewList] = useState([]);
  const [cancelledList, setCancelledList] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await proposalsApi.list();
        const list = data.proposals || [];
        if (user?.designation === "chairman") {
          setNewList(list.filter((p) => p.status === "draft"));
          setCancelledList(list.filter((p) => p.status === "cancelled"));
        } else {
          setPendingList(list);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) load();
  }, [user]);

  const handleNewApplication = async () => {
    setCreating(true);
    try {
      const { data } = await proposalsApi.create();
      const id = data.proposal?.id;
      if (id) {
        setCurrentProposalId(id);
        navigate("/exam-details");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  const statusBadge = (status) => {
    if (status === "cancelled")
      return <span className="badge cancelled">Cancelled</span>;
    if (status === "approved")
      return <span className="badge approved">Approved</span>;
    return <span className="badge">{status}</span>;
  };

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString();
  };

  if (!user) {
    navigate("/");
    return null;
  }
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this draft?")) return;

    if (!token) {
      alert('You must be logged in to delete a draft.');
      return;
    }

    try {
      const { data } = await proposalsApi.delete(id);
      console.log('proposal delete response', data);
      // remove from the local list so UI updates immediately
      setNewList((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error('delete error', err);
      const message =
        err?.response?.data?.error || err.message || 'Delete failed';
      alert(message);
    }
  };


  if (user.designation === "chairman") {
    
    return (
      <div className="form-card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h1 className="form-title" style={{ marginBottom: 0 }}>
            Chairman Dashboard
          </h1>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>

        <div className="dashboard-section">
          <h2>New application</h2>
          <p style={{ color: "#888", marginBottom: "1rem" }}>
            Start a new exam committee proposal.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNewApplication}
            disabled={creating}
          >
            {creating ? "Creating..." : "New application"}
          </button>
          {newList.length > 0 && (
            <ul className="proposal-list" style={{ marginTop: "1rem" }}>
              {newList.map((p) => (
                <li
                  key={p._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div>
                    <Link to={`/summary/${p._id}`}>
                      Draft – {formatDate(p.updatedAt)}
                    </Link>
                    {statusBadge(p.status)}
                  </div>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => handleDelete(p._id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Cancelled application</h2>
          <p style={{ color: "#888", marginBottom: "1rem" }}>
            Applications not approved by Dean, VC, or Controller.
          </p>
          {cancelledList.length === 0 ? (
            <p style={{ color: "#666" }}>No cancelled applications.</p>
          ) : (
            <ul className="proposal-list">
              {cancelledList.map((p) => (
                <li key={p._id}>
                  <Link to={`/summary/${p._id}`}>
                    {p.course?.courseTitle || "Proposal"} –{" "}
                    {formatDate(p.updatedAt)}
                  </Link>
                  {statusBadge(p.status)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <h1 className="form-title" style={{ marginBottom: 0 }}>
          {user.designation.toUpperCase()} – Pending application
        </h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            logout();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      <div className="dashboard-section">
        <h2>Pending application</h2>
        {loading ? (
          <p>Loading...</p>
        ) : pendingList.length === 0 ? (
          <p style={{ color: "#666" }}>No pending proposals.</p>
        ) : (
          <ul className="proposal-list">
            {pendingList.map((p) => (
              <li key={p._id}>
                <Link to={`/summary/${p._id}`}>
                  {p.course?.courseTitle || p.exam?.degree || "Proposal"} –{" "}
                  {formatDate(p.updatedAt)}
                </Link>
                {statusBadge(p.status)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
