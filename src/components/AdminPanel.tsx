import React, { useState, useEffect } from 'react';
import { Product, Order, OrderStatus } from '../types';
import { LayoutDashboard, Plus, Trash2, Edit, TrendingUp, Users, ShoppingBag, DollarSign, Package, Layers, X, ShieldAlert, Check } from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (payload: any) => Promise<void>;
  onUpdateProduct: (id: string, payload: any) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders'>('stats');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields for Add/Edit
  const [name, setName] = useState('');
  const [category, setCategory] = useState('electronics');
  const [price, setPrice] = useState(60000);
  const [description, setDescription] = useState('');
  const [sku, setSku] = useState('');
  const [stock, setStock] = useState(10);
  const [imageUrl, setImageUrl] = useState('');
  const [specsInput, setSpecsInput] = useState('Processor: Ultra Dynamic Core\nMemory: 16GB Dedicated LPDDR5');

  // Load Form Fields for edit mode
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setCategory(editingProduct.category);
      setPrice(editingProduct.price);
      setDescription(editingProduct.description);
      setSku(editingProduct.sku);
      setStock(editingProduct.stock);
      setImageUrl(editingProduct.imageUrl);
      
      const specsStr = editingProduct.specifications
        ? editingProduct.specifications.map(s => `${s.key}: ${s.value}`).join('\n')
        : '';
      setSpecsInput(specsStr);
    } else {
      setName('');
      setCategory('electronics');
      setPrice(75000);
      setDescription('');
      setSku('');
      setStock(15);
      setImageUrl('');
      setSpecsInput('Processor: Ultra Intel Core i7\nMemory: 16GB Dedicated LPDDR5');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const specsParsed = parseSpecs(specsInput);
    const payload = {
      name,
      category,
      price: Number(price),
      description,
      sku: sku || ('AVN-' + Math.floor(Math.random() * 10000)),
      stock: Number(stock),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
      specifications: specsParsed,
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
      alert('Error updating custom server datastore. Verification needed.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you strictly sure you want to write-off this premium product from Avenzo store assets?')) {
      await onDeleteProduct(id);
    }
  };

  // AGGREGATED STATISTICS CALCULATIONS
  const totalInvoicedAssets = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  const pendingCargoCount = orders.filter(o => o.status === 'Pending').length;
  const transitCount = orders.filter(o => o.status === 'Shipped').length;
  const completedCount = orders.filter(o => o.status === 'Delivered').length;
  
  // High volume cities listing
  const cityCount: Record<string, number> = {};
  orders.forEach(o => cityCount[o.city] = (cityCount[o.city] || 0) + 1);

  return (
    <div className="bg-[#0A0A0A] border border-neutral-800 p-6 sm:p-8 rounded-sm text-neutral-300 animate-fade-in max-w-7xl mx-auto">
      
      {/* Admin Title Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-neutral-900 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#C5A059] font-mono leading-none">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span> Live Security Authorization Accepted
          </div>
          <h2 className="serif text-3xl italic text-white mt-1.5">Executive Suite Dashboard</h2>
        </div>

        {/* Action triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setActiveTab('stats'); setEditingProduct(null); setShowAddForm(false); }}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold border ${
              activeTab === 'stats' ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Analytics Overview
          </button>
          <button
            onClick={() => { setActiveTab('products'); setEditingProduct(null); setShowAddForm(false); }}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold border ${
              activeTab === 'products' ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Luxury Stocks ({products.length})
          </button>
          <button
            onClick={() => { setActiveTab('orders'); setEditingProduct(null); setShowAddForm(false); }}
            className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold border ${
              activeTab === 'orders' ? 'bg-[#C5A059] text-black border-[#C5A059]' : 'border-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            Order Consignments ({orders.length})
          </button>
        </div>
      </div>

      {/* 1. STATS TAB */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          
          {/* Executive Widgets Card grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-neutral-950 border border-neutral-900 p-5 rounded">
              <div className="flex justify-between items-center text-neutral-500">
                <span className="text-[10px] uppercase font-mono tracking-wider">Gross Invoiced Revenue</span>
                <DollarSign size={16} className="text-[#C5A059]" />
              </div>
              <p className="text-2xl font-bold font-mono text-white mt-2">
                Rs. {totalInvoicedAssets.toLocaleString()}
              </p>
              <div className="text-[10px] text-green-400 mt-2 font-mono flex items-center gap-1">
                <TrendingUp size={11} /> +12.4% vs last cycle
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-900 p-5 rounded">
              <div className="flex justify-between items-center text-neutral-500">
                <span className="text-[10px] uppercase font-mono tracking-wider">Avenzo Order Reserves</span>
                <ShoppingBag size={16} className="text-[#C5A059]" />
              </div>
              <p className="text-2xl font-bold font-mono text-white mt-2">
                {orders.length}
              </p>
              <div className="text-[10px] text-neutral-500 mt-2 font-mono">
                {pendingCargoCount} pending &bull; {transitCount} in-transit
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-900 p-5 rounded">
              <div className="flex justify-between items-center text-neutral-500">
                <span className="text-[10px] uppercase font-mono tracking-wider">Active Catalog Assets</span>
                <Package size={16} className="text-[#C5A059]" />
              </div>
              <p className="text-2xl font-bold font-mono text-white mt-2">
                {products.length} Items
              </p>
              <div className="text-[10px] text-neutral-500 mt-2 font-mono">
                Total Units: {products.reduce((acc, p) => acc + p.stock, 0)} secured
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-900 p-5 rounded">
              <div className="flex justify-between items-center text-neutral-500">
                <span className="text-[10px] uppercase font-mono tracking-wider">Client Base Registrations</span>
                <Users size={16} className="text-[#C5A059]" />
              </div>
              <p className="text-2xl font-bold font-mono text-white mt-2">
                2 Premium clients
              </p>
              <div className="text-[10px] text-green-400 mt-2 font-mono">
                Lahore, Karachi, Islamabad
              </div>
            </div>

          </div>

          {/* Visual Custom Representation for Charts & Reports */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sales Volume Progress Bar representation */}
            <div className="lg:col-span-8 bg-neutral-950 border border-neutral-900 p-6 rounded">
              <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold mb-4">Volume Distribution Channels</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Electronics & Computing Products</span>
                    <span className="font-mono">PKR {products.filter(p => p.category === 'electronics').reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()} Value</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#C5A059] h-full" style={{ width: '65%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Home Climatic, Living & Sound Appliances</span>
                    <span className="font-mono">PKR {products.filter(p => p.category === 'home-appliances').reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()} Value</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#C5A059] h-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Ergonomic Boardroom Office Masterpieces</span>
                    <span className="font-mono">PKR {products.filter(p => p.category === 'office-furniture').reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()} Value</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#C5A059] h-full" style={{ width: '30%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs text-neutral-400 mb-1">
                    <span>Fitness Treadmills & Urban Scooters</span>
                    <span className="font-mono">PKR {products.filter(p => p.category === 'fitness-mobility').reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString()} Value</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-[#C5A059] h-full" style={{ width: '22%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographical Distribution Widget */}
            <div className="lg:col-span-4 bg-neutral-950 border border-neutral-900 p-6 rounded space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-[#C5A059] font-bold">Demographics Dispatch</h3>
              <ul className="space-y-2.5 text-xs">
                {Object.entries(cityCount).map(([city, count]) => (
                  <li key={city} className="flex justify-between items-center py-2 border-b border-neutral-900">
                    <span className="text-white font-semibold">{city} Hub</span>
                    <span className="bg-[#C5A059]/10 text-[#C5A059] font-semibold px-2 py-0.5 rounded font-mono">{count} orders</span>
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-neutral-500 leading-normal italic mt-2">
                *TCS Courier integration delivers Avenzo orders across 12 major hubs of Pakistan.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. PRODUCTS MANAGING TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Luxury Digital Inventory Manager</h3>
            
            {!showAddForm && !editingProduct && (
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider py-2 px-4 rounded-sm flex items-center gap-1.5 hover:bg-[#DFBA73] transition-colors"
                id="add-product-btn"
              >
                <Plus size={14} /> Design New Catalog Asset
              </button>
            )}
          </div>

          {/* New Catalog Asset / Editing Asset Form */}
          {(showAddForm || editingProduct) && (
            <form onSubmit={handleSubmit} className="bg-neutral-950 border border-neutral-900 p-6 space-y-4 animate-fade-in">
              <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  {editingProduct ? 'Configure Masterpiece Asset' : 'Unveil New Curated Concept'}
                </h4>
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingProduct(null); }}
                  className="text-neutral-500 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">Asset Model Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-2.5 w-full focus:outline-none focus:border-[#C5A059]"
                    placeholder="Avenzo Hydra Super Core"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">Target Department</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-2.5 w-full focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value="electronics">Electronics & Computing</option>
                    <option value="home-appliances">Home & Living</option>
                    <option value="office-furniture">Executive Office Suite</option>
                    <option value="fitness-mobility">Fitness & Mobility</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">Imperial Price SKU (PKR)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={50000}
                    max={120000}
                    className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-2.5 w-full focus:outline-none focus:border-[#C5A059] font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">SKU Identity Code</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-2.5 w-full focus:outline-none focus:border-[#C5A059]"
                    placeholder="AVN-HYD-550"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">In-Stock Reserve Units</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-2.5 w-full focus:outline-none focus:border-[#C5A059] font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase text-neutral-500 block mb-1">Asset Image URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-2.5 w-full focus:outline-none focus:border-[#C5A059]"
                    placeholder="e.g., https://unsplash.com/image-link"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase text-neutral-500 block mb-1">Curators Story Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-2.5 w-full focus:outline-none focus:border-[#C5A059] resize-none"
                  placeholder="Tell clients the luxury materials used to compose this asset..."
                ></textarea>
              </div>

              <div>
                <label className="text-[10px] uppercase text-neutral-500 block mb-1">Specifications (One Key:Value per line)</label>
                <textarea
                  rows={3}
                  value={specsInput}
                  onChange={(e) => setSpecsInput(e.target.value)}
                  className="bg-[#0A0A0A] border border-neutral-800 text-xs text-white p-2.5 w-full focus:outline-none focus:border-[#C5A059] font-mono resize-none"
                  placeholder="Chassis: Magnesium Alloy&#10;Power: 2200W Pure Sine"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowAddForm(false); setEditingProduct(null); }}
                  className="bg-neutral-900 text-neutral-400 px-4 py-2 border border-neutral-800 hover:text-white hover:border-neutral-700 text-xs font-semibold uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A059] text-black font-bold text-xs uppercase tracking-wider px-5 py-2 hover:bg-[#DFBA73] transition-colors"
                >
                  {editingProduct ? 'Commit Asset Parameters' : 'Authorize Launch Publication'}
                </button>
              </div>
            </form>
          )}

          {/* Inventory lists tabular view */}
          <div className="bg-neutral-950 border border-neutral-900 rounded overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#141414] text-[#C5A059] uppercase tracking-widest text-[9px] border-b border-neutral-900">
                <tr>
                  <th className="py-4 px-6">Masterpiece Name</th>
                  <th className="py-4 px-6">SKU ID</th>
                  <th className="py-4 px-6">Department</th>
                  <th className="py-4 px-6">Retail Price</th>
                  <th className="py-4 px-6 text-center">Remaining Stock</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-900/40">
                    <td className="py-4 px-6 font-semibold text-white flex items-center gap-3">
                      <img src={p.imageUrl} alt={p.name} className="h-8 w-8 object-cover rounded border border-neutral-800 grayscale" />
                      <span className="truncate max-w-[200px]">{p.name}</span>
                    </td>
                    <td className="py-4 px-6 font-mono text-neutral-400">{p.sku}</td>
                    <td className="py-4 px-6 capitalize">{p.category.replace('-', ' ')}</td>
                    <td className="py-4 px-6 font-mono font-semibold text-[#C5A059]">Rs. {p.price.toLocaleString()}</td>
                    <td className="py-4 px-6 text-center font-mono">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                        p.stock <= 0 
                          ? 'bg-red-950/40 text-red-400' 
                          : p.stock <= 5 
                          ? 'bg-amber-950/40 text-amber-400' 
                          : 'bg-green-950/40 text-green-400'
                      }`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => { setEditingProduct(p); setShowAddForm(false); }}
                        className="text-neutral-400 hover:text-[#C5A059] p-1.5 hover:bg-neutral-800 rounded transition-colors"
                        title="Edit params"
                        id={`edit-asset-${p.id}`}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-neutral-400 hover:text-red-400 p-1.5 hover:bg-neutral-800 rounded transition-colors"
                        title="Dismantle asset"
                        id={`delete-asset-${p.id}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 3. ORDERS MANAGING TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h3 className="text-xs uppercase tracking-widest text-neutral-400 font-bold">Client Order Consignments & Tracking</h3>
          
          <div className="bg-neutral-950 border border-neutral-900 rounded overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#141414] text-[#C5A059] uppercase tracking-widest text-[9px] border-b border-neutral-900">
                <tr>
                  <th className="py-4 px-6">ID & Date</th>
                  <th className="py-4 px-6">Client Credentials</th>
                  <th className="py-4 px-6">Address</th>
                  <th className="py-4 px-6 font-mono text-center">Items Count</th>
                  <th className="py-4 px-6 text-center">Price Sum</th>
                  <th className="py-4 px-6 text-center">Transit Stage</th>
                  <th className="py-4 px-6 text-right">Update Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-900/40">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-white font-mono">{o.id}</div>
                      <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                        {new Date(o.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4 px-6 space-y-0.5">
                      <div className="text-white font-semibold">{o.customerName}</div>
                      <div className="text-neutral-400 hover:underline">{o.customerEmail}</div>
                      <div className="text-neutral-500 font-mono text-[10px]">{o.customerPhone}</div>
                    </td>
                    <td className="py-4 px-6 text-neutral-400">
                      <div className="truncate max-w-[150px]">{o.shippingAddress}</div>
                      <div className="text-[10px] uppercase tracking-widest text-white mt-0.5">{o.city} Hub</div>
                    </td>
                    <td className="py-4 px-6 text-center font-mono text-neutral-300">
                      {o.items.reduce((acc, current) => acc + current.quantity, 0)} Items
                    </td>
                    <td className="py-4 px-6 text-center font-mono font-semibold text-[#C5A059]">
                      Rs. {o.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${
                        o.status === 'Pending' 
                          ? 'bg-amber-950/50 text-amber-400 border border-amber-9050' 
                          : o.status === 'Shipped'
                          ? 'bg-blue-950/50 text-blue-400 border border-blue-950'
                          : o.status === 'Delivered'
                          ? 'bg-green-950/50 text-green-400 border border-green-950'
                          : 'bg-red-950/50 text-red-400 border border-red-950'
                      }`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <select
                        value={o.status}
                        onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className="bg-neutral-900 border border-neutral-800 text-[10px] text-white py-1 px-2.5 rounded focus:border-[#C5A059] focus:outline-none cursor-pointer"
                        id={`status-selector-${o.id}`}
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
        </div>
      )}

    </div>
  );
};
export default AdminPanel;
