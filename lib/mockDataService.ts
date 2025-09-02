import { 
  User, UserRole, Organization, Book, Merchant, Location, Offer, 
  BookOffer, Purchase, WalletCoupon, TransferToken, Referral, 
  Redemption, AuditEvent, Segment 
} from './types';

// Mock data storage (in-memory for MVP)
class MockDataService {
  private users: User[] = [];
  private userRoles: UserRole[] = [];
  private organizations: Organization[] = [];
  private books: Book[] = [];
  private merchants: Merchant[] = [];
  private offers: Offer[] = [];
  private bookOffers: BookOffer[] = [];
  private purchases: Purchase[] = [];
  private walletCoupons: WalletCoupon[] = [];
  private transferTokens: TransferToken[] = [];
  private referrals: Referral[] = [];
  private redemptions: Redemption[] = [];
  private auditEvents: AuditEvent[] = [];
  private segments: Segment[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Create mock organizations
    const org1: Organization = {
      id: 'org-1',
      name: 'Lincoln High School',
      type: 'school',
      description: 'Supporting local education through community partnerships',
      contactEmail: 'pta@lincolnhigh.edu',
      contactPhone: '(555) 123-4567',
      address: '123 School St, Omaha, NE',
      zipCodes: ['90210', '90211', '90212'],
      createdAt: new Date('2024-01-01')
    };

    const org2: Organization = {
      id: 'org-2',
      name: 'Downtown Business Association',
      type: 'neighborhood',
      description: 'Promoting local businesses in the downtown area',
      contactEmail: 'info@downtownba.org',
      contactPhone: '(555) 987-6543',
      address: '456 Business Ave, Omaha, NE',
      zipCodes: ['90210'],
      createdAt: new Date('2024-01-15')
    };

    this.organizations = [org1, org2];

    // Create mock merchants
    const merchant1: Merchant = {
      id: 'merchant-1',
      name: 'Joe\'s Pizza',
      description: 'Authentic Italian pizza since 1985',
      category: 'Food & Dining',
      address: '123 Main St, Beverly Hills, CA 90210',
      organizationId: 'org-1',
      status: 'active',
      totalOffers: 3,
      locations: [{
        id: 'loc-1',
        merchantId: 'merchant-1',
        name: 'Downtown Location',
        address: '123 Main St',
        city: 'Beverly Hills',
        state: 'CA',
        zipCode: '90210',
        phone: '(310) 555-0123',
        createdAt: new Date('2024-01-01')
      }],
      createdAt: new Date('2024-01-01')
    };

    const merchant2: Merchant = {
      id: 'merchant-2',
      name: 'Sunset Coffee',
      description: 'Artisan coffee and pastries',
      category: 'Food & Dining',
      address: '456 Sunset Blvd, Beverly Hills, CA 90210',
      organizationId: 'org-1',
      status: 'active',
      totalOffers: 2,
      locations: [{
        id: 'loc-2',
        merchantId: 'merchant-2',
        name: 'Main Location',
        address: '456 Sunset Blvd',
        city: 'Beverly Hills',
        state: 'CA',
        zipCode: '90210',
        phone: '(310) 555-0456',
        createdAt: new Date('2024-01-01')
      }],
      createdAt: new Date('2024-01-01')
    };

    this.merchants = [merchant1, merchant2];

    // Create mock offers
    const offer1: Offer = {
      id: 'offer-1',
      merchantId: 'merchant-1',
      title: 'Free Appetizer',
      description: 'Get a free garlic bread with any large pizza',
      discount: 'Free Appetizer',
      terms: 'Valid with large pizza purchase. Cannot be combined with other offers.',
      createdAt: new Date('2024-01-01')
    };

    const offer2: Offer = {
      id: 'offer-2',
      merchantId: 'merchant-2',
      title: '20% Off Pastries',
      description: 'Save 20% on all pastries and desserts',
      discount: '20% Off',
      terms: 'Valid on all pastries and desserts. Excludes beverages.',
      createdAt: new Date('2024-01-01')
    };

    this.offers = [offer1, offer2];

    // Create mock books
    const book1: Book = {
      id: 'book-1',
      name: 'Lincoln High School Coupon Book 2024',
      description: 'Support your local school while saving money',
      organizationId: 'org-1',
      orgId: 'org-1',
      type: 'school',
      price: 25.00,
      totalOffers: 8,
      totalSales: 1250,
      validUntil: '2024-12-31',
      discoverable: true,
      status: 'published',
      publishedAt: new Date('2024-01-15'),
      createdAt: new Date('2024-01-01')
    };

    const book2: Book = {
      id: 'book-2',
      name: 'Downtown Deals 2024',
      description: 'Exclusive deals from downtown businesses',
      organizationId: 'org-2',
      orgId: 'org-2',
      type: 'neighborhood',
      price: 15.00,
      totalOffers: 6,
      totalSales: 850,
      validUntil: '2024-12-31',
      discoverable: true,
      status: 'published',
      publishedAt: new Date('2024-01-20'),
      createdAt: new Date('2024-01-15')
    };

    this.books = [book1, book2];

    // Create mock book offers
    const bookOffer1: BookOffer = {
      id: 'book-offer-1',
      bookId: 'book-1',
      offerId: 'offer-1',
      state: 'published',
      lockedSnapshot: offer1,
      createdAt: new Date('2024-01-15')
    };

    const bookOffer2: BookOffer = {
      id: 'book-offer-2',
      bookId: 'book-2',
      offerId: 'offer-2',
      state: 'published',
      lockedSnapshot: offer2,
      createdAt: new Date('2024-01-20')
    };

    this.bookOffers = [bookOffer1, bookOffer2];

    // Create mock users
    const user1: User = {
      id: 'user-1',
      email: 'john@example.com',
      name: 'John Doe',
      phone: '+1234567890',
      zipCode: '90210',
      createdAt: new Date('2024-01-01')
    };

    const user2: User = {
      id: 'user-2',
      email: 'jane@example.com',
      name: 'Jane Smith',
      phone: '+1234567891',
      zipCode: '90211',
      createdAt: new Date('2024-01-05')
    };

    this.users = [user1, user2];

    // Create mock user roles
    const userRole1: UserRole = {
      userId: 'user-1',
      role: 'buyer',
      createdAt: new Date('2024-01-01')
    };

    const userRole2: UserRole = {
      userId: 'user-2',
      role: 'buyer',
      createdAt: new Date('2024-01-05')
    };

    const adminRole: UserRole = {
      userId: 'user-1',
      role: 'admin',
      createdAt: new Date('2024-01-01')
    };

    this.userRoles = [userRole1, userRole2, adminRole];

    // Create mock purchases
    const purchase1: Purchase = {
      id: 'purchase-1',
      userId: 'user-1',
      bookId: 'book-1',
      status: 'completed',
      amount: 25.00,
      createdAt: new Date('2024-01-20')
    };

    this.purchases = [purchase1];

    // Create mock wallet coupons
    const walletCoupon1: WalletCoupon = {
      id: 'wallet-coupon-1',
      userId: 'user-1',
      bookOfferId: 'book-offer-1',
      status: 'unused',
      createdAt: new Date('2024-01-20')
    };

    const walletCoupon2: WalletCoupon = {
      id: 'wallet-coupon-2',
      userId: 'user-1',
      bookOfferId: 'book-offer-2',
      status: 'unused',
      createdAt: new Date('2024-01-20')
    };

    this.walletCoupons = [walletCoupon1, walletCoupon2];

    // Create mock segments
    const segment1: Segment = {
      id: 'segment-1',
      name: 'Beverly Hills Residents',
      zipCodes: ['90210', '90211', '90212'],
      createdAt: new Date('2024-01-01')
    };

    this.segments = [segment1];
  }

