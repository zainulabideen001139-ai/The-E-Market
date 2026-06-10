import React, { useState, useEffect } from 'react';
import { ShieldCheck, RefreshCw, Lock, Globe, AlertCircle, CreditCard, ChevronRight, CheckCircle2 } from 'lucide-react';

interface VerifoneCheckoutGatewaySimulatorProps {
  session: {
    sellerId: string;
    orderRef: string;
    totalAmount: number;
    currency: string;
    signature: string;
    timestamp: number;
    customerDetails: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      shippingAddress: string;
      city: string;
    };
  };
  cartSubtotal: number;
  discountPercent: number;
  calculatedDiscount: number;
  deliverySurcharge: number;
  totalInvoicedAmount: number;
  onCancel: () => void;
  onPaymentSuccess: (result: { transactionId: string }) => void;
}

export const VerifoneCheckoutGatewaySimulator: React.FC<VerifoneCheckoutGatewaySimulatorProps> = ({
  session,
  cartSubtotal,
  discountPercent,
  calculatedDiscount,
  deliverySurcharge,
  totalInvoicedAmount,
  onCancel,
  onPaymentSuccess,
}) => {
  // Simulator inputs
  const [cardholder, setCardholder] = useState(session.customerDetails.customerName);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  // Interactive wizard states
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex' | 'generic'>('generic');
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'approved'>('form');
  const [processLogs, setProcessLogs] = useState<string[]>([]);
  const [currentLogIndex, setCurrentLogIndex] = useState(0);

  // Auto-detect credit card company based on leading characters
  useEffect(() => {
    const rawDigits = cardNumber.replace(/\D/g, '');
    if (rawDigits.startsWith('4')) {
      setCardBrand('visa');
    } else if (rawDigits.startsWith('5') || rawDigits.startsWith('2')) {
      setCardBrand('mastercard');
    } else if (rawDigits.startsWith('34') || rawDigits.startsWith('37')) {
      setCardBrand('amex');
    } else {
      setCardBrand('generic');
    }
  }, [cardNumber]);

  // Format card input with clean spacing blocks
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value.replace(/\D/g, '');
    let formatted = '';
    
    if (inputVal.length > 0) {
      const parts = inputVal.match(/.{1,4}/g);
      if (parts) {
        formatted = parts.join(' ');
      }
    }
    
    // limit standard card numbers to 19 characters (16 digits + 3 spaces)
    if (formatted.length <= 19) {
      setCardNumber(formatted);
    }
  };

  // Format Expiration Date MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputVal = e.target.value.replace(/\D/g, '');
    if (inputVal.length > 2) {
      inputVal = inputVal.slice(0, 2) + '/' + inputVal.slice(2, 4);
    }
    if (inputVal.length <= 5) {
      setExpiry(inputVal);
    }
  };

  // Format CVV
  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value.replace(/\D/g, '');
    if (inputVal.length <= 4) { // Amex supports 4 digits, others 3
      setCvv(inputVal);
    }
  };

  // Cryptographic checkout processing simulation steps
  const stepsList = [
    'Establishing secure Redirection Tunnel to Verifone API Host...',
    `Verifying dynamic merchant integrity signature... [PASS]`,
    `Payload validation: Signature Hash is ${session.signature.slice(0, 16)}...`,
    `Routing PKR ${totalInvoicedAmount.toLocaleString()} acquired sum to Pakistan Merchant acquiring center...`,
    'Initiating secure PCI-DSS tokenization checks on international lines...',
    'Performing fraud risk analysis via Verifone Shield technology...',
    'Authenticating international card credit availability...',
    'Synchronizing transaction reference codes with Avenzo corporate backend...',
    'Imperial transaction approved! Releasing inventory and initiating white-glove dispatch protocols.'
  ];

  const handleStartPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 15) {
      alert('Must state a valid card acquisition sequence.');
      return;
    }
    if (expiry.length < 5) {
      alert('Must state card validity date.');
      return;
    }
    if (cvv.length < 3) {
      alert('State your secure verification CVV digits.');
      return;
    }

    setPaymentStep('processing');
    setProcessLogs([stepsList[0]]);
    setCurrentLogIndex(0);
  };

  // Log ticker rotation
  useEffect(() => {
    if (paymentStep !== 'processing') return;

    if (currentLogIndex < stepsList.length - 1) {
      const timer = setTimeout(() => {
        const nextId = currentLogIndex + 1;
        setCurrentLogIndex(nextId);
        setProcessLogs(prev => [...prev, stepsList[nextId]]);
      }, 1000 + Math.random() * 800); // realistic time ticker
      return () => clearTimeout(timer);
    } else {
      const timeout = setTimeout(() => {
        setPaymentStep('approved');
        const finalTimeout = setTimeout(() => {
          onPaymentSuccess({
            transactionId: 'TXN-2CO-' + Math.floor(10000000 + Math.random() * 90000000)
          });
        }, 1500);
        return () => clearTimeout(finalTimeout);
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [paymentStep, currentLogIndex]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 overflow-y-auto animate-fade-in font-sans">
      
      {/* Outer elegant payment frame */}
      <div className="bg-[#121212] border border-[#C5A059]/40 w-full max-w-4xl text-[#E5E5E5] grid grid-cols-1 md:grid-cols-12 rounded-sm overflow-hidden shadow-2xl relative">
        
        {/* Left Side: Order summary styled under signature Avenzo Editorial aesthetic */}
        <div className="md:col-span-5 bg-black p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-900">
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[#C5A059] uppercase tracking-[0.25em] block text-[9px] font-bold font-mono">Bespoke Acquisition Portal</span>
              <h2 className="serif text-white italic text-2xl font-medium">Avenzo Official</h2>
              <span className="text-[10px] text-neutral-500 block">Lahore, Pakistan</span>
            </div>

            <div className="border-t border-neutral-900/60 pt-4 space-y-4">
              <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-bold block">Assessed Consignment</span>
              
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Commodities subtotal:</span>
                  <span className="font-mono text-white">Rs. {cartSubtotal.toLocaleString()}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="font-mono">-Rs. {calculatedDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Insured transit:</span>
                  <span className="font-mono text-white">
                    {deliverySurcharge === 0 ? 'FREE' : `Rs. ${deliverySurcharge.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-neutral-900 pt-2 text-sm text-[#C5A059] font-bold">
                  <span>Total Amount:</span>
                  <span className="font-mono">PKR {totalInvoicedAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Cryptographic parameter authenticity indicators */}
            <div className="bg-neutral-950 p-4 border border-neutral-900 rounded space-y-2 text-[9px] font-mono text-neutral-500">
              <span className="text-neutral-400 font-bold block uppercase tracking-wider">🔒 Cryptographic Context</span>
              <div className="truncate">Order Ref: <span className="text-[#C5A059]">{session.orderRef}</span></div>
              <div className="truncate">Merchant Code: <span className="text-white">{session.sellerId}</span></div>
              <div className="relative group">
                <div className="truncate">Signature Header:</div>
                <div className="text-[8px] text-neutral-400 break-all bg-black p-1 border border-neutral-900 font-mono mt-0.5">
                  {session.signature}
                </div>
              </div>
              <div className="flex items-center gap-1.5 pt-1 text-[10px] text-neutral-400">
                <ShieldCheck size={11} className="text-green-500" />
                <span>PCI-DSS Compliant Redirection</span>
              </div>
            </div>
          </div>

          <div className="pt-6 text-[10px] text-neutral-500 space-y-1">
            <p className="flex items-center gap-1 text-[#C5A059]">
              <Globe size={11} /> <strong>Verifone Hosted Payment Solution</strong>
            </p>
            <p>Your connection is securely proxy encrypted. Card detail tokens are processed in complete isolation from general store files.</p>
          </div>
        </div>

        {/* Right Side: Interactive payment states */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-[#141414]">
          
          {/* STEP 1: CARD FORM */}
          {paymentStep === 'form' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-900 pb-3 flex justify-between items-center">
                <div>
                  <h3 className="text-[#C5A059] text-[11px] uppercase tracking-widest font-bold">Secure Billing Checkout</h3>
                  <p className="text-[10px] text-neutral-400">Visa, MasterCard, American Express and International Cards accepted.</p>
                </div>
                <div className="flex gap-1">
                  <span className={`px-1 rounded-sm text-[8px] font-bold border ${cardBrand === 'visa' ? 'border-[#C5A059] bg-[#C5A059]/10 text-white' : 'border-neutral-900 text-neutral-600'}`}>VISA</span>
                  <span className={`px-1 rounded-sm text-[8px] font-bold border ${cardBrand === 'mastercard' ? 'border-[#C5A059] bg-[#C5A059]/10 text-white' : 'border-neutral-900 text-neutral-600'}`}>MC</span>
                  <span className={`px-1 rounded-sm text-[8px] font-bold border ${cardBrand === 'amex' ? 'border-[#C5A059] bg-[#C5A059]/10 text-white' : 'border-neutral-900 text-neutral-600'}`}>AMEX</span>
                </div>
              </div>

              <form onSubmit={handleStartPayment} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    value={cardholder}
                    onChange={(e) => setCardholder(e.target.value)}
                    className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-3 w-full focus:outline-none focus:border-[#C5A059]"
                    placeholder="e.g. Muhammad Haris"
                  />
                </div>

                <div className="relative">
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-3 pl-10 w-full focus:outline-none focus:border-[#C5A059] font-mono text-center tracking-widest"
                      placeholder="4242 4242 4242 4242"
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600">
                      <CreditCard size={15} className={cardBrand !== 'generic' ? 'text-[#C5A059]' : ''} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase text-neutral-500 block mb-1">Expiry MM/YY</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={handleExpiryChange}
                      className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-3 w-full focus:outline-none focus:border-[#C5A059] text-center font-mono"
                      placeholder="12/28"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-neutral-500 block mb-1">Security Code (CVV)</label>
                    <input
                      type="password"
                      required
                      value={cvv}
                      onChange={handleCvvChange}
                      className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-3 w-full focus:outline-none focus:border-[#C5A059] text-center font-mono"
                      placeholder="•••"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-neutral-900">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-neutral-950 border border-neutral-800 text-neutral-400 px-4 py-3 hover:bg-neutral-900 transition-colors uppercase tracking-wider text-[11px] cursor-pointer"
                  >
                    Bail and Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-2 bg-[#C5A059] text-black font-bold px-6 py-3 hover:bg-[#DFBA73] transition-colors uppercase tracking-wider text-[11px] flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Lock size={12} /> Securely Pay PKR {totalInvoicedAmount.toLocaleString()}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: PROCESSING TICKER */}
          {paymentStep === 'processing' && (
            <div className="space-y-6 text-center py-8">
              <div className="flex items-center justify-center">
                <RefreshCw size={44} className="text-[#C5A059] animate-spin-slow" />
              </div>
              <div className="space-y-1">
                <h3 className="serif italic text-[#C5A059] text-xl">Authorizing Secure Transaction...</h3>
                <p className="text-[10px] text-neutral-400">Verifone Network Connection Active & Secured (TLS 1.3)</p>
              </div>

              {/* Progress Console logs tick list */}
              <div className="bg-black/80 border border-neutral-900 rounded p-4 font-mono text-[9px] text-left text-neutral-400 space-y-1.5 max-h-48 overflow-y-auto divide-y divide-neutral-900/60 font-sans">
                {processLogs.map((log, index) => (
                  <div key={index} className="pt-1 first:pt-0 leading-normal flex gap-2 items-start">
                    <span className="text-[#C5A059] font-bold shrink-0">&rarr;</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: APPROVED SCREEN */}
          {paymentStep === 'approved' && (
            <div className="space-y-4 text-center py-10 animate-scale-up">
              <div className="h-16 w-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-400 border border-green-500/30">
                <CheckCircle2 size={40} />
              </div>
              <div className="space-y-1">
                <h3 className="serif italic text-white text-2xl font-semibold">Payment Completed Successfully</h3>
                <p className="text-[11px] text-green-400 font-mono tracking-wider">✓ Secure token capture validated by Verifone Hub</p>
                <p className="text-xs text-neutral-400 pt-2">Returning you to Avenzo Official Store receipt shortly...</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
