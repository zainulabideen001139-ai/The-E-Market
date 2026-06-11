import React from 'react';
import { Mail, Phone, MapPin, ShieldCheck, HelpCircle, Truck, RefreshCw } from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="bg-[#F8FAFC] border-t border-gray-200 mt-20">
      
      {/* Upper Footer: Quick Trust Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded bg-indigo-50 border border-indigo-100 text-indigo-700">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-800">Insured Premium Shipping</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Complimentary express shipping across Pakistan.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded bg-indigo-50 border border-indigo-100 text-indigo-700">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-800">Authentic Luxury Assurance</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">100% genuine products with manufacturer warranty.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded bg-indigo-50 border border-indigo-100 text-indigo-700">
              <RefreshCw size={20} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-800">Bespoke Returns Policy</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">HASSLE-FREE luxury returns within 14 days.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 rounded bg-indigo-50 border border-indigo-100 text-indigo-700">
              <HelpCircle size={20} />
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider font-semibold text-gray-800">24/7 Priority Support</h4>
              <p className="text-[11px] text-gray-500 mt-0.5">Direct chat or cellular hotline support.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 text-sm leading-relaxed">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <h3 className="serif text-xl italic text-gray-900 tracking-[0.1em]">Avenzo <span className="text-indigo-600 font-sans font-bold">Official</span></h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
            Established in Lahore, Pakistan, Avenzo serves the design-conscious elite with premium consumer electronics, ergonomic masterpieces, and smart lifestyle systems.
          </p>
          <div className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
            EST. MMXXIV &middot; LAHORE
          </div>
        </div>

        {/* Quick Collections */}
        <div className="space-y-4 font-sans">
          <h4 className="text-xs uppercase tracking-widest text-gray-800 font-bold">Curated Catalogs</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActivePage('shop')} className="text-gray-500 hover:text-indigo-600 transition-colors">
                Premium Laptops & Phones
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('shop')} className="text-gray-500 hover:text-indigo-600 transition-colors">
                Ultra-HD Cinematic Screens
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('shop')} className="text-gray-500 hover:text-indigo-600 transition-colors">
                Executive Ergonomic Seating
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('shop')} className="text-gray-500 hover:text-indigo-600 transition-colors">
                Smart Climatic Inverters
              </button>
            </li>
          </ul>
        </div>

        {/* Brand Governance Policies */}
        <div className="space-y-4 font-sans">
          <h4 className="text-xs uppercase tracking-widest text-gray-800 font-bold">Client Governance</h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => setActivePage('shipping-policy')} className="text-gray-500 hover:text-indigo-600 transition-colors text-left block">
                Shipping & Handling Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('refund-policy')} className="text-gray-500 hover:text-indigo-600 transition-colors text-left block">
                Returns & Refund Policy
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('privacy')} className="text-gray-500 hover:text-indigo-600 transition-colors text-left block">
                Privacy Protection
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('terms')} className="text-gray-500 hover:text-indigo-600 transition-colors text-left block">
                Terms of Use Agreements
              </button>
            </li>
          </ul>
        </div>

        {/* Contact Info Column */}
        <div className="space-y-4 text-xs font-sans">
          <h4 className="text-xs uppercase tracking-widest text-gray-800 font-bold font-sans">Headquarters</h4>
          <div className="space-y-3 text-gray-500">
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 text-indigo-600 shrink-0" />
              <span>Avenzo Plaza, Block E2, Gulberg III, Lahore, Pakistan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={15} className="text-indigo-600 shrink-0" />
              <a href="mailto:support@avenzo.pk" className="hover:text-indigo-600">support@avenzo.pk</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-indigo-600 shrink-0" />
              <a href="tel:+923001234567" className="hover:text-indigo-600">+92-300-1234567</a>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Footer Credits */}
      <div className="bg-gray-150 py-6 border-t border-gray-200 bg-gray-100 text-[10px] text-gray-500 font-sans tracking-wide">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="serif italic text-[11px] text-gray-800 font-semibold">Avenzo Official Store</span>
            <span>&copy; {new Date().getFullYear()} Avenzo Pakistan. All Rights Reserved.</span>
          </div>
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5 grayscale shrink-0">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Secure SSL Encryption Guaranteed
            </span>
            <span className="hidden sm:inline">Certified NTN: 8942071-3</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
export default Footer;
