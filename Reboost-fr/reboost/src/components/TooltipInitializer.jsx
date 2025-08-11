import { useEffect } from 'react';


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
      
      // Clean up orphaned tooltips (tooltips whose trigger elements have been removed)
      const cleanupOrphanedTooltips = () => {
        const tooltipElements = document.querySelectorAll('.tooltip');
        tooltipElements.forEach(tooltipElement => {
          // If tooltip doesn't have a related element anymore, remove it
          if (tooltipElement && tooltipElement.classList.contains('show')) {
            tooltipElement.remove();
          }
        });
      };

      // Initial initialization
      initTooltips();
      
      // Initialize tooltips whenever the DOM changes (for dynamically added elements)
      const observer = new MutationObserver((mutations) => {
        let shouldInit = false;
        let elementRemoved = false;
        
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            // Check for added nodes
            if (mutation.addedNodes.length > 0) {
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
            
            // Check for removed nodes
            if (mutation.removedNodes.length > 0) {
              for (let i = 0; i < mutation.removedNodes.length; i++) {
                const node = mutation.removedNodes[i];
                if (node.nodeType === 1) { // ELEMENT_NODE
                  if (node.hasAttribute && node.hasAttribute('data-bs-toggle')) {
                    elementRemoved = true;
                    break;
                  } else if (node.querySelector && node.querySelector('[data-bs-toggle="tooltip"]')) {
                    elementRemoved = true;
                    break;
                  }
                }
              }
            }
          }
        });
        
        if (shouldInit) {
          setTimeout(initTooltips, 100);
        }
        
        if (elementRemoved) {
          // When elements are removed, clean up any orphaned tooltips
          setTimeout(cleanupOrphanedTooltips, 50);
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Event listener for document clicks to ensure tooltips don't stay when a button click 
      // triggers a deletion or a modal closing
      document.addEventListener('click', () => {
        setTimeout(cleanupOrphanedTooltips, 100);
      });
      
      return () => {
        const tooltipElements = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltipElements.forEach(element => {
          const tooltip = window.bootstrap.Tooltip.getInstance(element);
          if (tooltip) {
            tooltip.dispose();
          }
        });
        
        // Clean up any remaining tooltips
        cleanupOrphanedTooltips();
        
        // Remove event listener
        document.removeEventListener('click', cleanupOrphanedTooltips);
        
        observer.disconnect();
      };
    }
  }, []);
  
  return null; 
};

export default TooltipInitializer;