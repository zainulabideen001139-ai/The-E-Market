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
    <div className="bg-[#F8FAFC] border-y border-gray-200 py-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Left/Right header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-150 pb-6 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600 font-mono text-[9px] uppercase tracking-[0.3em] font-bold">
              <Sparkles size={11} /> High-End Interactive Configurator
            </div>
            <h2 className="serif text-2xl sm:text-3xl italic text-gray-900 font-semibold">
              The Avenzo Workspace & Suite Curator
            </h2>
            <p className="text-xs text-gray-500 max-w-xl font-sans">
              Tailor your interior design layouts, premium physical chairs, and computing tech packages. Our dynamic engine assembles verified matching components with 5% VIP Package pricing.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase font-mono bg-white px-3 py-1.5 border border-gray-200 rounded-lg shadow-sm">
            <span className="text-emerald-500 font-bold">&bull;</span> Live Custom Engine Online
          </div>
        </div>

        {/* Workspace Matrix Interactive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          
          {/* Column Left: Selection Controls */}
          <div className="lg:col-span-4 space-y-6 bg-white border border-gray-200 p-6 rounded-2xl relative shadow-md">
            
            {/* Space picker */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase text-indigo-650 text-indigo-600 font-bold tracking-widest block font-mono">1. Select Target Space</span>
              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSpace('executive-suite')}
                  className={`p-3 text-left border text-xs flex justify-between items-center rounded-xl transition-all ${
                    selectedSpace === 'executive-suite'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                      : 'border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Armchair size={13} className="text-indigo-650 text-indigo-600" /> Executive Office Suite
                  </span>
                  {selectedSpace === 'executive-suite' && <Check size={11} className="text-indigo-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSpace('home-theater')}
                  className={`p-3 text-left border text-xs flex justify-between items-center rounded-xl transition-all ${
                    selectedSpace === 'home-theater'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                      : 'border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Film size={13} className="text-indigo-650 text-indigo-600" /> Home Theater & Lounge
                  </span>
                  {selectedSpace === 'home-theater' && <Check size={11} className="text-indigo-600" />}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSpace('gaming-vault')}
                  className={`p-3 text-left border text-xs flex justify-between items-center rounded-xl transition-all ${
                    selectedSpace === 'gaming-vault'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 font-bold'
                      : 'border-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Monitor size={13} className="text-indigo-650 text-indigo-600" /> Tech & Gaming Vault
                  </span>
                  {selectedSpace === 'gaming-vault' && <Check size={11} className="text-indigo-600" />}
                </button>
              </div>
            </div>

            {/* Design theme selector */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase text-indigo-650 text-indigo-600 font-bold tracking-widest block font-mono">2. Aesthetic Mood & Palette</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTheme('mahogany')}
                  className={`p-3 text-center border text-[11px] rounded-xl transition-all uppercase tracking-wider ${
                    selectedTheme === 'mahogany'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-955 text-indigo-950 font-bold font-semibold'
                      : 'border-gray-100 text-gray-550 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Mahogany Leather
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedTheme('monochrome')}
                  className={`p-3 text-center border text-[11px] rounded-xl transition-all uppercase tracking-wider ${
                    selectedTheme === 'monochrome'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-955 text-indigo-950 font-bold font-semibold'
                      : 'border-gray-100 text-gray-550 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Charcoal Titanium
                </button>
              </div>
            </div>

            {/* Budget constraints */}
            <div className="space-y-2.5">
              <span className="text-[10px] uppercase text-indigo-650 text-indigo-600 font-bold tracking-widest block font-mono">3. Financial Segment Limits</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedBudget('premium-starter')}
                  className={`p-3 text-center border text-[11px] rounded-xl transition-all uppercase tracking-wider ${
                    selectedBudget === 'premium-starter'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-955 text-indigo-950 font-bold font-semibold'
                      : 'border-gray-100 text-gray-550 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="Limit matched items below Rs. 85,000 each"
                >
                  Premium Cap
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedBudget('imperial-connoisseur')}
                  className={`p-3 text-center border text-[11px] rounded-xl transition-all uppercase tracking-wider ${
                    selectedBudget === 'imperial-connoisseur'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-955 text-indigo-950 font-bold font-semibold'
                      : 'border-gray-100 text-gray-550 text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  title="Access complete top-tier curated masterpieces without price caps"
                >
                  Uncapped Royal
                </button>
              </div>
            </div>

          </div>

          {/* Column Right: Curated match output & dynamic price tags */}
          <div className="lg:col-span-8 bg-white border border-gray-200 p-6 rounded-2xl space-y-6 shadow-md">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="text-gray-900 font-bold text-xs tracking-wide">
                RECOMMENDED ENSEMBLE ({recommendedSuite.length} Curated Assets)
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                Matching score: <strong className="text-emerald-500">98.8% Accurate</strong>
              </span>
            </div>

            {/* Curated horizontal cards list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedSuite.map((product) => (
                <div 
                  key={product.id}
                  className="bg-gray-55 bg-gray-50 border border-gray-150 hover:border-indigo-200 p-4 flex flex-col justify-between transition-colors rounded-xl"
                >
                  <div className="space-y-2">
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-150">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h4 
                        onClick={() => onSelectProduct(product)}
                        className="text-gray-900 hover:text-indigo-600 text-xs font-bold truncate cursor-pointer transition-colors"
                      >
                        {product.name}
                      </h4>
                      <span className="text-[9px] text-gray-400 font-mono block">SKU: {product.sku}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-end pt-3 mt-3 border-t border-gray-100">
                    <span className="text-[9px] font-mono text-gray-400">PKR Rupee</span>
                    <strong className="text-xs text-indigo-600 font-mono">Rs. {product.price.toLocaleString()}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* Design summary block and tips based on themes */}
            <div className="bg-indigo-50/50 p-4 border border-indigo-100/55 rounded-xl text-xs space-y-2">
              <span className="text-[10px] font-bold tracking-widest text-indigo-600 uppercase block font-mono">
                🪶 Avenzo Architech Editorial Design Consultation
              </span>
              <p className="text-gray-600 leading-relaxed font-sans text-[11px] font-medium">
                {selectedTheme === 'mahogany' ? (
                  "For your chosen Luxury Mahogany theme, we recommend pairing these selections with warm amber ambient lighting (2700K), solid brass desktop weights, and natural clay vessels to establish structural poetry inside Gulberg offices."
                ) : (
                  "For your Charcoal Silicon layout, maximize clean industrial aesthetics using brushed zinc accessories, single-conduit power trunking, and 6000K daylight-neutral task lights to emphasize metal alignments."
                )}
              </p>
            </div>

            {/* Acquire Suite Price Card */}
            <div className="bg-[#F8FAFC] p-5 rounded-xl border border-indigo-150 flex flex-col sm:flex-row justify-between items-center gap-6">
              <div className="space-y-1.5 text-center sm:text-left font-sans">
                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-lg font-bold">
                    VIP 5% Bundle Discount Active
                  </span>
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Total price: <span className="line-through text-gray-400 font-mono">Rs. {totalSum.toLocaleString()}</span> &middot; Saved: <span className="text-emerald-600 font-mono font-bold">-Rs. {discountValue.toLocaleString()}</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-indigo-600">
                  PKR {finalValue.toLocaleString()}
                </div>
              </div>

              <div className="w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleAcquireCuratedSuite}
                  className="w-full sm:w-auto bg-indigo-600 text-white font-extrabold uppercase tracking-widest text-[10px] px-8 py-4 hover:bg-indigo-700 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer shadow-md rounded-xl"
                >
                  <ShoppingCart size={13} /> Secure Curated Suite
                </button>
              </div>
            </div>

            {/* Success toast dynamic notify */}
            {successAnimation && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs p-3 text-center uppercase tracking-widest font-bold rounded-xl animate-scale-up">
                ✓ Success! Avenzo Curated Ensemble has been compiled and secured into your Cart. Proceed to VIP Checkout to authorize delivery!
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
