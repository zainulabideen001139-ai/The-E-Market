import React from 'react';
import { Product } from '../types';
import { Star, Heart, Eye, ArrowRight, Zap } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
  onAddToWishlist: (p: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToWishlist,
  isWishlisted,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="bg-[#141414] border border-neutral-900 group relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-[#C5A059]/40 animate-fade-in">
      
      {/* Top Banner Tags & Wishlist Toggle */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex flex-col gap-1.5">
          {product.isFeatured && (
            <span className="bg-[#C5A059] text-black text-[9px] font-bold tracking-widest px-2.5 py-0.5 uppercase rounded-sm">
              Featured Edition
            </span>
          )}
          {isOutOfStock ? (
            <span className="bg-red-600/90 text-white text-[9px] font-bold tracking-widest px-2.5 py-0.5 uppercase rounded-sm">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-600/90 text-white text-[9px] font-semibold tracking-widest px-2.5 py-0.5 uppercase rounded-sm flex items-center gap-1">
              <Zap size={10} /> Limited: {product.stock} left
            </span>
          ) : null}
        </div>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToWishlist(product);
          }}
          className={`p-2 rounded-full border transition-all ${
            isWishlisted 
              ? 'bg-[#C5A059] border-[#C5A059] text-black' 
              : 'bg-black/75 border-neutral-800 text-neutral-400 hover:text-white hover:border-[#C5A059]'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={13} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Main Image Stage */}
      <div 
        onClick={() => onSelect(product)}
        className="relative aspect-video sm:aspect-square w-full bg-neutral-950 overflow-hidden cursor-pointer"
        id={`product-card-${product.id}`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-90"
          loading="lazy"
        />
        {/* Hover overlay with CTA */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(product); }}
            className="flex items-center gap-2 bg-white text-black font-semibold text-xs py-2 px-5 rounded-sm hover:bg-[#C5A059] hover:text-black transition-all transform translate-y-4 group-hover:translate-y-0 duration-300"
          >
            <Eye size={13} /> View Details
          </button>
        </div>
      </div>

      {/* Bottom Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-black">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono tracking-wider">
            <span>SKU: {product.sku}</span>
            <div className="flex items-center gap-1">
              <Star size={11} className="fill-[#C5A059] text-[#C5A059]" />
              <span className="text-neutral-300">{product.rating}</span>
            </div>
          </div>
          
          <h3 
            onClick={() => onSelect(product)}
            className="text-white hover:text-[#C5A059] text-sm sm:text-base font-semibold tracking-wide truncate cursor-pointer transition-colors"
          >
            {product.name}
          </h3>
          
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Pricing tag & immediate detail redirect */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-neutral-900">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-widest text-[#C5A059] font-medium">PKR Price</span>
            <span className="text-[#C5A059] text-base font-bold font-mono">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={() => onSelect(product)}
            className="text-[10px] font-semibold text-neutral-400 group-hover:text-[#C5A059] transition-colors flex items-center gap-0.5 tracking-widest uppercase border-b border-transparent group-hover:border-[#C5A059] pb-0.5"
          >
            Invest <ArrowRight size={12} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
};
export default ProductCard;
