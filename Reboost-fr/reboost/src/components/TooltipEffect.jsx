import { useEffect } from 'react';

// Simple component to initialize Bootstrap tooltips after each render
export default function TooltipEffect() {
  useEffect(() => {
    // Only run if Bootstrap is available
    if (typeof window !== 'undefined' && window.bootstrap) {
      // Initialize all tooltips
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      
      // Clean up existing tooltips to prevent duplicates
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        const existingTooltip = window.bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (existingTooltip) {
          existingTooltip.dispose();
        }
      });
      
      // Initialize new tooltips
      tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new window.bootstrap.Tooltip(tooltipTriggerEl);
      });
    }
    
    // Cleanup function
    return () => {
      if (typeof window !== 'undefined' && window.bootstrap) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          const tooltip = window.bootstrap.Tooltip.getInstance(tooltipTriggerEl);
          if (tooltip) {
            tooltip.dispose();
          }
        });
      }
    };
  }, []);
  
  return null;
}
