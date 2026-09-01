import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  UserCheck,
  Award,
  GraduationCap,
  Sparkles,
  CheckCircle,
  FileBadge,
} from 'lucide-react';
import { Student } from '../../types';
import { useCollege } from '../../context/CollegeContext';

interface AcademicsViewProps {
  student: Student;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({ student }) => {
  const { markAttendance } = useCollege();
  const [checkedInSubjectId, setCheckedInSubjectId] = useState<string | null>(null);

  const subjects = Array.isArray(student?.subjects) ? student.subjects : [];
  const totalClassesSum = subjects.reduce((acc, s) => acc + (s?.totalClasses || 0), 0);
  const attendedClassesSum = subjects.reduce((acc, s) => acc + (s?.attendedClasses || 0), 0);
  const overallAttendancePercent =
    totalClassesSum > 0 ? Math.round((attendedClassesSum / totalClassesSum) * 100) : 100;

  const totalCredits = subjects.reduce((acc, s) => acc + (s?.credits || 0), 0);

  const handleCheckIn = (subjectId: string) => {
    if (student?.id) {
      markAttendance(student.id, subjectId);
      setCheckedInSubjectId(subjectId);
      setTimeout(() => {
        setCheckedInSubjectId(null);
      }, 2000);
    }
  };

  return (
    <div id="academics-view" className="space-y-6">
      {/* Top Academic Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Cumulative GPA
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-slate-900">{student.cgpa}</span>
            <span className="text-xs text-slate-400">/ 4.0 Scale</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Top 5% in {student.department}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Overall Attendance
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-indigo-700">
              {overallAttendancePercent}%
            </span>
            <span className="text-xs text-slate-400">
              ({attendedClassesSum}/{totalClassesSum} sessions)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                overallAttendancePercent >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${overallAttendancePercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Current Semester Credits
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-slate-900">{totalCredits}</span>
            <span className="text-xs text-slate-400">Credit Units ({subjects.length} Courses)</span>
          </div>
          <p className="text-[11px] text-slate-500 font-medium mt-1">{student?.semester || 'Current Semester'}</p>
        </div>
      </div>

      {/* Course Subjects Table & Check-in */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Registered Courses & Live Attendance Ledger
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Minimum 75% attendance required for examination hall ticket eligibility.
            </p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {subjects.map((sub) => {
            const subAttendancePercent =
              sub.totalClasses > 0 ? Math.round((sub.attendedClasses / sub.totalClasses) * 100) : 100;
            const isEligible = subAttendancePercent >= 75;

            return (
              <div
                key={sub.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-xs font-bold">
                      {sub.code}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {sub.credits} Credits • Grade: {sub.grade || 'A'}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{sub.name}</h4>
                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span>Instructor: <strong className="text-slate-700">{sub.faculty}</strong></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {sub.schedule}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  {/* Attendance Stats */}
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span
                        className={`text-sm font-mono font-bold ${
                          isEligible ? 'text-emerald-700' : 'text-rose-600'
                        }`}
                      >
                        {subAttendancePercent}%
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({sub.attendedClasses}/{sub.totalClasses})
                      </span>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        isEligible ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isEligible ? 'Hall Ticket Eligible' : 'Shortage Alert'}
                    </span>
                  </div>

                  {/* Mark Attendance Interactive Button */}
                  <button
                    type="button"
                    onClick={() => handleCheckIn(sub.id)}
                    disabled={checkedInSubjectId === sub.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      checkedInSubjectId === sub.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {checkedInSubjectId === sub.id ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Present!</span>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                        <span>Check-in</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
