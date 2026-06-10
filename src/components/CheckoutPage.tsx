import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import { CreditCard, CheckCircle2, ShieldAlert, BookOpen, Lock, Tag, Landmark, Smartphone, MessageSquare, ShieldCheck, RefreshCw, Globe, ArrowRight, CornerDownRight } from 'lucide-react';
import { VerifoneCheckoutGatewaySimulator } from './VerifoneCheckoutGatewaySimulator';

interface CheckoutPageProps {
  cart: CartItem[];
  cartSubtotal: number;
  onClearCart: () => void;
  onSubmitOrder: (orderDetails: any) => Promise<any>;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  cart,
  cartSubtotal,
  onClearCart,
  onSubmitOrder,
}) => {
  // Shipping details state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [notes, setNotes] = useState('');

  // Voucher details state
  const [voucher, setVoucher] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Bank Transfer' | 'JazzCash' | 'Easypaisa' | 'Stripe' | 'PayPal' | 'Verifone (2Checkout)'>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [simulatedEmail, setSimulatedEmail] = useState<any | null>(null);

  // Verifone Hosted Session State
  const [verifoneSession, setVerifoneSession] = useState<any | null>(null);

  // Credit Card mock inputs
  const [cardNo, setCardNo] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Mobile wallets mock inputs
  const [walletPhone, setWalletPhone] = useState('');

  const pakistanCities = [
    'Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi', 
    'Peshawar', 'Multan', 'Quetta', 'Sialkot', 'Gujranwala', 'Peshawar'
  ];

  const handleApplyVoucher = () => {
    const code = voucher.trim().toUpperCase();
    if (code === 'AVENZOVIP') {
      setDiscountPercent(10);
      setAppliedVoucher('AVENZOVIP (10% VIP discount applied)');
      setVoucher('');
    } else if (code === 'GULBERGLUXURE') {
      setDiscountPercent(15);
      setAppliedVoucher('GULBERGLUXURE (15% Gulberg Launch discount applied)');
      setVoucher('');
    } else {
      alert('Voucher not authenticated. Please specify valid Avenzo codes.');
    }
  };

  const calculatedDiscount = (cartSubtotal * discountPercent) / 100;
  const deliverySurcharge = cartSubtotal > 100000 ? 0 : 1500; // Free delivery above 100k
  const totalInvoicedAmount = cartSubtotal - calculatedDiscount + deliverySurcharge;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !address) {
      alert('Must complete all customer credentials before authorization.');
      return;
    }

    setIsSubmitting(true);

    if (paymentMethod === 'Verifone (2Checkout)') {
      try {
        let session = null;
        try {
          const resp = await fetch('/api/payment/2checkout/create-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customerName: name,
              customerEmail: email,
              customerPhone: phone,
              shippingAddress: address,
              city,
              items: cart,
              totalAmount: totalInvoicedAmount,
            }),
          });

          if (resp.ok) {
            session = await resp.json();
          }
        } catch (e) {
          console.log('Using local offline fallback for Verifone Checkout');
        }

        if (!session) {
          session = {
            sellerId: '250112345',
            orderRef: 'AVN-2CO-' + Math.floor(1000 + Math.random() * 9000) + '-' + ['LH', 'KHI', 'ISD', 'PE'][Math.floor(Math.random() * 4)],
            totalAmount: totalInvoicedAmount,
            currency: 'PKR',
            signature: 'local-simulated-signature-hash-' + Math.random().toString(36).substring(7),
            timestamp: Date.now(),
            customerDetails: {
              customerName: name,
              customerEmail: email,
              customerPhone: phone,
              shippingAddress: address,
              city
            }
          };
        }

        setVerifoneSession(session);
      } catch (err: any) {
        console.error(err);
        alert(err.message || 'Verifone (2Checkout) Initialization failed on secure channels.');
      } finally {
        setIsSubmitting(false);
      }
      return;
    }
    
    const payload = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: address,
      city,
      items: cart,
      totalAmount: totalInvoicedAmount,
      paymentMethod,
    };

    try {
      const resp = await onSubmitOrder(payload);
      if (resp && resp.order) {
        setCompletedOrder(resp.order);
        if (resp.EmailSimulated) {
          setSimulatedEmail(resp.EmailSimulated);
        }
        onClearCart();
      }
    } catch (err) {
      console.error(err);
      alert('Transaction error inside server datastore. Verification required.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // SUCCESS VIRTUAL INVOICE RECEIPT
  if (completedOrder) {
    return (
      <div className="max-w-3xl mx-auto bg-[#141414] border border-[#C5A059]/40 p-6 sm:p-10 rounded-sm text-neutral-300 animate-fade-in space-y-8 my-8">
        
        {/* Animated Checkmark branding header */}
        <div className="text-center space-y-3">
          <div className="h-14 w-14 bg-[#C5A059]/10 rounded-full flex items-center justify-center mx-auto text-[#C5A059] border border-[#C5A059]/30">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="serif text-3xl italic text-white font-medium">Bespoke Acquisition Completed</h2>
          <p className="text-xs text-neutral-400">
            Dear Client, thank you for investing with Avenzo. Your order queue is now custom authorized.
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-black border border-neutral-900 p-6 space-y-4">
          <div className="flex justify-between items-center text-xs text-neutral-500 border-b border-neutral-900 pb-3">
            <span>ORDER REFERENCE: <strong className="text-white font-mono">{completedOrder.id}</strong></span>
            <span>SHIPPING HUB: <strong className="text-white uppercase">{completedOrder.city}</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-neutral-500 uppercase tracking-widest block font-medium">Delivery Destination</span>
              <p className="text-neutral-300 font-semibold mt-1">{completedOrder.customerName}</p>
              <p className="text-neutral-400">{completedOrder.shippingAddress}, {completedOrder.city}, Pakistan</p>
              <p className="text-neutral-500 font-mono mt-0.5">{completedOrder.customerPhone}</p>
            </div>
            <div>
              <span className="text-neutral-500 uppercase tracking-widest block font-medium">Consignment Tracking</span>
              <p className="text-[#C5A059] font-mono font-bold mt-1 text-sm">{completedOrder.trackingNumber}</p>
              <p className="text-neutral-400 mt-1">Payment: <strong className="text-white">{completedOrder.paymentMethod}</strong></p>
              <p className="text-[10px] text-green-400 mt-0.5">✓ Inventory reserved and dispatched to shipment preparation</p>
            </div>
          </div>

          {/* Table Items Purchased */}
          <div className="border-t border-neutral-900 pt-4 space-y-2">
            <span className="text-[10px] uppercase text-neutral-500 tracking-widest block font-medium pb-1">Secured Assets</span>
            {completedOrder.items.map((it: any) => (
              <div key={it.product.id} className="flex justify-between items-center text-xs">
                <span className="text-white font-medium truncate max-w-[250px]">{it.product.name} (x{it.quantity})</span>
                <span className="text-neutral-400 font-mono">Rs. {(it.product.price * it.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Sum details */}
          <div className="border-t border-neutral-900 pt-3 flex justify-between items-center text-sm">
            <span className="text-white font-bold">Invoiced Sum</span>
            <span className="text-[#C5A059] text-base font-bold font-mono">
              Rs. {completedOrder.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* SIMULATED EMAIL NOTIFICATION DISPATCHED BLOCK */}
        {simulatedEmail && (
          <div className="bg-[#0A0A0A] border border-neutral-800 p-5 rounded space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span> Custom Mail Notification Dispatch Terminal
            </div>
            <div className="bg-neutral-950 p-4 rounded text-xs font-mono space-y-2 text-neutral-400 leading-relaxed border border-neutral-900">
              <p><strong className="text-white">To:</strong> {simulatedEmail.to}</p>
              <p><strong className="text-white">Subject:</strong> {simulatedEmail.subject}</p>
              <hr className="border-neutral-900 my-2" />
              <p className="whitespace-pre-line text-neutral-300">{simulatedEmail.body}</p>
            </div>
            <span className="text-[10px] text-neutral-500 italic block text-right mt-1">* Avenzo automatic email client dispatch simulated live.</span>
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-neutral-500 mb-4">
            You may trace your cargo status at any time inside the <strong className="text-[#C5A059]">Client Workspace</strong> using your tracking number.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-[#C5A059] text-black hover:bg-[#DFBA73] font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            Acknowledge Receipt & Return
          </button>
        </div>

      </div>
    );
  }

  // VERIFONE (2CHECKOUT) INTERACTIVE SECURE GATEWAY OVERLAY
  if (verifoneSession) {
    return (
      <VerifoneCheckoutGatewaySimulator
        session={verifoneSession}
        cartSubtotal={cartSubtotal}
        discountPercent={discountPercent}
        calculatedDiscount={calculatedDiscount}
        deliverySurcharge={deliverySurcharge}
        totalInvoicedAmount={totalInvoicedAmount}
        onCancel={() => setVerifoneSession(null)}
        onPaymentSuccess={async (paymentResult) => {
          const payload = {
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            shippingAddress: address,
            city,
            items: cart,
            totalAmount: totalInvoicedAmount,
            paymentMethod: 'Verifone (2Checkout)' as any,
            notes: `Verifone (2Checkout) Authid: ${paymentResult.transactionId} | Seller Session Ref: ${verifoneSession.orderRef}`
          };

          try {
            const resp = await onSubmitOrder(payload);
            if (resp && resp.order) {
              setCompletedOrder(resp.order);
              if (resp.EmailSimulated) {
                setSimulatedEmail(resp.EmailSimulated);
              }
              onClearCart();
            }
          } catch (err) {
            console.error(err);
            alert('Transaction completed but order filing on backend database timed out.');
          } finally {
            setVerifoneSession(null);
          }
        }}
      />
    );
  }

  // CART IS EMPTY SCREEN
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <h2 className="serif text-2xl italic text-white">Your Checkout Portal is Empty</h2>
        <p className="text-neutral-400 text-xs">
          Select elegant products from our boutique pages before requesting custom acquisitions.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      <h2 className="serif text-3xl italic text-white mb-8">Bespoke Acquisition Portal</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form credentials */}
        <div className="lg:col-span-7 bg-[#141414] border border-neutral-900 p-6 sm:p-8 rounded-sm space-y-6">
          <div className="border-b border-neutral-900 pb-3">
            <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">1. Client Shipping Credentials</h3>
            <p className="text-[11px] text-neutral-400 mt-0.5">Please provide complete destination vectors across Pakistan.</p>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase text-neutral-500 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-3 w-full focus:outline-none focus:border-[#C5A059]"
                  placeholder="e.g., Zain-ul-Abideen"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-neutral-500 block mb-1">Priority Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-3 w-full focus:outline-none focus:border-[#C5A059]"
                  placeholder="e.g., client@avenzo.pk"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase text-neutral-500 block mb-1">Cellular Hotline (WhatsApp Preferred)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-3 w-full focus:outline-none focus:border-[#C5A059]"
                  placeholder="e.g., +92-300-1234567"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-[#C5A059] block mb-1">Destination Metropolitan Hub</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-3 w-full focus:outline-none focus:border-[#C5A059]"
                >
                  {pakistanCities.map((c) => (
                    <option key={c} value={c}>{c} Hub</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Physical Residential/Executive Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-3 w-full focus:outline-none focus:border-[#C5A059]"
                placeholder="House No, Block ID, Phase / Sector, Street Name..."
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Custom Delivery Annotations (Optional)</label>
              <textarea
                rows={1.5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-3 w-full focus:outline-none focus:border-[#C5A059] resize-none"
                placeholder="e.g., Please coordinate call 1 hour before Lahorite courier courier arrives..."
              ></textarea>
            </div>

            {/* PAYMENT METHODS SELECTOR CARD */}
            <div className="border-t border-neutral-900 pt-6 space-y-4">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">2. Select Imperial Payment Gateway</h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">Choose Cash on Delivery, Wallet billing, or securely register simulated Cards.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-sm transition-all ${
                    paymentMethod === 'Cash on Delivery' 
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white' 
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <MessageSquare size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">Cash On Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Bank Transfer')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-sm transition-all ${
                    paymentMethod === 'Bank Transfer' 
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white' 
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Landmark size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">Bank Wire Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('JazzCash')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-sm transition-all ${
                    paymentMethod === 'JazzCash' 
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white' 
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smartphone size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">JazzCash Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Easypaisa')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-sm transition-all ${
                    paymentMethod === 'Easypaisa' 
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white' 
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Smartphone size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">Easypaisa Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Stripe')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-sm transition-all ${
                    paymentMethod === 'Stripe' 
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white' 
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <CreditCard size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">Stripe (Card Gateway)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Verifone (2Checkout)')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-sm transition-all ${
                    paymentMethod === 'Verifone (2Checkout)' 
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white font-semibold' 
                      : 'border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
                  }`}
                >
                  <CreditCard className="text-[#C5A059]" size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-semibold">Verifone (2Checkout)</span>
                </button>
              </div>

              {/* DYNAMIC PAYMENT PARAMETERS */}
              {paymentMethod === 'Verifone (2Checkout)' && (
                <div className="bg-neutral-950 p-4 border border-[#C5A059]/20 rounded space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase font-mono tracking-wider">
                    <span className="text-white flex items-center gap-1">💳 Verifone (2Checkout) Secure Portal</span>
                    <span className="text-green-500 font-bold flex items-center gap-1">● Redirection Ready</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed font-sans">
                    Upon clicking authorize, our system will generate secure cryptographic signatures and redirect you to the official **Verifone (2Checkout) Hosted Billing Gateway**. This channel fully handles instant purchases via local or international **Visa, MasterCard, American Express**, or credit lines.
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-neutral-900/60 pt-2 text-[9px] text-[#C5A059] font-mono">
                    <span className="bg-black border border-neutral-800 px-2 py-0.5 whitespace-nowrap text-neutral-400">Merchant Code: Active</span>
                    <span className="bg-black border border-[#C5A059]/20 px-2 py-0.5 whitespace-nowrap">&bull; Visa Accepted</span>
                    <span className="bg-black border border-[#C5A059]/20 px-2 py-0.5 whitespace-nowrap">&bull; MasterCard Accepted</span>
                    <span className="bg-black border border-[#C5A059]/20 px-2 py-0.5 whitespace-nowrap">&bull; Amex Accepted</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'Stripe' && (
                <div className="bg-neutral-950 p-4 border border-neutral-800 rounded space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase font-mono tracking-wider">
                    <span>💳 Sandbox Secured Credit Card Processing</span>
                    <span className="text-amber-500 font-bold">Simulator Active</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[9px] uppercase text-neutral-500">Credit Card Number</label>
                      <input
                        type="text"
                        value={cardNo}
                        onChange={(e) => setCardNo(e.target.value)}
                        className="bg-[#0A0A0A] border border-neutral-800 p-2 text-xs text-white w-full text-center mt-1 focus:outline-none focus:border-[#C5A059]"
                        placeholder="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] uppercase text-neutral-500">Expiry MM/YY</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="bg-[#0A0A0A] border border-neutral-800 p-2 text-xs text-white w-full text-center mt-1 focus:outline-none focus:border-[#C5A059]"
                        placeholder="12/28"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'Bank Transfer' && (
                <div className="bg-neutral-950 p-4 border border-neutral-800 rounded text-xs space-y-2 text-neutral-400">
                  <span className="text-white font-bold uppercase tracking-wide block">Avenzo Corporate Escrow Account</span>
                  <p>Transfer the final total sum directly to Bank Alfalah, and our luxury audit desk will instantly authorize consignment dispatch once validated.</p>
                  <div className="bg-black/90 p-3 rounded font-mono space-y-1 my-1 text-white text-[11px] border border-neutral-900">
                    <div>Bank Name: Bank Alfalah Premier Block Gulberg</div>
                    <div>Account Title: AVENZO CO. OFFICIAL</div>
                    <div>IBAN: PK42 ALFH 1002 9840 2910 03</div>
                    <div>SWIFT: ALFH-PK-LHR-XXX</div>
                  </div>
                </div>
              )}

              {(paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa') && (
                <div className="bg-neutral-950 p-4 border border-neutral-800 rounded space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-neutral-500 uppercase font-mono">
                    <span>📱 Wallet Direct Authorization</span>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase text-neutral-500">Linked Account Mobile Number (Pakistan)</label>
                    <input
                      type="tel"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      className="bg-[#0A0A0A] border border-neutral-800 p-3 text-xs text-white w-full mt-1 focus:outline-none focus:border-[#C5A059]"
                      placeholder="03001234567"
                    />
                  </div>
                  <p className="text-[9px] text-neutral-500 italic">* You will receive an automated PIN pop-up on your device immediately after submitting.</p>
                </div>
              )}
            </div>

            {/* AUTHORIZE ACQUISITION PUSH BUTTON */}
            <div className="pt-4 border-t border-neutral-900">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#C5A059] text-black font-bold uppercase tracking-widest text-xs py-4 hover:bg-[#DFBA73] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock size={12} /> {isSubmitting ? 'Verifying Safe Channels...' : `Authorize Imperial Transaction (Rs. ${totalInvoicedAmount.toLocaleString()})`}
              </button>
            </div>
          </form>

        </div>

        {/* Right Product Checkout cart overview list */}
        <div className="lg:col-span-5 bg-black border border-neutral-900 p-6 space-y-6">
          <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Invoiced Summary</h3>

          {/* Cart items list */}
          <div className="space-y-4 divide-y divide-neutral-900 max-h-60 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 pt-4 first:pt-0">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-12 w-12 object-cover rounded border border-neutral-800"
                />
                <div className="flex-1 space-y-1 min-w-0">
                  <h4 className="text-white text-xs font-semibold truncate hover:text-[#C5A059] transition-colors">
                    {item.product.name}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                    <span>Qty: {item.quantity}</span>
                    <span className="text-[#C5A059] font-semibold">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Voucher input block */}
          <div className="bg-neutral-950 border border-neutral-900 p-4 rounded space-y-2">
            <label className="text-[10px] uppercase text-neutral-500 tracking-wider font-semibold flex items-center gap-1">
              <Tag size={11} className="text-[#C5A059]" /> Apply Custom Client Voucher
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                className="bg-[#0A0A0A] border border-neutral-800 text-xs px-3 py-2 text-white flex-1 focus:outline-none focus:border-[#C5A059]"
                placeholder="e.g., AVENZOVIP"
              />
              <button
                onClick={handleApplyVoucher}
                className="bg-neutral-900 hover:bg-[#C5A059] border border-neutral-800 text-[10px] uppercase text-neutral-300 hover:text-black tracking-widest px-4 font-bold transition-all shrink-0 font-sans cursor-pointer"
              >
                Apply
              </button>
            </div>
            {appliedVoucher && (
              <span className="text-[10px] text-green-400 font-bold block pt-1">{appliedVoucher}</span>
            )}
            <p className="text-[9px] text-neutral-500 italic mt-1 font-sans">
              * Try code "AVENZOVIP" for 10% VIP or "GULBERGLUXURE" for 15% launch discounts.
            </p>
          </div>

          {/* Aggregated Totals summary */}
          <div className="space-y-2 text-xs pt-4 border-t border-neutral-900">
            <div className="flex justify-between">
              <span className="text-neutral-400">Products Subtotal:</span>
              <span className="font-mono text-neutral-200">Rs. {cartSubtotal.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-green-400 font-semibold">
                <span>Client Discount ({discountPercent}%):</span>
                <span className="font-mono">-Rs. {calculatedDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-neutral-400">Insured Delivery Courier:</span>
              <span className="font-mono text-neutral-200">
                {deliverySurcharge === 0 ? <strong className="text-[#C5A059] uppercase text-[10px]">FREE</strong> : `Rs. ${deliverySurcharge.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-neutral-900 text-sm">
              <span className="text-white font-bold uppercase tracking-wider">Final Total Sum:</span>
              <span className="text-[#C5A059] font-bold font-mono text-base">
                Rs. {totalInvoicedAmount.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
export default CheckoutPage;
