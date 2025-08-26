'use client';

import { generateThemeCSSVariables, getImageUrl } from '@/lib/theme';

export interface BookCoverProps {
  title: string;
  schoolName: string;
  coverImageUrl?: string;
  theme: {
    primary: string;
    secondary?: string;
  };
  className?: string;
  onClick?: () => void;
  isPrintMode?: boolean;
}

export default function BookCover({
  title,
  schoolName,
  coverImageUrl,
  theme,
  className = '',
  onClick,
  isPrintMode = false
}: BookCoverProps) {
  const cssVariables = generateThemeCSSVariables(theme);
  
  return (
    <div 
      style={cssVariables}
      className={`book-cover ${isPrintMode ? 'print-mode' : ''} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {/* Background gradient */}
      <div className="book-bg" />
      
      {/* Content overlay */}
      <div className="book-content">
        <h2 className="book-title">{title}</h2>
        <p className="book-school">{schoolName}</p>
      </div>
      
      {/* Cover image */}
      {coverImageUrl && (
        <div className="book-image-container">
          <img 
            className="book-image" 
            src={coverImageUrl} 
            alt=""
            onError={(e) => {
              // Hide image on error
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}

      <style jsx>{`
        .book-cover {
          position: relative;
          width: 100%;
          height: 300px;
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }

        .book-cover.clickable {
          cursor: pointer;
        }

        .book-cover.clickable:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        }

        .book-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, var(--c-primary), var(--c-secondary));
          z-index: 1;
        }

        .book-content {
          position: relative;
          z-index: 3;
          text-align: center;
          color: var(--c-textOnPrimary);
          padding: 40px 20px;
          max-width: 80%;
        }

        .book-title {
          margin: 0 0 12px 0;
          font-size: 32px;
          font-weight: 700;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .book-school {
          margin: 0;
          font-size: 18px;
          font-weight: 500;
          opacity: 0.9;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .book-image-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .book-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          opacity: 0.3;
          mix-blend-mode: overlay;
        }

        /* Print mode styles */
        .book-cover.print-mode {
          background: #fff;
          border: 2px solid #000;
          box-shadow: none;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .book-cover.print-mode .book-bg {
          background: var(--c-primary);
        }

        .book-cover.print-mode .book-content {
          color: var(--c-textOnPrimary);
        }

        .book-cover.print-mode .book-image {
          opacity: 0.2;
          mix-blend-mode: multiply;
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .book-cover {
            height: 250px;
            border-radius: 16px;
          }

          .book-title {
            font-size: 28px;
          }

          .book-school {
            font-size: 16px;
          }

          .book-content {
            padding: 30px 16px;
          }
        }

        @media (max-width: 640px) {
          .book-cover {
            height: 200px;
            border-radius: 12px;
          }

          .book-title {
            font-size: 24px;
          }

          .book-school {
            font-size: 14px;
          }

          .book-content {
            padding: 20px 12px;
          }
        }

        /* High contrast mode for accessibility */
        @media (prefers-contrast: high) {
          .book-cover {
            border: 2px solid currentColor;
          }

          .book-title {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          }

          .book-school {
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          }
        }

        /* Reduced motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          .book-cover {
            transition: none;
          }

          .book-cover.clickable:hover {
            transform: none;
          }
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
          .book-cover {
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
          }

          .book-cover.clickable:hover {
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
          }
        }
      `}</style>
    </div>
  );
}
