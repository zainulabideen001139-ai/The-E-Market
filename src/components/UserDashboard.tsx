import React, { useState } from 'react';
import { User, Order, Product } from '../types';
import { Star, Eye, Calendar, UserCheck, ShieldAlert, Heart, Truck, HelpCircle, Package, Search } from 'lucide-react';

interface UserDashboardProps {
  user: User | null;
  orders: Order[];
  wishlist: Product[];
  onSelectProduct: (product: Product) => void;
  onRemoveFromWishlist: (p: Product) => void;
  onLogin: (email: string, pass: string) => Promise<boolean>;
  onRegister: (payload: any) => Promise<boolean>;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  user,
  orders,
  wishlist,
  onSelectProduct,
  onRemoveFromWishlist,
  onLogin,
  onRegister,
}) => {
  // Auth view toggles
  const [isRegistering, setIsRegistering] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('Lahore');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tracking query search state
  const [trackQuery, setTrackQuery] = useState('');
  const [foundOrders, setFoundOrders] = useState<Order[] | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const ok = await onLogin(authEmail, authPass);
      if (!ok) {
        setErrorMsg('Invalid credentials or authorization. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Auth communication error on server.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!regName || !authEmail || !authPass) {
      setErrorMsg('Please specify Name, Email and Password.');
      return;
    }
    try {
      const ok = await onRegister({
        name: regName,
        email: authEmail,
        password: authPass,
        phone: regPhone,
        address: regAddress,
        city: regCity
      });
      if (ok) {
        setSuccessMsg('✓ Account registered successfully! Authenticating...');
        setTimeout(() => {
          setSuccessMsg('');
        }, 3000);
      } else {
        setErrorMsg('Account registration declined by security check.');
      }
    } catch (err) {
      setErrorMsg('Registration error on server.');
    }
  };

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery) return;
    setIsTracking(true);
    setFoundOrders(null);
    try {
      const resp = await fetch(`/api/orders/track/${encodeURIComponent(trackQuery.trim())}`);
      if (resp.ok) {
        const data = await resp.json();
        setFoundOrders(data);
      } else {
        setFoundOrders([]);
      }
    } catch (err) {
      console.error(err);
      setFoundOrders([]);
    } finally {
      setIsTracking(false);
    }
  };

  // IF NOT LOGGED IN, RENDER AUTHENTICATION FORMS
  if (!user || typeof user !== 'object' || Array.isArray(user) || !user.email) {
    return (
      <div className="max-w-md mx-auto bg-[#141414] border border-neutral-900 rounded-sm p-6 sm:p-8 space-y-6 my-10 animate-fade-in shadow-2xl">
        <div className="text-center space-y-1.5">
          <h2 className="serif text-3xl font-medium italic text-white">Client Sanctuary Workspace</h2>
          <p className="text-xs text-neutral-400">
            {isRegistering ? 'Compose your Avenzo VIP profile parameters.' : 'Login to access order history, tracking records, and wishlist.'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-900/50 p-2.5 rounded-sm text-xs text-red-400 text-center font-sans">
            ⚠ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-950/40 border border-green-900/50 p-2.5 rounded-sm text-xs text-green-400 text-center font-sans">
            {successMsg}
          </div>
        )}

        {isRegistering ? (
          // VIP REGISTRATION FORM
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="bg-[#0A0A0A] border border-neutral-800 text-xs px-3 py-2.5 w-full text-white focus:outline-none focus:border-[#C5A059]"
                placeholder="e.g., Zain-ul-Abideen"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase text-neutral-500 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="bg-[#0A0A0A] border border-neutral-800 text-xs px-3 py-2.5 w-full text-white focus:outline-none focus:border-[#C5A059]"
                  placeholder="name@gmail.com"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-neutral-500 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  className="bg-[#0A0A0A] border border-neutral-800 text-xs px-3 py-2.5 w-full text-white focus:outline-none focus:border-[#C5A059]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase text-neutral-500 block mb-1">Mobile Hotline</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="bg-[#0A0A0A] border border-neutral-800 text-xs px-3 py-2.5 w-full text-white focus:outline-none focus:border-[#C5A059]"
                  placeholder="03001234567"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-neutral-500 block mb-1">Metro Hub</label>
                <select
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="bg-[#0A0A0A] border border-neutral-800 text-xs px-3 py-2.5 w-full text-white focus:outline-none focus:border-[#C5A059]"
                >
                  <option value="Lahore">Lahore Hub</option>
                  <option value="Karachi">Karachi Hub</option>
                  <option value="Islamabad">Islamabad Hub</option>
                  <option value="Faisalabad">Faisalabad Hub</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Residential Address</label>
              <input
                type="text"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                className="bg-[#0A0A0A] border border-neutral-800 text-xs px-3 py-2.5 w-full text-white focus:outline-none focus:border-[#C5A059]"
                placeholder="House, Street, Area..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C5A059] hover:bg-[#DFBA73] text-black font-bold uppercase tracking-wider text-xs py-3 mt-2 cursor-pointer transition-colors"
            >
              Compose VIP Profile
            </button>
            
            <p className="text-center text-neutral-500 text-[11px] pt-2">
              Already possess credentials?{' '}
              <button type="button" onClick={() => setIsRegistering(false)} className="text-[#C5A059] hover:underline font-semibold">
                Sign In Instead
              </button>
            </p>
          </form>
        ) : (
          // STANDARD LOGIN FORM
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans">
            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="bg-[#0A0A0A] border border-neutral-800 text-xs px-3 py-2.5 w-full text-white focus:outline-none focus:border-[#C5A059]"
                placeholder="e.g., customer@avenzo.pk"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Password</label>
              <input
                type="password"
                required
                value={authPass}
                onChange={(e) => setAuthPass(e.target.value)}
                className="bg-[#0A0A0A] border border-neutral-800 text-xs px-3 py-2.5 w-full text-white focus:outline-none focus:border-[#C5A059]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#C5A059] hover:bg-[#DFBA73] text-black font-bold uppercase tracking-wider text-xs py-3 mt-2 cursor-pointer transition-colors"
            >
              Authorize Secure Log In
            </button>

            <div className="bg-neutral-950 p-3 rounded text-[10px] text-neutral-500 text-center leading-normal border border-neutral-900 uppercase tracking-wide">
              <span>Admin Profile: <strong>admin@avenzo.pk</strong> &middot; Pass: <strong>admin</strong></span>
            </div>
            
            <p className="text-center text-neutral-500 text-[11px] pt-1">
              New client?{' '}
              <button type="button" onClick={() => setIsRegistering(true)} className="text-[#C5A059] hover:underline font-semibold">
                Compose Profile here
              </button>
            </p>
          </form>
        )}
      </div>
    );
  }

  // IF LOGGED IN: RENDER COMPLETE CLIENT DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 animate-fade-in text-neutral-300">
      
      {/* 1. Header user profile badge info card */}
      <div className="bg-[#141414] border border-neutral-900 p-6 sm:p-8 rounded-sm rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-mono font-bold leading-none flex items-center gap-1.5 matches">
            <UserCheck size={12} /> Authenticated Avenzo Client Member
          </span>
          <h2 className="serif text-3xl italic text-white mt-1.5">Welcome, {user.name}</h2>
          <p className="text-xs text-neutral-400 mt-1 font-sans">
            Client member since: {new Date(user.createdAt).toLocaleDateString()} &bull; Primary Hub: {user.city || 'Lahore'}
          </p>
        </div>

        <div className="space-y-1 text-xs">
          <div className="text-neutral-500">Contact Vector: <strong className="text-neutral-300 font-sans">{user.email}</strong></div>
          {user.phone && <div className="text-neutral-500">Line: <strong className="text-neutral-300 font-sans">{user.phone}</strong></div>}
        </div>
      </div>

      {/* 2. ORDER CARGO TRACKING TERMINAL SEARCH PANEL */}
      <div className="bg-[#141414] border border-neutral-800 p-6 sm:p-8 rounded-sm space-y-4">
        <div>
          <h3 className="serif text-xl italic text-white">Consignment Tracking Engine</h3>
          <p className="text-xs text-neutral-400">Search using your Tracking Number or Order ID Reference to view dynamic courier progress.</p>
        </div>

        <form onSubmit={handleTrackSubmit} className="flex gap-2">
          <input
            type="text"
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
            className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white px-4 py-3 flex-1 focus:outline-none focus:border-[#C5A059] font-mono font-bold"
            placeholder="e.g. AVN-9821-LH or TRK-AVN-936154"
          />
          <button
            type="submit"
            className="bg-[#C5A059] hover:bg-[#DFBA73] text-black font-bold text-xs uppercase tracking-widest px-6 flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Search size={14} /> Trace
          </button>
        </form>

        {isTracking && (
          <div className="text-center py-4 text-xs font-mono text-neutral-500">Connecting logistics database...</div>
        )}

        {/* Trace results visualization */}
        {foundOrders !== null && (
          <div className="bg-black/80 border border-neutral-900 rounded p-5 space-y-4 animate-fade-in">
            {foundOrders.length > 0 ? (
              foundOrders.map((o) => (
                <div key={o.id} className="space-y-6">
                  {/* Headline summary indicators */}
                  <div className="flex flex-col sm:flex-row justify-between text-xs font-mono border-b border-neutral-900 pb-3 gap-2">
                    <div>
                      <span>ORDER REFERENCE: <strong>{o.id}</strong></span>
                      <span className="text-neutral-600 mx-2">|</span>
                      <span>TRACKING CODE: <strong className="text-[#C5A059]">{o.trackingNumber}</strong></span>
                    </div>
                    <div>
                      <span className="uppercase tracking-widest bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[#C5A059] font-bold text-[9px]">
                        STAGE: {o.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual Stepper tracking map */}
                  <div className="grid grid-cols-3 gap-2 pt-2 relative">
                    
                    {/* Step 1: Processing */}
                    <div className="text-center relative">
                      <div className="h-2.5 w-full bg-[#C5A059] rounded-l-full"></div>
                      <span className="block text-[10px] mt-2 text-white font-bold uppercase tracking-wider">1. Confirmed</span>
                      <span className="text-[9px] text-neutral-500 font-mono">Invoice generated</span>
                    </div>

                    {/* Step 2: Shipping */}
                    <div className="text-center relative">
                      <div className={`h-2.5 w-full ${o.status === 'Shipped' || o.status === 'Delivered' ? 'bg-[#C5A059]' : 'bg-neutral-800'}`}></div>
                      <span className={`block text-[10px] mt-2 font-bold uppercase tracking-wider ${o.status === 'Shipped' || o.status === 'Delivered' ? 'text-white' : 'text-neutral-600'}`}>
                        2. Dispatched
                      </span>
                      <span className="text-[9px] text-neutral-500 font-mono">In TCS logistics pipeline</span>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className="text-center relative">
                      <div className={`h-2.5 w-full rounded-r-full ${o.status === 'Delivered' ? 'bg-[#C5A059]' : 'bg-neutral-800'}`}></div>
                      <span className={`block text-[10px] mt-2 font-bold uppercase tracking-wider ${o.status === 'Delivered' ? 'text-white' : 'text-neutral-600'}`}>
                        3. Completed
                      </span>
                      <span className="text-[9px] text-neutral-500 font-mono">Arrived at home</span>
                    </div>

                  </div>
                  
                  {/* Detailed summary lists inside tracker */}
                  <div className="pt-2 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-neutral-400">
                    <div>
                      <span className="text-neutral-500 block. text-[9px] uppercase tracking-wider">Client Recipient</span>
                      <strong className="text-white block mt-0.5">{o.customerName}</strong>
                      <span>Address: {o.shippingAddress}, {o.city}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block text-[9px] uppercase tracking-wider font-semibold">Financial summary</span>
                      <strong className="text-[#C5A059] block mt-0.5 text-sm font-mono font-bold">Rs. {o.totalAmount.toLocaleString()}</strong>
                      <span>Method: {o.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-xs italic text-red-400">
                ⚠ No corresponding order parameters matching that tracking parameter could be indexed.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. PAST ORDERS MATRIX */}
      <div className="space-y-4">
        <div className="border-b border-neutral-900 pb-3">
          <h3 className="serif text-2xl italic text-white">Logistics & Order archives</h3>
          <p className="text-xs text-neutral-400">Trace the complete historic parameters of your luxury investments.</p>
        </div>

        {orders.length > 0 ? (
          <div className="bg-neutral-950 border border-neutral-900 rounded overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#141414] text-[#C5A059] uppercase tracking-widest text-[9px] border-b border-neutral-900">
                <tr>
                  <th className="py-4 px-6">ID Code</th>
                  <th className="py-4 px-6">Dispatch Date</th>
                  <th className="py-4 px-6">Address</th>
                  <th className="py-4 px-6 text-center">Price Subtotal</th>
                  <th className="py-4 px-6 text-center">Cargo Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900 text-neutral-400">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-900/10">
                    <td className="py-4 px-6 font-mono font-bold text-white">{o.id}</td>
                    <td className="py-4 px-6 font-mono">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 truncate max-w-[200px]">{o.shippingAddress}, {o.city}</td>
                    <td className="py-4 px-6 text-center font-mono font-semibold text-[#C5A059]">Rs. {o.totalAmount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded ${
                        o.status === 'Pending' 
                          ? 'bg-amber-950/40 text-amber-400' 
                          : o.status === 'Shipped'
                          ? 'bg-blue-950/40 text-blue-400'
                          : o.status === 'Delivered'
                          ? 'bg-green-950/40 text-green-400'
                          : 'bg-red-950/40 text-red-400'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-neutral-950 p-6 border border-neutral-900 rounded text-center text-xs text-neutral-500 italic">
            You hold no historical transaction records on this registered email profile.
          </div>
        )}
      </div>

      {/* 4. WISHLIST PORTAL VIEW */}
      <div className="space-y-4">
        <div className="border-b border-neutral-900 pb-3">
          <h3 className="serif text-2xl italic text-white flex items-center gap-2"><Heart size={18} className="text-[#C5A059] fill-current" /> Reserved Luxury Shortlists</h3>
          <p className="text-xs text-neutral-400">Products currently bookmarked in client local storage layers.</p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((p) => (
              <div key={p.id} className="bg-black border border-neutral-900 relative group overflow-hidden flex flex-col justify-between">
                <div className="aspect-[4/3] bg-neutral-950 relative overflow-hidden">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover grayscale group-hover:scale-105 group-hover:grayscale-0 transition-all duration-300" />
                  
                  <button
                    onClick={() => onRemoveFromWishlist(p)}
                    className="absolute top-2.5 right-2.5 bg-red-600/20 text-red-500 border border-red-900/40 hover:bg-red-500 hover:text-white p-1 rounded-sm text-[10px] font-bold transition-all"
                  >
                    Remove
                  </button>
                </div>
                <div className="p-4 bg-[#141414] border-t border-neutral-900 space-y-2">
                  <h4 className="text-white text-xs font-semibold truncate">{p.name}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-[#C5A059] font-mono text-xs font-bold">Rs. {p.price.toLocaleString()}</span>
                    
                    <button
                      onClick={() => onSelectProduct(p)}
                      className="text-[9px] uppercase tracking-widest text-neutral-400 hover:text-[#C5A059] font-semibold flex items-center gap-1"
                    >
                      Inspect <Eye size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-neutral-950 p-6 border border-neutral-900 rounded text-center text-xs text-neutral-500 italic">
            Your Wishlist directory holds no luxury selections. Take your time browsing the collection.
          </div>
        )}
      </div>

    </div>
  );
};
export default UserDashboard;
