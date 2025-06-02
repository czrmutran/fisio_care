"use client"

import { useNavigate, Link } from "react-router-dom"
import { ArrowRight, Calendar, Award, Heart, Users } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, role, logout } = useAuth()

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

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="text-2xl font-bold text-blue-700">
              Fisio Care
            </Link>
            <div className="flex space-x-4 items-center">
              {isAuthenticated ? (
                <>
                  <img
                    onClick={handleDashboard}
                    src={user?.foto || "/placeholder.svg"}
                    alt="Avatar"
                    className="h-10 w-10 rounded-full cursor-pointer object-cover"
                  />
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={handleRegister}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Cadastrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Cuidados especializados</span>{" "}
                  <span className="block text-blue-600 xl:inline">para sua saúde</span>
                </h2>
                <p className="mt-3 text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:text-xl lg:mx-0">
                  Fisio Care oferece tratamentos personalizados de fisioterapia para melhorar sua qualidade de vida.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {isAuthenticated ? (
                    <button
                      onClick={handleSchedule}
                      className="flex items-center px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Agendar Consulta <ArrowRight className="ml-2 h-5 w-5" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleRegister}
                        className="flex items-center px-8 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Começar agora <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                      <button
                        onClick={handleLogin}
                        className="ml-3 flex items-center px-8 py-3 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        Já sou cliente
                      </button>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full"
            src="/musc.png"
            alt="Fisioterapia"
          />
        </div>
      </div>

      {/* Services Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-base text-blue-600 font-semibold uppercase">Nossos Serviços</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">Tratamentos especializados</p>
            <p className="mt-4 text-lg text-gray-500">
              Oferecemos uma variedade de serviços de fisioterapia personalizados.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[{
              icon: <Calendar className="h-6 w-6" />,
              title: "Ortopédica",
              desc: "Lesões musculoesqueléticas, pós-operatórios e reabilitação física."
            }, {
              icon: <Heart className="h-6 w-6" />,
              title: "Neurológica",
              desc: "Reabilitação para pacientes com AVC, Parkinson, esclerose múltipla."
            }, {
              icon: <Users className="h-6 w-6" />,
              title: "Respiratória",
              desc: "Tratamento para asma, DPOC, bronquite e recuperação pós-COVID."
            }, {
              icon: <Award className="h-6 w-6" />,
              title: "Esportiva",
              desc: "Lesões esportivas, melhora de desempenho e recuperação."
            }].map((service, idx) => (
              <div key={idx} className="flex items-start">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                  {service.icon}
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">{service.title}</h4>
                  <p className="mt-1 text-base text-gray-500">{service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 flex flex-col lg:flex-row items-center justify-between text-white">
          <h2 className="text-3xl font-bold mb-4 lg:mb-0">
            Pronto para começar?{" "}
            <span className="text-blue-200 block">Agende sua consulta hoje mesmo.</span>
          </h2>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <button
                onClick={handleSchedule}
                className="bg-white text-blue-600 px-5 py-3 rounded hover:bg-blue-50"
              >
                Agendar Consulta
              </button>
            ) : (
              <>
                <button
                  onClick={handleRegister}
                  className="bg-white text-blue-600 px-5 py-3 rounded hover:bg-blue-50"
                >
                  Cadastre-se
                </button>
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 border border-white px-5 py-3 rounded hover:bg-blue-800"
                >
                  Entrar
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4 text-center text-gray-400">
          &copy; 2025 Fisio Care. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  )
}

export default Home
