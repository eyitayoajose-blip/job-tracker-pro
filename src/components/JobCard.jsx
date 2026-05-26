import React from 'react';
import { motion } from 'framer-motion';

const JobCard = React.memo(({ job, onStatusChange, onDelete }) => {
  const getColor = (status) => ({
    Saved:'#8b5cf6', Applied:'#3b82f6', Interview:'#f59e0b', Offer:'#10b981', Approved:'#06b6d4', Rejected:'#ef4444', Hired:'#22c55e'
  }[status] || '#6b7280');
  const statusIcons = { Saved:'💾', Applied:'📧', Interview:'🎤', Offer:'🎉', Approved:'✅', Rejected:'❌', Hired:'🏆' };

  return (
    <motion.div layout initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} whileHover={{ y:-5, scale:1.01 }} className="job-card-modern">
      <div className="job-card-glow" style={{ background: getColor(job.status) }} />
      <div className="job-card-inner">
        <div className="job-badge-modern" style={{ background: getColor(job.status) }}>{statusIcons[job.status]} {job.status}</div>
        <h3 className="job-company">{job.company}</h3>
        <p className="job-position">{job.position}</p>
        <div className="job-meta"><span className="job-salary">💰 {job.salary}</span>{job.interviewer && <span className="job-interviewer">👤 {job.interviewer}</span>}</div>
        <div className="job-deadline">📅 Deadline: {job.deadline || 'Not set'}</div>
        <p className="job-notes">📝 {job.notes}</p>
        <div className="job-actions">
          <select value={job.status} onChange={(e) => onStatusChange(job.id, e.target.value)} className="status-select">
            <option>Saved</option><option>Applied</option><option>Interview</option><option>Offer</option><option>Approved</option><option>Rejected</option><option>Hired</option>
          </select>
          <button onClick={() => onDelete(job.id)} className="delete-btn-modern">🗑 Delete</button>
        </div>
      </div>
    </motion.div>
  );
});
export default JobCard;
