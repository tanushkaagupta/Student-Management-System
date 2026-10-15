import { useMemo, useState, type FormEvent } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Bell,
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  Clock3,
  GraduationCap,
  LayoutDashboard,
  Mail,
  Menu,
  MessageSquareText,
  Pencil,
  Phone,
  Plus,
  Search,
  Sparkles,
  Trash2,
  UserRound,
  UserRoundPlus,
  Users,
  X,
} from 'lucide-react';

type Page = 'overview' | 'students' | 'add' | 'assistant';
type SortKey = 'name' | 'studentId' | 'email' | 'dateOfBirth';

type Student = {
  studentId: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
};

type StudentForm = Omit<Student, 'createdAt' | 'updatedAt'>;

const initialStudents: Student[] = [
  { studentId: 'STU024', fullName: 'Priya Sharma', dateOfBirth: '2004-08-15', email: 'priya.sharma@example.com', phone: '+91 98765 43210', address: '14, Lotus Enclave, New Delhi', createdAt: '2026-01-08', updatedAt: '2026-01-08' },
  { studentId: 'STU023', fullName: 'Aarav Rajput', dateOfBirth: '2005-01-22', email: 'aarav.rajput@example.com', phone: '+91 98111 22334', address: '8 Park Avenue, Jaipur', createdAt: '2026-01-07', updatedAt: '2026-01-12' },
  { studentId: 'STU022', fullName: 'Sneha Kapoor', dateOfBirth: '2004-11-03', email: 'sneha.kapoor@example.com', phone: '+91 98220 45671', address: '23 Rose Garden Road, Mumbai', createdAt: '2026-01-05', updatedAt: '2026-01-10' },
  { studentId: 'STU021', fullName: 'Vikram Singh', dateOfBirth: '2005-06-18', email: 'vikram.singh@example.com', phone: '+91 98989 10021', address: '42 Green Park, Chandigarh', createdAt: '2026-01-02', updatedAt: '2026-01-09' },
  { studentId: 'STU020', fullName: 'Neha Agarwal', dateOfBirth: '2004-12-30', email: 'neha.agarwal@example.com', phone: '+91 97654 33421', address: '7 Lake View, Bengaluru', createdAt: '2025-12-28', updatedAt: '2026-01-04' },
  { studentId: 'STU019', fullName: 'Rohan Mehta', dateOfBirth: '2005-03-09', email: 'rohan.mehta@example.com', phone: '+91 99001 22114', address: '19 Sunrise Apartments, Pune', createdAt: '2025-12-22', updatedAt: '2026-01-03' },
  { studentId: 'STU018', fullName: 'Ananya Iyer', dateOfBirth: '2004-07-27', email: 'ananya.iyer@example.com', phone: '+91 98876 11990', address: '3 Palm Street, Chennai', createdAt: '2025-12-16', updatedAt: '2025-12-29' },
];

const emptyForm: StudentForm = { studentId: '', fullName: '', dateOfBirth: '', email: '', phone: '', address: '' };

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