  // User methods
  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  getUserRoles(userId: string): UserRole[] {
    return this.userRoles.filter(role => role.userId === userId);
  }

  // Organization methods
  getOrganizations(): Organization[] {
    return this.organizations;
  }

  getOrganizationById(id: string): Organization | undefined {
    return this.organizations.find(org => org.id === id);
  }

  // Book methods
  getBooks(): Book[] {
    return this.books;
  }

  getBookById(id: string): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  getPublishedBooks(): Book[] {
    return this.books.filter(book => book.status === 'published');
  }

  // Merchant methods
  getMerchants(): Merchant[] {
    return this.merchants;
  }

  getMerchantById(id: string): Merchant | undefined {
    return this.merchants.find(merchant => merchant.id === id);
  }

  // Offer methods
  getOffers(): Offer[] {
    return this.offers;
  }

  getOffersByMerchant(merchantId: string): Offer[] {
    return this.offers.filter(offer => offer.merchantId === merchantId);
  }

  // BookOffer methods
  getBookOffers(): BookOffer[] {
    return this.bookOffers;
  }

  getBookOffersByBook(bookId: string): BookOffer[] {
    return this.bookOffers.filter(bo => bo.bookId === bookId);
  }

  getPublishedBookOffers(): BookOffer[] {
    return this.bookOffers.filter(bo => bo.state === 'published');
  }

