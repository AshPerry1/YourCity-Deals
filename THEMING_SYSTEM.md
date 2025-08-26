# Theming System for Coupons and Coupon Books

## Overview

The YourCity Deals platform now includes a comprehensive theming system that allows businesses and coupon books to have their own branding while maintaining consistent coupon layouts. All coupons use the same structure but can display different colors, logos, and images based on business and book settings.

## Database Schema Updates

### Businesses Table
```sql
-- Add branding fields to businesses table
ALTER TABLE businesses ADD COLUMN brand_primary VARCHAR(7) DEFAULT '#1b2c7a';
ALTER TABLE businesses ADD COLUMN brand_secondary VARCHAR(7);
ALTER TABLE businesses ADD COLUMN logo_url TEXT;

-- Add constraints for hex color validation
ALTER TABLE businesses ADD CONSTRAINT check_brand_primary_hex 
  CHECK (brand_primary ~ '^#[0-9A-Fa-f]{6}$');
ALTER TABLE businesses ADD CONSTRAINT check_brand_secondary_hex 
  CHECK (brand_secondary IS NULL OR brand_secondary ~ '^#[0-9A-Fa-f]{6}$');
```

### Coupon Books Table
```sql
-- Add theming fields to coupon_books table
ALTER TABLE coupon_books ADD COLUMN cover_image_url TEXT;
ALTER TABLE coupon_books ADD COLUMN theme_primary VARCHAR(7) DEFAULT '#1b2c7a';
ALTER TABLE coupon_books ADD COLUMN theme_secondary VARCHAR(7);

-- Add constraints for hex color validation
ALTER TABLE coupon_books ADD CONSTRAINT check_theme_primary_hex 
  CHECK (theme_primary ~ '^#[0-9A-Fa-f]{6}$');
ALTER TABLE coupon_books ADD CONSTRAINT check_theme_secondary_hex 
  CHECK (theme_secondary IS NULL OR theme_secondary ~ '^#[0-9A-Fa-f]{6}$');
```

### Offers Table (Optional)
```sql
-- Add hero image field to offers table
ALTER TABLE offers ADD COLUMN hero_image_url TEXT;
```

## Storage Buckets

Create public-read buckets for image storage:

```sql
-- Brand logos bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('brand-logos', 'brand-logos', true);

-- Book covers bucket  
INSERT INTO storage.buckets (id, name, public) 
VALUES ('book-covers', 'book-covers', true);

-- Offer images bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('offer-images', 'offer-images', true);
```

## Theme Resolution Logic

### Color Priority Order
1. **Business branding** (highest priority)
2. **Book theme** (fallback)
3. **Global defaults** (lowest priority)

### Image Priority Order
1. **Offer hero image** (if present)
2. **Business logo** (fallback)
3. **No image** (if neither present)

## Components

### CouponCard Component
```typescript
// Reusable coupon component with consistent layout
<CouponCard
  businessName="Coffee Corner"
  logoUrl="https://example.com/logo.png"
  title="Free Coffee with Any Purchase"
  terms="Valid with any purchase of $5 or more"
  expiresAt="2025-12-31"
  heroImageUrl="https://example.com/hero.jpg"
  business={{
    brand_primary: '#8B4513',
    brand_secondary: '#D2691E',
    logo_url: 'https://example.com/logo.png'
  }}
  book={{
    theme_primary: '#1e3a8a',
    theme_secondary: '#3b82f6'
  }}
/>
```

### BookCover Component
```typescript
// Book cover component with school theming
<BookCover
  title="Mountain Brook High School Coupon Book 2025"
  schoolName="Mountain Brook High School"
  coverImageUrl="https://example.com/cover.jpg"
  theme={{
    primary: '#1e3a8a',
    secondary: '#3b82f6'
  }}
/>
```

## Admin Interfaces

### Business Branding (`/admin/businesses/[id]/branding`)
- Color pickers for primary and secondary brand colors
- Logo upload with validation
- Live preview of coupons with applied branding
- Color palette generation
- Print-friendly preview

### Book Branding (`/admin/books/[id]/branding`)
- School color presets for quick selection
- Custom theme color pickers
- Cover image upload
- Live preview of book cover and coupons
- Print-friendly preview

## Theme System Features

