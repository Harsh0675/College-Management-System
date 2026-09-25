import React, { useState } from 'react';
import { X, ShieldCheck, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  invoiceId?: string;
  studentId?: string;
  studentName?: string;
  onSuccess: (paymentId: string, orderId: string) => void;
}

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);

  return new Promise((resolve) => {
    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existing) {
      existing.addEventListener('load', () => resolve(Boolean(window.Razorpay)), { once: true });
      existing.addEventListener('error', () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(Boolean(window.Razorpay));
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PaymentGatewayModal({
  isOpen,
  onClose,
  amount,
  invoiceId,
  studentId,
  studentName,
  onSuccess,
}: PaymentGatewayModalProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const payWithRazorpay = async () => {
    setError('');
    setProcessing(true);

    try {
      const loaded = await loadRazorpay();
      if (!loaded || !window.Razorpay) {
        throw new Error('Razorpay Checkout could not be loaded.');
      }

      const orderResponse = await fetch(`${API_URL}/api/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          receipt: invoiceId ? `invoice_${invoiceId}` : undefined,
          notes: {
            invoiceId: invoiceId || '',
            studentId: studentId || '',
          },
        }),
      });

      const orderData = await orderResponse.json();
      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Unable to create payment order.');
      }

      const razorpay = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'College Management System',
        description: invoiceId ? `Fee payment for invoice ${invoiceId}` : 'College fee payment',
        order_id: orderData.orderId,
        prefill: {
          name: studentName || '',
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: () => setProcessing(false),
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyResponse = await fetch(`${API_URL}/api/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.verified) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }

            onSuccess(response.razorpay_payment_id, response.razorpay_order_id);
            onClose();
          } catch (verificationError) {
            setError(
              verificationError instanceof Error
                ? verificationError.message
                : 'Payment verification failed.'
            );
          } finally {
            setProcessing(false);
          }
        },
      });

      razorpay.open();
    } catch (paymentError) {
      setError(
        paymentError instanceof Error
          ? paymentError.message
          : 'Unable to start payment.'
      );
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Pay Fees</h2>
            <p className="text-sm text-gray-500">Secure payment via Razorpay</p>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="rounded-full p-2 hover:bg-gray-100"
            aria-label="Close payment modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-sm text-gray-500">Amount</div>
            <div className="text-3xl font-bold text-gray-900">
              ₹{Number(amount).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">
            <ShieldCheck className="mt-0.5 shrink-0" size={20} />
            <span>
              Card, UPI and net-banking details are entered securely in Razorpay Checkout.
              This app does not collect or store your card number or CVV.
            </span>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            onClick={payWithRazorpay}
            disabled={processing}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {processing ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Processing...
              </>
            ) : (
              `Pay ₹${Number(amount).toLocaleString('en-IN')}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
