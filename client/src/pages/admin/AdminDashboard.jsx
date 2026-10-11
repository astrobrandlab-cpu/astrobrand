import React from 'react';
import { Users, CreditCard, Globe, Link2, ArrowUpRight, TrendingUp } from 'lucide-react';

const AdminStatCard = ({ title, value, trend, icon: Icon, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
        <ArrowUpRight className="w-3 h-3" /> {trend}
      </span>
    </div>
    <p className="text-sm font-bold text-[#666] mb-1 uppercase tracking-wider">{title}</p>
    <h3 className="text-3xl font-serif font-medium text-[#1A1A1A]">{value}</h3>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      <div>
        <h2 className="text-3xl font-serif font-medium text-[#1A1A1A] mb-2">Platform Overview</h2>
        <p className="text-[#666] font-medium">Global metrics for AstroBrand SaaS.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          title="Total MRR" 
          value="₹4,25,000" 
          trend="12%" 
          icon={TrendingUp} 
          colorClass="bg-blue-50 text-blue-600" 
        />
        <AdminStatCard 
          title="Active Astrologers" 
          value="142" 
          trend="8%" 
          icon={Users} 
          colorClass="bg-[#FDF6EA] text-[#B4884B]" 
        />
        <AdminStatCard 
          title="Published Sites" 
          value="128" 
          trend="5%" 
          icon={Globe} 
          colorClass="bg-purple-50 text-purple-600" 
        />
        <AdminStatCard 
          title="Custom Domains" 
          value="95" 
          trend="15%" 
          icon={Link2} 
          colorClass="bg-emerald-50 text-emerald-600" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registrations Table */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E8E2D9]">
            <h3 className="font-bold text-[#1A1A1A] text-lg">Recent Signups</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2]">
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {[
                { name: 'Dr. Mehak S.', email: 'hello@mehak.com', plan: 'Professional', date: 'Today' },
                { name: 'Pandit Sharma', email: 'psharma@gmail.com', plan: 'Basic', date: 'Yesterday' },
                { name: 'Astro Rahul', email: 'rahul.ast@outlook.com', plan: 'Premium', date: 'Oct 3' },
              ].map((user, i) => (
                <tr key={i} className="hover:bg-[#FDFBF7]">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[#1A1A1A]">{user.name}</div>
                    <div className="text-sm text-[#666]">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#F2EFEA] text-[#1A1A1A]">
                      {user.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#666]">{user.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Payments Table */}
        <div className="bg-white rounded-2xl border border-[#E8E2D9] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E8E2D9]">
            <h3 className="font-bold text-[#1A1A1A] text-lg">Recent Payments</h3>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF7F2]">
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-[#967C5A] uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {[
                { amount: '₹14,999', user: 'Dr. Mehak S.', status: 'Success' },
                { amount: '₹4,999', user: 'Pandit Sharma', status: 'Success' },
                { amount: '₹24,999', user: 'Sonika M.', status: 'Pending' },
              ].map((pay, i) => (
                <tr key={i} className="hover:bg-[#FDFBF7]">
                  <td className="px-6 py-4 font-bold text-[#1A1A1A]">{pay.amount}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#666]">{pay.user}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      pay.status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {pay.status}
                    </span>
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

export default AdminDashboard;
