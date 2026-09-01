import React, { useState } from 'react';
import {
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  Award,
  Layers,
  ArrowUpRight,
  Receipt,
  FileText,
  Calendar,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { FeeInvoice, Student, Transaction } from '../../types';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { useCollege } from '../../context/CollegeContext';
import { formatCurrency } from '../../utils/formatters';

interface FeePaymentCardProps {
  invoice: FeeInvoice;
  student: Student;
}

export const FeePaymentCard: React.FC<FeePaymentCardProps> = ({ invoice, student }) => {
  const { setActiveReceiptModalTxn } = useCollege();
  const [isGatewayOpen, setIsGatewayOpen] = useState(false);
  const [showItemizedDetails, setShowItemizedDetails] = useState(false);

  const totalAmount = invoice?.totalAmount ?? 0;
  const discountAmount = invoice?.discountAmount ?? 0;
  const paidAmount = invoice?.paidAmount ?? 0;
  const balanceAmount = invoice?.balanceAmount ?? 0;
  const effectiveTotal = Math.max(0, totalAmount - discountAmount);
  const isPaid = invoice?.status === 'Paid';
  const isOverdue = invoice?.status === 'Overdue';
  const progressPercent = effectiveTotal > 0 ? Math.min(100, Math.round((paidAmount / effectiveTotal) * 100)) : 100;

  const getStatusBadge = () => {
    switch (invoice.status) {
      case 'Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" /> Dues Cleared
          </span>
        );
      case 'Overdue':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold uppercase tracking-wide">
            <AlertTriangle className="w-3.5 h-3.5" /> Overdue Dues
          </span>
        );
      case 'Partially Paid':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold uppercase tracking-wide">
            <Clock className="w-3.5 h-3.5" /> Partially Paid
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wide">
            <Clock className="w-3.5 h-3.5" /> Payment Pending
          </span>
        );
    }
  };

  return (
    <div
      id="fee-payment-desk-card"
      className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
    >
      {/* Header Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-mono font-medium">
              {invoice.id}
            </span>
            <span className="text-xs text-slate-300">• {invoice.semester}</span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Academic Fee & Institutional Dues
          </h2>
          <p className="text-xs text-slate-300 font-normal">
            Pay online with zero convenience fee using Cards, UPI, Net Banking, or Installments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge()}
          {!isPaid && (
            <button
              id="btn-pay-dues-banner"
              onClick={() => setIsGatewayOpen(true)}
              className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-500/30 flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              Pay Dues Online
            </button>
          )}
        </div>
      </div>

      {/* Main Fee Metrics & Progress */}
      <div className="p-6 space-y-6">
        {/* Key Numerical Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Total Assessed Dues
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-extrabold text-slate-900">
                ${formatCurrency(effectiveTotal)}
              </span>
              {discountAmount > 0 && (
                <span className="text-xs line-through text-slate-400 font-mono">
                  ${formatCurrency(totalAmount)}
                </span>
              )}
            </div>
            {discountAmount > 0 && (
              <div className="mt-1.5 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                <Award className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{invoice.scholarshipName || 'Scholarship Applied'}</span>
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/60">
            <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider block">
              Total Amount Paid
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-2xl font-mono font-extrabold text-emerald-700">
                ${formatCurrency(paidAmount)}
              </span>
              <span className="text-xs font-medium text-emerald-600">({progressPercent}%)</span>
            </div>
            <p className="text-[11px] text-emerald-600/80 mt-1.5">
              {invoice.lastPaymentDate
                ? `Last payment on ${invoice.lastPaymentDate}`
                : 'No payments made yet'}
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border ${
              isPaid
                ? 'bg-slate-50 border-slate-200'
                : isOverdue
                ? 'bg-rose-50 border-rose-200'
                : 'bg-indigo-50/60 border-indigo-200/80'
            }`}
          >
            <span
              className={`text-xs font-semibold uppercase tracking-wider block ${
                isPaid ? 'text-slate-400' : isOverdue ? 'text-rose-600' : 'text-indigo-600'
              }`}
            >
              Remaining Balance Due
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-mono font-extrabold ${
                  isPaid ? 'text-slate-700' : isOverdue ? 'text-rose-700' : 'text-indigo-700'
                }`}
              >
                ${formatCurrency(balanceAmount)}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Due Date: {invoice.dueDate}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-slate-600">
            <span>Fee Settlement Status</span>
            <span>
              ${formatCurrency(paidAmount)} / ${formatCurrency(effectiveTotal)} (
              {progressPercent}%)
            </span>
          </div>
          <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isPaid
                  ? 'bg-emerald-500'
                  : progressPercent > 0
                  ? 'bg-gradient-to-r from-indigo-500 to-emerald-500'
                  : 'bg-slate-300'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Scholarship banner if applicable */}
        {discountAmount > 0 && (
          <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-start gap-3 text-xs">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-indigo-900">
                {invoice.scholarshipName || "Dean's Merit Scholarship Concession"}
              </h4>
              <p className="text-indigo-700 text-[11px] mt-0.5">
                A scholarship discount of{' '}
                <strong className="font-mono font-bold">
                  ${formatCurrency(discountAmount)}
                </strong>{' '}
                has been credited against your tuition invoice for academic excellence.
              </p>
            </div>
          </div>
        )}

        {/* Toggle Itemized Fee Breakdown Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => setShowItemizedDetails(!showItemizedDetails)}
            className="w-full px-4 py-3 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-xs font-bold text-slate-700 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Itemized Fee Particulars & Breakdown ({(invoice.items || []).length} Items)
            </span>
            <span className="flex items-center gap-1 text-slate-500 text-[11px] font-normal">
              {showItemizedDetails ? 'Hide Particulars' : 'View Particulars'}
              {showItemizedDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </span>
          </button>

          {showItemizedDetails && (
            <div className="p-4 bg-white border-t border-slate-200 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="py-2 px-3">Item Description</th>
                    <th className="py-2 px-3">Category</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3 text-right">Amount (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(invoice.items || []).map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3 font-medium text-slate-800">{item.title}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                        {item.isMandatory ? 'Mandatory' : 'Optional'}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        ${formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t border-slate-300 font-bold bg-slate-50/50">
                    <td colSpan={3} className="py-2 px-3 text-slate-700">
                      Subtotal
                    </td>
                    <td className="py-2 px-3 text-right font-mono text-slate-900">
                      ${formatCurrency(totalAmount)}
                    </td>
                  </tr>
                  {discountAmount > 0 && (
                    <tr className="font-bold text-emerald-700 bg-emerald-50/30">
                      <td colSpan={3} className="py-2 px-3">
                        Scholarship / Fee Concession
                      </td>
                      <td className="py-2 px-3 text-right font-mono">
                        -${formatCurrency(discountAmount)}
                      </td>
                    </tr>
                  )}
                  <tr className="border-t-2 border-slate-900 font-extrabold text-sm bg-slate-50">
                    <td colSpan={3} className="py-2.5 px-3 text-slate-900">
                      Net Payable
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-indigo-700">
                      ${formatCurrency(effectiveTotal)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Instant confirmation and official computer-signed receipt generated.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {!isPaid ? (
              <button
                type="button"
                id="btn-open-checkout"
                onClick={() => setIsGatewayOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay Dues Now (${formatCurrency(balanceAmount)})</span>
              </button>
            ) : (
              <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>All Academic Dues Settled for this Term</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {isGatewayOpen && (
        <PaymentGatewayModal
          invoice={invoice}
          student={student}
          isOpen={isGatewayOpen}
          onClose={() => setIsGatewayOpen(false)}
          onPaymentSuccess={(txn: Transaction) => {
            setActiveReceiptModalTxn(txn);
          }}
        />
      )}
    </div>
  );
};
