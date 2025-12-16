"use client";

import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { ImageIcon, Calendar, BarChart2, ShoppingBag, Sparkles } from "lucide-react";

export default function FeedComposer() {
  const { user } = useAuth();

  const openModal = (type: 'TEXT' | 'POLL' | 'MARKET' | 'EVENT' = 'TEXT') => {
    document.dispatchEvent(new CustomEvent('open-create-modal', { detail: { type } }));
  };

  if (!user) return null;

  const firstName = user.profile?.fullName?.split(' ')[0] || "there";

  return (
    <motion.div 
      className="bg-white border-2 border-ink rounded-xl shadow-neo overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {/* Main Input Area */}
      <div className="p-4">
        <div className="flex gap-3">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-xl border-2 border-ink overflow-hidden bg-neutral-100 shadow-neo-sm">
              <img
                src={user.profile?.avatarUrl || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.email}`}
                alt="Your avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Input Button */}
          <button
            onClick={() => openModal('TEXT')}
            className="flex-1 flex items-center gap-3 px-5 py-3 bg-neutral-50 border-2 border-dashed border-neutral-300 rounded-xl text-left hover:border-ink hover:bg-white transition-all group"
          >
            <Sparkles className="w-5 h-5 text-neutral-400 group-hover:text-primary transition-colors" />
            <span className="text-neutral-500 group-hover:text-neutral-700 transition-colors">
              What's on your mind, {firstName}?
            </span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <ActionButton 
            icon={ImageIcon} 
            label="Media" 
            color="text-accent-blue" 
            bgColor="bg-accent-blue/10"
            onClick={() => openModal('TEXT')} 
          />
          <ActionButton 
            icon={BarChart2} 
            label="Poll" 
            color="text-accent-coral" 
            bgColor="bg-accent-coral/10"
            onClick={() => openModal('POLL')} 
          />
          <ActionButton 
            icon={ShoppingBag} 
            label="Sell" 
            color="text-accent-mint" 
            bgColor="bg-accent-mint/10"
            onClick={() => openModal('MARKET')} 
          />
          <ActionButton 
            icon={Calendar} 
            label="Event" 
            color="text-primary" 
            bgColor="bg-primary/20"
            onClick={() => openModal('EVENT')} 
          />
        </div>
      </div>
    </motion.div>
  );
}

interface ActionButtonProps {
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string;
  onClick: () => void;
}

function ActionButton({ icon: Icon, label, color, bgColor, onClick }: ActionButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-colors group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <span className="font-medium text-sm text-neutral-600 group-hover:text-ink hidden sm:inline">
        {label}
      </span>
    </motion.button>
  );
}
