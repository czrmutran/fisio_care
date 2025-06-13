"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { ArrowRight, Calendar, Award, Heart, Users, ChevronRight, Star, Menu, X } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const navigate = useNavigate()
  const { user, role, logout } = useAuth()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Função para rolagem suave
  const scrollToSection = (elementId) => {
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Verificar autenticação
  useEffect(() => {
    setIsAuthenticated(!!user)
  }, [user])

  // Detectar scroll para mudar o estilo da navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogin = () => {
    if (role === "fisioterapeuta") navigate("/login-fisioterapeuta")
    else navigate("/login")
  }

  const handleRegister = () => {
    if (role === "fisioterapeuta") navigate("/cadastro-fisioterapeuta")
    else navigate("/register")
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleDashboard = () => {
    if (role === "fisioterapeuta") navigate("/dashboard-fisioterapeuta")
    else navigate("/dashboard")
  }

  const handleSchedule = () => navigate("/agendar-consulta")

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  // Depoimentos de pacientes
  const testimonials = [
    {
      name: "Ana Silva",
      role: "Paciente de Fisioterapia Ortopédica",
      image: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-female-9.png",
      quote:
        "A Fisio Care transformou minha recuperação após a cirurgia no joelho. Em apenas 2 meses, voltei a praticar esportes sem dor.",
      rating: 5,
    },
    {
      name: "Carlos Oliveira",
      role: "Paciente de Fisioterapia Neurológica",
      image:
        "https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png",
      quote:
        "Após meu AVC, achei que nunca mais teria independência. Com o tratamento personalizado, recuperei movimentos que achei perdidos.",
      rating: 5,
    },
    {
      name: "Mariana Costa",
      role: "Atleta Profissional",
      image: "https://icons.veryicon.com/png/o/miscellaneous/user-avatar/user-avatar-male-5.png",
      quote:
        "Como atleta, lesões são parte do caminho. A equipe da Fisio Care não só me recuperou, mas me ensinou a prevenir novas lesões.",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <span className={`text-2xl font-bold ${isScrolled ? "text-blue-600" : "text-blue-600"}`}>Fisio Care</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#servicos"
                className={`${isScrolled ? "text-gray-700" : "text-gray-800"} hover:text-blue-600 transition-colors`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("servicos").scrollIntoView({ behavior: "smooth" })
                }}
              >
                Serviços
              </a>
              <a
                href="#sobre"
                className={`${isScrolled ? "text-gray-700" : "text-gray-800"} hover:text-blue-600 transition-colors`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("sobre").scrollIntoView({ behavior: "smooth" })
                }}
              >
                Sobre nós
              </a>
              <a
                href="#depoimentos"
                className={`${isScrolled ? "text-gray-700" : "text-gray-800"} hover:text-blue-600 transition-colors`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("depoimentos").scrollIntoView({ behavior: "smooth" })
                }}
              >
                Depoimentos
              </a>
              <a
                href="#contato"
                className={`${isScrolled ? "text-gray-700" : "text-gray-800"} hover:text-blue-600 transition-colors`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("contato").scrollIntoView({ behavior: "smooth" })
                }}
              >
                Contato
              </a>

              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleDashboard}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center">
                      {user?.nome_completo?.charAt(0) || "U"}
                    </div>
                    <span>Minha Área</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Sair
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={handleRegister}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Cadastrar
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-600 focus:outline-none">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg mt-2 py-4 px-4 absolute w-full">
            <div className="flex flex-col space-y-4">
              <a
                href="#servicos"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("servicos").scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
              >
                Serviços
              </a>
              <a
                href="#sobre"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("sobre").scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
              >
                Sobre nós
              </a>
              <a
                href="#depoimentos"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("depoimentos").scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
              >
                Depoimentos
              </a>
              <a
                href="#contato"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById("contato").scrollIntoView({ behavior: "smooth" })
                  setIsMenuOpen(false)
                }}
              >
                Contato
              </a>

              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => {
                        handleDashboard()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-50 text-blue-700"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-200 flex items-center justify-center text-sm">
                        {user?.nome_completo?.charAt(0) || "U"}
                      </div>
                      <span>Minha Área</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <button
                      onClick={() => {
                        handleLogin()
                        setIsMenuOpen(false)
                      }}
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md"
                    >
                      Entrar
                    </button>
                    <button
                      onClick={() => {
                        handleRegister()
                        setIsMenuOpen(false)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    >
                      Cadastrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="text-gray-900">Cuidados especializados </span>
                <span className="text-blue-600">para sua saúde</span>
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-lg mx-auto lg:mx-0">
                Fisio Care oferece tratamentos personalizados de fisioterapia para melhorar sua qualidade de vida, com
                profissionais experientes e técnicas modernas.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                {isAuthenticated ? (
                  <button
                    onClick={handleSchedule}
                    className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Agendar Consulta <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleRegister}
                      className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      Começar agora <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                    <button
                      onClick={handleLogin}
                      className="px-8 py-3 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors flex items-center justify-center"
                    >
                      Já sou cliente
                    </button>
                  </>
                )}
              </div>
              <div className="mt-8 flex items-center justify-center lg:justify-start space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-blue-600 text-xs"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">+500</span> pacientes satisfeitos
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-blue-100 rounded-full opacity-70"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-50 rounded-full opacity-70"></div>
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://www.florence.edu.br/blog/wp-content/uploads/2021/07/Florence-importancia-da-Fisioterapia.jpg"
                  alt="Fisioterapeuta auxiliando paciente"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold uppercase tracking-wide">Nossos Serviços</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Tratamentos especializados</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Oferecemos uma variedade de serviços de fisioterapia personalizados para atender às suas necessidades
              específicas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Calendar className="h-6 w-6" />,
                title: "Fisioterapia Ortopédica",
                desc: "Tratamento para lesões musculoesqueléticas, pós-operatórios e reabilitação física.",
              },
              {
                icon: <Heart className="h-6 w-6" />,
                title: "Fisioterapia Neurológica",
                desc: "Reabilitação para pacientes com AVC, Parkinson, esclerose múltipla e outras condições neurológicas.",
              },
              {
                icon: <Users className="h-6 w-6" />,
                title: "Fisioterapia Respiratória",
                desc: "Tratamento para asma, DPOC, bronquite, fibrose cística e recuperação pós-COVID.",
              },
              {
                icon: <Award className="h-6 w-6" />,
                title: "Fisioterapia Esportiva",
                desc: "Prevenção e tratamento de lesões esportivas, melhora de desempenho e recuperação.",
              },
            ].map((service, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
                <a href="#" className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800">
                  Saiba mais <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-base text-blue-600 font-semibold uppercase tracking-wide">Sobre nós</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Excelência em fisioterapia há mais de 10 anos
              </p>
              <p className="mt-4 text-lg text-gray-600">
                A Fisio Care nasceu da paixão por ajudar pessoas a recuperarem sua mobilidade e qualidade de vida. Nossa
                equipe é formada por profissionais especializados e comprometidos com o bem-estar de cada paciente.
              </p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Equipe especializada</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      Profissionais com pós-graduação e constante atualização.
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Award className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Tratamento personalizado</h4>
                    <p className="mt-1 text-sm text-gray-600">Planos adaptados às necessidades de cada paciente.</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Agendamento flexível</h4>
                    <p className="mt-1 text-sm text-gray-600">Horários que se adaptam à sua rotina.</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Heart className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Cuidado integral</h4>
                    <p className="mt-1 text-sm text-gray-600">Abordagem que considera todos os aspectos da saúde.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-100 rounded-full opacity-70"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-50 rounded-full opacity-70"></div>
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <img
                  src="https://www.maisterapias.com.br/wp-content/uploads/2025/02/1502.png"
                  alt="Equipe Fisio Care"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold uppercase tracking-wide">Depoimentos</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">O que nossos pacientes dizem</p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Histórias reais de pessoas que transformaram suas vidas com nossos tratamentos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Pronto para começar sua jornada de recuperação?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Agende sua consulta hoje mesmo e dê o primeiro passo para uma vida com mais movimento e menos dor.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <button
                  onClick={handleSchedule}
                  className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                >
                  Agendar Consulta <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleRegister}
                    className="px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    Cadastrar <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                  <button
                    onClick={handleLogin}
                    className="px-8 py-3 bg-blue-700 text-white border border-white rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center"
                  >
                    Entrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contato" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-base text-blue-600 font-semibold uppercase tracking-wide">Contato</h2>
              <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">Entre em contato conosco</p>
              <p className="mt-4 text-lg text-gray-600">
                Estamos à disposição para esclarecer suas dúvidas e ajudar no que for preciso.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Telefone</h4>
                    <p className="mt-1 text-gray-600">(11) 9999-9999</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Email</h4>
                    <p className="mt-1 text-gray-600">contato@fisiocare.com</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900">Endereço</h4>
                    <p className="mt-1 text-gray-600">Av. Alcindo Cacela, 287 - Umarizal, Belém - PA, 66060-902</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Como podemos ajudar?"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Enviar mensagem
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Fisio Care</h3>
              <p className="text-gray-400">Cuidando da sua saúde e bem-estar com excelência e dedicação.</p>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Fisio Care</h3>
              <p className="text-gray-400">Cuidando da sua saúde e bem-estar com excelência e dedicação.</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Links rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#servicos" className="text-gray-400 hover:text-white transition-colors">
                    Serviços
                  </a>
                </li>
                <li>
                  <a href="#sobre" className="text-gray-400 hover:text-white transition-colors">
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a href="#depoimentos" className="text-gray-400 hover:text-white transition-colors">
                    Depoimentos
                  </a>
                </li>
                <li>
                  <a href="#contato" className="text-gray-400 hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Fisioterapia Ortopédica
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Fisioterapia Neurológica
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Fisioterapia Respiratória
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Fisioterapia Esportiva
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Redes sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Fisio Care. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
