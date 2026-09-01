import React, { useState } from 'react';
import {
  CreditCard,
  Receipt,
  BookOpen,
  Bell,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Home,
  CheckCircle2,
  AlertTriangle,
  User,
  Sparkles,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';
import { FeePaymentCard } from './FeePaymentCard';
import { ReceiptsHistoryView } from './ReceiptsHistoryView';
import { AcademicsView } from './AcademicsView';
import { NoticesView } from './NoticesView';
import { StudentProfileView } from './StudentProfileView';
import { formatCurrency } from '../../utils/formatters';

export const StudentDashboard: React.FC = () => {
  const {
    selectedStudent,
    selectedStudentInvoice,
    selectedStudentTransactions = [],
    notices = [],
    students = [],
    setSelectedStudentId,
  } = useCollege();

  const safeStudents = Array.isArray(students) ? students : [];

  const [activeTab, setActiveTab] = useState<'fees' | 'profile' | 'receipts' | 'academics' | 'notices'>('fees');

  const pendingAmount = selectedStudentInvoice?.balanceAmount ?? 0;
  const isPaid = selectedStudentInvoice?.status === 'Paid';

  return (
    <div id="student-portal-container" className="space-y-6">
      {/* Student Profile Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Avatar & Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={selectedStudent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={selectedStudent?.name || 'Student'}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-100 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  {selectedStudent?.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-200">
                  {selectedStudent?.rollNo}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  {selectedStudent?.status}
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                {selectedStudent?.program} • {selectedStudent?.semester} (Year {selectedStudent?.year})
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {selectedStudent?.email}
                </span>
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {selectedStudent?.department}
                </span>
                {selectedStudent?.hostelResident && (
                  <span className="flex items-center gap-1 text-indigo-600 font-medium">
                    <Home className="w-3.5 h-3.5" />
                    {selectedStudent?.hostelRoom}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Dues / Status Chip */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-right min-w-[140px]">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
                Current Dues
              </span>
              <span
                className={`text-lg font-mono font-extrabold block ${
                  isPaid ? 'text-emerald-600' : 'text-indigo-700'
                }`}
              >
                {isPaid ? '$0.00' : `$${formatCurrency(pendingAmount)}`}
              </span>
            </div>

            {/* Quick Student Switcher for Demo testing */}
            <div className="w-full sm:w-auto">
              <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Switch Demo Student:
              </label>
              <select
                value={selectedStudent?.id || ''}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full sm:w-48 text-xs font-semibold bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                {safeStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 bg-white px-4 rounded-xl border shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('fees')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 -mb-[2px] transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'fees'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Fee Payment Desk</span>
          {!isPaid && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold">
              Due
            </span>
          )}
        </button>

        <button
          type="button"
          id="tab-student-profile"
          onClick={() => setActiveTab('profile')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 -mb-[2px] transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Student Profile & Bio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('receipts')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 -mb-[2px] transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'receipts'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Receipts & History</span>
          <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px]">
            {selectedStudentTransactions.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('academics')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 -mb-[2px] transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'academics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Academics & Attendance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notices')}
          className={`py-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 -mb-[2px] transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'notices'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notice Board</span>
          <span className="px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px]">
            {notices.length}
          </span>
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'fees' && selectedStudentInvoice && (
        <div className="space-y-6">
          <FeePaymentCard invoice={selectedStudentInvoice} student={selectedStudent} />

          {/* Quick Help & FAQ Info Card */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <h4 className="font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Fee Payment Guidelines & Student Support
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-500 leading-relaxed text-[11px]">
              <li>
                Online fee payments are reconciled instantaneously with zero gateway surcharge.
              </li>
              <li>
                For employer tuition reimbursement or education loan claims, official receipts with
                QR verification can be printed directly from the{' '}
                <strong className="text-slate-700">Receipts & History</strong> tab.
              </li>
              <li>
                Scholarship concessions are awarded at the start of each semester based on CGPA and
                financial aid criteria. Contact{' '}
                <span className="font-mono text-indigo-600">finaid@apexuniv.edu</span> for
                inquiries.
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'profile' && <StudentProfileView student={selectedStudent} />}

      {activeTab === 'receipts' && (
        <ReceiptsHistoryView
          transactions={selectedStudentTransactions}
          student={selectedStudent}
        />
      )}

      {activeTab === 'academics' && <AcademicsView student={selectedStudent} />}

      {activeTab === 'notices' && <NoticesView notices={notices} />}
    </div>
  );
};
