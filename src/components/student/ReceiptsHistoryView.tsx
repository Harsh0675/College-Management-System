import React from 'react';
import {
  Receipt,
  FileCheck,
  Printer,
  CreditCard,
  QrCode,
  Building,
  Calendar,
  DollarSign,
  Download,
  Search,
} from 'lucide-react';
import { Transaction, Student } from '../../types';
import { useCollege } from '../../context/CollegeContext';
import { formatCurrency } from '../../utils/formatters';

interface ReceiptsHistoryViewProps {
  transactions: Transaction[];
  student: Student;
}

export const ReceiptsHistoryView: React.FC<ReceiptsHistoryViewProps> = ({
  transactions = [],
  student,
}) => {
  const { setActiveReceiptModalTxn } = useCollege();
  const [searchTerm, setSearchTerm] = React.useState('');

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const filteredTxns = safeTransactions.filter(
    (tx) =>
      tx?.receiptNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx?.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx?.remarks?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="receipts-history-view" className="space-y-4">
      {/* Top Header & Search */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            Fee Payment Receipts & Transaction Records
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Access, view, and print official university receipts for tax deductions or department
            clearances.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search receipt / TXN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Transactions List */}
      {filteredTxns.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">No Payment Receipts Found</h4>
            <p className="text-xs text-slate-400 mt-1">
              {searchTerm
                ? 'Try a different search keyword.'
                : 'Payments made via the Fee Payment Desk will automatically appear here.'}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                  <th className="py-3 px-4">Receipt No</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment Mode</th>
                  <th className="py-3 px-4">Transaction Ref</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Official Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTxns.map((txn) => {
                  const dateStr = new Date(txn.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr key={txn.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-indigo-700 text-xs">
                          {txn.receiptNo}
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">{txn.id}</span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">{dateStr}</td>

                      <td className="py-3.5 px-4 font-mono font-extrabold text-slate-900 text-sm">
                        ${formatCurrency(txn.amount)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {txn.paymentMethod === 'Card' && <CreditCard className="w-3 h-3 text-slate-500" />}
                          {txn.paymentMethod === 'UPI' && <QrCode className="w-3 h-3 text-slate-500" />}
                          {txn.paymentMethod === 'NetBanking' && <Building className="w-3 h-3 text-slate-500" />}
                          {txn.paymentMethod}
                          {txn.cardLast4 && ` (••${txn.cardLast4})`}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 truncate max-w-[150px]">
                        {txn.transactionRef}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase">
                          <FileCheck className="w-3 h-3" /> Settled
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          id={`btn-view-receipt-${txn.receiptNo}`}
                          onClick={() => setActiveReceiptModalTxn(txn)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>View / Print</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
