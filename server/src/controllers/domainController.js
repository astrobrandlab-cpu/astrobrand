const Domain = require('../models/Domain');
const Website = require('../models/Website');
const Subscription = require('../models/Subscription');
const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
const dns = require('dns').promises;

// @desc    Get user's domain
// @route   GET /api/domains
exports.getDomain = async (req, res) => {
  try {
    const domain = await Domain.findOne({ user: req.user._id }).populate('website', 'slug status');
    
    res.status(200).json({
      success: true,
      data: domain,
      dnsInstructions: domain ? getDnsInstructions(domain.domain) : null
    });
  } catch (error) {
    console.error('Get domain error:', error);
    res.status(500).json({ success: false, message: 'Error fetching domain' });
  }
};

// @desc    Add domain
// @route   POST /api/domains
exports.addDomain = async (req, res) => {
  try {
    // Check plan limits
    const subscription = await Subscription.findOne({ user: req.user._id, status: 'active' });
    if (!subscription?.currentLimits?.customDomain) {
      return res.status(403).json({
        success: false,
        message: 'Custom domain is not available on your current plan. Please upgrade to use this feature.',
        upgradeRequired: true
      });
    }

    const { domain: domainName } = req.body;

    // Check if domain already registered
    const existingDomain = await Domain.findOne({ domain: domainName });
    if (existingDomain) {
      return res.status(400).json({
        success: false,
        message: 'This domain is already registered on the platform'
      });
    }

    // Remove existing domain for this user
    await Domain.deleteMany({ user: req.user._id });

    const website = await Website.findOne({ user: req.user._id });
    if (!website) {
      return res.status(400).json({
        success: false,
        message: 'Please create your website first before adding a domain'
      });
    }

    // Generate verification token
    const crypto = require('crypto');
    const verificationToken = `astrobrand-verify-${crypto.randomBytes(16).toString('hex')}`;

    const domain = await Domain.create({
      user: req.user._id,
      website: website._id,
      domain: domainName,
      verificationToken,
      dnsRecords: {
        aRecord: {
          expectedValue: process.env.SERVER_IP || '0.0.0.0'
        },
        cnameRecord: {
          expectedValue: process.env.PLATFORM_DOMAIN || 'astrobrand.com'
        }
      }
    });

    await ActivityLog.create({
      user: req.user._id,
      action: 'domain_added',
      description: `Domain added: ${domainName}`,
      targetType: 'Domain',
      targetId: domain._id
    });

    res.status(201).json({
      success: true,
      data: domain,
      dnsInstructions: getDnsInstructions(domainName),
      message: 'Domain added. Please configure DNS records and verify.'
    });
  } catch (error) {
    console.error('Add domain error:', error);
    res.status(500).json({ success: false, message: 'Error adding domain' });
  }
};

