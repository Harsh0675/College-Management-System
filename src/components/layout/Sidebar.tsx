import React from 'react';
import {
  Building2,
  LayoutDashboard,
  UserPlus,
  Users,
  CreditCard,
  User,
  Receipt,
  BookOpen,
  Bell,
  GraduationCap,
  LogOut,
  Sparkles,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';
import { Role } from '../../types';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { currentRole, setRole, selectedStudent, notices } = useCollege();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Finance & Overview',
      icon: LayoutDashboard,
      roles: ['admin', 'student'],
      badge: null,
    },
    {
      id: 'registration',
      label: 'Student Registration',
      icon: UserPlus,
      roles: ['admin'],
      badge: 'Admissions',
    },
    {
      id: 'students',
      label: 'Student Directory',
      icon: Users,
      roles: ['admin'],
      badge: null,
    },
    {
      id: 'fee_desk',
      label: 'Fee Payment Desk',
      icon: CreditCard,
      roles: ['student', 'admin'],
      badge: 'Pay',
    },
    {
      id: 'profile',
      label: 'Student Profile & Bio',
      icon: User,
      roles: ['student', 'admin'],
      badge: null,
    },
    {
      id: 'ledger',
      label: 'Transaction Ledger',
      icon: Receipt,
      roles: ['admin', 'student'],
      badge: null,
    },
    {
      id: 'academics',
      label: 'Academics & Attendance',
      icon: BookOpen,
      roles: ['student', 'admin'],
      badge: null,
    },
    {
      id: 'notices',
      label: 'Campus Notices',
      icon: Bell,
      roles: ['student', 'admin'],
      badge: (notices || []).length > 0 ? (notices || []).length.toString() : null,
    },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="app-sidebar"
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Letterhead */}
        <div>
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-sm text-gray-900 tracking-tight leading-tight">
                  SIRT Bhopal
                </h1>
                <p className="text-[10px] text-gray-500 font-medium truncate max-w-[140px]">
                  Sagar Institute of Research & Tech
                </p>
              </div>
            </div>
          </div>

          {/* Role Switcher Pill */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/70">
            <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1.5 tracking-wider">
              Active Portal View:
            </label>
            <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-gray-200">
              <button
                type="button"
                id="btn-role-admin"
                onClick={() => setRole('admin')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                  currentRole === 'admin'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Shield className="w-3 h-3" />
                <span>Admin</span>
              </button>

              <button
                type="button"
                id="btn-role-student"
                onClick={() => setRole('student')}
                className={`py-1.5 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                  currentRole === 'student'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Current Profile Badge */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <img
              src={
                currentRole === 'student'
                  ? selectedStudent?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'
              }
              alt="Avatar"
              className="w-9 h-9 rounded-xl object-cover border border-gray-200"
            />
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-gray-900 block truncate">
                {currentRole === 'student' ? (selectedStudent?.name || 'Student') : 'Harsh Nagar'}
              </span>
              <span className="text-[10px] text-gray-500 block truncate">
                {currentRole === 'student' ? (selectedStudent?.rollNo || 'ID: Active') : 'System Admin • SIRT Dean Office'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
