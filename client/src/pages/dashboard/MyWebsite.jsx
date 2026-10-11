import React, { useState } from 'react';
import {
  Globe, ExternalLink, Edit3, Eye, Copy, Check,
  ShieldCheck, Zap, Share2, Smartphone, QrCode,
  CheckCircle2, ArrowUpRight, BarChart2, RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsite } from '../../context/WebsiteContext';
import PublicWebsiteView from '../../components/website/PublicWebsiteView';

const MyWebsite = () => {
  const { website } = useWebsite();
  const [copiedDomain, setCopiedDomain] = useState(false);
  const [copiedSubdomain, setCopiedSubdomain] = useState(false);

  const customDomain = website.customDomain || 'dr-mehak.com';
  const subdomain = website.subdomain || 'dr-mehak.astrobrand.in';
  const publicPath = `/site/${website.slug || 'dr-mehak'}`;

  const copyText = (text, setFn) => {
    navigator.clipboard.writeText(text);
    setFn(true);
    setTimeout(() => setFn(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Website is Live</span>
          </div>
          <h2 className="text-3xl font-serif font-medium text-[#1A1A1A]">My Website</h2>
          <p className="text-sm text-[#666] font-medium">
            Manage your live website URLs, view real-time status, and jump into the builder.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/preview"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white text-[#1A1A1A] border border-[#E8E2D9] hover:border-[#A48255] transition-all shadow-sm"
          >
            <Eye className="w-4 h-4 text-[#A48255]" />
            <span>Interactive Preview</span>
          </Link>

          <Link
            to="/dashboard/builder"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#A48255] hover:bg-[#8E6E44] transition-all shadow-md shadow-[#A48255]/20"
          >
            <Edit3 className="w-4 h-4" />
            <span>Open Builder</span>
          </Link>
        </div>
      </div>

      {/* ── Domain & Status Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Custom Domain Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                <ShieldCheck className="w-3.5 h-3.5" /> SSL Active
              </span>
            </div>
            <div className="text-xs font-bold text-[#888] uppercase tracking-wider mb-1">Primary Custom Domain</div>
            <h3 className="text-lg font-bold text-[#1A1A1A] truncate">{customDomain}</h3>
            <p className="text-xs text-[#666] mt-1">Configured with automated SSL certificate renewal</p>
          </div>

          <div className="pt-5 mt-5 border-t border-[#E8E2D9] flex items-center justify-between">
            <button
              onClick={() => copyText(`https://${customDomain}`, setCopiedDomain)}
              className="text-xs font-bold text-[#A48255] hover:underline flex items-center gap-1.5"
            >
              {copiedDomain ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedDomain ? 'Copied' : 'Copy URL'}</span>
            </button>
            <a
              href={publicPath}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#1A1A1A] hover:text-[#A48255] flex items-center gap-1"
            >
              <span>Visit</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* AstroBrand Subdomain Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                <CheckCircle2 className="w-3.5 h-3.5" /> Default URL
              </span>
            </div>
            <div className="text-xs font-bold text-[#888] uppercase tracking-wider mb-1">Platform Subdomain</div>
            <h3 className="text-lg font-bold text-[#1A1A1A] truncate">{subdomain}</h3>
            <p className="text-xs text-[#666] mt-1">Free permanent backup URL provided by AstroBrand</p>
          </div>

          <div className="pt-5 mt-5 border-t border-[#E8E2D9] flex items-center justify-between">
            <button
              onClick={() => copyText(`https://${subdomain}`, setCopiedSubdomain)}
              className="text-xs font-bold text-[#A48255] hover:underline flex items-center gap-1.5"
            >
              {copiedSubdomain ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSubdomain ? 'Copied' : 'Copy URL'}</span>
            </button>
            <a
              href={publicPath}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#1A1A1A] hover:text-[#A48255] flex items-center gap-1"
            >
              <span>Visit</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-[#888]">30 Days</span>
            </div>
            <div className="text-xs font-bold text-[#888] uppercase tracking-wider mb-1">Landing Page Views</div>
            <h3 className="text-2xl font-bold text-[#1A1A1A]">3,842 Views</h3>
            <p className="text-xs text-emerald-600 font-bold mt-1">▲ 14.8% increase this week</p>
          </div>

          <div className="pt-5 mt-5 border-t border-[#E8E2D9] flex items-center justify-between text-xs">
            <span className="text-[#666]">Avg. Time on Page: <strong>2m 45s</strong></span>
            <Link to="/dashboard/leads" className="font-bold text-[#A48255] hover:underline">
              128 Leads →
            </Link>
          </div>
        </div>

      </div>

      {/* ── Live Embedded Preview Window ── */}
      <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm overflow-hidden">
        <div className="p-6 border-b border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2]">
          <div>
            <h3 className="text-lg font-bold text-[#1A1A1A]">Live Website Snapshot</h3>
            <p className="text-xs text-[#666]">This is exactly how your visitors experience your landing page right now.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/dashboard/preview"
              className="px-4 py-2 rounded-xl text-xs font-bold bg-white text-[#1A1A1A] border border-[#E8E2D9] hover:bg-gray-50 flex items-center gap-1.5 shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#A48255]" />
              <span>Test Device Modes</span>
            </Link>
            <a
              href={publicPath}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1A1A1A] hover:bg-black flex items-center gap-1.5 shadow-xs"
            >
              <span>Full Screen</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Scaled preview container */}
        <div className="p-6 bg-[#F6F4F0] flex justify-center">
          <div className="w-full max-w-5xl h-[520px] rounded-2xl border border-gray-300 shadow-xl overflow-hidden bg-white flex flex-col">
            <div className="bg-[#FAF7F2] border-b border-[#E8E2D9] px-4 py-2 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="text-[11px] font-mono text-gray-500 ml-4">https://{customDomain}</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              <PublicWebsiteView website={website} isPreview={true} />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MyWebsite;
