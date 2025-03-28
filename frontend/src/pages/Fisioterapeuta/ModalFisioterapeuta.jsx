import React, { useState } from 'react';
import './Modal.css';

const ModalFisioterapeuta = ({ isOpen, onClose, onSubmit, dadosAtuais }) => {
  const [dados, setDados] = useState(dadosAtuais);
  const [fotoUrl, setFotoUrl] = useState(dadosAtuais.foto);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...dados, foto: fotoUrl });
    onClose();
  };

  const handleFotoChange = (e) => {
    const url = e.target.value;
    setFotoUrl(url);
    setDados(prev => ({ ...prev, foto: url }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo-fisio"
      >
        <div className="modal-content">
          <h2 id="modal-titulo-fisio">Editar Informações do Fisioterapeuta</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome-fisio">Nome</label>
              <input
                id="nome-fisio"
                type="text"
                value={dados.nome}
                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
                placeholder="Nome do Fisioterapeuta"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cargo-fisio">Cargo</label>
              <input
                id="cargo-fisio"
                type="text"
                value={dados.cargo}
                onChange={(e) => setDados({ ...dados, cargo: e.target.value })}
                placeholder="Cargo"
              />
            </div>
            <div className="form-group">
              <label htmlFor="crefito-fisio">CREFITO</label>
              <input
                id="crefito-fisio"
                type="text"
                value={dados.crefito}
                onChange={(e) => setDados({ ...dados, crefito: e.target.value })}
                placeholder="Número do CREFITO"
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefone-fisio">Telefone</label>
              <input
                id="telefone-fisio"
                type="text"
                value={dados.telefone}
                onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
                placeholder="Telefone"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email-fisio">Email</label>
              <input
                id="email-fisio"
                type="email"
                value={dados.email}
                onChange={(e) => setDados({ ...dados, email: e.target.value })}
                placeholder="Email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="foto-fisio">URL da Foto</label>
              <input
                id="foto-fisio"
                type="text"
                value={fotoUrl}
                onChange={handleFotoChange}
                placeholder="URL da foto"
              />
            </div>
            <div className="modal-buttons">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalFisioterapeuta;