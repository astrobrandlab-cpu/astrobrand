import React, { useState } from 'react';
import { Search, Filter, Mail, Phone, MessageSquare } from 'lucide-react';

const Leads = () => {
  const [leads, setLeads] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem('astrobrand_leads') || '[]');
      const defaultLeads = [
        { id: 1, name: 'Rahul Sharma', email: 'rahul.s@email.com', phone: '+91 9876543210', service: 'Marriage Compatibility', status: 'New', date: 'Oct 5, 2026' },
        { id: 2, name: 'Priya Patel', email: 'priya.p@email.com', phone: '+91 8765432109', service: 'Career Reading', status: 'Contacted', date: 'Oct 4, 2026' },
        { id: 3, name: 'Amit Kumar', email: 'amit.k@email.com', phone: '+91 7654321098', service: 'Full Birth Chart', status: 'Converted', date: 'Oct 3, 2026' },
        { id: 4, name: 'Neha Singh', email: 'neha.s@email.com', phone: '+91 6543210987', service: 'Tarot Session', status: 'New', date: 'Oct 2, 2026' },
        { id: 5, name: 'Vikram Das', email: 'vikram.d@email.com', phone: '+91 5432109876', service: 'Yearly Forecast', status: 'Closed', date: 'Oct 1, 2026' },
      ];
      if (local && local.length > 0) {
        return [...local, ...defaultLeads];
      }
      return defaultLeads;
    } catch {
      return [
        { id: 1, name: 'Rahul Sharma', email: 'rahul.s@email.com', phone: '+91 9876543210', service: 'Marriage Compatibility', status: 'New', date: 'Oct 5, 2026' },
        { id: 2, name: 'Priya Patel', email: 'priya.p@email.com', phone: '+91 8765432109', service: 'Career Reading', status: 'Contacted', date: 'Oct 4, 2026' },
        { id: 3, name: 'Amit Kumar', email: 'amit.k@email.com', phone: '+91 7654321098', service: 'Full Birth Chart', status: 'Converted', date: 'Oct 3, 2026' },
        { id: 4, name: 'Neha Singh', email: 'neha.s@email.com', phone: '+91 6543210987', service: 'Tarot Session', status: 'New', date: 'Oct 2, 2026' },
        { id: 5, name: 'Vikram Das', email: 'vikram.d@email.com', phone: '+91 5432109876', service: 'Yearly Forecast', status: 'Closed', date: 'Oct 1, 2026' },
      ];
    }
  });

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-2">Leads & Enquiries</h2>
          <p className="text-[#666] font-medium">Manage all client requests generated from your website.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm overflow-hidden flex flex-col h-[700px]">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#E8E2D9] bg-[#FAF7F2] flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-1 focus:ring-[#A48255] text-sm"
            />
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none px-4 py-2.5 bg-white border border-[#E8E2D9] rounded-xl text-sm font-bold text-[#4A4A4A] hover:bg-gray-50 flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button className="flex-1 sm:flex-none px-4 py-2.5 bg-[#1A1A1A] text-white rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-sm">
              Export CSV
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 bg-white shadow-sm z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider border-b border-[#E8E2D9]">Client Information</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider border-b border-[#E8E2D9]">Service Requested</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider border-b border-[#E8E2D9]">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider border-b border-[#E8E2D9]">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider border-b border-[#E8E2D9] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-[#FDFBF7] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#1A1A1A] text-[15px]">{lead.name}</div>
                    <div className="text-sm text-[#666] mt-1 flex items-center gap-3">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {lead.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {lead.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-[#FAF7F2] border border-[#E8E2D9] text-[#4A4A4A]">
                      {lead.service}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#666]">
                    {lead.date}
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer appearance-none ${
                        lead.status === 'New' ? 'bg-red-100 text-red-700' :
                        lead.status === 'Contacted' ? 'bg-blue-100 text-blue-700' :
                        lead.status === 'Converted' ? 'bg-green-100 text-green-700' :
                        'bg-gray-100 text-gray-700'
                      }`}
                      defaultValue={lead.status}
                    >
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-[#4CAF50] bg-green-50 hover:bg-green-100 rounded-lg transition-colors tooltip" title="WhatsApp">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-[#2196F3] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors tooltip" title="Email">
                        <Mail className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leads;
