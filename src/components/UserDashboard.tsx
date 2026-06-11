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
        setErrorMsg('Invalid credentials. Please attempt with appropriate security credentials.');
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
      const queryStr = trackQuery.trim().toLowerCase();
      // Look up locally first from passed orders list
      const matches = orders.filter(
        (o) =>
          o.id.toLowerCase() === queryStr ||
          o.id.replaceAll('-', '').toLowerCase() === queryStr ||
          o.customerEmail.toLowerCase() === queryStr ||
          o.trackingNumber.toLowerCase() === queryStr
      );

      if (matches.length > 0) {
        setFoundOrders(matches);
      } else {
        const resp = await fetch(`/api/orders/track/${encodeURIComponent(trackQuery.trim())}`);
        if (resp.ok) {
          const data = await resp.json();
          setFoundOrders(data);
        } else {
          setFoundOrders([]);
        }
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
      <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 my-10 animate-fade-in shadow-xl">
        <div className="text-center space-y-1.5 font-sans">
          <h2 className="serif text-3xl font-semibold italic text-gray-900">Client Sanctuary Workspace</h2>
          <p className="text-xs text-gray-500 font-medium">
            {isRegistering ? 'Compose your Avenzo VIP profile parameters.' : 'Login to access order history, tracking records, and wishlist.'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-200 p-2.5 rounded-xl text-xs text-red-600 text-center font-sans font-medium">
            ⚠ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="bg-green-50 border border-green-200 p-2.5 rounded-xl text-xs text-green-600 text-center font-sans font-medium">
            {successMsg}
          </div>
        )}

        {isRegistering ? (
          // VIP REGISTRATION FORM
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs font-sans font-medium">
            <div>
              <label className="text-[10px] uppercase text-gray-400 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                className="bg-white border border-gray-200 text-xs px-3 py-2.5 w-full text-gray-800 rounded-xl focus:outline-none focus:border-indigo-650"
                placeholder="e.g., Zain-ul-Abideen"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase text-gray-400 block mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="bg-white border border-gray-200 text-xs px-3 py-2.5 w-full text-gray-800 rounded-xl focus:outline-none focus:border-indigo-650"
                  placeholder="name@gmail.com"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-gray-400 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={authPass}
                  onChange={(e) => setAuthPass(e.target.value)}
                  className="bg-white border border-gray-200 text-xs px-3 py-2.5 w-full text-gray-800 rounded-xl focus:outline-none focus:border-indigo-650"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase text-gray-400 block mb-1">Mobile Hotline</label>
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="bg-white border border-gray-200 text-xs px-3 py-2.5 w-full text-gray-800 rounded-xl focus:outline-none focus:border-indigo-650"
                  placeholder="03001234567"
                />
              </div>
              <div>
                <label className="text-[10px] uppercase text-gray-400 block mb-1">Metro Hub</label>
                <select
                  value={regCity}
                  onChange={(e) => setRegCity(e.target.value)}
                  className="bg-[#F8FAFC] border border-gray-200 text-xs px-3 py-2.5 w-full text-gray-800 rounded-xl focus:outline-none"
                >
                  <option value="Lahore">Lahore Hub</option>
                  <option value="Karachi">Karachi Hub</option>
                  <option value="Islamabad">Islamabad Hub</option>
                  <option value="Faisalabad">Faisalabad Hub</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase text-gray-400 block mb-1">Residential Address</label>
              <input
                type="text"
                value={regAddress}
                onChange={(e) => setRegAddress(e.target.value)}
                className="bg-white border border-gray-200 text-xs px-3 py-2.5 w-full text-gray-800 rounded-xl focus:outline-none focus:border-indigo-650"
                placeholder="House, Street, Area..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase tracking-wider text-xs py-3 mt-2 cursor-pointer transition-all rounded-xl shadow-xs"
            >
              Compose VIP Profile
            </button>
            
            <p className="text-center text-gray-450 text-[11px] pt-2 text-gray-400">
              Already possess credentials?{' '}
              <button type="button" onClick={() => setIsRegistering(false)} className="text-indigo-600 hover:underline font-bold">
                Sign In Instead
              </button>
            </p>
          </form>
        ) : (
          // STANDARD LOGIN FORM
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs font-sans font-medium">
            <div>
              <label className="text-[10px] uppercase text-gray-400 block mb-1">Email Address</label>
              <input
                type="email"
                required
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="bg-white border border-gray-200 text-xs px-3 py-2.5 w-full text-gray-800 rounded-xl focus:outline-none focus:border-indigo-650"
                placeholder="e.g., customer@avenzo.pk"
              />
            </div>

            <div>
              <label className="text-[10px] uppercase text-gray-400 block mb-1">Password</label>
              <input
                type="password"
                required
                value={authPass}
                onChange={(e) => setAuthPass(e.target.value)}
                className="bg-white border border-gray-200 text-xs px-3 py-2.5 w-full text-gray-800 rounded-xl focus:outline-none focus:border-indigo-650"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-605 bg-indigo-600 hover:bg-indigo-705 text-white font-bold uppercase tracking-wider text-xs py-3 mt-2 cursor-pointer transition-all rounded-xl shadow-xs"
            >
              Authorize Secure Log In
            </button>

            <div className="bg-indigo-50/50 p-3 rounded-xl text-[10px] text-indigo-700 text-center leading-normal border border-indigo-100 uppercase tracking-wide">
              <span>Admin Profile: <strong>admin@avenzo.pk</strong> &middot; Pass: <strong>admin</strong></span>
            </div>
            
            <p className="text-center text-gray-450 text-[11px] pt-1 text-gray-400">
              New client?{' '}
              <button type="button" onClick={() => setIsRegistering(true)} className="text-indigo-600 hover:underline font-bold">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12 animate-fade-in text-gray-750 text-gray-700">
      
      {/* 1. Header user profile badge info card */}
      <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-indigo-600 font-mono font-bold leading-none flex items-center gap-1.5 animate-pulse">
            <UserCheck size={12} /> Authenticated Avenzo Client Member
          </span>
          <h2 className="serif text-3xl italic text-gray-905 text-gray-900 mt-1.5 font-semibold">Welcome, {user.name}</h2>
          <p className="text-xs text-gray-400 mt-1 font-sans font-medium">
            Client member since: {new Date(user.createdAt).toLocaleDateString()} &bull; Primary Hub: {user.city || 'Lahore'}
          </p>
        </div>

        <div className="space-y-1 text-xs font-sans font-medium text-gray-500">
          <div>Contact Vector: <strong className="text-gray-800">{user.email}</strong></div>
          {user.phone && <div>Line: <strong className="text-gray-800">{user.phone}</strong></div>}
        </div>
      </div>

      {/* 2. ORDER CARGO TRACKING TERMINAL SEARCH PANEL */}
      <div className="bg-white border border-gray-200 p-6 sm:p-8 rounded-2xl shadow-md space-y-4">
        <div>
          <h3 className="serif text-xl italic text-gray-900 font-semibold">Consignment Tracking Engine</h3>
          <p className="text-xs text-gray-500 font-medium font-sans">Search using your Tracking Number or Order ID Reference to view dynamic courier progress.</p>
        </div>

        <form onSubmit={handleTrackSubmit} className="flex gap-2 font-sans">
          <input
            type="text"
            value={trackQuery}
            onChange={(e) => setTrackQuery(e.target.value)}
            className="bg-white border border-gray-200 text-xs text-gray-900 px-4 py-3 rounded-xl flex-1 focus:outline-none focus:border-indigo-600 font-mono font-bold"
            placeholder="e.g. AVN-9821-LH or TRK-AVN-936154"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest px-6 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Search size={14} /> Trace
          </button>
        </form>

        {isTracking && (
          <div className="text-center py-4 text-xs font-mono text-gray-400 animate-pulse">Connecting logistics database...</div>
        )}

        {/* Trace results visualization */}
        {foundOrders !== null && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4 animate-fade-in shadow-xs">
            {foundOrders.length > 0 ? (
              foundOrders.map((o) => (
                <div key={o.id} className="space-y-6">
                  {/* Headline summary indicators */}
                  <div className="flex flex-col sm:flex-row justify-between text-xs font-mono border-b border-gray-200 pb-3 gap-2">
                    <div className="text-gray-600 font-medium">
                      <span>ORDER REFERENCE: <strong className="text-gray-900">{o.id}</strong></span>
                      <span className="text-gray-300 mx-2">|</span>
                      <span>TRACKING CODE: <strong className="text-indigo-650 text-indigo-600 font-bold">{o.trackingNumber}</strong></span>
                    </div>
                    <div>
                      <span className="uppercase tracking-widest bg-white border border-gray-200 px-2 py-0.5 text-indigo-650 text-indigo-605 text-indigo-600 font-bold text-[9px] rounded-lg">
                        STAGE: {o.status}
                      </span>
                    </div>
                  </div>

                  {/* Visual Stepper tracking map */}
                  <div className="grid grid-cols-3 gap-2 pt-2 relative">
                    
                    {/* Step 1: Processing */}
                    <div className="text-center relative">
                      <div className="h-2.5 w-full bg-indigo-550 bg-indigo-600 rounded-l-full"></div>
                      <span className="block text-[10px] mt-2 text-gray-800 font-bold uppercase tracking-wider">1. Confirmed</span>
                      <span className="text-[9px] text-gray-400 font-mono font-medium">Invoice generated</span>
                    </div>

                    {/* Step 2: Shipping */}
                    <div className="text-center relative">
                      <div className={`h-2.5 w-full ${o.status === 'Shipped' || o.status === 'Delivered' ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                      <span className={`block text-[10px] mt-2 font-bold uppercase tracking-wider ${o.status === 'Shipped' || o.status === 'Delivered' ? 'text-gray-800 font-bold' : 'text-gray-400'}`}>
                        2. Dispatched
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono font-medium">In TCS logistics pipeline</span>
                    </div>

                    {/* Step 3: Delivered */}
                    <div className="text-center relative">
                      <div className={`h-2.5 w-full rounded-r-full ${o.status === 'Delivered' ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                      <span className={`block text-[10px] mt-2 font-bold uppercase tracking-wider ${o.status === 'Delivered' ? 'text-gray-800 font-bold' : 'text-gray-400'}`}>
                        3. Completed
                      </span>
                      <span className="text-[9px] text-gray-400 font-mono font-medium">Arrived at home</span>
                    </div>

                  </div>
                  
                  {/* Detailed summary lists inside tracker */}
                  <div className="pt-2 text-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-500 font-sans">
                    <div>
                      <span className="text-gray-450 block text-[9px] uppercase tracking-wider font-bold">Client Recipient</span>
                      <strong className="text-gray-900 block mt-0.5">{o.customerName}</strong>
                      <span className="font-medium">Address: {o.shippingAddress}, {o.city}</span>
                    </div>
                    <div>
                      <span className="text-gray-450 block text-[9px] uppercase tracking-wider font-bold">Financial summary</span>
                      <strong className="text-indigo-600 block mt-0.5 text-sm font-mono font-bold">Rs. {o.totalAmount.toLocaleString()}</strong>
                      <span className="font-medium">Method: {o.paymentMethod}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-xs italic text-red-600 font-medium font-sans">
                ⚠ No corresponding order parameters matching that tracking parameter could be indexed.
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. PAST ORDERS MATRIX */}
      <div className="space-y-4">
        <div className="border-b border-gray-150 pb-3">
          <h3 className="serif text-2xl italic text-gray-900 font-semibold">Logistics & Order archives</h3>
          <p className="text-xs text-gray-400 font-medium font-sans animate-fade-in">Trace the complete historic parameters of your luxury investments.</p>
        </div>

        {orders.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead className="bg-gray-50 text-indigo-650 text-indigo-600 uppercase tracking-widest text-[9px] border-b border-gray-200">
                <tr>
                  <th className="py-4 px-6 font-bold">ID Code</th>
                  <th className="py-4 px-6 font-bold">Dispatch Date</th>
                  <th className="py-4 px-6 font-bold">Address</th>
                  <th className="py-4 px-6 text-center font-bold">Price Subtotal</th>
                  <th className="py-4 px-6 text-center font-bold">Cargo Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-gray-900">{o.id}</td>
                    <td className="py-4 px-6 font-mono text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                    <td className="py-4 px-6 truncate max-w-[200px] text-gray-600">{o.shippingAddress}, {o.city}</td>
                    <td className="py-4 px-6 text-center font-mono font-bold text-indigo-600">Rs. {o.totalAmount.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-lg ${
                        o.status === 'Pending' 
                          ? 'bg-amber-50 text-amber-700' 
                          : o.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-700'
                          : o.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-red-50 text-red-700'
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
          <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm text-center text-xs text-gray-400 italic">
            You hold no historical transaction records on this registered email profile.
          </div>
        )}
      </div>

      {/* 4. WISHLIST PORTAL VIEW */}
      <div className="space-y-4 font-sans">
        <div className="border-b border-gray-150 pb-3">
          <h3 className="serif text-2xl italic text-gray-900 flex items-center gap-2 font-semibold"><Heart size={18} className="text-red-500 fill-current" /> Reserved Luxury Shortlists</h3>
          <p className="text-xs text-gray-400 font-medium">Products currently bookmarked in client local storage layers.</p>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((p) => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-md relative group flex flex-col justify-between hover:shadow-lg transition-all duration-300">
                <div className="aspect-[4/3] bg-gray-50 relative overflow-hidden">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                  
                  <button
                    onClick={() => onRemoveFromWishlist(p)}
                    className="absolute top-2.5 right-2.5 bg-red-50 text-red-500 hover:bg-red-650 hover:bg-red-600 hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
                <div className="p-4 bg-white border-t border-gray-100 space-y-2">
                  <h4 className="text-gray-900 text-xs font-bold truncate">{p.name}</h4>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-indigo-600 font-mono font-bold">Rs. {p.price.toLocaleString()}</span>
                    
                    <button
                      onClick={() => onSelectProduct(p)}
                      className="text-[9px] uppercase tracking-widest text-gray-400 hover:text-indigo-600 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      Inspect <Eye size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-6 border border-gray-200 rounded-2xl shadow-sm text-center text-xs text-gray-400 italic">
            Your Wishlist directory holds no luxury selections. Take your time browsing the collection.
          </div>
        )}
      </div>

    </div>
  );
};
export default UserDashboard;
