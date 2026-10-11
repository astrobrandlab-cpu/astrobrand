import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title, description }) => {
  return (
    <div className="animate-in fade-in duration-500 flex flex-col items-center justify-center h-[60vh] text-center">
      <div className="w-24 h-24 bg-[#FAF7F2] rounded-full flex items-center justify-center mb-6 border border-[#E8E2D9]">
        <Construction className="w-12 h-12 text-[#A48255]" />
      </div>
      <h2 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-3">{title}</h2>
      <p className="text-[#666] font-medium max-w-md mx-auto">{description}</p>
      
      <button className="mt-8 px-6 py-3 bg-[#1A1A1A] text-white rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-sm">
        Go Back Home
      </button>
    </div>
  );
};

export default PlaceholderPage;
