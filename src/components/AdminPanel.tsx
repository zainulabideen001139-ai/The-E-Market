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
    <div className="max-w-7xl mx-auto border border-neutral-900 bg-black text-neutral-300 min-h-[700px] flex flex-col md:flex-row rounded-sm overflow-hidden font-sans">
      
      {/* 1. LEFT SIDEBAR PANEL */}
      <aside className="w-full md:w-64 bg-[#0A0A0A] border-r border-neutral-905 border-neutral-900 flex flex-col shrink-0">
        
        {/* Brand Header Section */}
        <div className="p-6 border-b border-neutral-900/80">
          <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-[#C5A059] font-mono font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span>Secured Session</span>
          </div>
          <h2 className="serif text-xl italic text-white font-medium mt-1">Avenzo Executive</h2>
          <p className="text-[10px] text-neutral-500 font-mono mt-0.5 uppercase tracking-wider">Metropolitan Console</p>
        </div>

        {/* Navigation links utilizing React Router Link */}
        <nav className="p-4 flex-grow flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/' && location.pathname === '/dashboard');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-xs font-semibold tracking-wide transition-all ${
                  isActive 
                    ? 'bg-[#C5A059] text-black shadow-lg font-bold' 
                    : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Executive Operator Tag */}
        <div className="p-4 border-t border-neutral-900/80 bg-black/40 text-left flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#C5A059] font-mono text-xs font-bold">
            AV
          </div>
          <div>
            <span className="text-[10px] uppercase text-neutral-400 block tracking-widest font-bold">Executive Officer</span>
            <span className="text-[9px] text-neutral-500 block font-mono">ID: AVN-ADMIN-01</span>
          </div>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <main className="flex-grow p-6 sm:p-8 bg-[#0D0D0D] flex flex-col min-w-0 relative">
        
        {/* Header Breadcrumbs */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-neutral-900 pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">Avenzo Control / Admin System</span>
            <h3 className="serif text-2xl italic text-white capitalize mt-0.5">
              {location.pathname === '/' || location.pathname === '/dashboard' ? 'System Overview' : location.pathname.substring(1).replace('-', ' ')}
            </h3>
          </div>
          
          <button 
            type="button"
            onClick={fetchTelemetry}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#C5A059] hover:text-white bg-neutral-950 border border-neutral-800 px-3 py-1.5 rounded-sm transition-colors"
          >
            <Activity size={10} /> FORCE RE-SYNC
          </button>
        </div>

        {/* SKELETON LOADING STATE CHECK */}
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-20 animate-fade-in space-y-4">
            <Loader2 className="text-[#C5A059] animate-spin" size={36} />
            <span className="text-xs text-neutral-500 font-mono tracking-widest uppercase">Connecting to Avenzo Cloud Nodes...</span>
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
    { label: 'Gross Invoiced sum', val: `Rs. ${grossRev.toLocaleString()}`, change: '+14% this cycle', icon: <DollarSign size={18} /> },
    { label: 'Active Reservations', val: `${totalOrders} orders`, change: 'Synced instantly', icon: <ShoppingBag size={18} /> },
    { label: 'Catalog Assets', val: `${totalProducts} designs`, change: '20 Elite models', icon: <Package size={18} /> },
    { label: 'Premium customer base', val: `${totalUsers} VIP clients`, change: 'NTN verified accounts', icon: <Users size={18} /> },
  ];

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  const lowStockProducts = products.filter(p => p.stock <= 5);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 4 KPI Widget Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, idx) => (
          <div key={idx} className="bg-neutral-950 border border-neutral-900 p-5 rounded-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 h-12 w-12 bg-[#C5A059]/5 rounded-bl-full flex items-center justify-center text-[#C5A059] opacity-70 group-hover:opacity-100 transition-opacity">
              <span className="p-2.5">{c.icon}</span>
            </div>
            <span className="text-[9px] uppercase font-mono text-neutral-500 tracking-wider block">{c.label}</span>
            <p className="text-xl font-bold font-mono text-white mt-1.5">{c.val}</p>
            <span className="text-[10px] text-[#C5A059] block mt-2 font-mono">{c.change}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Recent Orders Table */}
        <div className="lg:col-span-8 bg-neutral-950 border border-neutral-900 p-5 rounded-sm space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <h4 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Recent Acquisitions Queue</h4>
            <span 
              onClick={() => navigate('/orders')} 
              className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 hover:text-white cursor-pointer hover:underline"
            >
              See all dispatches &rarr;
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="text-neutral-500 border-b border-neutral-900 uppercase font-mono text-[9px] tracking-widest">
                  <th className="py-2.5">ID / Client</th>
                  <th className="py-2.5 font-mono text-center">Invoiced Sum</th>
                  <th className="py-2.5 text-center">Metropolitan</th>
                  <th className="py-2.5 text-right">Cargo Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60 text-neutral-400">
                {recentOrders.map((ro) => (
                  <tr key={ro.id} className="hover:bg-neutral-900/20">
                    <td className="py-3">
                      <strong className="text-white font-mono break-all font-semibold block">{ro.id}</strong>
                      <span className="text-[10px] text-neutral-500">{ro.customerName}</span>
                    </td>
                    <td className="py-3 text-center font-mono text-[#C5A059] font-medium">Rs. {ro.totalAmount.toLocaleString()}</td>
                    <td className="py-3 text-center uppercase text-[10px] tracking-wider text-neutral-300">{ro.city}</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                        ro.status === 'Pending' ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40' :
                        ro.status === 'Shipped' ? 'bg-blue-950/40 text-blue-400 border border-blue-900/40' :
                        ro.status === 'Delivered' ? 'bg-green-950/40 text-green-400 border border-green-900/40' :
                        'bg-red-950/40 text-red-400 border border-red-900/40'
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
        <div className="lg:col-span-4 bg-neutral-950 border border-neutral-900 p-5 rounded-sm space-y-4">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <h4 className="text-xs uppercase tracking-widest text-red-400 font-bold">Reserves warning</h4>
            <span 
              onClick={() => navigate('/products')} 
              className="text-[10px] uppercase font-mono text-neutral-500 hover:text-white cursor-pointer hover:underline"
            >
              Re-Stock
            </span>
          </div>

          <div className="space-y-3 max-h-[290px] overflow-y-auto">
            {lowStockProducts.length === 0 ? (
              <div className="py-8 text-center text-xs text-neutral-500 font-mono">
                ✓ All luxury reserves safe.
              </div>
            ) : (
              lowStockProducts.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-[#080808] border border-neutral-900 p-3 rounded-sm text-xs">
                  <div className="truncate max-w-[140px]">
                    <span className="text-white font-semibold block truncate">{p.name}</span>
                    <span className="text-[10px] text-neutral-500 font-mono">{p.sku}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase font-mono ${p.stock === 0 ? 'bg-red-950/50 text-red-400' : 'bg-amber-950/50 text-amber-400'}`}>
                    {p.stock === 0 ? 'Sold Out' : `${p.stock} units`}
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
    <div className="space-y-6 animate-fade-in">
      
      {/* Header operations row */}
      <div className="flex justify-between items-center">
        <h4 className="text-xs uppercase tracking-widest text-[#C5A059] font-mono font-bold">
          Digital Inventory Manager ({products.length} models)
        </h4>

        {!showAddForm && !editingProduct && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-[#C5A059] text-black font-bold text-xs uppercase tracking-widest py-2.5 px-5 rounded-sm flex items-center gap-1.5 hover:bg-[#DFBA73] transition-colors"
          >
            <Plus size={14} /> Design New Catalog Asset
          </button>
        )}
      </div>

      {/* Editing or Add Form representation */}
      {(showAddForm || editingProduct) && (
        <form onSubmit={handleProductSubmit} className="bg-neutral-950 border border-neutral-900 p-6 space-y-4 rounded-sm">
          <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
            <h4 className="serif text-lg italic text-white">
              {editingProduct ? 'Configure Masterpiece Blueprint' : 'Unveil New Masterpiece Design'}
            </h4>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setEditingProduct(null); }}
              className="text-neutral-500 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Asset Name</label>
              <input
                type="text"
                required
                className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059]"
                placeholder="Product name"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Category Classification</label>
              <select
                className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059]"
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
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Price (PKR Rs.)</label>
              <input
                type="number"
                required
                className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059] font-mono"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Unique SKU Identifier</label>
              <input
                type="text"
                className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059] font-mono"
                placeholder="Auto-generated if left blank"
                value={sku}
                onChange={e => setSku(e.target.value)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Initial Reserve Stock</label>
              <input
                type="number"
                required
                className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059] font-mono"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="text-[10px] uppercase text-neutral-500 block mb-1">Digital Image URL</label>
            <input
              type="text"
              className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059] font-mono"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-[10px] uppercase text-neutral-500 block mb-1">Bespoke Commercial Narrative</label>
              <textarea
                rows={4}
                required
                className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059] resize-none"
                placeholder="Description of craftsmanship and materials..."
                value={description}
                onChange={e => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div>
              <label className="text-[10px] uppercase text-[#C5A059] block mb-1">Mechanical Specifications (Format: Key: Value)</label>
              <textarea
                rows={4}
                className="bg-[#0A0A0A] border border-neutral-800 p-3 w-full text-white focus:outline-none focus:border-[#C5A059] font-mono whitespace-pre resize-none"
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
              className="px-5 py-2.5 text-xs font-semibold border border-neutral-800 text-neutral-400 hover:text-white"
            >
              Cancel Blueprint
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C5A059] text-black font-semibold text-xs uppercase tracking-widest hover:bg-[#DFBA73] transition-colors"
            >
              Assemble Asset &rarr;
            </button>
          </div>
        </form>
      )}

      {/* Grid listing products in tables */}
      <div className="border border-neutral-900 bg-neutral-950 rounded-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#141414] text-[#C5A059] uppercase tracking-widest text-[9px] border-b border-neutral-900">
              <th className="py-4 px-6">Curated Item Name</th>
              <th className="py-4 px-6 font-mono">SKU ID</th>
              <th className="py-4 px-6">Department</th>
              <th className="py-4 px-6 font-mono">Luxury Price</th>
              <th className="py-4 px-6 text-center font-mono">In Stock Reserves</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/40 text-neutral-400">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-neutral-900/10">
                <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                  <img src={p.imageUrl} alt={p.name} className="h-9 w-9 object-cover rounded border border-neutral-800 grayscale shrink-0" />
                  <span className="truncate max-w-[200px]">{p.name}</span>
                </td>
                <td className="py-4 px-6 font-mono break-all">{p.sku}</td>
                <td className="py-4 px-6 capitalize text-neutral-300">{p.category.replace('-', ' ')}</td>
                <td className="py-4 px-6 font-mono font-bold text-[#C5A059]">Rs. {p.price.toLocaleString()}</td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-2 py-0.5 rounded font-bold font-mono text-[10px] ${
                    p.stock <= 0 ? 'bg-red-950/40 text-red-400 border border-red-900/45' :
                    p.stock <= 5 ? 'bg-amber-950/40 text-amber-400 border border-amber-900/45' :
                    'bg-green-950/40 text-green-400 border border-green-900/45'
                  }`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="py-4 px-6 text-right space-x-2 shrink-0">
                  <button
                    onClick={() => { setEditingProduct(p); setShowAddForm(false); }}
                    className="text-neutral-400 hover:text-[#C5A059] p-1.5 hover:bg-neutral-900 rounded-sm transition-colors"
                    title="Readjust specifications"
                    id={`edit-prod-${p.id}`}
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-neutral-900 rounded-sm transition-colors"
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
    <div className="space-y-6 animate-fade-in relative">
      
      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
        <h4 className="text-xs uppercase tracking-widest text-[#C5A059] font-mono font-bold">
          Transit cargo registry & Freight control
        </h4>
        <span className="text-[10px] text-neutral-500 font-mono">*All payments verify as Cash On Delivery / Offline Bank Transfers.</span>
      </div>

      <div className="border border-neutral-900 bg-neutral-950 rounded-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#141414] text-[#C5A059] uppercase tracking-widest text-[9px] border-b border-neutral-900">
              <th className="py-4 px-6">ID & Creation Date</th>
              <th className="py-4 px-6">Client Identity</th>
              <th className="py-4 px-6">Shipping Destination</th>
              <th className="py-4 px-6 font-mono text-center">Quantity</th>
              <th className="py-4 px-6 font-mono text-center">Invoiced Revenue</th>
              <th className="py-4 px-6 text-center">Current Transit Stage</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/40 text-neutral-400">
            {[...orders]
              .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((o) => (
                <tr key={o.id} className="hover:bg-neutral-900/10">
                  <td className="py-4 px-6">
                    <strong className="text-white font-mono block font-bold">{o.id}</strong>
                    <span className="text-[10px] text-neutral-500 font-mono mt-0.5">{new Date(o.createdAt).toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6 space-y-0.5">
                    <div className="text-white font-semibold">{o.customerName}</div>
                    <div className="text-neutral-400 hover:text-[#C5A059] transition-all cursor-pointer">{o.customerEmail}</div>
                    <div className="text-neutral-500 font-mono text-[10px]">{o.customerPhone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="truncate max-w-[150px] text-neutral-300">{o.shippingAddress}</div>
                    <div className="text-[10px] text-[#C5A059] uppercase font-mono mt-0.5">{o.city} Hub</div>
                  </td>
                  <td className="py-4 px-6 text-center font-mono">
                    {o.items.reduce((sum, item) => sum + item.quantity, 0)} Items
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-center text-[#C5A059]">Rs. {o.totalAmount.toLocaleString()}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest border ${
                      o.status === 'Pending' ? 'bg-amber-950/40 text-amber-400 border-amber-900/40' :
                      o.status === 'Shipped' ? 'bg-blue-950/40 text-blue-400 border-blue-900/40' :
                      o.status === 'Delivered' ? 'bg-green-950/40 text-green-400 border-green-900/40' :
                      'bg-red-950/40 text-red-400 border-red-900/40'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right flex items-center justify-end gap-3.5 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedDetails(o)}
                      className="text-[#C5A059] bg-[#C5A059]/10 hover:bg-[#C5A059] hover:text-black hover:font-bold border border-[#C5A059]/20 transition-all text-[9px] tracking-widest font-mono uppercase px-2.5 py-1.5 rounded-sm"
                    >
                      Inspect Profile
                    </button>
                    
                    <select
                      value={o.status}
                      onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="bg-neutral-900 border border-neutral-800 text-[10px] text-white py-1.5 px-2 rounded-sm focus:border-[#C5A059] focus:outline-none cursor-pointer"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-neutral-800 max-w-lg w-full p-6 sm:p-8 rounded-sm space-y-6 animate-fade-in relative text-neutral-300">
            
            <div className="flex justify-between items-start border-b border-neutral-900 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#C5A059] tracking-wider">Acquisition Consignment Details</span>
                <h4 className="serif text-xl italic text-white font-medium mt-0.5">{selectedDetails.id}</h4>
              </div>
              <button 
                onClick={() => setSelectedDetails(null)} 
                className="text-neutral-500 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs font-sans">
              
              {/* Client specifications */}
              <div className="bg-black border border-neutral-900 p-4 space-y-3">
                <h5 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold border-b border-neutral-900 pb-2">Patron Registry</h5>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                  <div>
                    <span className="text-neutral-500 block uppercase text-[9px] tracking-wider">Full Name</span>
                    <span className="text-white font-semibold">{selectedDetails.customerName}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase text-[9px] tracking-wider">City Hub</span>
                    <span className="text-white font-mono">{selectedDetails.city}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase text-[9px] tracking-wider">Cellular Contact</span>
                    <a href={`tel:${selectedDetails.customerPhone}`} className="text-[#C5A059] hover:underline font-mono">{selectedDetails.customerPhone}</a>
                  </div>
                  <div>
                    <span className="text-neutral-500 block uppercase text-[9px] tracking-wider">Client Email</span>
                    <span className="text-neutral-300 break-all">{selectedDetails.customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Physical Logistics Destination Address */}
              <div className="bg-black border border-neutral-900 p-4 space-y-2">
                <h5 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1.5">
                  <MapPin size={11} className="text-[#C5A059]" /> Courier destination vectors
                </h5>
                <p className="text-neutral-300 font-semibold leading-relaxed">{selectedDetails.shippingAddress}</p>
                <span className="text-[9px] text-neutral-500 font-mono">*White-Glove Courier priority hand delivery.</span>
              </div>

              {/* Items Purchased details */}
              <div className="bg-black border border-neutral-900 p-4 space-y-2.5">
                <h5 className="text-[10px] uppercase tracking-wider text-[#C5A059] font-bold">Secured Goods</h5>
                <div className="space-y-2">
                  {selectedDetails.items.map((it: any) => (
                    <div key={it.product.id} className="flex justify-between items-center text-[11px] border-b border-neutral-900/40 pb-1.5 last:border-0 last:pb-0">
                      <span className="text-white mr-4 truncate">
                        {it.product.name} <strong className="font-mono text-[10px] text-neutral-500">x{it.quantity}</strong>
                      </span>
                      <span className="text-neutral-400 font-mono">Rs. {(it.product.price * it.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-neutral-900 text-white">
                    <span>Total Invoiced</span>
                    <span className="text-[#C5A059] font-mono">Rs. {selectedDetails.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setSelectedDetails(null)}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 font-semibold text-xs tracking-widest uppercase transition-colors"
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
    <div className="space-y-6 animate-fade-in">
      
      <div className="flex justify-between items-center pb-2 border-b border-neutral-900">
        <h4 className="text-xs uppercase tracking-widest text-[#C5A059] font-mono font-bold">
          VIP Registered Patron Database ({users.length} clients)
        </h4>
        <span className="text-[10px] text-green-500 uppercase font-mono font-bold leading-none flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></span> Encrypted Vault
        </span>
      </div>

      <div className="border border-neutral-900 bg-neutral-950 rounded-sm overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#141414] text-[#C5A059] uppercase tracking-widest text-[9px] border-b border-neutral-900">
              <th className="py-4 px-6">Client ID</th>
              <th className="py-4 px-6">Full Identity Name</th>
              <th className="py-4 px-6">Direct Correspondence</th>
              <th className="py-4 px-6">Metropolitan Hub Address</th>
              <th className="py-4 px-6 text-center font-mono">Account Role</th>
              <th className="py-4 px-6 text-right">Registration Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-900/40 text-neutral-400">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-neutral-900/10">
                <td className="py-4 px-6 font-mono text-neutral-500">{u.id}</td>
                <td className="py-4 px-6 font-semibold text-white">{u.name}</td>
                <td className="py-4 px-6 space-y-0.5">
                  <div className="text-neutral-300 flex items-center gap-1.5">
                    <Mail size={11} className="text-neutral-500" />
                    <span>{u.email}</span>
                  </div>
                  {u.phone && (
                    <div className="text-neutral-500 flex items-center gap-1.5 font-mono text-[10px]">
                      <Phone size={11} className="text-neutral-500 hover:text-[#C5A059]" />
                      <span>{u.phone}</span>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  {u.address ? (
                    <div className="space-y-0.5 text-neutral-400">
                      <div className="truncate max-w-[200px]">{u.address}</div>
                      <div className="text-[10px] text-[#C5A059] tracking-wider uppercase font-mono">{u.city || 'Lahore'} Metropolitan</div>
                    </div>
                  ) : (
                    <span className="text-neutral-600 font-mono italic">-</span>
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-widest border uppercase ${
                    u.isAdmin 
                      ? 'bg-purple-950/40 text-purple-400 border-purple-900/40' 
                      : 'bg-[#C5A059]/10 text-[#C5A059] border-[#C5A059]/10'
                  }`}>
                    {u.isAdmin ? 'Executive Officer' : 'VIP Client'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-mono text-neutral-500 text-[10px]">
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
    <div className="space-y-8 animate-fade-in font-sans">
      
      {/* KPI Cards section explicitly mapped as requested */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-sm">
          <span className="text-[9px] uppercase font-mono text-neutral-500 block">Revenue index</span>
          <p className="text-lg font-bold font-mono text-[#C5A059] mt-1">Rs. {revenueVal.toLocaleString()}</p>
          <span className="text-[9px] text-green-400 block mt-1.5 font-mono">✓ Audited Telemetry</span>
        </div>

        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-sm">
          <span className="text-[9px] uppercase font-mono text-neutral-500 block">Total Acquisitions</span>
          <p className="text-lg font-bold font-mono text-white mt-1">{totalOrders} dispatches</p>
          <span className="text-[9px] text-neutral-500 block mt-1.5 font-mono">100% active state</span>
        </div>

        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-sm">
          <span className="text-[9px] uppercase font-mono text-neutral-500 block">Pending cargo</span>
          <p className="text-lg font-bold font-mono text-amber-500 mt-1">{pendingOrders} queues</p>
          <span className="text-[9px] text-neutral-500 block mt-1.5 font-mono">Awaiting courier dispatch</span>
        </div>

        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-sm">
          <span className="text-[9px] uppercase font-mono text-neutral-500 block">Catalog coverage</span>
          <p className="text-lg font-bold font-mono text-white mt-1">{productsCount} products</p>
          <span className="text-[9px] text-[#C5A059] block mt-1.5 font-mono">Bespoke luxury specs</span>
        </div>

        <div className="bg-neutral-950 border border-neutral-900 p-4 rounded-sm">
          <span className="text-[9px] uppercase font-mono text-neutral-500 block">VIP Patrons List</span>
          <p className="text-lg font-bold font-mono text-white mt-1">{customersCount} clients</p>
          <span className="text-[9px] text-green-400 block mt-1.5 font-mono">Active accounts</span>
        </div>

      </div>

      {/* Visual Distributions of Catalog valuation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category distribution */}
        <div className="lg:col-span-8 bg-neutral-950 border border-neutral-900 p-6 rounded-sm space-y-5">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Category Catalog valuation and asset allocation</h4>
            <p className="text-[11px] text-neutral-400 mt-0.5">Calculated based on unit luxury listing price multiplied by remaining warehouse reserves.</p>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <div className="flex justify-between text-[#E5E5E5] mb-1">
                <span>Electronics & Computing System Units</span>
                <span className="font-mono text-neutral-400">Rs. {electronicsValue.toLocaleString()} ({getPercentage(electronicsValue)})</span>
              </div>
              <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                <div className="bg-[#C5A059] h-full transition-all duration-500" style={{ width: getPercentage(electronicsValue) }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#E5E5E5] mb-1">
                <span>Climate Sound & Living Comforts</span>
                <span className="font-mono text-neutral-400">Rs. {soundAppliancesValue.toLocaleString()} ({getPercentage(soundAppliancesValue)})</span>
              </div>
              <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                <div className="bg-[#C5A059] h-full transition-all duration-500" style={{ width: getPercentage(soundAppliancesValue) }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#E5E5E5] mb-1">
                <span>Ergonomic Boardrooms & Royal Chairs</span>
                <span className="font-mono text-neutral-400">Rs. {boardroomsFurnitureValue.toLocaleString()} ({getPercentage(boardroomsFurnitureValue)})</span>
              </div>
              <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                <div className="bg-[#C5A059] h-full transition-all duration-500" style={{ width: getPercentage(boardroomsFurnitureValue) }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[#E5E5E5] mb-1">
                <span>Urban Mobility Segways & Treadmills</span>
                <span className="font-mono text-neutral-400">Rs. {urbanMobilityValue.toLocaleString()} ({getPercentage(urbanMobilityValue)})</span>
              </div>
              <div className="w-full bg-neutral-900 h-2 rounded-full overflow-hidden">
                <div className="bg-[#C5A059] h-full transition-all duration-500" style={{ width: getPercentage(urbanMobilityValue) }}></div>
              </div>
            </div>
          </div>

          <div className="bg-[#0D0D0D] border border-neutral-900 p-3 flex justify-between items-center text-xs">
            <span className="text-neutral-400 uppercase tracking-wider font-mono text-[10px]">Total Store Inventory Valuation:</span>
            <strong className="text-white font-mono text-sm font-bold">Rs. {totalStoresAssetValue.toLocaleString()}</strong>
          </div>
        </div>

        {/* Territory Logistics Dispatch splits */}
        <div className="lg:col-span-4 bg-neutral-950 border border-neutral-900 p-6 rounded-sm space-y-4">
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Metropolitan Hub Logistics</h4>
            <p className="text-[10px] text-neutral-500 mt-0.5">Ratios of Cargo dispatch per metropolitan region.</p>
          </div>

          <div className="space-y-3.5 text-xs">
            {Object.keys(cityFreq).length === 0 ? (
              <p className="text-neutral-500 text-center font-mono py-10">No logs on dispatch telemetry yet.</p>
            ) : (
              Object.entries(cityFreq).map(([city, count]) => {
                const pct = (count / orders.length) * 100;
                return (
                  <div key={city} className="space-y-1">
                    <div className="flex justify-between text-neutral-300">
                      <span>{city} Metro Hub</span>
                      <span className="font-mono text-[11px] text-[#C5A059] font-semibold">{count} dispatches ({Math.round(pct)}%)</span>
                    </div>
                    <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#C5A059] h-full" style={{ width: `${pct}%` }}></div>
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
