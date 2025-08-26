'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';
import CouponCard from '@/app/components/coupons/CouponCard';
import { 
  isValidHexColor, 
  generateColorPalette, 
  formatColorForDisplay,
  generateSignedUploadUrl,
  validateImageDimensions 
} from '@/lib/theme';
import Link from 'next/link';

export default function BusinessBrandingPage({ params }: { params: Promise<{ id: string }> }) {
  const [businessId, setBusinessId] = useState<string>('');
  const [branding, setBranding] = useState({
    brand_primary: '#1b2c7a',
    brand_secondary: '#6b3df0',
    logo_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [businessInfo, setBusinessInfo] = useState({
    name: 'Loading...',
    description: ''
  });

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      setBusinessId(resolvedParams.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock business data
      const mockBusiness = {
        id: resolvedParams.id,
        name: 'Coffee Corner',
        description: 'Local coffee shop with great deals',
        brand_primary: '#8B4513',
        brand_secondary: '#D2691E',
        logo_url: 'https://via.placeholder.com/200x200/8B4513/FFFFFF?text=CC'
      };
      
      setBusinessInfo({
        name: mockBusiness.name,
        description: mockBusiness.description
      });
      
      setBranding({
        brand_primary: mockBusiness.brand_primary,
        brand_secondary: mockBusiness.brand_secondary,
        logo_url: mockBusiness.logo_url
      });
      
      setLoading(false);
    };
    
    loadData();
  }, [params]);

  const handleColorChange = (field: 'brand_primary' | 'brand_secondary', value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, logo: 'Please select a valid image file (JPEG, PNG, GIF, WebP)' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, logo: 'Image must be smaller than 5MB' }));
      return;
    }

    try {
      // Validate image dimensions
      const dimensions = await validateImageDimensions(file);
      if (dimensions.width < 100 || dimensions.height < 100) {
        setErrors(prev => ({ ...prev, logo: 'Image must be at least 100x100 pixels' }));
        return;
      }

      // Generate signed upload URL
      const uploadUrl = await generateSignedUploadUrl('brand-logos', file.name);
      
      // In real implementation, upload to the signed URL
      // For demo, simulate upload and use a placeholder
      setBranding(prev => ({ 
        ...prev, 
        logo_url: `https://via.placeholder.com/200x200/${branding.brand_primary.replace('#', '')}/FFFFFF?text=${businessInfo.name.charAt(0)}`
      }));
      
      setErrors(prev => ({ ...prev, logo: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, logo: 'Error uploading image. Please try again.' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isValidHexColor(branding.brand_primary)) {
      newErrors.brand_primary = 'Please enter a valid hex color (e.g., #1b2c7a)';
    }

    if (branding.brand_secondary && !isValidHexColor(branding.brand_secondary)) {
      newErrors.brand_secondary = 'Please enter a valid hex color (e.g., #6b3df0)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real implementation, save to database
      console.log('Saving branding:', branding);
      
      // Show success message
      alert('Branding updated successfully!');
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: 'Error saving branding. Please try again.' }));
    } finally {
      setSaving(false);
    }
  };

  const colorPalette = generateColorPalette(branding.brand_primary);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading business branding...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Branding</h1>
              <p className="text-gray-600 mt-2">
                Customize colors and logo for {businessInfo.name}
              </p>
            </div>
            <Link
              href={`/admin/businesses/${businessId}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Business
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Branding Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Brand Settings</h2>
            
            <div className="space-y-6">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Brand Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.brand_primary}
                    onChange={(e) => handleColorChange('brand_primary', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formatColorForDisplay(branding.brand_primary)}
                    onChange={(e) => handleColorChange('brand_primary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#1b2c7a"
                  />
                </div>
                {errors.brand_primary && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand_primary}</p>
                )}
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Brand Color (Optional)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.brand_secondary}
                    onChange={(e) => handleColorChange('brand_secondary', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formatColorForDisplay(branding.brand_secondary)}
                    onChange={(e) => handleColorChange('brand_secondary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#6b3df0"
                  />
                </div>
                {errors.brand_secondary && (
                  <p className="mt-1 text-sm text-red-600">{errors.brand_secondary}</p>
                )}
              </div>

              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Logo
                </label>
                <div className="space-y-3">
                  {branding.logo_url && (
                    <div className="flex items-center space-x-3">
                      <img
                        src={branding.logo_url}
                        alt="Current logo"
                        className="w-16 h-16 rounded-lg object-cover border border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Current logo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {errors.logo && (
                    <p className="text-sm text-red-600">{errors.logo}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Recommended: Square image, at least 200x200 pixels, max 5MB
                  </p>
                </div>
              </div>

              {/* Color Palette Preview */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color Palette Preview
                </label>
                <div className="flex space-x-2">
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: colorPalette.lighter }}
                    />
                    <span className="text-xs text-gray-500 mt-1">Lighter</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: branding.brand_primary }}
                    />
                    <span className="text-xs text-gray-500 mt-1">Primary</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: colorPalette.darker }}
                    />
                    <span className="text-xs text-gray-500 mt-1">Darker</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div 
                      className="w-8 h-8 rounded border border-gray-300"
                      style={{ backgroundColor: colorPalette.complementary }}
                    />
                    <span className="text-xs text-gray-500 mt-1">Complementary</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Branding'}
                </button>
                {errors.submit && (
                  <p className="mt-2 text-sm text-red-600">{errors.submit}</p>
                )}
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Live Preview</h2>
            
            <div className="space-y-6">
              {/* Coupon Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Coupon Preview</h3>
                <CouponCard
                  businessName={businessInfo.name}
                  logoUrl={branding.logo_url}
                  title="Free Coffee with Any Purchase"
                  terms="Valid with any purchase of $5 or more. One per customer. Cannot be combined with other offers."
                  expiresAt="2025-12-31"
                  business={{
                    brand_primary: branding.brand_primary,
                    brand_secondary: branding.brand_secondary,
                    logo_url: branding.logo_url
                  }}
                  className="max-w-sm"
                />
              </div>

              {/* Print Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Print Preview</h3>
                <CouponCard
                  businessName={businessInfo.name}
                  logoUrl={branding.logo_url}
                  title="Free Coffee with Any Purchase"
                  terms="Valid with any purchase of $5 or more. One per customer. Cannot be combined with other offers."
                  expiresAt="2025-12-31"
                  business={{
                    brand_primary: branding.brand_primary,
                    brand_secondary: branding.brand_secondary,
                    logo_url: branding.logo_url
                  }}
                  isPrintMode={true}
                  className="max-w-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
