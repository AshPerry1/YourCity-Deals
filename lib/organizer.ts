// Organizer system types and utilities
export type OrganizerType = 'school' | 'event' | 'neighborhood' | 'nonprofit' | 'business_group' | 'personal';

export interface OrganizerOption {
  value: OrganizerType;
  label: string;
  description: string;
}

export interface OrganizerCopy {
  defaultTitle: string;
  description: string;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
}

export function getOrganizerTypeOptions(): OrganizerOption[] {
  return [
    {
      value: 'school',
      label: 'School',
      description: 'Educational institution'
    },
    {
      value: 'event',
      label: 'Event',
      description: 'Special event or festival'
    },
    {
      value: 'neighborhood',
      label: 'Neighborhood',
      description: 'HOA or community group'
    },
    {
      value: 'nonprofit',
      label: 'Nonprofit',
      description: 'Charitable organization'
    },
    {
      value: 'business_group',
      label: 'Business Group',
      description: 'Chamber of commerce or merchant group'
    },
    {
      value: 'personal',
      label: 'Personal',
      description: 'Individual or family'
    }
  ];
}

export function getOrganizerCopy(type: OrganizerType, name: string): OrganizerCopy {
  const baseName = name.trim();
  
  switch (type) {
    case 'school':
      return {
        defaultTitle: `${baseName} Coupon Book`,
        description: `Support ${baseName} with local savings`
      };
    case 'event':
      return {
        defaultTitle: `${baseName} Savings Book`,
        description: `Save money while supporting ${baseName}`
      };
    case 'neighborhood':
      return {
        defaultTitle: `${baseName} Community Savings`,
        description: `Local deals for ${baseName} residents`
      };
    case 'nonprofit':
      return {
        defaultTitle: `${baseName} Fundraiser Book`,
        description: `Support ${baseName} with every purchase`
      };
    case 'business_group':
      return {
        defaultTitle: `${baseName} Merchant Savings`,
        description: `Exclusive deals from ${baseName} members`
      };
    case 'personal':
      return {
        defaultTitle: `${baseName}'s Favorite Deals`,
        description: `Curated savings from ${baseName}`
      };
    default:
      return {
        defaultTitle: `${baseName} Coupon Book`,
        description: `Digital savings book`
      };
  }
}

export function getOrganizerLabel(type: OrganizerType): string {
  switch (type) {
    case 'event':
      return 'Event';
    case 'neighborhood':
      return 'Neighborhood';
    case 'nonprofit':
      return 'Organization';
    case 'business_group':
      return 'Merchant Group';
    case 'personal':
      return 'Personal';
    default:
      return 'School';
  }
}

export function getDefaultTheme(type: OrganizerType): ThemeColors {
  switch (type) {
    case 'school':
      return {
        primary: '#3B82F6', // Blue
        secondary: '#1E40AF'
      };
    case 'event':
      return {
        primary: '#F59E0B', // Amber
        secondary: '#D97706'
      };
    case 'neighborhood':
      return {
        primary: '#10B981', // Emerald
        secondary: '#059669'
      };
    case 'nonprofit':
      return {
        primary: '#8B5CF6', // Violet
        secondary: '#7C3AED'
      };
    case 'business_group':
      return {
        primary: '#EF4444', // Red
        secondary: '#DC2626'
      };
    case 'personal':
      return {
        primary: '#EC4899', // Pink
        secondary: '#DB2777'
      };
    default:
      return {
        primary: '#3B82F6',
        secondary: '#1E40AF'
      };
  }
}

export function shouldShowLeaderboards(type: OrganizerType): boolean {
  // Only show leaderboards for types that typically have multiple promoters
  return ['school', 'event', 'nonprofit', 'business_group'].includes(type);
}
