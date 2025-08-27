import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import { WalletDeal, UserWalletData, getNearbyLocations, formatDealForWallet, getUserDisplayName } from './wallet';

export interface GoogleWalletConfig {
  issuerId: string;
  classId: string;
  objectIdPrefix: string;
}

const DEFAULT_WALLET_CONFIG: GoogleWalletConfig = {
  issuerId: process.env.GW_ISSUER_ID || '',
  classId: 'yourcity_deals_card',
  objectIdPrefix: 'yourcity_deals'
};

// Initialize Google Wallet API
const walletApi = google.walletobjects('v1');

// Create JWT client for Google Wallet API
function createJwtClient() {
  const serviceAccount = JSON.parse(process.env.GW_SERVICE_ACCOUNT_JSON || '{}');
  
  return new google.auth.JWT(
    serviceAccount.client_email,
    undefined,
    serviceAccount.private_key,
    ['https://www.googleapis.com/auth/wallet_object.issuer']
  );
}

export async function createGoogleWalletClass(config: Partial<GoogleWalletConfig> = {}): Promise<string> {
  const walletConfig = { ...DEFAULT_WALLET_CONFIG, ...config };
  const auth = createJwtClient();
  
  const classId = `${walletConfig.issuerId}.${walletConfig.classId}`;
  
  const loyaltyClass = {
    id: classId,
    issuerName: 'YourCity Deals',
    programName: 'YourCity Deals Card',
    programLogo: {
      sourceUri: {
        uri: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
      }
    },
    reviewStatus: 'UNDER_REVIEW',
    allowMultipleUsersPerObject: false,
    locations: [
      {
        kind: 'walletobjects#latLongPoint',
        latitude: 37.7749,
        longitude: -122.4194
      }
    ]
  };

  try {
    await walletApi.loyaltyclass.insert({
      auth,
      resource: loyaltyClass
    });
    
    return classId;
  } catch (error: any) {
    if (error.code === 409) {
      // Class already exists
      return classId;
    }
    throw error;
  }
}

export async function createGoogleWalletObject(
  user: UserWalletData,
  deals: WalletDeal[],
  config: Partial<GoogleWalletConfig> = {}
): Promise<string> {
  const walletConfig = { ...DEFAULT_WALLET_CONFIG, ...config };
  const auth = createJwtClient();
  
  const objectId = `${walletConfig.issuerId}.${walletConfig.objectIdPrefix}_${user.id}`;
  const classId = `${walletConfig.issuerId}.${walletConfig.classId}`;
  
  const loyaltyObject = {
    id: objectId,
    classId: classId,
    accountName: getUserDisplayName(user),
    accountId: user.id,
    state: 'ACTIVE',
    barcode: {
      kind: 'walletobjects#barcode',
      type: 'QR_CODE',
      value: user.redemption_code
    },
    locations: getNearbyLocations(deals, 10).map(location => ({
      kind: 'walletobjects#latLongPoint',
      latitude: location.latitude,
      longitude: location.longitude
    })),
    textModulesData: [
      {
        header: 'Active Deals',
        body: `${deals.length} deals available`
      },
      ...deals.slice(0, 5).map(deal => ({
        header: deal.business_name,
        body: formatDealForWallet(deal)
      }))
    ],
    linksModuleData: {
      uris: [
        {
          uri: `${process.env.NEXT_PUBLIC_BASE_URL}/books`,
          description: 'View All Deals'
        }
      ]
    }
  };

  try {
    await walletApi.loyaltyobject.insert({
      auth,
      resource: loyaltyObject
    });
    
    return objectId;
  } catch (error: any) {
    if (error.code === 409) {
      // Object already exists, update it
      await walletApi.loyaltyobject.update({
        auth,
        resourceId: objectId,
        resource: loyaltyObject
      });
    } else {
      throw error;
    }
    
    return objectId;
  }
}

export function createSaveToWalletJWT(
  user: UserWalletData,
  deals: WalletDeal[],
  config: Partial<GoogleWalletConfig> = {}
): string {
  const walletConfig = { ...DEFAULT_WALLET_CONFIG, ...config };
  const serviceAccount = JSON.parse(process.env.GW_SERVICE_ACCOUNT_JSON || '{}');
  
  const objectId = `${walletConfig.issuerId}.${walletConfig.objectIdPrefix}_${user.id}`;
  const classId = `${walletConfig.issuerId}.${walletConfig.classId}`;
  
  const payload = {
    iss: serviceAccount.client_email,
    aud: 'google',
    origins: [process.env.NEXT_PUBLIC_BASE_URL || 'https://yourcitydeals.com'],
    typ: 'savetowallet',
    payload: {
      loyaltyObjects: [
        {
          id: objectId,
          classId: classId,
          accountName: getUserDisplayName(user),
          accountId: user.id,
          state: 'ACTIVE',
          barcode: {
            type: 'QR_CODE',
            value: user.redemption_code
          },
          locations: getNearbyLocations(deals, 10).map(location => ({
            latitude: location.latitude,
            longitude: location.longitude
          })),
          textModulesData: [
            {
              header: 'Active Deals',
              body: `${deals.length} deals available`
            },
            ...deals.slice(0, 5).map(deal => ({
              header: deal.business_name,
              body: formatDealForWallet(deal)
            }))
          ]
        }
      ]
    }
  };

  return jwt.sign(payload, serviceAccount.private_key, { algorithm: 'RS256' });
}

export async function updateGoogleWalletObject(
  user: UserWalletData,
  deals: WalletDeal[],
  config: Partial<GoogleWalletConfig> = {}
): Promise<void> {
  const walletConfig = { ...DEFAULT_WALLET_CONFIG, ...config };
  const auth = createJwtClient();
  
  const objectId = `${walletConfig.issuerId}.${walletConfig.objectIdPrefix}_${user.id}`;
  
  const updateData = {
    textModulesData: [
      {
        header: 'Active Deals',
        body: `${deals.length} deals available`
      },
      ...deals.slice(0, 5).map(deal => ({
        header: deal.business_name,
        body: formatDealForWallet(deal)
      }))
    ],
    locations: getNearbyLocations(deals, 10).map(location => ({
      kind: 'walletobjects#latLongPoint',
      latitude: location.latitude,
      longitude: location.longitude
    }))
  };

  await walletApi.loyaltyobject.patch({
    auth,
    resourceId: objectId,
    resource: updateData
  });
}

export function isGoogleWalletSupported(userAgent: string): boolean {
  // Check if the user agent indicates Android Chrome
  return /Android/.test(userAgent) && /Chrome/.test(userAgent);
}
