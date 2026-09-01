import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CreditCard,
  Banknote,
  FileCheck,
  Building,
  DollarSign,
  AlertCircle,
  Receipt,
} from 'lucide-react';
import { Student, FeeInvoice, PaymentMethod, Transaction } from '../../types';
import { useCollege } from '../../context/CollegeContext';
import { formatCurrency } from '../../utils/formatters';

interface OfflinePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedStudent?: Student;
  onPaymentRecorded: (txn: Transaction) => void;
}

export const OfflinePaymentModal: React.FC<OfflinePaymentModalProps> = ({
  isOpen,
  onClose,
  preselectedStudent,
  onPaymentRecorded,
}) => {
  const { students = [], invoices = [], recordOfflinePayment } = useCollege();

  const safeStudents = Array.isArray(students) ? students : [];
  const safeInvoices = Array.isArray(invoices) ? invoices : [];

  const [studentId, setStudentId] = useState<string>(
    preselectedStudent?.id || safeStudents[0]?.id || ''
  );
  const [method, setMethod] = useState<PaymentMethod>('Cash');
  const [amount, setAmount] = useState<number>(1000);
  const [reference, setReference] = useState<string>('');
  const [payerName, setPayerName] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('Counter Cash Payment Clearance');
  const [error, setError] = useState<string | null>(null);

  const currentStudent = safeStudents.find((s) => s.id === studentId);
  const currentInvoice = safeInvoices.find((inv) => inv.studentId === studentId);
  const currentBalance = currentInvoice ? currentInvoice.balanceAmount : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!currentInvoice) {
      setError('No active fee invoice found for this student.');
      return;
    }

    if (amount <= 0 || amount > currentBalance) {
      setError(`Amount must be between $1 and remaining balance of $${formatCurrency(currentBalance)}.`);
      return;
    }

    const defaultRef =
      method === 'Cash'
        ? `CASH_COUNTER_${Date.now().toString().slice(-6)}`
        : method === 'Cheque'
        ? reference || `CHQ_${Math.floor(100000 + Math.random() * 900000)}`
        : reference || `BANK_TRF_${Date.now().toString().slice(-6)}`;

    const txn = recordOfflinePayment(
      studentId,
      currentInvoice.id,
      amount,
      method,
      defaultRef,
      remarks,
      payerName || currentStudent?.guardianName || currentStudent?.name || 'Payer'
    );

    onPaymentRecorded(txn);
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
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Banknote className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Record Counter Fee Collection</h3>
                <p className="text-[11px] text-slate-300">
                  Accept cash, bank drafts, cheques or POS payments
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

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Select Student */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Select Student</label>
              <select
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value);
                  const inv = invoices.find((i) => i.studentId === e.target.value);
                  if (inv) setAmount(inv.balanceAmount);
                }}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-medium"
              >
                {safeStudents.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.rollNo}) - {s.department}
                  </option>
                ))}
              </select>
            </div>

            {/* Student Ledger Quick State */}
            {currentInvoice && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Outstanding Balance
                  </span>
                  <span className="text-base font-mono font-extrabold text-indigo-700">
                    ${formatCurrency(currentBalance)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Status
                  </span>
                  <span className="text-xs font-bold text-slate-700">{currentInvoice.status}</span>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1.5">Collection Mode</label>
              <div className="grid grid-cols-4 gap-2">
                {(['Cash', 'Cheque', 'Card', 'NetBanking'] as PaymentMethod[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMethod(m)}
                    className={`py-2 px-2 rounded-lg border text-center font-semibold text-xs transition-all cursor-pointer ${
                      method === m
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Amount */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                Amount Received (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                  $
                </span>
                <input
                  type="number"
                  min={1}
                  max={currentBalance}
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2 bg-white border border-slate-300 rounded-lg font-mono font-bold text-sm focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Reference Number / Cheque No */}
            {method !== 'Cash' && (
              <div>
                <label className="block text-slate-600 font-semibold mb-1">
                  {method === 'Cheque' ? 'Cheque / DD Number' : 'POS Slip / Transaction Ref'}
                </label>
                <input
                  type="text"
                  placeholder={method === 'Cheque' ? 'e.g. CHQ-889102' : 'e.g. POS-AUTH-9901'}
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            )}

            {/* Payer Name & Remarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Depositor / Payer</label>
                <input
                  type="text"
                  placeholder="e.g. Parent / Self"
                  value={payerName}
                  onChange={(e) => setPayerName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Actions */}
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
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Receipt className="w-4 h-4" />
                Record & Issue Receipt
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
