import React, { useState } from 'react';
import { Logo } from './Logo';
import { ShoppingBag, Heart, Search, User, Menu, X, Shield, LayoutDashboard } from 'lucide-react';
import { ActivePage, User as UserType } from '../types';

interface NavBarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  cartCount: number;
  wishlistCount: number;
  user: UserType | null;
  onLogout: () => void;
  onSearch: (query: string) => void;
}

export const NavBar: React.FC<NavBarProps> = ({
  activePage,
  setActivePage,
  cartCount,
  wishlistCount,
  user,
  onLogout,
  onSearch,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
    setActivePage('shop');
  };

  const navLinks: { label: string; page: ActivePage }[] = [
    { label: 'Collections', page: 'shop' },
    { label: 'Categories', page: 'categories' },
    { label: 'Our Story', page: 'about' },
    { label: 'Contact', page: 'contact' },
    { label: 'FAQs', page: 'faq' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 border-b border-gray-200 backdrop-blur-md">
      {/* Luxury Promo/Information banner bar at the very top of the website */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-700 text-white text-[9px] font-sans font-bold tracking-[0.25em] py-2 px-4 text-center select-none flex items-center justify-center gap-1.5 sm:gap-2 border-b border-indigo-800 shadow-sm">
        <span>★ COMPLIMENTARY INSURED WHITE-GLOVE FREIGHT DELIVERY ACROSS PAKISTAN</span>
        <span className="hidden md:inline">&bull; VISIT GULBERG III FLAGSHIP LOUNGE IN LAHORE</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Left Side: Mobile Menu toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-gray-550 hover:text-gray-900"
            id="mobile-menu-btn"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <button onClick={() => { setActivePage('home'); onSearch(''); setSearchVal(''); }} className="focus:outline-none">
            <Logo className="h-7 md:h-8" />
          </button>
        </div>

        {/* Center: Elegant Editorial Navigation Links */}
        <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.25em] font-medium text-gray-500">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => { setActivePage(link.page); onSearch(''); }}
              className={`hover:text-indigo-600 transition-all pb-1 border-b ${
                activePage === link.page ? 'border-indigo-600 text-indigo-650 font-bold' : 'border-transparent'
              }`}
            >
              {link.label}
            </button>
          ))}
          {user?.isAdmin && (
            <button
              onClick={() => setActivePage('admin')}
              className={`hover:text-indigo-700 text-indigo-600 transition-all font-semibold pb-1 border-b flex items-center gap-1.5 ${
                activePage === 'admin' ? 'border-indigo-600' : 'border-transparent'
              }`}
            >
              <LayoutDashboard size={12} /> ADMIN PORTAL
            </button>
          )}
        </nav>

        {/* Right Side: Currency, Search, Wishlist, Cart, Profile */}
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-gray-400 font-mono">
            PKR (Rs)
          </span>

          {/* Search Toggle */}
          <div className="relative">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
                <input
                  type="text"
                  placeholder="Search collections..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="bg-gray-100 border border-gray-200 rounded-full text-xs px-4 py-1.5 w-40 sm:w-56 focus:outline-none focus:border-indigo-550 text-gray-800"
                  autoFocus
                />
                <button type="submit" className="absolute right-2.5 p-1 text-gray-400 hover:text-gray-900">
                  <Search size={14} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 text-gray-550 hover:text-indigo-600 transition-colors"
                id="search-btn"
              >
                <Search size={19} />
              </button>
            )}
            {searchOpen && (
              <button
                onClick={() => { setSearchOpen(false); setSearchVal(''); onSearch(''); }}
                className="absolute right-[-4px] top-[-10px] text-[9px] bg-gray-200 text-gray-650 hover:text-gray-900 px-1.5 py-0.5 rounded animate-fade-in"
              >
                esc
              </button>
            )}
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={() => setActivePage('account')}
            className="p-1.5 text-gray-550 hover:text-indigo-600 transition-colors relative"
            id="wishlist-btn"
            title="Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setActivePage('cart')}
            className="p-1.5 text-indigo-600 hover:text-indigo-800 transition-colors relative"
            id="cart-btn"
            title="Shopping Cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-indigo-600 text-white text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full font-mono">
                {cartCount}
              </span>
            )}
          </button>

          {/* Account/Dashboard Icon */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActivePage('account')}
                  className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-indigo-650 bg-gray-55 bg-gray-100 border border-gray-200 py-1.5 px-3 rounded-lg"
                  id="user-profile-btn"
                >
                  <User size={13} className="text-indigo-600" />
                  <span className="hidden lg:inline max-w-[80px] truncate">{user?.name ? user.name.split(' ')[0] : 'Customer'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="hidden sm:inline text-[9px] uppercase tracking-widest text-gray-450 hover:text-red-650 transition-colors text-gray-400"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActivePage('account')}
                className="p-1.5 text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1.5 text-xs font-medium"
                id="login-btn"
              >
                <User size={18} />
                <span className="hidden sm:inline tracking-wider font-semibold text-[10px] uppercase text-gray-500 hover:text-gray-900">Sign In</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Panel */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-6 space-y-4 animate-fade-in animate-duration-150 shadow-md">
          <div className="flex flex-col gap-4 text-xs font-semibold tracking-widest uppercase font-sans">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  setActivePage(link.page);
                  setMenuOpen(false);
                }}
                className={`text-left py-2 hover:text-indigo-600 text-base ${
                  activePage === link.page ? 'text-indigo-650 font-bold' : 'text-gray-500'
                }`}
              >
                {link.label}
              </button>
            ))}
            {user?.isAdmin && (
              <button
                onClick={() => {
                  setActivePage('admin');
                  setMenuOpen(false);
                }}
                className="text-left py-2 text-indigo-600 hover:text-indigo-750 text-base flex items-center gap-2"
              >
                <LayoutDashboard size={18} /> ADMIN DASHBOARD
              </button>
            )}
            {user && (
              <button
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
                className="text-left py-2 text-red-600 uppercase tracking-[0.2em]"
              >
                Sign Out
              </button>
            )}
          </div>
          <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-center text-[10px] text-gray-400">
            <span>AVENZO CHANNELS</span>
            <span>support@avenzo.pk</span>
          </div>
        </div>
      )}
    </header>
  );
};
export default NavBar;
