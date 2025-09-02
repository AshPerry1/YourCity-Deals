'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from './types';

interface RoleContextType {
  currentRole: UserRole['role'] | null;
  availableRoles: UserRole['role'][];
  switchRole: (role: UserRole['role']) => void;
  isAuthenticated: boolean;
  currentUser: string | null;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole['role'] | null>(null);
  const [availableRoles, setAvailableRoles] = useState<UserRole['role'][]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Mock authentication - in real app this would come from auth service
    const mockUser = 'user-1'; // John Doe has buyer and admin roles
    const mockRoles: UserRole['role'][] = ['buyer', 'admin', 'merchant_manager', 'seller', 'org_admin'];
    
    setCurrentUser(mockUser);
    setAvailableRoles(mockRoles);
    setCurrentRole('buyer'); // Default to buyer role
    setIsAuthenticated(true);

    // Load saved role from localStorage
    const savedRole = localStorage.getItem('currentRole') as UserRole['role'];
    if (savedRole && mockRoles.includes(savedRole)) {
      setCurrentRole(savedRole);
    }
  }, []);

  const switchRole = (role: UserRole['role']) => {
    if (availableRoles.includes(role)) {
      setCurrentRole(role);
      localStorage.setItem('currentRole', role);
    }
  };

  return (
    <RoleContext.Provider value={{
      currentRole,
      availableRoles,
      switchRole,
      isAuthenticated,
      currentUser
    }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
