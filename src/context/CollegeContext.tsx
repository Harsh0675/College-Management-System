import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  FeeInvoice,
  Transaction,
  Notice,
  Role,
  PaymentMethod,
  DepartmentSummary,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_INVOICES,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTICES,
} from '../data/mockData';

interface PayFeeDetails {
  payerName: string;
  payerEmail: string;
  cardLast4?: string;
  upiId?: string;
  bankName?: string;
  remarks?: string;
  breakdown?: { title: string; amount: number }[];
}

interface CollegeContextType {
  role: Role;
  currentRole: Role;
  setRole: (role: Role) => void;
  students: Student[];
  invoices: FeeInvoice[];
  transactions: Transaction[];
  notices: Notice[];
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
  selectedStudent: Student;
  selectedStudentInvoice?: FeeInvoice;
  selectedStudentTransactions: Transaction[];
  // Modals & Gateway State
  isPaymentModalOpen: boolean;
  activePaymentInvoice: FeeInvoice | null;
  openPaymentModal: (invoice: FeeInvoice) => void;
  closePaymentModal: () => void;
  activeReceiptModalTxn: Transaction | null;
  setActiveReceiptModalTxn: (txn: Transaction | null) => void;
  // Financial Analytics
  totalCollected: number;
  totalDues: number;
  collectionPercentage: number;
  departmentSummaries: DepartmentSummary[];
  // Actions
  payFee: (
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    details: PayFeeDetails
  ) => Promise<Transaction>;
  recordOfflinePayment: (
    studentId: string,
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    ref: string,
    remarks: string,
    payerName: string
  ) => Transaction;
  addStudent: (student: Omit<Student, 'id' | 'subjects'>) => void;
  updateStudent: (id: string, student: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  markAttendance: (studentId: string, subjectId: string) => void;
  resetToDefaultData: () => void;
}

const CollegeContext = createContext<CollegeContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'cms_students_v1',
  INVOICES: 'cms_invoices_v1',
  TRANSACTIONS: 'cms_transactions_v1',
  NOTICES: 'cms_notices_v1',
  SELECTED_STUDENT: 'cms_selected_student_v1',
  ROLE: 'cms_role_v1',
};

