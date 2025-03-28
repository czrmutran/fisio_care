import React, { useEffect, useState } from 'react';
import './Modal.css';

const ModalReagendar = ({ isOpen, onClose, consulta, onSubmit }) => {
  const [data, setData] = useState('');
  const [hora, setHora] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [medico, setMedico] = useState('');
  const [index, setIndex] = useState(null);

  useEffect(() => {
    if (consulta) {
      setData(consulta.data || '');
      setHora(consulta.hora || '');
      setModalidade(consulta.modalidade || '');
      setMedico(consulta.medico || '');
      setIndex(consulta.index);
    }
  }, [consulta]);

  // Fecha o modal se não estiver aberto
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envia dados atualizados para a função onSubmit
    onSubmit({
      data,
      hora,
      modalidade,
      medico,
      index
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo-reagendar"
      >
        <div className="modal-content">
          <h2 id="modal-titulo-reagendar">Reagendar Consulta</h2>
          <form onSubmit={handleSubmit}>
            
            {/* Data */}
            <div className="form-group">
              <label htmlFor="data-consulta">Data</label>
              <input
                id="data-consulta"
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
              />
            </div>

            {/* Hora */}
            <div className="form-group">
              <label htmlFor="hora-consulta">Hora</label>
              <select
                id="hora-consulta"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              >
                <option value="">Selecione</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const hour = 8 + i; // 8..17
                  const hourStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
                  return (
                    <option key={hour} value={hourStr}>{hourStr}</option>
                  );
                })}
              </select>
            </div>

            {/* Modalidade */}
            <div className="form-group">
              <label htmlFor="modalidade">Modalidade</label>
              <select
                id="modalidade"
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Musculação">Musculação</option>
                <option value="Hidroginástica">Hidroginástica</option>
                <option value="Fisioterapia Pélvica">Fisioterapia Pélvica</option>
              </select>
            </div>

            {/* Médico */}
            <div className="form-group">
              <label htmlFor="medico">Médico</label>
              <select
                id="medico"
                value={medico}
                onChange={(e) => setMedico(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Lionel Messi">Lionel Messi</option>
                <option value="Cristiano Ronaldo">Cristiano Ronaldo</option>
                <option value="Neymar Junior">Neymar Junior</option>
              </select>
            </div>

            <div className="modal-buttons">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
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

export default ModalReagendar;
