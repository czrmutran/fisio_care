"use client"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabaseClient"
import {
  Calendar,
  Clock,
  FileText,
  Pencil,
  XCircle,
  User,
  Phone,
  Mail,
  CreditCard,
  FileCheck,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ArrowRight,
  CalendarIcon,
  ClockIcon,
} from "lucide-react"

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedConsultation, setSelectedConsultation] = useState(null)
  const [editConsultation, setEditConsultation] = useState(null)
  const [newDate, setNewDate] = useState("")
  const [newTime, setNewTime] = useState("")
  const [activeTab, setActiveTab] = useState("proximas")
  const [stats, setStats] = useState({
    total: 0,
    concluidas: 0,
    agendadas: 0,
    canceladas: 0,
  })

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        if (!user?.id) {
          console.log("Usuário não encontrado, usando ID de demonstração")
          // Para demonstração, se não houver usuário, usamos um ID de demonstração
          const demoId = "demo-paciente-id"

          // Dados de demonstração para quando não há conexão com o banco
          const demoData = [
            {
              id: 1,
              service: "Fisioterapia Ortopédica",
              date: new Date().toISOString().split("T")[0],
              time: "14:00:00",
              status: "agendada",
              fisioterapeutas: { nome_completo: "Dr. Carlos Silva" },
            },
            {
              id: 2,
              service: "Avaliação Postural",
              date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              time: "10:30:00",
              status: "agendada",
              fisioterapeutas: { nome_completo: "Dra. Ana Oliveira" },
            },
            {
              id: 3,
              service: "Fisioterapia Respiratória",
              date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              time: "16:00:00",
              status: "concluida",
              fisioterapeutas: { nome_completo: "Dr. Marcos Santos" },
            },
          ]

          setConsultations(demoData)

          // Calcular estatísticas
          setStats({
            total: demoData.length,
            concluidas: demoData.filter((c) => c.status === "concluida").length,
            agendadas: demoData.filter((c) => c.status === "agendada").length,
            canceladas: demoData.filter((c) => c.status === "cancelada").length,
          })

          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("consultas")
          .select(
            "id, service, date, time, status, fisioterapeuta_id, fisioterapeutas!consultas_fisioterapeuta_id_fkey(nome_completo)",
          )
          .eq("cliente_id", user.id)
          .order("date", { ascending: true })

        if (error) throw error

        const consultationsData = data || []
        setConsultations(consultationsData)

        // Calcular estatísticas
        setStats({
          total: consultationsData.length,
          concluidas: consultationsData.filter((c) => c.status === "concluida").length,
          agendadas: consultationsData.filter((c) => c.status === "agendada" || c.status === "confirmada").length,
          canceladas: consultationsData.filter((c) => c.status === "cancelada").length,
        })
      } catch (err) {
        console.error("Erro ao carregar consultas:", err)
        setError("Não foi possível carregar suas consultas. Por favor, tente novamente mais tarde.")
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [user?.id])

  const cancelarConsulta = async () => {
    try {
      setLoading(true)

      const { error } = await supabase
        .from("consultas")
        .update({ status: "cancelada" })
        .eq("id", selectedConsultation.id)

      if (error) throw error

      setConsultations((prev) =>
        prev.map((c) => (c.id === selectedConsultation.id ? { ...c, status: "cancelada" } : c)),
      )

      // Atualizar estatísticas
      setStats((prev) => ({
        ...prev,
        agendadas: prev.agendadas - 1,
        canceladas: prev.canceladas + 1,
      }))

      setSelectedConsultation(null)
    } catch (err) {
      console.error("Erro ao cancelar consulta:", err)
      setError("Não foi possível cancelar a consulta. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const remarcarConsulta = (consultation) => {
    setEditConsultation(consultation)
    setNewDate(consultation.date)
    setNewTime(consultation.time)
  }

  const salvarEdicao = async () => {
    try {
      setLoading(true)

      const { error } = await supabase
        .from("consultas")
        .update({ date: newDate, time: newTime })
        .eq("id", editConsultation.id)

      if (error) throw error

      setConsultations((prev) =>
        prev.map((c) => (c.id === editConsultation.id ? { ...c, date: newDate, time: newTime } : c)),
      )

      setEditConsultation(null)
    } catch (err) {
      console.error("Erro ao editar consulta:", err)
      setError("Não foi possível remarcar a consulta. Por favor, tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const getFilteredConsultations = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (activeTab) {
      case "proximas":
        return consultations.filter(
          (c) => (c.status === "agendada" || c.status === "confirmada") && new Date(c.date) >= today,
        )
      case "passadas":
        return consultations.filter(
          (c) => c.status === "concluida" || (new Date(c.date) < today && c.status !== "cancelada"),
        )
      case "canceladas":
        return consultations.filter((c) => c.status === "cancelada")
      default:
        return consultations
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "agendada":
        return (
          <span className="px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            <Clock className="h-3 w-3 mr-1" /> Agendada
          </span>
        )
      case "confirmada":
        return (
          <span className="px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" /> Confirmada
          </span>
        )
      case "concluida":
        return (
          <span className="px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-purple-100 text-purple-800">
            <CheckCircle className="h-3 w-3 mr-1" /> Concluída
          </span>
        )
      case "cancelada":
        return (
          <span className="px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-red-100 text-red-800">
            <XCircle className="h-3 w-3 mr-1" /> Cancelada
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 inline-flex items-center text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status || "Pendente"}
          </span>
        )
    }
  }

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" }
    return new Date(dateString).toLocaleDateString("pt-BR", options)
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
    return timeString.slice(0, 5)
  }

  const isToday = (dateString) => {
    const today = new Date()
    const date = new Date(dateString)
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  }

  const filteredConsultations = getFilteredConsultations()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">Fisio Care</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Link
                to="/agendar-consulta"
                className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Agendar Consulta
              </Link>

              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {user?.nome_completo?.charAt(0) || "P"}
                  </div>
                  <span className="hidden md:inline-block font-medium text-gray-700">
                    {user?.nome_completo?.split(" ")[0] || "Paciente"}
                  </span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
                  <Link to="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Meu Perfil
                  </Link>
                  <Link to="/configuracoes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Configurações
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-4 w-4" />
            </li>
            <li className="font-medium text-gray-900">Dashboard</li>
          </ol>
        </nav>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <p className="text-red-700">{error}</p>
            <button onClick={() => setError("")} className="ml-auto text-red-700 hover:text-red-900">
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Welcome card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Bem-vindo, {user?.nome_completo || "Paciente Demonstração"}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Informações Pessoais
              </h2>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <User className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">Nome:</span>
                  <span>{user?.nome_completo || "Paciente Demonstração"}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Mail className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">Email:</span>
                  <span>{user?.email || "paciente@demo.com"}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Phone className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">Telefone:</span>
                  <span>{user?.telefone || "(11) 98765-4321"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
                Documentos
              </h2>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">CPF:</span>
                  <span>{user?.cpf || "123.456.789-00"}</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <FileText className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium mr-2">RG:</span>
                  <span>{user?.rg || "12.345.678-9"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total de Consultas</p>
                <h3 className="text-xl font-bold text-gray-900">{stats.total}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-50 text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Consultas Concluídas</p>
                <h3 className="text-xl font-bold text-gray-900">{stats.concluidas}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                <Clock className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Consultas Agendadas</p>
                <h3 className="text-xl font-bold text-gray-900">{stats.agendadas}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-50 text-red-600">
                <XCircle className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Consultas Canceladas</p>
                <h3 className="text-xl font-bold text-gray-900">{stats.canceladas}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Consultations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">Minhas Consultas</h2>
            <Link
              to="/agendar-consulta"
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Nova Consulta
            </Link>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab("proximas")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "proximas"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Próximas Consultas
              </button>
              <button
                onClick={() => setActiveTab("passadas")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "passadas"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Consultas Passadas
              </button>
              <button
                onClick={() => setActiveTab("canceladas")}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === "canceladas"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Consultas Canceladas
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-2"></div>
              <p className="text-gray-500">Carregando consultas...</p>
            </div>
          ) : filteredConsultations.length === 0 ? (
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-blue-600 mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {activeTab === "proximas"
                  ? "Você não tem consultas agendadas"
                  : activeTab === "passadas"
                    ? "Você não tem consultas passadas"
                    : "Você não tem consultas canceladas"}
              </h3>
              <p className="text-gray-500 mb-6">
                {activeTab === "proximas"
                  ? "Agende sua primeira consulta para começar seu tratamento"
                  : activeTab === "passadas"
                    ? "Suas consultas concluídas aparecerão aqui"
                    : "Suas consultas canceladas aparecerão aqui"}
              </p>
              {activeTab === "proximas" && (
                <Link
                  to="/agendar-consulta"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Agendar Consulta <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Serviço
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Data
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Horário
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Fisioterapeuta
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredConsultations.map((consultation) => (
                    <tr key={consultation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{consultation.service}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {formatDate(consultation.date)}
                            {isToday(consultation.date) && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                Hoje
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{formatTime(consultation.time)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {consultation.fisioterapeutas?.nome_completo || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(consultation.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {consultation.status !== "cancelada" && consultation.status !== "concluida" && (
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => remarcarConsulta(consultation)}
                              className="flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                            >
                              <Pencil className="h-3 w-3 mr-1" /> Remarcar
                            </button>
                            <button
                              onClick={() => setSelectedConsultation(consultation)}
                              className="flex items-center px-3 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                            >
                              <XCircle className="h-3 w-3 mr-1" /> Cancelar
                            </button>
                          </div>
                        )}
                        {consultation.status === "concluida" && (
                          <Link
                            to={`/consulta/${consultation.id}`}
                            className="flex items-center justify-center px-3 py-1 bg-purple-50 text-purple-700 rounded hover:bg-purple-100"
                          >
                            <FileText className="h-3 w-3 mr-1" /> Ver detalhes
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Cancel Consultation Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Confirmar Cancelamento</h3>
            <p className="text-gray-700 mb-4">Tem certeza que deseja cancelar a seguinte consulta?</p>

            <div className="bg-gray-50 rounded-md p-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Serviço</p>
                  <p className="font-medium">{selectedConsultation.service}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fisioterapeuta</p>
                  <p className="font-medium">{selectedConsultation.fisioterapeutas?.nome_completo}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Data</p>
                  <p className="font-medium">{formatDate(selectedConsultation.date)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Horário</p>
                  <p className="font-medium">{formatTime(selectedConsultation.time)}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedConsultation(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={loading}
              >
                Voltar
              </button>
              <button
                onClick={cancelarConsulta}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" /> Confirmar Cancelamento
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Consultation Modal */}
      {editConsultation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Remarcar Consulta</h3>

            <div className="space-y-4 mb-6">
              <div>
                <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
                  Serviço
                </label>
                <input
                  type="text"
                  id="service"
                  value={editConsultation.service}
                  disabled
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-700"
                />
              </div>

              <div>
                <label htmlFor="newDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Nova Data
                </label>
                <input
                  type="date"
                  id="newDate"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="newTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Novo Horário
                </label>
                <input
                  type="time"
                  id="newTime"
                  value={newTime?.slice(0, 5) || ""}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditConsultation(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={salvarEdicao}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" /> Salvar Alterações
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
