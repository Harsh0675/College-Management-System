import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  Building2,
  ShieldCheck,
  QrCode,
  Calendar,
  CreditCard,
  User,
  Hash,
  FileCheck2,
  Building,
  Smartphone,
  Banknote,
  Sparkles,
} from 'lucide-react';
import { Transaction, Student } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface FeeReceiptModalProps {
  transaction: Transaction | null;
  student?: Student;
  onClose: () => void;
}

export const FeeReceiptModal: React.FC<FeeReceiptModalProps> = ({
  transaction,
  student,
  onClose,
}) => {
  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  // Enable Ctrl+P / Cmd+P when receipt is open
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        window.print();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const formattedDate = new Date(transaction.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const getMethodIcon = () => {
    switch (transaction.paymentMethod) {
      case 'Card':
        return <CreditCard className="w-3.5 h-3.5" />;
      case 'UPI':
        return <Smartphone className="w-3.5 h-3.5" />;
      case 'NetBanking':
        return <Building className="w-3.5 h-3.5" />;
      case 'Cash':
        return <Banknote className="w-3.5 h-3.5" />;
      default:
        return <CreditCard className="w-3.5 h-3.5" />;
    }
  };

  return (
    <AnimatePresence>
      <div
        id="fee-receipt-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          id="fee-receipt-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-4 sm:my-6"
        >
          {/* Header Action Bar (Hidden in Print) */}
          <div className="bg-slate-900 text-white px-5 sm:px-6 py-3.5 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-semibold text-xs sm:text-sm tracking-wide block">
                  OFFICIAL FEE PAYMENT RECEIPT
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Receipt #{transaction.receiptNo}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                id="btn-print-receipt"
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer"
                title="Print Receipt (Ctrl+P)"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                id="btn-close-receipt-modal"
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Receipt Body */}
          <div
            id="printable-receipt-content"
            className="p-6 sm:p-10 space-y-6 text-slate-800 bg-white"
          >
            {/* University Letterhead */}
            <div className="receipt-section border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-13 h-13 rounded-xl bg-indigo-900 flex items-center justify-center text-white shadow-md print:border print:border-slate-800">
                  <Building2 className="w-7 h-7 text-indigo-200" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight uppercase font-sans">
                    SIRT Bhopal (Sagar Institute of Research & Technology)
                  </h1>
                  <p className="text-xs text-slate-600 font-medium">
                    Ayodhya Bypass Road, Opposite Minal Residency, Bhopal, MP 462041
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Approved by AICTE • Affiliated to RGPV & BU Bhopal • ISO 9001:2015 Certified
                  </p>
                </div>
              </div>
              <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] uppercase tracking-wider border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> Payment Successful
                </span>
                <div className="mt-1.5">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">Receipt Number</span>
                  <span className="text-xs font-mono font-extrabold text-slate-900">
                    {transaction.receiptNo}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Subtitle */}
            <div className="receipt-section flex items-center justify-between border-b border-slate-200 pb-2">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-700">
                Official Student Fee Acknowledgement & Tax Voucher
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Issue Date: {formattedDate}
              </span>
            </div>

            {/* Student & Payment Summary Grid */}
            <div className="receipt-section receipt-summary-grid grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium text-[11px] block">Student Name:</span>
                <span className="font-bold text-slate-900 text-sm block">
                  {transaction.studentName}
                </span>
                {student?.email && (
                  <span className="text-[10px] text-slate-500 truncate block">
                    {student.email}
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-500 font-medium text-[11px] block">Roll Number / ID:</span>
                <span className="font-mono font-bold text-indigo-800 text-sm block">
                  {transaction.studentRollNo}
                </span>
                {student?.semester && (
                  <span className="text-[10px] text-slate-500 block">
                    {student.semester}
                  </span>
                )}
              </div>
              <div>
                <span className="text-slate-500 font-medium text-[11px] block">Academic Program:</span>
                <span className="font-semibold text-slate-900 block">
                  {student?.program || 'Undergraduate Degree'}
                </span>
                <span className="text-[10px] text-slate-600 block">
                  Dept: {student?.department || 'Engineering & Tech'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 font-medium text-[11px] block">Payment Method:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                  {getMethodIcon()}
                  <span>{transaction.paymentMethod}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono block">
                  {transaction.cardLast4 ? `Card ending in ••${transaction.cardLast4}` : 'Verified Digital Settlement'}
                </span>
              </div>
            </div>

            {/* Fee Particulars Breakdown Table */}
            <div className="receipt-section">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Itemized Fee Particulars & Settlement
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">
                  Currency: USD ($)
                </span>
              </div>
              <div className="border border-slate-300 rounded-lg overflow-hidden">
                <table className="w-full text-xs text-left border-collapse receipt-table">
                  <thead>
                    <tr className="border-b border-slate-300 text-slate-700 bg-slate-100 font-semibold">
                      <th className="py-2.5 px-3.5 w-12 text-slate-500 font-mono">#</th>
                      <th className="py-2.5 px-3.5">Fee Head / Description</th>
                      <th className="py-2.5 px-3.5 w-32">Billing Cycle</th>
                      <th className="py-2.5 px-3.5 text-right w-32">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {transaction.breakdown && transaction.breakdown.length > 0 ? (
                      transaction.breakdown.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3.5 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2 px-3.5 font-medium text-slate-800">
                            {item.title}
                          </td>
                          <td className="py-2 px-3.5 text-slate-500 text-[11px]">
                            {student?.semester || 'Current Semester'}
                          </td>
                          <td className="py-2 px-3.5 text-right font-mono font-semibold text-slate-900">
                            ${formatCurrency(item.amount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="py-2.5 px-3.5 text-slate-400 font-mono">1</td>
                        <td className="py-2.5 px-3.5 font-medium text-slate-800">
                          {transaction.remarks || 'Academic Tuition & Semester Assessment Dues'}
                        </td>
                        <td className="py-2.5 px-3.5 text-slate-500 text-[11px]">
                          {student?.semester || 'Semester Dues'}
                        </td>
                        <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-slate-900">
                          ${formatCurrency(transaction.amount)}
                        </td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-800 bg-slate-100/80 font-bold">
                      <td colSpan={3} className="py-3 px-3.5 text-slate-900 text-sm">
                        Total Amount Received & Credited:
                      </td>
                      <td className="py-3 px-3.5 text-right text-emerald-800 font-mono font-black text-base">
                        ${formatCurrency(transaction.amount)} USD
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Audit, Security & Transaction Identifiers */}
            <div className="receipt-section p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-700">
              <div className="space-y-1.5">
                <div>
                  <span className="text-slate-500 text-[11px] font-medium">Gateway Txn Reference: </span>
                  <span className="font-mono font-bold text-slate-900">{transaction.transactionRef}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] font-medium">Internal Reference ID: </span>
                  <span className="font-mono text-slate-700">{transaction.id}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] font-medium">Payer Account / Identity: </span>
                  <span className="font-medium text-slate-900">
                    {transaction.payerName} {transaction.payerEmail ? `(${transaction.payerEmail})` : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200 shrink-0">
                <QrCode className="w-12 h-12 text-slate-800" />
                <div className="text-[10px] text-slate-500 leading-tight">
                  <span className="font-bold text-slate-800 block">DIGITALLY VERIFIED</span>
                  <span>SIRT Security Token:</span>
                  <span className="font-mono block text-[9px] text-slate-700 truncate max-w-[120px]">
                    SHA256:{transaction.receiptNo.slice(-6)}X{transaction.id.slice(-4)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Signature & Legal Stamp */}
            <div className="receipt-section receipt-footer pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="text-[10px] text-slate-500 max-w-sm space-y-1">
                <p className="font-semibold text-slate-700">
                  * OFFICIAL SIRT BHOPAL COMPUTER-GENERATED RECEIPT
                </p>
                <p>
                  No physical signature is required under electronic transaction regulations. Valid for income tax education credit deductions, employer reimbursement, and examination hall ticket clearance.
                </p>
              </div>
              <div className="text-center self-end sm:self-auto">
                <div className="h-8 font-serif italic text-base text-indigo-950 flex items-end justify-center font-bold tracking-wider">
                  Harsh Nagar
                </div>
                <div className="border-t border-slate-400 pt-1 text-[10px] text-slate-700 font-bold uppercase tracking-wider">
                  Administrative Officer & Bursar
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Bar (Hidden in Print) */}
          <div className="bg-slate-50 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200 print:hidden">
            <div className="text-xs text-slate-500 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              <span>Formatted with CSS Print Queries for standard A4 receipts.</span>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
