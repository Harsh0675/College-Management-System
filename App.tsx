import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { CollegeProvider, useCollege } from './context/CollegeContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { FinancialDashboard } from './components/admin/FinancialDashboard';
import { StudentRegistrationForm } from './components/admin/StudentRegistrationForm';
import { StudentDirectory } from './components/admin/StudentDirectory';
import { TransactionLedger } from './components/admin/TransactionLedger';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StudentProfileView } from './components/student/StudentProfileView';
import { AcademicsView } from './components/student/AcademicsView';
import { NoticesView } from './components/student/NoticesView';
import { PaymentGatewayModal } from './components/student/PaymentGatewayModal';
import { FeeReceiptModal } from './components/student/FeeReceiptModal';
import { OfflinePaymentModal } from './components/admin/OfflinePaymentModal';
import { AddStudentModal } from './components/admin/AddStudentModal';
import { Student, Transaction } from './types';

const MainLayout: React.FC = () => {
  const {
    currentRole,
    selectedStudent,
    setSelectedStudentId,
    notices,
    isPaymentModalOpen,
    activePaymentInvoice,
    closePaymentModal,
    activeReceiptModalTxn,
    setActiveReceiptModalTxn,
  } = useCollege();

  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Admin Modals
  const [isAddStudentOpen, setIsAddStudentOpen] = useState<boolean>(false);
  const [isOfflinePaymentOpen, setIsOfflinePaymentOpen] = useState<boolean>(false);
  const [offlinePaymentStudent, setOfflinePaymentStudent] = useState<Student | undefined>(
    undefined
  );

  const handleOpenOfflinePaymentForStudent = (student: Student) => {
    setOfflinePaymentStudent(student);
    setIsOfflinePaymentOpen(true);
  };

  const handleSelectStudentFromDirectory = (student: Student) => {
    setSelectedStudentId(student.id);
    setCurrentTab('profile');
  };

  const handlePaymentRecorded = (txn: Transaction) => {
    setActiveReceiptModalTxn(txn);
  };

  return (
    <div className="flex h-screen bg-[#f9fafb] text-gray-900 overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          currentTab={currentTab}
          onNavigateToTab={(tab) => setCurrentTab(tab)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === 'dashboard' && (
            <FinancialDashboard
              onOpenAddStudent={() => setCurrentTab('registration')}
              onOpenOfflinePayment={() => {
                setOfflinePaymentStudent(undefined);
                setIsOfflinePaymentOpen(true);
              }}
              onNavigateToTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'registration' && (
            <StudentRegistrationForm
              onSuccess={(newStudent) => {
                setSelectedStudentId(newStudent.id);
              }}
            />
          )}

          {currentTab === 'students' && (
            <StudentDirectory
              onOpenAddStudent={() => setCurrentTab('registration')}
              onSelectStudent={handleSelectStudentFromDirectory}
              onRecordPaymentForStudent={handleOpenOfflinePaymentForStudent}
            />
          )}

          {currentTab === 'fee_desk' && <StudentDashboard />}

          {currentTab === 'profile' && <StudentProfileView student={selectedStudent} />}

          {currentTab === 'ledger' && <TransactionLedger />}

          {currentTab === 'academics' && <AcademicsView student={selectedStudent} />}

          {currentTab === 'notices' && <NoticesView notices={notices} />}
        </main>
      </div>

      {/* Global Payment Simulation Gateway Modal */}
      <PaymentGatewayModal
        isOpen={isPaymentModalOpen}
        invoice={activePaymentInvoice}
        student={selectedStudent}
        onClose={closePaymentModal}
        onPaymentSuccess={(txn) => {
          closePaymentModal();
          setActiveReceiptModalTxn(txn);
        }}
      />

      {/* Official Verified Printable Receipt Modal */}
      <FeeReceiptModal
        transaction={activeReceiptModalTxn}
        student={selectedStudent}
        onClose={() => setActiveReceiptModalTxn(null)}
      />

      {/* Admin Offline / Counter Collection Modal */}
      <OfflinePaymentModal
        isOpen={isOfflinePaymentOpen}
        onClose={() => setIsOfflinePaymentOpen(false)}
        preselectedStudent={offlinePaymentStudent}
        onPaymentRecorded={handlePaymentRecorded}
      />

      {/* Admin Quick Add Student Modal */}
      <AddStudentModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
      />
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = {
    hasError: false,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App Error Boundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
          <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-4 text-center">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl mx-auto flex items-center justify-center font-bold text-xl">
              !
            </div>
            <h2 className="text-lg font-bold text-slate-900">System Refresh Required</h2>
            <p className="text-xs text-slate-600">
              The application encountered a transient state error. Click below to restore standard demo records and reload the dashboard.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Reset Data & Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <CollegeProvider>
        <MainLayout />
      </CollegeProvider>
    </ErrorBoundary>
  );
}
