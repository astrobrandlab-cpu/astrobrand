const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, '')
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().min(3).max(128).required(),
    phone: Joi.string().trim().allow('')
  }),

  login: Joi.object({
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().lowercase().trim().required()
  }),

  resetPassword: Joi.object({
    password: Joi.string().min(3).max(128).required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().trim().min(2).max(100),
    phone: Joi.string().trim().allow(''),
    profile: Joi.object({
      professionalName: Joi.string().trim().allow(''),
      gender: Joi.string().valid('male', 'female', 'other', ''),
      dateOfBirth: Joi.date().allow(null),
      location: Joi.string().trim().allow(''),
      languages: Joi.array().items(Joi.string()),
      experience: Joi.number().min(0),
      astrologyType: Joi.array().items(Joi.string()),
      specializations: Joi.array().items(Joi.string()),
      qualifications: Joi.array().items(Joi.string()),
      certifications: Joi.array().items(Joi.string()),
      about: Joi.string().max(5000).allow(''),
      shortBio: Joi.string().max(500).allow(''),
      whatsapp: Joi.string().allow(''),
      address: Joi.string().allow(''),
      social: Joi.object({
        instagram: Joi.string().allow(''),
        facebook: Joi.string().allow(''),
        youtube: Joi.string().allow(''),
        linkedin: Joi.string().allow(''),
        twitter: Joi.string().allow('')
      })
    })
  }),

  createService: Joi.object({
    name: Joi.string().trim().max(200).required(),
    description: Joi.string().max(2000).required(),
    price: Joi.number().min(0).required(),
    discountPrice: Joi.number().min(0).allow(null),
    duration: Joi.string().allow(''),
    category: Joi.string().valid(
      'Vedic Astrology', 'Western Astrology', 'Numerology', 'Tarot Reading',
      'Palmistry', 'Vastu Shastra', 'Horoscope', 'Marriage Astrology',
      'Career Astrology', 'Health Astrology', 'Financial Astrology',
      'Gemstone Consultation', 'Kundli Matching', 'Birth Chart Analysis',
      'Annual Prediction', 'Other'
    ),
    features: Joi.array().items(Joi.string()),
    status: Joi.string().valid('active', 'inactive')
  }),

  createTestimonial: Joi.object({
    customerName: Joi.string().trim().max(100).required(),
    rating: Joi.number().min(1).max(5).required(),
    testimonial: Joi.string().max(2000).required(),
    service: Joi.string().allow(''),
    date: Joi.date(),
    status: Joi.string().valid('active', 'inactive')
  }),

  createLead: Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().email().allow(''),
    phone: Joi.string().allow(''),
    whatsapp: Joi.string().allow(''),
    message: Joi.string().max(5000).allow(''),
    service: Joi.string().allow(''),
    dateOfBirth: Joi.string().allow(''),
    timeOfBirth: Joi.string().allow(''),
    placeOfBirth: Joi.string().allow('')
  }),

  addDomain: Joi.object({
    domain: Joi.string().trim().lowercase().required()
      .pattern(/^[a-z0-9]+([\-.][a-z0-9]+)*\.[a-z]{2,}$/)
      .message('Please enter a valid domain name (e.g., example.com)')
  }),

  updateWebsite: Joi.object({
    template: Joi.string(),
    sections: Joi.object(),
    seo: Joi.object(),
    appearance: Joi.object()
  }).min(1),

  createPlan: Joi.object({
    name: Joi.string().trim().required(),
    description: Joi.string().max(1000).required(),
    price: Joi.number().min(0).required(),
    billingCycle: Joi.string().valid('monthly', 'quarterly', 'yearly', 'lifetime', 'free').required(),
    features: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      included: Joi.boolean(),
      description: Joi.string().allow('')
    })),
    limits: Joi.object(),
    badge: Joi.string().allow(''),
    isPopular: Joi.boolean(),
    sortOrder: Joi.number(),
    status: Joi.string().valid('active', 'inactive')
  }),

  createTicket: Joi.object({
    subject: Joi.string().trim().max(200).required(),
    category: Joi.string().valid('billing', 'technical', 'domain', 'website', 'account', 'general'),
    priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
    message: Joi.string().max(5000).required()
  }),

  replyTicket: Joi.object({
    message: Joi.string().max(5000).required()
  })
};

module.exports = { validate, schemas };
