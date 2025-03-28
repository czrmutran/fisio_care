import React, { useState } from 'react';
import './DashboardPaciente.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import ModalPaciente from './ModalPaciente';
import ModalReagendar from './ModalReagendar';


function DashboardPaciente() {
  // --------------------------------------
  // ESTADO: Informações do Paciente
  // --------------------------------------
  const [dadosPaciente, setDadosPaciente] = useState({
    nome: 'Maria da Silva',
    dataNascimento: '1990-01-01',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-9999',
    email: 'maria.silva@exemplo.com',
    foto: 'https://cdn-icons-png.flaticon.com/512/2919/2919600.png'
  });
  const [modalPacienteOpen, setModalPacienteOpen] = useState(false);

  // --------------------------------------
  // ESTADO: Agendamentos (Consultas)
  // --------------------------------------
  const [dataConsulta, setDataConsulta] = useState('');
  const [hora, setHora] = useState('');
  const [modalidade, setModalidade] = useState('');
  const [medico, setMedico] = useState('');

  const [consultas, setConsultas] = useState([]);

  // --------------------------------------
  // ESTADO: Modal de Reagendar
  // --------------------------------------
  const [modalReagendarOpen, setModalReagendarOpen] = useState(false);
  const [consultaEditando, setConsultaEditando] = useState(null); // Guardará o índice ou objeto da consulta

  // --------------------------------------
  // FUNÇÃO: Agendar nova consulta
  // --------------------------------------
  const handleAdicionarConsulta = () => {
    // Validação simples
    if (!dataConsulta) return;
    if (!hora) return;
    if (!modalidade.trim()) return;
    if (!medico.trim()) return;

    // Cria objeto da consulta
    const novaConsulta = {
      data: dataConsulta,
      hora: hora,
      modalidade: modalidade,
      medico: medico
    };
    setConsultas([...consultas, novaConsulta]);

    // Limpa campos
    setDataConsulta('');
    setHora('');
    setModalidade('');
    setMedico('');
  };

  // --------------------------------------
  // FUNÇÃO: Remover uma consulta
  // --------------------------------------
  const handleRemoverConsulta = (index) => {
    const novasConsultas = consultas.filter((_, i) => i !== index);
    setConsultas(novasConsultas);
  };

  // --------------------------------------
  // FUNÇÃO: Abrir modal de reagendar
  // --------------------------------------
  const handleReagendar = (index) => {
    // Pega os dados da consulta que será editada
    const consulta = consultas[index];
    setConsultaEditando({ ...consulta, index });
    setModalReagendarOpen(true);
  };

  // --------------------------------------
  // FUNÇÃO: Atualizar uma consulta já existente
  // --------------------------------------
  const handleUpdateConsulta = (dadosAtualizados) => {
    // dadosAtualizados contém { data, hora, modalidade, medico, index }
    const { index } = dadosAtualizados;
    if (index == null) return; // segurança

    const novasConsultas = [...consultas];
    novasConsultas[index] = {
      data: dadosAtualizados.data,
      hora: dadosAtualizados.hora,
      modalidade: dadosAtualizados.modalidade,
      medico: dadosAtualizados.medico
    };
    setConsultas(novasConsultas);
  };

  // --------------------------------------
  // FUNÇÃO: Atualizar dados do Paciente
  // --------------------------------------
  const handleUpdatePaciente = (novosDados) => {
    setDadosPaciente(novosDados);
  };

  return (
    <div className="dashboard-paciente">
      <header className="dashboard-header">

        {/* ========================
            CARD: Informações do Paciente
        ======================== */}
        <section className="info-paciente">
          <div className="foto-paciente">
            <img src={dadosPaciente.foto} alt="Paciente" />
          </div>
          <h2>Informações do Paciente</h2>
          <div className="info-details">
            <p><strong>Nome:</strong> {dadosPaciente.nome}</p>
            <p><strong>Data de Nascimento:</strong> {dadosPaciente.dataNascimento}</p>
            <p><strong>CPF:</strong> {dadosPaciente.cpf}</p>
            <p><strong>Telefone:</strong> {dadosPaciente.telefone}</p>
            <p><strong>Email:</strong> {dadosPaciente.email}</p>
          </div>
          <button
            onClick={() => setModalPacienteOpen(true)}
            className="btn-edit-paciente"
          >
            <FontAwesomeIcon icon={faEdit} /> Editar Informações
          </button>
        </section>

        {/* ========================
            CARD: Agendar Consulta
        ======================== */}
        <section className="agendar-consulta">
          <div className="input-area">
            <h2>Agendar Consulta</h2>

            {/* DATA (type="date") */}
            <div className="form-group">
              <label>Data da Consulta</label>
              <input
                type="date"
                value={dataConsulta}
                onChange={(e) => setDataConsulta(e.target.value)}
              />
            </div>

            {/* HORA (select com opções 08:00 ~ 17:00) */}
            <div className="form-group">
              <label>Hora</label>
              <select
                value={hora}
                onChange={(e) => setHora(e.target.value)}
              >
                <option value="">Selecione</option>
                {Array.from({ length: 10 }, (_, i) => {
                  // Gera horas de 08 até 17
                  const hour = 8 + i; // 8,9,10,...,17
                  const hourStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
                  return (
                    <option key={hour} value={hourStr}>{hourStr}</option>
                  );
                })}
              </select>
            </div>

            {/* MODALIDADE (Musculação, Hidroginástica, Fisioterapia Pélvica) */}
            <div className="form-group">
              <label>Modalidade</label>
              <select
                value={modalidade}
                onChange={(e) => setModalidade(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Musculação">Musculação</option>
                <option value="Hidroginástica">Hidroginástica</option>
                <option value="Fisioterapia Pélvica">Fisioterapia Pélvica</option>
              </select>
            </div>

            {/* MÉDICO (Lionel, Cristiano, Neymar) */}
            <div className="form-group">
              <label>Médico</label>
              <select
                value={medico}
                onChange={(e) => setMedico(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="Lionel Messi">Lionel Messi</option>
                <option value="Cristiano Ronaldo">Cristiano Ronaldo</option>
                <option value="Neymar Junior">Neymar Junior</option>
              </select>
            </div>

            <button onClick={handleAdicionarConsulta} className="btn-add">
              Marcar Consulta
            </button>
          </div>

          {/* ========================
              LISTA: Minhas Consultas
          ======================== */}
          <section className="lista-consultas">
            <h2>Minhas Consultas</h2>
            <ul className="consultas-list">
              {consultas.map((consulta, index) => (
                <li key={index} className="consulta-item">
                  <div className="consulta-info">
                  <p><strong>Data:</strong> {consulta.data.split('-').reverse().join('/')}</p>
                  <p><strong>Hora:</strong> {consulta.hora}</p>
                  <p><strong>Modalidade:</strong> {consulta.modalidade}</p>
                  <p><strong>Médico:</strong> {consulta.medico}</p>
                  </div>
                  <div className="consulta-actions">
                    {/* BOTÃO REAGENDAR */}
                    <button
                      className="btn-icon"
                      onClick={() => handleReagendar(index)}
                      aria-label="Reagendar consulta"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    {/* BOTÃO REMOVER */}
                    <button
                      className="btn-icon delete"
                      onClick={() => handleRemoverConsulta(index)}
                      aria-label="Remover consulta"
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

      {/* MODAL para editar dados do Paciente */}
      <ModalPaciente
        isOpen={modalPacienteOpen}
        onClose={() => setModalPacienteOpen(false)}
        onSubmit={handleUpdatePaciente}
        dadosAtuais={dadosPaciente}
      />

      {/* MODAL para Reagendar uma Consulta existente */}
      <ModalReagendar
        isOpen={modalReagendarOpen}
        onClose={() => setModalReagendarOpen(false)}
        consulta={consultaEditando}
        onSubmit={handleUpdateConsulta}
      />
    </div>
  );
}

export default DashboardPaciente;
