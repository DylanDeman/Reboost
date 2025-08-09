import React, { useRef, useEffect } from 'react';

/**
 * Component that wraps disabled buttons to make tooltips work with them
 */
const DisabledButtonTooltip = ({ children, title, placement = 'top' }) => {
  const wrapperRef = useRef(null);
  
  useEffect(() => {
    const wrapper = wrapperRef.current;
    
    if (!wrapper || typeof window === 'undefined' || !window.bootstrap) {
      return;
    }
    
  
    const tooltip = new window.bootstrap.Tooltip(wrapper, {
      title,
      placement,
      trigger: 'hover focus', 
      container: 'body'       
    });
    
  
    return () => {
      if (tooltip) {
        tooltip.dispose();
      }
    };
  }, [title, placement]);
  
  return (
    <span
      ref={wrapperRef}
      className="tooltip-wrapper d-inline-block"
      style={{ cursor: 'not-allowed' }}
      data-bs-original-title={title} 
    >
      {children}
    </span>
  );
};

export default DisabledButtonTooltip;
