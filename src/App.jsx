import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Login from './pages/Login';
import AddJobForm from './components/AddJobForm';
import JobCard from './components/JobCard';
import JobFilters from './components/JobFilters';
import { mockJobs, stats as initialStats } from './data/mockData';
import './App.css';

const Dashboard = lazy(() => import('./components/Dashboard'));

function AppContent() {
  const { isDark, toggleDarkMode, colorScheme, changeColorScheme, colorSchemes } = useTheme();
  const [auth, setAuth] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState(initialStats);
  const [view, setView] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status:'all', company:'all', sortBy:'date_desc' });
  const [jobViewLayout, setJobViewLayout] = useState('grid');
  const [subscribeEmail, setSubscribeEmail] = useState('');

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth === 'true') setAuth(true);
    const storedJobs = localStorage.getItem('jobTracker');
    if (storedJobs) {
      const parsed = JSON.parse(storedJobs);
      setJobs(parsed);
      recalcStats(parsed);
    } else {
      setJobs(mockJobs);
      localStorage.setItem('jobTracker', JSON.stringify(mockJobs));
      recalcStats(mockJobs);
    }
  }, []);

  const recalcStats = (jobList) => {
    setStats({
      total: jobList.length, applied: jobList.filter(j=>j.status==='Applied').length,
      interviews: jobList.filter(j=>j.status==='Interview').length,
      offers: jobList.filter(j=>j.status==='Offer').length,
      approved: jobList.filter(j=>j.status==='Approved').length,
      hired: jobList.filter(j=>j.status==='Hired').length,
      reject: jobList.filter(j=>j.status==='Rejected').length,
      opportunities: jobList.filter(j=>j.status==='Saved').length,
    });
  };

  const addJob = (newJob) => {
    const updated = [newJob, ...jobs];
    setJobs(updated);
    localStorage.setItem('jobTracker', JSON.stringify(updated));
    recalcStats(updated);
  };
  const updateStatus = (id, newStatus) => {
    const updated = jobs.map(j=>j.id===id?{...j, status:newStatus}:j);
    setJobs(updated);
    localStorage.setItem('jobTracker', JSON.stringify(updated));
    recalcStats(updated);
    toast.success(`Status → ${newStatus}`);
  };
  const deleteJob = (id) => {
    const updated = jobs.filter(j=>j.id!==id);
    setJobs(updated);
    localStorage.setItem('jobTracker', JSON.stringify(updated));
    recalcStats(updated);
    toast.success('Deleted');
  };

  const handleLoginSuccess = () => { setView('dashboard'); };
  const handleLogout = () => { localStorage.removeItem('auth'); setAuth(false); setView('dashboard'); };
  const handleSubscribe = (e) => { e.preventDefault(); if(subscribeEmail) toast.success('Subscribed!'); else toast.error('Enter email'); setSubscribeEmail(''); };

  let filtered = jobs.filter(job => {
    const matchSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) || job.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filters.status==='all' || job.status===filters.status;
    const matchCompany = filters.company==='all' || job.company===filters.company;
    return matchSearch && matchStatus && matchCompany;
  });
  if (filters.sortBy === 'date_desc') filtered.sort((a,b)=>new Date(b.date)-new Date(a.date));
  if (filters.sortBy === 'date_asc') filtered.sort((a,b)=>new Date(a.date)-new Date(b.date));
  if (filters.sortBy === 'salary_desc') filtered.sort((a,b)=>b.monthlySalary - a.monthlySalary);
  if (filters.sortBy === 'salary_asc') filtered.sort((a,b)=>a.monthlySalary - b.monthlySalary);

  const companies = [...new Set(jobs.map(j=>j.company))].sort();
  const statuses = ['Saved','Applied','Interview','Offer','Approved','Rejected','Hired'];

  if (!auth) return <Login setAuth={setAuth} onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <Toaster position="top-right" />
      <nav className="navbar">
        <div className="nav-brand"><div className="logo-icon">🎯</div><div className="logo-text">JobTracker <span>Pro</span></div></div>
        <div className="nav-links">
          <button className={view==='dashboard'?'active':''} onClick={()=>setView('dashboard')}><span>📊</span> Dashboard</button>
          <button className={view==='jobs'?'active':''} onClick={()=>setView('jobs')}><span>💼</span> Jobs ({stats.total})</button>
        </div>
        <div className="nav-user">
          <select className="color-scheme-selector" value={colorScheme} onChange={e=>changeColorScheme(e.target.value)}>
            {Object.entries(colorSchemes).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
          </select>
          <button className="theme-toggle" onClick={toggleDarkMode}>{isDark ? '☀️' : '🌙'}</button>
          <div className="user-avatar"><span>👤</span></div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.main key={view} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-10 }} className="container">
          {view === 'dashboard' ? (<Suspense fallback={<div className="loader">Loading dashboard...</div>}><Dashboard stats={stats} jobs={jobs} /></Suspense>) : (
            <>
              <div className="jobs-controls"><AddJobForm onAdd={addJob} /><div className="search-filter"><input type="text" placeholder="🔍 Search..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="search-input"/><div className="layout-toggle"><button className={jobViewLayout==='grid'?'active':''} onClick={()=>setJobViewLayout('grid')}>📱 Grid</button><button className={jobViewLayout==='list'?'active':''} onClick={()=>setJobViewLayout('list')}>📋 List</button></div></div></div>
              <JobFilters filters={filters} setFilters={setFilters} companies={companies} statuses={statuses} />
              <div className="results-count">Showing {filtered.length} of {jobs.length} applications</div>
              <div className={`jobs-grid ${jobViewLayout==='list'?'list-view':''}`}>{filtered.map(job=><JobCard key={job.id} job={job} onStatusChange={updateStatus} onDelete={deleteJob} />)}</div>
              {filtered.length===0 && <div className="no-results">No jobs match your filters.</div>}
            </>
          )}
        </motion.main>
      </AnimatePresence>

      <footer className="new-footer">
        <div className="footer-content">
          <div className="footer-brand"><h2>🎯 JobTracker</h2><p>Track your job applications, deadlines, and progress in one beautiful dashboard.</p><div className="footer-checkmarks"><span>✅ Stay Organized</span><span>📈 Track Progress</span><span>⏰ Never Miss Deadlines</span></div></div>
          <div className="footer-links"><div className="link-group"><h4>Quick Links</h4><ul><li><a href="#" onClick={()=>setView('dashboard')}>Dashboard</a></li><li><a href="#" onClick={()=>setView('jobs')}>Add Job</a></li><li><a href="#" onClick={()=>setView('jobs')}>Applications</a></li></ul></div><div className="link-group"><h4>Resources</h4><ul><li><a href="#">Resume Tips</a></li><li><a href="#">Interview Tips</a></li><li><a href="#">Career Blog</a></li></ul></div></div>
          <div className="footer-subscribe"><h4>Stay Updated</h4><p>Subscribe to get tips and updates to boost your career.</p><form onSubmit={handleSubscribe} className="subscribe-form"><input type="email" placeholder="Enter your email" value={subscribeEmail} onChange={e=>setSubscribeEmail(e.target.value)} required /><button type="submit">Subscribe</button></form></div>
        </div>
        <div className="footer-bottom"><p>© 2026 JobTracker. All rights reserved.</p><p>Built with <a href="https://react.dev" target="_blank">React</a></p><div className="footer-legal"><a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a> | <a href="#">Sitemap</a></div></div>
      </footer>
    </div>
  );
}

export default function App() {
  return (<ThemeProvider><AppContent /></ThemeProvider>);
}
