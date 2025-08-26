# Responsive Design & PWA Implementation

## Overview

YourCity Deals has been fully optimized for responsive design and Progressive Web App (PWA) functionality. The app automatically adapts to desktop, laptop, tablet, and mobile devices with no user toggle required.

## Breakpoints & Media Queries

### CSS Custom Properties
```css
:root {
  /* Breakpoints */
  --bp-xs: 480px;   /* Small phones */
  --bp-sm: 768px;   /* Phones/tablets portrait */
  --bp-md: 1024px;  /* Tablet landscape / small laptop */
  --bp-lg: 1280px;  /* Desktop */
  --bp-xl: 1536px;  /* Wide desktop */
}
```

### Responsive Grid System
```css
/* Desktop: 12 columns */
.grid-responsive {
  grid-template-columns: repeat(12, minmax(0, 1fr));
}

/* Tablet: 8 columns */
@media (max-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(8, 1fr);
  }
}

/* Mobile: Single column */
@media (max-width: 768px) {
  .grid-responsive {
    grid-template-columns: 1fr;
  }
}
```

### Input Capability Queries
```css
/* Touch devices: bigger hit areas */
@media (pointer: coarse) {
  .btn {
    min-height: 44px;
    padding: 14px 18px;
  }
}

/* Mouse devices: enable hover states */
@media (hover: hover) {
  .btn:hover {
    transform: translateY(-1px);
  }
}
```

## Layout Patterns

### Navigation System
- **Desktop (≥1024px)**: Left sidebar with full navigation
- **Tablet/Mobile (<1024px)**: Bottom tab bar with 3-5 primary sections
- **Mobile**: Sticky bottom navigation with safe area support

### Grid Adaptations
- **Desktop**: Multi-column dashboards (3-4 columns)
- **Tablet**: Two-column cards where possible
- **Mobile**: Single column, no horizontal scroll

### Table Responsiveness
- **Desktop**: Full table layout
- **Mobile**: Stacked cards with key/value pairs
- **Touch-friendly**: Minimum 44px tap targets

## Component-Level Responsiveness

### Admin Dashboard
- **Desktop**: Multi-column stats grid, full sidebar
- **Tablet**: Collapsed sidebar, 2-column stats
- **Mobile**: Bottom nav, single-column cards, CSV exports

### Student Portal
- **Desktop**: Full dashboard with charts
- **Mobile**: Simple stats, prominent "Share Link" button
- **Touch**: Large referral buttons, simplified navigation

### Merchant Console
- **Desktop**: Full analytics, staff management
- **Mobile**: Verify-only interface, full-width scanner
- **Touch**: Large approve buttons, PIN keypad

### Purchaser Portal
- **Desktop**: Multi-tab interface
- **Mobile**: Bottom navigation, coupon grid → stack
- **Touch**: Large redeem buttons, one-handed operation

## Touch-Friendly Design

### Minimum Touch Targets
```css
:root {
  --touch-target: 44px;
}

@media (pointer: coarse) {
  button, .tap {
    min-height: var(--touch-target);
    min-width: var(--touch-target);
  }
}
```

### Gesture Support
- **Swipe**: Horizontal navigation between tabs
- **Pull-to-refresh**: Data refresh on mobile
- **Pinch-to-zoom**: Disabled for app-like experience
- **Long press**: Context menus and actions

### QR Scanner Optimization
- **Full-width**: Camera view scales to screen
- **Portrait/Landscape**: Automatic orientation handling
- **Touch feedback**: Visual confirmation for scans
- **Error handling**: Clear error messages and retry options

## Fluid Typography

### Responsive Font Sizes
```css
h1 {
  font-size: clamp(24px, 3.2vw, 36px);
  line-height: 1.15;
}

h2 {
  font-size: clamp(20px, 2.6vw, 28px);
  line-height: 1.2;
}

p {
  font-size: clamp(14px, 1.8vw, 16px);
  line-height: 1.55;
}
```

### Mobile Readability
- **Increased line-height**: Better readability on small screens
- **Contrast optimization**: Minimum 4.5:1 ratio
- **Font scaling**: Respects user preferences
- **Reduced motion**: Respects accessibility settings

## PWA Features

### Service Worker
```javascript
// Registration
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Caching strategy
- Cache-first for static assets
- Network-first for API calls
- Stale-while-revalidate for dynamic content
```

### Offline Support
- **App shell**: Basic UI available offline
- **Critical routes**: Wallet, verify, dashboard cached
- **Graceful degradation**: Clear offline indicators
- **Background sync**: Queue actions for when online