  // Purchase methods
  getPurchases(): Purchase[] {
    return this.purchases;
  }

  getPurchasesByUser(userId: string): Purchase[] {
    return this.purchases.filter(purchase => purchase.userId === userId);
  }

  // WalletCoupon methods
  getWalletCoupons(): WalletCoupon[] {
    return this.walletCoupons;
  }

  getWalletCouponsByUser(userId: string): WalletCoupon[] {
    return this.walletCoupons.filter(coupon => coupon.userId === userId);
  }

  // Redemption methods
  getRedemptions(): Redemption[] {
    return this.redemptions;
  }

  getRedemptionsByMerchant(merchantId: string): Redemption[] {
    return this.redemptions.filter(redemption => redemption.merchantId === merchantId);
  }

  // Segment methods
  getSegments(): Segment[] {
    return this.segments;
  }

  // Mock methods for creating/updating data
  createPurchase(purchase: Omit<Purchase, 'id' | 'createdAt'>): Purchase {
    const newPurchase: Purchase = {
      ...purchase,
      id: `purchase-${Date.now()}`,
      createdAt: new Date()
    };
    this.purchases.push(newPurchase);
    return newPurchase;
  }

  createWalletCoupon(coupon: Omit<WalletCoupon, 'id' | 'createdAt'>): WalletCoupon {
    const newCoupon: WalletCoupon = {
      ...coupon,
      id: `wallet-coupon-${Date.now()}`,
      createdAt: new Date()
    };
    this.walletCoupons.push(newCoupon);
    return newCoupon;
  }

  updateWalletCouponStatus(id: string, status: WalletCoupon['status']): WalletCoupon | undefined {
    const coupon = this.walletCoupons.find(c => c.id === id);
    if (coupon) {
      coupon.status = status;
      if (status === 'activated') {
        coupon.activatedAt = new Date();
        coupon.expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes
      }
    }
    return coupon;
  }

  createRedemption(redemption: Omit<Redemption, 'id' | 'createdAt'>): Redemption {
    const newRedemption: Redemption = {
      ...redemption,
      id: `redemption-${Date.now()}`,
      createdAt: new Date()
    };
    this.redemptions.push(newRedemption);
    return newRedemption;
  }

  createTransferToken(token: Omit<TransferToken, 'id' | 'createdAt'>): TransferToken {
    const newToken: TransferToken = {
      ...token,
      id: `transfer-token-${Date.now()}`,
      createdAt: new Date()
    };
    this.transferTokens.push(newToken);
    return newToken;
  }

  getTransferTokenByClaimToken(claimToken: string): TransferToken | undefined {
    return this.transferTokens.find(token => token.claimToken === claimToken);
  }

  updateTransferTokenStatus(id: string, status: TransferToken['status']): TransferToken | undefined {
    const token = this.transferTokens.find(t => t.id === id);
    if (token) {
      token.status = status;
    }
    return token;
  }

  // Utility methods
  generateClaimToken(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  getUsersByZipCodes(zipCodes: string[]): User[] {
    return this.users.filter(user => user.zipCode && zipCodes.includes(user.zipCode));
  }
}

// Export singleton instance
export const mockDataService = new MockDataService();
