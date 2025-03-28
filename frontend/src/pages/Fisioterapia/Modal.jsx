import React, { useEffect, useRef } from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [inputValue, setInputValue] = React.useState(initialData);
  const modalRef = useRef(null);

  useEffect(() => {
    setInputValue(initialData);
  }, [initialData]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Focus trap
      modalRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSubmit(inputValue);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container"
        onClick={e => e.stopPropagation()}
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-content">
          <h2 id="modal-title">Editar Paciente</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="paciente-nome">Nome do Paciente</label>
              <input
                id="paciente-nome"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Nome do paciente"
                autoFocus
              />
            </div>
            <div className="modal-buttons">
              <button 
                type="button" 
                onClick={onClose}
                className="btn-secondary"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="btn-primary"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;