import React, { useState } from 'react';
import {
  Monitor, Tablet, Smartphone, ExternalLink, Edit3,
  Copy, Check, Eye, Lock, RefreshCw, ZoomIn, ZoomOut,
  Maximize2, ArrowLeft, Sparkles, Share2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWebsite } from '../../context/WebsiteContext';
import PublicWebsiteView from '../../components/website/PublicWebsiteView';

const PreviewPage = () => {
  const { website } = useWebsite();
  const navigate = useNavigate();

  const [device, setDevice] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const liveUrl = `https://${website.customDomain || 'dr-mehak.com'}`;
  const publicPath = `/site/${website.slug || 'dr-mehak'}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(window.location.origin + publicPath);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reloadPreview = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      
      {/* ── Top Control Bar ── */}
      <div className="bg-white rounded-2xl border border-[#E8E2D9] p-4 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Left: Device Mode Switchers */}
        <div className="flex items-center gap-2 w-full lg:w-auto justify-between lg:justify-start">
          <div className="flex items-center bg-[#FAF7F2] p-1 rounded-xl border border-[#E8E2D9]">
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                device === 'desktop'
                  ? 'bg-white text-[#A48255] shadow-sm'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Desktop View (1200px+)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                device === 'tablet'
                  ? 'bg-white text-[#A48255] shadow-sm'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Tablet View (768px)"
            >
              <Tablet className="w-3.5 h-3.5" />
              <span>Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                device === 'mobile'
                  ? 'bg-white text-[#A48255] shadow-sm'
                  : 'text-[#666] hover:text-[#1A1A1A]'
              }`}
              title="Mobile View (390px)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={reloadPreview}
            className="p-2 text-gray-500 hover:text-[#A48255] rounded-xl hover:bg-[#FAF7F2] border border-transparent hover:border-[#E8E2D9] transition-all"
            title="Reload Preview"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Simulated Address Bar */}
        <div className="flex items-center gap-2 bg-[#FAF7F2] border border-[#E8E2D9] px-4 py-2 rounded-xl text-xs font-medium text-[#555] w-full lg:w-96 justify-between">
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{liveUrl}</span>
          </div>
          <button
            onClick={copyUrl}
            className="text-xs text-[#A48255] hover:text-[#8E6E44] font-bold flex items-center gap-1 shrink-0 ml-2"
            title="Copy Public Link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-green-600" />
                <span className="text-green-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
          <Link
            to="/dashboard/builder"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#1A1A1A] bg-[#FAF7F2] hover:bg-[#F2EFEA] border border-[#E8E2D9] transition-all shadow-sm"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#A48255]" />
            <span>Edit in Builder</span>
          </Link>

          <a
            href={publicPath}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#1A1A1A] hover:bg-black transition-all shadow-sm"
          >
            <span>Open in New Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>

      {/* ── Preview Frame Container ── */}
      <div className="bg-[#EFECE6] border border-[#E0D9CF] rounded-3xl p-4 md:p-8 flex justify-center items-start min-h-[calc(100vh-230px)] overflow-x-auto shadow-inner">
        <div
          key={refreshKey}
          className={`transition-all duration-300 bg-white shadow-2xl overflow-hidden flex flex-col ${
            device === 'mobile'
              ? 'w-[390px] min-h-[780px] rounded-[44px] border-[10px] border-[#2C2C2C] ring-1 ring-black/10 my-4'
              : device === 'tablet'
              ? 'w-[768px] min-h-[850px] rounded-[32px] border-[8px] border-[#2C2C2C] ring-1 ring-black/10 my-4'
              : 'w-full max-w-[1280px] min-h-[800px] rounded-2xl border border-gray-300'
          }`}
          style={{
            zoom: zoom === 100 ? undefined : `${zoom}%`
          }}
        >
          {/* Mobile Speaker / Camera Notch */}
          {device === 'mobile' && (
            <div className="bg-[#2C2C2C] h-6 flex justify-center items-center shrink-0">
              <div className="w-20 h-3.5 bg-black rounded-full mb-1 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#1A1A1A] mr-2" />
                <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
              </div>
            </div>
          )}

          {/* Browser address bar header for tablet/desktop */}
          {device !== 'mobile' && (
            <div className="bg-[#FAF7F2] border-b border-[#E8E2D9] px-4 py-2.5 flex items-center justify-between shrink-0 select-none">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>
              <div className="text-[11px] font-mono text-gray-500 bg-white px-6 py-1 rounded-md border border-[#E8E2D9] flex items-center gap-1.5 shadow-xs">
                <Lock className="w-3 h-3 text-emerald-600" />
                <span>{website.customDomain || 'dr-mehak.com'}</span>
              </div>
              <div className="text-[11px] font-bold text-[#A48255] uppercase tracking-wider">
                ● Live
              </div>
            </div>
          )}

          {/* Render the actual website */}
          <div className="flex-1 overflow-y-auto">
            <PublicWebsiteView website={website} isPreview={true} />
          </div>

          {/* Mobile Home indicator bar */}
          {device === 'mobile' && (
            <div className="bg-[#2C2C2C] h-5 flex justify-center items-center shrink-0">
              <div className="w-28 h-1 bg-white/40 rounded-full" />
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default PreviewPage;
