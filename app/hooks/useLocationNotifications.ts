'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface Location {
  lat: number;
  lng: number;
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

interface BusinessLocation {
  id: string;
  name: string;
  coordinates: Location;
  address: string;
}

interface useLocationNotificationsReturn {
  userLocation: Location | null;
  locationPermission: 'granted' | 'denied' | 'requesting';
  nearbyBusinesses: BusinessLocation[];
  notificationPreferences: NotificationPreference[];
  isTracking: boolean;
  requestLocationPermission: () => Promise<void>;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
  updateNotificationPreference: (couponId: string, updates: Partial<NotificationPreference>) => void;
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
  sendNotification: (title: string, options?: NotificationOptions) => void;
}

export function useLocationNotifications(): useLocationNotificationsReturn {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'requesting'>('requesting');
  const [nearbyBusinesses, setNearbyBusinesses] = useState<BusinessLocation[]>([]);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  
  const watchIdRef = useRef<number | null>(null);
  const notificationCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }, []);

  // Request location permission
  const requestLocationPermission = useCallback(async (): Promise<void> => {
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

      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      setUserLocation(newLocation);
      setLocationPermission('granted');

      // Find nearby businesses
      findNearbyBusinesses(newLocation);
    } catch (error) {
      console.error('Location permission denied:', error);
      setLocationPermission('denied');
    }
  }, []);

  // Find nearby businesses based on user location
  const findNearbyBusinesses = useCallback((location: Location) => {
    // Mock business data - in a real app, this would come from an API
    const mockBusinesses: BusinessLocation[] = [
      {
        id: '1',
        name: 'Pizza Palace',
        coordinates: { lat: location.lat + 0.01, lng: location.lng + 0.01 },
        address: '123 Main St, City, State'
      },
      {
        id: '2',
        name: 'Coffee Corner',
        coordinates: { lat: location.lat - 0.005, lng: location.lng + 0.008 },
        address: '456 Oak Ave, City, State'
      },
      {
        id: '3',
        name: 'Auto Service Center',
        coordinates: { lat: location.lat + 0.008, lng: location.lng - 0.003 },
        address: '789 Pine Rd, City, State'
      }
    ];

    // Calculate distances and filter by radius
    const businessesWithDistance = mockBusinesses
      .map(business => ({
        ...business,
        distance: calculateDistance(
          location.lat,
          location.lng,
          business.coordinates.lat,
          business.coordinates.lng
        )
      }))
      .filter(business => business.distance <= 10); // Within 10 miles

    setNearbyBusinesses(businessesWithDistance);
  }, [calculateDistance]);

  // Start continuous location tracking
  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation || locationPermission !== 'granted') {
      return;
    }

    setIsTracking(true);
    
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        setUserLocation(newLocation);
        findNearbyBusinesses(newLocation);
        
        // Check for location-based notifications
        checkLocationNotifications(newLocation);
      },
      (error) => {
        console.error('Location tracking error:', error);
        setIsTracking(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000 // Update every 30 seconds
      }
    );

    // Set up periodic notification checks
    notificationCheckIntervalRef.current = setInterval(() => {
      if (userLocation) {
        checkLocationNotifications(userLocation);
      }
    }, 60000); // Check every minute
  }, [locationPermission, findNearbyBusinesses, userLocation]);

  // Stop location tracking
  const stopLocationTracking = useCallback(() => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    
    if (notificationCheckIntervalRef.current) {
      clearInterval(notificationCheckIntervalRef.current);
      notificationCheckIntervalRef.current = null;
    }
    
    setIsTracking(false);
  }, []);

  // Check for location-based notifications
  const checkLocationNotifications = useCallback((location: Location) => {
    if (!notificationPreferences.length) return;

    const enabledPreferences = notificationPreferences.filter(pref => 
      pref.enabled && pref.reminderTypes.location
    );

    enabledPreferences.forEach(pref => {
      // Find the business for this coupon
      const business = nearbyBusinesses.find(b => b.id === pref.couponId);
      if (!business) return;

      const distance = calculateDistance(
        location.lat,
        location.lng,
        business.coordinates.lat,
        business.coordinates.lng
      );

      // Send notification if user is within the specified radius
      if (distance <= pref.customReminders.locationRadius) {
        sendNotification(
          'Deal Nearby!',
          {
            body: `You're near ${business.name}! Don't forget to use your coupon.`,
            icon: '/favicon.ico',
            tag: `location-${pref.couponId}`,
            requireInteraction: false
          }
        );
      }
    });
  }, [notificationPreferences, nearbyBusinesses, calculateDistance]);

  // Update notification preferences
  const updateNotificationPreference = useCallback((couponId: string, updates: Partial<NotificationPreference>) => {
    setNotificationPreferences(prev => 
      prev.map(pref => 
        pref.couponId === couponId 
          ? { ...pref, ...updates }
          : pref
      )
    );
  }, []);

  // Send browser notification
  const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification(title, options);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, options);
        }
      });
    }
  }, []);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocationTracking();
    };
  }, [stopLocationTracking]);

  // Load notification preferences from localStorage on mount
  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem('notificationPreferences');
      if (savedPreferences) {
        setNotificationPreferences(JSON.parse(savedPreferences));
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
    }
  }, []);

  // Save notification preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('notificationPreferences', JSON.stringify(notificationPreferences));
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  }, [notificationPreferences]);

  return {
    userLocation,
    locationPermission,
    nearbyBusinesses,
    notificationPreferences,
    isTracking,
    requestLocationPermission,
    startLocationTracking,
    stopLocationTracking,
    updateNotificationPreference,
    calculateDistance,
    sendNotification
  };
}
