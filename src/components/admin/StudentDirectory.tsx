import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Mail,
  Phone,
  GraduationCap,
  DollarSign,
  UserCheck,
  Building,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Edit,
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';
import { Student } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface StudentDirectoryProps {
  onOpenAddStudent: () => void;
  onSelectStudent: (student: Student) => void;
  onRecordPaymentForStudent: (student: Student) => void;
}

export const StudentDirectory: React.FC<StudentDirectoryProps> = ({
  onOpenAddStudent,
  onSelectStudent,
  onRecordPaymentForStudent,
}) => {
  const { students = [], invoices = [] } = useCollege();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const departments = [
    'All',
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'School of Management',
    'Biotechnology & Life Sciences',
  ];

  const safeStudents = Array.isArray(students) ? students : [];
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const filteredStudents = safeStudents.filter((s) => {
    const invoice = safeInvoices.find((inv) => inv.studentId === s.id);
    const feeStatus = invoice ? invoice.status : 'Pending';

    const matchesSearch =
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.rollNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.program || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = departmentFilter === 'All' || s.department === departmentFilter;
    const matchesStatus = statusFilter === 'All' || feeStatus === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <div id="student-directory-view" className="space-y-6">
      {/* Top Action Bar */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            Enrolled Students Directory & Profiles
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Access student profiles, view active balances, and initiate counter collections.
          </p>
        </div>

        <button
          type="button"
          id="btn-directory-register-student"
          onClick={onOpenAddStudent}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Registration</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, roll no, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 font-medium"
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 font-medium"
          >
            <option value="All">All Fee Statuses</option>
            <option value="Paid">Fully Paid</option>
            <option value="Partially Paid">Partially Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-semibold uppercase text-[10px] border-b border-gray-200">
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-4">Program & Dept</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">CGPA / Year</th>
                <th className="py-3 px-4">Fee Balance</th>
                <th className="py-3 px-4">Fee Status</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => {
                const invoice = invoices.find((inv) => inv.studentId === student.id);
                const balance = invoice ? invoice.balanceAmount : 0;
                const status = invoice ? invoice.status : 'Pending';

                return (
                  <tr key={student.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-9 h-9 rounded-xl object-cover border border-gray-200"
                        />
                        <div>
                          <span className="font-bold text-gray-900 block text-xs">
                            {student.name}
                          </span>
                          <span className="font-mono text-[11px] text-indigo-600 font-semibold">
                            {student.rollNo}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-gray-800 block truncate max-w-[200px]">
                        {student.program}
                      </span>
                      <span className="text-[10px] text-gray-400">{student.department}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-gray-600 block text-[11px]">{student.email}</span>
                      <span className="text-gray-400 text-[10px]">{student.phone}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-gray-900 block">
                        {student.cgpa} / 4.0
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {student.semester} (Yr {student.year})
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`font-mono font-bold text-xs ${
                          balance === 0 ? 'text-emerald-600' : 'text-gray-900'
                        }`}
                      >
                        ${formatCurrency(balance)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : status === 'Partially Paid'
                            ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            : status === 'Overdue'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onSelectStudent(student)}
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                          title="View Student Profile"
                        >
                          Profile
                        </button>
                        {balance > 0 && (
                          <button
                            type="button"
                            onClick={() => onRecordPaymentForStudent(student)}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                            title="Collect Fee"
                          >
                            Collect
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
