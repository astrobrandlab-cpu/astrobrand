const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  template: {
    type: String,
    default: 'premium-astrology'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'unpublished', 'suspended'],
    default: 'draft'
  },
  publishedAt: Date,
  lastUpdated: Date,
  config: { type: mongoose.Schema.Types.Mixed },

  // SEO
  seo: {
    title: { type: String, maxlength: 70 },
    description: { type: String, maxlength: 160 },
    keywords: [String],
    ogTitle: String,
    ogDescription: String,
    ogImage: String,
    canonicalUrl: String,
    favicon: String
  },

  // Website Sections Configuration
  sections: {
    hero: {
      enabled: { type: Boolean, default: true },
      order: { type: Number, default: 1 },
      heading: String,
      subheading: String,
      ctaText: { type: String, default: 'Book Consultation' },
      ctaLink: { type: String, default: '#contact' },
      backgroundImage: String,
      overlayColor: { type: String, default: 'rgba(0,0,0,0.5)' }
    },
    about: {
      enabled: { type: Boolean, default: true },
      order: { type: Number, default: 2 },
      title: { type: String, default: 'About Me' },
      content: String,
      image: String
    },
    expertise: {
      enabled: { type: Boolean, default: true },
      order: { type: Number, default: 3 },
      title: { type: String, default: 'My Expertise' },
      items: [{
        icon: String,
        title: String,
        description: String
      }]
    },
    services: {
      enabled: { type: Boolean, default: true },
      order: { type: Number, default: 4 },
      title: { type: String, default: 'My Services' },
      subtitle: String,
      showPrices: { type: Boolean, default: true }
    },
    whyChooseMe: {
      enabled: { type: Boolean, default: true },
      order: { type: Number, default: 5 },
      title: { type: String, default: 'Why Choose Me' },
      items: [{
        icon: String,
        title: String,
        description: String
      }]
    },
    testimonials: {
      enabled: { type: Boolean, default: true },
      order: { type: Number, default: 6 },
      title: { type: String, default: 'Client Testimonials' },
      subtitle: String
    },
    consultation: {
      enabled: { type: Boolean, default: true },
      order: { type: Number, default: 7 },
      title: { type: String, default: 'Book a Consultation' },
      subtitle: String,
      formFields: {
        name: { type: Boolean, default: true },
        email: { type: Boolean, default: true },
        phone: { type: Boolean, default: true },
        service: { type: Boolean, default: true },
        message: { type: Boolean, default: true },
        dateOfBirth: { type: Boolean, default: false },
        timeOfBirth: { type: Boolean, default: false },
        placeOfBirth: { type: Boolean, default: false }
      }
    },
    gallery: {
      enabled: { type: Boolean, default: false },
      order: { type: Number, default: 8 },
      title: { type: String, default: 'Gallery' },
      images: [{
        url: String,
        caption: String
      }]
    },
    faq: {
      enabled: { type: Boolean, default: true },
      order: { type: Number, default: 9 },
      title: { type: String, default: 'Frequently Asked Questions' },
      items: [{
        question: String,
        answer: String
      }]
    },
    contact: {
      enabled: { type: Boolean, default: true },
      order: { type: Number, default: 10 },
      title: { type: String, default: 'Contact Me' },
      showMap: { type: Boolean, default: false },
      mapEmbed: String
    },
    footer: {
      enabled: { type: Boolean, default: true },
      order: { type: Number, default: 11 },
      text: String,
      showSocialLinks: { type: Boolean, default: true }
    }
  },

  // Theme/Appearance
  appearance: {
    primaryColor: { type: String, default: '#6C3CE1' },
    secondaryColor: { type: String, default: '#F59E0B' },
    backgroundColor: { type: String, default: '#0F0A1A' },
    textColor: { type: String, default: '#FFFFFF' },
    fontFamily: { type: String, default: 'Inter' },
    borderRadius: { type: String, default: '12px' },
    darkMode: { type: Boolean, default: true }
  },

  // Analytics
  views: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 }
}, {
  timestamps: true
});

websiteSchema.index({ user: 1 });
websiteSchema.index({ slug: 1 });
websiteSchema.index({ status: 1 });

module.exports = mongoose.model('Website', websiteSchema);
