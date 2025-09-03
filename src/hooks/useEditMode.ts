'use client';

import { useState, useEffect } from 'react';

export function useEditMode() {
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    // Check initial hash
    const checkHash = () => {
      setIsEditMode(window.location.hash === '#edit');
    };

    // Check on mount
    checkHash();

    // Listen for hash changes
    const handleHashChange = () => {
      checkHash();
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return isEditMode;
}