import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Product, Order, OrderStatus, User } from '../types';
import { 
  LayoutDashboard, Plus, Trash2, Edit, TrendingUp, Users, ShoppingBag, 
  DollarSign, Package, Layers, X, ShieldAlert, Check, Loader2, ArrowLeft, 
  MapPin, Phone, Mail, Activity, ArrowUpRight, Percent, Calendar
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (payload: any) => Promise<void>;
  onUpdateProduct: (id: string, payload: any) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = (props) => {
  // HashRouter is fully self-contained and handles iframe navigation with extreme robustness
  return (
    <HashRouter>
      <AdminPanelContent {...props} />
    </HashRouter>
  );
};

// Sidebar Layout Container using React Router hooks
const AdminPanelContent: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState<any>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load telemetry dynamically from both backend and state sync
  const fetchTelemetry = async () => {
    try {
      const [anResp, usResp] = await Promise.all([
        fetch('/api/analytics'),
        fetch('/api/users')
      ]);
      
      if (anResp.ok) {
        const anData = await anResp.json();
        setAnalytics(anData);
      }
      
      if (usResp.ok) {
        const usData = await usResp.json();
        setUsers(usData);
      }
    } catch (err) {
      console.error('Telemetry fetch failed. Merging with internal stores instead.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, [products, orders]);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={14} /> },
    { label: 'Products Management', path: '/products', icon: <Package size={14} /> },
    { label: 'Orders Management', path: '/orders', icon: <ShoppingBag size={14} /> },
    { label: 'Users Management', path: '/users', icon: <Users size={14} /> },
    { label: 'Analytics Page', path: '/analytics', icon: <TrendingUp size={14} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto border border-gray-200 bg-[#F8FAFC] text-gray-800 min-h-[700px] flex flex-col md:flex-row rounded-xl overflow-hidden font-sans-inter shadow-sm">
      
      {/* 1. LEFT SIDEBAR PANEL */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
        
        {/* Brand Header Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-indigo-650 text-indigo-650 font-semibold font-mono font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-emerald-700">Secured Session</span>
          </div>
          <h2 className="serif text-xl italic text-gray-900 font-medium mt-1">Avenzo Executive</h2>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5 uppercase tracking-wider">Metropolitan Console</p>
        </div>

        {/* Navigation links utilizing React Router Link */}
        <nav className="p-4 flex-grow flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-650 font-bold shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={isActive ? 'text-indigo-600' : 'text-gray-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Executive Operator Tag */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 text-left flex items-center gap-3.5">
          <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-mono text-xs font-bold shadow-sm">
            AV
          </div>
          <div>
            <span className="text-[10px] uppercase text-gray-500 block tracking-wider font-semibold">Executive Officer</span>
            <span className="text-[9px] text-gray-400 block font-mono">ID: AVN-ADMIN-01</span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <main className="flex-grow p-6 sm:p-8 bg-[#F8FAFC] flex flex-col min-w-0 relative">
        
        {/* Header Breadcrumbs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-200/80 pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-gray-400 font-mono font-semibold">Avenzo Control / Admin System</span>
            <h3 className="serif text-2xl italic text-gray-900 capitalize mt-0.5 font-medium">
              {location.pathname === '/' || location.pathname === '/dashboard' ? 'System Overview' : location.pathname.substring(1).replace('-', ' ')}
            </h3>
          </div>
          
          <button 
            type="button"
            onClick={fetchTelemetry}
            className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-gray-600 hover:text-gray-900 bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-lg font-semibold transition-all hover:bg-gray-50"
          >
            <Activity size={12} className="text-indigo-650" /> FORCE RE-SYNC
          </button>
        </div>

        {/* SKELETON LOADING STATE CHECK */}
        {isLoading ? (
          <div className="flex-grow flex flex-col items-center justify-center py-20 animate-fade-in space-y-4 bg-[#F8FAFC]">
            <Loader2 className="text-indigo-600 animate-spin" size={36} />
            <span className="text-xs text-gray-400 font-mono tracking-wider uppercase font-semibold">Connecting to Avenzo Cloud Nodes...</span>
          </div>
        ) : (
          <div className="flex-1">
            <Routes>
              {/* Route Matching views */}
              <Route path="/" element={<DashboardView products={products} orders={orders} analytics={analytics} users={users} />} />
              <Route path="/dashboard" element={<DashboardView products={products} orders={orders} analytics={analytics} users={users} />} />
              <Route path="/products" element={<ProductsView products={products} onAddProduct={onAddProduct} onUpdateProduct={onUpdateProduct} onDeleteProduct={onDeleteProduct} />} />
              <Route path="/orders" element={<OrdersView orders={orders} onUpdateOrderStatus={onUpdateOrderStatus} />} />
              <Route path="/users" element={<UsersView users={users} />} />
              <Route path="/analytics" element={<AnalyticsView analytics={analytics} products={products} orders={orders} />} />
            </Routes>
          </div>
        )}

      </main>
    </div>
  );
};

/* ==========================================
   VIEW 1: DASHBOARD OVERVIEW VIEW
   ========================================== */
interface ViewProps {
  products: Product[];
  orders: Order[];
  analytics: any;
  users: User[];
}

const DashboardView: React.FC<ViewProps> = ({ products, orders, analytics, users }) => {
  const navigate = useNavigate();

  // Aggregate local fallbacks if backend analytics failed
  const grossRev = analytics?.revenue ?? orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = analytics?.ordersCount ?? orders.length;
  const totalProducts = analytics?.productsCount ?? products.length;
  const totalUsers = analytics?.customersCount ?? users.filter(u => !u.isAdmin).length;

  const cards = [
    { label: 'Gross Invoiced sum', val: `Rs. ${grossRev.toLocaleString()}`, change: '+14% this cycle', icon: <DollarSign size={18} />, colorClass: 'text-emerald-600' },
    { label: 'Active Reservations', val: `${totalOrders} orders`, change: 'Synced instantly', icon: <ShoppingBag size={18} />, colorClass: 'text-indigo-600' },
    { label: 'Catalog Assets', val: `${totalProducts} designs`, change: '20 Elite models', icon: <Package size={18} />, colorClass: 'text-sky-600' },
    { label: 'Premium customer base', val: `${totalUsers} VIP clients`, change: 'NTN verified accounts', icon: <Users size={18} />, colorClass: 'text-purple-600' },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const lowStockProducts = products.filter(p => p.stock <= 5);

  return (
    <div className="space-y-8 animate-fade-in font-sans-inter">
      
      {/* 4 KPI Widget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, idx) => (
          <div key={idx} className="bg-white border border-gray-200/60 p-5 rounded-xl shadow-sm relative group overflow-hidden transition-all duration-350 hover:shadow-md hover:border-gray-200">
            <div className={`absolute top-0 right-0 h-12 w-12 bg-gray-50 rounded-bl-full flex items-center justify-center ${c.colorClass} opacity-80 group-hover:opacity-100 transition-all rounded-full`}>
              <span className="p-2">{c.icon}</span>
            </div>
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider block font-semibold">{c.label}</span>
            <p className="text-xl font-bold text-gray-900 mt-2">{c.val}</p>
            <span className="text-[10px] text-gray-500 block mt-2 font-mono">{c.change}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Recent Orders Table */}
        <div className="lg:col-span-8 bg-white border border-gray-200/60 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-150 pb-3">
            <h4 className="text-xs uppercase tracking-wider text-gray-700 font-bold select-none">Recent Acquisitions Queue</h4>
            <span 
              onClick={() => navigate('/orders')} 
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer hover:underline flex items-center gap-1 transition-all"
            >
              See all dispatches <ArrowUpRight size={12} />
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 uppercase font-mono text-[9px] tracking-wider bg-gray-50/50">
                  <th className="py-2.5 px-3">ID / Client</th>
                  <th className="py-2.5 text-center font-semibold">Invoiced Sum</th>
                  <th className="py-2.5 text-center">Metropolitan</th>
                  <th className="py-2.5 text-right px-3">Cargo Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {recentOrders.map((ro) => (
                  <tr key={ro.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-3">
                      <strong className="text-gray-900 font-mono break-all font-semibold block">{ro.id}</strong>
                      <span className="text-[10px] text-gray-400">{ro.customerName}</span>
                    </td>
                    <td className="py-3 text-center font-semibold text-gray-800">Rs. {ro.totalAmount.toLocaleString()}</td>
                    <td className="py-3 text-center uppercase text-[10px] tracking-wider text-gray-550 font-medium">{ro.city}</td>
                    <td className="py-3 text-right px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wider border ${
                        ro.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200/60' :
                        ro.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200/60' :
                        ro.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-250/60' :
                        'bg-rose-50 text-rose-700 border-rose-200/65'
                      }`}>
                        {ro.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column: Low Stock Warnings */}
        <div className="lg:col-span-4 bg-white border border-gray-200/60 p-6 rounded-xl shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-gray-150 pb-3">
            <h4 className="text-xs uppercase tracking-wider text-rose-600 font-bold select-none">Reserves warning</h4>
            <span 
              onClick={() => navigate('/products')} 
              className="text-[11px] font-semibold text-indigo-650 hover:text-indigo-700 cursor-pointer hover:underline font-medium"
            >
              Re-Stock
            </span>
          </div>

          <div className="space-y-3 max-h-[290px] overflow-y-auto pr-1">
            {lowStockProducts.length === 0 ? (
              <div className="py-12 text-center text-xs text-gray-400 font-sans">
                ✓ All luxury reserves safe.
              </div>
            ) : (
              lowStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-gray-50 border border-gray-100 px-4 py-3 rounded-xl text-xs">
                  <div className="truncate max-w-[140px]">
                    <span className="text-gray-800 font-semibold block truncate" title={p.name}>{p.name}</span>
                    <span className="text-[10px] text-gray-400 font-mono tracking-normal">{p.sku}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase font-semibold ${
                    p.stock === 0 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-amber-50 text-amber-700 border border-amber-100'
                  }`}>
                    {p.stock === 0 ? 'Sold Out' : `${p.stock} left`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

/* ==========================================
   VIEW 2: PRODUCTS MANAGEMENT PAGE
   ========================================== */
interface ProductsViewProps {
  products: Product[];
  onAddProduct: (payload: any) => Promise<void>;
  onUpdateProduct: (id: string, payload: any) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
}

const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Field States
  const [name, setName] = useState('');
  const [category, setCategory] = useState('electronics');
  const [price, setPrice] = useState(75000);
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState(15);
  const [imageUrl, setImageUrl] = useState('');
  const [specsInput, setSpecsInput] = useState('Processor: Ultra Intel Core i7\nMemory: 16GB Dedicated LPDDR5\nFinishing: Titanium Coating');

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setPrice(editingProduct.price);
      setDescription(editingProduct.description);
      setSku(editingProduct.sku);
      setStock(editingProduct.stock);
      setImageUrl(editingProduct.imageUrl);
      setSpecsInput(editingProduct.specifications?.map(s => `${s.key}: ${s.value}`).join('\n') || '');
    } else {
      setName('');
      setCategory('electronics');
      setPrice(75000);
      setDescription('');
      setSku('');
      setStock(15);
      setImageUrl('');
      setSpecsInput('Processor: Ultra Intel Core i7\nMemory: 16GB Dedicated LPDDR5\nFinishing: Titanium Coating');
    }
  }, [editingProduct, showAddForm]);

  const parseSpecs = (str: string) => {
    return str
      .split('\n')
      .map(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          return { key: parts[0].trim(), value: parts[1].trim() };
        }
        return null;
      })
      .filter((s): s is { key: string; value: string } => s !== null);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !description) {
      alert('Kindly complete primary fields before unveiling asset.');
      return;
    }

    const payload = {
      name,
      category,
      price: Number(price),
      description,
      sku: sku || ('AVN-' + Math.floor(1000 + Math.random() * 9000)),
      stock: Number(stock),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
      specifications: parseSpecs(specsInput),
      isFeatured: true
    };

    try {
      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, payload);
        setEditingProduct(null);
      } else {
        await onAddProduct(payload);
        setShowAddForm(false);
      }
    } catch (err) {
      alert('Asset management transaction error. Sync aborted.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you absolutely sure you want to write-off this premium product from Avenzo database? This operation is irreversible.')) {
      await onDeleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans-inter">
      
      {/* Header operations row */}
      <div className="flex justify-between items-center bg-transparent">
        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-mono font-bold">
          Digital Inventory Manager ({products.length} models)
        </h4>

        {!showAddForm && !editingProduct && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm hover:shadow-md"
          >
            <Plus size={14} /> Design New Catalog Asset
          </button>
        )}
      </div>

      {/* Editing or Add Form representation */}
      {(showAddForm || editingProduct) && (
        <form onSubmit={handleProductSubmit} className="bg-white border border-gray-200/85 p-6 space-y-5 rounded-xl shadow-md">
          <div className="flex justify-between items-center border-b border-gray-150 pb-3">
            <h4 className="serif text-lg italic text-gray-950 font-semibold">
              {editingProduct ? 'Configure Masterpiece Blueprint' : 'Unveil New Masterpiece Design'}
            </h4>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setEditingProduct(null); }}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase text-gray-400 block mb-1 font-semibold tracking-wide">Asset Name</label>
              <input
                type="text"
                required
                className="bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-lg p-3 w-full text-gray-900 shadow-sm transition-all"
                placeholder="Product name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-gray-400 block mb-1 font-semibold tracking-wide">Category Classification</label>
              <select
                className="bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-lg p-3 w-full text-gray-900 shadow-sm transition-all"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="electronics">Electronics & Computing</option>
                <option value="home-appliances">Home & Sound Appliances</option>
                <option value="office-furniture">Executive Boardroom Suites</option>
                <option value="fitness-mobility">Fitness & Urban Mobility</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase text-gray-400 block mb-1 font-semibold tracking-wide">Price (PKR Rs.)</label>
              <input
                type="number"
                required
                className="bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-lg p-3 w-full text-gray-900 shadow-sm transition-all font-mono"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-gray-400 block mb-1 font-semibold tracking-wide">Unique SKU Identifier</label>
              <input
                type="text"
                className="bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-lg p-3 w-full text-gray-900 shadow-sm transition-all font-mono"
                placeholder="Auto-generated if left blank"
                value={sku}
                onChange={e => setSku(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-gray-400 block mb-1 font-semibold tracking-wide">Initial Reserve Stock</label>
              <input
                type="number"
                required
                className="bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-lg p-3 w-full text-gray-900 shadow-sm transition-all font-mono"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="text-[10px] uppercase text-gray-400 block mb-1 font-semibold tracking-wide">Digital Image URL</label>
            <input
              type="text"
              className="bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-lg p-3 w-full text-gray-900 shadow-sm transition-all font-mono"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase text-gray-400 block mb-1 font-semibold tracking-wide">Bespoke Commercial Narrative</label>
              <textarea
                rows={4}
                required
                className="bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-lg p-3 w-full text-gray-900 shadow-sm transition-all resize-none"
                placeholder="Description of craftsmanship and materials..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="text-[10px] uppercase text-indigo-600 block mb-1 font-semibold tracking-wide">Mechanical Specifications (Format: Key: Value)</label>
              <textarea
                rows={4}
                className="bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 rounded-lg p-3 w-full text-gray-900 shadow-sm transition-all font-mono whitespace-pre resize-none"
                placeholder="Processor: Intel Core i9 Extreme&#10;Memory: 32GB RAM&#10;Grids: Double-stage hybrid"
                value={specsInput}
                onChange={e => setSpecsInput(e.target.value)}
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setEditingProduct(null); }}
              className="px-5 py-2.5 text-xs font-semibold border border-gray-300 rounded-lg text-gray-650 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Cancel Blueprint
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              Assemble Asset &rarr;
            </button>
          </div>
        </form>
      )}

      {/* Grid listing products in tables */}
      <div className="border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/70 text-gray-700 uppercase tracking-wider text-[9px] border-b border-gray-150 font-bold">
              <th className="py-4 px-6 select-none">Curated Item Name</th>
              <th className="py-4 px-6 font-mono select-none">SKU ID</th>
              <th className="py-4 px-6 select-none">Department</th>
              <th className="py-4 px-6 font-mono select-none">Luxury Price</th>
              <th className="py-4 px-6 text-center font-mono select-none">In Stock Reserves</th>
              <th className="py-4 px-6 text-right select-none">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-600">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/40 transition-colors">
                <td className="py-4 px-6 font-semibold text-gray-900 flex items-center gap-3">
                  <img src={p.imageUrl} alt={p.name} className="h-9 w-9 object-cover rounded border border-gray-200 grayscale-0 shrink-0 shadow-sm" />
                  <span className="truncate max-w-[200px]" title={p.name}>{p.name}</span>
                </td>
                <td className="py-4 px-6 font-mono break-all">{p.sku}</td>
                <td className="py-4 px-6 capitalize text-gray-650">{p.category.replace('-', ' ')}</td>
                <td className="py-4 px-6 font-semibold text-gray-800">Rs. {p.price.toLocaleString()}</td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full font-bold font-mono text-[10px] border ${
                    p.stock <= 0 ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    p.stock <= 5 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2 shrink-0">
                  <button
                    onClick={() => { setEditingProduct(p); setShowAddForm(false); }}
                    className="text-gray-400 hover:text-indigo-600 p-2 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                    title="Readjust specifications"
                    id={`edit-prod-${p.id}`}
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-gray-400 hover:text-rose-600 p-2 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                    title="Discard catalog reserve"
                    id={`delete-prod-${p.id}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

/* ==========================================
   VIEW 3: ORDERS MANAGEMENT PAGE
   ========================================== */
interface OrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

const OrdersView: React.FC<OrdersViewProps> = ({ orders, onUpdateOrderStatus }) => {
  const [selectedDetails, setSelectedDetails] = useState<Order | null>(null);

  return (
    <div className="space-y-6 animate-fade-in relative font-sans-inter">
      
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-mono font-bold">
          Transit cargo registry & Freight control
        </h4>
        <span className="text-[10px] text-gray-400 font-mono">*All payments verify as Cash On Delivery / Offline Bank Transfers.</span>
      </div>

      <div className="border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto font-sans">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/70 text-gray-700 uppercase tracking-wider text-[9px] border-b border-gray-150 font-bold">
              <th className="py-4 px-6">ID & Creation Date</th>
              <th className="py-4 px-6">Client Identity</th>
              <th className="py-4 px-6">Shipping Destination</th>
              <th className="py-4 px-6 font-mono text-center">Quantity</th>
              <th className="py-4 px-6 font-mono text-center">Invoiced Revenue</th>
              <th className="py-4 px-6 text-center">Current Transit Stage</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-600">
            {[...orders]
              .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((o) => (
                <tr key={o.id} className="hover:bg-gray-50/40 transition-colors">
                  <td className="py-4 px-6">
                    <strong className="text-gray-900 font-mono block font-semibold">{o.id}</strong>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5">{new Date(o.createdAt).toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6 space-y-0.5">
                    <div className="text-gray-900 font-semibold">{o.customerName}</div>
                    <div className="text-indigo-650 hover:text-indigo-800 transition-all cursor-pointer font-medium" title="VIP client mail">{o.customerEmail}</div>
                    <div className="text-gray-400 font-mono text-[10px]">{o.customerPhone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="truncate max-w-[150px] text-gray-700" title={o.shippingAddress}>{o.shippingAddress}</div>
                    <div className="text-[10px] text-indigo-600 uppercase font-mono mt-0.5 font-semibold">{o.city} Hub</div>
                  </td>
                  <td className="py-4 px-6 text-center font-mono text-gray-800">
                    {o.items.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </td>
                  <td className="py-4 px-6 font-bold text-center text-gray-900">Rs. {o.totalAmount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      o.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      o.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      o.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-250' :
                      'bg-rose-50 text-rose-700 border-rose-250'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right flex items-center justify-end gap-3.5 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedDetails(o)}
                      className="text-indigo-600 bg-indigo-50 hover:bg-indigo-600 hover:text-white hover:font-bold border border-indigo-100 transition-all text-[10px] tracking-wider font-semibold uppercase px-3 py-1.5 rounded-lg shadow-sm"
                    >
                      Inspect Profile
                    </button>
                    
                    <select
                      value={o.status}
                      onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="bg-white border border-gray-200 text-gray-700 text-[11px] py-1.5 px-2 rounded-lg focus:ring-1 focus:ring-indigo-100 focus:border-indigo-500 hover:border-gray-300 focus:outline-none cursor-pointer shadow-sm font-medium"
                      id={`order-stage-${o.id}`}
                    >
                      <option value="Pending">Pending Queue</option>
                      <option value="Shipped">Shipped Cargo</option>
                      <option value="Delivered">Delivered Home</option>
                      <option value="Cancelled">Cancelled Order</option>
                    </select>
                  </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer profile modal inspection details popup */}
      {selectedDetails && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 max-w-lg w-full p-6 sm:p-8 rounded-xl space-y-6 animate-fade-in relative text-gray-800 shadow-xl">
            
            <div className="flex justify-between items-start border-b border-gray-150 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-indigo-600 tracking-wider font-semibold">Acquisition Consignment Details</span>
                <h4 className="serif text-xl italic text-gray-900 font-semibold mt-0.5">{selectedDetails.id}</h4>
              </div>
              <button 
                onClick={() => setSelectedDetails(null)} 
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Client specifications */}
              <div className="bg-gray-50 border border-gray-150 p-4 space-y-3 rounded-xl">
                <h4 className="text-[10px] uppercase tracking-wider text-gray-400 font-bold border-b border-gray-100 pb-2">Patron Registry</h4>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wider font-semibold">Full Name</span>
                    <span className="text-gray-900 font-semibold">{selectedDetails.customerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wider font-semibold">City Hub</span>
                    <span className="text-gray-900 font-mono font-semibold">{selectedDetails.city}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wider font-semibold">Cellular Contact</span>
                    <a href={`tel:${selectedDetails.customerPhone}`} className="text-indigo-650 hover:underline font-mono font-semibold">{selectedDetails.customerPhone}</a>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px] tracking-wider font-semibold">Client Email</span>
                    <span className="text-gray-700 break-all font-medium">{selectedDetails.customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Physical Logistics Destination Address */}
              <div className="bg-gray-50 border border-gray-155 bg-gray-50 border border-gray-150 p-4 space-y-2 rounded-xl">
                <h4 className="text-[10px] uppercase tracking-wider text-gray-500 font-bold flex items-center gap-1.5">
                  <MapPin size={11} className="text-indigo-600" /> Courier destination vectors
                </h4>
                <p className="text-gray-800 font-semibold leading-relaxed font-sans">{selectedDetails.shippingAddress}</p>
                <span className="text-[9px] text-gray-400 font-mono font-medium">*White-Glove Courier priority hand delivery.</span>
              </div>

              {/* Items Purchased details */}
              <div className="bg-gray-50 border border-gray-150 p-4 space-y-2.5 rounded-xl">
                <h4 className="text-[10px] uppercase tracking-wider text-indigo-600 font-bold">Secured Goods</h4>
                <div className="space-y-2">
                  {selectedDetails.items.map((it: any) => (
                    <div key={it.product.id} className="flex justify-between items-center text-[11px] border-b border-gray-200/40 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-gray-800 mr-4 truncate font-medium">
                        {it.product.name} <strong className="font-mono text-[10px] text-gray-400 font-semibold">x{it.quantity}</strong>
                      </span>
                      <span className="text-gray-700 font-mono font-semibold">Rs. {(it.product.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-gray-200 text-gray-900">
                    <span>Total Invoiced</span>
                    <span className="text-indigo-600 font-mono font-bold">Rs. {selectedDetails.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedDetails(null)}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 border border-gray-200 font-bold text-xs tracking-wider uppercase rounded-lg shadow-sm transition-colors text-gray-800"
              >
                Acknowledge File
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

/* ==========================================
   VIEW 4: USERS MANAGEMENT PAGE
   ========================================== */
interface UsersViewProps {
  users: User[];
}

const UsersView: React.FC<UsersViewProps> = ({ users }) => {
  return (
    <div className="space-y-6 animate-fade-in font-sans-inter">
      
      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
        <h4 className="text-xs uppercase tracking-wider text-gray-500 font-mono font-bold">
          VIP Registered Patron Database ({users.length} clients)
        </h4>
        <span className="text-[10px] text-emerald-600 uppercase font-mono font-bold leading-none flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Encrypted Vault
        </span>
      </div>

      <div className="border border-gray-200 bg-white rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/70 text-gray-700 uppercase tracking-wider text-[9px] border-b border-gray-150 font-bold">
              <th className="py-4 px-6 select-none">Client ID</th>
              <th className="py-4 px-6 select-none">Full Identity Name</th>
              <th className="py-4 px-6 select-none">Direct Correspondence</th>
              <th className="py-4 px-6 select-none">Metropolitan Hub Address</th>
              <th className="py-4 px-6 text-center font-mono select-none">Account Role</th>
              <th className="py-4 px-6 text-right select-none">Registration Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-600">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/40 transition-colors">
                <td className="py-4 px-6 font-mono text-gray-400">{u.id}</td>
                <td className="py-4 px-6 font-semibold text-gray-900">{u.name}</td>
                <td className="py-4 px-6 space-y-1">
                  <div className="text-gray-700 flex items-center gap-1.5">
                    <Mail size={11} className="text-gray-400" />
                    <span className="font-medium">{u.email}</span>
                  </div>
                  {u.phone && (
                    <div className="text-gray-400 flex items-center gap-1.5 font-mono text-[10px]">
                      <Phone size={11} className="text-gray-400 hover:text-indigo-650" />
                      <span>{u.phone}</span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  {u.address ? (
                    <div className="space-y-0.5 text-gray-600">
                      <div className="truncate max-w-[200px]" title={u.address}>{u.address}</div>
                      <div className="text-[10px] text-indigo-600 tracking-wider uppercase font-mono font-semibold">{u.city || 'Lahore'} Metropolitan</div>
                    </div>
                  ) : (
                    <span className="text-gray-300 font-mono italic">-</span>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold tracking-wider border uppercase ${
                    u.isAdmin 
                      ? 'bg-purple-50 text-purple-700 border-purple-200' 
                      : 'bg-indigo-50 text-indigo-750 text-indigo-700 border-indigo-150 border-indigo-100'
                  }`}>
                    {u.isAdmin ? 'Executive Officer' : 'VIP Client'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-mono text-gray-400 text-[10px]">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

/* ==========================================
   VIEW 5: ANALYTICS PAGE VIEW
   ========================================== */
interface AnalyticsViewProps {
  analytics: any;
  products: Product[];
  orders: Order[];
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ analytics, products, orders }) => {
  // Compute analytics dynamically
  const revenueVal = analytics?.revenue ?? orders.filter(o => o.status !== 'Cancelled').reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = analytics?.ordersCount ?? orders.length;
  const pendingOrders = analytics?.pendingOrdersCount ?? orders.filter(o => o.status === 'Pending').length;
  const productsCount = analytics?.productsCount ?? products.length;
  const customersCount = analytics?.customersCount ?? 2; // local fallback count

  // Calculated categories and stock value indices
  const electronicsValue = products.filter(p => p.category === 'electronics').reduce((sum, p) => sum + (p.price * p.stock), 0);
  const soundAppliancesValue = products.filter(p => p.category === 'home-appliances').reduce((sum, p) => sum + (p.price * p.stock), 0);
  const boardroomsFurnitureValue = products.filter(p => p.category === 'office-furniture').reduce((sum, p) => sum + (p.price * p.stock), 0);
  const urbanMobilityValue = products.filter(p => p.category === 'fitness-mobility').reduce((sum, p) => sum + (p.price * p.stock), 0);

  const totalStoresAssetValue = electronicsValue + soundAppliancesValue + boardroomsFurnitureValue + urbanMobilityValue;

  const getPercentage = (val: number) => {
    if (!totalStoresAssetValue) return '0%';
    const pct = (val / totalStoresAssetValue) * 100;
    return `${Math.round(pct)}%`;
  };

  // TCS hubs order dispatch ratios
  const cityFreq: Record<string, number> = {};
  orders.forEach(o => cityFreq[o.city] = (cityFreq[o.city] || 0) + 1);

  return (
    <div className="space-y-8 animate-fade-in font-sans-inter">
      
      {/* KPI Cards section explicitly mapped as requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-white border border-gray-200/60 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] uppercase font-mono text-gray-400 block font-semibold tracking-wide">Revenue index</span>
          <p className="text-lg font-bold text-emerald-600 mt-1">Rs. {revenueVal.toLocaleString()}</p>
          <span className="text-[9px] text-emerald-600 block mt-1.5 font-mono font-medium">✓ Audited Telemetry</span>
        </div>

        <div className="bg-white border border-gray-200/60 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] uppercase font-mono text-gray-400 block font-semibold tracking-wide">Total Acquisitions</span>
          <p className="text-lg font-bold text-gray-900 mt-1">{totalOrders} dispatches</p>
          <span className="text-[9px] text-gray-400 block mt-1.5 font-mono">100% active state</span>
        </div>

        <div className="bg-white border border-gray-200/60 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] uppercase font-mono text-gray-400 block font-semibold tracking-wide">Pending cargo</span>
          <p className="text-lg font-bold text-amber-600 mt-1">{pendingOrders} queues</p>
          <span className="text-[9px] text-gray-400 block mt-1.5 font-mono">Awaiting courier dispatch</span>
        </div>

        <div className="bg-white border border-gray-200/60 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] uppercase font-mono text-gray-400 block font-semibold tracking-wide">Catalog coverage</span>
          <p className="text-lg font-bold text-gray-900 mt-1">{productsCount} products</p>
          <span className="text-[9px] text-indigo-600 block mt-1.5 font-mono font-semibold">Bespoke luxury specs</span>
        </div>

        <div className="bg-white border border-gray-200/60 p-4 rounded-xl shadow-sm">
          <span className="text-[9px] uppercase font-mono text-gray-400 block font-semibold tracking-wide">VIP Patrons List</span>
          <p className="text-lg font-bold text-gray-900 mt-1">{customersCount} clients</p>
          <span className="text-[9px] text-emerald-600 block mt-1.5 font-mono font-medium">Active accounts</span>
        </div>

      </div>

      {/* Visual Distributions of Catalog valuation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category distribution */}
        <div className="lg:col-span-8 bg-white border border-gray-200/60 p-6 rounded-xl shadow-sm space-y-5">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-800 font-bold">Category Catalog valuation and asset allocation</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">Calculated based on unit luxury listing price multiplied by remaining warehouse reserves.</p>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <div className="flex justify-between text-gray-700 mb-1 font-medium">
                <span>Electronics & Computing System Units</span>
                <span className="font-mono text-gray-900 font-semibold">Rs. {electronicsValue.toLocaleString()} ({getPercentage(electronicsValue)})</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-500 rounded-full" style={{ width: getPercentage(electronicsValue) }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-700 mb-1 font-medium">
                <span>Climate Sound & Living Comforts</span>
                <span className="font-mono text-gray-900 font-semibold">Rs. {soundAppliancesValue.toLocaleString()} ({getPercentage(soundAppliancesValue)})</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-500 rounded-full" style={{ width: getPercentage(soundAppliancesValue) }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-700 mb-1 font-medium">
                <span>Ergonomic Boardrooms & Royal Chairs</span>
                <span className="font-mono text-gray-900 font-semibold">Rs. {boardroomsFurnitureValue.toLocaleString()} ({getPercentage(boardroomsFurnitureValue)})</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-500 rounded-full" style={{ width: getPercentage(boardroomsFurnitureValue) }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-gray-700 mb-1 font-medium">
                <span>Urban Mobility Segways & Treadmills</span>
                <span className="font-mono text-gray-900 font-semibold">Rs. {urbanMobilityValue.toLocaleString()} ({getPercentage(urbanMobilityValue)})</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full transition-all duration-500 rounded-full" style={{ width: getPercentage(urbanMobilityValue) }}></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-150 p-4.5 rounded-xl flex justify-between items-center text-xs p-3">
            <span className="text-gray-550 uppercase tracking-wide font-mono text-[10px] font-semibold text-gray-500">Total Store Inventory Valuation:</span>
            <strong className="text-gray-900 font-mono text-sm font-bold">Rs. {totalStoresAssetValue.toLocaleString()}</strong>
          </div>
        </div>

        {/* Territory Logistics Dispatch splits */}
        <div className="lg:col-span-4 bg-white border border-gray-200/60 p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <h4 className="text-xs uppercase tracking-wider text-gray-800 font-bold">Metropolitan Hub Logistics</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Ratios of Cargo dispatch per metropolitan region.</p>
          </div>

          <div className="space-y-3.5 text-xs">
            {Object.keys(cityFreq).length === 0 ? (
              <p className="text-gray-400 text-center font-sans py-12">No logs on dispatch telemetry yet.</p>
            ) : (
              Object.entries(cityFreq).map(([city, count]) => {
                const pct = (count / orders.length) * 100;
                return (
                  <div key={city} className="space-y-1">
                    <div className="flex justify-between text-gray-700">
                      <span>{city} Metro Hub</span>
                      <span className="font-mono text-[11px] text-indigo-600 font-semibold">{count} dispatches ({Math.round(pct)}%)</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
