import React, { useState, useEffect } from 'react';
import { ActivePage, Product, CartItem, Order, User, Category, OrderStatus } from './types';
import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { AdminPanel } from './components/AdminPanel';
import { CheckoutPage } from './components/CheckoutPage';
import { UserDashboard } from './components/UserDashboard';
import { AvenzoSuiteCurator } from './components/AvenzoSuiteCurator';
import { AvenzoTransitTracker } from './components/AvenzoTransitTracker';
import { 
  Building, Landmark, Mail, Phone, MapPin, Sparkles, Filter, 
  HelpCircle, ChevronDown, Check, Info, ShieldCheck, Heart, AlertCircle, ShoppingBag, ArrowRight
} from 'lucide-react';

// Standard fallback catalog items in case server fails to fetch immediately
const FALLBACK_CATEGORIES = [
  { id: 'electronics', name: 'Electronics & Computing' },
  { id: 'home-appliances', name: 'Home & Living' },
  { id: 'office-furniture', name: 'Executive Office Suite' },
  { id: 'fitness-mobility', name: 'Fitness & Mobility' }
];

export default function App() {
  // Global States
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  
  // Sorting/Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number>(120000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');

  // Client variables synced with localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('avenzo_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('avenzo_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('avenzo_user');
    try {
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed) && parsed.email) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  // Selected item modal active state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // FAQ accordion active IDs
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  // 1. DATA SYNCHRONIZATION FROM DYNAMIC BACKEND SERVER
  const fetchData = async () => {
    try {
      const prodResp = await fetch('/api/products');
      if (prodResp.ok) {
        const prodData = await prodResp.json();
        setProducts(prodData);
      }
      
      const catResp = await fetch('/api/categories');
      if (catResp.ok) {
        const catData = await catResp.json();
        setCategories(catData);
      }

      const ordResp = await fetch('/api/orders');
      if (ordResp.ok) {
        const ordData = await ordResp.json();
        setOrders(ordData);
      }
    } catch (err) {
      console.log('Server fetch offline, proceeding with native memory preloads.');
    }
  };

  useEffect(() => {
    fetchData();
    // Run sync checks
    const interval = setInterval(fetchData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Sync state values back into Client Persistence elements
  useEffect(() => {
    localStorage.setItem('avenzo_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('avenzo_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('avenzo_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('avenzo_user');
    }
  }, [currentUser]);

  // ACCOUNT ACTION TRIGGER DECLARES
  const handleLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const resp = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass })
      });
      if (resp.ok) {
        const user = await resp.json();
        setCurrentUser(user);
        
        // If logged in customer matches administrative parameters, redirect
        if (user.isAdmin) {
          setActivePage('admin');
        } else {
          setActivePage('account');
        }
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handleRegister = async (payload: any): Promise<boolean> => {
    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (resp.ok) {
        const user = await resp.json();
        setCurrentUser(user);
        setActivePage('account');
        return true;
      }
    } catch (err) {
      console.error(err);
    }
    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('home');
  };

  // CART OPERATIONS DECLARE
  const handleAddToCart = (product: Product, qty: number) => {
    setCart((prev) => {
      const existsIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existsIdx > -1) {
        const copy = [...prev];
        copy[existsIdx].quantity += qty;
        return copy;
      } else {
        return [...prev, { product, quantity: qty }];
      }
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleAddMultiToCart = (items: Product[]) => {
    setCart((prev) => {
      let copy = [...prev];
      items.forEach(product => {
        const existsIdx = copy.findIndex((item) => item.product.id === product.id);
        if (existsIdx > -1) {
          copy[existsIdx].quantity += 1;
        } else {
          copy.push({ product, quantity: 1 });
        }
      });
      return copy;
    });
  };

  // WISHLIST OPERATIONS DECLARE
  const handleAddToWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  // REVIEWS SUBMISSION CONNECTED TO SERVER
  const handleAddReview = async (productId: string, name: string, rating: number, comment: string) => {
    const resp = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rating, comment })
    });
    if (resp.ok) {
      await fetchData();
      // Update modal selected details live to reflect new average ratings instantly
      const updated = products.find((p) => p.id === productId);
      if (updated) {
        setSelectedProduct(updated);
      }
    } else {
      throw new Error('Review failed');
    }
  };

  // CHECKOUT PORTAL COUPLING
  const handleCheckoutSubmit = async (orderDetails: any) => {
    const resp = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderDetails)
    });
    if (resp.ok) {
      const data = await resp.json();
      await fetchData();
      return data;
    } else {
      throw new Error('Order creation rejected');
    }
  };

  // ADMINISTRATIVE MUTATORS
  const handleAddProduct = async (payload: any) => {
    const resp = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (resp.ok) {
      await fetchData();
    } else {
      throw new Error('Failure creating product');
    }
  };

  const handleUpdateProduct = async (id: string, payload: any) => {
    const resp = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (resp.ok) {
      await fetchData();
    } else {
      throw new Error('Failure updating product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const resp = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });
    if (resp.ok) {
      await fetchData();
    } else {
      throw new Error('Failure deleting product');
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus) => {
    const resp = await fetch(`/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (resp.ok) {
      await fetchData();
    } else {
      throw new Error('Failure updating order state');
    }
  };

  // SEARCH & FILTER INTEGRATION MATH
  const filteredProducts = products.filter((p) => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesPrice = p.price <= priceRange;
    
    return matchesSearch && matchesCategory && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 1; // Default
  });

  const cartSubtotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans-inter">
      
      {/* 0. Top Editorial Announcement Ribbon */}
      <div className="bg-gradient-to-r from-neutral-950 via-black to-neutral-950 border-b border-[#C5A059]/20 text-[10px] text-[#C5A059] uppercase tracking-[0.2em] py-2 px-4 flex flex-col sm:flex-row justify-between items-center gap-1.5 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shrink-0"></span>
          <span>VIP 5% Package Discount Active on Curated Workspace Suites</span>
        </div>
        <div className="hidden md:inline text-neutral-400">
          Complimentary White-Glove Courier dispatch across Pakistan Metropolitan centers
        </div>
        <div className="text-neutral-500 font-sans tracking-wide">
          Bespoke Support &middot; support@avenzo.pk
        </div>
      </div>

      {/* 1. Global Navigation header bar */}
      <NavBar
        activePage={activePage}
        setActivePage={setActivePage}
        cartCount={cartCount}
        wishlistCount={wishlist.length}
        user={currentUser}
        onSearch={setSearchTerm}
        onLogout={handleLogout}
      />

      {/* 2. Main SPA Render Container */}
      <main className="flex-grow">
        
        {/* HOMEPAGE VIEW */}
        {activePage === 'home' && (
          <div className="space-y-16">
            <Hero onCtas={setActivePage} />

            {/* Featured Luxury Categories Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex justify-between items-end border-b border-neutral-900 pb-3">
                <div>
                  <span className="text-[10px] uppercase text-[#C5A059] tracking-widest font-mono">Curated Departments</span>
                  <h2 className="serif text-2xl sm:text-3xl font-medium italic text-white mt-1">Acquisition Shelves</h2>
                </div>
                <button 
                  onClick={() => setActivePage('categories')} 
                  className="text-xs text-[#C5A059] uppercase tracking-widest font-semibold hover:underline"
                >
                  Browse all departments
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(categories.length > 0 ? categories : FALLBACK_CATEGORIES).map((cat) => (
                  <div
                    key={cat.id}
                    onClick={() => { setSelectedCategory(cat.id); setActivePage('shop'); }}
                    className="group bg-[#141414] border border-neutral-900 overflow-hidden relative aspect-video flex items-end p-6 cursor-pointer hover:border-[#C5A059]/40 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-black/60 z-10"></div>
                    {cat && 'imageUrl' in cat && (
                      <img
                        src={(cat as any).imageUrl}
                        alt={cat?.name || 'Category'}
                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                        loading="lazy"
                      />
                    )}
                    <div className="relative z-20 space-y-1">
                      <h3 className="serif text-white group-hover:text-[#C5A059] transition-colors text-lg italic leading-tight capitalize">
                        {cat?.name ? cat.name.replace('&', '\n&') : 'Curated Shelf'}
                      </h3>
                      <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-medium block">
                        Browse Assets &rarr;
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Configurator Assistant Widget segment */}
            <AvenzoSuiteCurator 
              products={products}
              onAddMultiToCart={handleAddMultiToCart}
              onSelectProduct={setSelectedProduct}
            />

            {/* Home featured products list */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex justify-between items-end border-b border-neutral-900 pb-3">
                <div>
                  <span className="text-[10px] uppercase text-[#C5A059] tracking-widest font-mono">The Elite selections</span>
                  <h2 className="serif text-2xl sm:text-3xl font-medium italic text-white mt-1">Selected Masterpieces</h2>
                </div>
                <button 
                  onClick={() => { setSelectedCategory('all'); setActivePage('shop'); }} 
                  className="text-xs text-[#C5A059] uppercase tracking-widest font-semibold hover:underline"
                >
                  View All 20 Masterpieces
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 8).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelectedProduct}
                    onAddToWishlist={handleAddToWishlist}
                    isWishlisted={!!wishlist.find((p) => p.id === product.id)}
                  />
                ))}
              </div>
            </section>

            {/* Exclusive VIP Lounge story blocks */}
            <section className="bg-black py-16 border-y border-neutral-950">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold block">Artisanal Design Philosophy</span>
                  <h3 className="serif text-3xl sm:text-4xl italic text-white leading-tight">Every element carries historical precision.</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                    Avenzo has established its identity by omitting the generic clutter of consumer packaging. We select masterpiece engineering components, design custom casing architectures, and deliver bespoke setups under white-glove courier dispatch. Elevating the homes of Gulberg, DHA, and Clifton to unprecedented standards.
                  </p>
                  <ul className="space-y-3.5 text-xs text-neutral-300">
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span>
                      Hand-inspected titanium finishes
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span>
                      T3 high-ambient cooling guarantees for Indus summers
                    </li>
                    <li className="flex items-center gap-2.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]"></span>
                      Official NTN registered security warranties
                    </li>
                  </ul>
                </div>
                <div className="aspect-video bg-neutral-900 overflow-hidden rounded relative border border-neutral-900">
                  <img 
                    src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=700&auto=format&fit=crop" 
                    alt="Engineering excellence" 
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/80 px-4 py-2 border border-neutral-800 text-[10px] font-mono text-white">
                    AVENZO LABS &bull; DESIGN STANDARD OVERVIEW
                  </div>
                </div>
              </div>
            </section>

            {/* Live Cargo Route Status Board */}
            <AvenzoTransitTracker orders={orders} />

            {/* Elegant customer certified appraisals grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
              <div className="text-center space-y-2">
                <span className="text-[10px] uppercase text-[#C5A059] tracking-widest font-mono font-bold block">Consigned Appraisals</span>
                <h3 className="serif text-2xl sm:text-3xl italic text-white font-medium">Bespoke Client Appraisals</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                  Genuine purchase experiences logged by distinguished patrons across Gulberg, DHA, and Clifton.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0D0D0D] border border-neutral-900 p-6 rounded relative space-y-4">
                  <div className="flex text-[#C5A059] gap-1 text-xs">★★★★★</div>
                  <p className="text-xs text-neutral-300 italic leading-relaxed">
                    "I ordered the executive study furniture set with custom wood matching. Delivery arrived inside custom secure crates to DHA Phase 6 within 24 hours. Exceptionally luxurious, absolutely recommend."
                  </p>
                  <div className="border-t border-neutral-900/60 pt-3">
                    <span className="text-white text-xs font-semibold block">Barrister Humayun K.</span>
                    <span className="text-[9px] text-neutral-500 block uppercase font-mono">DHA Phase 6, Lahore &bull; Verified Owner</span>
                  </div>
                </div>

                <div className="bg-[#0D0D0D] border border-neutral-900 p-6 rounded relative space-y-4 font-sans">
                  <div className="flex text-[#C5A059] gap-1 text-xs">★★★★★</div>
                  <p className="text-xs text-neutral-300 italic leading-relaxed">
                    "The Zenith Business Laptop performs flawlessly under extreme rendering tasks. Highly impressed with Avenzo's local tax documentation compliance and custom private courier service status."
                  </p>
                  <div className="border-t border-neutral-900/60 pt-3">
                    <span className="text-white text-xs font-semibold block">Syeda Maryam T.</span>
                    <span className="text-[9px] text-neutral-500 block uppercase font-mono">E-Block Gulberg, Lahore &bull; Tech Lead</span>
                  </div>
                </div>

                <div className="bg-[#0D0D0D] border border-neutral-900 p-6 rounded relative space-y-4 font-sans">
                  <div className="flex text-[#C5A059] gap-1 text-xs">★★★★★</div>
                  <p className="text-xs text-neutral-300 italic leading-relaxed">
                    "Avenzo climate systems are unmatched. Custom double-stage inverters configured for Lahore's 48C high-humidity summer peaks, managing ultra-low energy grids perfectly. Flawless white-glove setup."
                  </p>
                  <div className="border-t border-neutral-900/60 pt-3">
                    <span className="text-white text-xs font-semibold block">Dr. Faisal J.</span>
                    <span className="text-[9px] text-neutral-500 block uppercase font-mono">Clifton Block 5, Karachi &bull; Specialist</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Interactive newsletter sign up VIP updates */}
            <section className="max-w-md mx-auto px-4 text-center space-y-4 py-8">
              <h3 className="serif text-2xl italic text-white">Join Avenzo VIP Register</h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Subscribers receive exclusive access keys, pre-order queues for limited electronics releases, and invitations to Lahorite private previews.
              </p>
              <form onSubmit={(e) => { e.preventDefault(); alert('✓ Thank you. Your email address has been custom queued inside our VIP channel.'); }} className="flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="name@avenzo.pk"
                  className="bg-neutral-950 border border-neutral-800 text-xs px-4 py-3 text-white flex-1 focus:outline-none focus:border-[#C5A059]"
                />
                <button
                  type="submit"
                  className="bg-[#C5A059] text-black font-bold uppercase text-[10px] tracking-widest px-6 hover:bg-[#DFBA73] transition-colors"
                >
                  Register
                </button>
              </form>
            </section>
          </div>
        )}

        {/* SHOP CATALOG SCREEN */}
        {activePage === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
            
            {/* Title description */}
            <div className="border-b border-neutral-900 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase text-[#C5A059] tracking-widest font-mono">The Acquisition Lounge</span>
                <h2 className="serif text-4xl italic text-white mt-1.5">Avenzo Collections</h2>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl font-sans">
                  Filter and sort masterfully crafted laptops, audio frameworks, climatic inverters, and physical executive desks.
                </p>
              </div>

              {/* Status text count */}
              <div className="text-xs text-neutral-500 font-mono tracking-wider">
                Displaying <span className="text-[#C5A059] font-bold font-mono">{filteredProducts.length}</span> of 20 elite assets
              </div>
            </div>

            {/* Filter controls layer */}
            <div className="bg-[#141414] border border-neutral-900 p-5 rounded flex flex-wrap gap-6 items-center justify-between">
              
              {/* Category buttons list */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all ${
                    selectedCategory === 'all' 
                      ? 'bg-[#C5A059] text-black border-[#C5A059]' 
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  All collections
                </button>
                {(categories.length > 0 ? categories : FALLBACK_CATEGORIES).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all capitalize ${
                      selectedCategory === cat.id
                        ? 'bg-[#C5A059] text-black border-[#C5A059]'
                        : 'border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    {cat && cat.name ? cat.name.split(' ')[0] : 'Collection'}
                  </button>
                ))}
              </div>

              {/* Price filter and sorting dropdown */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-neutral-400">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 block">Cap Price: <strong className="text-[#C5A059] font-mono">Rs. {priceRange.toLocaleString()}</strong></span>
                  <input
                    type="range"
                    min="50000"
                    max="120000"
                    step="5000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-40 accent-[#C5A059] cursor-pointer"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-neutral-500">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-black border border-neutral-800 text-xs px-2.5 py-1 text-white focus:outline-none focus:border-[#C5A059] cursor-pointer"
                  >
                    <option value="featured">Premium Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Rating score</option>
                  </select>
                </div>
              </div>

            </div>

            {/* Results Grid display */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelect={setSelectedProduct}
                    onAddToWishlist={handleAddToWishlist}
                    isWishlisted={!!wishlist.find((p) => p.id === product.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <p className="text-neutral-500 text-sm">No corresponding products matching those filter brackets could be indexed.</p>
                <button 
                  onClick={() => { setSelectedCategory('all'); setSearchTerm(''); setPriceRange(120000); }} 
                  className="text-[#C5A059] border border-[#C5A059]/40 bg-[#C5A059]/10 text-xs font-bold uppercase tracking-wider py-2 px-6 hover:bg-[#C5A059] hover:text-black transition-colors"
                >
                  Reset parameters
                </button>
              </div>
            )}

          </div>
        )}

        {/* CATEGORIES GRID SCREEN */}
        {activePage === 'categories' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in bg-[#0A0A0A]">
            <div className="border-b border-neutral-900 pb-5">
              <span className="text-[10px] uppercase text-[#C5A059] tracking-widest font-mono">Structural Divisions</span>
              <h2 className="serif text-4xl italic text-white mt-1.5">Curated Departments</h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl font-sans">
                Browse our four strictly designed luxury sectors, each compiled to deliver absolute executive excellence within Pakistani households.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(categories.length > 0 ? categories : FALLBACK_CATEGORIES).map((cat) => (
                <div 
                  key={cat.id}
                  onClick={() => { setSelectedCategory(cat.id); setActivePage('shop'); }}
                  className="bg-[#141414] border border-neutral-900/60 p-6 sm:p-8 rounded flex flex-col justify-between group cursor-pointer hover:border-[#C5A059]/40 transition-all duration-300"
                >
                  <div className="space-y-4">
                    { 'imageUrl' in cat && (
                      <div className="aspect-video w-full overflow-hidden bg-neutral-950 border border-neutral-900 rounded-sm">
                        <img 
                          src={(cat as any).imageUrl} 
                          alt={cat.name} 
                          className="w-full h-full object-cover grayscale group-hover:scale-103 group-hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                    )}
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase font-mono tracking-widest text-[#C5A059] font-bold">Avenzo Department Asset</span>
                      <h3 className="serif text-white hover:text-[#C5A059] text-xl italic font-semibold">{cat.name}</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed font-sans pt-1">
                        {cat.description || 'Exclusive portfolio compiled representing the signature quality thresholds of Avenzo.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-6 mt-4 border-t border-neutral-900 text-xs text-neutral-500">
                    <span className="font-mono">Explore Assets</span>
                    <span className="text-[#C5A059] tracking-wider uppercase font-semibold block">&rarr; Browse collection</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLIENT SHOPPING CART LIST PAGE */}
        {activePage === 'cart' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <h2 className="serif text-3xl italic text-white mb-8 border-b border-neutral-900 pb-4">Acquisitions Cart</h2>

            {cart.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                
                {/* Cart list table on LHS */}
                <div className="lg:col-span-8 bg-[#141414] border border-neutral-900 rounded p-6 space-y-4">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex flex-col sm:flex-row gap-6 p-4 bg-black border border-neutral-900 items-start sm:items-center justify-between">
                      
                      <div className="flex gap-4 items-center">
                        <img src={item.product.imageUrl} alt={item.product.name} className="h-14 w-14 object-cover rounded border border-neutral-900 grayscale" />
                        <div>
                          <h4 className="text-white text-sm font-semibold hover:text-[#C5A059] transition-colors cursor-pointer" onClick={() => setSelectedProduct(item.product)}>{item.product.name}</h4>
                          <span className="text-[10px] text-neutral-500 font-mono">SKU: {item.product.sku}</span>
                        </div>
                      </div>

                      {/* Quantity adjustments */}
                      <div className="flex items-center gap-6">
                        <div className="flex items-center bg-neutral-950 border border-neutral-900 rounded text-xs select-none">
                          <button onClick={() => handleUpdateCartQty(item.product.id, item.quantity - 1)} className="px-2.5 py-1 text-neutral-400 hover:text-white transition-colors">-</button>
                          <span className="px-3 text-white font-semibold font-mono text-[11px]">{item.quantity}</span>
                          <button onClick={() => handleUpdateCartQty(item.product.id, item.quantity + 1)} className="px-2.5 py-1 text-neutral-400 hover:text-white transition-colors">+</button>
                        </div>

                        <div className="text-right">
                          <span className="text-neutral-500 block text-[9px] uppercase tracking-wider font-semibold">Subtotal</span>
                          <span className="text-[#C5A059] font-mono text-sm font-bold block">Rs. {(item.product.price * item.quantity).toLocaleString()}</span>
                        </div>

                        <button onClick={() => handleRemoveFromCart(item.product.id)} className="text-neutral-500 hover:text-red-400 text-xs uppercase tracking-widest font-bold font-sans">
                          Release
                        </button>
                      </div>

                    </div>
                  ))}
                </div>

                {/* Pricing table checkout button card RHS */}
                <div className="lg:col-span-4 bg-black border border-neutral-900 p-6 space-y-6">
                  <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Acquisitions Total</h3>
                  
                  <div className="space-y-4 text-xs font-sans">
                    <div className="flex justify-between py-2 border-b border-neutral-900 text-neutral-400">
                      <span>Commodities Subtotal:</span>
                      <span className="font-mono text-[#E5E5E5]">Rs. {cartSubtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-neutral-900 text-neutral-400">
                      <span>Delivery Surcharge:</span>
                      <strong className="text-green-400 text-[10px] uppercase tracking-wider">Free insured delivery</strong>
                    </div>
                    <div className="flex justify-between py-3 text-sm">
                      <span className="text-white font-bold uppercase tracking-wider">Sum value:</span>
                      <span className="text-[#C5A059] text-base font-bold font-mono">
                        Rs. {cartSubtotal.toLocaleString()}
                      </span>
                    </div>

                    <p className="text-[10px] text-neutral-500 leading-relaxed italic border-t border-neutral-900/60 pt-3">
                      * Fully insured secure transit managed directly via private courier lines across Pakistan.
                    </p>
                  </div>

                  <button
                    onClick={() => setActivePage('checkout')}
                    className="w-full bg-[#C5A059] text-black font-bold uppercase tracking-widest text-xs py-3.5 hover:bg-[#DFBA73] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Proceed with VIP Checkout &rarr;
                  </button>
                </div>

              </div>
            ) : (
              <div className="py-20 text-center space-y-4">
                <p className="text-neutral-500 text-xs">Your acquisition cart holds no choices yet.</p>
                <button 
                  onClick={() => setActivePage('shop')} 
                  className="text-[#C5A059] border border-[#C5A059]/40 bg-[#C5A059]/15 text-xs font-bold uppercase tracking-widest py-2 px-6 hover:bg-[#C5A059] hover:text-black transition-all cursor-pointer"
                >
                  Shop Custom Collection
                </button>
              </div>
            )}
          </div>
        )}

        {/* CHECKOUT WORKFLOW SCREEN */}
        {activePage === 'checkout' && (
          <CheckoutPage
            cart={cart}
            cartSubtotal={cartSubtotal}
            onClearCart={() => setCart([])}
            onSubmitOrder={handleCheckoutSubmit}
          />
        )}

        {/* ACCOUNT DASHBOARD AND USER AUTHENTICATION SCREEN */}
        {activePage === 'account' && (
          <UserDashboard
            user={currentUser}
            orders={orders.filter((o) => o.customerEmail.toLowerCase() === currentUser?.email.toLowerCase())}
            wishlist={wishlist}
            onSelectProduct={setSelectedProduct}
            onRemoveFromWishlist={handleAddToWishlist}
            onLogin={handleLogin}
            onRegister={handleRegister}
          />
        )}

        {/* ADMINISTRATIVE SYSTEM PANEL SCREEN */}
        {activePage === 'admin' && currentUser?.isAdmin && (
          <AdminPanel
            products={products}
            orders={orders}
            onAddProduct={handleAddProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {/* ABOUT US STORY SCREEN */}
        {activePage === 'about' && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-10 animate-fade-in font-sans-inter">
            <div className="text-center space-y-3 pb-6 border-b border-neutral-900">
              <span className="text-[10px] uppercase text-[#C5A059] tracking-[0.4em] font-semibold block">Chronicles of Prestige</span>
              <h2 className="serif text-4xl sm:text-5xl italic text-white font-medium">Bespoke Design & Craft</h2>
              <span className="text-[9px] uppercase tracking-widest text-neutral-500 block font-mono">ESTABLISHED MMXXIV IN LAHORE, PAKISTAN</span>
            </div>

            <p className="text-sm border-l-2 border-[#C5A059] pl-6 italic text-neutral-400">
              "We built Avenzo Official Store on a simple premise: Pakistani design enthusiasts deserved access to tech hardware and lifestyle objects curated with absolute editorial prestige, devoid of generic visual noise."
            </p>

            <div className="space-y-4 text-xs leading-relaxed text-neutral-400 font-sans">
              <p>
                From our administrative lounge residing in Gulberg III, Lahore, our engineering teams select flagship chips, custom screens, and solid leather upholstery. We rebuild standard frameworks into custom masterpiece assets.
              </p>
              <p>
                Whether importing aerospace magnesium alloys for Ares gaming profiles, configuring hybrid inverter systems optimized for Lahore summer cycles, or detailing Italian full-grain leather across Royal recliner arrays, Avenzo serves the elite class who value architectural composure above mass production metrics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-900 text-xs">
              <div className="bg-neutral-950 p-5 rounded border border-neutral-900 flex items-start gap-4">
                <div className="text-[#C5A059]"><ShieldCheck size={20} /></div>
                <div>
                  <h4 className="text-white uppercase font-bold tracking-wider text-[11px]">Material Selection Integrity</h4>
                  <p className="text-neutral-400 mt-1 leading-normal">
                    We select 100% genuine parts, ensuring premium thermal management, authentic operating warranties, and premium product longevity.
                  </p>
                </div>
              </div>

              <div className="bg-neutral-950 p-5 rounded border border-neutral-900 flex items-start gap-4">
                <div className="text-[#C5A059]"><Building size={20} /></div>
                <div>
                  <h4 className="text-white uppercase font-bold tracking-wider text-[11px]">White-Glove Dispatches</h4>
                  <p className="text-neutral-400 mt-1 leading-normal">
                    Orders are packaged inside shockproof custom sleeves, handled directly via specialized transit couriers across lahore and karachi metropolitan centers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ KNOWLEDGE BASE ACCORDION SCREEN */}
        {activePage === 'faq' && (
          <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 animate-fade-in">
            <div className="text-center space-y-2 border-b border-neutral-900 pb-5">
              <span className="text-[10px] uppercase text-[#C5A059] tracking-widest font-mono font-bold">Intellectual Center</span>
              <h2 className="serif text-4xl italic text-white font-medium">Acquisitions FAQs</h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-lg mx-auto font-sans">
                Find clear answers regarding premium asset warranties, delivery channels, custom billing, and return logistics rules.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: 'Are these Avenzo assets authentic with registered warranties?',
                  a: 'Absolutely. Avenzo Official Store is a certified NTN registered tax-compliant enterprise in Pakistan. Every single luxury computer, TV, smartphone, and appliance passes deep lab testing checklists, carrying authentic manufacturer coverage along with Avenzo bespoke system guarantees.'
                },
                {
                  q: 'What are the delivery speed vectors across Pakistan?',
                  a: 'For Lahore metropolitan clients, we offer same-day hand dispatches directly under climate controlled cargo wraps. For Karachi, Islamabad, Peshawar, Rawalpindi, and Faisalabad, express shipping completes securely within 24 to 48 hours via premium insured carrier services.'
                },
                {
                  q: 'What is the "Bespoke Returns Policy"?',
                  a: 'If a curated laptop or ergonomic chair does not fit your residential space perfectly, we support complete return pickup collections within 14 days of acquisition, provided items retain their original protective satin envelopes and lack structural wear.'
                },
                {
                  q: 'Do you offer physical lounge preview tours?',
                  a: 'Yes, our flagship showroom plaza is situated in Block E2, Gulberg III, Lahore. Clients can schedule priority viewings to physically experience Ares gaming systems, Royal recliners, or Studio audio arrays before initiating transaction authorizations.'
                },
                {
                  q: 'Is there a limit on luxury items acquisitions?',
                  a: 'Due to highly restricted artisanal assembly cycles in our workshop, we restrict single-client online catalog acquisitions to 3 units per distinct SKU per week unless authorized by managing director channels.'
                }
              ].map((faq, idx) => (
                <div 
                  key={idx} 
                  className="bg-neutral-950 border border-neutral-900 rounded-sm cursor-pointer"
                  onClick={() => setFaqOpenIndex(faqOpenIndex === idx ? null : idx)}
                >
                  <div className="flex justify-between items-center p-5 text-xs font-semibold text-white">
                    <span>{faq.q}</span>
                    <ChevronDown size={14} className={`text-[#C5A059] transition-transform ${faqOpenIndex === idx ? 'transform rotate-180' : ''}`} />
                  </div>
                  {faqOpenIndex === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs text-neutral-400 font-sans leading-relaxed border-t border-neutral-900/60 transition-all">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CUSTOM POLICY PAGES (Privacy, Terms, Shipping, Return) */}
        {activePage === 'privacy' && (
          <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 animate-fade-in font-sans">
            <h2 className="serif text-3xl italic text-white border-b border-neutral-900 pb-4">Privacy Protection Bylaws</h2>
            <div className="space-y-4 text-xs text-neutral-400 leading-relaxed">
              <p>Here at Avenzo, we hold our clients data with the same uncompromising standards as our product design materials. We never sell, leak, or lease information with secondary marketing grids.</p>
              <p>Your transaction telemetry, delivery coordinates, and cellular contact files remain encrypted inside isolated server databases. Payment verification details processed via Stripe or bank channels pass securely across standard SSL end-to-end setups.</p>
              <p>Any cookies or session variables maintained within local state components serve only to sustain catalog filters, persistent wishlist collections, and secure active cart parameters.</p>
            </div>
          </div>
        )}

        {activePage === 'terms' && (
          <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 animate-fade-in font-sans">
            <h2 className="serif text-3xl italic text-white border-b border-neutral-900 pb-4">Terms of Agreements</h2>
            <div className="space-y-4 text-xs text-neutral-400 leading-relaxed">
              <p>Access to Avenzo Official Store implies compliance with executive acquisition governance models. Listed pricing values represent PKR Rupees and include relevant packaging surcharges.</p>
              <p>We reserve right to cancel any order parameters that display clear pricing typos or originate from malicious credit card simulation patterns. High volume commercial resale from Avenzo is strictly forbidden without registered enterprise licenses.</p>
              <p>Any disputes or delivery complaints follow standard corporate mediation practices guided under لاہور jurisdiction bylaws.</p>
            </div>
          </div>
        )}

        {activePage === 'shipping-policy' && (
          <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 animate-fade-in font-sans">
            <h2 className="serif text-3xl italic text-white border-b border-neutral-900 pb-4">Shipping & Handling Governance</h2>
            <div className="space-y-4 text-xs text-neutral-400 leading-relaxed">
              <p>All Avenzo orders are classified as premium, high-value cargo. We do not use standard unstructured postage channels.</p>
              <p>Custom packaging: Products are sealed inside waterproof, high-density shock absorbers, and placed in velvet-lined boxes carrying unique stamp tags.</p>
              <p>Tracking codes (dispatched via SMS and priority inbox mail) authorize live locating of freight vans all path segments.</p>
              <p>Recieving requirement: Due to extreme premium pricing indices (PKR 50,000 to PKR 120,000), dispatches require cellular verification or physical signature before courier handing.</p>
            </div>
          </div>
        )}

        {activePage === 'refund-policy' && (
          <div className="max-w-3xl mx-auto px-4 py-12 space-y-6 animate-fade-in font-sans">
            <h2 className="serif text-3xl italic text-white border-b border-neutral-900 pb-4">Returns & Refund Policy</h2>
            <div className="space-y-4 text-xs text-neutral-400 leading-relaxed">
              <p>Avenzo designs carrying zero visual flaws. If physical structures show minor transit abrasions, or if client preferences pivot, a claim must be registered internally within 14 days of freight delivery.</p>
              <p>Refunding channels: Valued returns undergo audit testing inside Lahore laboratories. Once cleared, full capital refunds are disbursed directly to initial Bank Alfalah channels or Cash wallets within 5 business days.</p>
            </div>
          </div>
        )}

        {/* CONTACT US FORM SCREEN */}
        {activePage === 'contact' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fade-in">
            <div className="border-b border-neutral-900 pb-5">
              <span className="text-[10px] uppercase text-[#C5A059] tracking-widest font-mono">Prioritizing Correspondence</span>
              <h2 className="serif text-4xl italic text-white mt-1.5">Connect With Avenzo</h2>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl font-sans">
                Connect with director channels directly regarding enterprise solutions, catalog queries, or custom residential installations.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* LHS FORM */}
              <div className="lg:col-span-7 bg-[#141414] border border-neutral-900 p-6 sm:p-8 rounded-sm space-y-4">
                <h3 className="serif text-xl italic text-white">Direct Client Inquiry Form</h3>
                
                <form onSubmit={(e) => { e.preventDefault(); alert('✓ Message authenticated. A client coordinator will cellular connect within 1 hour.'); }} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase text-neutral-500 block mb-1">Your Name</label>
                      <input type="text" required className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059]" placeholder="e.g. Haris" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase text-neutral-500 block mb-1">Email Address</label>
                      <input type="email" required className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059]" placeholder="client@gmail.com" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-500 block mb-1">Hotline / Whatsapp Number</label>
                    <input type="tel" required className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059]" placeholder="03001234567" />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-500 block mb-1">Topic</label>
                    <select className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059]">
                      <option value="corporate-bulk">Corporate Bulk Acquisition</option>
                      <option value="residential-ac">Residential AC / Inverter Installation</option>
                      <option value="order-complaint">Order Freight Support</option>
                      <option value="private-viewing"> गुलबर्ग Lahore Flagship tour scheduling</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase text-neutral-500 block mb-1 font-semibold">Message Specs</label>
                    <textarea rows={4} className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059] resize-none" placeholder="Provide detailed specs of your request..."></textarea>
                  </div>

                  <button type="submit" className="w-full bg-[#C5A059] text-black font-bold uppercase tracking-widest py-3 text-xs hover:bg-[#DFBA73] transition-colors cursor-pointer">
                    Dispatch inquiries &rarr;
                  </button>
                </form>
              </div>

              {/* RHS DIRECT ADRESSES */}
              <div className="lg:col-span-5 bg-neutral-950 border border-neutral-900 p-6 sm:p-8 space-y-6">
                <h3 className="serif text-xl italic text-white pb-3 border-b border-neutral-900">Direct Contact vectors</h3>
                
                <div className="space-y-4 text-xs text-neutral-400">
                  <div className="flex gap-3">
                    <MapPin className="text-[#C5A059] shrink-0" size={16} />
                    <div>
                      <strong className="text-white uppercase block tracking-wider text-[11px]">Primary Lahore Lounge</strong>
                      <p className="mt-1">Avenzo Plaza, Block E2, Main Boulevard, Gulberg III, Lahore, Pakistan.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Mail className="text-[#C5A059] shrink-0" size={16} />
                    <div>
                      <strong className="text-white uppercase block tracking-wider text-[11px]">Digital Inbox</strong>
                      <p className="mt-1"><a href="mailto:support@avenzo.pk" className="hover:text-white underline font-mono">support@avenzo.pk</a></p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Phone className="text-[#C5A059] shrink-0" size={16} />
                    <div>
                      <strong className="text-white uppercase block tracking-wider text-[11px]">Client Representative Hotline</strong>
                      <p className="mt-1">Tel: <a href="tel:+923001234567" className="hover:text-white font-mono">+92-300-1234567</a></p>
                      <p className="text-[10px] text-neutral-500">Corporate hours: Mon - Sat (9:00 AM - 9:00 PM PST)</p>
                    </div>
                  </div>
                </div>

                {/* Styled Vector Map Mock Representing Gulberg Lahore */}
                <div className="border border-neutral-900 rounded p-4 bg-black space-y-3">
                  <div className="flex justify-between items-center text-[10px] uppercase text-neutral-500 tracking-wider">
                    <span>🗺 Gulberg III Visual Vector Plot</span>
                    <span className="text-green-500 font-bold font-mono">Active</span>
                  </div>
                  <div className="h-32 bg-neutral-900 rounded flex flex-col items-center justify-center border border-neutral-900">
                    <span className="text-[11px] font-bold text-[#C5A059] uppercase tracking-wider">Avenzo HQ Landmark</span>
                    <span className="text-[9px] text-neutral-500 mt-1 font-sans">Main Boulevard &bull; Opposite Pace Mall</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* 3. Product Details inspection Modal overlay */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
          isWishlisted={!!wishlist.find((p) => p.id === selectedProduct.id)}
          onAddReview={handleAddReview}
        />
      )}

      {/* 4. Global Footer Section */}
      <Footer setActivePage={setActivePage} />

    </div>
  );
}
