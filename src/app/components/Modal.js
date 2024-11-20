'use client';
import { useEffect } from 'react';
import './Modal.css'; // Importa el CSS

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target.id === 'modal-overlay') {
      onClose();
    }
  };

  return (
    <div
      id="modal-overlay"
      className="modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="modal-container">
        <button
          className="modal-close-button"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="modal-content">{children}</div>
      </div>
    </div>
  );
}
