import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useHistoryBlock = (shouldBlock) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!shouldBlock) return;

    // Block browser back button
    const preventBack = () => {
      window.history.pushState(null, null, window.location.href);
    };

    // Push a new entry to prevent back
    window.history.pushState(null, null, window.location.href);

    // Listen for back button press
    window.addEventListener('popstate', preventBack);

    return () => {
      window.removeEventListener('popstate', preventBack);
    };
  }, [shouldBlock, navigate]);
};
