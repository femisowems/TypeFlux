import { useMemo, useState } from 'react';
import { defaultConfig } from './useAppConfig';
import type { AppConfig } from './useAppConfig';
import type { HistoryEntry } from './useHistory';

export interface Profile {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

interface ProfilesRegistry {
  activeProfileId: string;
  profiles: Profile[];
}

const REGISTRY_KEY = 'typeflux-profiles';
const LEGACY_CONFIG_KEY = 'typeflux-config';
const LEGACY_HISTORY_KEY = 'typeflux-history';

const profileConfigKey = (profileId: string) => `typeflux-profile-${profileId}-config`;
const profileHistoryKey = (profileId: string) => `typeflux-profile-${profileId}-history`;

const isBrowser = () => typeof window !== 'undefined';

const makeId = () => `p-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const safeParse = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const persistRegistry = (registry: ProfilesRegistry) => {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(registry));
  } catch (err) {
    if (err instanceof Error) {
      console.warn('Failed to save profile registry:', err.message);
    }
  }
};

const sanitizeRegistry = (registry: ProfilesRegistry): ProfilesRegistry => {
  const profiles = Array.isArray(registry.profiles) ? registry.profiles : [];

  if (profiles.length === 0) {
    const now = Date.now();
    const defaultProfile: Profile = {
      id: 'main',
      name: 'Main',
      createdAt: now,
      updatedAt: now,
    };
    return {
      activeProfileId: defaultProfile.id,
      profiles: [defaultProfile],
    };
  }

  const activeExists = profiles.some((profile) => profile.id === registry.activeProfileId);
  return {
    profiles,
    activeProfileId: activeExists ? registry.activeProfileId : profiles[0].id,
  };
};

const ensureProfileStorage = (profileId: string) => {
  if (!isBrowser()) return;

  try {
    if (!localStorage.getItem(profileConfigKey(profileId))) {
      localStorage.setItem(profileConfigKey(profileId), JSON.stringify(defaultConfig));
    }

    if (!localStorage.getItem(profileHistoryKey(profileId))) {
      localStorage.setItem(profileHistoryKey(profileId), JSON.stringify([]));
    }
  } catch (err) {
    if (err instanceof Error) {
      console.warn('Failed to ensure profile storage:', err.message);
    }
  }
};

const initRegistry = (): ProfilesRegistry => {
  const now = Date.now();

  if (!isBrowser()) {
    const defaultProfile: Profile = {
      id: 'main',
      name: 'Main',
      createdAt: now,
      updatedAt: now,
    };

    return {
      activeProfileId: defaultProfile.id,
      profiles: [defaultProfile],
    };
  }

  const savedRegistry = safeParse<ProfilesRegistry | null>(localStorage.getItem(REGISTRY_KEY), null);
  if (savedRegistry) {
    const sanitized = sanitizeRegistry(savedRegistry);
    sanitized.profiles.forEach((profile) => ensureProfileStorage(profile.id));
    persistRegistry(sanitized);
    return sanitized;
  }

  const migratedConfig = safeParse<AppConfig>(localStorage.getItem(LEGACY_CONFIG_KEY), defaultConfig);
  const migratedHistory = safeParse<HistoryEntry[]>(localStorage.getItem(LEGACY_HISTORY_KEY), []);

  const mainProfile: Profile = {
    id: 'main',
    name: 'Main',
    createdAt: now,
    updatedAt: now,
  };

  const registry: ProfilesRegistry = {
    activeProfileId: mainProfile.id,
    profiles: [mainProfile],
  };

  try {
    localStorage.setItem(profileConfigKey(mainProfile.id), JSON.stringify(migratedConfig));
    localStorage.setItem(profileHistoryKey(mainProfile.id), JSON.stringify(migratedHistory));
    localStorage.removeItem(LEGACY_CONFIG_KEY);
    localStorage.removeItem(LEGACY_HISTORY_KEY);
  } catch (err) {
    if (err instanceof Error) {
      console.warn('Failed migrating legacy config/history into profiles:', err.message);
    }
  }

  persistRegistry(registry);
  return registry;
};

export const useProfiles = () => {
  const [registry, setRegistry] = useState<ProfilesRegistry>(() => initRegistry());

  const activeProfile = useMemo(
    () => registry.profiles.find((profile) => profile.id === registry.activeProfileId) ?? registry.profiles[0],
    [registry]
  );

  const setActiveProfile = (profileId: string) => {
    setRegistry((prev) => {
      if (!prev.profiles.some((profile) => profile.id === profileId)) {
        return prev;
      }
      const next = { ...prev, activeProfileId: profileId };
      persistRegistry(next);
      return next;
    });
  };

  const createProfile = (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return null;

    const nextId = makeId();
    const now = Date.now();
    const profile: Profile = {
      id: nextId,
      name: trimmedName,
      createdAt: now,
      updatedAt: now,
    };

    ensureProfileStorage(nextId);

    setRegistry((prev) => {
      const next = {
        activeProfileId: profile.id,
        profiles: [profile, ...prev.profiles],
      };
      persistRegistry(next);
      return next;
    });

    return nextId;
  };

  const renameProfile = (profileId: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return false;

    let renamed = false;
    setRegistry((prev) => {
      const profiles = prev.profiles.map((profile) => {
        if (profile.id !== profileId) return profile;
        renamed = true;
        return {
          ...profile,
          name: trimmedName,
          updatedAt: Date.now(),
        };
      });

      if (!renamed) return prev;
      const next = { ...prev, profiles };
      persistRegistry(next);
      return next;
    });

    return renamed;
  };

  const deleteProfile = (profileId: string) => {
    let deleted = false;

    setRegistry((prev) => {
      if (prev.profiles.length <= 1) {
        return prev;
      }

      const remainingProfiles = prev.profiles.filter((profile) => profile.id !== profileId);
      if (remainingProfiles.length === prev.profiles.length) {
        return prev;
      }

      deleted = true;
      const nextActiveProfileId =
        prev.activeProfileId === profileId ? remainingProfiles[0].id : prev.activeProfileId;

      const next = {
        activeProfileId: nextActiveProfileId,
        profiles: remainingProfiles,
      };
      persistRegistry(next);
      return next;
    });

    if (deleted && isBrowser()) {
      try {
        localStorage.removeItem(profileConfigKey(profileId));
        localStorage.removeItem(profileHistoryKey(profileId));
      } catch (err) {
        if (err instanceof Error) {
          console.warn('Failed to delete profile data:', err.message);
        }
      }
    }

    return deleted;
  };

  return {
    profiles: registry.profiles,
    activeProfileId: registry.activeProfileId,
    activeProfile,
    setActiveProfile,
    createProfile,
    renameProfile,
    deleteProfile,
  };
};
