import { supabase } from './supabaseClient';

// Types for seller system
export interface SellerInvite {
  id: string;
  token: string;
  first_name: string;
  last_name: string;
  email: string;
  organization_hub?: string;
  coupon_book?: string;
  status: 'pending' | 'ready_for_review' | 'edit_requested' | 'approved' | 'rejected' | 'active';
  created_at: string;
  updated_at: string;
}

export interface SellerProfile {
  id: string;
  invite_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  zip_code?: string;
  profile_picture_url?: string;
  status: 'pending' | 'ready_for_review' | 'edit_requested' | 'approved' | 'rejected' | 'active';
  profile_completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface SellerAuth {
  id: string;
  seller_id: string;
  email: string;
  phone?: string;
  password_hash?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface OrganizationalHub {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CouponBook {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SellerAssignment {
  id: string;
  seller_id: string;
  organization_hub_id?: string;
  coupon_book_id?: string;
  assigned_by?: string;
  assigned_at: string;
}

// Seller Invites
export const sellerInvitesService = {
  // Create new invite
  async createInvite(invite: Omit<SellerInvite, 'id' | 'created_at' | 'updated_at'>): Promise<SellerInvite | null> {
    const { data, error } = await supabase
      .from('seller_invites')
      .insert(invite)
      .select()
      .single();

    if (error) {
      console.error('Error creating invite:', error);
      return null;
    }
    return data;
  },

  // Get invite by token
  async getInviteByToken(token: string): Promise<SellerInvite | null> {
    const { data, error } = await supabase
      .from('seller_invites')
      .select('*')
      .eq('token', token)
      .single();

    if (error) {
      console.error('Error getting invite:', error);
      return null;
    }
    return data;
  },

  // Update invite
  async updateInvite(id: string, updates: Partial<SellerInvite>): Promise<boolean> {
    const { error } = await supabase
      .from('seller_invites')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating invite:', error);
      return false;
    }
    return true;
  },

  // Get all invites (for admin)
  async getAllInvites(): Promise<SellerInvite[]> {
    const { data, error } = await supabase
      .from('seller_invites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting invites:', error);
      return [];
    }
    return data || [];
  },

  // Update invite status
  async updateInviteStatus(id: string, status: SellerInvite['status']): Promise<boolean> {
    const { error } = await supabase
      .from('seller_invites')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error('Error updating invite status:', error);
      return false;
    }
    return true;
  },

  // Real-time subscription for invites
  subscribeToInvites(callback: (payload: any) => void) {
    return supabase
      .channel('seller_invites_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'seller_invites' }, 
        callback
      )
      .subscribe();
  }
};

// Seller Profiles
export const sellerProfilesService = {
  // Create seller profile
  async createProfile(profile: Omit<SellerProfile, 'id' | 'created_at' | 'updated_at'>): Promise<SellerProfile | null> {
    const { data, error } = await supabase
      .from('seller_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }
    return data;
  },

  // Get profile by invite ID
  async getProfileByInviteId(inviteId: string): Promise<SellerProfile | null> {
    const { data, error } = await supabase
      .from('seller_profiles')
      .select('*')
      .eq('invite_id', inviteId)
      .single();

    if (error) {
      console.error('Error getting profile:', error);
      return null;
    }
    return data;
  },

  // Update profile
  async updateProfile(id: string, updates: Partial<SellerProfile>): Promise<boolean> {
    const { error } = await supabase
      .from('seller_profiles')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }
    return true;
  },

  // Get all profiles (for admin)
  async getAllProfiles(): Promise<SellerProfile[]> {
    const { data, error } = await supabase
      .from('seller_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error getting profiles:', error);
      return [];
    }
    return data || [];
  },

  // Real-time subscription for profiles
  subscribeToProfiles(callback: (payload: any) => void) {
    return supabase
      .channel('seller_profiles_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'seller_profiles' }, 
        callback
      )
      .subscribe();
  }
};

// Organizational Hubs
export const organizationalHubsService = {
  // Get all active hubs
  async getActiveHubs(): Promise<OrganizationalHub[]> {
    const { data, error } = await supabase
      .from('organizational_hubs')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      console.error('Error getting hubs:', error);
      return [];
    }
    return data || [];
  }
};

// Coupon Books
export const couponBooksService = {
  // Get all active books
  async getActiveBooks(): Promise<CouponBook[]> {
    const { data, error } = await supabase
      .from('admin_coupon_books')
      .select('*')
      .eq('is_active', true)
      .order('title');

    if (error) {
      console.error('Error getting books:', error);
      return [];
    }
    return data || [];
  }
};

// Seller Assignments
export const sellerAssignmentsService = {
  // Assign seller to organization/book
  async assignSeller(assignment: Omit<SellerAssignment, 'id' | 'assigned_at'>): Promise<boolean> {
    const { error } = await supabase
      .from('seller_assignments')
      .insert(assignment);

    if (error) {
      console.error('Error assigning seller:', error);
      return false;
    }
    return true;
  },

  // Remove assignment
  async removeAssignment(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('seller_assignments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing assignment:', error);
      return false;
    }
    return true;
  },

  // Get assignments for seller
  async getSellerAssignments(sellerId: string): Promise<SellerAssignment[]> {
    const { data, error } = await supabase
      .from('seller_assignments')
      .select('*')
      .eq('seller_id', sellerId);

    if (error) {
      console.error('Error getting assignments:', error);
      return [];
    }
    return data || [];
  }
};

// Combined service for admin dashboard
export const adminSellerService = {
  // Get all data for admin dashboard
  async getDashboardData() {
    const [invites, profiles, hubs, books] = await Promise.all([
      sellerInvitesService.getAllInvites(),
      sellerProfilesService.getAllProfiles(),
      organizationalHubsService.getActiveHubs(),
      couponBooksService.getActiveBooks()
    ]);

    // Enhance invites with organization hub and coupon book names
    const enhancedInvites = invites.map(invite => {
      const hub = hubs.find(h => h.id === invite.organization_hub);
      const book = books.find(b => b.id === invite.coupon_book);
      
      return {
        ...invite,
        organizationHub: hub?.name || null,
        organizationHubId: invite.organization_hub,
        couponBook: book?.name || null,
        couponBookId: invite.coupon_book
      };
    });

    return {
      invites: enhancedInvites,
      profiles,
      hubs,
      books
    };
  },

  // Subscribe to all real-time updates
  subscribeToAllUpdates(callback: (payload: any) => void) {
    const invitesChannel = sellerInvitesService.subscribeToInvites(callback);
    const profilesChannel = sellerProfilesService.subscribeToProfiles(callback);
    
    return {
      invites: invitesChannel,
      profiles: profilesChannel
    };
  }
};
