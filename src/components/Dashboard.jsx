import React from 'react';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Target, CheckCircle, Award, DollarSign, Users, AlertCircle, BarChart3, Sparkles } from 'lucide-react';

const Dashboard = ({ stats, jobs }) => {
  const totalJobs = stats.total;
  const applied = stats.applied;
  const interviews = stats.interviews;
  const offers = stats.offers;
  const hired = stats.hired;
  const rejected = stats.reject;
  const approved = stats.approved;

  const interviewRate = applied ? ((interviews / applied) * 100).toFixed(1) : 0;
  const offerRate = interviews ? ((offers / interviews) * 100).toFixed(1) : 0;
  const hireRate = applied ? ((hired / applied) * 100).toFixed(1) : 0;

  const jobsWithSalary = jobs.filter(j => j.monthlySalary);
  const avgSalary = jobsWithSalary.length ? Math.round(jobsWithSalary.reduce((s,j)=>s+j.monthlySalary,0)/jobsWithSalary.length) : 0;
  const maxSalary = jobsWithSalary.length ? Math.max(...jobsWithSalary.map(j=>j.monthlySalary)) : 0;
  const minSalary = jobsWithSalary.length ? Math.min(...jobsWithSalary.map(j=>j.monthlySalary)) : 0;
  const totalOfferValue = offers * avgSalary * 12;

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const last6Months = months.slice(new Date().getMonth()-5, new Date().getMonth()+1);
  const monthlyData = last6Months.map((month, idx) => {
    const monthIndex = months.indexOf(month);
    return {
      month,
      applications: jobs.filter(j => new Date(j.date).getMonth() === monthIndex).length,
      interviews: jobs.filter(j => j.status === 'Interview' && new Date(j.date).getMonth() === monthIndex).length,
      hires: jobs.filter(j => j.status === 'Hired' && new Date(j.date).getMonth() === monthIndex).length,
    };
  });

  const statusData = [
    { name: 'Applied', value: applied, color: '#3b82f6' },
    { name: 'Interview', value: interviews, color: '#f59e0b' },
    { name: 'Offer', value: offers, color: '#10b981' },
    { name: 'Approved', value: approved, color: '#06b6d4' },
    { name: 'Hired', value: hired, color: '#22c55e' },
    { name: 'Rejected', value: rejected, color: '#ef4444' },
  ].filter(d=>d.value>0);

  const containerVariants = { hidden:{ opacity:0 }, visible:{ opacity:1, transition:{ staggerChildren:0.05 } } };
  const itemVariants = { hidden:{ y:20, opacity:0 }, visible:{ y:0, opacity:1 } };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="dashboard-enhanced">
      <motion.div variants={itemVariants} className="dashboard-welcome">
        <h1>📊 Analytics Dashboard</h1>
        <p>Comprehensive insights into your job search performance</p>
      </motion.div>

      <motion.div variants={itemVariants} className="kpi-primary">
        <div className="kpi-card"><div className="kpi-icon"><Target size={24}/></div><div className="kpi-content"><span className="kpi-value">{totalJobs.toLocaleString()}</span><span className="kpi-label">Total Applications</span></div></div>
        <div className="kpi-card"><div className="kpi-icon"><CheckCircle size={24}/></div><div className="kpi-content"><span className="kpi-value">{hireRate}%</span><span className="kpi-label">Hire Rate</span></div></div>
        <div className="kpi-card"><div className="kpi-icon"><Award size={24}/></div><div className="kpi-content"><span className="kpi-value">{offerRate}%</span><span className="kpi-label">Offer Rate</span></div></div>
        <div className="kpi-card"><div className="kpi-icon"><DollarSign size={24}/></div><div className="kpi-content"><span className="kpi-value">${avgSalary.toLocaleString()}</span><span className="kpi-label">Avg Salary (Monthly)</span></div></div>
      </motion.div>

      <motion.div variants={itemVariants} className="metrics-grid">
        <div className="metric-card"><div className="metric-header"><Users size={18}/><span>Conversion Rates</span></div><div className="metric-stats"><div className="metric-item"><span>Applied → Interview</span><strong>{interviewRate}%</strong></div><div className="metric-item"><span>Interview → Offer</span><strong>{offerRate}%</strong></div><div className="metric-item"><span>Offer → Hired</span><strong>{((hired/offers)*100 || 0).toFixed(1)}%</strong></div></div></div>
        <div className="metric-card"><div className="metric-header"><DollarSign size={18}/><span>Salary Insights</span></div><div className="metric-stats"><div className="metric-item"><span>Highest Offer</span><strong>${maxSalary.toLocaleString()}/mo</strong></div><div className="metric-item"><span>Lowest Offer</span><strong>${minSalary.toLocaleString()}/mo</strong></div><div className="metric-item"><span>Total Offer Value</span><strong>${(totalOfferValue/1000).toFixed(0)}k/yr</strong></div></div></div>
        <div className="metric-card"><div className="metric-header"><AlertCircle size={18}/><span>Status Breakdown</span></div><div className="metric-stats"><div className="metric-item"><span>Pending Review</span><strong>{stats.pending || 0}</strong></div><div className="metric-item"><span>Rejected</span><strong>{rejected}</strong></div><div className="metric-item"><span>Approved / Hired</span><strong>{(approved + hired)}</strong></div></div></div>
        <div className="metric-card"><div className="metric-header"><BarChart3 size={18}/><span>Efficiency</span></div><div className="metric-stats"><div className="metric-item"><span>Response Rate</span><strong>{(((interviews+offers+hired)/applied)*100).toFixed(1)}%</strong></div><div className="metric-item"><span>Interview Success</span><strong>{(((offers+hired)/interviews)*100 || 0).toFixed(1)}%</strong></div><div className="metric-item"><span>Avg per Month</span><strong>{(totalJobs/6).toFixed(0)}</strong></div></div></div>
      </motion.div>

      <motion.div variants={itemVariants} className="charts-section">
        <div className="chart-card-large"><h3>📈 6-Month Trend</h3><ResponsiveContainer width="100%" height={280}><LineChart data={monthlyData}><XAxis dataKey="month"/><YAxis/><Tooltip/><Legend/><Line type="monotone" dataKey="applications" stroke="#3b82f6" name="Applications"/><Line type="monotone" dataKey="interviews" stroke="#f59e0b" name="Interviews"/><Line type="monotone" dataKey="hires" stroke="#22c55e" name="Hires"/></LineChart></ResponsiveContainer></div>
        <div className="chart-card-small"><h3>📊 Status Distribution</h3><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={statusData} cx="50%" cy="50%" label={({name,percent})=>`${name}: ${(percent*100).toFixed(0)}%`} outerRadius={80} dataKey="value">{statusData.map((e,i)=><Cell key={i} fill={e.color}/>)}</Pie><Tooltip/><Legend/></PieChart></ResponsiveContainer></div>
      </motion.div>

      <motion.div variants={itemVariants} className="success-highlight"><Sparkles size={20}/><div><strong>{((hired/applied)*100).toFixed(1)}%</strong> of your applications resulted in a job offer or hire. {hireRate>10?"🎉 Excellent progress! Keep pushing.":"💪 Every application brings you closer."}</div></motion.div>
    </motion.div>
  );
};
export default Dashboard;
