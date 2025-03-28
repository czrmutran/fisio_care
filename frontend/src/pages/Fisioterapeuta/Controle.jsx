import React, { useState, useRef } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Controle.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import Modal from './Modal';
import ModalFisioterapeuta from './ModalFisioterapeuta';

function Controle() {
  const [date, setDate] = useState(new Date());
  const [pacientes, setPacientes] = useState([]);
  const [nome, setNome] = useState('');
  const [sintomas, setSintomas] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [erroNome, setErroNome] = useState('');
  const [erroSintomas, setErroSintomas] = useState('');
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

  const LIMITE_CARACTERES = 50;
  const MIN_CARACTERES = 3;

  const validarNome = (nomeInput) => {
    if (nomeInput.trim() === '') {
      setErroNome('Por favor, insira o nome do paciente');
      return false;
    }
    if (nomeInput.trim().length < MIN_CARACTERES) {
      setErroNome(`O nome deve ter no mínimo ${MIN_CARACTERES} caracteres`);
      return false;
    }
    if (nomeInput.length > LIMITE_CARACTERES) {
      setErroNome(`O nome não pode ter mais que ${LIMITE_CARACTERES} caracteres`);
      return false;
    }
    setErroNome('');
    return true;
  };

  const validarSintomas = (sintomasInput) => {
    if (sintomasInput.trim() === '') {
      setErroSintomas('Por favor, descreva os sintomas do paciente');
      return false;
    }
    setErroSintomas('');
    return true;
  };

  const adicionarPaciente = () => {
    if (!date) {
      return;
    }
    if (nome.trim().length < MIN_CARACTERES) {
      setErroNome(`O nome deve ter no mínimo ${MIN_CARACTERES} caracteres`);
      return;
    }
    if (!validarNome(nome) || !validarSintomas(sintomas)) {
      return;
    }
    setPacientes([...pacientes, { 
      nome, 
      consulta: format(date, 'P', { locale: ptBR }),
      sintomas 
    }]);
    setNome('');
    setSintomas('');
    setShowCalendar(false);
  };

  const removerPaciente = (index) => {
    const novosPacientes = pacientes.filter((_, i) => i !== index);
    setPacientes(novosPacientes);
  };

  const editarPaciente = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleUpdatePaciente = (novoNome) => {
    if (editingIndex !== null && validarNome(novoNome)) {
      const novosPacientes = [...pacientes];
      novosPacientes[editingIndex] = {
        ...novosPacientes[editingIndex],
        nome: novoNome
      };
      setPacientes(novosPacientes);
    }
  };

  const handleUpdateFisioterapeuta = (novosDados) => {
    setDadosFisioterapeuta(novosDados);
  };

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
            <FontAwesomeIcon icon={faEdit} /> Editar Informações
          </button>
        </section>

        <section className="consultas-e-avisos">
          <div className="input-area">
            <h2>Adicionar Paciente</h2>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nome do Paciente"
                value={nome}
                onChange={(e) => {
                  const novoNome = e.target.value;
                  if (novoNome.length <= LIMITE_CARACTERES) {
                    setNome(novoNome);
                  }
                  validarNome(novoNome);
                }}
                maxLength={LIMITE_CARACTERES}
                aria-label="Nome do Paciente"
                className="input-field"
              />
              {nome.length > 0 && (
                <span className={`contador-caracteres ${nome.length < MIN_CARACTERES ? 'texto-vermelho' : ''}`}>
                  {nome.length}/{LIMITE_CARACTERES} caracteres (mínimo: {MIN_CARACTERES})
                </span>
              )}
              {erroNome && <span className="erro-mensagem">{erroNome}</span>}
            </div>

            <div className="form-group">
              <textarea
                placeholder="Descreva os sintomas"
                value={sintomas}
                onChange={(e) => {
                  setSintomas(e.target.value);
                  validarSintomas(e.target.value);
                }}
                className="textarea-sintomas"
                aria-label="Sintomas do Paciente"
              />
              {erroSintomas && <span className="erro-mensagem">{erroSintomas}</span>}
            </div>

            <div className="calendar-container">
              <button 
                onClick={() => setShowCalendar(!showCalendar)}
                className="btn-calendar"
              >
                {showCalendar ? 'Fechar Calendário' : 'Selecionar Data'}
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
            <button onClick={adicionarPaciente} className="btn-add">
              Adicionar Paciente
            </button>
          </div>
          
          <section className="lista-pacientes">
            <h2>Lista de Pacientes</h2>
            <ul className="pacientes-list">
              {pacientes.map((paciente, index) => (
                <li key={index} className="paciente-item">
                  <div className="paciente-info">
                    <div className="paciente-nome">{paciente.nome} - {paciente.consulta}</div>
                    <div className="paciente-sintomas">{paciente.sintomas}</div>
                  </div>
                  <div className="paciente-actions">
                    <button
                      className="btn-icon"
                      onClick={() => editarPaciente(index)}
                      aria-label="Editar paciente"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => removerPaciente(index)}
                      aria-label="Remover paciente"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </section>
      </header>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleUpdatePaciente}
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