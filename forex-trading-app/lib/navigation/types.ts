// lib/navigation/types.ts
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  endpoint?: string;
  badge?: string | number;
  permissions?: string[];
}

export interface NavigationGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavigationItem[];
  defaultOpen?: boolean;
  permissions?: string[];
}

export interface User {
  id: number;
  name?: string;
  fullName?: string;
  username?: string;
  email?: string;
  role?: string;
  profileId?: number;
  profileName?: string;
  salesGroupId?: number | null;
  status?: string;
  permissions?: string[];
}