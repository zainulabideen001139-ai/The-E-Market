import React from 'react';
import { ActivePage } from '../types';
import { ArrowRight, Sparkles, Building, Landmark } from 'lucide-react';

interface HeroProps {
  onCtas: (page: ActivePage) => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtas }) => {
  return (
    <section className="relative overflow-hidden bg-[#F8FAFC] border-b border-gray-200 py-16 sm:py-24">
      
      {/* Decorative Premium Background Gradients */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-indigo-600/5 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-[40%] h-56 bg-indigo-600/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Brand Proclamation & Story Hook */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2.5 animate-fade-in">
            <span className="h-[1px] w-12 bg-indigo-600"></span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-indigo-600 font-bold flex items-center gap-1.5 font-sans">
              <Sparkles size={11} /> Limited Imperial Launch
            </span>
          </div>

          <h1 className="serif text-5xl sm:text-6xl lg:text-7xl italic leading-[1.1] text-gray-900 tracking-wide animate-fade-in delay-75">
            The New<br />
            Standard of<br />
            <span className="text-indigo-600 font-bold not-italic tracking-[0.05em] font-sans uppercase text-3xl sm:text-4xl lg:text-5xl block mt-2">
              Prestige Lifestyle
            </span>
          </h1>

          <p className="text-gray-650 text-sm sm:text-base leading-relaxed max-w-xl pl-6 border-l-2 border-gray-300 font-sans animate-fade-in delay-150">
            Welcome to the digital gateway of Lahore’s most exclusive technology and design boutique. Discover 20 masterpiece hardware elements, climate control suites, and ergonomic lounge masterpieces. Tailored specifically for the sophisticated households of Pakistan.
          </p>

          <div className="flex flex-wrap gap-4 pt-6 animate-fade-in delay-200 font-sans">
            <button
              onClick={() => onCtas('shop')}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold uppercase tracking-[0.25em] transition-all transform hover:scale-[1.02] flex items-center gap-2 rounded-xl shadow-sm hover:shadow"
              id="hero-shop-cta"
            >
              Shop Curated Collection <ArrowRight size={13} />
            </button>
            <button
              onClick={() => onCtas('about')}
              className="px-8 py-4 border border-gray-200 hover:border-indigo-600 text-gray-700 text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-gray-50 bg-white transition-all rounded-xl shadow-sm hover:shadow-xs"
              id="hero-about-cta"
            >
              The Avenzo Chronicle
            </button>
          </div>

          {/* Aesthetic Metadata Pins */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-gray-200 text-[10px] uppercase tracking-widest text-gray-500 font-sans">
            <div>
              <span className="block text-gray-900 mb-1.5 font-bold flex items-center gap-1"><Landmark size={12} className="text-indigo-600" /> Flagship Lounge</span>
              Gulberg III, Lahore
            </div>
            <div>
              <span className="block text-gray-900 mb-1.5 font-bold flex items-center gap-1"><Building size={12} className="text-indigo-600" /> Logistics Hub</span>
              Karachi & Lahore
            </div>
            <div>
              <span className="block text-gray-900 mb-1.5 font-bold">Premium Est.</span>
              Anno MMXXIV
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Visual Lookbook */}
        <div className="lg:col-span-5 relative w-full h-full min-h-[350px] flex items-center justify-center">
          <div className="w-full relative group shadow-lg border border-gray-200 rounded-2xl overflow-hidden">
            {/* Main Picture */}
            <div className="aspect-[4/5] overflow-hidden bg-gray-100 rounded-2xl">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=700&auto=format&fit=crop"
                alt="Avenzo Luxury Tech Design"
                className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
              />
            </div>
            {/* Floating Info Tag representing the luxury theme */}
            <div className="absolute -bottom-6 -left-6 bg-white border border-gray-200 p-4 max-w-xs space-y-1.5 hidden sm:block shadow-md rounded-xl">
              <span className="text-[9px] uppercase tracking-widest text-indigo-600 font-bold block">Masterpiece Selection</span>
              <p className="text-gray-950 text-xs font-bold leading-snug">
                Zenith Business Laptop & Ares Pro Core Systems
              </p>
              <div className="flex justify-between items-center text-[10px] pt-1 text-gray-400 font-mono">
                <span>SKU: SECURED-X14</span>
                <span className="text-indigo-600 font-bold">100% Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
export default Hero;