// @desc    Verify domain DNS
// @route   POST /api/domains/verify
exports.verifyDomain = async (req, res) => {
  try {
    const domain = await Domain.findOne({ user: req.user._id });
    if (!domain) {
      return res.status(404).json({ success: false, message: 'No domain found' });
    }

    domain.verificationStatus = 'verifying';
    domain.verificationAttempts += 1;
    domain.lastVerificationCheck = new Date();

    let aRecordVerified = false;
    let cnameVerified = false;

    // Verify A Record
    try {
      const addresses = await dns.resolve4(domain.domain);
      domain.dnsRecords.aRecord.actualValue = addresses.join(', ');
      domain.dnsRecords.aRecord.lastChecked = new Date();
      
      if (addresses.includes(domain.dnsRecords.aRecord.expectedValue)) {
        domain.dnsRecords.aRecord.configured = true;
        aRecordVerified = true;
      }
    } catch (err) {
      domain.dnsRecords.aRecord.actualValue = 'Not found';
      domain.dnsRecords.aRecord.lastChecked = new Date();
    }

    // Verify CNAME
    try {
      const cnames = await dns.resolveCname(`www.${domain.domain}`);
      domain.dnsRecords.cnameRecord.actualValue = cnames.join(', ');
      domain.dnsRecords.cnameRecord.lastChecked = new Date();

      if (cnames.some(c => c.includes(domain.dnsRecords.cnameRecord.expectedValue))) {
        domain.dnsRecords.cnameRecord.configured = true;
        cnameVerified = true;
      }
    } catch (err) {
      domain.dnsRecords.cnameRecord.actualValue = 'Not found';
      domain.dnsRecords.cnameRecord.lastChecked = new Date();
    }

    // Update statuses
    if (aRecordVerified || cnameVerified) {
      domain.verificationStatus = 'verified';
      domain.verifiedAt = new Date();
      domain.dnsStatus = 'configured';
      domain.connectionStatus = 'connected';
      domain.sslStatus = 'provisioning'; // SSL would be provisioned in production

      await Notification.create({
        user: req.user._id,
        type: 'domain_verified',
        title: 'Domain Verified! ✅',
        message: `Your domain ${domain.domain} has been verified and connected.`,
        link: '/dashboard/domain'
      });

      await ActivityLog.create({
        user: req.user._id,
        action: 'domain_verified',
        description: `Domain verified: ${domain.domain}`,
        targetType: 'Domain',
        targetId: domain._id
      });

      // Simulate SSL activation after verification
      setTimeout(async () => {
        try {
          await Domain.findByIdAndUpdate(domain._id, { sslStatus: 'active' });
        } catch (e) { /* ignore */ }
      }, 5000);
    } else {
      domain.verificationStatus = 'failed';
      domain.dnsStatus = 'mismatch';

      await Notification.create({
        user: req.user._id,
        type: 'domain_failed',
        title: 'Domain Verification Failed',
        message: `DNS records for ${domain.domain} are not correctly configured. Please check your DNS settings.`,
        link: '/dashboard/domain'
      });
    }

    domain.lastDnsCheck = new Date();
    await domain.save();

    res.status(200).json({
      success: true,
      data: domain,
      verified: aRecordVerified || cnameVerified,
      message: aRecordVerified || cnameVerified
        ? 'Domain verified and connected successfully!'
        : 'DNS records not found. Please ensure your DNS is configured correctly and try again (DNS propagation can take up to 48 hours).'
    });
  } catch (error) {
    console.error('Verify domain error:', error);
    res.status(500).json({ success: false, message: 'Error verifying domain' });
  }
};

// @desc    Remove domain
// @route   DELETE /api/domains
exports.removeDomain = async (req, res) => {
  try {
    const domain = await Domain.findOne({ user: req.user._id });
    if (!domain) {
      return res.status(404).json({ success: false, message: 'No domain found' });
    }

    await domain.deleteOne();

    await ActivityLog.create({
      user: req.user._id,
      action: 'domain_removed',
      description: `Domain removed: ${domain.domain}`,
      ipAddress: req.ip
    });

    res.status(200).json({ success: true, message: 'Domain removed successfully' });
  } catch (error) {
    console.error('Remove domain error:', error);
    res.status(500).json({ success: false, message: 'Error removing domain' });
  }
};

// Helper: DNS instructions
function getDnsInstructions(domainName) {
  return {
    aRecord: {
      type: 'A',
      host: '@',
      value: process.env.SERVER_IP || 'YOUR_SERVER_IP',
      ttl: 3600,
      description: `Point your root domain (${domainName}) to our server`
    },
    cnameRecord: {
      type: 'CNAME',
      host: 'www',
      value: process.env.PLATFORM_DOMAIN || 'astrobrand.com',
      ttl: 3600,
      description: `Point www.${domainName} to our platform`
    },
    txtRecord: {
      type: 'TXT',
      host: '_astrobrand',
      value: 'Verification token will be provided after adding domain',
      ttl: 3600,
      description: 'Optional: TXT record for domain ownership verification'
    },
    notes: [
      'DNS propagation can take up to 48 hours',
      'You can configure either A record OR CNAME record',
      'A record is for root domain (example.com)',
      'CNAME record is for www subdomain (www.example.com)',
      'SSL certificate will be automatically provisioned after verification'
    ]
  };
}
