import React from 'react';
import { FaClock, FaStethoscope, FaMapMarkerAlt, FaCalendarAlt, FaCalendarCheck } from 'react-icons/fa';
import aboutus from '../assets/img/aboutuss.png';
import hidr from '../assets/img/hidr.png';
import musc from '../assets/img/musc.png';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Home.css';

function Home() {
  const specialties = [
    {
      id: 1,
      title: 'Musculação',
      description: 'Treinamento de força para otimizar a saúde muscular e a resistência corporal.',
      image: musc
    },
    {
      id: 2,
      title: 'Hidroginástica',
      description: 'Exercícios aquáticos para melhorar a mobilidade e o condicionamento físico de forma segura.',
      image: hidr
    },

    {
      id: 3,
      title: 'Fisioterapia Pélvica',
      description: 'Tratamentos especializados para a saúde do assoalho pélvico e melhora na qualidade de vida.',
      image: 'https://via.placeholder.com/400x300.png?text=Fisioterapia+P%C3%A9lvica'
    },
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Mostra um slide por vez
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="home-page">
      {/* Navbar / Cabeçalho */}
      <header className="header">
        <nav className="navbar container">
          <div className="logo">Fisio Care</div>
          <ul className="nav-links">
            <li><a href="#home">Início</a></li>
            <li><a href="#services">Serviços</a></li>
            <li><a href="#specialty">Especialidades</a></li>
            <li><a href="#therapists">Profissionais</a></li>
            <li><a href="#contact">Contato</a></li>
          </ul>
        </nav>
      </header>
        
      {/* Seção Hero */}
          <section id="home" className="hero">
        <div className="hero-text">
          <h1>Fisioterapia Especializada</h1>
          <p>
            Oferecemos serviços de fisioterapia com uma equipe de profissionais dedicados a cuidar da sua saúde e bem-estar.
          </p>
          <button className="btn-primary">Agende sua Consulta</button>
        </div>
      </section>

      {/* Seção de Cards */}
      <section className="info-cards container">
        <div className="cards-grid">
          {/* Card 1: destaque com fundo azul */}
          <div className="info-card highlight-card">
            <div className="card-icon">
              <FaClock size={40} color="#fff" />
            </div>
            <h3>Horários</h3>
            <p>Segunda - Sexta: 08:00 - 20:00</p>
            <p>Sabado: 08:00 - 12:00</p>
            <p>Endereços: Informações adicionais</p>
          </div>

          {/* Card 2 */}
          <div className="info-card">
            <div className="card-icon">
              <FaCalendarAlt size={40} color="#004F83" />
            </div>
            <h3>Agendamentos</h3>
            <p>Agende sua consulta online</p>
            <button className="card-button">Agendar</button>
          </div>

          {/* Card 3 */}
          <div className="info-card">
            <div className="card-icon">
              <FaStethoscope size={40} color="#004F83" />
            </div>
            <h3>Profissionais</h3>
            <p>Encontre um especialista</p>
            <button className="card-button">Doutores</button>
          </div>

          {/* Card 4 */}
          <div className="info-card">
            <div className="card-icon">
              <FaMapMarkerAlt size={40} color="#004F83" />
            </div>
            <h3>Localização</h3>
            <p>Encontre a clínica mais próxima</p>
            <button className="card-button">Mapa</button>
          </div>
        </div>
      </section>

      <section className="about-us">
      <div className="about-text">
        <h2>SOBRE NÓS</h2>
        <h1>FisioCare é um time de experiência profissional</h1>
        <p>
        Oferecemos serviços de fisioterapia com uma equipe de profissionais dedicados a cuidar da sua saúde e bem-estar.Oferecemos serviços de fisioterapia com uma equipe de profissionais dedicados a cuidar da sua saúde e bem-estar.
        </p>
      </div>
      <div className="about-image">
        <img src={aboutus} alt="Sobre Nós" />
      </div>
    </section>

      {/* Seção de Especialidades */}
      
      <section className="specialties-carousel container">
  <h2>Nossas Especialidades</h2>

  <Slider
    dots={true}
    infinite={true}
    speed={500}
    slidesToShow={1}
    slidesToScroll={1}
    arrows={true}
    autoplay={true}
    autoplaySpeed={3000}
  >
    {specialties.map((item) => (
      <div key={item.id}>
        <div className="carousel-item">
          <div className="item-content">
            <img src={item.image} alt={item.title} />
            <div className="item-text">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </Slider>
</section>












<section className="appointment-section">
      <div className="appointment-form">
        <h1>Agende Sua Consulta Agora!</h1>
        <p>Rápido, fácil e direto ao ponto. Cuide do seu bem-estar hoje mesmo.</p>

        <form>
          <input type="text" placeholder="Nome Completo" required />
          <input type="email" placeholder="Email" required />
          <input type="tel" placeholder="Telefone" required />

          <select required>
            <option value="">Selecione o Serviço</option>
            <option>Musculação</option>
            <option>Fisioterapia Pélvica</option>
            <option>Hidroterapia</option>
            <option>Consulta Diária</option>
          </select>

          <div className="datetime-group">
            <input type="date" required />
            <input type="time" required />
          </div>

          <button type="submit" className="appointment-btn">
            Confirmar Agendamento
          </button>
        </form>
      </div>
    </section>


















         {/* Rodapé */}
         <footer class="footer">
  <div class="footer-container">
    <div class="footer-brand">
      <h2>FisioCare</h2>
      <p>Cuidando da sua saúde com excelência.</p>
    </div>

    <div class="footer-links">
      <div class="link-group">
        <h3>Links Rápidos</h3>
        <ul>
          <li><a href="#">Início</a></li>
          <li><a href="#">Sobre Nós</a></li>
          <li><a href="#">Especialidades</a></li>
          <li><a href="#">Equipe</a></li>
          <li><a href="#">Contato</a></li>
        </ul>
      </div>

      <div class="link-group">
        <h3>Especialidades</h3>
        <ul>
          <li><a href="#">Musculação</a></li>
          <li><a href="#">Fisioterapia Pélvica</a></li>
          <li><a href="#">Hidroterapia</a></li>
          <li><a href="#">Consulta Diária</a></li>
        </ul>
      </div>

      <div class="link-group">
        <h3>Contato</h3>
        <ul>
          <li>Email: contato@fisiocare.com</li>
          <li>Telefone: (11) 1234-5678</li>
          <li>Endereço: Rua Saúde, 123, São Paulo - SP</li>
        </ul>
      </div>
    </div>

    <div class="footer-social">
      <a href="#"><i class="fab fa-facebook-f"></i></a>
      <a href="#"><i class="fab fa-instagram"></i></a>
      <a href="#"><i class="fab fa-twitter"></i></a>
      <a href="#"><i class="fab fa-whatsapp"></i></a>
    </div>
  </div>

  <div class="footer-bottom">
    <p>&copy; 2025 FisioCare. Todos os direitos reservados.</p>
  </div>
</footer>
    </div>
  );
}

export default Home;