function App() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [page, setPage] = useState<Page>('overview');
  const [search, setSearch] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [toast, setToast] = useState('');

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students
      .filter((student) => !query || [student.fullName, student.studentId, student.email, student.phone].some((field) => field.toLowerCase().includes(query)))
      .sort((a, b) => {
        const left = (sortKey === 'name' ? a.fullName : a[sortKey]).toLowerCase();
        const right = (sortKey === 'name' ? b.fullName : b[sortKey]).toLowerCase();
        return (left < right ? -1 : left > right ? 1 : 0) * (sortDirection === 'asc' ? 1 : -1);
      });
  }, [search, sortDirection, sortKey, students]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const navigate = (nextPage: Page) => {
    setPage(nextPage);
    setMobileOpen(false);
    setSearch('');
  };

  const openAdd = () => {
    setEditingStudent(null);
    setPage('add');
    setMobileOpen(false);
  };

  const openEdit = (student: Student) => {
    setSelectedStudent(null);
    setEditingStudent(student);
    setPage('add');
  };

  const handleSave = (form: StudentForm) => {
    const now = new Date().toISOString().slice(0, 10);
    if (editingStudent) {
      setStudents((current) => current.map((student) => student.studentId === editingStudent.studentId ? { ...student, ...form, updatedAt: now } : student));
      showToast('Student record updated successfully');
    } else {
      setStudents((current) => [{ ...form, createdAt: now, updatedAt: now }, ...current]);
      showToast('Student added successfully');
    }
    setEditingStudent(null);
    setPage('students');
  };

  const confirmDelete = () => {
    if (!deletingStudent) return;
    setStudents((current) => current.filter((student) => student.studentId !== deletingStudent.studentId));
    setDeletingStudent(null);
    setSelectedStudent(null);
    showToast('Student record deleted');
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDirection('asc'); }
  };

  return (
    <div className="app-shell">
      <Sidebar page={page} mobileOpen={mobileOpen} navigate={navigate} openAdd={openAdd} closeMobile={() => setMobileOpen(false)} />
      <main className="main-area">
        <header className="topbar">
          <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={21} /></button>
          <div className="global-search"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students by name, ID or email..." /></div>
          <div className="topbar-actions"><button className="icon-button notification" aria-label="Notifications"><Bell size={19} /><span /></button><div className="profile"><div className="profile-avatar">AD</div><span>Admin</span><ChevronDown size={15} /></div></div>
        </header>
        <div className="page-content">
          {page === 'overview' && <Overview students={students} navigate={navigate} openAdd={openAdd} viewStudent={setSelectedStudent} />}
          {page === 'students' && <StudentsPage students={filteredStudents} total={students.length} search={search} setSearch={setSearch} sortKey={sortKey} sortDirection={sortDirection} toggleSort={toggleSort} openAdd={openAdd} viewStudent={setSelectedStudent} editStudent={openEdit} deleteStudent={setDeletingStudent} />}
          {page === 'add' && <StudentFormPage student={editingStudent} students={students} onSave={handleSave} onCancel={() => navigate('students')} />}
          {page === 'assistant' && <Assistant students={students} />}
        </div>
      </main>
      {selectedStudent && <DetailsModal student={selectedStudent} close={() => setSelectedStudent(null)} edit={() => openEdit(selectedStudent)} />}
      {deletingStudent && <DeleteModal student={deletingStudent} cancel={() => setDeletingStudent(null)} confirm={confirmDelete} />}
      {toast && <div className="toast"><span className="toast-icon"><Check size={15} /></span>{toast}</div>}
    </div>
  );
}

