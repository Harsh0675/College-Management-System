import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Download,
  Printer,
  Calendar,
  CreditCard,
  Building,
  QrCode,
  Banknote,
  FileCheck,
  Filter,
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext';
import { PaymentMethod } from '../../types';
import { formatCurrency } from '../../utils/formatters';

export const TransactionLedger: React.FC = () => {
  const { transactions = [], setActiveReceiptModalTxn } = useCollege();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  const filteredTransactions = safeTransactions.filter((tx) => {
    const matchesSearch =
      (tx.receiptNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.studentName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.studentRollNo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.transactionRef || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = methodFilter === 'All' || tx.paymentMethod === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const totalCollectedInView = filteredTransactions.reduce((acc, curr) => acc + curr.amount, 0);

  const handleExportCSV = () => {
    const headers = 'ReceiptNo,StudentName,RollNo,Amount,PaymentMethod,TransactionRef,Date,Remarks\n';
    const rows = filteredTransactions
      .map(
        (t) =>
          `"${t.receiptNo}","${t.studentName}","${t.studentRollNo}",${t.amount},"${t.paymentMethod}","${t.transactionRef}","${t.timestamp}","${t.remarks || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `college_fee_transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="transaction-ledger-view" className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Receipt className="w-5 h-5 text-indigo-600" />
            Complete Audit & Fee Transaction Ledger
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Official immutable transaction history with digital receipt logs and CSV export.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-indigo-600" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search receipt no, student, roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 font-medium"
          >
            <option value="All">All Payment Modes</option>
            <option value="Card">Card</option>
            <option value="UPI">UPI / Instant QR</option>
            <option value="NetBanking">NetBanking</option>
            <option value="Cash">Cash Counter</option>
            <option value="Cheque">Bank Cheque / DD</option>
          </select>

          <div className="text-right">
            <span className="text-[10px] text-gray-400 block uppercase font-semibold">
              Filter Total
            </span>
            <span className="font-mono font-bold text-sm text-gray-900">
              ${formatCurrency(totalCollectedInView)}
            </span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-semibold uppercase text-[10px] border-b border-gray-200">
                <th className="py-3 px-4">Receipt No</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Student & Roll No</th>
                <th className="py-3 px-4">Payer / Account</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">Txn Reference</th>
                <th className="py-3 px-4 text-right">Amount (USD)</th>
                <th className="py-3 px-4 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.map((tx) => {
                const dateStr = new Date(tx.timestamp).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={tx.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                      {tx.receiptNo}
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">{dateStr}</td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-gray-900 block">{tx.studentName}</span>
                      <span className="font-mono text-[10px] text-gray-400">{tx.studentRollNo}</span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600">
                      <span className="block font-medium text-gray-800">{tx.payerName}</span>
                      <span className="text-[10px] text-gray-400 truncate block max-w-[140px]">
                        {tx.payerEmail}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[11px] font-medium">
                        {tx.paymentMethod === 'Card' && <CreditCard className="w-3 h-3 text-gray-500" />}
                        {tx.paymentMethod === 'UPI' && <QrCode className="w-3 h-3 text-gray-500" />}
                        {tx.paymentMethod === 'Cash' && <Banknote className="w-3 h-3 text-emerald-600" />}
                        {tx.paymentMethod === 'NetBanking' && <Building className="w-3 h-3 text-blue-500" />}
                        {tx.paymentMethod}
                        {tx.cardLast4 && ` (••${tx.cardLast4})`}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500 truncate max-w-[130px]">
                      {tx.transactionRef}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-gray-900 text-sm">
                      ${formatCurrency(tx.amount)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setActiveReceiptModalTxn(tx)}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors cursor-pointer"
                        title="Print Official Receipt"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
