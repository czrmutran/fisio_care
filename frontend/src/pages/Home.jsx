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
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-2xl font-bold text-blue-700">
                Fisio Care
              </Link>
            </div>
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
    </div>
  )
}

export default Home