function Sidebar({ page, mobileOpen, navigate, openAdd, closeMobile }: { page: Page; mobileOpen: boolean; navigate: (page: Page) => void; openAdd: () => void; closeMobile: () => void }) {
  return <>
    {mobileOpen && <button className="sidebar-backdrop" onClick={closeMobile} aria-label="Close menu" />}
    <aside className={`sidebar ${mobileOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><div className="brand-mark"><GraduationCap size={25} /></div><span>Student<span>Hub</span></span><button className="icon-button sidebar-close" onClick={closeMobile} aria-label="Close menu"><X size={18} /></button></div>
      <div className="menu-label">Workspace</div>
      <nav className="sidebar-nav">
        <button className={page === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('overview')}><LayoutDashboard size={19} />Overview</button>
        <button className={page === 'students' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('students')}><Users size={19} />Students</button>
        <button className={page === 'add' ? 'nav-item active' : 'nav-item'} onClick={openAdd}><CirclePlus size={19} />Add Student</button>
        <button className={page === 'assistant' ? 'nav-item active' : 'nav-item'} onClick={() => navigate('assistant')}><Sparkles size={19} />Student Assistant<span className="soon">Soon</span></button>
      </nav>
      <div className="sidebar-bottom"><div className="sidebar-illustration"><Sparkles size={25} /></div><strong>Better records.<br />Brighter futures.</strong><small>Student management made simple.</small></div>
    </aside>
  </>;
}

function PageHeading({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow || 'Workspace'}</div><h1>{title}</h1><p>{subtitle}</p></div>{action}</div>;
}

function Overview({ students, navigate, openAdd, viewStudent }: { students: Student[]; navigate: (page: Page) => void; openAdd: () => void; viewStudent: (student: Student) => void }) {
  const recent = students.slice(0, 5);
  return <>
    <PageHeading eyebrow="Overview" title="Student Overview" subtitle="Manage student records in one place." action={<button className="primary-button" onClick={openAdd}><Plus size={18} />Add Student</button>} />
    <section className="stats-grid">
      <StatCard icon={<Users />} tone="lavender" label="Total Students" value={students.length.toString().padStart(2, '0')} detail="2 more than last month" trend="+8.3%" />
      <StatCard icon={<UserRoundPlus />} tone="peach" label="Recently Added" value="03" detail="In the last 7 days" trend="+12.5%" />
      <StatCard icon={<Clock3 />} tone="mint" label="Recently Updated" value="05" detail="In the last 7 days" trend="+4.2%" />
    </section>
    <section className="panel recent-panel"><div className="section-heading"><div><h2>Recent Students</h2><p>Latest records added to your workspace</p></div><button className="text-button" onClick={() => navigate('students')}>View All <ArrowRight size={16} /></button></div><div className="recent-list">{recent.map((student) => <div className="recent-row" key={student.studentId}><Avatar name={student.fullName} /><div className="student-name"><strong>{student.fullName}</strong><span>{student.studentId}</span></div><span className="recent-email">{student.email}</span><span className="recent-date">{formatDate(student.dateOfBirth)}</span><button className="small-button" onClick={() => viewStudent(student)}>View</button></div>)}</div></section>
    <section className="quick-section"><div className="section-heading"><div><h2>Quick Actions</h2><p>Common tasks at a glance</p></div></div><div className="quick-grid"><QuickAction icon={<Users />} title="View All Students" detail="Browse and manage student records" onClick={() => navigate('students')} /><QuickAction icon={<CirclePlus />} title="Add New Student" detail="Create a new student record" onClick={openAdd} /><QuickAction icon={<Pencil />} title="Edit Student" detail="Update existing student details" onClick={() => navigate('students')} /><QuickAction icon={<Sparkles />} title="Student Assistant" detail="Ask questions about student records" onClick={() => navigate('assistant')} /></div></section>
  </>;
}

function StatCard({ icon, tone, label, value, detail, trend }: { icon: React.ReactNode; tone: string; label: string; value: string; detail: string; trend: string }) { return <div className="stat-card"><div className={`stat-icon ${tone}`}>{icon}</div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div><div className="trend"><ArrowUp size={13} />{trend}</div></div>; }
function QuickAction({ icon, title, detail, onClick }: { icon: React.ReactNode; title: string; detail: string; onClick: () => void }) { return <button className="quick-card" onClick={onClick}><span className="quick-icon">{icon}</span><strong>{title}</strong><span>{detail}</span><ArrowRight className="quick-arrow" size={17} /></button>; }
function Avatar({ name }: { name: string }) { return <div className={`avatar avatar-${(name.charCodeAt(0) % 4) + 1}`}>{initials(name)}</div>; }

function StudentsPage({ students, total, search, setSearch, sortKey, sortDirection, toggleSort, openAdd, viewStudent, editStudent, deleteStudent }: { students: Student[]; total: number; search: string; setSearch: (value: string) => void; sortKey: SortKey; sortDirection: 'asc' | 'desc'; toggleSort: (key: SortKey) => void; openAdd: () => void; viewStudent: (student: Student) => void; editStudent: (student: Student) => void; deleteStudent: (student: Student) => void }) {
  const sortIcon = (key: SortKey) => sortKey === key ? (sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />) : <ArrowUpDown size={14} />;
  return <><PageHeading eyebrow="Directory" title="Students" subtitle={`${total} student records in your workspace.`} action={<button className="primary-button" onClick={openAdd}><Plus size={18} />Add Student</button>} /><section className="panel table-panel"><div className="table-toolbar"><div className="table-title"><h2>All Students</h2><span>{students.length} results</span></div><div className="table-filter"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records..." /></div><button className="filter-button"><span>All students</span><ChevronDown size={15} /></button></div><div className="table-wrap"><table><thead><tr><th><button onClick={() => toggleSort('studentId')}>Student ID {sortIcon('studentId')}</button></th><th><button onClick={() => toggleSort('name')}>Full Name {sortIcon('name')}</button></th><th><button onClick={() => toggleSort('email')}>Email {sortIcon('email')}</button></th><th>Phone</th><th><button onClick={() => toggleSort('dateOfBirth')}>Date of Birth {sortIcon('dateOfBirth')}</button></th><th>Actions</th></tr></thead><tbody>{students.map((student) => <tr key={student.studentId}><td><span className="id-pill">{student.studentId}</span></td><td><div className="table-person"><Avatar name={student.fullName} /><strong>{student.fullName}</strong></div></td><td className="muted-cell">{student.email}</td><td className="muted-cell">{student.phone}</td><td className="muted-cell">{formatDate(student.dateOfBirth)}</td><td><div className="row-actions"><button title="View" onClick={() => viewStudent(student)}><ChevronRight size={17} /></button><button title="Edit" onClick={() => editStudent(student)}><Pencil size={16} /></button><button className="danger-action" title="Delete" onClick={() => deleteStudent(student)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table>{students.length === 0 && <div className="empty-state"><div><Search size={22} /></div><h3>No students found</h3><p>Try a different search or add a new student record.</p><button className="secondary-button" onClick={openAdd}>Add Student</button></div>}</div><div className="table-footer"><span>Showing {students.length ? 1 : 0}–{students.length} of {students.length} results</span><div><button disabled><ArrowLeft size={15} /></button><button className="current-page">1</button><button disabled><ArrowRight size={15} /></button></div></div></section></>;
}

function StudentFormPage({ student, students, onSave, onCancel }: { student: Student | null; students: Student[]; onSave: (form: StudentForm) => void; onCancel: () => void }) {
  const [form, setForm] = useState<StudentForm>(student ? { studentId: student.studentId, fullName: student.fullName, dateOfBirth: student.dateOfBirth, email: student.email, phone: student.phone, address: student.address } : { ...emptyForm, studentId: `STU${String(students.length + 1).padStart(3, '0')}` });
  const [errors, setErrors] = useState<Partial<Record<keyof StudentForm, string>>>({});
  const update = (key: keyof StudentForm, value: string) => { setForm((current) => ({ ...current, [key]: value })); setErrors((current) => ({ ...current, [key]: '' })); };
  const submit = (event: FormEvent) => { event.preventDefault(); const nextErrors: Partial<Record<keyof StudentForm, string>> = {}; if (!form.studentId.trim()) nextErrors.studentId = 'Student ID is required'; if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required'; if (!form.dateOfBirth) nextErrors.dateOfBirth = 'Date of birth is required'; if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) nextErrors.email = 'Enter a valid email address'; if (!form.phone.trim()) nextErrors.phone = 'Phone number is required'; setErrors(nextErrors); if (Object.keys(nextErrors).length === 0) onSave({ ...form, studentId: form.studentId.trim().toUpperCase() }); };
  return <><PageHeading eyebrow={student ? 'Edit record' : 'New record'} title={student ? 'Edit Student' : 'Add Student'} subtitle={student ? 'Update the details for this student record.' : 'Create a new student record for your college directory.'} /><form className="form-layout" onSubmit={submit}><section className="panel form-panel"><div className="form-section-title"><div className="form-heading-icon"><UserRoundPlus size={20} /></div><div><h2>Student information</h2><p>Enter the student’s basic details below.</p></div></div><div className="form-grid"><Field label="Student ID" required value={form.studentId} onChange={(value) => update('studentId', value)} error={errors.studentId} placeholder="e.g. STU025" /><Field label="Full Name" required value={form.fullName} onChange={(value) => update('fullName', value)} error={errors.fullName} placeholder="Enter full name" /><Field label="Date of Birth" required type="date" value={form.dateOfBirth} onChange={(value) => update('dateOfBirth', value)} error={errors.dateOfBirth} /><Field label="Email Address" required type="email" value={form.email} onChange={(value) => update('email', value)} error={errors.email} placeholder="student@example.com" /><Field label="Phone Number" required value={form.phone} onChange={(value) => update('phone', value)} error={errors.phone} placeholder="+91 98765 43210" /><Field label="Address" value={form.address} onChange={(value) => update('address', value)} placeholder="Optional address" wide /></div></section><div className="form-actions"><button type="button" className="secondary-button" onClick={onCancel}>Cancel</button><button type="submit" className="primary-button"><Check size={17} />{student ? 'Save Changes' : 'Save Student'}</button></div></form></>;
}

function Field({ label, required, type = 'text', value, onChange, error, placeholder, wide }: { label: string; required?: boolean; type?: string; value: string; onChange: (value: string) => void; error?: string; placeholder?: string; wide?: boolean }) { return <label className={`field ${wide ? 'field-wide' : ''}`}><span>{label}{required && <b> *</b>}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={error ? 'has-error' : ''} />{error && <em>{error}</em>}</label>; }

function DetailsModal({ student, close, edit }: { student: Student; close: () => void; edit: () => void }) { return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><section className="modal details-modal"><div className="modal-header"><div><div className="eyebrow">Student details</div><h2>{student.fullName}</h2></div><button className="icon-button" onClick={close} aria-label="Close"><X size={19} /></button></div><div className="details-profile"><Avatar name={student.fullName} /><div><strong>{student.fullName}</strong><span>{student.studentId}</span></div></div><div className="details-grid"><Detail icon={<CalendarDays />} label="Date of Birth" value={formatDate(student.dateOfBirth)} /><Detail icon={<Mail />} label="Email Address" value={student.email} /><Detail icon={<Phone />} label="Phone Number" value={student.phone} /><Detail icon={<BookOpen />} label="Address" value={student.address || 'No address provided'} /></div><div className="modal-actions"><button className="secondary-button" onClick={close}>Close</button><button className="primary-button" onClick={edit}><Pencil size={16} />Edit Student</button></div></section></div>; }
function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <div className="detail-item"><span className="detail-icon">{icon}</span><div><small>{label}</small><strong>{value}</strong></div></div>; }
function DeleteModal({ student, cancel, confirm }: { student: Student; cancel: () => void; confirm: () => void }) { return <div className="modal-backdrop"><section className="modal delete-modal"><div className="delete-icon"><Trash2 size={21} /></div><h2>Delete this record?</h2><p>Are you sure you want to delete <strong>{student.fullName}</strong>? This action only removes it from this frontend demo.</p><div className="modal-actions"><button className="secondary-button" onClick={cancel}>Cancel</button><button className="delete-button" onClick={confirm}>Delete Student</button></div></section></div>; }

function Assistant({ students }: { students: Student[] }) { const [question, setQuestion] = useState(''); const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]); const send = (value = question) => { if (!value.trim()) return; setMessages((current) => [...current, { role: 'user', text: value }, { role: 'assistant', text: 'This assistant is a preview. Once your FastAPI connection is ready, I can answer questions about your student records here.' }]); setQuestion(''); }; const suggestions = ['How many students are in the database?', 'Find students born after 2005.', 'Search for a student by name.']; return <><PageHeading eyebrow="Workspace tool" title="Student Assistant" subtitle="Ask questions about student records." /><section className="assistant-card"><div className="assistant-top"><div className="assistant-avatar"><Sparkles size={23} /></div><div><h2>How can I help?</h2><p>Get quick insights from your student directory.</p></div><span className="preview-badge">Preview</span></div><div className="chat-window">{messages.length === 0 ? <div className="chat-empty"><div className="empty-sparkle"><MessageSquareText size={24} /></div><h3>Your student assistant</h3><p>Choose a question below to see how this space will work.</p></div> : messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.text}-${index}`}><span>{message.role === 'assistant' ? <Sparkles size={14} /> : <UserRound size={14} />}</span><p>{message.text}</p></div>)}</div><div className="suggestions">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => send(suggestion)}>{suggestion}<ArrowRight size={14} /></button>)}</div><div className="assistant-input"><input value={question} onChange={(event) => setQuestion(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') send(); }} placeholder="Ask a question about your students..." /><button className="primary-button" onClick={() => send()}>Send <ArrowRight size={16} /></button></div><small className="assistant-note">This is a UI preview. No live records are sent anywhere.</small></section><div className="assistant-stats"><div><Users size={18} /><span><strong>{students.length}</strong> students ready for insights</span></div><div><Sparkles size={18} /><span>AI connection coming soon</span></div></div></>; }

export default App;
