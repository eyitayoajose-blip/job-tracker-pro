import React from 'react';
import { motion } from 'framer-motion';

const JobFilters = ({ filters, setFilters, companies, statuses }) => {
  const handleChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  return (
    <motion.div initial={{ opacity:0, y:-10 }} animate={{ opacity:1, y:0 }} className="job-filters">
      <div className="filter-group"><label>Status</label><select value={filters.status} onChange={e=>handleChange('status', e.target.value)}><option value="all">All</option>{statuses.map(s=><option key={s} value={s}>{s}</option>)}</select></div>
      <div className="filter-group"><label>Company</label><select value={filters.company} onChange={e=>handleChange('company', e.target.value)}><option value="all">All</option>{companies.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
      <div className="filter-group"><label>Sort by</label><select value={filters.sortBy} onChange={e=>handleChange('sortBy', e.target.value)}><option value="date_desc">Newest</option><option value="date_asc">Oldest</option><option value="salary_desc">Salary ↓</option><option value="salary_asc">Salary ↑</option></select></div>
      <button className="clear-filters" onClick={()=>setFilters({ status:'all', company:'all', sortBy:'date_desc' })}>Clear filters</button>
    </motion.div>
  );
};
export default JobFilters;
