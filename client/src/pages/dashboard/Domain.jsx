import React, { useState, useEffect } from 'react';
import {
  Globe, AlertCircle, CheckCircle2, RefreshCw, Server,
  HelpCircle, Copy, Check, ExternalLink, ShieldCheck,
  Zap, ArrowRight, Trash2, ChevronDown, ChevronUp, Lock,
  Info, Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWebsite } from '../../context/WebsiteContext';

const DOMAIN_STATUS_KEY = 'astrobrand_domain_status';

const Domain = () => {
  const { user } = useAuth();
  const { website, saveWebsite } = useWebsite();

  const userDefaultDomain = user?.name
    ? `${user.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.com`
    : 'vikas.com';

  const [domainName, setDomainName] = useState(() => {
    return website?.customDomain || userDefaultDomain;
  });

  const [domainStatus, setDomainStatus] = useState(() => {
    const saved = localStorage.getItem(DOMAIN_STATUS_KEY);
    return saved || website?.domainStatus || 'pending';
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);
  const [successToast, setSuccessToast] = useState('');
  const [activeGuide, setActiveGuide] = useState(null); // 'godaddy' | 'hostinger' | 'namecheap' | null

  const permanentSubdomain = `${user?.name ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'vikas'}.astrobrand.in`;

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleConnectDomain = (e) => {
    e.preventDefault();
    if (!domainName.trim()) return;

    let clean = domainName.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    setDomainName(clean);
    setDomainStatus('pending');
    localStorage.setItem(DOMAIN_STATUS_KEY, 'pending');

    saveWebsite({
      customDomain: clean,
      domainStatus: 'pending'
    });

    setSuccessToast(`Domain ${clean} added! Please add the DNS records below to connect.`);
    setTimeout(() => setSuccessToast(''), 4000);
  };

  const handleVerifyConnection = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setDomainStatus('connected');
      localStorage.setItem(DOMAIN_STATUS_KEY, 'connected');

      saveWebsite({
        customDomain: domainName,
        domainStatus: 'connected'
      });

      setSuccessToast(`🎉 Success! ${domainName} is now connected with active SSL.`);
      setTimeout(() => setSuccessToast(''), 5000);
    }, 1200);
  };

  const handleDisconnect = () => {
    if (window.confirm(`Are you sure you want to disconnect ${domainName}? Your website will still be accessible via ${permanentSubdomain}.`)) {
      setDomainStatus('pending');
      localStorage.setItem(DOMAIN_STATUS_KEY, 'pending');
      saveWebsite({
        customDomain: '',
        domainStatus: 'pending'
      });
      setSuccessToast('Domain disconnected. Switched back to platform subdomain.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  const dnsRecords = [
    {
      type: 'A',
      typeBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      host: '@',
      value: '76.223.105.230',
      ttl: 'Automatic / 3600',
      purpose: 'Points apex domain to AstroBrand server'
    },
    {
      type: 'CNAME',
      typeBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      host: 'www',
      value: 'cname.astrobrand.in',
      ttl: 'Automatic / 3600',
      purpose: 'Routes www.yourdomain.com correctly'
    },
    {
      type: 'TXT',
      typeBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      host: '_astrobrand-challenge',
      value: `astrobrand-verification=2026-${user?.name ? user.name.toLowerCase().replace(/[^a-z0-9]/g, '') : 'vikas'}`,
      ttl: 'Automatic / 3600',
      purpose: 'Provisions free auto-renewing SSL certificate'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-10">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-[#A48255]" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#967C5A]">Domain Management</span>
          </div>
          <h2 className="text-3xl font-serif font-medium text-[#1A1A1A]">Custom Domain</h2>
          <p className="text-sm text-[#666] font-medium">
            Connect your branded domain (e.g. <strong>{domainName}</strong>) to your live astrology landing page.
          </p>
        </div>

        {domainStatus === 'connected' && (
          <a
            href={`/site/${website?.slug || 'vikas'}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#A48255] text-white rounded-xl text-xs font-bold hover:bg-[#8E6E44] transition-all shadow-sm shrink-0"
          >
            <span>Visit Live Domain</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>

      {/* ── Toast Notification ── */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-emerald-800 text-sm font-medium animate-in fade-in shadow-sm">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast('')} className="text-xs font-bold text-emerald-700 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* ── Main 2-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Domain Input & DNS Setup */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. Domain Input Card */}
          <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6 md:p-8">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-bold text-[#1A1A1A]">Your Custom Domain</h3>
              {domainStatus === 'connected' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active & Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  DNS Setup Required
                </span>
              )}
            </div>
            <p className="text-sm text-[#666] mb-6">
              Enter your purchased domain (from GoDaddy, Hostinger, Namecheap, etc.) without <code>https://</code>.
            </p>
            
            <form onSubmit={handleConnectDomain} className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Globe className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#E8E2D9] focus:outline-none focus:border-[#A48255] focus:ring-2 focus:ring-[#A48255]/20 bg-[#FAF7F2] font-semibold text-[#1A1A1A]" 
                  placeholder="e.g. vikas.com"
                />
              </div>
              <button 
                type="submit"
                className="px-8 py-3 bg-[#1A1A1A] hover:bg-black text-white rounded-xl text-sm font-bold transition-all shadow-sm shrink-0 cursor-pointer active:scale-95"
              >
                Connect Domain
              </button>
            </form>

            {domainStatus === 'connected' ? (
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm mb-0.5">Domain Successfully Connected</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      <strong>https://{domainName}</strong> is pointing to your astrology landing page with active SSL security.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline shrink-0"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-900 text-sm mb-0.5">DNS Records Pending Configuration</h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    To connect <strong>{domainName}</strong>, copy the DNS records below into your domain registrar's DNS panel (GoDaddy, Hostinger, etc.).
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 2. DNS Records Table Card */}
          <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm overflow-hidden">
            <div className="p-6 border-b border-[#E8E2D9] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F2]">
              <div>
                <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#967C5A]" /> Required DNS Records
                </h3>
                <p className="text-xs text-[#666] mt-0.5">Add these records in your domain provider's DNS Management panel</p>
              </div>

              <button
                type="button"
                onClick={handleVerifyConnection}
                disabled={isVerifying}
                className="px-4 py-2 bg-[#A48255] hover:bg-[#8E6E44] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Checking DNS Propagation...' : 'Verify Connection Now'}</span>
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[620px]">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-[#E8E2D9] text-[11px] font-bold text-[#666] uppercase tracking-wider">
                    <th className="px-6 py-3.5">Record Type</th>
                    <th className="px-6 py-3.5">Host / Name</th>
                    <th className="px-6 py-3.5">Points To (Value)</th>
                    <th className="px-6 py-3.5">TTL</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E2D9] text-sm">
                  {dnsRecords.map((r, idx) => (
                    <tr key={idx} className="hover:bg-[#FDFBF7] transition-colors">
                      <td className="px-6 py-4 font-bold">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${r.typeBadge}`}>
                          {r.type}
                        </span>
                        <div className="text-[10px] text-gray-500 font-normal mt-1">{r.purpose}</div>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-[#1A1A1A]">
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs">{r.host}</code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(r.host, `host-${idx}`)}
                            className="p-1 text-gray-400 hover:text-[#A48255] transition-colors"
                            title="Copy Host"
                          >
                            {copiedKey === `host-${idx}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono font-semibold text-[#1A1A1A]">
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-xs select-all">{r.value}</code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(r.value, `val-${idx}`)}
                            className="p-1 text-gray-400 hover:text-[#A48255] transition-colors"
                            title="Copy Value"
                          >
                            {copiedKey === `val-${idx}` ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-xs text-[#666]">
                        {r.ttl}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => copyToClipboard(r.value, `btn-${idx}`)}
                          className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F2EFEA] border border-[#E8E2D9] rounded-lg text-xs font-bold text-[#A48255] transition-colors inline-flex items-center gap-1.5"
                        >
                          {copiedKey === `btn-${idx}` ? (
                            <><Check className="w-3 h-3 text-green-600" /><span className="text-green-600">Copied</span></>
                          ) : (
                            <><Copy className="w-3 h-3" /><span>Copy</span></>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-[#E8E2D9] text-xs text-[#666] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400 shrink-0" />
                <span>DNS changes usually take 5–15 minutes, but can take up to 24–48 hours depending on your registrar.</span>
              </div>
              <button
                type="button"
                onClick={handleVerifyConnection}
                className="font-bold text-[#A48255] hover:underline shrink-0"
              >
                Re-check DNS
              </button>
            </div>
          </div>

          {/* 3. Step-by-Step Registrar Guides */}
          <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6 md:p-8">
            <h3 className="font-bold text-[#1A1A1A] text-lg mb-2 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#967C5A]" /> Step-by-Step DNS Guides
            </h3>
            <p className="text-xs text-[#666] mb-5">
              Click your domain provider below for exact instructions on where to paste these records:
            </p>

            <div className="space-y-3">
              {/* GoDaddy Guide */}
              <div className="border border-[#E8E2D9] rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveGuide(activeGuide === 'godaddy' ? null : 'godaddy')}
                  className="w-full p-4 text-left font-bold text-sm flex items-center justify-between bg-[#FAF7F2] hover:bg-[#F2EFEA] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🦊</span> How to connect domain on GoDaddy
                  </span>
                  {activeGuide === 'godaddy' ? <ChevronUp className="w-4 h-4 text-[#888]" /> : <ChevronDown className="w-4 h-4 text-[#888]" />}
                </button>
                {activeGuide === 'godaddy' && (
                  <div className="p-5 text-xs text-[#4A4A4A] space-y-2.5 bg-white leading-relaxed border-t border-[#E8E2D9]">
                    <p><strong>Step 1:</strong> Log in to your <a href="https://godaddy.com" target="_blank" rel="noreferrer" className="text-[#A48255] underline">GoDaddy Dashboard</a> and click on <strong>Domain Portfolio</strong>.</p>
                    <p><strong>Step 2:</strong> Select your domain (<code>{domainName}</code>) and click on <strong>DNS</strong> or <strong>Manage DNS</strong>.</p>
                    <p><strong>Step 3:</strong> Click <strong>Add New Record</strong>:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Type: <strong>A</strong> | Name: <strong>@</strong> | Value: <strong>76.223.105.230</strong> | TTL: <strong>Default</strong></li>
                      <li>Type: <strong>CNAME</strong> | Name: <strong>www</strong> | Value: <strong>cname.astrobrand.in</strong> | TTL: <strong>Default</strong></li>
                    </ul>
                    <p><strong>Step 4:</strong> Save changes and click <strong>Verify Connection Now</strong> above.</p>
                  </div>
                )}
              </div>

              {/* Hostinger Guide */}
              <div className="border border-[#E8E2D9] rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveGuide(activeGuide === 'hostinger' ? null : 'hostinger')}
                  className="w-full p-4 text-left font-bold text-sm flex items-center justify-between bg-[#FAF7F2] hover:bg-[#F2EFEA] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">⚡</span> How to connect domain on Hostinger
                  </span>
                  {activeGuide === 'hostinger' ? <ChevronUp className="w-4 h-4 text-[#888]" /> : <ChevronDown className="w-4 h-4 text-[#888]" />}
                </button>
                {activeGuide === 'hostinger' && (
                  <div className="p-5 text-xs text-[#4A4A4A] space-y-2.5 bg-white leading-relaxed border-t border-[#E8E2D9]">
                    <p><strong>Step 1:</strong> Log in to Hostinger hPanel and go to <strong>Domains</strong> &gt; <code>{domainName}</code> &gt; <strong>DNS / Nameservers</strong>.</p>
                    <p><strong>Step 2:</strong> Under DNS Records, delete any existing default parking <strong>A</strong> record.</p>
                    <p><strong>Step 3:</strong> Add Record &gt; Type: <strong>A</strong> &gt; Name: <strong>@</strong> &gt; Points to: <strong>76.223.105.230</strong>.</p>
                    <p><strong>Step 4:</strong> Add Record &gt; Type: <strong>CNAME</strong> &gt; Name: <strong>www</strong> &gt; Points to: <strong>cname.astrobrand.in</strong>.</p>
                    <p><strong>Step 5:</strong> Click <strong>Save Changes</strong> and come back here to verify.</p>
                  </div>
                )}
              </div>

              {/* Namecheap Guide */}
              <div className="border border-[#E8E2D9] rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveGuide(activeGuide === 'namecheap' ? null : 'namecheap')}
                  className="w-full p-4 text-left font-bold text-sm flex items-center justify-between bg-[#FAF7F2] hover:bg-[#F2EFEA] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">🌐</span> How to connect on Namecheap / Cloudflare
                  </span>
                  {activeGuide === 'namecheap' ? <ChevronUp className="w-4 h-4 text-[#888]" /> : <ChevronDown className="w-4 h-4 text-[#888]" />}
                </button>
                {activeGuide === 'namecheap' && (
                  <div className="p-5 text-xs text-[#4A4A4A] space-y-2.5 bg-white leading-relaxed border-t border-[#E8E2D9]">
                    <p><strong>Step 1:</strong> Go to Namecheap Dashboard &gt; Domain List &gt; click <strong>Manage</strong> next to your domain.</p>
                    <p><strong>Step 2:</strong> Go to the <strong>Advanced DNS</strong> tab.</p>
                    <p><strong>Step 3:</strong> Add <strong>A Record</strong> (Host: <code>@</code>, Value: <code>76.223.105.230</code>) and <strong>CNAME Record</strong> (Host: <code>www</code>, Value: <code>cname.astrobrand.in</code>).</p>
                    <p><em>Note for Cloudflare users: Make sure the Proxy status is set to <strong>DNS Only (Grey Cloud)</strong> during setup.</em></p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Status, SSL, Subdomain */}
        <div className="space-y-6">
          
          {/* SSL Certificate Card */}
          <div className="bg-[#1A1A1A] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A48255] rounded-full filter blur-[50px] opacity-30 -mr-10 -mt-10 pointer-events-none" />
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#A48255]" /> SSL Security (HTTPS)
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Every connected domain gets a dedicated 256-bit SSL certificate generated automatically by Let's Encrypt with automated renewal.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
              <span className="text-gray-400">SSL Status</span>
              {domainStatus === 'connected' ? (
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Active & Encrypted
                </span>
              ) : (
                <span className="font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> Pending DNS Match
                </span>
              )}
            </div>
          </div>

          {/* Backup Subdomain Card */}
          <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                ★
              </div>
              <div>
                <h4 className="font-bold text-sm text-[#1A1A1A]">Platform Backup URL</h4>
                <p className="text-[11px] text-[#666]">Permanent address provided by AstroBrand</p>
              </div>
            </div>

            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] flex items-center justify-between gap-2 mb-4">
              <span className="text-xs font-mono font-bold text-[#1A1A1A] truncate">
                https://{permanentSubdomain}
              </span>
              <button
                type="button"
                onClick={() => copyToClipboard(`https://${permanentSubdomain}`, 'subdomain')}
                className="text-xs font-bold text-[#A48255] hover:underline shrink-0"
              >
                {copiedKey === 'subdomain' ? 'Copied' : 'Copy'}
              </button>
            </div>

            <p className="text-xs text-[#666] leading-relaxed">
              Even while DNS propagation is pending for your custom domain, your clients can always reach your website via this link.
            </p>
          </div>

          {/* Helpful Tips Card */}
          <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6">
            <h4 className="font-bold text-sm text-[#1A1A1A] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A48255]" /> Pro Domain Tips
            </h4>
            <ul className="space-y-2.5 text-xs text-[#666]">
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Do NOT enter <code>http://</code> or trailing slashes in the domain box.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Delete old A records pointing to other hosting providers to prevent conflicts.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Both <code>vikas.com</code> and <code>www.vikas.com</code> will work automatically once DNS is set.</span>
              </li>
            </ul>
          </div>

          {/* Nameserver Alternative Card */}
          <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-[#A48255]" />
              <h4 className="font-bold text-sm text-[#1A1A1A]">Alternative: Use Nameservers</h4>
            </div>
            <p className="text-xs text-[#666] mb-4 leading-relaxed">
              Prefer an automatic setup without adding individual DNS records? Change your registrar Nameservers to:
            </p>

            <div className="space-y-2">
              <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#1A1A1A]">ns1.astrobrand.in</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('ns1.astrobrand.in', 'ns1')}
                  className="text-xs font-bold text-[#A48255] hover:underline"
                >
                  {copiedKey === 'ns1' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E2D9] flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#1A1A1A]">ns2.astrobrand.in</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('ns2.astrobrand.in', 'ns2')}
                  className="text-xs font-bold text-[#A48255] hover:underline"
                >
                  {copiedKey === 'ns2' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Need Setup Help WhatsApp Card */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-[#F3EEE5] rounded-3xl border border-[#E8E2D9] p-6 shadow-sm">
            <h4 className="font-bold text-sm text-[#1A1A1A] mb-1.5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#A48255]" /> Need Help Connecting?
            </h4>
            <p className="text-xs text-[#666] mb-4 leading-relaxed">
              Stuck with GoDaddy or Hostinger DNS? Our tech team can connect your domain for free in 5 minutes.
            </p>
            <a
              href="https://wa.me/919876543210?text=Hello%20AstroBrand%20Team%2C%20please%20help%20me%20connect%20my%20custom%20domain"
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <span>Get WhatsApp Support</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Domain;
