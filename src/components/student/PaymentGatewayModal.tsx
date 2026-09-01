import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  X,
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  ExternalLink,
  Receipt,
  FileCheck,
} from 'lucide-react';
import { FeeInvoice, Student, PaymentMethod, Transaction } from '../../types';
import { BANK_OPTIONS, UPI_APPS } from '../../data/mockData';
import { useCollege } from '../../context/CollegeContext';
import { formatCurrency } from '../../utils/formatters';

interface PaymentGatewayModalProps {
  invoice: FeeInvoice;
  student: Student;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (transaction: Transaction) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  invoice,
  student,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const { payFee } = useCollege();

  // Payment Options
  const totalAmount = invoice?.totalAmount ?? 0;
  const discountAmount = invoice?.discountAmount ?? 0;
  const effectiveTotal = Math.max(0, totalAmount - discountAmount);
  const currentBalance = invoice?.balanceAmount ?? 0;

  // Selected Amount mode: 'full' | 'half' | 'custom'
  const [amountMode, setAmountMode] = useState<'full' | 'half' | 'custom'>('full');
  const [customAmount, setCustomAmount] = useState<number>(Math.min(currentBalance, 1000));
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('Card');

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState(student?.name || 'Alex Johnson');
  const [cardSave, setCardSave] = useState(true);

  // UPI State
  const [upiId, setUpiId] = useState('');
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [qrTimer, setQrTimer] = useState(300); // 5 mins

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('chase');

  // Checkout Steps: 'configure' | 'processing' | 'success'
  const [step, setStep] = useState<'configure' | 'processing' | 'success'>('configure');
  const [processingStatus, setProcessingStatus] = useState('Contacting payment network...');
  const [completedTxn, setCompletedTxn] = useState<Transaction | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Amount to pay calculation
  const paymentAmount =
    amountMode === 'full'
      ? currentBalance
      : amountMode === 'half'
      ? Math.ceil(currentBalance / 2)
      : Math.max(10, Math.min(currentBalance, customAmount || 10));

