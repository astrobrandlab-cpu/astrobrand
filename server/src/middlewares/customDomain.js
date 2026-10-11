/**
 * MIDDLEWARE: Custom Domain Resolver
 * 
 * Ye middleware incoming request ka Host header check karta hai.
 * Agar Host header mein koi custom domain hai (e.g. dr-mehak.com)
 * to wo Domain collection mein dhundta hai aur us astrologer ka
 * website data req object pe attach kar deta hai.
 * 
 * Flow:
 *   User visits dr-mehak.com
 *   → Server pe request aati hai (Host: dr-mehak.com)
 *   → Ye middleware Domain DB mein dr-mehak.com dhundta hai
 *   → Usse linked Website + User data fetch karta hai
 *   → req.customDomain = { domain, website, user }
 *   → Agle route handler ko pass kar deta hai
 */

const Domain = require('../models/Domain');
const Website = require('../models/Website');
const User = require('../models/User');
const Service = require('../models/Service');
const Testimonial = require('../models/Testimonial');

// Platform's own domains — inhe custom domain se treat nahi karna
const PLATFORM_HOSTS = [
  'localhost',
  '127.0.0.1',
  'astrobrand.in',
  'www.astrobrand.in',
  'api.astrobrand.in',
  process.env.PLATFORM_DOMAIN,
  process.env.API_DOMAIN,
].filter(Boolean).map(h => h.toLowerCase());

/**
 * Checks if the incoming host is the platform's own domain
 */
const isPlatformDomain = (host) => {
  if (!host) return true;
  const cleanHost = host.split(':')[0].toLowerCase(); // remove port
  if (
    cleanHost === 'localhost' ||
    cleanHost === '127.0.0.1' ||
    cleanHost.includes('onrender.com') ||
    cleanHost.includes('render.com') ||
    cleanHost.includes('vercel.app') ||
    cleanHost.includes('netlify.app') ||
    cleanHost.includes('astrobrand')
  ) {
    return true;
  }
  return PLATFORM_HOSTS.some(pd => cleanHost === pd || cleanHost.endsWith(`.${pd}`));
};

/**
 * Main middleware — attach custom domain data to req
 */
const customDomainMiddleware = async (req, res, next) => {
  try {
    // ALWAYS bypass for API requests, health check, uploads, and static assets
    const currentPath = req.originalUrl || req.url || req.path || '';
    if (
      currentPath.startsWith('/api') ||
      currentPath.startsWith('/uploads') ||
      currentPath === '/' ||
      currentPath === '/health'
    ) {
      return next();
    }

    const host = req.headers.host || '';
    const cleanHost = host.split(':')[0].toLowerCase();

    // Skip for platform's own domains
    if (isPlatformDomain(cleanHost)) {
      return next();
    }

    // Look up this domain in DB
    const domainRecord = await Domain.findOne({
      domain: cleanHost,
      verificationStatus: 'verified',
      connectionStatus: 'connected',
    }).populate('website').populate('user', 'name email avatar profile phone');

    if (!domainRecord) {
      // Domain exists but not verified / not found — show error page
      return res.status(404).json({
        success: false,
        message: 'Domain not found or not yet verified on AstroBrand.',
        hint: 'If you just connected this domain, DNS propagation can take up to 48 hours.'
      });
    }

    // Check website is published
    if (!domainRecord.website || domainRecord.website.status !== 'published') {
      return res.status(503).json({
        success: false,
        message: 'This astrologer\'s website is not published yet.',
      });
    }

    // Attach to req for downstream handlers
    req.customDomain = {
      domainRecord,
      website: domainRecord.website,
      astrologer: domainRecord.user,
    };

    next();
  } catch (error) {
    console.error('[CustomDomain Middleware] Error:', error);
    next(); // Don't block request on error, just pass through
  }
};

/**
 * Route handler — serves the full website data for a custom domain
 * GET /  (when request comes in on a custom domain)
 * 
 * @route   GET /api/websites/by-domain
 * @access  Public (called by frontend when it detects custom domain)
 */
const getWebsiteByDomain = async (req, res) => {
  try {
    const { domain } = req.query; // e.g. ?domain=dr-mehak.com

    if (!domain) {
      return res.status(400).json({ success: false, message: 'Domain parameter required' });
    }

    const cleanDomain = domain.split(':')[0].toLowerCase().replace(/^www\./, '');

    const domainRecord = await Domain.findOne({
      $or: [
        { domain: cleanDomain },
        { domain: `www.${cleanDomain}` }
      ],
      verificationStatus: 'verified',
      connectionStatus: 'connected',
    }).populate('website').populate('user', 'name email avatar profile phone socialLinks');

    if (!domainRecord) {
      return res.status(404).json({
        success: false,
        message: 'Domain not configured on AstroBrand.',
      });
    }

    const website = domainRecord.website;

    if (!website || website.status !== 'published') {
      return res.status(503).json({
        success: false,
        message: 'Website is not published yet.',
      });
    }

    // Increment views
    await Website.findByIdAndUpdate(website._id, { $inc: { views: 1 } });

    // Fetch services + testimonials for this astrologer
    const [services, testimonials] = await Promise.all([
      Service.find({ user: domainRecord.user._id, status: 'active' }).sort({ sortOrder: 1 }),
      Testimonial.find({ user: domainRecord.user._id, status: 'active' }).sort({ sortOrder: 1 }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        website,
        astrologer: {
          name: domainRecord.user.name,
          email: domainRecord.user.email,
          avatar: domainRecord.user.avatar,
          profile: domainRecord.user.profile,
          phone: domainRecord.user.phone,
          socialLinks: domainRecord.user.socialLinks || {},
        },
        services,
        testimonials,
        domain: cleanDomain,
      },
    });
  } catch (error) {
    console.error('[getWebsiteByDomain] Error:', error);
    res.status(500).json({ success: false, message: 'Error loading website' });
  }
};

module.exports = { customDomainMiddleware, getWebsiteByDomain };
