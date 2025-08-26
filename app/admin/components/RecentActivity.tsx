'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
}

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentActivity() {
      try {
        // Fetch recent purchases
        const { data: purchases } = await supabase
          .from('purchases')
          .select(`
            id,
            created_at,
            amount_cents,
            quantity,
            coupon_books(title)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Fetch recent redemptions
        const { data: redemptions } = await supabase
          .from('redemptions')
          .select(`
            id,
            created_at,
            status,
            user_coupons(
              offers(title),
              entitlements(
                coupon_books(title)
              )
            )
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        // Combine and format activities
        const formattedActivities: Activity[] = [];

        purchases?.forEach((purchase) => {
          let bookTitle = 'Unknown Book';
          if (purchase.coupon_books) {
            if (Array.isArray(purchase.coupon_books)) {
              bookTitle = purchase.coupon_books[0]?.title || 'Unknown Book';
            } else {
              bookTitle = (purchase.coupon_books as any)?.title || 'Unknown Book';
            }
          }
          
          formattedActivities.push({
            id: purchase.id,
            type: 'purchase',
            description: `New purchase: ${bookTitle} (${purchase.quantity} x $${(purchase.amount_cents / 100).toFixed(2)})`,
            timestamp: purchase.created_at,
          });
        });

        redemptions?.forEach((redemption) => {
          if (redemption.status === 'redeemed') {
            let offerTitle = 'Unknown Offer';
            if (redemption.user_coupons && Array.isArray(redemption.user_coupons)) {
              const userCoupon = redemption.user_coupons[0];
              if (userCoupon?.offers) {
                if (Array.isArray(userCoupon.offers)) {
                  offerTitle = userCoupon.offers[0]?.title || 'Unknown Offer';
                } else {
                  offerTitle = (userCoupon.offers as any)?.title || 'Unknown Offer';
                }
              }
            }
            
            formattedActivities.push({
              id: redemption.id,
              type: 'redemption',
              description: `Coupon redeemed: ${offerTitle}`,
              timestamp: redemption.created_at,
            });
          }
        });

        // Sort by timestamp and take top 5
        const sortedActivities = formattedActivities
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 5);

        setActivities(sortedActivities);
      } catch (error) {
        console.error('Error fetching activity:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentActivity();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded-lg mb-2"></div>
              <div className="h-3 bg-gray-200 rounded-lg w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100 hover:border-gray-200 transition-all duration-200">
              <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                activity.type === 'purchase' ? 'bg-green-500 shadow-lg' : 'bg-blue-500 shadow-lg'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 leading-relaxed">{activity.description}</p>
                <div className="flex items-center mt-2">
                  <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">Activity will appear here as your system grows</p>
          </div>
        )}
      </div>
    </div>
  );
}
