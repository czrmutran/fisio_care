import React, { useState } from 'react';
import './Modal.css';

const ModalPaciente = ({ isOpen, onClose, onSubmit, dadosAtuais }) => {
  // Estado local para edição
  const [dados, setDados] = useState(dadosAtuais);
  const [fotoUrl, setFotoUrl] = useState(dadosAtuais.foto);

  // Salva alterações
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...dados, foto: fotoUrl });
    onClose();
  };

  // Atualiza apenas a foto
  const handleFotoChange = (e) => {
    const url = e.target.value;
    setFotoUrl(url);
    setDados(prev => ({ ...prev, foto: url }));
  };

  if (!isOpen) return null; // se não estiver aberto, não renderiza nada

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo-paciente"
      >
        <div className="modal-content">
          <h2 id="modal-titulo-paciente">Editar Informações do Paciente</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nome-paciente">Nome</label>
              <input
                id="nome-paciente"
                type="text"
                value={dados.nome}
                onChange={(e) => setDados({ ...dados, nome: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="data-nascimento">Data de Nascimento</label>
              <input
                id="data-nascimento"
                type="date"
                value={dados.dataNascimento}
                onChange={(e) => setDados({ ...dados, dataNascimento: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cpf-paciente">CPF</label>
              <input
                id="cpf-paciente"
                type="text"
                value={dados.cpf}
                onChange={(e) => setDados({ ...dados, cpf: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="telefone-paciente">Telefone</label>
              <input
                id="telefone-paciente"
                type="text"
                value={dados.telefone}
                onChange={(e) => setDados({ ...dados, telefone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email-paciente">Email</label>
              <input
                id="email-paciente"
                type="email"
                value={dados.email}
                onChange={(e) => setDados({ ...dados, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="foto-paciente">URL da Foto</label>
              <input
                id="foto-paciente"
                type="text"
                value={fotoUrl}
                onChange={handleFotoChange}
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

export default ModalPaciente;
