const companies = [
  "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "Tesla", "Uber",
  "Airbnb", "Stripe", "Spotify", "Twitter", "LinkedIn", "Salesforce", "Adobe",
  "Oracle", "IBM", "Intel", "Cisco", "NVIDIA", "PayPal", "Shopify", "Slack",
  "Zoom", "Dropbox", "Square", "Pinterest", "Snap", "Atlassian", "GitHub"
];
const positions = [
  "Software Engineer", "Frontend Dev", "Backend Dev", "Full Stack Dev",
  "DevOps Engineer", "Data Scientist", "Product Manager", "UX Designer", "QA Engineer",
  "Security Engineer", "Cloud Architect", "Mobile Dev", "SRE"
];
const interviewers = [
  "Sarah Johnson", "Michael Chen", "Emily Rodriguez", "David Kim", "Lisa Wong",
  "James Wilson", "Maria Garcia", "Robert Brown", "Jennifer Lee", "Thomas Anderson"
];

const randomDate = (startYear = 2026, endYear = 2026) => {
  const year = startYear;
  const month = Math.floor(Math.random() * 12);
  const day = Math.floor(Math.random() * 28) + 1;
  return `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
};

const generateJob = (id, status, salaryMin = 2000, salaryMax = 5000) => {
  const monthlySalary = Math.floor(Math.random() * (salaryMax - salaryMin + 1) + salaryMin);
  const hasInterviewer = status === 'Interview' || status === 'Offer' || status === 'Hired';
  return {
    id,
    company: companies[Math.floor(Math.random() * companies.length)],
    position: positions[Math.floor(Math.random() * positions.length)],
    status,
    salary: `$${monthlySalary}/month`,
    monthlySalary,
    date: randomDate(),
    deadline: randomDate(2026, 2026),
    notes: `${status === 'Offer' ? '🎉 Offer received – negotiating' : status === 'Interview' ? '📅 Interview scheduled' : '📝 Application in progress'}. Follow up in 2 weeks.`,
    rating: Math.floor(Math.random() * 5) + 1,
    ...(hasInterviewer && { interviewer: interviewers[Math.floor(Math.random() * interviewers.length)] })
  };
};

let id = 1;
const jobs = [];

// 1450 Applied
for (let i = 0; i < 1450; i++) jobs.push(generateJob(id++, 'Applied', 2000, 4800));
// 198 Interviews
for (let i = 0; i < 198; i++) jobs.push(generateJob(id++, 'Interview', 2200, 5200));
// 45 Reject
for (let i = 0; i < 45; i++) jobs.push(generateJob(id++, 'Rejected', 1800, 4500));
// 78 Approved
for (let i = 0; i < 78; i++) jobs.push(generateJob(id++, 'Approved', 2800, 5500));
// 63 Hired
for (let i = 0; i < 63; i++) jobs.push(generateJob(id++, 'Hired', 3500, 6000));
// 50 Offers
for (let i = 0; i < 50; i++) jobs.push(generateJob(id++, 'Offer', 3000, 5800));
// 150 Saved (Opportunities)
for (let i = 0; i < 150; i++) jobs.push(generateJob(id++, 'Saved', 2000, 5000));

export const mockJobs = jobs;
export const stats = {
  applied: 1450,
  interviews: 198,
  reject: 45,
  approved: 78,
  hired: 63,
  offers: 50,
  opportunities: 150,
  total: jobs.length
};
