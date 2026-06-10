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
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 border-b border-neutral-800 backdrop-blur-md">
      {/* Luxury Promo/Information banner bar at the very top of the website */}
      <div className="bg-[#C5A059] text-black text-[9px] font-sans font-bold tracking-[0.25em] py-2 px-4 text-center select-none flex items-center justify-center gap-1.5 sm:gap-2 border-b border-[#9E7A3B]">
        <span>★ COMPLIMENTARY INSURED WHITE-GLOVE FREIGHT DELIVERY ACROSS PAKISTAN</span>
        <span className="hidden md:inline">&bull; VISIT GULBERG III FLAGSHIP LOUNGE IN LAHORE</span>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        
        {/* Left Side: Mobile Menu toggle & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white"
            id="mobile-menu-btn"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <button onClick={() => { setActivePage('home'); onSearch(''); setSearchVal(''); }} className="focus:outline-none">
            <Logo className="h-7 md:h-8" />
          </button>
        </div>

        {/* Center: Elegant Editorial Navigation Links */}
        <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.25em] font-medium text-neutral-400">
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => { setActivePage(link.page); onSearch(''); }}
              className={`hover:text-white transition-all pb-1 border-b ${
                activePage === link.page ? 'border-[#C5A059] text-white' : 'border-transparent'
              }`}
            >
              {link.label}
            </button>
          ))}
          {user?.isAdmin && (
            <button
              onClick={() => setActivePage('admin')}
              className={`hover:text-[#C5A059] text-[#C5A059]/90 transition-all font-semibold pb-1 border-b flex items-center gap-1.5 ${
                activePage === 'admin' ? 'border-[#C5A059]' : 'border-transparent'
              }`}
            >
              <LayoutDashboard size={12} /> ADMIN PORTAL
            </button>
          )}
        </nav>

        {/* Right Side: Currency, Search, Wishlist, Cart, Profile */}
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="hidden sm:inline text-[9px] uppercase tracking-widest text-neutral-500 font-mono">
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
                  className="bg-neutral-900 border border-[#C5A059]/30 rounded-full text-xs px-4 py-1.5 w-40 sm:w-56 focus:outline-none focus:border-[#C5A059] text-white"
                  autoFocus
                />
                <button type="submit" className="absolute right-2.5 p-1 text-neutral-400 hover:text-white">
                  <Search size={14} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-1.5 text-neutral-400 hover:text-[#C5A059] transition-colors"
                id="search-btn"
              >
                <Search size={19} />
              </button>
            )}
            {searchOpen && (
              <button
                onClick={() => { setSearchOpen(false); setSearchVal(''); onSearch(''); }}
                className="absolute right-[-4px] top-[-10px] text-[9px] bg-neutral-800 text-neutral-400 hover:text-white px-1.5 py-0.5 rounded"
              >
                esc
              </button>
            )}
          </div>

          {/* Wishlist Icon */}
          <button
            onClick={() => setActivePage('account')}
            className="p-1.5 text-neutral-400 hover:text-[#C5A059] transition-colors relative"
            id="wishlist-btn"
            title="Wishlist"
          >
            <Heart size={19} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#C5A059] text-black text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Icon */}
          <button
            onClick={() => setActivePage('cart')}
            className="p-1.5 text-[#C5A059] hover:text-white transition-colors relative"
            id="cart-btn"
            title="Shopping Cart"
          >
            <ShoppingBag size={19} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#C5A059] text-black text-[9px] font-bold h-4 w-4 flex items-center justify-center rounded-full font-mono">
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
                  className="flex items-center gap-1.5 text-xs text-neutral-300 hover:text-[#C5A059] bg-neutral-900 border border-neutral-800 py-1 px-2 rounded-sm"
                  id="user-profile-btn"
                >
                  <User size={13} className="text-[#C5A059]" />
                  <span className="hidden lg:inline max-w-[80px] truncate">{user?.name ? user.name.split(' ')[0] : 'Customer'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="hidden sm:inline text-[9px] uppercase tracking-widest text-neutral-500 hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActivePage('account')}
                className="p-1.5 text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-medium"
                id="login-btn"
              >
                <User size={18} />
                <span className="hidden sm:inline tracking-wider font-semibold text-[10px] uppercase text-neutral-400 hover:text-white">Sign In</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation Panel */}
      {menuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-neutral-800 px-6 py-6 space-y-4 animate-fade-in animate-duration-150">
          <div className="flex flex-col gap-4 text-xs font-semibold tracking-widest uppercase">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  setActivePage(link.page);
                  setMenuOpen(false);
                }}
                className={`text-left py-2 hover:text-white text-base ${
                  activePage === link.page ? 'text-[#C5A059]' : 'text-neutral-400'
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
                className="text-left py-2 text-[#C5A059] hover:text-[#DFBA73] text-base flex items-center gap-2"
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
                className="text-left py-2 text-red-500 uppercase tracking-[0.2em]"
              >
                Sign Out
              </button>
            )}
          </div>
          <div className="border-t border-neutral-900 pt-4 mt-4 flex justify-between items-center text-[10px] text-neutral-500">
            <span>AVENZO CHANNELS</span>
            <span>support@avenzo.pk</span>
          </div>
        </div>
      )}
    </header>
  );
};
export default NavBar;
