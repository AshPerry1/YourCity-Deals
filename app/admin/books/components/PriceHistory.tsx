'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface PriceChange {
  id: string;
  book_id: string;
  from_cents: number;
  to_cents: number;
  changed_by: string | null;
  changed_at: string;
}

interface PriceHistoryProps {
  bookId: string;
}

export default function PriceHistory({ bookId }: PriceHistoryProps) {
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPriceHistory() {
      try {
        const { data, error } = await supabase
          .from('book_price_changes')
          .select('*')
          .eq('book_id', bookId)
          .order('changed_at', { ascending: false });

        if (error) throw error;
        setPriceChanges(data || []);
      } catch (error) {
        console.error('Error fetching price history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPriceHistory();
  }, [bookId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (priceChanges.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Price History</h3>
        <p className="text-gray-600">No price changes recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Price History</h3>
        <p className="text-sm text-gray-600 mt-1">Track all price changes for this book</p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {priceChanges.map((change) => {
            const fromPrice = change.from_cents / 100;
            const toPrice = change.to_cents / 100;
            const difference = toPrice - fromPrice;
            const isIncrease = difference > 0;
            const isDecrease = difference < 0;
            
            return (
              <div key={change.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    isIncrease ? 'bg-green-500' : 
                    isDecrease ? 'bg-red-500' : 'bg-gray-400'
                  }`}></div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        ${fromPrice.toFixed(2)}
                      </span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                      <span className="font-medium text-gray-900">
                        ${toPrice.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>
                        {isIncrease ? '+' : ''}{difference.toFixed(2)} ({isIncrease ? '+' : ''}{((difference / fromPrice) * 100).toFixed(1)}%)
                      </span>
                      <span>•</span>
                      <span>{new Date(change.changed_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{new Date(change.changed_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    Changed by
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {change.changed_by || 'Unknown user'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
