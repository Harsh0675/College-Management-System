import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Search,
  User,
  GraduationCap,
  Shield,
  HelpCircle,
  ExternalLink,
  CheckCircle2,
  X,
  CreditCard,
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';

interface HeaderProps {
  onToggleSidebar: () => void;
  currentTab: string;
  onNavigateToTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onToggleSidebar,
  currentTab,
  onNavigateToTab,
}) => {
  const { currentRole, setRole, selectedStudent, students, setSelectedStudentId, notices } =
    useCollege();

  const [showNotifications, setShowNotifications] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  const tabTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Institutional Financial Overview',
      subtitle: 'Real-time billing, student collections, and fiscal balances',
    },
    registration: {
      title: 'Student Registration & Admission Desk',
      subtitle: 'Enroll incoming students and create initial fee invoices',
    },
    students: {
      title: 'Student Directory & Enrolled Scholars',
      subtitle: 'Full campus student database, programs, and dues ledger',
    },
    fee_desk: {
      title: 'Student Fee Payment Desk',
      subtitle: 'Itemized semester breakdown and simulated payment gateway',
    },
    profile: {
      title: 'Student Profile & Academic Information',
      subtitle: 'View and update personal details, guardian contact, and bio',
    },
    ledger: {
      title: 'Audit & Transaction Ledger',
      subtitle: 'Complete verified ledger of online and counter fee collections',
    },
    academics: {
      title: 'Academic Courses & Live Attendance',
      subtitle: 'Subject schedules, credit allocations, and attendance compliance',
    },
    notices: {
      title: 'Official Circulars & Notice Board',
      subtitle: 'Administrative announcements and semester deadlines',
    },
  };

  const currentInfo = tabTitles[currentTab] || {
    title: 'SIRT Bhopal ERP Portal',
    subtitle: 'Sagar Institute of Research & Technology, Bhopal',
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 px-5 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Trigger + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 lg:hidden cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-gray-900 truncate">
            {currentInfo.title}
          </h2>
          <p className="text-[11px] text-gray-400 hidden sm:block truncate">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Controls (Student Switcher, Notifications, View Profile) */}
      <div className="flex items-center gap-3">
        {/* Student Switcher for quick demo verification */}
        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 px-2.5 py-1.5 rounded-xl text-xs">
          <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
          <span className="text-[10px] text-gray-400 font-semibold uppercase">Active Student:</span>
          <select
            value={selectedStudent?.id || ''}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="bg-transparent font-bold text-gray-800 text-xs focus:outline-hidden cursor-pointer"
          >
            {(students || []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNo})
              </option>
            ))}
          </select>
        </div>

        {/* Notifications Icon & Dropdown */}
        <div className="relative">
          <button
            type="button"
            id="btn-header-notifications"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-500 hover:text-gray-900 rounded-xl hover:bg-gray-100 relative transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            {(notices || []).length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-xl p-4 space-y-3 z-50 text-xs animate-in fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="font-bold text-gray-900 text-xs">Notifications & Alerts</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {(notices || []).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      onNavigateToTab('notices');
                      setShowNotifications(false);
                    }}
                    className="p-2.5 bg-gray-50 hover:bg-indigo-50/50 rounded-xl transition-colors cursor-pointer space-y-1 border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 text-[11px] truncate">{n.title}</span>
                      <span className="text-[9px] text-gray-400">{n.date}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 line-clamp-2">{n.content}</p>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  onNavigateToTab('notices');
                  setShowNotifications(false);
                }}
                className="w-full py-1.5 text-center text-indigo-600 font-bold text-[11px] hover:underline block"
              >
                View all circulars
              </button>
            </div>
          )}
        </div>

        {/* Quick Profile Nav */}
        <button
          type="button"
          onClick={() => {
            if (currentRole === 'student') {
              onNavigateToTab('profile');
            } else {
              onNavigateToTab('dashboard');
            }
          }}
          className="flex items-center gap-2 p-1.5 pl-2 pr-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors cursor-pointer"
        >
          <img
            src={
              currentRole === 'student'
                ? selectedStudent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
            }
            alt={currentRole === 'student' ? (selectedStudent?.name || 'Student') : 'Harsh Nagar'}
            className="w-6 h-6 rounded-lg object-cover"
          />
          <span className="text-xs font-semibold text-gray-800 hidden sm:inline">
            {currentRole === 'student'
              ? (selectedStudent?.name ? selectedStudent.name.split(' ')[0] : 'Student')
              : 'Harsh Nagar'}
          </span>
          <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-bold uppercase hidden md:inline">
            {currentRole === 'student' ? 'Student' : 'Admin'}
          </span>
        </button>
      </div>
    </header>
  );
};
