import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Star, ToggleLeft, ToggleRight } from 'lucide-react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([
    { id: 1, name: 'Riya Sharma', text: 'The reading was incredibly accurate. It gave me the clarity I needed for my career.', rating: 5, active: true },
    { id: 2, name: 'Karan Desai', text: 'Highly recommend! Very insightful and professional consultation.', rating: 5, active: true },
    { id: 3, name: 'Anjali Verma', text: 'Helped me understand my relationship dynamics better.', rating: 4, active: false },
  ]);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-2">Testimonials</h2>
          <p className="text-[#666] font-medium">Manage the reviews shown on your website.</p>
        </div>
        <button className="px-6 py-3 bg-[#A48255] text-white rounded-xl text-sm font-bold hover:bg-[#8e6e44] transition-colors shadow-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div key={test.id} className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-1 text-[#A48255]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < test.rating ? 'fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <div className="flex gap-2">
                <button className="p-1.5 text-gray-400 hover:text-[#A48255] rounded-md hover:bg-[#FAF7F2]">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-[#4A4A4A] italic font-serif leading-relaxed mb-6 flex-1">"{test.text}"</p>
            
            <div className="pt-4 border-t border-[#E8E2D9] flex justify-between items-center">
              <span className="font-bold text-[#1A1A1A] text-sm">{test.name}</span>
              <button className="flex items-center gap-1.5 text-xs font-bold">
                {test.active ? (
                  <><ToggleRight className="w-5 h-5 text-[#4CAF50]" /> <span className="text-[#4CAF50]">Visible</span></>
                ) : (
                  <><ToggleLeft className="w-5 h-5 text-gray-400" /> <span className="text-gray-500">Hidden</span></>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
