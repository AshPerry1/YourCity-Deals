'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/app/components/ProtectedRoute';
import { UserRole } from '@/lib/auth';
import BookCover from '@/app/components/books/BookCover';
import CouponCard from '@/app/components/coupons/CouponCard';
import { 
  isValidHexColor, 
  generateColorPalette, 
  formatColorForDisplay,
  generateSignedUploadUrl,
  validateImageDimensions,
  getSchoolColorPreset,
  SCHOOL_COLOR_PRESETS
} from '@/lib/theme';
import Link from 'next/link';

export default function BookBrandingPage({ params }: { params: Promise<{ id: string }> }) {
  const [bookId, setBookId] = useState<string>('');
  const [branding, setBranding] = useState({
    cover_image_url: '',
    theme_primary: '#1b2c7a',
    theme_secondary: '#6b3df0'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookInfo, setBookInfo] = useState({
    title: 'Loading...',
    schoolName: 'Loading...',
    description: ''
  });

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      const resolvedParams = await params;
      setBookId(resolvedParams.id);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock book data
      const mockBook = {
        id: resolvedParams.id,
        title: 'Mountain Brook High School Coupon Book 2025',
        schoolName: 'Mountain Brook High School',
        description: 'Exclusive deals for Mountain Brook students',
        cover_image_url: 'https://via.placeholder.com/400x300/1e3a8a/FFFFFF?text=MBHS',
        theme_primary: '#1e3a8a',
        theme_secondary: '#3b82f6'
      };
      
      setBookInfo({
        title: mockBook.title,
        schoolName: mockBook.schoolName,
        description: mockBook.description
      });
      
      setBranding({
        cover_image_url: mockBook.cover_image_url,
        theme_primary: mockBook.theme_primary,
        theme_secondary: mockBook.theme_secondary
      });
      
      setLoading(false);
    };
    
    loadData();
  }, [params]);

  const handleColorChange = (field: 'theme_primary' | 'theme_secondary', value: string) => {
    setBranding(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleCoverImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, cover_image: 'Please select a valid image file (JPEG, PNG, GIF, WebP)' }));
      return;
    }

    // Validate file size (max 10MB for cover images)
    if (file.size > 10 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, cover_image: 'Image must be smaller than 10MB' }));
      return;
    }

    try {
      // Validate image dimensions
      const dimensions = await validateImageDimensions(file);
      if (dimensions.width < 400 || dimensions.height < 300) {
        setErrors(prev => ({ ...prev, cover_image: 'Image must be at least 400x300 pixels' }));
        return;
      }

      // Generate signed upload URL
      const uploadUrl = await generateSignedUploadUrl('book-covers', file.name);
      
      // In real implementation, upload to the signed URL
      // For demo, simulate upload and use a placeholder
      setBranding(prev => ({ 
        ...prev, 
        cover_image_url: `https://via.placeholder.com/400x300/${branding.theme_primary.replace('#', '')}/FFFFFF?text=${bookInfo.schoolName.split(' ')[0]}`
      }));
      
      setErrors(prev => ({ ...prev, cover_image: '' }));
    } catch (error) {
      setErrors(prev => ({ ...prev, cover_image: 'Error uploading image. Please try again.' }));
    }
  };

  const handleSchoolPreset = (schoolName: string) => {
    const preset = getSchoolColorPreset(schoolName);
    setBranding(prev => ({
      ...prev,
      theme_primary: preset.primary,
      theme_secondary: preset.secondary || preset.primary
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!isValidHexColor(branding.theme_primary)) {
      newErrors.theme_primary = 'Please enter a valid hex color (e.g., #1b2c7a)';
    }

    if (branding.theme_secondary && !isValidHexColor(branding.theme_secondary)) {
      newErrors.theme_secondary = 'Please enter a valid hex color (e.g., #6b3df0)';
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
      console.log('Saving book branding:', branding);
      
      // Show success message
      alert('Book branding updated successfully!');
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: 'Error saving branding. Please try again.' }));
    } finally {
      setSaving(false);
    }
  };

  const colorPalette = generateColorPalette(branding.theme_primary);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book branding...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Book Branding</h1>
              <p className="text-gray-600 mt-2">
                Customize colors and cover for {bookInfo.title}
              </p>
            </div>
            <Link
              href={`/admin/books/${bookId}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Book
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Branding Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Book Theme Settings</h2>
            
            <div className="space-y-6">
              {/* School Color Presets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Color Presets
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(SCHOOL_COLOR_PRESETS).map(([schoolName, colors]) => (
                    <button
                      key={schoolName}
                      onClick={() => handleSchoolPreset(schoolName)}
                      className="flex items-center space-x-2 p-2 rounded border border-gray-200 hover:bg-gray-50 text-left"
                    >
                      <div className="flex space-x-1">
                        <div 
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: colors.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: colors.secondary }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">{schoolName}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Primary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Theme Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.theme_primary}
                    onChange={(e) => handleColorChange('theme_primary', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formatColorForDisplay(branding.theme_primary)}
                    onChange={(e) => handleColorChange('theme_primary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#1b2c7a"
                  />
                </div>
                {errors.theme_primary && (
                  <p className="mt-1 text-sm text-red-600">{errors.theme_primary}</p>
                )}
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secondary Theme Color (Optional)
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={branding.theme_secondary}
                    onChange={(e) => handleColorChange('theme_secondary', e.target.value)}
                    className="w-12 h-12 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formatColorForDisplay(branding.theme_secondary)}
                    onChange={(e) => handleColorChange('theme_secondary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="#6b3df0"
                  />
                </div>
                {errors.theme_secondary && (
                  <p className="mt-1 text-sm text-red-600">{errors.theme_secondary}</p>
                )}
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Cover Image
                </label>
                <div className="space-y-3">
                  {branding.cover_image_url && (
                    <div className="flex items-center space-x-3">
                      <img
                        src={branding.cover_image_url}
                        alt="Current cover"
                        className="w-20 h-15 rounded-lg object-cover border border-gray-300"
                      />
                      <span className="text-sm text-gray-600">Current cover</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {errors.cover_image && (
                    <p className="text-sm text-red-600">{errors.cover_image}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    Recommended: Landscape image, at least 400x300 pixels, max 10MB
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
                      style={{ backgroundColor: branding.theme_primary }}
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
                  {saving ? 'Saving...' : 'Save Book Branding'}
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
              {/* Book Cover Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Book Cover Preview</h3>
                <BookCover
                  title={bookInfo.title}
                  schoolName={bookInfo.schoolName}
                  coverImageUrl={branding.cover_image_url}
                  theme={{
                    primary: branding.theme_primary,
                    secondary: branding.theme_secondary
                  }}
                  className="max-w-sm"
                />
              </div>

              {/* Coupon Preview with Book Theme */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Coupon Preview (Book Theme)</h3>
                <CouponCard
                  businessName="Sample Business"
                  title="Free Coffee with Any Purchase"
                  terms="Valid with any purchase of $5 or more. One per customer. Cannot be combined with other offers."
                  expiresAt="2025-12-31"
                  book={{
                    theme_primary: branding.theme_primary,
                    theme_secondary: branding.theme_secondary
                  }}
                  className="max-w-sm"
                />
              </div>

              {/* Print Preview */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Print Preview</h3>
                <BookCover
                  title={bookInfo.title}
                  schoolName={bookInfo.schoolName}
                  coverImageUrl={branding.cover_image_url}
                  theme={{
                    primary: branding.theme_primary,
                    secondary: branding.theme_secondary
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
