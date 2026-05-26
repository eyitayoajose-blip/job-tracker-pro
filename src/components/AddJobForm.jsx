import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Tag, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const AddJobForm = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ company:'', position:'', status:'Saved', deadline:'', notes:'' });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.company || !form.position) return toast.error('Fill company & position');
    const salary = Math.floor(Math.random()*3000+2000);
    onAdd({ ...form, id: Date.now(), date: new Date().toISOString().split('T')[0], monthlySalary: salary, salary: `$${salary}/month`, rating: Math.floor(Math.random()*5)+1 });
    setForm({ company:'', position:'', status:'Saved', deadline:'', notes:'' });
    setOpen(false);
    toast.success(`✨ Added ${form.position} at ${form.company}`);
  };
  return (
    <>
      <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }} className="add-job-glam" onClick={()=>setOpen(true)}><span>✨</span> Add New Opportunity</motion.button>
      <AnimatePresence>{open && (<div className="modal-overlay" onClick={()=>setOpen(false)}><motion.div initial={{ opacity:0, scale:0.9, y:20 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale:0.9, y:20 }} className="modal-glam" onClick={e=>e.stopPropagation()}>
        <div className="modal-header"><h2><span>🚀</span> Add New Job Application</h2><button className="modal-close" onClick={()=>setOpen(false)}><X size={20}/></button></div>
        <form onSubmit={handleSubmit}>
          <div className="form-row"><div className="form-group"><label><Briefcase size={16}/> Company</label><input placeholder="e.g., Google" value={form.company} onChange={e=>setForm({...form, company:e.target.value})} required/></div>
          <div className="form-group"><label><Tag size={16}/> Position</label><input placeholder="e.g., Software Engineer" value={form.position} onChange={e=>setForm({...form, position:e.target.value})} required/></div></div>
          <div className="form-row"><div className="form-group"><label>📌 Status</label><select value={form.status} onChange={e=>setForm({...form, status:e.target.value})}><option>Saved</option><option>Applied</option><option>Interview</option><option>Offer</option><option>Approved</option><option>Rejected</option><option>Hired</option></select></div>
          <div className="form-group"><label><Calendar size={16}/> Deadline</label><input type="date" value={form.deadline} onChange={e=>setForm({...form, deadline:e.target.value})} min={new Date().toISOString().split('T')[0]}/></div></div>
          <div className="form-group"><label><FileText size={16}/> Notes</label><textarea rows="3" placeholder="Add interview tips, contact info, etc." value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/></div>
          <div className="modal-actions"><button type="submit" className="btn-submit">✨ Save Application</button><button type="button" className="btn-cancel" onClick={()=>setOpen(false)}>Cancel</button></div>
        </form>
      </motion.div></div>)}</AnimatePresence>
    </>
  );
};
export default AddJobForm;
