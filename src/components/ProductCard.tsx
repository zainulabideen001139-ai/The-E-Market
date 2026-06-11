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
    <div className="bg-white border border-gray-200 group relative flex flex-col justify-between overflow-hidden transition-all duration-300 hover:border-indigo-200 rounded-2xl shadow-sm hover:shadow animate-fade-in">
      
      {/* Top Banner Tags & Wishlist Toggle */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
        <div className="flex flex-col gap-1.5 font-sans">
          {product.isFeatured && (
            <span className="bg-indigo-600 text-white text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-lg">
              Featured Edition
            </span>
          )}
          {isOutOfStock ? (
            <span className="bg-red-50 text-red-600 border border-red-200 text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-lg">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="bg-amber-50 text-amber-700 border border-amber-200 text-[9px] font-semibold tracking-widest px-2.5 py-1 uppercase rounded-lg flex items-center gap-1">
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
              ? 'bg-indigo-600 border-indigo-650 text-white' 
              : 'bg-white/95 border-gray-200 text-gray-400 hover:text-indigo-600 hover:border-indigo-600 shadow-sm'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          <Heart size={13} fill={isWishlisted ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Main Image Stage */}
      <div 
        onClick={() => onSelect(product)}
        className="relative aspect-video sm:aspect-square w-full bg-gray-50 overflow-hidden cursor-pointer"
        id={`product-card-${product.id}`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Hover overlay with CTA */}
        <div className="absolute inset-0 bg-gray-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onSelect(product); }}
            className="flex items-center gap-2 bg-indigo-600 text-white font-bold text-xs py-2.5 px-6 rounded-xl hover:bg-indigo-700 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 shadow-md"
          >
            <Eye size={13} /> View Details
          </button>
        </div>
      </div>

      {/* Bottom Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono tracking-wider">
            <span>SKU: {product.sku}</span>
            <div className="flex items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-gray-600">{product.rating}</span>
            </div>
          </div>
          
          <h3 
            onClick={() => onSelect(product)}
            className="text-gray-950 hover:text-indigo-600 text-sm sm:text-base font-bold tracking-wide truncate cursor-pointer transition-colors"
          >
            {product.name}
          </h3>
          
          <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-sans">
            {product.description}
          </p>
        </div>

        {/* Pricing tag & immediate detail redirect */}
        <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100">
          <div className="flex flex-col font-sans">
            <span className="text-[9px] uppercase tracking-widest text-indigo-500 font-bold">PKR Price</span>
            <span className="text-indigo-600 text-base font-bold font-mono">
              Rs. {product.price.toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={() => onSelect(product)}
            className="text-[10px] font-bold text-gray-400 group-hover:text-indigo-600 transition-colors flex items-center gap-0.5 tracking-widest uppercase border-b border-transparent group-hover:border-indigo-600 pb-0.5"
          >
            Invest <ArrowRight size={12} className="ml-0.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
};
export default ProductCard;
