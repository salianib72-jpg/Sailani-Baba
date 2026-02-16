
import React from 'react';
import { PricingPlan } from '../types';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (plan: PricingPlan) => void;
}

const plans: PricingPlan[] = [
  { id: '1', name: 'Starter', price: 100, coins: 100 },
  { id: '2', name: 'Growth', price: 250, coins: 300, popular: true },
  { id: '3', name: 'Pro', price: 500, coins: 750 },
  { id: '4', name: 'Viral', price: 1000, coins: 1800 },
];

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onPurchase }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-10 shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white">Recharge Coins</h2>
            <p className="text-slate-400">Choose a plan to continue generating viral content</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`relative flex flex-col p-6 rounded-2xl border transition-all hover:scale-[1.03] ${
                plan.popular 
                ? "border-purple-500 bg-purple-500/5 shadow-[0_0_20px_rgba(168,85,247,0.15)]" 
                : "border-slate-800 bg-slate-900"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Best Value
                </span>
              )}
              <h3 className="text-lg font-bold text-slate-300 mb-1">{plan.name}</h3>
              <div className="flex items-baseline space-x-1 mb-4">
                <span className="text-3xl font-black text-white">₹{plan.price}</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-6 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                <i className="fas fa-coins text-yellow-500"></i>
                <span className="text-xl font-bold text-white">{plan.coins}</span>
                <span className="text-xs text-slate-500 uppercase font-bold">Coins</span>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="text-xs text-slate-400 flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i> {Math.floor(plan.coins / 10)} Generations
                </li>
                <li className="text-xs text-slate-400 flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i> 3D HD Thumbnails
                </li>
                <li className="text-xs text-slate-400 flex items-center">
                  <i className="fas fa-check text-green-500 mr-2"></i> Viral Descriptions
                </li>
              </ul>

              <button
                onClick={() => onPurchase(plan)}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                  plan.popular 
                  ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-900/20" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-200"
                }`}
              >
                Buy Now
              </button>
            </div>
          ))}
        </div>
        
        <p className="text-center text-slate-500 text-[10px] mt-8 uppercase tracking-widest">
          Secure Payments via Razorpay • GST Included
        </p>
      </div>
    </div>
  );
};