### Installation
- **Install prompt**: Automatic detection and prompting
- **App icons**: Multiple sizes for all devices
- **Splash screens**: Branded loading experience
- **Shortcuts**: Quick access to key features

### iOS PWA Support
```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="YourCity Deals">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
```

## Performance Optimization

### Loading Performance
- **LCP < 2.5s**: Largest Contentful Paint optimization
- **CLS near zero**: Cumulative Layout Shift prevention
- **Image optimization**: WebP format, lazy loading
- **Code splitting**: Route-based chunking

### Mobile Optimization
- **Reduced bundle size**: Tree shaking and minification
- **Critical CSS**: Inline above-the-fold styles
- **Preload key resources**: Fonts, icons, critical images
- **Service worker caching**: Offline-first approach

### Accessibility

### WCAG Compliance
- **Color contrast**: Minimum 4.5:1 for text
- **Focus indicators**: Clear keyboard navigation
- **Screen reader support**: Proper ARIA labels
- **Semantic HTML**: Proper heading structure

### Touch Accessibility
- **Large touch targets**: Minimum 44px
- **Clear feedback**: Visual and haptic responses
- **Error prevention**: Confirmation dialogs
- **Alternative input**: Voice commands support

## Testing Checklist

### Layout Testing
- [ ] Desktop ≥1280px: Multi-column dashboards render without wrapping
- [ ] Tablet 768–1024px: Sidebars collapse, two-column cards where possible
- [ ] Mobile ≤768px: Single column, no horizontal scroll, buttons ≥44px high

### Input Modality Testing
- [ ] Touch devices: All actions reachable without hover
- [ ] Mouse/keyboard: Hover states present, focus rings visible
- [ ] Voice control: All interactive elements accessible

### Key User Flows
- [ ] Wallet → Redeem: One-handed operation on iPhone
- [ ] Verify: Camera scales to portrait/landscape
- [ ] Student Share: "Share link" visible without scrolling
- [ ] Admin Dashboard: CSV exports instead of table scroll

### Performance Testing
- [ ] LCP < 2.5s on mid-range phone on 4G
- [ ] Images lazy-load, no layout shifts
- [ ] Offline functionality works
- [ ] PWA installation successful

### Accessibility Testing
- [ ] Contrast passes automated testing
- [ ] Screen reader can navigate bottom nav
- [ ] Keyboard navigation works throughout
- [ ] Focus management is logical

## Utility Classes

### Responsive Containers
```css
.container {
  width: min(1200px, 92vw);
  margin-inline: auto;
  padding-inline: var(--space-sm);
}

@media (max-width: 768px) {
  .container {
    width: 100%;
    padding-inline: var(--space-md);
  }
}
```

### Stack Utilities
```css
.stack-xs > * + * { margin-top: var(--space-xs); }
.stack-sm > * + * { margin-top: var(--space-sm); }
.stack-md > * + * { margin-top: var(--space-md); }
.stack-lg > * + * { margin-top: var(--space-lg); }
```

### Responsive Visibility
```css
.hidden-mobile { display: block; }
@media (max-width: 768px) { .hidden-mobile { display: none; } }

.hidden-desktop { display: none; }
@media (max-width: 768px) { .hidden-desktop { display: block; } }
```

## Browser Support

### Core Features
- **Chrome**: Full PWA support
- **Safari**: iOS PWA support
- **Firefox**: Progressive enhancement
- **Edge**: Full PWA support

### Fallbacks
- **No service worker**: Graceful degradation
- **No PWA**: Full web app functionality
- **No touch**: Mouse/keyboard alternatives
- **No modern CSS**: Basic responsive layout

## Future Enhancements

### Advanced PWA Features
- **Background sync**: Offline action queuing
- **Push notifications**: Real-time updates
- **App shortcuts**: Quick actions from home screen
- **File handling**: Import/export functionality

### Performance Improvements
- **WebAssembly**: Heavy computations
- **Web Workers**: Background processing
- **Streaming**: Progressive content loading
- **Compression**: Brotli/Gzip optimization

### Accessibility Enhancements
- **Voice commands**: Natural language interface
- **Gesture recognition**: Advanced touch interactions
- **Haptic feedback**: Tactile responses
- **Adaptive UI**: User preference learning

## Conclusion

The YourCity Deals platform provides a seamless, responsive experience across all devices while maintaining the performance and accessibility standards expected of a modern web application. The PWA implementation ensures users can access the platform offline and install it as a native app on their devices.
