'use client';

import { ThemeColors, resolveTheme, generateThemeCSSVariables, getImageUrl } from '@/lib/theme';

export interface CouponCardProps {
  businessName: string;
  logoUrl?: string;
  title: string;
  terms: string;
  expiresAt?: string;
  heroImageUrl?: string;
  business?: {
    brand_primary?: string;
    brand_secondary?: string;
    logo_url?: string;
  };
  book?: {
    theme_primary?: string;
    theme_secondary?: string;
  };
  className?: string;
  onClick?: () => void;
  isPrintMode?: boolean;
}

export default function CouponCard({
  businessName,
  logoUrl,
  title,
  terms,
  expiresAt,
  heroImageUrl,
  business,
  book,
  className = '',
  onClick,
  isPrintMode = false
}: CouponCardProps) {
  // Resolve theme colors
  const theme = resolveTheme(business, book);
  const cssVariables = generateThemeCSSVariables(theme);
  
  // Get image URLs with fallbacks
  const displayLogoUrl = getImageUrl(logoUrl, business?.logo_url);
  const displayHeroUrl = getImageUrl(heroImageUrl, displayLogoUrl);
  
  // Format expiration date
  const formattedExpiry = expiresAt ? new Date(expiresAt).toLocaleDateString() : null;
  
  return (
    <article 
      style={cssVariables}
      className={`coupon-card ${isPrintMode ? 'print-mode' : ''} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Header with logo and meta info */}
      <header className="coupon-header">
        {displayLogoUrl && (
          <div className="coupon-logo-container">
            <img 
              className="coupon-logo" 
              src={displayLogoUrl} 
              alt={`${businessName} logo`}
              onError={(e) => {
                // Hide logo on error
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="coupon-meta">
          <h3 className="coupon-title">{title}</h3>
          <p className="coupon-business">{businessName}</p>
          {formattedExpiry && (
            <span className="coupon-expiry">
              Expires {formattedExpiry}
            </span>
          )}
        </div>
      </header>

      {/* Hero image section */}
      {displayHeroUrl && (
        <div className="coupon-hero">
          <img 
            src={displayHeroUrl} 
            alt=""
            onError={(e) => {
              // Hide hero image on error
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      {/* Footer with terms */}
      <footer className="coupon-footer">
        <p className="coupon-terms">{terms}</p>
      </footer>

      <style jsx>{`
        .coupon-card {
          background: var(--c-surface);
          border: 1px solid var(--c-border);
          border-radius: 16px;
          color: #fff;
          overflow: hidden;
          display: grid;
          grid-template-rows: auto 1fr auto;
          min-height: 200px;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .coupon-card.clickable {
          cursor: pointer;
        }

        .coupon-card.clickable:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.2);
        }

        .coupon-header {
          display: grid;
          grid-template-columns: 72px 1fr;
          gap: 12px;
          align-items: center;
          padding: 14px 16px;
          background: linear-gradient(135deg, var(--c-primary), var(--c-secondary));
          color: var(--c-textOnPrimary);
        }

        .coupon-logo-container {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .coupon-logo {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.08);
          padding: 4px;
        }

        .coupon-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .coupon-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          line-height: 1.2;
        }

        .coupon-business {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
          font-weight: 500;
        }

        .coupon-expiry {
          margin-top: 6px;
          display: inline-block;
          font-size: 12px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.2);
          font-weight: 500;
        }

        .coupon-hero {
          width: 100%;
          height: 160px;
          overflow: hidden;
        }

        .coupon-hero img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .coupon-footer {
          padding: 12px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--c-surface);
        }

        .coupon-terms {
          margin: 0;
          opacity: 0.92;
          font-size: 13px;
          line-height: 1.4;
          color: #fff;
        }

        /* Print mode styles */
        .coupon-card.print-mode {
          background: #fff;
          color: #000;
          border: 2px solid #000;
          box-shadow: none;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .coupon-card.print-mode .coupon-header {
          background: var(--c-primary);
          color: var(--c-textOnPrimary);
        }

        .coupon-card.print-mode .coupon-footer {
          background: #f8f9fa;
          border-top: 1px solid #dee2e6;
        }

        .coupon-card.print-mode .coupon-terms {
          color: #000;
          opacity: 1;
        }

        /* Responsive design */
        @media (max-width: 640px) {
          .coupon-header {
            grid-template-columns: 60px 1fr;
            gap: 10px;
            padding: 12px 14px;
          }

          .coupon-logo-container {
            width: 48px;
            height: 48px;
          }

          .coupon-title {
            font-size: 16px;
          }

          .coupon-business {
            font-size: 13px;
          }

          .coupon-hero {
            height: 120px;
          }

          .coupon-footer {
            padding: 10px 14px;
          }

          .coupon-terms {
            font-size: 12px;
          }
        }

        /* High contrast mode for accessibility */
        @media (prefers-contrast: high) {
          .coupon-card {
            border-width: 2px;
          }

          .coupon-expiry {
            background: rgba(0, 0, 0, 0.4);
            border: 1px solid currentColor;
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .coupon-card {
            transition: none;
          }

          .coupon-card.clickable:hover {
            transform: none;
          }
        }
      `}</style>
    </article>
  );
}
