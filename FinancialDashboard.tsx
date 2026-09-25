import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  Users,
  AlertCircle,
  CreditCard,
  Building,
  QrCode,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Printer,
  Search,
  PlusCircle,
  Banknote,
  Send,
  Check,
  Receipt,
  FileCheck,
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';
import { PaymentMethod, Transaction } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface FinancialDashboardProps {
  onOpenAddStudent: () => void;
  onOpenOfflinePayment: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  onOpenAddStudent,
  onOpenOfflinePayment,
  onNavigateToTab,
}) => {
  const {
    students = [],
    invoices = [],
    transactions = [],
    departmentSummaries = [],
    totalCollected,
    totalDues,
    collectionPercentage,
    setActiveReceiptModalTxn,
    recordOfflinePayment,
  } = useCollege();

  const safeStudents = Array.isArray(students) ? students : [];
  const safeInvoices = Array.isArray(invoices) ? invoices : [];
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeDeptSummaries = Array.isArray(departmentSummaries) ? departmentSummaries : [];

  // Quick Collect State
  const [quickStudentId, setQuickStudentId] = useState<string>(safeStudents[0]?.id || '');
  const [quickAmount, setQuickAmount] = useState<number>(500);
  const [quickMethod, setQuickMethod] = useState<PaymentMethod>('Cash');
  const [quickPayer, setQuickPayer] = useState<string>('');
  const [quickSuccessToast, setQuickSuccessToast] = useState(false);

  const selectedQuickStudent = safeStudents.find((s) => s.id === quickStudentId);
  const selectedQuickInvoice = safeInvoices.find((inv) => inv.studentId === quickStudentId);
  const quickMaxBalance = selectedQuickInvoice ? selectedQuickInvoice.balanceAmount : 0;

  const handleQuickCollect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuickInvoice || quickAmount <= 0) return;

    recordOfflinePayment(
      quickStudentId,
      selectedQuickInvoice.id,
      quickAmount,
      quickMethod,
      `QUICK_${quickMethod.toUpperCase()}_${Date.now().toString().slice(-6)}`,
      `Counter quick collection at admin finance desk`,
      quickPayer || selectedQuickStudent?.name || 'Student / Depositor'
    );

    setQuickSuccessToast(true);
    setTimeout(() => setQuickSuccessToast(false), 3500);
  };

  const overdueInvoicesCount = invoices.filter((i) => i.status === 'Overdue').length;

  return (
    <div id="financial-dashboard-view" className="space-y-6">
      {/* Top Welcome / Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
            Finance & Campus Operations
          </span>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5 tracking-tight">
            Institutional Fee Management & Accounting Ledger
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time analytics for semester collections, student receivables, online gateways, and
            counter transactions.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            id="btn-admin-register-student"
            onClick={onOpenAddStudent}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Student Admission</span>
          </button>

          <button
            type="button"
            id="btn-admin-counter-payment"
            onClick={onOpenOfflinePayment}
            className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Banknote className="w-4 h-4 text-emerald-600" />
            <span>Record Counter Payment</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Total Net Collections</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-gray-900">
              ${formatCurrency(totalCollected)}
            </span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.8%
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Across all academic programs</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Outstanding Receivables</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-rose-600">
              ${formatCurrency(totalDues)}
            </span>
            <span className="text-xs font-bold text-rose-500 flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> {overdueInvoicesCount} overdue
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Due before end of term</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Collection Efficiency</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-indigo-600">
              {collectionPercentage}%
            </span>
            <span className="text-xs text-gray-400">Target: 85%</span>
          </div>
          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full"
              style={{ width: `${Math.min(collectionPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">Enrolled Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-mono font-bold text-gray-900">{students.length}</span>
            <span className="text-xs text-emerald-600 font-semibold">100% Active</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">
            {invoices.filter((i) => i.status === 'Paid').length} accounts fully cleared
          </p>
        </div>
      </div>

      {/* Main Grid: Recent Transactions (Left) + Quick Collect / Department Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Recent Transactions Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-indigo-600" />
                  Recent Transaction Ledger
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Verified payments through Online Gateway, UPI, and Cash Counter
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateToTab('ledger')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Ledger</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 font-semibold uppercase text-[10px] border-b border-gray-100">
                    <th className="py-3 px-4">Receipt / Date</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Mode</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {safeTransactions.slice(0, 5).map((txn) => {
                    const dateFormatted = new Date(txn.timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    });

                    return (
                      <tr key={txn.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono font-bold text-indigo-700 block">
                            {txn.receiptNo}
                          </span>
                          <span className="text-[10px] text-gray-400">{dateFormatted}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-semibold text-gray-900 block">
                            {txn.studentName}
                          </span>
                          <span className="font-mono text-[10px] text-gray-400">
                            {txn.studentRollNo}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium">
                            {txn.paymentMethod === 'Card' && <CreditCard className="w-3 h-3 text-gray-500" />}
                            {txn.paymentMethod === 'UPI' && <QrCode className="w-3 h-3 text-gray-500" />}
                            {txn.paymentMethod === 'Cash' && <Banknote className="w-3 h-3 text-emerald-600" />}
                            {txn.paymentMethod === 'NetBanking' && <Building className="w-3 h-3 text-blue-500" />}
                            {txn.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <span className="font-mono font-bold text-gray-900 text-sm">
                            ${formatCurrency(txn.amount)}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => setActiveReceiptModalTxn(txn)}
                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                            title="View Official Receipt"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department Fee Performance Breakdown */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Building className="w-4 h-4 text-indigo-600" />
              Department-wise Fee Collection Progress
            </h3>

            <div className="space-y-3">
              {safeDeptSummaries.map((dept) => (
                <div key={dept.code} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-gray-800">{dept.name}</span>
                    <span className="font-mono text-gray-600">
                      ${formatCurrency(dept.totalCollected)} / ${formatCurrency((dept.totalCollected ?? 0) + (dept.totalDues ?? 0))}{' '}
                      <strong className="text-indigo-600">({dept.collectionRate}%)</strong>
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        dept.collectionRate >= 70
                          ? 'bg-emerald-500'
                          : dept.collectionRate >= 40
                          ? 'bg-indigo-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${dept.collectionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Quick Collect Widget & Actions */}
        <div className="space-y-6">
          {/* Quick Collect Widget */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-600" />
                Counter Quick Collect
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Fast fee intake for walk-in students or bank checks
              </p>
            </div>

            {quickSuccessToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Payment recorded & verified!</span>
              </div>
            )}

            <form onSubmit={handleQuickCollect} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-600 font-semibold mb-1">Student</label>
                <select
                  value={quickStudentId}
                  onChange={(e) => {
                    setQuickStudentId(e.target.value);
                    const inv = safeInvoices.find((i) => i.studentId === e.target.value);
                    if (inv) setQuickAmount(Math.min(500, inv.balanceAmount));
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 font-medium"
                >
                  {safeStudents.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              {selectedQuickInvoice && (
                <div className="p-2.5 bg-indigo-50/50 rounded-xl border border-indigo-100 flex justify-between items-center text-xs">
                  <span className="text-gray-500">Outstanding:</span>
                  <span className="font-mono font-bold text-indigo-700">
                    ${formatCurrency(quickMaxBalance)}
                  </span>
                </div>
              )}

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Amount ($ USD)</label>
                <input
                  type="number"
                  min={1}
                  max={quickMaxBalance || 10000}
                  value={quickAmount}
                  onChange={(e) => setQuickAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Payment Mode</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Cash', 'Card', 'Cheque'] as PaymentMethod[]).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setQuickMethod(mode)}
                      className={`py-1.5 text-center rounded-lg border font-semibold text-[11px] transition-colors cursor-pointer ${
                        quickMethod === mode
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-600 font-semibold mb-1">Depositor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Student / Parent"
                  value={quickPayer}
                  onChange={(e) => setQuickPayer(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-900"
                />
              </div>

              <button
                type="submit"
                disabled={quickMaxBalance <= 0}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <FileCheck className="w-4 h-4" />
                <span>Collect & Issue Receipt</span>
              </button>
            </form>
          </div>

          {/* Quick Notice Card */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Institutional Deadlines
            </h4>
            <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-amber-900 block">
                Fall 2024 Late Fee Penalty
              </span>
              <p className="text-[11px] text-amber-700">
                Automatic late fee calculation triggers for unpaid balances on October 15, 2024.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
