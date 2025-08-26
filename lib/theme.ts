// Theme system for coupons and coupon books
export interface ThemeColors {
  primary: string;
  secondary?: string;
  textOnPrimary?: string;
  surface?: string;
  border?: string;
}

export interface BusinessBranding {
  brand_primary: string;
  brand_secondary?: string;
  logo_url?: string;
}

export interface BookBranding {
  cover_image_url?: string;
  theme_primary: string;
  theme_secondary?: string;
}

export interface OfferMedia {
  hero_image_url?: string;
}

// Default theme colors
export const DEFAULT_THEME: ThemeColors = {
  primary: '#1b2c7a',
  secondary: '#6b3df0',
  textOnPrimary: '#ffffff',
  surface: '#121428',
  border: 'rgba(255,255,255,.12)',
};

// School color presets
export const SCHOOL_COLOR_PRESETS = {
  'Mountain Brook': { primary: '#1e3a8a', secondary: '#3b82f6' },
  'Vestavia Hills': { primary: '#059669', secondary: '#10b981' },
  'Homewood': { primary: '#7c2d12', secondary: '#ea580c' },
  'Oak Mountain': { primary: '#1e40af', secondary: '#3b82f6' },
  'Hoover': { primary: '#7c3aed', secondary: '#8b5cf6' },
  'Default': { primary: '#1b2c7a', secondary: '#6b3df0' },
};

/**
 * Resolve theme colors in order: business → book → defaults
 */
export function resolveTheme(business?: BusinessBranding, book?: BookBranding): ThemeColors {
  const theme: ThemeColors = { ...DEFAULT_THEME };
  
  // Apply book theme first (base)
  if (book?.theme_primary) {
    theme.primary = book.theme_primary;
  }
  if (book?.theme_secondary) {
    theme.secondary = book.theme_secondary;
  }
  
  // Apply business branding (overrides book)
  if (business?.brand_primary) {
    theme.primary = business.brand_primary;
  }
  if (business?.brand_secondary) {
    theme.secondary = business.brand_secondary;
  }
  
  return theme;
}

/**
 * Validate hex color format
 */
export function isValidHexColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexRegex.test(color);
}

/**
 * Generate contrasting text color for a background
 */
export function getContrastTextColor(backgroundColor: string): string {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black or white based on luminance
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

/**
 * Generate CSS variables object for theme
 */
export function generateThemeCSSVariables(theme: ThemeColors): Record<string, string> {
  return {
    '--c-primary': theme.primary,
    '--c-secondary': theme.secondary || theme.primary,
    '--c-textOnPrimary': theme.textOnPrimary || getContrastTextColor(theme.primary),
    '--c-surface': theme.surface || '#121428',
    '--c-border': theme.border || 'rgba(255,255,255,.12)',
  };
}

/**
 * Get school color preset
 */
export function getSchoolColorPreset(schoolName: string): ThemeColors {
  const preset = SCHOOL_COLOR_PRESETS[schoolName as keyof typeof SCHOOL_COLOR_PRESETS];
  if (preset) {
    return {
      ...DEFAULT_THEME,
      primary: preset.primary,
      secondary: preset.secondary,
      textOnPrimary: getContrastTextColor(preset.primary),
    };
  }
  return DEFAULT_THEME;
}

/**
 * Validate image URL format
 */
export function isValidImageUrl(url?: string): boolean {
  if (!url) return true; // Optional field
  const imageRegex = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
  return imageRegex.test(url) || url.startsWith('data:image/');
}

/**
 * Get image dimensions for validation
 */
export function validateImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error('Invalid image file'));
    };
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate signed upload URL for images
 */
export async function generateSignedUploadUrl(bucket: string, fileName: string): Promise<string> {
  // In real implementation, this would call your backend to generate a signed URL
  // For demo purposes, return a mock URL
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 15);
  return `https://yourcitydeals.com/api/upload/${bucket}/${timestamp}-${randomId}-${fileName}`;
}

/**
 * Get image URL with fallback
 */
export function getImageUrl(primaryUrl?: string, fallbackUrl?: string): string | undefined {
  return primaryUrl || fallbackUrl;
}

/**
 * Format color for display
 */
export function formatColorForDisplay(color: string): string {
  return color.toUpperCase();
}

/**
 * Generate color palette from primary color
 */
export function generateColorPalette(primaryColor: string): {
  lighter: string;
  darker: string;
  complementary: string;
} {
  // Simple color manipulation for demo
  // In real implementation, use a proper color library
  const hex = primaryColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  const lighter = `#${Math.min(255, r + 40).toString(16).padStart(2, '0')}${Math.min(255, g + 40).toString(16).padStart(2, '0')}${Math.min(255, b + 40).toString(16).padStart(2, '0')}`;
  const darker = `#${Math.max(0, r - 40).toString(16).padStart(2, '0')}${Math.max(0, g - 40).toString(16).padStart(2, '0')}${Math.max(0, b - 40).toString(16).padStart(2, '0')}`;
  const complementary = `#${(255 - r).toString(16).padStart(2, '0')}${(255 - g).toString(16).padStart(2, '0')}${(255 - b).toString(16).padStart(2, '0')}`;
  
  return { lighter, darker, complementary };
}
