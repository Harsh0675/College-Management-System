export type Role = 'student' | 'admin';

export type PaymentMethod = 'UPI' | 'Card' | 'NetBanking' | 'Cash' | 'Cheque' | 'EMI';

export type FeeCategory =
  | 'Tuition'
  | 'Lab & Library'
  | 'Hostel & Mess'
  | 'Examination'
  | 'Development'
  | 'Extracurricular';

export type InvoiceStatus = 'Paid' | 'Partially Paid' | 'Pending' | 'Overdue';

export type TransactionStatus = 'Success' | 'Processing' | 'Failed' | 'Refunded';

export interface FeeItem {
  id: string;
  title: string;
  category: FeeCategory;
  amount: number;
  dueDate: string;
  isMandatory: boolean;
}

export interface FeeInvoice {
  id: string;
  studentId: string;
  semester: string;
  academicYear: string;
  items: FeeItem[];
  totalAmount: number;
  discountAmount: number;
  scholarshipName?: string;
  paidAmount: number;
  balanceAmount: number;
  status: InvoiceStatus;
  dueDate: string;
  lastPaymentDate?: string;
}

export interface Transaction {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  studentRollNo: string;
  invoiceId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  timestamp: string;
  transactionRef: string;
  status: TransactionStatus;
  remarks?: string;
  breakdown: {
    title: string;
    amount: number;
  }[];
  payerName: string;
  payerEmail: string;
  cardLast4?: string;
  upiId?: string;
  bankName?: string;
}

export interface SubjectAttendance {
  id: string;
  code: string;
  name: string;
  faculty: string;
  credits: number;
  schedule: string;
  totalClasses: number;
  attendedClasses: number;
  grade?: string;
}

export interface Student {
  id: string;
  rollNo: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  department: string;
  program: string;
  semester: string;
  year: number;
  cgpa: number;
  status: 'Active' | 'On Leave' | 'Graduated';
  guardianName: string;
  guardianPhone: string;
  guardianRelation?: string;
  address: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  // Admission details
  admissionDate?: string;
  admissionQuota?: string;
  entranceExam?: string;
  entranceScore?: string;
  previousInstitution?: string;
  hostelResident: boolean;
  hostelRoom?: string;
  bio?: string;
  subjects: SubjectAttendance[];
}

export interface Notice {
  id: string;
  title: string;
  category: 'Fee & Finance' | 'Academics' | 'Examinations' | 'General' | 'Event';
  date: string;
  priority: 'High' | 'Medium' | 'Normal';
  content: string;
  author: string;
  read?: boolean;
}

export interface DepartmentSummary {
  name: string;
  code: string;
  totalStudents: number;
  totalDues: number;
  totalCollected: number;
  collectionRate: number;
}
