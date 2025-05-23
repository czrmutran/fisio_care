"use client"

import { useNavigate, Link } from "react-router-dom"
import { ArrowRight, Calendar, Award, Heart, Users } from "lucide-react"
import { useAuth } from "../context/AuthContext"

const Home = () => {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const handleLogin = () => {
    navigate("/login")
  }

  const handleRegister = () => {
    navigate("/register")
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleDashboard = () => {
    navigate("/dashboard")
  }

  const handleSchedule = () => {
    navigate("/agendar-consulta")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-700">
                Fisio Care
              </Link>
            </div>
            <div className="flex space-x-4">
              {isAuthenticated ? (
                <>
                  <button onClick={handleDashboard} className="px-4 py-2 text-blue-600 hover:text-blue-800 transition">
                    Dashboard
                  </button>
                  <button onClick={handleSchedule} className="px-4 py-2 text-blue-600 hover:text-blue-800 transition">
                    Agendar Consulta
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleLogin}
                    className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={handleRegister}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Cadastrar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <h2 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block xl:inline">Cuidados especializados</span>{" "}
                  <span className="block text-blue-600 xl:inline">para sua saúde</span>
                </h2>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Fisio Care oferece tratamentos personalizados de fisioterapia para melhorar sua qualidade de vida.
                  Nossa equipe de profissionais qualificados está pronta para cuidar de você.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  {isAuthenticated ? (
                    <div className="rounded-md shadow">
                      <button
                        onClick={handleSchedule}
                        className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                      >
                        Agendar Consulta
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-md shadow">
                        <button
                          onClick={handleRegister}
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
                        >
                          Começar agora
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </button>
                      </div>
                      <div className="mt-3 sm:mt-0 sm:ml-3">
                        <button
                          onClick={handleLogin}
                          className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
                        >
                          Já sou cliente
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="/musc.png"
            alt="Fisioterapia"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Nossos Serviços</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Tratamentos especializados para suas necessidades
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Oferecemos uma variedade de serviços de fisioterapia para ajudar você a se recuperar e melhorar sua
              qualidade de vida.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Calendar className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Fisioterapia Ortopédica</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Tratamento para lesões musculoesqueléticas, dores articulares, pós-operatórios e reabilitação
                    física.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Heart className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Fisioterapia Neurológica</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Reabilitação para pacientes com condições neurológicas como AVC, Parkinson, esclerose múltipla e
                    lesões medulares.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Users className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Fisioterapia Respiratória</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Tratamento para condições respiratórias como asma, DPOC, bronquite e recuperação pós-COVID.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Award className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Fisioterapia Esportiva</h3>
                  <p className="mt-2 text-base text-gray-500">
                    Prevenção e tratamento de lesões esportivas, melhora de desempenho e recuperação pós-competição.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Pronto para começar?</span>
            <span className="block text-blue-200">Agende sua consulta hoje mesmo.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            {isAuthenticated ? (
              <div className="inline-flex rounded-md shadow">
                <button
                  onClick={handleSchedule}
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                >
                  Agendar Consulta
                </button>
              </div>
            ) : (
              <>
                <div className="inline-flex rounded-md shadow">
                  <button
                    onClick={handleRegister}
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
                  >
                    Cadastre-se
                  </button>
                </div>
                <div className="ml-3 inline-flex rounded-md shadow">
                  <button
                    onClick={handleLogin}
                    className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Entrar
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; 2025 Fisio Care. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
