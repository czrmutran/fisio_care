"use client"

import { useEffect, useState, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import {
  Stethoscope,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  RefreshCw,
  Download,
  ChevronRight,
} from "lucide-react"
import { useAuth } from "../context/AuthContext"

const DashboardFisioterapeuta = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [dateFilter, setDateFilter] = useState("todos")
  const [fisioterapeuta, setFisioterapeuta] = useState(null)
  const [consultations, setConsultations] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      setRefreshing(true)

      // Se não houver usuário, usar dados de demonstração
      if (!user?.id || user.id === "demo-fisio-id") {
        console.log("Usando dados de demonstração para o fisioterapeuta")

        // Definir dados do fisioterapeuta de demonstração
        setFisioterapeuta({
          id: "demo-fisio-id",
          nome_completo: "Fisioterapeuta Demonstração",
          especialidade: "Fisioterapia Ortopédica",
          crefito: "12/34567-AB",
          telefone: "(11) 98765-4321",
        })

        // Dados de demonstração para consultas
        const demoConsultations = [
          {
            id: 1,
            full_name: "Maria Silva",
            email: "maria@exemplo.com",
            phone: "(11) 97654-3210",
            service: "Fisioterapia Ortopédica",
            date: new Date().toISOString().split("T")[0],
            time: "14:00:00",
            status: "agendada",
            symptoms: "Dor no joelho direito após atividade física",
          },
          {
            id: 2,
            full_name: "João Oliveira",
            email: "joao@exemplo.com",
            phone: "(11) 98765-1234",
            service: "Fisioterapia Ortopédica",
            date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            time: "10:00:00",
            status: "confirmada",
            symptoms: "Recuperação pós-cirurgia no tornozelo",
          },
          {
            id: 3,
            full_name: "Ana Santos",
            email: "ana@exemplo.com",
            phone: "(11) 91234-5678",
            service: "Fisioterapia Ortopédica",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            time: "16:00:00",
            status: "concluida",
            symptoms: "Dor lombar crônica",
          },
          {
            id: 4,
            full_name: "Carlos Mendes",
            email: "carlos@exemplo.com",
            phone: "(11) 92345-6789",
            service: "Fisioterapia Ortopédica",
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            time: "09:00:00",
            status: "cancelada",
            symptoms: "Lesão no ombro",
          },
        ]

        setConsultations(demoConsultations)
        setLoading(false)
        setRefreshing(false)
        return
      }

      // Buscar dados reais do Supabase
      const { data: fisioData, error: fisioError } = await supabase
        .from("fisioterapeutas")
        .select("*")
        .eq("id", user.id)
        .single()

      if (fisioError) throw fisioError
      setFisioterapeuta(fisioData)

      const { data: consultasData, error: consultasError } = await supabase
        .from("consultas")
        .select("*")
        .eq("fisioterapeuta_id", user.id)
        .order("date", { ascending: true })

      if (consultasError) throw consultasError
      setConsultations(consultasData || [])
    } catch (err) {
      console.error("Erro ao carregar dados:", err)
      setError("Erro ao carregar dados. Por favor, tente novamente mais tarde.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user?.id, navigate])

  const handleLogout = async () => {
    try {
      await logout()
      navigate("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  const handleStatusChange = async (consultationId, newStatus) => {
    try {
      // Para dados de demonstração, apenas atualizar o estado local
      if (user?.id === "demo-fisio-id") {
        setConsultations((prev) => prev.map((c) => (c.id === consultationId ? { ...c, status: newStatus } : c)))
        return
      }

      // Atualizar no Supabase
      const { error } = await supabase.from("consultas").update({ status: newStatus }).eq("id", consultationId)

      if (error) throw error

      // Atualizar localmente
      setConsultations((prev) => prev.map((c) => (c.id === consultationId ? { ...c, status: newStatus } : c)))
    } catch (err) {
      console.error("Erro ao atualizar status:", err)
      setError("Não foi possível atualizar o status da consulta.")
    }
  }

  const filteredConsultations = useMemo(() => {
    let filtered = [...consultations]

    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.service?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filtrar por status
    if (statusFilter !== "todos") {
      filtered = filtered.filter((c) => c.status === statusFilter)
    }

    // Filtrar por data
    if (dateFilter !== "todos") {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (dateFilter === "hoje") {
        filtered = filtered.filter((c) => {
          const consultDate = new Date(c.date)
          return consultDate.toDateString() === today.toDateString()
        })
      } else if (dateFilter === "futuras") {
        filtered = filtered.filter((c) => new Date(c.date) >= today)
      } else if (dateFilter === "passadas") {
        filtered = filtered.filter((c) => new Date(c.date) < today)
      }
    }

    return filtered
  }, [consultations, searchTerm, statusFilter, dateFilter])

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmada":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "concluida":
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case "cancelada":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmada":
        return "bg-green-100 text-green-800"
      case "concluida":
        return "bg-blue-100 text-blue-800"
      case "cancelada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const exportToCSV = () => {
    // Criar cabeçalho CSV
    const headers = ["Nome", "Email", "Telefone", "Serviço", "Data", "Hora", "Status", "Sintomas"]

    // Converter dados para formato CSV
    const csvData = filteredConsultations.map((c) => [
      c.full_name,
      c.email,
      c.phone,
      c.service,
      new Date(c.date).toLocaleDateString("pt-BR"),
      c.time?.substring(0, 5) || "—",
      c.status,
      c.symptoms || "",
    ])

    // Juntar cabeçalho e dados
    const csvContent = [headers.join(","), ...csvData.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

    // Criar blob e link para download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `consultas_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
            <Link to="/" className="text-3xl font-bold text-blue-700">
              Fisio Care
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{fisioterapeuta?.nome_completo}</p>
              <p className="text-xs text-gray-500">{fisioterapeuta?.especialidade}</p>
            </div>
            <button onClick={handleLogout} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4">
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
            <li className="font-medium text-gray-900">Dashboard Fisioterapeuta</li>
          </ol>
        </nav>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-700">
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        )}

        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-xl font-bold">Consultas</h2>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                onClick={fetchData}
                className="flex items-center px-3 py-1 text-sm bg-white border rounded-md hover:bg-gray-50"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
                Atualizar
              </button>
              <button
                onClick={exportToCSV}
                className="flex items-center px-3 py-1 text-sm bg-white border rounded-md hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-1" />
                Exportar CSV
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar paciente, email ou serviço..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 px-4 py-2 w-full border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <div className="w-40">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 w-full border rounded-lg"
                >
                  <option value="todos">Todos status</option>
                  <option value="agendada">Agendada</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="concluida">Concluída</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

              <div className="w-40">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-4 py-2 w-full border rounded-lg"
                >
                  <option value="todos">Todas datas</option>
                  <option value="hoje">Hoje</option>
                  <option value="futuras">Futuras</option>
                  <option value="passadas">Passadas</option>
                </select>
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Exibindo {filteredConsultations.length} de {consultations.length} consultas
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <Calendar className="h-12 w-12 text-gray-400 mb-2" />
                      <p className="text-lg font-medium text-gray-900 mb-1">Nenhuma consulta encontrada</p>
                      <p className="text-sm text-gray-500">
                        {searchTerm || statusFilter !== "todos" || dateFilter !== "todos"
                          ? "Tente ajustar os filtros para ver mais resultados"
                          : "Você ainda não tem consultas agendadas"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{c.full_name}</div>
                          <div className="text-sm text-gray-500">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{c.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <Calendar className="inline h-4 w-4 text-gray-500 mr-1" />
                      {new Date(c.date).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <Clock className="inline h-4 w-4 text-gray-500 mr-1" />
                      {c.time?.substring(0, 5) || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {getStatusIcon(c.status)}
                        <span
                          className={`ml-2 px-2 inline-flex text-xs font-semibold rounded-full ${getStatusColor(c.status)}`}
                        >
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>{c.phone}</div>
                      {c.symptoms && (
                        <div className="text-xs text-gray-400 mt-1">
                          Sintomas: {c.symptoms.length > 50 ? `${c.symptoms.substring(0, 50)}...` : c.symptoms}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex space-x-2">
                        {c.status === "agendada" && (
                          <button
                            onClick={() => handleStatusChange(c.id, "confirmada")}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200"
                          >
                            Confirmar
                          </button>
                        )}

                        {(c.status === "agendada" || c.status === "confirmada") && (
                          <>
                            <button
                              onClick={() => handleStatusChange(c.id, "concluida")}
                              className="px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            >
                              Concluir
                            </button>
                            <button
                              onClick={() => handleStatusChange(c.id, "cancelada")}
                              className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}

export default DashboardFisioterapeuta
