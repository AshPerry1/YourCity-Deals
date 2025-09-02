export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  zipCode?: string;
  createdAt: Date;
}

export interface UserRole {
  userId: string;
  role: 'buyer' | 'seller' | 'merchant_manager' | 'admin' | 'org_admin';
  orgId?: string;
  merchantId?: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  type: 'school' | 'neighborhood' | 'event' | 'city';
  description: string;
  logo?: string;
  zipCodes?: string[];
  createdAt: Date;
}

export interface Book {
  id: string;
  name: string;
  description: string;
  orgId?: string;
  type: 'school' | 'neighborhood' | 'event' | 'city';
  price: number;
  discoverable: boolean;
  status: 'draft' | 'published' | 'paused' | 'removed';
  publishedAt?: Date;
  createdAt: Date;
}

export interface Merchant {
  id: string;
  name: string;
  description: string;
  logo?: string;
  locations: Location[];
  createdAt: Date;
}

export interface Location {
  id: string;
  merchantId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone?: string;
  createdAt: Date;
}

export interface Offer {
  id: string;
  merchantId: string;
  title: string;
  description: string;
  discount: string;
  terms: string;
  image?: string;
  createdAt: Date;
}

export interface BookOffer {
  id: string;
  bookId: string;
  offerId: string;
  state: 'draft' | 'submitted' | 'approved' | 'published' | 'paused' | 'removed';
  lockedSnapshot: any; // JSON snapshot when approved
  reviewerId?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  userId: string;
  bookId: string;
  stripeSessionId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  amount: number;
  createdAt: Date;
}

export interface WalletCoupon {
  id: string;
  userId: string;
  bookOfferId: string;
  status: 'unused' | 'activated' | 'redeemed' | 'transferred';
  activatedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface TransferToken {
  id: string;
  walletCouponId: string;
  fromUserId: string;
  claimToken: string;
  status: 'pending' | 'claimed' | 'expired';
  expiresAt: Date;
  createdAt: Date;
}

export interface Referral {
  id: string;
  sellerId: string;
  linkId: string;
  clicks: number;
  adds: number;
  purchases: number;
  bookId: string;
  createdAt: Date;
}

export interface Redemption {
  id: string;
  walletCouponId: string;
  userId: string;
  merchantId: string;
  deviceId?: string;
  verifiedAt: Date;
  method: 'qr' | 'pin';
  createdAt: Date;
}

export interface AuditEvent {
  id: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  before?: any;
  after?: any;
  timestamp: Date;
}

export interface Segment {
  id: string;
  name: string;
  zipCodes: string[];
  createdAt: Date;
}

// State machine types
export type BookOfferState = 'draft' | 'submitted' | 'approved' | 'published' | 'paused' | 'removed';
export type WalletCouponStatus = 'unused' | 'activated' | 'redeemed' | 'transferred';
export type TransferTokenStatus = 'pending' | 'claimed' | 'expired';
