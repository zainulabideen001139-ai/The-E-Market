import React from 'react';
import { ShoppingBag, ArrowLeft, RefreshCw, XCircle } from 'lucide-react';

export const SafepayCancelScreen: React.FC = () => {
  return (
    <div className="max-w-md mx-auto my-16 bg-white border border-gray-200 p-8 rounded-3xl text-gray-700 animate-fade-in space-y-6 shadow-xl font-sans">
      <div className="text-center space-y-3">
        <div className="h-12 w-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-600 border border-amber-100">
          <XCircle size={24} />
        </div>
        <h3 className="serif text-2xl italic text-gray-950 font-semibold">Payment Released</h3>
        <p className="text-xs text-gray-500 font-medium">Your transaction verification was released by the merchant desk.</p>
      </div>

      <div className="bg-amber-100/35 border border-amber-100/60 p-4 rounded-xl text-xs space-y-1.5 leading-relaxed">
        <span className="text-amber-900 font-bold uppercase block text-[9px] tracking-wide">Safepay Sandbox Cancelled</span>
        <p className="text-gray-650 font-medium font-sans text-gray-600">The checkout workflow was cancelled safely. No funds have been accessed from your credit card. You can choose COD or mobile wallet channels at checkout.</p>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed font-sans">
        Would you like to try another checkout method or review your choices?
      </p>

      <div className="flex flex-col sm:flex-row gap-3 pt-2 font-sans">
        <button
          onClick={() => {
            window.location.href = '/?activePage=checkout';
          }}
          className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all text-center cursor-pointer shadow-sm"
        >
          Return to Checkout
        </button>
        <button
          onClick={() => {
            window.location.href = '/';
          }}
          className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-all text-center cursor-pointer"
        >
          Go back Home
        </button>
      </div>
    </div>
  );
};
export default SafepayCancelScreen;
