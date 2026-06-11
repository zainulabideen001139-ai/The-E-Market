import React, { useEffect, useState } from 'react';
import { CheckCircle2, ShieldCheck, RefreshCw, XCircle, ArrowRight, Phone, MessageSquare, Landmark, MapPin } from 'lucide-react';
import { Order } from '../types';

interface SafepayVerificationProps {
  onSuccess: (order: Order) => void;
}

export const SafepayVerificationScreen: React.FC<SafepayVerificationProps> = ({ onSuccess }) => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [simulatedEmail, setSimulatedEmail] = useState<any | null>(null);

  useEffect(() => {
    const runVerification = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const tracker = params.get('tracker');
        const token = params.get('token');
        const sig = params.get('sig');

        const trackerToken = tracker || token;
        if (!trackerToken) {
          setStatus('error');
          setErrorMessage('Missing transaction validation parameters.');
          return;
        }

        const endpoint = `/api/payments/safepay/verify?tracker=${trackerToken}${sig ? `&sig=${sig}` : ''}`;
        const resp = await fetch(endpoint);

        if (resp.ok) {
          const data = await resp.json();
          if (data.success && data.order) {
            setCompletedOrder(data.order);
            if (data.EmailSimulated) {
              setSimulatedEmail(data.EmailSimulated);
            }
            onSuccess(data.order);
            setStatus('success');
            
            // Clean up the address bar search params so refreshing doesn't loop
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setStatus('error');
            setErrorMessage('Unable to authorize purchase details from the transaction token.');
          }
        } else {
          const errData = await resp.json();
          setStatus('error');
          setErrorMessage(errData.error || 'Signature check failed or tracker expired.');
        }
      } catch (err: any) {
        console.error(err);
        setStatus('error');
        setErrorMessage('Platform verification channel interrupted: ' + err.message);
      }
    };

    runVerification();
  }, [onSuccess]);

  if (status === 'loading') {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-6 font-sans animate-fade-in p-8 bg-white border border-gray-200 rounded-3xl shadow-lg">
        <div className="relative flex justify-center py-4">
          <RefreshCw size={44} className="text-indigo-600 animate-spin" />
        </div>
        <div className="space-y-2">
          <h3 className="serif text-xl italic font-semibold text-gray-900">Validating Merchant Signatures</h3>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Please wait. We are authenticating your transaction tokens with the Safepay acquiring network...
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-150 inline-flex items-center gap-2 text-[10px] font-mono text-gray-504 text-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          <span>SECURED CHANNELS ACTIVE</span>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto my-16 bg-white border border-red-100 p-8 rounded-3xl text-gray-700 animate-fade-in space-y-6 shadow-xl">
        <div className="text-center space-y-3">
          <div className="h-12 w-12 bg-rose-50 border border-rose-100 rounded-full flex items-center justify-center mx-auto text-rose-600">
            <XCircle size={28} />
          </div>
          <h3 className="serif text-2xl italic text-gray-950 font-semibold">Payment Unsuccessful</h3>
          <p className="text-xs text-gray-500">Your secure digital payment could not be processed completely.</p>
        </div>

        <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-xl text-xs space-y-1">
          <span className="text-rose-900 font-bold uppercase block text-[9px] tracking-wide">Verification Exception</span>
          <p className="font-mono text-rose-700 leading-relaxed font-semibold">{errorMessage}</p>
        </div>

        <p className="text-xs text-gray-550 leading-relaxed text-gray-500">
          If funds were deducted, please contact Avenzo customer assistance at <strong className="text-indigo-600">support@avenzo.pk</strong> with your invoice reference to reconcile instantly.
        </p>

        <div className="text-center pt-2">
          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="px-6 py-3 bg-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            Return to Storefront
          </button>
        </div>
      </div>
    );
  }

  // SUCCESS RENDER
  return (
    <div className="max-w-3xl mx-auto bg-white border border-indigo-100 p-6 sm:p-10 rounded-3xl text-gray-700 animate-fade-in space-y-8 my-8 shadow-xl">
      <div className="text-center space-y-3">
        <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-100 shadow-sm">
          <CheckCircle2 size={32} />
        </div>
        <h2 className="serif text-3xl italic text-gray-900 font-semibold">Acquisition Completed & Paid</h2>
        <p className="text-xs text-gray-500 font-medium">
          Dear Client, thank you for investing with Avenzo. Your payment has been successfully verified via Safepay!
        </p>
      </div>

      {completedOrder && (
        <div className="bg-gray-50 border border-gray-150 p-6 rounded-2xl space-y-4 shadow-sm">
          <div className="flex justify-between items-center text-xs text-gray-500 border-b border-gray-200 pb-3 font-medium">
            <span>ORDER REFERENCE: <strong className="text-gray-900 font-mono font-bold">{completedOrder.id}</strong></span>
            <span>SHIPPING HUB: <strong className="text-gray-900 uppercase font-bold">{completedOrder.city}</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-gray-400 uppercase tracking-widest block font-bold text-[9px]">Delivery Destination</span>
              <p className="text-gray-800 font-bold mt-1 text-sm">{completedOrder.customerName}</p>
              <p className="text-gray-600 font-medium">{completedOrder.shippingAddress}, {completedOrder.city}, Pakistan</p>
              <p className="text-gray-500 font-mono mt-0.5">{completedOrder.customerPhone}</p>
            </div>
            <div>
              <span className="text-gray-400 uppercase tracking-widest block font-bold text-[9px]">Consignment Tracking</span>
              <p className="text-indigo-600 font-mono font-bold mt-1 text-sm">{completedOrder.trackingNumber}</p>
              <p className="text-gray-600 mt-1 font-medium">Payment status: <strong className="text-emerald-600 uppercase font-bold text-[10px]">Paid (Safepay)</strong></p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Secure settlement finalized. Preparation queue initiated.</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <span className="text-[10px] uppercase text-gray-400 tracking-widest block font-bold pb-1">Secured Assets</span>
            {completedOrder.items.map((it: any) => (
              <div key={it.product.id} className="flex justify-between items-center text-xs">
                <span className="text-gray-800 font-medium truncate max-w-[250px]">{it.product.name} (x{it.quantity})</span>
                <span className="text-gray-650 font-mono font-medium">Rs. {(it.product.price * it.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-3 flex justify-between items-center text-sm">
            <span className="text-gray-900 font-bold uppercase tracking-wider">Invoiced Sum</span>
            <span className="text-indigo-600 text-base font-bold font-mono">
              Rs. {completedOrder.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {simulatedEmail && (
        <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
            <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span> Custom Mail Notification Dispatch Terminal
          </div>
          <div className="bg-white p-4 rounded-xl text-xs font-mono space-y-2 text-gray-700 leading-relaxed border border-blue-50 shadow-inner">
            <p><strong className="text-blue-900">To:</strong> {simulatedEmail.to}</p>
            <p><strong className="text-blue-900">Subject:</strong> {simulatedEmail.subject}</p>
            <hr className="border-gray-100 my-2" />
            <p className="whitespace-pre-line text-gray-800 font-medium">{simulatedEmail.body}</p>
          </div>
          <span className="text-[10px] text-blue-600 italic block text-right mt-1 font-sans">* Avenzo automated email client dispatch simulated live.</span>
        </div>
      )}

      <div className="text-center pt-2 font-sans">
        <p className="text-xs text-gray-500 mb-4 font-medium">
          You may trace your cargo status at any time inside the <strong className="text-indigo-600">Client Workspace</strong> using your tracking number.
        </p>
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          className="px-8 py-3 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs uppercase tracking-widest transition-all rounded-xl cursor-pointer shadow-sm"
        >
          Acknowledge & Back to Home
        </button>
      </div>
    </div>
  );
};
export default SafepayVerificationScreen;
