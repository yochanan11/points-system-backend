// CustomAlert.js
import React, { useEffect } from 'react';

function CustomAlert({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert alert-${type} alert-dismissible fade show`} role="alert" style={{ position: 'fixed', top: '60px', left: '50%', transform: 'translateX(-50%)', zIndex: 1050, width: '50vw', maxWidth: '600px', whiteSpace: 'nowrap',textAlign: 'center' }}>
      {message}
      <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
    </div>
  );
}

export default CustomAlert;
