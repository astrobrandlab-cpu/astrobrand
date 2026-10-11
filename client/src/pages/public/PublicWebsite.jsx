import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWebsite } from '../../context/WebsiteContext';
import PublicWebsiteView from '../../components/website/PublicWebsiteView';

const PublicWebsite = () => {
  const { slug } = useParams();
  const { website } = useWebsite();

  useEffect(() => {
    // Update document title for SEO & branding
    const brandName = website?.logo?.text || website?.about?.title || 'Astrology Consultation';
    document.title = `${brandName} — Vedic Astrology & Tarot Guidance`;
  }, [website]);

  return (
    <div className="min-h-screen">
      <PublicWebsiteView website={website} isPreview={false} />
    </div>
  );
};

export default PublicWebsite;
