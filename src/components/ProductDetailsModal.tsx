import React, { useState } from 'react';
import { Product, CartItem } from '../types';
import { Star, Heart, ShoppingBag, X, ShieldCheck, Mail, AlertTriangle, Check } from 'lucide-react';

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (p: Product, qty: number) => void;
  onAddToWishlist: (p: Product) => void;
  isWishlisted: boolean;
  onAddReview: (productId: string, name: string, rating: number, comment: string) => Promise<void>;
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  onAddReview
}) => {
  const [qty, setQty] = useState(1);
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [addedToCartToast, setAddedToCartToast] = useState(false);

  const isOutOfStock = product.stock <= 0;
  
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName || !revComment) {
      alert('Please fill out both your name and review details.');
      return;
    }
    setIsSubmittingReview(true);
    try {
      await onAddReview(product.id, revName, revRating, revComment);
      setRevName('');
      setRevComment('');
      setRevRating(5);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Friction submitting review. Please retry.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddToCartClick = () => {
    if (qty <= 0 || isOutOfStock) return;
    onAddToCart(product, qty);
    setAddedToCartToast(true);
    setTimeout(() => setAddedToCartToast(false), 300);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative bg-white border border-gray-200 w-full max-w-5xl rounded-2xl shadow-xl overflow-hidden animate-fade-in max-h-[90vh]">
        
        {/* Close Button & Title Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-150 bg-[#F8FAFC]">
          <span className="text-[10px] uppercase font-mono tracking-widest text-indigo-600 font-bold">PRODUIT DETAILS &bull; ORIGINAL BRAND CERTIFIED</span>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-indigo-600 p-1.5 bg-white border border-gray-200 hover:border-indigo-550 transition-all rounded-lg hover:bg-gray-50 shadow-sm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Layout Context */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* 1. Left Side: Image display */}
          <div className="md:col-span-5 space-y-4">
            <div className="aspect-square bg-[#F8FAFC] overflow-hidden border border-gray-200 rounded-xl">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Quick Guarantees Grid */}
            <div className="bg-indigo-50 border border-indigo-100 p-4 space-y-2 text-xs rounded-xl">
              <div className="flex items-center gap-2 text-indigo-950 font-bold">
                <Check size={14} className="text-indigo-600" />
                <span>Lahore Lounge Instant Collection</span>
              </div>
              <p className="text-[11px] text-indigo-700/80 pl-5 leading-normal">
                Visit our physical design storefront within Gulberg III layout to touch and experience this hardware assembly live.
              </p>
            </div>
          </div>

          {/* 2. Right Side: Product Details & Controls */}
          <div className="md:col-span-7 space-y-6">
            <div>
              <div className="flex items-center justify-between text-gray-400 text-xs">
                <span className="uppercase tracking-widest text-indigo-600 font-bold">{product.category.replace('-', ' ')}</span>
                <span className="font-mono">{product.sku}</span>
              </div>
              
              <h1 className="serif italic text-2xl sm:text-3xl text-gray-900 mt-1 leading-tight font-bold">
                {product.name}
              </h1>

              {/* Aggregated ratings review banner */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-0.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={13}
                      className={i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-500' : 'text-gray-200'}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700 font-mono">{product.rating} / 5</span>
                <span className="text-gray-300">&bull;</span>
                <span className="text-xs text-gray-500 hover:underline cursor-pointer">{product.reviewsCount} verified clients feedback</span>
              </div>
            </div>

            {/* Exclusive Price Presentation in PKR */}
            <div className="bg-[#F8FAFC] border border-gray-200 p-4 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase text-gray-400 tracking-widest block font-bold">PKR Retail Value</span>
                <span className="text-indigo-600 text-2xl font-bold font-mono">
                  Rs. {product.price.toLocaleString()}
                </span>
                <span className="text-[9px] text-gray-500 block mt-0.5">Inclusive of standard custom taxes.</span>
              </div>

              <div>
                {isOutOfStock ? (
                  <span className="bg-red-50 text-red-650 border border-red-200 text-xs font-bold tracking-wider px-3 py-1.5 uppercase rounded-lg">
                    Out of Stock Reserves
                  </span>
                ) : (
                  <span className="bg-emerald-55 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold tracking-wider px-3 py-1.5 uppercase rounded-lg">
                    {product.stock} units secured
                  </span>
                )}
              </div>
            </div>

            {/* In-depth descriptions */}
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-widest text-gray-800 font-bold font-sans">Curators Narrative</h3>
              <p className="text-xs leading-relaxed text-gray-650 font-sans">
                {product.description}
              </p>
            </div>

            {/* Specifications Matrix Grid */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <h3 className="text-xs uppercase tracking-widest text-gray-800 font-bold font-sans">Specifications Matrix</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {product.specifications.map((spec, index) => (
                    <div key={index} className="flex bg-gray-50 border border-gray-150 px-3 py-2 rounded-lg gap-2">
                      <span className="text-gray-500 whitespace-nowrap font-medium">{spec.key}:</span>
                      <span className="text-gray-800 font-mono truncate">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions Layer */}
            {!isOutOfStock && (
              <div className="flex flex-wrap items-end gap-4 pt-4 border-t border-gray-100">
                
                {/* Quantity adjustments */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-gray-400 tracking-widest block font-bold">Quantity</span>
                  <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="px-3 py-2 text-gray-500 hover:text-gray-950 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 text-sm font-semibold font-mono text-gray-800">{qty}</span>
                    <button
                      onClick={() => setQty(Math.min(product.stock, qty + 1))}
                      className="px-3 py-2 text-gray-500 hover:text-gray-950 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Primary Cart push button */}
                <button
                  onClick={handleAddToCartClick}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-[0.2em] py-3.5 px-6 rounded-xl transition-all transform flex items-center justify-center gap-2 shadow-sm hover:shadow"
                >
                  <ShoppingBag size={14} /> 
                  {addedToCartToast ? 'Added Perfectly!' : 'Acquire & Secure into Cart'}
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => onAddToWishlist(product)}
                  className={`p-3.5 border transition-all rounded-xl ${
                    isWishlisted 
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-650 text-indigo-700' 
                      : 'border-gray-200 hover:border-indigo-600 text-gray-550 text-gray-500 hover:text-indigo-600'
                  }`}
                  title={isWishlisted ? "Remove from wishlist" : "Secure into wishlist"}
                >
                  <Heart size={15} fill={isWishlisted ? "currentColor" : "none"} />
                </button>

              </div>
            )}

            {/* Client feedback / Reviews Module */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h3 className="text-xs uppercase tracking-widest text-gray-850 text-gray-800 font-bold font-sans">
                Review Chronicle ({product.reviewsCount})
              </h3>

              {/* Show reviews lists */}
              <div className="space-y-3 max-h-40 overflow-y-auto pr-2">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((rev) => (
                    <div key={rev.id} className="bg-gray-50 border border-gray-150 p-3.5 rounded-xl space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-900 font-bold">{rev.name}</span>
                        <span className="text-gray-400 font-mono text-[10px]">{rev.date}</span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={i < rev.rating ? 'fill-amber-400 text-amber-500' : 'text-gray-200'}
                          />
                        ))}
                      </div>
                      <p className="text-[11px] leading-relaxed text-gray-500 font-sans font-medium">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic">No historical customer feedback logs found yet. Be the first to append audit.</p>
                )}
              </div>

              {/* Append new Client audit feedback */}
              <form onSubmit={handleReviewSubmit} className="bg-gray-50 border border-gray-150 p-4 space-y-3 rounded-xl">
                <h4 className="text-[11px] uppercase tracking-wider text-gray-900 font-bold">Write Luxury Client Audit</h4>
                
                {reviewSuccess && (
                  <div className="bg-emerald-50 border border-emerald-100 p-2 text-xs text-emerald-700 rounded-lg">
                    ✓ Feedback submitted successfully! Experience rating has updated in real-time.
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase text-gray-500 tracking-wider block mb-1">Your Name</label>
                    <input
                      type="text"
                      className="bg-white border border-gray-200 text-xs px-3 py-2 w-full text-gray-800 focus:outline-none focus:border-indigo-600 rounded-lg"
                      placeholder="e.g., Haroon Raza"
                      value={revName}
                      onChange={(e) => setRevName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase text-gray-500 tracking-wider block mb-1">Authentic Experience Rating</label>
                    <select
                      className="bg-white border border-gray-200 text-xs px-3 py-2 w-full text-gray-800 focus:outline-none focus:border-indigo-600 rounded-lg"
                      value={revRating}
                      onChange={(e) => setRevRating(Number(e.target.value))}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellence)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5 Superior)</option>
                      <option value={3}>⭐⭐⭐ (3/5 Standard)</option>
                      <option value={2}>⭐⭐ (2/5 Subpar)</option>
                      <option value={1}>⭐ (1/5 Unsatisfactory)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase text-gray-500 tracking-wider block mb-1">Audit Details</label>
                  <textarea
                    rows={2}
                    className="bg-white border border-gray-200 text-xs px-3 py-2 w-full text-gray-800 focus:outline-none focus:border-indigo-600 resize-none rounded-lg"
                    placeholder="Share your experience regarding Avenzo material design standards..."
                    value={revComment}
                    onChange={(e) => setRevComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-white border border-gray-200 text-[10px] text-gray-700 uppercase tracking-widest font-bold py-2 px-4 hover:border-indigo-600 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer disabled:opacity-50 rounded-lg shadow-sm"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Proclaim Client Audit feedback'}
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
export default ProductDetailsModal;
