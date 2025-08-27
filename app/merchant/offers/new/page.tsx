'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseClient';
import ApprovalModeBanner from '../../components/ApprovalModeBanner';

interface Business {
  id: string;
  name: string;
  approval_mode: 'manual' | 'self_serve';
}

interface OfferForm {
  title: string;
  description: string;
  discount_amount: string;
  discount_type: 'percentage' | 'fixed';
  terms_conditions: string;
  start_date: string;
  end_date: string;
  max_redemptions: string;
  category: string;
}

export default function CreateOfferPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [business, setBusiness] = useState<Business | null>(null);
  const [form, setForm] = useState<OfferForm>({
    title: '',
    description: '',
    discount_amount: '',
    discount_type: 'percentage',
    terms_conditions: '',
    start_date: '',
    end_date: '',
    max_redemptions: '',
    category: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();

      if (profileError || !userProfile?.business_id) {
        setError('No business associated with this account');
        return;
      }

      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .select('id, name, approval_mode')
        .eq('id', userProfile.business_id)
        .single();

      if (businessError) throw businessError;
      setBusiness(businessData);
    } catch (err) {
      console.error('Error fetching business data:', err);
      setError('Failed to load business data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;

    setSubmitting(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: userProfile } = await supabase
        .from('user_profiles')
        .select('business_id')
        .eq('id', user.id)
        .single();

      // Create the offer
      const { data: offer, error: offerError } = await supabase
        .from('offers')
        .insert({
          merchant_id: userProfile.business_id,
          title: form.title,
          description: form.description,
          discount_amount: parseFloat(form.discount_amount),
          discount_type: form.discount_type,
          terms_conditions: form.terms_conditions,
          start_date: form.start_date,
          end_date: form.end_date,
          max_redemptions: form.max_redemptions ? parseInt(form.max_redemptions) : null,
          category: form.category,
          status: business.approval_mode === 'self_serve' ? 'approved' : 'pending_review',
          created_by: user.id
        })
        .select()
        .single();

      if (offerError) throw offerError;

      // If self-serve mode, auto-approve
      if (business.approval_mode === 'self_serve') {
        await supabase.rpc('submit_offer_for_approval', {
          p_offer_id: offer.id
        });
      }

      router.push(`/merchant/offers/${offer.id}`);
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Failed to create offer. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof OfferForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const isManualMode = business?.approval_mode === 'manual';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load page'}</p>
          <button
            onClick={() => router.push('/merchant/dashboard')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Approval Mode Banner */}
      <ApprovalModeBanner businessId={business.id} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Offer</h1>
              <p className="mt-2 text-gray-600">
                Add a new coupon or discount for your customers
              </p>
            </div>
            <button
              onClick={() => router.push('/merchant/offers')}
              className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Approval Mode Notice */}
        <div className={`mb-6 p-4 rounded-lg ${
          isManualMode 
            ? 'bg-yellow-50 border border-yellow-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center">
            <div className={`flex-shrink-0 ${
              isManualMode ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {isManualMode ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                isManualMode ? 'text-yellow-800' : 'text-green-800'
              }`}>
                {isManualMode ? 'Manual Mode Active' : 'Self-Serve Mode Active'}
              </h3>
              <p className={`text-sm ${
                isManualMode ? 'text-yellow-700' : 'text-green-700'
              }`}>
                {isManualMode 
                  ? 'This offer will be submitted for admin review before going live.'
                  : 'This offer will be published immediately without admin review.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Offer Title *
              </label>
              <input
                type="text"
                id="title"
                required
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="e.g., 20% Off All Items"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                required
                rows={3}
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Describe your offer in detail..."
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                required
                value={form.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="">Select a category</option>
                <option value="food">Food & Dining</option>
                <option value="retail">Retail & Shopping</option>
                <option value="entertainment">Entertainment</option>
                <option value="services">Services</option>
                <option value="health">Health & Fitness</option>
                <option value="beauty">Beauty & Spa</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Discount Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Discount Details</h3>
            </div>

            <div>
              <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 mb-2">
                Discount Type *
              </label>
              <select
                id="discount_type"
                required
                value={form.discount_type}
                onChange={(e) => handleInputChange('discount_type', e.target.value as 'percentage' | 'fixed')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label htmlFor="discount_amount" className="block text-sm font-medium text-gray-700 mb-2">
                Discount Amount *
              </label>
              <input
                type="number"
                id="discount_amount"
                required
                min="0"
                step={form.discount_type === 'percentage' ? '1' : '0.01'}
                value={form.discount_amount}
                onChange={(e) => handleInputChange('discount_amount', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder={form.discount_type === 'percentage' ? '20' : '10.00'}
              />
            </div>

            {/* Dates */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Validity Period</h3>
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                required
                value={form.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                id="end_date"
                required
                value={form.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>

            <div>
              <label htmlFor="max_redemptions" className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Redemptions
              </label>
              <input
                type="number"
                id="max_redemptions"
                min="1"
                value={form.max_redemptions}
                onChange={(e) => handleInputChange('max_redemptions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Leave blank for unlimited"
              />
            </div>

            {/* Terms */}
            <div className="md:col-span-2">
              <label htmlFor="terms_conditions" className="block text-sm font-medium text-gray-700 mb-2">
                Terms & Conditions
              </label>
              <textarea
                id="terms_conditions"
                rows={4}
                value={form.terms_conditions}
                onChange={(e) => handleInputChange('terms_conditions', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Any special terms or conditions for this offer..."
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {isManualMode 
                ? 'This offer will be submitted for review'
                : 'This offer will be published immediately'
              }
            </div>
            <button
              type="submit"
              disabled={submitting}
              className={`px-6 py-3 rounded-lg font-medium text-white ${
                isManualMode 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'bg-green-600 hover:bg-green-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {submitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isManualMode ? 'Submitting for Review...' : 'Publishing...'}
                </div>
              ) : (
                isManualMode ? 'Submit for Review' : 'Publish Offer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
