import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, GraduationCap, Mail, Phone, MapPin, DollarSign, Home } from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose }) => {
  const { addStudent } = useCollege();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [program, setProgram] = useState('B.Tech in Computer Science');
  const [semester, setSemester] = useState('Semester 1');
  const [year, setYear] = useState<number>(1);
  const [cgpa, setCgpa] = useState<number>(3.75);
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [address, setAddress] = useState('');
  const [hostelResident, setHostelResident] = useState(false);
  const [hostelRoom, setHostelRoom] = useState('');

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'School of Management',
    'Biotechnology & Life Sciences',
    'Civil & Infrastructure',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const deptCode = department.slice(0, 3).toUpperCase();
    const rollNo = `2024-${deptCode}-${Math.floor(100 + Math.random() * 900)}`;
    const avatar = `https://images.unsplash.com/photo-${
      Math.random() > 0.5 ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'
    }?w=150&auto=format&fit=crop&q=80`;

    addStudent({
      rollNo,
      name,
      email,
      phone: phone || '+1 (555) 000-1122',
      avatar,
      department,
      program,
      semester,
      year,
      cgpa,
      status: 'Active',
      guardianName: guardianName || 'Parent / Guardian',
      guardianPhone: guardianPhone || '+1 (555) 999-8877',
      address: address || 'Campus Residence, MA',
      hostelResident,
      hostelRoom: hostelResident ? hostelRoom || 'Block C - 204' : undefined,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Enroll New Student</h3>
                <p className="text-[11px] text-slate-300">
                  Generates student roll number and initializes fee demand ledger
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">University Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. jordan.m@apexuniv.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Academic Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Degree Program</label>
                <input
                  type="text"
                  placeholder="e.g. B.Tech Computer Science"
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Semester</label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Semester 1">Semester 1</option>
                  <option value="Semester 2">Semester 2</option>
                  <option value="Semester 3">Semester 3</option>
                  <option value="Semester 4">Semester 4</option>
                  <option value="Semester 5">Semester 5</option>
                  <option value="Semester 6">Semester 6</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Academic Year</label>
                <input
                  type="number"
                  min={1}
                  max={4}
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-semibold mb-1">Current CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min={0}
                  max={4.0}
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Hostel Residency */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="flex items-center gap-2 font-semibold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hostelResident}
                  onChange={(e) => setHostelResident(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Resident Hostel Student (Add Hostel & Mess dues to invoice)</span>
              </label>

              {hostelResident && (
                <div>
                  <label className="block text-slate-500 text-[11px] mb-1">Hostel Block & Room</label>
                  <input
                    type="text"
                    placeholder="e.g. Block B - Room 102"
                    value={hostelRoom}
                    onChange={(e) => setHostelRoom(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                Enroll Student & Generate Ledger
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
