import React from 'react';
import { ActivePage } from '../types';
import { ArrowRight, Sparkles, Building, Landmark } from 'lucide-react';

interface HeroProps {
  onCtas: (page: ActivePage) => void;
}

export const Hero: React.FC<HeroProps> = ({ onCtas }) => {
  return (
    <section className="relative overflow-hidden bg-black border-b border-neutral-900 py-16 sm:py-24">
      
      {/* Decorative Premium Background Gradients */}
      <div className="absolute top-0 right-0 w-[55%] h-full bg-gradient-to-bl from-[#C5A059]/10 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-[40%] h-56 bg-[#C5A059]/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Brand Proclamation & Story Hook */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2.5 animate-fade-in">
            <span className="h-[1px] w-12 bg-[#C5A059]"></span>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.4em] text-[#C5A059] font-semibold flex items-center gap-1.5">
              <Sparkles size={11} /> Limited Imperial Launch
            </span>
          </div>

          <h1 className="serif text-5xl sm:text-6xl lg:text-7xl italic leading-[1.1] text-white tracking-wide animate-fade-in delay-75">
            The New<br />
            Standard of<br />
            <span className="text-[#C5A059] font-normal not-italic tracking-[0.1em] font-sans uppercase text-3xl sm:text-4xl lg:text-5xl block mt-2">
              Prestige Lifestyle
            </span>
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base leading-relaxed max-w-xl pl-6 border-l-2 border-neutral-800 font-sans animate-fade-in delay-150">
            Welcome to the digital gateway of Lahore’s most exclusive technology and design boutique. Discover 20 masterpiece hardware elements, climate control suites, and ergonomic lounge masterpieces. Tailored specifically for the sophisticated households of Pakistan.
          </p>

          <div className="flex flex-wrap gap-4 pt-6 animate-fade-in delay-200">
            <button
              onClick={() => onCtas('shop')}
              className="px-8 py-4 bg-[#C5A059] hover:bg-[#DFBA73] text-black text-[11px] font-bold uppercase tracking-[0.25em] transition-all transform hover:scale-[1.02] flex items-center gap-2"
              id="hero-shop-cta"
            >
              Shop Curated Collection <ArrowRight size={13} />
            </button>
            <button
              onClick={() => onCtas('about')}
              className="px-8 py-4 border border-neutral-800 hover:border-[#C5A059] text-white text-[11px] font-bold uppercase tracking-[0.25em] hover:bg-neutral-900 transition-all"
              id="hero-about-cta"
            >
              The Avenzo Chronicle
            </button>
          </div>

          {/* Aesthetic Metadata Pins */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-10 border-t border-neutral-900 text-[10px] uppercase tracking-widest text-neutral-500 font-sans">
            <div>
              <span className="block text-white mb-1.5 font-semibold flex items-center gap-1"><Landmark size={12} className="text-[#C5A059]" /> Flagship Lounge</span>
              Gulberg III, Lahore
            </div>
            <div>
              <span className="block text-white mb-1.5 font-semibold flex items-center gap-1"><Building size={12} className="text-[#C5A059]" /> Logistics Hub</span>
              Karachi & Lahore
            </div>
            <div>
              <span className="block text-white mb-1.5 font-semibold">Premium Est.</span>
              Anno MMXXIV
            </div>
          </div>

        </div>

        {/* Right Side: Interactive Visual Lookbook */}
        <div className="lg:col-span-5 relative w-full h-full min-h-[350px] flex items-center justify-center">
          <div className="w-full relative group shadow-2xl border border-neutral-900">
            {/* Main Picture */}
            <div className="aspect-[4/5] overflow-hidden bg-neutral-900 rounded-sm">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=700&auto=format&fit=crop"
                alt="Avenzo Luxury Tech Design"
                className="w-full h-full object-cover grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
              />
            </div>
            {/* Floating Info Tag representing the luxury theme */}
            <div className="absolute -bottom-6 -left-6 bg-[#141414] border border-neutral-800 p-4 max-w-xs space-y-1.5 hidden sm:block shadow-xl">
              <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-semibold block">Masterpiece Selection</span>
              <p className="text-white text-xs font-semibold leading-snug">
                Zenith Business Laptop & Ares Pro Core Systems
              </p>
              <div className="flex justify-between items-center text-[10px] pt-1 text-neutral-500 font-mono">
                <span>SKU: SECURED-X14</span>
                <span className="text-[#C5A059] font-bold">100% Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </section>
  );
};
export default Hero;
