'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <>
      {/* CSS styles from the original coming soon page */}
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1b2c7a, #6b3df0);
          color: white;
          overflow: hidden;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .container {
          text-align: center;
          z-index: 10;
          position: relative;
          max-width: 600px;
          padding: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        h1 {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
          background: linear-gradient(45deg, #fff, #e0e0e0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand {
          font-size: 1.5rem;
          opacity: 0.9;
          margin-bottom: 0.5rem;
          font-weight: 600;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .description {
          font-size: 1.1rem;
          opacity: 0.8;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .contact-info {
          margin-top: 2rem;
          font-size: 0.9rem;
          opacity: 0.8;
          line-height: 1.5;
        }

        .contact-info .email {
          color: #39ff14;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .copyright {
          margin-top: 1rem;
          font-size: 0.8rem;
          opacity: 0.6;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding-top: 1rem;
        }

        .deal {
          position: absolute;
          top: -50px;
          font-weight: bold;
          font-size: 1.4em;
          opacity: 0.9;
          z-index: 1;
          text-shadow: 
              2px 2px 0px rgba(255,255,255,0.8),
              4px 4px 0px rgba(255,255,255,0.6),
              6px 6px 0px rgba(255,255,255,0.4),
              8px 8px 0px rgba(255,255,255,0.2),
              1px 1px 2px rgba(0,0,0,0.8);
          pointer-events: none;
          animation: fall linear forwards;
        }

        @keyframes fall {
          to {
            transform: translateY(110vh) rotate(360deg);
          }
        }

        .admin-access {
          margin-top: 2rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .admin-access:hover {
          opacity: 1;
        }

        .admin-link {
          display: inline-block;
          padding: 8px 16px;
          background: rgba(255, 255, 255, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 8px;
          color: white;
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .admin-link:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .container {
            margin: 20px;
            padding: 30px 20px;
          }
          h1 {
            font-size: 2rem;
          }
          .brand {
            font-size: 1.2rem;
          }
          .description {
            font-size: 1rem;
          }
          .deal {
            font-size: 1.1em;
          }
        }
      `}</style>

      <div className="container">
        <h1>🚧 Coming Soon 🚧</h1>
        <p className="brand">YourCity Deals</p>
        <p className="description">A new kind of deal is about to drop</p>
        
        <div className="contact-info">
          <p>Questions? Contact us at <span className="email">adperry18@gmail.com</span></p>
        </div>
        
        <div className="copyright">
          <p>© 2025 YourCity Deals. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>

        {/* Hidden admin access - only visible on hover */}
        <div className="admin-access">
          <Link href="/admin-login" className="admin-link">
            Admin Access
          </Link>
        </div>
      </div>

      {/* JavaScript for animated deals and admin access */}
      <script dangerouslySetInnerHTML={{
        __html: `
          const colors = ["#39ff14", "#ff4fc3", "#ff9500", "#00ffff", "#ff00ff", "#ffff00", "#ff6b35", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43", "#10ac84", "#ee5a24", "#ff3838", "#ff6348"];
          const texts = [
            "FREE APPETIZER", "BUY 1 GET 1 FREE", "20% OFF ENTIRE BILL", "FREE DESSERT", 
            "HALF OFF PIZZA", "FREE DELIVERY", "$5 OFF $25+", "$10 OFF $50+", 
            "FREE COFFEE", "BUY 2 GET 1 FREE", "FREE CAR WASH", "HALF OFF HAIRCUT", 
            "FREE OIL CHANGE", "BUY 1 GET 1 MOVIE", "FREE POPCORN", "HALF OFF BOWLING", 
            "FREE GAME RENTAL", "BUY 1 GET 1 GOLF", "FREE TEE TIME", "HALF OFF MASSAGE", 
            "FREE FACIAL", "BUY 1 GET 1 MANICURE", "FREE PEDICURE", "HALF OFF SPA", 
            "FREE CONSULTATION", "BUY 1 GET 1 CLEANING", "FREE INSPECTION", "HALF OFF REPAIR", 
            "FREE ESTIMATE", "BUY 1 GET 1 TUTORING", "FREE ASSESSMENT", "HALF OFF LESSON", 
            "FREE TRIAL", "BUY 1 GET 1 FITNESS", "FREE CLASS", "HALF OFF MEMBERSHIP", 
            "FREE EVALUATION", "BUY 1 GET 1 THERAPY", "FREE SESSION", "HALF OFF TREATMENT"
          ];
          
          function createDeal() {
            const deal = document.createElement("div");
            deal.className = "deal";
            deal.innerText = texts[Math.floor(Math.random() * texts.length)];
            
            const x = Math.random() * (window.innerWidth - 100);
            deal.style.left = x + "px";
            deal.style.color = colors[Math.floor(Math.random() * colors.length)];
            deal.style.animationDuration = 6 + Math.random() * 8 + "s"; // Slower fall (6-14 seconds)
            
            document.body.appendChild(deal);
            
            // Remove the deal after animation completes
            setTimeout(() => deal.remove(), 15000); // Longer duration to match slower fall
          }
          
          setInterval(createDeal, 1200); // Less frequent (every 1.2 seconds instead of 0.4)

          // Admin access keyboard shortcut (Ctrl+Shift+A)
          document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
              e.preventDefault();
              window.location.href = '/admin-login';
            }
          });
        `
      }} />
    </>
  );
}
