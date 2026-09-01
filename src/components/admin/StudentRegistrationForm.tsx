import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  UserPlus,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  DollarSign,
  Home,
  CheckCircle2,
  Sparkles,
  Award,
  Shield,
  Layers,
  Heart,
  RefreshCw,
  FileCheck,
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';
import { Student } from '../../types';

interface StudentRegistrationFormProps {
  onSuccess?: (newStudent: Student) => void;
}

export const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ onSuccess }) => {
  const { addStudent, students } = useCollege();

  const [isSuccess, setIsSuccess] = useState(false);
  const [lastEnrolledStudent, setLastEnrolledStudent] = useState<Student | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('2004-06-15');
  const [bloodGroup, setBloodGroup] = useState('O+ (Positive)');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');

  // Program of Study
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [program, setProgram] = useState('B.Tech in Artificial Intelligence & Robotics');
  const [semester, setSemester] = useState('Semester 1');
  const [year, setYear] = useState<number>(1);
  const [cgpa, setCgpa] = useState<number>(3.8);

  // Admission Details
  const [admissionDate, setAdmissionDate] = useState(new Date().toISOString().split('T')[0]);
  const [admissionQuota, setAdmissionQuota] = useState('Merit Scholarship Quota');
  const [entranceExam, setEntranceExam] = useState('National College Entrance Test (SAT/CET)');
  const [entranceScore, setEntranceScore] = useState('98.5th Percentile / 1520');
  const [previousInstitution, setPreviousInstitution] = useState('St. Jude High School & Academy');

  // Guardian Details
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelation, setGuardianRelation] = useState('Father');
  const [guardianPhone, setGuardianPhone] = useState('');

  // Hostel & Amenities
  const [hostelResident, setHostelResident] = useState(false);
  const [hostelRoom, setHostelRoom] = useState('Block C - Room 204');
  const [scholarshipConcession, setScholarshipConcession] = useState<number>(500);

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Mechanical Engineering',
    'School of Management',
    'Biotechnology & Life Sciences',
    'Civil & Infrastructure',
  ];

  const handlePreFillDemo = () => {
    const randomFirst = ['Jordan', 'Maya', 'Liam', 'Ananya', 'Ethan', 'Chloe', 'Lucas', 'Zoe'][
      Math.floor(Math.random() * 8)
    ];
    const randomLast = ['Miller', 'Patel', 'Vance', 'Kapoor', 'Washington', 'Kim', 'Sullivan'][
      Math.floor(Math.random() * 7)
    ];
    const fullName = `${randomFirst} ${randomLast}`;
    const emailPrefix = `${randomFirst.toLowerCase()}.${randomLast.toLowerCase()}`;

    setName(fullName);
    setEmail(`${emailPrefix}@apexuniv.edu`);
    setPhone('+1 (555) 392-' + Math.floor(1000 + Math.random() * 9000));
    setDateOfBirth('2004-03-22');
    setBloodGroup('A+ (Positive)');
    setEmergencyContact('+1 (555) 911-' + Math.floor(1000 + Math.random() * 9000));
    setAddress('742 Evergreen Terrace, Cambridge, MA 02138');
    setDepartment('Computer Science & Engineering');
    setProgram('B.Tech in Artificial Intelligence & Robotics');
    setSemester('Semester 1');
    setYear(1);
    setCgpa(3.85);
    setAdmissionDate(new Date().toISOString().split('T')[0]);
    setAdmissionQuota('Academic Merit Concession');
    setEntranceExam('SAT / Institutional Entrance Examination');
    setEntranceScore('99.1th Percentile (Rank #42)');
    setPreviousInstitution('Northwood Preparatory Academy');
    setGuardianName(`Dr. Marcus ${randomLast}`);
    setGuardianRelation('Father');
    setGuardianPhone('+1 (555) 482-' + Math.floor(1000 + Math.random() * 9000));
    setHostelResident(true);
    setHostelRoom(`Block B - Room ${Math.floor(100 + Math.random() * 300)}`);
    setScholarshipConcession(800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const deptCode = department.slice(0, 3).toUpperCase();
    const rollNo = `2024-${deptCode}-${Math.floor(100 + Math.random() * 900)}`;
    const avatar = `https://images.unsplash.com/photo-${
      Math.random() > 0.5 ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'
    }?w=150&auto=format&fit=crop&q=80`;

    const newStudentData = {
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
      status: 'Active' as const,
      dateOfBirth,
      bloodGroup,
      emergencyContact,
      address: address || 'Campus Residence, MA',
      admissionDate,
      admissionQuota,
      entranceExam,
      entranceScore,
      previousInstitution,
      guardianName: guardianName || 'Parent / Guardian',
      guardianRelation,
      guardianPhone: guardianPhone || '+1 (555) 999-8877',
      hostelResident,
      hostelRoom: hostelResident ? hostelRoom : undefined,
      bio: `Enrolled student in ${program} under ${department}. Admitted via ${admissionQuota}.`,
    };

    addStudent(newStudentData);

    const fullStudentObject: Student = {
      ...newStudentData,
      id: `std-${Date.now()}`,
      subjects: [],
    };

    setLastEnrolledStudent(fullStudentObject);
    setIsSuccess(true);
    if (onSuccess) {
      onSuccess(fullStudentObject);
    }
  };

  return (
    <div id="student-registration-module" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <UserPlus className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Student Registration & Admission Desk
            </h2>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Register new admissions, generate unique student roll numbers, configure program of
            study, and issue inaugural semester fee invoices instantly.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePreFillDemo}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-xl transition-colors border border-indigo-200 flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pre-fill Sample Data</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {isSuccess && lastEnrolledStudent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Student Registration Successful & Ledger Created!</span>
            </div>
            <button
              onClick={() => setIsSuccess(false)}
              className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
            >
              Dismiss
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-emerald-200 text-xs">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Student Name
              </span>
              <span className="font-bold text-gray-900">{lastEnrolledStudent.name}</span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Assigned Roll No
              </span>
              <span className="font-mono font-bold text-indigo-700">
                {lastEnrolledStudent.rollNo}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Program Enrolled
              </span>
              <span className="font-semibold text-gray-800 truncate block">
                {lastEnrolledStudent.program}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block text-[10px] uppercase font-semibold">
                Initial Fee Invoice
              </span>
              <span className="font-mono font-bold text-emerald-700">$3,800 Generated</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Personal & Contact Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              1. Student Identity & Contact Information
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">* Required Fields</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Full Legal Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Jordan Alex Miller"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">University Email *</label>
              <input
                type="email"
                required
                placeholder="e.g. jordan.m@apexuniv.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Primary Phone Number *</label>
              <input
                type="text"
                required
                placeholder="+1 (555) 234-5678"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              >
                <option>O+ (Positive)</option>
                <option>O- (Negative)</option>
                <option>A+ (Positive)</option>
                <option>A- (Negative)</option>
                <option>B+ (Positive)</option>
                <option>B- (Negative)</option>
                <option>AB+ (Positive)</option>
                <option>AB- (Negative)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Emergency Contact Number</label>
              <input
                type="text"
                placeholder="+1 (555) 911-0088"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-gray-600 font-semibold mb-1">Permanent Residential Address</label>
              <input
                type="text"
                placeholder="Street address, City, State, Postal Code"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Program of Study & Academic Enrollment */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              2. Program of Study & Departmental Placement
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="lg:col-span-2">
              <label className="block text-gray-600 font-semibold mb-1">Academic Department *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-gray-600 font-semibold mb-1">Degree Program & Major *</label>
              <input
                type="text"
                placeholder="e.g. B.Tech in Artificial Intelligence"
                value={program}
                onChange={(e) => setProgram(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Admission Semester</label>
              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 font-medium text-gray-900"
              >
                <option value="Semester 1">Semester 1 (Fall 2024)</option>
                <option value="Semester 2">Semester 2 (Spring 2025)</option>
                <option value="Semester 3">Semester 3 (Lateral Entry)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Academic Year</label>
              <input
                type="number"
                min={1}
                max={4}
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Starting CGPA / Score</label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={4.0}
                value={cgpa}
                onChange={(e) => setCgpa(Number(e.target.value))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Admission Details & Prior Academics */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              3. Admission Credentials & Verification Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-gray-600 font-semibold mb-1">Admission Date</label>
              <input
                type="date"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Admission Category / Quota</label>
              <select
                value={admissionQuota}
                onChange={(e) => setAdmissionQuota(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
              >
                <option>General Merit Quota</option>
                <option>Merit Scholarship Quota</option>
                <option>Sports & Athletic Excellence</option>
                <option>International / NRI Quota</option>
                <option>Government Sponsored Fellow</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Entrance Examination</label>
              <input
                type="text"
                placeholder="SAT / ACT / College Entrance Test"
                value={entranceExam}
                onChange={(e) => setEntranceExam(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
              />
            </div>

            <div>
              <label className="block text-gray-600 font-semibold mb-1">Entrance Exam Rank / Score</label>
              <input
                type="text"
                placeholder="e.g. 98.4 Percentile (Rank #110)"
                value={entranceScore}
                onChange={(e) => setEntranceScore(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-600 font-semibold mb-1">Previous Institution / High School</label>
              <input
                type="text"
                placeholder="e.g. Cambridge Senior Secondary Academy"
                value={previousInstitution}
                onChange={(e) => setPreviousInstitution(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Parent/Guardian & Housing Accommodation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Guardian Information */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
              <Shield className="w-4 h-4 text-indigo-600" />
              Parent & Guardian Contact
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Guardian Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Robert Miller"
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Relationship</label>
                  <select
                    value={guardianRelation}
                    onChange={(e) => setGuardianRelation(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
                  >
                    <option>Father</option>
                    <option>Mother</option>
                    <option>Legal Guardian</option>
                    <option>Relative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Guardian Phone</label>
                  <input
                    type="text"
                    placeholder="+1 (555) 987-6543"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Housing & Fees */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
              <Home className="w-4 h-4 text-indigo-600" />
              Campus Housing & Initial Fee Setup
            </h3>

            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 font-semibold text-gray-800 p-3 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hostelResident}
                  onChange={(e) => setHostelResident(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span>Include Hostel Accommodation & Meal Plan in Initial Invoice</span>
              </label>

              {hostelResident && (
                <div>
                  <label className="block text-gray-600 font-semibold mb-1">Hostel Block & Room</label>
                  <input
                    type="text"
                    value={hostelRoom}
                    onChange={(e) => setHostelRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-900"
                  />
                </div>
              )}

              <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-1 text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> Initial Fee Demand Preview
                </span>
                <div className="flex justify-between text-indigo-950 font-medium">
                  <span>Tuition & Lab Assessments:</span>
                  <span className="font-mono font-bold">$3,800 USD</span>
                </div>
                <p className="text-[10px] text-indigo-700">
                  Student roll number and ledger account will be created instantaneously upon
                  enrollment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xs text-gray-500">
            Registered students can immediately log in to the Student Fee Payment Desk.
          </span>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              id="btn-submit-registration"
              className="w-full sm:w-auto px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Complete Enrollment & Generate Fee Ledger</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
