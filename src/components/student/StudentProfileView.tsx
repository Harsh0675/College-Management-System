import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Calendar,
  Shield,
  Home,
  Heart,
  Save,
  CheckCircle2,
  Edit3,
  Award,
  BookOpen,
  Building,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { Student } from '../../types';
import { useCollege } from '../../context/CollegeContext';

interface StudentProfileViewProps {
  student: Student;
}

export const StudentProfileView: React.FC<StudentProfileViewProps> = ({ student }) => {
  const { updateStudent } = useCollege();

  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Safe Student defaults
  const getInitialFormData = (s?: Student) => ({
    name: s?.name || '',
    email: s?.email || '',
    phone: s?.phone || '',
    avatar: s?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    address: s?.address || '',
    dateOfBirth: s?.dateOfBirth || '2003-05-14',
    bloodGroup: s?.bloodGroup || 'O+ (Positive)',
    emergencyContact: s?.emergencyContact || '+1 (555) 911-0088',
    guardianName: s?.guardianName || '',
    guardianRelation: s?.guardianRelation || 'Father / Guardian',
    guardianPhone: s?.guardianPhone || '',
    bio:
      s?.bio ||
      `Undergraduate researcher in ${s?.department || 'Engineering'}. Passionate about algorithms, collaborative engineering, and campus innovation.`,
    hostelResident: s?.hostelResident ?? false,
    hostelRoom: s?.hostelRoom || 'Block C - 204',
    admissionDate: s?.admissionDate || 'August 20, 2022',
    admissionQuota: s?.admissionQuota || 'General Merit Quota',
    entranceExam: s?.entranceExam || 'College Entrance Exam (CET)',
    entranceScore: s?.entranceScore || '98.4th Percentile',
    previousInstitution: s?.previousInstitution || 'Cambridge International School',
  });

  // Form State
  const [formData, setFormData] = useState(() => getInitialFormData(student));

  // Sync if student prop changes
  React.useEffect(() => {
    if (student) {
      setFormData(getInitialFormData(student));
    }
  }, [student]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student?.id) return;
    updateStudent(student.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatar: formData.avatar,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth,
      bloodGroup: formData.bloodGroup,
      emergencyContact: formData.emergencyContact,
      guardianName: formData.guardianName,
      guardianRelation: formData.guardianRelation,
      guardianPhone: formData.guardianPhone,
      bio: formData.bio,
      hostelResident: formData.hostelResident,
      hostelRoom: formData.hostelResident ? formData.hostelRoom : undefined,
      admissionDate: formData.admissionDate,
      admissionQuota: formData.admissionQuota,
      entranceExam: formData.entranceExam,
      entranceScore: formData.entranceScore,
      previousInstitution: formData.previousInstitution,
    });

    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <div id="student-profile-page" className="space-y-6">
      {/* Save Toast */}
      {saveSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between text-xs shadow-xs"
        >
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile information successfully saved and synced to student registry.</span>
          </div>
          <button
            onClick={() => setSaveSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Top Banner / Identity Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 flex items-end justify-between relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="px-3 py-1 bg-white/10 text-white text-[11px] font-medium backdrop-blur-xs rounded-full border border-white/20">
              {student.department}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-4">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={formData.avatar}
                  alt={student.name}
                  className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                />
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">{student.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-100">
                    {student.rollNo}
                  </span>
                </div>
                <p className="text-xs text-gray-600 font-medium">
                  {student.program} • {student.semester}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  id="btn-edit-student-profile"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    id="btn-save-profile-top"
                    onClick={handleSave}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed max-w-2xl">{formData.bio}</p>
        </div>
      </div>

      {/* Main Profile Details Form / Display */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Contact & Personal Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Personal & Contact Information
            </h3>
            {isEditing && (
              <span className="text-[11px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded">
                Editing Enabled
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Full Legal Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-semibold text-gray-900">
                  {formData.name}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">University Email</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  {formData.email}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Primary Phone Number</label>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {formData.phone}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {formData.dateOfBirth}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Blood Group</label>
              {isEditing ? (
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
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
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  {formData.bloodGroup}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Emergency Hotline</label>
              {isEditing ? (
                <input
                  type="text"
                  name="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  {formData.emergencyContact}
                </div>
              )}
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-gray-500 font-semibold mb-1">Permanent Residential Address</label>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {formData.address}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Program of Study & Academic Credentials */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              Program of Study & Academic Profile
            </h3>
            <span className="text-[11px] px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-full border border-emerald-200">
              Active Enrolled Status
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
              <span className="text-gray-400 font-semibold uppercase text-[10px] block">
                Department
              </span>
              <span className="font-bold text-gray-900 text-xs mt-1 block">
                {student.department}
              </span>
            </div>

            <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
              <span className="text-gray-400 font-semibold uppercase text-[10px] block">
                Degree Program
              </span>
              <span className="font-bold text-gray-900 text-xs mt-1 block">{student.program}</span>
            </div>

            <div className="p-3 bg-gray-50/80 rounded-xl border border-gray-100">
              <span className="text-gray-400 font-semibold uppercase text-[10px] block">
                Semester / Year
              </span>
              <span className="font-bold text-gray-900 text-xs mt-1 block">
                {student.semester} (Year {student.year})
              </span>
            </div>

            <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
              <span className="text-indigo-600 font-semibold uppercase text-[10px] block">
                Cumulative GPA
              </span>
              <span className="font-mono font-extrabold text-indigo-900 text-sm mt-1 block">
                {student.cgpa} / 4.0
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Admission & Entrance Details */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Admission Details & Prior Qualifications
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-gray-500 font-semibold mb-1">Date of Admission</label>
              {isEditing ? (
                <input
                  type="text"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900">
                  {formData.admissionDate}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Admission Quota / Category</label>
              {isEditing ? (
                <input
                  type="text"
                  name="admissionQuota"
                  value={formData.admissionQuota}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900">
                  {formData.admissionQuota}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Entrance Examination</label>
              {isEditing ? (
                <input
                  type="text"
                  name="entranceExam"
                  value={formData.entranceExam}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900">
                  {formData.entranceExam}
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-500 font-semibold mb-1">Entrance Score / Percentile</label>
              {isEditing ? (
                <input
                  type="text"
                  name="entranceScore"
                  value={formData.entranceScore}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900">
                  {formData.entranceScore}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-gray-500 font-semibold mb-1">Previous School / College</label>
              {isEditing ? (
                <input
                  type="text"
                  name="previousInstitution"
                  value={formData.previousInstitution}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                />
              ) : (
                <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900">
                  {formData.previousInstitution}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Guardian & Hostel Residency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Guardian Info */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="w-4 h-4 text-indigo-600" />
              Parent & Guardian Details
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-500 font-semibold mb-1">Guardian Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="guardianName"
                    value={formData.guardianName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                ) : (
                  <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900">
                    {formData.guardianName}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">Relationship</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="guardianRelation"
                    value={formData.guardianRelation}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                ) : (
                  <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900">
                    {formData.guardianRelation}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-500 font-semibold mb-1">Guardian Contact Phone</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                  />
                ) : (
                  <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900">
                    {formData.guardianPhone}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Hostel Residency */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2 border-b border-gray-100 pb-3">
              <Home className="w-4 h-4 text-indigo-600" />
              Campus Housing & Hostel Residency
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-gray-700">Resident Hostel Student</span>
                {isEditing ? (
                  <input
                    type="checkbox"
                    checked={formData.hostelResident}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, hostelResident: e.target.checked }))
                    }
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                ) : (
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      formData.hostelResident
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {formData.hostelResident ? 'Hostel Resident' : 'Day Scholar'}
                  </span>
                )}
              </div>

              {formData.hostelResident && (
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">
                    Allocated Block & Room
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="hostelRoom"
                      value={formData.hostelRoom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-medium"
                    />
                  ) : (
                    <div className="p-2.5 bg-gray-50/80 rounded-xl border border-gray-100 font-medium text-gray-900">
                      {formData.hostelRoom}
                    </div>
                  )}
                </div>
              )}

              <p className="text-[11px] text-gray-400 leading-relaxed pt-1">
                Hostel and dining amenities are directly linked to your fee billing cycle. For room
                reassignments, contact the Warden Office.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar if editing */}
        {isEditing && (
          <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Ensure all official contact numbers and admission records are accurate.
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl"
              >
                Discard
              </button>
              <button
                type="submit"
                id="btn-save-profile-bottom"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Information</span>
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