export const CollegeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<Role>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ROLE);
      return (saved === 'admin' || saved === 'student') ? saved : 'student';
    } catch {
      return 'student';
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((s) => ({
            ...s,
            subjects: Array.isArray(s.subjects) ? s.subjects : [],
          }));
        }
      }
      return INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [invoices, setInvoices] = useState<FeeInvoice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((inv) => ({
            ...inv,
            items: Array.isArray(inv.items) ? inv.items : [],
          }));
        }
      }
      return INITIAL_INVOICES;
    } catch {
      return INITIAL_INVOICES;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((tx) => ({
            ...tx,
            breakdown: Array.isArray(tx.breakdown) ? tx.breakdown : [],
          }));
        }
      }
      return INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
      return INITIAL_NOTICES;
    } catch {
      return INITIAL_NOTICES;
    }
  });

  const [selectedStudentId, setSelectedStudentIdState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_STUDENT);
      return saved || 'std-1';
    } catch {
      return 'std-1';
    }
  });

  const [activeReceiptModalTxn, setActiveReceiptModalTxn] = useState<Transaction | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [activePaymentInvoice, setActivePaymentInvoice] = useState<FeeInvoice | null>(null);

  const openPaymentModal = (invoice: FeeInvoice) => {
    setActivePaymentInvoice(invoice);
    setIsPaymentModalOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setActivePaymentInvoice(null);
  };

  // Financial Analytics Calculations
  const safeInvoicesList = Array.isArray(invoices) ? invoices : INITIAL_INVOICES;
  const safeStudentsList = Array.isArray(students) && students.length > 0 ? students : INITIAL_STUDENTS;

  const totalCollected = safeInvoicesList.reduce((acc, inv) => acc + (inv?.paidAmount || 0), 0);
  const totalDues = safeInvoicesList.reduce((acc, inv) => acc + (inv?.balanceAmount || 0), 0);
  const totalInvoiced = safeInvoicesList.reduce(
    (acc, inv) => acc + ((inv?.totalAmount || 0) - (inv?.discountAmount || 0)),
    0
  );
  const collectionPercentage = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 100;

  const departmentsConfig = [
    { name: 'Computer Science & Engineering', code: 'CSE' },
    { name: 'Electronics & Communication', code: 'ECE' },
    { name: 'Mechanical & Robotics', code: 'MECH' },
    { name: 'Information Technology & AI', code: 'IT' },
    { name: 'Civil & Infrastructure', code: 'CIVIL' },
    { name: 'Electrical & Power Systems', code: 'EEE' },
  ];

  const departmentSummaries: DepartmentSummary[] = departmentsConfig.map((dept) => {
    const deptStudents = safeStudentsList.filter(
      (s) => s.department === dept.name || s.department.includes(dept.code)
    );
    const deptStudentIds = new Set(deptStudents.map((s) => s.id));
    const deptInvoices = safeInvoicesList.filter((inv) => deptStudentIds.has(inv.studentId));
    const deptCollected = deptInvoices.reduce((sum, inv) => sum + (inv?.paidAmount || 0), 0);
    const deptDues = deptInvoices.reduce((sum, inv) => sum + (inv?.balanceAmount || 0), 0);
    const deptTotal = deptCollected + deptDues;
    const collectionRate = deptTotal > 0 ? Math.round((deptCollected / deptTotal) * 100) : 100;
    return {
      name: dept.name,
      code: dept.code,
      totalStudents: deptStudents.length,
      totalDues: deptDues,
      totalCollected: deptCollected,
      collectionRate,
    };
  });

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [role]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(invoices));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [invoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(notices));
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [notices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SELECTED_STUDENT, selectedStudentId);
    } catch (e) {
      console.warn('Storage sync error:', e);
    }
  }, [selectedStudentId]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };

  const setSelectedStudentId = (id: string) => {
    setSelectedStudentIdState(id);
  };

  const safeStudents = Array.isArray(students) && students.length > 0 ? students : INITIAL_STUDENTS;
  const selectedStudent =
    safeStudents.find((s) => s.id === selectedStudentId) || safeStudents[0] || INITIAL_STUDENTS[0];

  const selectedStudentInvoice = (Array.isArray(invoices) ? invoices : INITIAL_INVOICES).find(
    (inv) => inv.studentId === selectedStudent.id
  ) || (Array.isArray(invoices) ? invoices[0] : INITIAL_INVOICES[0]);

  const selectedStudentTransactions = (Array.isArray(transactions) ? transactions : []).filter(
    (tx) => tx.studentId === selectedStudent.id
  );

  // Fee payment processing
  const payFee = async (
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    details: PayFeeDetails
  ): Promise<Transaction> => {
    // Generate unique Receipt and Transaction Ref
    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const transactionRef =
      method === 'UPI'
        ? `UPI/${Math.floor(1000000000 + Math.random() * 9000000000)}/apex@gateway`
        : method === 'Card'
        ? `PAY_CC_${randomHex}_${Date.now().toString().slice(-6)}`
        : `NB_${details.bankName ? details.bankName.slice(0, 4).toUpperCase() : 'BANK'}_${randomHex}`;

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      receiptNo,
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      studentRollNo: selectedStudent.rollNo,
      invoiceId,
      amount,
      paymentMethod: method,
      timestamp: new Date().toISOString(),
      transactionRef,
      status: 'Success',
      remarks: details.remarks || `Fee payment towards ${selectedStudent.program}`,
      breakdown: details.breakdown || [
        { title: 'Tuition & Academic Clearance', amount: Math.round(amount * 0.7) },
        { title: 'Lab & Institutional Amenities', amount: amount - Math.round(amount * 0.7) },
      ],
      payerName: details.payerName || selectedStudent.name,
      payerEmail: details.payerEmail || selectedStudent.email,
      cardLast4: details.cardLast4,
      upiId: details.upiId,
      bankName: details.bankName,
    };

    // Update invoice state
    setInvoices((prev) =>
      (prev || []).map((inv) => {
        if (inv.id === invoiceId) {
          const effectiveTotal = inv.totalAmount - inv.discountAmount;
          const newPaid = inv.paidAmount + amount;
          const newBalance = Math.max(0, effectiveTotal - newPaid);
          const newStatus = newBalance <= 0 ? 'Paid' : 'Partially Paid';
          return {
            ...inv,
            paidAmount: newPaid,
            balanceAmount: newBalance,
            status: newStatus,
            lastPaymentDate: new Date().toISOString().split('T')[0],
          };
        }
        return inv;
      })
    );

    // Append to transactions list (newest first)
    setTransactions((prev) => [newTxn, ...(prev || [])]);

    return newTxn;
  };

  // Record Offline Payment (Cash / Cheque / Bank Transfer by Admin)
  const recordOfflinePayment = (
    studentId: string,
    invoiceId: string,
    amount: number,
    method: PaymentMethod,
    ref: string,
    remarks: string,
    payerName: string
  ): Transaction => {
    const student = students.find((s) => s.id === studentId);
    const receiptNo = `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      receiptNo,
      studentId,
      studentName: student?.name || 'Student',
      studentRollNo: student?.rollNo || 'N/A',
      invoiceId,
      amount,
      paymentMethod: method,
      timestamp: new Date().toISOString(),
      transactionRef: ref || `OFFLINE_${method.toUpperCase()}_${Date.now().toString().slice(-6)}`,
      status: 'Success',
      remarks: remarks || `Administrative offline payment recorded (${method})`,
      breakdown: [{ title: 'Academic Dues Settlement', amount }],
      payerName: payerName || student?.guardianName || student?.name || 'Payer',
      payerEmail: student?.email || 'finance@apexuniv.edu',
    };

    setInvoices((prev) =>
      (prev || []).map((inv) => {
        if (inv.id === invoiceId) {
          const effectiveTotal = inv.totalAmount - inv.discountAmount;
          const newPaid = inv.paidAmount + amount;
          const newBalance = Math.max(0, effectiveTotal - newPaid);
          const newStatus = newBalance <= 0 ? 'Paid' : 'Partially Paid';
          return {
            ...inv,
            paidAmount: newPaid,
            balanceAmount: newBalance,
            status: newStatus,
            lastPaymentDate: new Date().toISOString().split('T')[0],
          };
        }
        return inv;
      })
    );

    setTransactions((prev) => [newTxn, ...(prev || [])]);
    return newTxn;
  };

  // Add new student
  const addStudent = (studentData: Omit<Student, 'id' | 'subjects'>) => {
    const newId = `std-${Date.now()}`;
    const defaultSubjects = [
      {
        id: `sub-${Date.now()}-1`,
        code: `${studentData.department.slice(0, 2).toUpperCase()}101`,
        name: 'Foundations of Major Disciplines',
        faculty: 'Prof. Department Head',
        credits: 4,
        schedule: 'Mon, Wed 09:00 - 10:30 AM',
        totalClasses: 20,
        attendedClasses: 18,
        grade: 'A',
      },
      {
        id: `sub-${Date.now()}-2`,
        code: `${studentData.department.slice(0, 2).toUpperCase()}102`,
        name: 'Applied Analytics & Problem Solving',
        faculty: 'Dr. Faculty Advisor',
        credits: 3,
        schedule: 'Tue, Thu 11:00 - 12:30 PM',
        totalClasses: 20,
        attendedClasses: 19,
        grade: 'A',
      },
    ];

    const newStudent: Student = {
      ...studentData,
      id: newId,
      subjects: defaultSubjects,
    };

    // Also create initial fee invoice for the student
    const newInvoice: FeeInvoice = {
      id: `INV-2024-${Math.floor(100 + Math.random() * 900)}`,
      studentId: newId,
      semester: studentData.semester,
      academicYear: '2024-2025',
      items: [
        {
          id: `fi-${Date.now()}-1`,
          title: 'Tuition & Academic Instructional Fee',
          category: 'Tuition',
          amount: 3000,
          dueDate: '2024-10-30',
          isMandatory: true,
        },
        {
          id: `fi-${Date.now()}-2`,
          title: 'Departmental Lab & Practical Equipment',
          category: 'Lab & Library',
          amount: 600,
          dueDate: '2024-10-30',
          isMandatory: true,
        },
        {
          id: `fi-${Date.now()}-3`,
          title: 'Library & Online Research Database',
          category: 'Lab & Library',
          amount: 200,
          dueDate: '2024-10-30',
          isMandatory: true,
        },
      ],
      totalAmount: 3800,
      discountAmount: 0,
      paidAmount: 0,
      balanceAmount: 3800,
      status: 'Pending',
      dueDate: '2024-10-30',
    };

    setStudents((prev) => [...prev, newStudent]);
    setInvoices((prev) => [...prev, newInvoice]);
  };

  const updateStudent = (id: string, updatedFields: Partial<Student>) => {
    setStudents((prev) =>
      (prev || []).map((s) => (s.id === id ? { ...s, ...updatedFields } : s))
    );
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => (prev || []).filter((s) => s.id !== id));
    setInvoices((prev) => (prev || []).filter((inv) => inv.studentId !== id));
    if (selectedStudentId === id) {
      const remaining = (students || []).filter((s) => s.id !== id);
      if (remaining.length > 0) {
        setSelectedStudentIdState(remaining[0].id);
      }
    }
  };

  const addNotice = (noticeData: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      read: false,
    };
    setNotices((prev) => [newNotice, ...(prev || [])]);
  };

  const markAttendance = (studentId: string, subjectId: string) => {
    setStudents((prev) =>
      (prev || []).map((student) => {
        if (student.id === studentId) {
          const studentSubjects = Array.isArray(student.subjects) ? student.subjects : [];
          const updatedSubjects = studentSubjects.map((sub) => {
            if (sub.id === subjectId) {
              return {
                ...sub,
                totalClasses: (sub.totalClasses || 0) + 1,
                attendedClasses: (sub.attendedClasses || 0) + 1,
              };
            }
            return sub;
          });
          return {
            ...student,
            subjects: updatedSubjects,
          };
        }
        return student;
      })
    );
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.NOTICES);
    localStorage.removeItem(STORAGE_KEYS.SELECTED_STUDENT);
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    setStudents(INITIAL_STUDENTS);
    setInvoices(INITIAL_INVOICES);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotices(INITIAL_NOTICES);
    setSelectedStudentIdState('std-1');
    setRoleState('student');
  };

  return (
    <CollegeContext.Provider
      value={{
        role,
        currentRole: role,
        setRole,
        students,
        invoices,
        transactions,
        notices,
        selectedStudentId,
        setSelectedStudentId,
        selectedStudent,
        selectedStudentInvoice,
        selectedStudentTransactions,
        isPaymentModalOpen,
        activePaymentInvoice,
        openPaymentModal,
        closePaymentModal,
        activeReceiptModalTxn,
        setActiveReceiptModalTxn,
        totalCollected,
        totalDues,
        collectionPercentage,
        departmentSummaries,
        payFee,
        recordOfflinePayment,
        addStudent,
        updateStudent,
        deleteStudent,
        addNotice,
        markAttendance,
        resetToDefaultData,
      }}
    >
      {children}
    </CollegeContext.Provider>
  );
};

export const useCollege = () => {
  const context = useContext(CollegeContext);
  if (!context) {
    throw new Error('useCollege must be used within a CollegeProvider');
  }
  return context;
};
