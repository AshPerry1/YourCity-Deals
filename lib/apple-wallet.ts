import { Pass } from 'passkit-generator';
import { WalletDeal, UserWalletData, getNearbyLocations, formatDealForWallet, getUserDisplayName } from './wallet';

export interface ApplePassConfig {
  passTypeIdentifier: string;
  teamIdentifier: string;
  organizationName: string;
  description: string;
  foregroundColor: string;
  backgroundColor: string;
  labelColor: string;
  logoText: string;
}

const DEFAULT_PASS_CONFIG: ApplePassConfig = {
  passTypeIdentifier: process.env.PASS_TYPE_ID || 'pass.com.yourcitydeals.card',
  teamIdentifier: process.env.APPLE_TEAM_ID || '',
  organizationName: 'YourCity Deals',
  description: 'YourCity Deals Digital Coupon Book',
  foregroundColor: 'rgb(255,255,255)',
  backgroundColor: 'rgb(27,44,122)',
  labelColor: 'rgb(255,255,255)',
  logoText: 'YourCity Deals'
};

export async function createApplePass(
  user: UserWalletData,
  deals: WalletDeal[],
  config: Partial<ApplePassConfig> = {}
): Promise<Buffer> {
  const passConfig = { ...DEFAULT_PASS_CONFIG, ...config };
  
  // Create the pass instance
  const pass = await Pass.from({
    model: {
      passTypeIdentifier: passConfig.passTypeIdentifier,
      teamIdentifier: passConfig.teamIdentifier,
      serialNumber: user.wallet_pass_serial,
      organizationName: passConfig.organizationName,
      description: passConfig.description,
      foregroundColor: passConfig.foregroundColor,
      backgroundColor: passConfig.backgroundColor,
      labelColor: passConfig.labelColor,
      logoText: passConfig.logoText,
      storeCard: {
        primaryFields: [
          {
            key: 'title',
            label: 'DEALS',
            value: 'YourCity Deals'
          }
        ],
        secondaryFields: [
          {
            key: 'name',
            label: 'NAME',
            value: getUserDisplayName(user)
          },
          {
            key: 'deals_count',
            label: 'ACTIVE DEALS',
            value: `${deals.length}`
          }
        ],
        auxiliaryFields: deals.slice(0, 3).map((deal, index) => ({
          key: `deal_${index}`,
          label: deal.business_name.toUpperCase(),
          value: formatDealForWallet(deal)
        })),
        backFields: deals.map((deal, index) => ({
          key: `deal_${index}`,
          label: deal.business_name,
          value: `${formatDealForWallet(deal)}\n\n${deal.offer_description || ''}\n\nRedemption Code: ${deal.redemption_code}`
        }))
      },
      barcodes: [
        {
          format: 'PKBarcodeFormatQR',
          message: user.redemption_code,
          messageEncoding: 'iso-8859-1'
        }
      ],
      locations: getNearbyLocations(deals, 10),
      relevantText: 'Deals nearby — tap to view'
    },
    certificates: {
      wwdr: Buffer.from(process.env.APPLE_WWDR_PEM!, 'base64'),
      signerCert: Buffer.from(process.env.APPLE_PASS_CERT_P12_BASE64!, 'base64'),
      signerKey: Buffer.from(process.env.APPLE_PASS_CERT_P12_BASE64!, 'base64'),
      signerKeyPassphrase: process.env.APPLE_PASS_CERT_PASSWORD
    }
  });

  // Generate the .pkpass file
  const buffer = await pass.getAsBuffer();
  return buffer;
}

export async function updateApplePass(
  user: UserWalletData,
  deals: WalletDeal[],
  config: Partial<ApplePassConfig> = {}
): Promise<any> {
  const passConfig = { ...DEFAULT_PASS_CONFIG, ...config };
  
  // Create updated pass data for Apple's web service
  const updatedPass = {
    serialNumber: user.wallet_pass_serial,
    storeCard: {
      primaryFields: [
        {
          key: 'title',
          label: 'DEALS',
          value: 'YourCity Deals'
        }
      ],
      secondaryFields: [
        {
          key: 'name',
          label: 'NAME',
          value: getUserDisplayName(user)
        },
        {
          key: 'deals_count',
          label: 'ACTIVE DEALS',
          value: `${deals.length}`
        }
      ],
      auxiliaryFields: deals.slice(0, 3).map((deal, index) => ({
        key: `deal_${index}`,
        label: deal.business_name.toUpperCase(),
        value: formatDealForWallet(deal)
      })),
      backFields: deals.map((deal, index) => ({
        key: `deal_${index}`,
        label: deal.business_name,
        value: `${formatDealForWallet(deal)}\n\n${deal.offer_description || ''}\n\nRedemption Code: ${deal.redemption_code}`
      }))
    },
    locations: getNearbyLocations(deals, 10),
    relevantText: 'Deals nearby — tap to view'
  };

  return updatedPass;
}

export function isAppleWalletSupported(userAgent: string): boolean {
  // Check if the user agent indicates iOS Safari
  return /iPhone|iPad|iPod/.test(userAgent) && /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
}
