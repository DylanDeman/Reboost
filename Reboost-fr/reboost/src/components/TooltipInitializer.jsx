import { useEffect } from 'react';

/**
 * Component that initializes Bootstrap tooltips for the application
 * Ensures tooltips work properly on both regular and disabled buttons
 */
const TooltipInitializer = () => {
  useEffect(() => {

    if (typeof window !== 'undefined' && window.bootstrap) {
      // Initialize all tooltips (excluding ones handled by DisabledButtonTooltip)
      const initTooltips = () => {
        
        const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]:not(.tooltip-wrapper *)');
        
        tooltipElements.forEach(element => {
          // Dispose any existing tooltip to avoid duplicates
          const existingTooltip = window.bootstrap.Tooltip.getInstance(element);
          if (existingTooltip) {
            existingTooltip.dispose();
          }
          
         
          new window.bootstrap.Tooltip(element, {
            boundary: 'window',
            container: 'body',
            trigger: 'hover focus',
          });
        });
      };
      
      // Initial initialization
      initTooltips();
      
      // Initialize tooltips whenever the DOM changes (for dynamically added elements)
      const observer = new MutationObserver((mutations) => {
        let shouldInit = false;
        
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              const node = mutation.addedNodes[i];
              if (node.nodeType === 1) { // ELEMENT_NODE
                if (node.hasAttribute && node.hasAttribute('data-bs-toggle')) {
                  shouldInit = true;
                  break;
                } else if (node.querySelector && node.querySelector('[data-bs-toggle="tooltip"]')) {
                  shouldInit = true;
                  break;
                }
              }
            }
          }
        });
        
        if (shouldInit) {
          setTimeout(initTooltips, 100);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
    
      return () => {
      
        const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipElements.forEach(element => {
          const tooltip = window.bootstrap.Tooltip.getInstance(element);
          if (tooltip) {
            tooltip.dispose();
          }
        });
        
        observer.disconnect();
      };
    }
  }, []);
  
  return null; 
};

export default TooltipInitializer;