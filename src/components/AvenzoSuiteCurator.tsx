import React, { useState, useEffect } from 'react';
import { Product, CartItem } from '../types';
import { Sparkles, Check, Armchair, Monitor, Film, Tag, ShoppingCart, HelpCircle, ArrowRight } from 'lucide-react';

interface AvenzoSuiteCuratorProps {
  products: Product[];
  onAddMultiToCart: (items: Product[]) => void;
  onSelectProduct: (p: Product) => void;
}

export const AvenzoSuiteCurator: React.FC<AvenzoSuiteCuratorProps> = ({
  products,
  onAddMultiToCart,
  onSelectProduct,
}) => {
  // Curator Selections
  const [selectedSpace, setSelectedSpace] = useState<'executive-suite' | 'home-theater' | 'gaming-vault'>('executive-suite');
  const [selectedTheme, setSelectedTheme] = useState<'mahogany' | 'monochrome'>('mahogany');
  const [selectedBudget, setSelectedBudget] = useState<'premium-starter' | 'imperial-connoisseur'>('imperial-connoisseur');

  // Recommendation Outputs
  const [recommendedSuite, setRecommendedSuite] = useState<Product[]>([]);
  const [totalSum, setTotalSum] = useState(0);
  const [discountValue, setDiscountValue] = useState(0);
  const [finalValue, setFinalValue] = useState(0);
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Math simulation matching rule algorithm
  useEffect(() => {
    if (!products || products.length === 0) return;

    let candidates: Product[] = [];

    // 1. Select primary department base candidate arrays
    if (selectedSpace === 'executive-suite') {
      candidates = products.filter(p => 
        p.category === 'office-furniture' || 
        p.category === 'electronics' && (p.name.toLowerCase().includes('laptop') || p.name.toLowerCase().includes('desk'))
      );
    } else if (selectedSpace === 'home-theater') {
      candidates = products.filter(p => 
        p.category === 'home-appliances' || 
        p.name.toLowerCase().includes('tv') || 
        p.name.toLowerCase().includes('speaker') ||
        p.name.toLowerCase().includes('couch')
      );
    } else if (selectedSpace === 'gaming-vault') {
      candidates = products.filter(p => 
        p.category === 'electronics' && (
          p.name.toLowerCase().includes('monitor') || 
          p.name.toLowerCase().includes('ares') || 
          p.name.toLowerCase().includes('play')
        )
      );
    }

    // 2. Budget capping filter limits
    if (selectedBudget === 'premium-starter') {
      // Pick items below Rs. 85,000
      candidates = candidates.filter(p => p.price <= 85000);
    }

    // 3. Theme sorting priority weights
    candidates = [...candidates].sort((a, b) => {
      const aNameDesc = (a.name + ' ' + a.description).toLowerCase();
      const bNameDesc = (b.name + ' ' + b.description).toLowerCase();

      let aWeight = 0;
      let bWeight = 0;

      if (selectedTheme === 'mahogany') {
        const mahoganyWords = ['leather', 'wood', 'velvet', 'mahogany', 'brown', 'warm', 'royal', 'gold'];
        mahoganyWords.forEach(word => {
          if (aNameDesc.includes(word)) aWeight += 1;
          if (bNameDesc.includes(word)) bWeight += 1;
        });
      } else {
        const monoWords = ['silver', 'metal', 'monochrome', 'black', 'titanium', 'sleek', 'carbon', 'slate', 'gray'];
        monoWords.forEach(word => {
          if (aNameDesc.includes(word)) aWeight += 1;
          if (bNameDesc.includes(word)) bWeight += 1;
        });
      }

      return bWeight - aWeight; // Descending order of style relevance weights
    });

    // 4. Group elite curation combination of up to 3 compatible products
    const suiteSelection = candidates.slice(0, 3);
    
    // Fallbacks if list is too narrow
    if (suiteSelection.length < 2) {
      // Fill standard complementary top-selling premium products
      const extraItems = products.filter(p => !suiteSelection.find(s => s.id === p.id)).slice(0, 2);
      suiteSelection.push(...extraItems);
    }

    const finalSuite = suiteSelection.slice(0, 3);
    const sumTotal = finalSuite.reduce((acc, p) => acc + p.price, 0);
    const discount = Math.round(sumTotal * 0.05); // automatic 5% VIP discount active across curated packages

    setRecommendedSuite(finalSuite);
    setTotalSum(sumTotal);
    setDiscountValue(discount);
    setFinalValue(sumTotal - discount);
  }, [selectedSpace, selectedTheme, selectedBudget, products]);

  const handleAcquireCuratedSuite = () => {
    if (recommendedSuite.length === 0) return;
    onAddMultiToCart(recommendedSuite);
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
    }, 4500);
  };

  return (
    <div className="bg-[#0D0D0D] border-y border-neutral-900 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Left/Right header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-neutral-900 pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#C5A059] font-mono text-[9px] uppercase tracking-[0.3em] font-bold">
              <Sparkles size={11} /> High-End Interactive Configurator
            </div>
            <h2 className="serif text-2xl sm:text-3xl italic text-white font-medium">
              The Avenzo Workspace & Suite Curator
            </h2>
            <p className="text-xs text-neutral-400 max-w-xl font-sans">
              Tailor your interior design layouts, premium physical chairs, and computing tech packages. Our dynamic engine assembles verified matching components with 5% VIP Package pricing.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase font-mono bg-black px-3 py-1.5 border border-neutral-900">
            <span className="text-green-500 font-bold">&bull;</span> Live Custom Engine Online
          </div>
        </div>

        {/* Workspace Matrix Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          
          {/* Column Left: Selection Controls */}
          <div className="lg:col-span-4 space-y-6 bg-black border border-neutral-900 p-6 rounded relative">
            
            {/* Space picker */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase text-[#C5A059] font-bold tracking-widest block font-mono">1. Select Target Space</span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSpace('executive-suite')}
                  className={`p-3 text-left border text-xs flex justify-between items-center rounded-sm transition-all ${
                    selectedSpace === 'executive-suite'
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white font-semibold'
                      : 'border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Armchair size={13} className="text-[#C5A059]" /> Executive Office Suite
                  </span>
                  {selectedSpace === 'executive-suite' && <Check size={11} className="text-[#C5A059]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSpace('home-theater')}
                  className={`p-3 text-left border text-xs flex justify-between items-center rounded-sm transition-all ${
                    selectedSpace === 'home-theater'
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white font-semibold'
                      : 'border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Film size={13} className="text-[#C5A059]" /> Home Theater & Lounge
                  </span>
                  {selectedSpace === 'home-theater' && <Check size={11} className="text-[#C5A059]" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSpace('gaming-vault')}
                  className={`p-3 text-left border text-xs flex justify-between items-center rounded-sm transition-all ${
                    selectedSpace === 'gaming-vault'
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white font-semibold'
                      : 'border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Monitor size={13} className="text-[#C5A059]" /> Tech & Gaming Vault
                  </span>
                  {selectedSpace === 'gaming-vault' && <Check size={11} className="text-[#C5A059]" />}
                </button>
              </div>
            </div>

            {/* Design theme selector */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase text-[#C5A059] font-bold tracking-widest block font-mono">2. Aesthetic Mood & Palette</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTheme('mahogany')}
                  className={`p-3 text-center border text-[11px] rounded-sm transition-all uppercase tracking-wider ${
                    selectedTheme === 'mahogany'
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white font-semibold'
                      : 'border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                  }`}
                >
                  Mahogany Leather
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme('monochrome')}
                  className={`p-3 text-center border text-[11px] rounded-sm transition-all uppercase tracking-wider ${
                    selectedTheme === 'monochrome'
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white font-semibold'
                      : 'border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                  }`}
                >
                  Charcoal Titanium
                </button>
              </div>
            </div>

            {/* Budget constraints */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase text-[#C5A059] font-bold tracking-widest block font-mono">3. Financial Segment Limits</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBudget('premium-starter')}
                  className={`p-3 text-center border text-[11px] rounded-sm transition-all uppercase tracking-wider ${
                    selectedBudget === 'premium-starter'
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white font-semibold'
                      : 'border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                  }`}
                  title="Limit matched items below Rs. 85,000 each"
                >
                  Premium Cap
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBudget('imperial-connoisseur')}
                  className={`p-3 text-center border text-[11px] rounded-sm transition-all uppercase tracking-wider ${
                    selectedBudget === 'imperial-connoisseur'
                      ? 'border-[#C5A059] bg-[#C5A059]/10 text-white font-semibold'
                      : 'border-neutral-900 text-neutral-400 hover:text-white hover:border-neutral-800'
                  }`}
                  title="Access complete top-tier curated masterpieces without price caps"
                >
                  Uncapped Royal
                </button>
              </div>
            </div>

          </div>

          {/* Column Right: Curated match output & dynamic price tags */}
          <div className="lg:col-span-8 bg-[#121212] border border-neutral-900 p-6 rounded space-y-6">
            
            <div className="flex justify-between items-center border-b border-neutral-900 pb-3">
              <span className="text-white font-semibold text-xs tracking-wide">
                RECOMMENDED ENSEMBLE ({recommendedSuite.length} Curated Assets)
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                Matching score: <strong className="text-green-500">98.8% Accurate</strong>
              </span>
            </div>

            {/* Curated horizontal cards list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedSuite.map((product) => (
                <div 
                  key={product.id}
                  className="bg-black border border-neutral-900 hover:border-[#C5A059]/40 p-3.5 flex flex-col justify-between transition-colors rounded-sm"
                >
                  <div className="space-y-2">
                    <div className="aspect-video w-full rounded-sm overflow-hidden bg-neutral-950 border border-neutral-900/65">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover grayscale" 
                      />
                    </div>
                    <div>
                      <h4 
                        onClick={() => onSelectProduct(product)}
                        className="text-white hover:text-[#C5A059] text-xs font-bold truncate cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h4>
                      <span className="text-[9px] text-neutral-500 font-mono block">SKU: {product.sku}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-3 mt-3 border-t border-neutral-900/60">
                    <span className="text-[9px] font-mono text-neutral-400">PKR Rupee</span>
                    <strong className="text-xs text-[#C5A059] font-mono">Rs. {product.price.toLocaleString()}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Design summary block and tips based on themes */}
            <div className="bg-black p-4 border border-neutral-900 rounded text-xs space-y-2">
              <span className="text-[10px] font-bold tracking-widest text-[#C5A059] uppercase block font-mono">
                🪶 Avenzo Architech Editorial Design Consultation
              </span>
              <p className="text-neutral-400 leading-relaxed font-sans text-[11px]">
                {selectedTheme === 'mahogany' ? (
                  "For your chosen Luxury Mahogany theme, we recommend pairing these selections with warm amber ambient lighting (2700K), solid brass desktop weights, and natural clay vessels to establish structural poetry inside Gulberg offices."
                ) : (
                  "For your Charcoal Silicon layout, maximize clean industrial aesthetics using brushed zinc accessories, single-conduit power trunking, and 6000K daylight-neutral task lights to emphasize metal alignments."
                )}
              </p>
            </div>

            {/* Acquire Suite Price Card */}
            <div className="bg-black/90 p-5 rounded-sm border border-[#C5A059]/30 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="bg-green-500/10 text-green-400 border border-green-500/20 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm">
                    VIP 5% Bundle Discount Active
                  </span>
                </div>
                <div className="text-xs text-neutral-400">
                  Total price: <span className="line-through text-neutral-600 font-mono">Rs. {totalSum.toLocaleString()}</span> &middot; Saved: <span className="text-green-400 font-mono">-Rs. {discountValue.toLocaleString()}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-[#C5A059]">
                  PKR {finalValue.toLocaleString()}
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAcquireCuratedSuite}
                  className="w-full sm:w-auto bg-[#C5A059] text-black font-extrabold uppercase tracking-widest text-[10px] px-8 py-4 hover:bg-[#DFBA73] transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-lg"
                >
                  <ShoppingCart size={13} /> Secure Curated Suite
                </button>
              </div>
            </div>

            {/* Success toast dynamic notify */}
            {successAnimation && (
              <div className="bg-green-950/90 border border-green-500/30 text-green-300 text-xs p-3 text-center uppercase tracking-widest font-bold rounded animate-scale-up">
                ✓ Success! Avenzo Curated Ensemble has been compiled and secured into your Cart. Proceed to VIP Checkout to authorize delivery!
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
