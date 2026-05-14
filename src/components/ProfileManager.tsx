import { useEffect, useMemo, useRef, useState } from 'react';
import type { Profile } from '../hooks/useProfiles';

interface ProfileManagerProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: Profile[];
  activeProfileId: string;
  onSwitchProfile: (profileId: string) => void;
  onCreateProfile: (name: string) => string | null;
  onRenameProfile: (profileId: string, name: string) => boolean;
  onDeleteProfile: (profileId: string) => boolean;
}

export const ProfileManager = ({
  isOpen,
  onClose,
  profiles,
  activeProfileId,
  onSwitchProfile,
  onCreateProfile,
  onRenameProfile,
  onDeleteProfile,
}: ProfileManagerProps) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const visibleProfiles = useMemo(() => {
    if (!query) return profiles;
    const lowerQuery = query.toLowerCase();
    return profiles.filter((profile) => profile.name.toLowerCase().includes(lowerQuery));
  }, [profiles, query]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setSelectedIndex(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (visibleProfiles.length > 0) {
          setSelectedIndex((prev) => (prev + 1) % visibleProfiles.length);
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (visibleProfiles.length > 0) {
          setSelectedIndex((prev) => (prev - 1 + visibleProfiles.length) % visibleProfiles.length);
        }
        return;
      }

      if (e.key === 'Enter' && visibleProfiles[selectedIndex]) {
        e.preventDefault();
        onSwitchProfile(visibleProfiles[selectedIndex].id);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onSwitchProfile, selectedIndex, visibleProfiles]);

  const handleCreate = () => {
    const name = window.prompt('New profile name');
    if (!name) return;
    onCreateProfile(name);
  };

  const handleRename = () => {
    const active = profiles.find((profile) => profile.id === activeProfileId);
    const currentName = active?.name ?? 'Main';
    const nextName = window.prompt('Rename profile', currentName);
    if (!nextName) return;
    onRenameProfile(activeProfileId, nextName);
  };

  const handleDelete = () => {
    if (profiles.length <= 1) {
      window.alert('At least one profile is required.');
      return;
    }

    const active = profiles.find((profile) => profile.id === activeProfileId);
    const ok = window.confirm(`Delete profile "${active?.name ?? 'active'}" and all its saved data?`);
    if (!ok) return;

    onDeleteProfile(activeProfileId);
  };

  if (!isOpen) return null;

  return (
    <div className="profile-manager-backdrop" onClick={onClose}>
      <div
        className="profile-manager-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Profile manager"
      >
        <div className="profile-manager-header-row">
          <h2>Profiles</h2>
          <span className="profile-manager-hint">cmd/ctrl + shift + p</span>
        </div>

        <div className="profile-manager-actions">
          <button className="profile-action-btn" onClick={handleCreate}>create</button>
          <button className="profile-action-btn" onClick={handleRename}>rename</button>
          <button className="profile-action-btn danger" onClick={handleDelete}>delete</button>
        </div>

        <input
          ref={inputRef}
          className="profile-manager-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search profiles..."
          type="text"
        />

        <div className="profile-manager-list">
          {visibleProfiles.length > 0 ? visibleProfiles.map((profile, idx) => (
            <button
              key={profile.id}
              className={`profile-row ${selectedIndex === idx ? 'selected' : ''} ${profile.id === activeProfileId ? 'active' : ''}`}
              onClick={() => {
                onSwitchProfile(profile.id);
                onClose();
              }}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <span>{profile.name}</span>
              {profile.id === activeProfileId && <span className="profile-active-tag">active</span>}
            </button>
          )) : (
            <div className="profile-manager-empty">No profiles found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
