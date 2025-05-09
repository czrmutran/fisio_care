import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Controle.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Modal from './Modal';
import ModalFisioterapeuta from './ModalFisioterapeuta';

function Controle() {
  const [date, setDate] = useState(new Date());
  const [pacientes] = useState([
    { 
      nome: 'Maria Silva', 
      consulta: '15/10/2023',
      sintomas: 'Dor lombar'
    },
    { 
      nome: 'João Santos', 
      consulta: '16/10/2023',
      sintomas: 'Tendinite no ombro'
    },
    { 
      nome: 'Ana Oliveira', 
      consulta: '17/10/2023',
      sintomas: 'Recuperação pós-cirúrgica'
    }
  ]);
  const [filtroNome, setFiltroNome] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFisioOpen, setModalFisioOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [dadosFisioterapeuta, setDadosFisioterapeuta] = useState({
    nome: 'Dr. João Silva',
    cargo: 'Fisioterapeuta Ocupacional',
    crefito: '1/12345',
    telefone: '(11) 99999-9999',
    email: 'dr.joao@fisioterapia.com',
    foto: 'https://cdn-icons-png.flaticon.com/512/3952/3952988.png'
  });

  const handleUpdateFisioterapeuta = (novosDados) => {
    setDadosFisioterapeuta(novosDados);
  };

  const pacientesFiltrados = pacientes.filter(paciente => {
    const matchNome = paciente.nome.toLowerCase().includes(filtroNome.toLowerCase());
    if (!showCalendar) return matchNome;
    return matchNome && paciente.consulta === format(date, 'P', { locale: ptBR });
  });

  return (
    <div className="controle">
      <header className="controle-header">
        <section className="info-medico">
          <div className="foto-fisioterapeuta">
            <img src={dadosFisioterapeuta.foto} alt="Fisioterapeuta" />
          </div>
          <h2>Informações do Fisioterapeuta</h2>
          <div className="info-details">
            <p><strong>Nome:</strong> {dadosFisioterapeuta.nome}</p>
            <p><strong>Cargo:</strong> {dadosFisioterapeuta.cargo}</p>
            <p><strong>CREFITO:</strong> {dadosFisioterapeuta.crefito}</p>
            <p><strong>Telefone:</strong> {dadosFisioterapeuta.telefone}</p>
            <p><strong>Email:</strong> {dadosFisioterapeuta.email}</p>
          </div>
          <button 
            onClick={() => setModalFisioOpen(true)}
            className="btn-edit-fisio"
          >
            Editar Informações
          </button>
        </section>

        <section className="consultas-e-avisos">
          <div className="input-area">
            <h2>Visualizar Pacientes</h2>
            <div className="search-container">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="Buscar paciente por nome..."
                  value={filtroNome}
                  onChange={(e) => setFiltroNome(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>

            <div className="calendar-container">
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="btn-calendar"
              >
                {showCalendar ? 'Ocultar Calendário' : 'Filtrar por Data'}
              </button>
              {showCalendar && (
                <Calendar
                  onChange={setDate}
                  value={date}
                  locale="pt-BR"
                  className="calendar-custom"
                />
              )}
            </div>
          </div>
          
          <section className="lista-pacientes">
            <h2>Pacientes Encontrados</h2>
            {pacientesFiltrados.length === 0 ? (
              <p className="no-results">Nenhum paciente encontrado com os filtros atuais.</p>
            ) : (
              <ul className="pacientes-list">
                {pacientesFiltrados.map((paciente, index) => (
                  <li key={index} className="paciente-item">
                    <div className="paciente-info">
                      <div className="paciente-nome">{paciente.nome} - {paciente.consulta}</div>
                      <div className="paciente-sintomas">{paciente.sintomas}</div>
                    </div>
                    <div className="paciente-actions">
                      <button
                        className="btn-icon"
                        onClick={() => {
                          setEditingIndex(index);
                          setModalOpen(true);
                        }}
                        aria-label="Visualizar detalhes do paciente"
                      >
                        Visualizar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </section>
      </header>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => {}}
        initialData={editingIndex !== null ? pacientes[editingIndex].nome : ''}
      />

      <ModalFisioterapeuta
        isOpen={modalFisioOpen}
        onClose={() => setModalFisioOpen(false)}
        onSubmit={handleUpdateFisioterapeuta}
        dadosAtuais={dadosFisioterapeuta}
      />
    </div>
  );
}

export default Controle;