### Color Management
- **Hex Color Validation**: Ensures valid hex color format (#RRGGBB)
- **Color Palette Generation**: Automatically generates lighter, darker, and complementary colors
- **Contrast Calculation**: Automatically determines text color for readability
- **School Color Presets**: Pre-defined color schemes for common schools

### Image Management
- **File Type Validation**: Accepts JPEG, PNG, GIF, WebP, SVG
- **Size Limits**: 5MB for logos, 10MB for cover images
- **Dimension Validation**: Minimum size requirements for quality
- **Signed Upload URLs**: Secure upload process
- **Error Handling**: Graceful fallbacks for missing images

### Accessibility Features
- **High Contrast Mode**: Enhanced borders and text shadows
- **Reduced Motion**: Disabled animations for users with motion sensitivity
- **Screen Reader Support**: Proper alt text and semantic HTML
- **Keyboard Navigation**: Full keyboard accessibility

### Print Optimization
- **Print Mode**: Higher contrast, simplified gradients
- **Page Break Control**: Prevents awkward breaks
- **Color Optimization**: Ensures readability when printed

## Usage Examples

### Setting Business Branding
```typescript
// Admin sets business branding
const businessBranding = {
  brand_primary: '#8B4513',    // Coffee brown
  brand_secondary: '#D2691E',  // Orange accent
  logo_url: 'https://storage.example.com/brand-logos/coffee-corner-logo.png'
};
```

### Setting Book Theme
```typescript
// Admin sets book theme with school colors
const bookTheme = {
  theme_primary: '#1e3a8a',    // Mountain Brook blue
  theme_secondary: '#3b82f6',  // Light blue accent
  cover_image_url: 'https://storage.example.com/book-covers/mbhs-2025.jpg'
};
```

### Theme Resolution
```typescript
// System resolves theme automatically
const resolvedTheme = resolveTheme(businessBranding, bookTheme);
// Result: Uses business colors (higher priority)
// {
//   primary: '#8B4513',
//   secondary: '#D2691E',
//   textOnPrimary: '#ffffff',
//   surface: '#121428',
//   border: 'rgba(255,255,255,.12)'
// }
```

## Security Considerations

### Image Upload Security
- **Signed URLs**: Temporary upload URLs with expiration
- **File Validation**: Server-side validation of file types and content
- **Size Limits**: Prevents abuse and ensures performance
- **Virus Scanning**: Scan uploaded files for malware

### Access Control
- **Admin Only**: Only admin users can modify branding
- **RLS Policies**: Database-level access control
- **Audit Logging**: Track all branding changes

### Data Validation
- **Hex Color Validation**: Ensure valid color format
- **URL Validation**: Validate image URLs
- **Input Sanitization**: Prevent XSS attacks

## Performance Optimization

### Image Optimization
- **Automatic Resizing**: Generate multiple sizes for different use cases
- **Format Conversion**: Convert to WebP for better compression
- **Lazy Loading**: Load images only when needed
- **CDN Integration**: Serve images from global CDN

### Caching Strategy
- **Theme Caching**: Cache resolved themes to avoid recalculation
- **Image Caching**: Cache processed images
- **CSS Variables**: Use CSS custom properties for dynamic theming

## Testing Checklist

### Visual Testing
- [ ] Coupons display correctly with business branding
- [ ] Coupons fall back to book theme when business branding is missing
- [ ] Coupons use global defaults when no custom branding is set
- [ ] Print mode provides adequate contrast
- [ ] Responsive design works on all screen sizes

### Functional Testing
- [ ] Color pickers work correctly
- [ ] Image uploads validate properly
- [ ] Theme resolution follows priority order
- [ ] Error handling works for missing images
- [ ] Accessibility features function correctly

### Security Testing
- [ ] File upload validation prevents malicious files
- [ ] Access control prevents unauthorized branding changes
- [ ] Input validation prevents injection attacks
- [ ] Signed URLs expire correctly

## Future Enhancements

### Advanced Features
- **Color Palette Import**: Import colors from brand guidelines
- **Template System**: Pre-built coupon templates
- **A/B Testing**: Test different color schemes
- **Analytics**: Track which colors perform better

### Integration Features
- **Brand Guidelines API**: Import from brand management systems
- **Design Tool Integration**: Connect with Figma, Sketch, etc.
- **Social Media Integration**: Generate social media assets
- **Print Service Integration**: Direct integration with print services

## Conclusion

The theming system provides a flexible, secure, and user-friendly way to customize coupon and book branding while maintaining consistency across the platform. The system is designed to be scalable, accessible, and performant, with comprehensive admin tools for easy management.