  // Countdown timer for QR
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && selectedMethod === 'UPI' && step === 'configure' && qrTimer > 0) {
      interval = setInterval(() => {
        setQrTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, selectedMethod, step, qrTimer]);

  // Card input formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.substring(0, 2)}/${raw.substring(2, 4)}`;
    }
    setCardExpiry(raw);
  };

  // Trigger Celebration Confetti
  const fireConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6'],
      });
    } catch {
      // ignore in test environments
    }
  };

  // Submit and process payment
  const handleProceedPayment = async () => {
    setErrorMessage(null);

    // Validation
    if (selectedMethod === 'Card') {
      const cleanNum = cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 15) {
        setErrorMessage('Please enter a valid 16-digit card number.');
        return;
      }
      if (!cardExpiry || cardExpiry.length < 5) {
        setErrorMessage('Please enter a valid expiration date (MM/YY).');
        return;
      }
      if (!cardCvv || cardCvv.length < 3) {
        setErrorMessage('Please enter a valid 3 or 4-digit CVV.');
        return;
      }
    } else if (selectedMethod === 'UPI') {
      if (!upiId && selectedUpiApp === 'custom') {
        setErrorMessage('Please enter your valid Virtual Payment Address (UPI ID).');
        return;
      }
    }

    setStep('processing');
    setProcessingStatus('Securing connection with payment gateway...');

    setTimeout(() => {
      setProcessingStatus('Validating banking credentials & token...');
    }, 800);

    setTimeout(() => {
      setProcessingStatus('Finalizing settlement & issuing SIRT Bhopal receipt...');
    }, 1600);

    setTimeout(async () => {
      try {
        const last4 = cardNumber.replace(/\s/g, '').slice(-4) || '4242';
        const finalUpi = upiId || `${student.email.split('@')[0]}@${selectedUpiApp}`;
        const finalBank = BANK_OPTIONS.find((b) => b.id === selectedBank)?.name;

        const breakdown = [
          {
            title: `Semester Tuition & Instructional Dues`,
            amount: Math.round(paymentAmount * 0.75),
          },
          {
            title: `Institutional Facility, Lab & Examination Fee`,
            amount: paymentAmount - Math.round(paymentAmount * 0.75),
          },
        ];

        const txn = await payFee(invoice.id, paymentAmount, selectedMethod, {
          payerName: cardHolder || student.name,
          payerEmail: student.email,
          cardLast4: selectedMethod === 'Card' ? last4 : undefined,
          upiId: selectedMethod === 'UPI' ? finalUpi : undefined,
          bankName: selectedMethod === 'NetBanking' ? finalBank : undefined,
          remarks: `Semester Fee payment for ${student.program}`,
          breakdown,
        });

        setCompletedTxn(txn);
        setStep('success');
        fireConfetti();
        onPaymentSuccess(txn);
      } catch (err: any) {
        setStep('configure');
        setErrorMessage(err?.message || 'Payment processing failed. Please try again.');
      }
    }, 2400);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="payment-gateway-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/65 backdrop-blur-xs overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-auto"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-base tracking-tight text-white flex items-center gap-2">
                  SIRT Bhopal Secure Fee Portal
                </h3>
                <p className="text-xs text-slate-300 font-normal flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> 256-Bit Encrypted Payment Channel
                </p>
              </div>
            </div>
            {step !== 'processing' && (
              <button
                id="btn-close-payment-modal"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* STEP 1: CONFIGURE & PAY */}
          {step === 'configure' && (
            <div className="p-6 space-y-6">
              {/* Invoice Quick Summary Bar */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Student & Invoice Dues
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-bold text-slate-900 text-sm">{student.name}</span>
                    <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 font-mono font-medium rounded-md">
                      {student.rollNo}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{invoice.semester}</p>
                </div>
                <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Outstanding Balance
                  </span>
                  <span className="text-xl font-mono font-extrabold text-indigo-700">
                    ${formatCurrency(currentBalance)}
                  </span>
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Select Amount to Pay Options */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Select Settlement Amount
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setAmountMode('full')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      amountMode === 'full'
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="block text-xs font-medium text-slate-500">Full Balance</span>
                    <span className="block text-sm font-bold font-mono text-slate-900 mt-1">
                      ${formatCurrency(currentBalance)}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold mt-0.5">
                      100% Clearance
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAmountMode('half')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      amountMode === 'half'
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="block text-xs font-medium text-slate-500">
                      50% Installment
                    </span>
                    <span className="block text-sm font-bold font-mono text-slate-900 mt-1">
                      ${formatCurrency(Math.ceil(currentBalance / 2))}
                    </span>
                    <span className="block text-[10px] text-indigo-600 font-semibold mt-0.5">
                      Part 1 of 2
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAmountMode('custom')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      amountMode === 'custom'
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className="block text-xs font-medium text-slate-500">Custom Amount</span>
                    <span className="block text-sm font-bold font-mono text-slate-900 mt-1">
                      Flexible
                    </span>
                    <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                      Enter Value
                    </span>
                  </button>
                </div>

                {amountMode === 'custom' && (
                  <div className="mt-3">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                        $
                      </span>
                      <input
                        type="number"
                        min={10}
                        max={currentBalance}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(Number(e.target.value))}
                        className="w-full pl-8 pr-4 py-2 text-sm font-mono font-bold bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter amount"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Minimum $10, Maximum ${formatCurrency(currentBalance)}
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Methods Tabs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                  Choose Payment Gateway
                </label>
                <div className="flex border-b border-slate-200 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('Card')}
                    className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 -mb-[2px] cursor-pointer ${
                      selectedMethod === 'Card'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Credit / Debit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('UPI')}
                    className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 -mb-[2px] cursor-pointer ${
                      selectedMethod === 'UPI'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4" /> UPI / QR Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedMethod('NetBanking')}
                    className={`pb-2.5 px-3 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 -mb-[2px] cursor-pointer ${
                      selectedMethod === 'NetBanking'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Building className="w-4 h-4" /> Net Banking
                  </button>
                </div>

                {/* TAB CONTENT: CREDIT/DEBIT CARD */}
                {selectedMethod === 'Card' && (
                  <div className="pt-4 space-y-4">
                    {/* Visual Card Preview */}
                    <div className="p-4 bg-gradient-to-tr from-slate-900 via-indigo-900 to-slate-800 text-white rounded-xl shadow-md space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-xs tracking-widest uppercase font-mono text-indigo-300">
                          SIRT Bhopal Student Card
                        </span>
                        <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white/10 rounded">
                          DEBIT / CREDIT
                        </span>
                      </div>
                      <div className="font-mono tracking-wider text-base sm:text-lg font-bold text-slate-100">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>
                      <div className="flex justify-between items-end text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">
                            Card Holder
                          </span>
                          <span className="font-medium tracking-wide">
                            {cardHolder || student.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Expires</span>
                          <span className="font-mono font-medium">{cardExpiry || 'MM/YY'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Card Number</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            maxLength={19}
                            className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 text-xs font-bold">
                            <span>VISA</span>
                            <span>MC</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            placeholder="12/28"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            maxLength={5}
                            className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-600 font-medium mb-1">CVV / CVC</label>
                          <div className="relative">
                            <input
                              type="password"
                              placeholder="•••"
                              value={cardCvv}
                              onChange={(e) =>
                                setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))
                              }
                              maxLength={4}
                              className="w-full px-3 py-2 text-sm font-mono bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                            />
                            <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Alex Johnson"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: UPI / QR SCAN */}
                {selectedMethod === 'UPI' && (
                  <div className="pt-4 space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center gap-5">
                      {/* Dynamic QR Code Box */}
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center shrink-0">
                        <div className="w-36 h-36 bg-slate-900 rounded-lg flex items-center justify-center p-2 relative overflow-hidden">
                          {/* Stylized QR Code Visual */}
                          <div className="w-full h-full border-4 border-white/90 p-1 flex flex-col justify-between">
                            <div className="flex justify-between">
                              <div className="w-7 h-7 bg-white p-1">
                                <div className="w-full h-full bg-slate-900"></div>
                              </div>
                              <div className="w-7 h-7 bg-white p-1">
                                <div className="w-full h-full bg-slate-900"></div>
                              </div>
                            </div>
                            <div className="text-center font-mono text-[9px] text-white/90 tracking-tighter uppercase font-bold py-1 bg-indigo-600/90 rounded">
                              SIRT PAY QR
                            </div>
                            <div className="flex justify-between">
                              <div className="w-7 h-7 bg-white p-1">
                                <div className="w-full h-full bg-slate-900"></div>
                              </div>
                              <div className="w-5 h-5 border-2 border-white flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-amber-300" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>
                            Expires in {Math.floor(qrTimer / 60)}:
                            {(qrTimer % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      {/* UPI Instructions & Apps */}
                      <div className="space-y-3 text-xs w-full">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">
                            Scan with any UPI / Banking App
                          </h4>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Open Google Pay, PhonePe, Paytm or Apple Pay to scan and approve the
                            transaction instantly.
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          {UPI_APPS.slice(0, 4).map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => {
                                setSelectedUpiApp(app.id);
                                setUpiId(`${(student?.rollNo || 'student').toLowerCase()}@${app.id}`);
                              }}
                              className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all cursor-pointer ${
                                selectedUpiApp === app.id
                                  ? 'border-indigo-600 bg-indigo-50/80 font-semibold text-indigo-900'
                                  : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              <span className="text-base">{app.icon}</span>
                              <div className="truncate">
                                <div className="font-medium text-xs truncate">{app.name}</div>
                              </div>
                            </button>
                          ))}
                        </div>

                        <div>
                          <label className="block text-slate-600 font-medium text-[11px] mb-1">
                            Or Enter Custom Virtual Payment Address (UPI ID)
                          </label>
                          <input
                            type="text"
                            placeholder="username@okhdfcbank"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setSelectedUpiApp('custom');
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB CONTENT: NET BANKING */}
                {selectedMethod === 'NetBanking' && (
                  <div className="pt-4 space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-slate-500 block mb-2">
                        Popular Banking Institutions
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                        {BANK_OPTIONS.map((bank) => (
                          <button
                            key={bank.id}
                            type="button"
                            onClick={() => setSelectedBank(bank.id)}
                            className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                              selectedBank === bank.id
                                ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600/20 font-semibold text-indigo-900'
                                : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                            }`}
                          >
                            <span className="text-lg">{bank.logo}</span>
                            <span className="text-xs leading-tight line-clamp-2">{bank.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        You will be securely routed through your bank’s single sign-on authentication
                        server to confirm this fee payment.
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Summary Footer & CTA */}
              <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Total Payable Now</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-mono font-extrabold text-slate-900">
                      ${formatCurrency(paymentAmount)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">USD</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    id="btn-confirm-pay"
                    onClick={handleProceedPayment}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Authorize & Pay ${formatCurrency(paymentAmount)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROCESSING SIMULATOR */}
          {step === 'processing' && (
            <div className="p-12 text-center space-y-6">
              <div className="relative w-20 h-20 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="w-full h-full border-4 border-indigo-200 border-t-indigo-600 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-indigo-600 animate-pulse" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  Processing Your Payment securely
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  {processingStatus}
                </p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl inline-flex items-center gap-2 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Encrypted 256-Bit SSL • Do not close or refresh this page</span>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS CONFIRMATION */}
          {step === 'success' && completedTxn && (
            <div className="p-8 text-center space-y-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-slate-900">
                  Payment Successful & Verified!
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Your fee transaction has been confirmed by the SIRT Bhopal Finance & Accounts Office. An
                  official receipt has been issued and stored in your ledger.
                </p>
              </div>

              {/* Transaction Summary Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left space-y-2.5 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Receipt Number:</span>
                  <span className="font-mono font-bold text-indigo-700">
                    {completedTxn.receiptNo}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Transaction ID:</span>
                  <span className="font-mono text-slate-800">{completedTxn.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Amount Settled:</span>
                  <span className="font-mono font-extrabold text-emerald-600 text-sm">
                    ${formatCurrency(completedTxn.amount)} USD
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Payment Mode:</span>
                  <span className="font-semibold text-slate-900">
                    {completedTxn.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  id="btn-view-receipt-now"
                  onClick={() => {
                    onPaymentSuccess(completedTxn);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Generate Printable Receipt</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
