'use client';

import { useState, useEffect } from 'react';

interface CouponOffer {
  id: string;
  title: string;
  business: string;
  businessAddress: string;
  businessCoordinates: {
    lat: number;
    lng: number;
  };
  discount: string;
  category: string;
  description: string;
  validFrom: string;
  validTo: string;
  distance?: number;
}

interface NotificationPreference {
  couponId: string;
  enabled: boolean;
  reminderTypes: {
    location: boolean;
    time: boolean;
    expiration: boolean;
    custom: boolean;
  };
  customReminders: {
    daysBeforeExpiry: number;
    timeOfDay: string;
    locationRadius: number;
  };
}

interface NotificationPreferencesProps {
  couponBookId: string;
  offers: CouponOffer[];
  onPreferencesChange: (preferences: NotificationPreference[]) => void;
}

export default function NotificationPreferences({ 
  couponBookId, 
  offers, 
  onPreferencesChange 
}: NotificationPreferencesProps) {
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'requesting'>('requesting');
  const [expandedCoupon, setExpandedCoupon] = useState<string | null>(null);

  useEffect(() => {
    initializePreferences();
    requestLocationPermission();
  }, [offers]);

  const initializePreferences = () => {
    const initialPrefs = offers.map(offer => ({
      couponId: offer.id,
      enabled: false,
      reminderTypes: {
        location: false,
        time: false,
        expiration: false,
        custom: false,
      },
      customReminders: {
        daysBeforeExpiry: 7,
        timeOfDay: '18:00',
        locationRadius: 5, // miles
      }
    }));
    setPreferences(initialPrefs);
  };

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      return;
    }

    try {
      setLocationPermission('requesting');
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        });
      });

      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
      setLocationPermission('granted');
      
      // Calculate distances for all offers
      calculateDistances(position.coords);
    } catch (error) {
      console.error('Location permission denied:', error);
      setLocationPermission('denied');
    }
  };

  const calculateDistances = (userCoords: GeolocationCoordinates) => {
    const offersWithDistance = offers.map(offer => ({
      ...offer,
      distance: calculateDistance(
        userCoords.latitude,
        userCoords.longitude,
        offer.businessCoordinates.lat,
        offer.businessCoordinates.lng
      )
    }));
    
    // Update offers with distance information
    // This would typically update the parent component's state
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const updatePreference = (couponId: string, updates: Partial<NotificationPreference>) => {
    const updatedPrefs = preferences.map(pref => 
      pref.couponId === couponId ? { ...pref, ...updates } : pref
    );
    setPreferences(updatedPrefs);
    onPreferencesChange(updatedPrefs);
  };

  const toggleCouponExpanded = (couponId: string) => {
    setExpandedCoupon(expandedCoupon === couponId ? null : couponId);
  };

  const getLocationStatusIcon = () => {
    switch (locationPermission) {
      case 'granted':
        return (
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'denied':
        return (
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
        <div className="flex items-center space-x-2">
          {getLocationStatusIcon()}
          <span className="text-sm text-gray-600">
            {locationPermission === 'granted' ? 'Location enabled' : 
             locationPermission === 'denied' ? 'Location disabled' : 'Requesting location...'}
          </span>
        </div>
      </div>

      {locationPermission === 'denied' && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-sm text-yellow-800">
              Enable location services to get proximity-based reminders for your coupons
            </span>
          </div>
          <button
            onClick={requestLocationPermission}
            className="mt-2 text-sm text-yellow-700 underline hover:text-yellow-800"
          >
            Try again
          </button>
        </div>
      )}

      <div className="space-y-4">
        {offers.map((offer) => {
          const preference = preferences.find(p => p.couponId === offer.id);
          if (!preference) return null;

          return (
            <div key={offer.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={preference.enabled}
                      onChange={(e) => updatePreference(offer.id, { enabled: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{offer.title}</h4>
                      <p className="text-xs text-gray-500">{offer.business}</p>
                      {offer.distance && (
                        <p className="text-xs text-blue-600">{offer.distance.toFixed(1)} miles away</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleCouponExpanded(offer.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className={`w-5 h-5 transform transition-transform ${expandedCoupon === offer.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {expandedCoupon === offer.id && preference.enabled && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Reminder Types</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={preference.reminderTypes.location}
                          onChange={(e) => updatePreference(offer.id, {
                            reminderTypes: { ...preference.reminderTypes, location: e.target.checked }
                          })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Location-based</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={preference.reminderTypes.time}
                          onChange={(e) => updatePreference(offer.id, {
                            reminderTypes: { ...preference.reminderTypes, time: e.target.checked }
                          })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Time-based</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={preference.reminderTypes.expiration}
                          onChange={(e) => updatePreference(offer.id, {
                            reminderTypes: { ...preference.reminderTypes, expiration: e.target.checked }
                          })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Expiration</span>
                      </label>
                      
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={preference.reminderTypes.custom}
                          onChange={(e) => updatePreference(offer.id, {
                            reminderTypes: { ...preference.reminderTypes, custom: e.target.checked }
                          })}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">Custom</span>
                      </label>
                    </div>
                  </div>

                  {preference.reminderTypes.custom && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Days before expiry
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={preference.customReminders.daysBeforeExpiry}
                          onChange={(e) => updatePreference(offer.id, {
                            customReminders: { 
                              ...preference.customReminders, 
                              daysBeforeExpiry: parseInt(e.target.value) 
                            }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Time of day
                        </label>
                        <input
                          type="time"
                          value={preference.customReminders.timeOfDay}
                          onChange={(e) => updatePreference(offer.id, {
                            customReminders: { 
                              ...preference.customReminders, 
                              timeOfDay: e.target.value 
                            }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Location radius (miles)
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="25"
                          step="0.5"
                          value={preference.customReminders.locationRadius}
                          onChange={(e) => updatePreference(offer.id, {
                            customReminders: { 
                              ...preference.customReminders, 
                              locationRadius: parseFloat(e.target.value) 
                            }
                          })}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {preferences.filter(p => p.enabled).length} of {offers.length} coupons enabled for notifications
          </span>
          <button
            onClick={() => {
              const allEnabled = preferences.map(p => ({ ...p, enabled: true }));
              setPreferences(allEnabled);
              onPreferencesChange(allEnabled);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Enable All
          </button>
        </div>
      </div>
    </div>
  );
}
