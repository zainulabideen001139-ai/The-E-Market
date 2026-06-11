import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import { CreditCard, CheckCircle2, ShieldAlert, BookOpen, Lock, Tag, Landmark, Smartphone, MessageSquare, ShieldCheck, RefreshCw, Globe, ArrowRight, CornerDownRight } from 'lucide-react';

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
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Bank Transfer' | 'JazzCash' | 'Easypaisa' | 'Credit / Debit Card (Safepay)'>('Cash on Delivery');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);
  const [simulatedEmail, setSimulatedEmail] = useState<any | null>(null);

  // Mobile wallets mock inputs
  const [walletPhone, setWalletPhone] = useState('');

  const pakistanCities = [
    'Lahore', 'Karachi', 'Islamabad', 'Faisalabad', 'Rawalpindi', 
    'Peshawar', 'Multan', 'Quetta', 'Sialkot', 'Gujranwala'
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
    
    const payload = {
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: address,
      city,
      items: cart,
      totalAmount: totalInvoicedAmount,
      paymentMethod,
      notes,
    };

    try {
      const resp = await onSubmitOrder(payload);
      if (resp && resp.checkoutUrl) {
        // Redirect the customer to the Safepay checkout or simulator URL
        window.location.href = resp.checkoutUrl;
        return;
      }
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
      <div className="max-w-3xl mx-auto bg-white border border-indigo-100 p-6 sm:p-10 rounded-2xl text-gray-700 animate-fade-in space-y-8 my-8 shadow-lg">
        
        {/* Animated Checkmark branding header */}
        <div className="text-center space-y-3">
          <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 border border-emerald-200">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="serif text-3xl italic text-gray-900 font-semibold">Bespoke Acquisition Completed</h2>
          <p className="text-xs text-gray-500 font-medium">
            Dear Client, thank you for investing with Avenzo. Your order queue is now custom authorized.
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-gray-50 border border-gray-150 p-6 rounded-xl space-y-4 shadow-xs">
          <div className="flex justify-between items-center text-xs text-gray-500 border-b border-gray-250 pb-3">
            <span>ORDER REFERENCE: <strong className="text-gray-900 font-mono font-bold">{completedOrder.id}</strong></span>
            <span>SHIPPING HUB: <strong className="text-gray-900 uppercase font-bold">{completedOrder.city}</strong></span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <span className="text-gray-400 uppercase tracking-widest block font-bold text-[9px]">Delivery Destination</span>
              <p className="text-gray-800 font-bold mt-1 text-sm">{completedOrder.customerName}</p>
              <p className="text-gray-600 font-medium">{completedOrder.shippingAddress}, {completedOrder.city}, Pakistan</p>
              <p className="text-gray-500 font-mono mt-0.5">{completedOrder.customerPhone}</p>
            </div>
            <div>
              <span className="text-gray-400 uppercase tracking-widest block font-bold text-[9px]">Consignment Tracking</span>
              <p className="text-indigo-600 font-mono font-bold mt-1 text-sm">{completedOrder.trackingNumber}</p>
              <p className="text-gray-650 mt-1 font-medium text-gray-600">Payment: <strong className="text-gray-900">{completedOrder.paymentMethod}</strong></p>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">✓ Cargo reserved and dispatched to shipment preparation</p>
            </div>
          </div>

          {/* Table Items Purchased */}
          <div className="border-t border-gray-150 pt-4 space-y-2">
            <span className="text-[10px] uppercase text-gray-400 tracking-widest block font-semibold pb-1">Secured Assets</span>
            {completedOrder.items.map((it: any) => (
              <div key={it.product.id} className="flex justify-between items-center text-xs">
                <span className="text-gray-800 font-medium truncate max-w-[250px]">{it.product.name} (x{it.quantity})</span>
                <span className="text-gray-600 font-mono font-medium">Rs. {(it.product.price * it.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Sum details */}
          <div className="border-t border-gray-150 pt-3 flex justify-between items-center text-sm font-sans">
            <span className="text-gray-900 font-bold uppercase tracking-wider">Invoiced Sum</span>
            <span className="text-indigo-600 text-base font-bold font-mono">
              Rs. {completedOrder.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* SIMULATED EMAIL NOTIFICATION DISPATCHED BLOCK */}
        {simulatedEmail && (
          <div className="bg-blue-50/50 border border-blue-100 p-5 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-800">
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span> Custom Mail Notification Dispatch Terminal
            </div>
            <div className="bg-white p-4 rounded-xl text-xs font-mono space-y-2 text-gray-700 leading-relaxed border border-blue-50">
              <p><strong className="text-blue-900">To:</strong> {simulatedEmail.to}</p>
              <p><strong className="text-blue-900">Subject:</strong> {simulatedEmail.subject}</p>
              <hr className="border-gray-100 my-2" />
              <p className="whitespace-pre-line text-gray-800">{simulatedEmail.body}</p>
            </div>
            <span className="text-[10px] text-blue-600 italic block text-right mt-1 font-sans">* Avenzo automatic email client dispatch simulated live.</span>
          </div>
        )}

        <div className="text-center pt-2 font-sans">
          <p className="text-xs text-gray-500 mb-4 font-medium">
            You may trace your cargo status at any time inside the <strong className="text-indigo-600">Client Workspace</strong> using your tracking number.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs uppercase tracking-widest transition-all rounded-xl cursor-pointer shadow-sm"
          >
            Acknowledge Receipt & Return
          </button>
        </div>

      </div>
    );
  }

  // CART IS EMPTY SCREEN
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4 animate-fade-in font-sans">
        <h2 className="serif text-2xl italic text-gray-900 font-semibold">Your Checkout Portal is Empty</h2>
        <p className="text-gray-500 text-xs font-medium">
          Select elegant products from our boutique pages before requesting custom acquisitions.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-fade-in">
      <h2 className="serif text-3xl italic text-gray-900 mb-8 font-semibold select-none animate-fade-in">Bespoke Acquisition Portal</h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start font-sans">
        
        {/* Left Form credentials */}
        <div className="lg:col-span-7 bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-md space-y-6">
          <div className="border-b border-gray-150 pb-3">
            <h3 className="text-xs uppercase tracking-widest text-indigo-600 font-bold">1. Client Shipping Credentials</h3>
            <p className="text-[11px] text-gray-500 mt-0.5 font-medium font-sans">Please provide complete destination vectors across Pakistan.</p>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans font-medium">
              <div>
                <label className="text-[10px] uppercase text-gray-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white border border-gray-200 text-xs text-gray-800 p-3 rounded-xl w-full focus:outline-none focus:border-indigo-600 shadow-xs"
                  placeholder="e.g., Zain-ul-Abideen"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-gray-400 block mb-1">Priority Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border border-gray-200 text-xs text-gray-800 p-3 rounded-xl w-full focus:outline-none focus:border-indigo-600 shadow-xs"
                  placeholder="e.g., client@avenzo.pk"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans font-medium">
              <div>
                <label className="text-[10px] uppercase text-gray-400 block mb-1">Cellular Hotline (WhatsApp Preferred)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white border border-gray-200 text-xs text-gray-800 p-3 rounded-xl w-full focus:outline-none focus:border-indigo-600 shadow-xs"
                  placeholder="e.g., +92-300-1234567"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-indigo-600 block mb-1">Destination Metropolitan Hub</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="bg-[#F8FAFC] border border-gray-200 text-xs text-gray-800 p-3 rounded-xl w-full focus:outline-none"
                >
                  {pakistanCities.map((c) => (
                    <option key={c} value={c}>{c} Hub</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs font-sans font-medium">
              <label className="text-[10px] uppercase text-gray-400 block mb-1">Physical Residential/Executive Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="bg-white border border-gray-200 text-xs text-gray-800 p-3 rounded-xl w-full focus:outline-none focus:border-indigo-600 shadow-xs"
                placeholder="House No, Block ID, Phase / Sector, Street Name..."
              />
            </div>

            <div className="text-xs font-sans font-medium">
              <label className="text-[10px] uppercase text-gray-400 block mb-1">Custom Delivery Annotations (Optional)</label>
              <textarea
                rows={1.5}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="bg-white border border-gray-200 text-xs text-gray-800 p-3 rounded-xl w-full focus:outline-none focus:border-indigo-600 shadow-xs resize-none"
                placeholder="e.g., Please coordinate call 1 hour before Lahorite courier arrives..."
              ></textarea>
            </div>

            {/* PAYMENT METHODS SELECTOR CARD */}
            <div className="border-t border-gray-150 pt-6 space-y-4 font-sans">
              <div>
                <h3 className="text-xs uppercase tracking-widest text-indigo-600 font-bold">2. Select Imperial Payment Method</h3>
                <p className="text-[11px] text-gray-500 mt-0.5 font-medium">Please select Cash on Delivery or offline Bank Wire Transfer to checkout instantly.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('Cash on Delivery')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-xl transition-all cursor-pointer ${
                    paymentMethod === 'Cash on Delivery' 
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold' 
                      : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-55'
                  }`}
                >
                  <MessageSquare size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Cash On Delivery</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Bank Transfer')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-xl transition-all cursor-pointer ${
                    paymentMethod === 'Bank Transfer' 
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold' 
                      : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-55'
                  }`}
                >
                  <Landmark size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Bank Wire Transfer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('JazzCash')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-xl transition-all cursor-pointer ${
                    paymentMethod === 'JazzCash' 
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold' 
                      : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-55'
                  }`}
                >
                  <Smartphone size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">JazzCash Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Easypaisa')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-xl transition-all cursor-pointer ${
                    paymentMethod === 'Easypaisa' 
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold' 
                      : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-55'
                  }`}
                >
                  <Smartphone size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Easypaisa Wallet</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('Credit / Debit Card (Safepay)')}
                  className={`border p-3.5 flex flex-col justify-between h-20 text-left rounded-xl transition-all cursor-pointer ${
                    paymentMethod === 'Credit / Debit Card (Safepay)' 
                      ? 'border-indigo-500 bg-indigo-50/50 text-indigo-700 font-bold' 
                      : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-55'
                  }`}
                >
                  <CreditCard size={16} />
                  <span className="text-[10px] uppercase tracking-wider font-bold">Credit/Debit Card (Safepay)</span>
                </button>
              </div>

              {/* DYNAMIC PAYMENT PARAMETERS */}
              {paymentMethod === 'Credit / Debit Card (Safepay)' && (
                <div className="bg-indigo-50/30 p-4 border border-indigo-100 rounded-xl space-y-2 text-xs text-gray-600">
                  <span className="text-indigo-850 text-indigo-800 font-bold uppercase tracking-wide block font-sans">Secure Safepay Sandbox Gateway</span>
                  <p className="font-medium font-sans text-gray-600">
                    Your card parameters are fully enciphered. You will be redirected to Safepay's secure sandbox server to complete this purchase securely.
                  </p>
                  <span className="text-[10px] text-emerald-600 font-mono font-bold block pt-1">
                    ✓ PCI-DSS Compliant Secure Acquiring Channel
                  </span>
                </div>
              )}

              {paymentMethod === 'Cash on Delivery' && (
                <div className="bg-emerald-50/30 p-4 border border-emerald-100 rounded-xl space-y-2 text-xs text-gray-600">
                  <span className="text-emerald-800 font-bold uppercase tracking-wide block font-sans">Cash on Delivery Verification</span>
                  <p className="font-medium font-sans">Pay with cash directly to our logistics rep upon receiving your premium luxury consignment. Shipping and packing will be dispatched inside 24 hours.</p>
                </div>
              )}

              {paymentMethod === 'Bank Transfer' && (
                <div className="bg-indigo-50/30 p-4 border border-indigo-100 rounded-xl text-xs space-y-2 text-gray-600">
                  <span className="text-indigo-800 font-bold uppercase tracking-wide block font-sans">Avenzo Corporate Escrow Account</span>
                  <p className="font-medium text-gray-600">Transfer the final total sum directly to Bank Alfalah, and our luxury dispatch desk will instantly authorize consignment dispatch once validated.</p>
                  <div className="bg-white p-3 rounded-lg font-mono space-y-1 my-1 text-gray-800 text-[11px] border border-gray-200 shadow-xs">
                    <div>Bank Name: Bank Alfalah Premier Block Gulberg</div>
                    <div>Account Title: <strong className="text-gray-900">AVENZO CO. OFFICIAL</strong></div>
                    <div>IBAN: PK42 ALFH 1002 9840 2910 03</div>
                    <div>SWIFT: ALFH-PK-LHR-XXX</div>
                  </div>
                </div>
              )}

              {(paymentMethod === 'JazzCash' || paymentMethod === 'Easypaisa') && (
                <div className="bg-indigo-50/30 p-4 border border-indigo-100 rounded-xl space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase font-mono">
                    <span>📱 Wallet Direct Authorization</span>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase text-gray-400 block font-bold">Linked Account Mobile Number (Pakistan)</label>
                    <input
                      type="tel"
                      value={walletPhone}
                      onChange={(e) => setWalletPhone(e.target.value)}
                      className="bg-white border border-gray-200 p-3 rounded-xl text-xs text-gray-800 w-full mt-1 focus:outline-none focus:border-indigo-600"
                      placeholder="03001234567"
                    />
                  </div>
                  <p className="text-[9px] text-gray-450 italic font-medium font-sans">* You will receive an automated PIN pop-up on your device immediately after submitting.</p>
                </div>
              )}
            </div>

            {/* AUTHORIZE ACQUISITION PUSH BUTTON */}
            <div className="pt-4 border-t border-gray-150">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs py-4 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-xl font-sans"
              >
                <Lock size={12} /> {isSubmitting ? 'Verifying Safe Channels...' : `Authorize Imperial Transaction (Rs. ${totalInvoicedAmount.toLocaleString()})`}
              </button>
            </div>
          </form>

        </div>

        {/* Right Product Checkout cart overview list */}
        <div className="lg:col-span-5 bg-white border border-gray-200 p-6 space-y-6 rounded-2xl shadow-md font-sans">
          <h3 className="text-xs uppercase tracking-widest text-indigo-600 font-bold">Invoiced Summary</h3>

          {/* Cart items list */}
          <div className="space-y-4 divide-y divide-gray-150 max-h-60 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.product.id} className="flex gap-4 pt-4 first:pt-0">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="h-12 w-12 object-cover rounded-xl border border-gray-200"
                />
                <div className="flex-1 space-y-1 min-w-0">
                  <h4 className="text-gray-900 text-xs font-bold truncate hover:text-indigo-605 transition-colors">
                    {item.product.name}
                  </h4>
                  <div className="flex justify-between items-center text-[10px] text-gray-500 font-mono">
                    <span>Qty: {item.quantity}</span>
                    <span className="text-indigo-600 font-bold">
                      Rs. {(item.product.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Voucher input block */}
          <div className="bg-gray-50 border border-gray-150 p-4 rounded-xl space-y-2">
            <label className="text-[10px] uppercase text-gray-600 tracking-wider font-bold flex items-center gap-1">
              <Tag size={11} className="text-indigo-600" /> Apply Custom Client Voucher
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
                className="bg-white border border-gray-205 border-gray-200 rounded-xl text-xs px-3 py-2 text-gray-800 flex-1 focus:outline-none focus:border-indigo-600 font-mono font-medium"
                placeholder="e.g., AVENZOVIP"
              />
              <button
                onClick={handleApplyVoucher}
                className="bg-indigo-600 hover:bg-indigo-700 text-[10px] uppercase text-white tracking-widest px-4 font-bold transition-all shrink-0 font-sans cursor-pointer rounded-xl"
              >
                Apply
              </button>
            </div>
            {appliedVoucher && (
              <span className="text-[10px] text-emerald-600 font-bold block pt-1">{appliedVoucher}</span>
            )}
            <p className="text-[9px] text-gray-450 italic mt-1 font-sans">
              * Try code "AVENZOVIP" for 10% VIP or "GULBERGLUXURE" for 15% launch discounts.
            </p>
          </div>

          {/* Aggregated Totals summary */}
          <div className="space-y-2 text-xs pt-4 border-t border-gray-150">
            <div className="flex justify-between font-medium">
              <span className="text-gray-500">Products Subtotal:</span>
              <span className="font-mono text-gray-800">Rs. {cartSubtotal.toLocaleString()}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Client Discount ({discountPercent}%):</span>
                <span className="font-mono">-Rs. {calculatedDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between font-medium">
              <span className="text-gray-500">Insured Delivery Courier:</span>
              <span className="font-mono text-gray-800">
                {deliverySurcharge === 0 ? <strong className="text-emerald-600 uppercase text-[10px] font-bold">FREE</strong> : `Rs. ${deliverySurcharge.toLocaleString()}`}
              </span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-150 text-sm">
              <span className="text-gray-900 font-bold uppercase tracking-wider">Final Total Sum:</span>
              <span className="text-indigo-600 font-bold font-mono text-base">
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
