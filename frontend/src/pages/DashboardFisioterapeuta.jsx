"use client"

import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Stethoscope,
  Search,
} from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement)

// Mock data for the dashboard
const MOCK_FISIOTERAPEUTA = {
  id: 1,
  nome: "Dr. Ana Silva",
  email: "ana.silva@fisiocare.com",
  crefito: "12345-F",
  cargo: "Fisioterapia Ortopédica",
  telefone: "(11) 98765-4321",
  foto: "/physiotherapist-profile.png",
  is_active: true,
  created_at: "2023-01-15T10:30:00Z",
}

// Mock stats data
const MOCK_STATS = {
  totalPatients: 128,
  totalFisioterapeutas: 8,
  totalConsultations: 356,
  consultationsThisMonth: 42,
}

// Mock chart data
const MOCK_CHART_DATA = {
  consultationsByService: {
    "Fisioterapia Ortopédica": 145,
    "Fisioterapia Neurológica": 78,
    "Fisioterapia Respiratória": 56,
    "Fisioterapia Esportiva": 89,
    "Pilates Clínico": 67,
    Acupuntura: 21,
  },
  consultationsByStatus: {
    agendada: 35,
    confirmada: 48,
    concluida: 256,
    cancelada: 17,
  },
  consultationsByMonth: {
    "Janeiro 2025": 45,
    "Fevereiro 2025": 52,
    "Março 2025": 48,
    "Abril 2025": 61,
    "Maio 2025": 58,
    "Junho 2025": 42,
  },
}

// Mock consultations data
const MOCK_CONSULTATIONS = [
  {
    id: 1,
    full_name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 97654-3210",
    service: "Fisioterapia Ortopédica",
    date: "2025-06-15",
    time: "09:00:00",
    status: "confirmada",
    symptoms: "Dor no joelho direito após lesão esportiva. Dificuldade para flexionar completamente.",
    created_at: "2025-06-10T14:30:00Z",
  },
  {
    id: 2,
    full_name: "Maria Oliveira",
    email: "maria.oliveira@email.com",
    phone: "(11) 98765-4321",
    service: "Fisioterapia Neurológica",
    date: "2025-06-15",
    time: "10:00:00",
    status: "confirmada",
    symptoms: "Recuperação pós-AVC. Dificuldade de movimento no lado esquerdo.",
    created_at: "2025-06-09T10:15:00Z",
  },
  {
    id: 3,
    full_name: "Pedro Santos",
    email: "pedro.santos@email.com",
    phone: "(11) 91234-5678",
    service: "Fisioterapia Respiratória",
    date: "2025-06-15",
    time: "11:00:00",
    status: "agendada",
    symptoms: "Dificuldade respiratória após COVID-19. Fadiga ao realizar esforços.",
    created_at: "2025-06-08T16:45:00Z",
  },
  {
    id: 4,
    full_name: "Ana Costa",
    email: "ana.costa@email.com",
    phone: "(11) 99876-5432",
    service: "Pilates Clínico",
    date: "2025-06-16",
    time: "14:00:00",
    status: "confirmada",
    symptoms: "Dor lombar crônica. Busca fortalecimento da musculatura central.",
    created_at: "2025-06-10T09:30:00Z",
  },
  {
    id: 5,
    full_name: "Carlos Ferreira",
    email: "carlos.ferreira@email.com",
    phone: "(11) 98888-7777",
    service: "Fisioterapia Esportiva",
    date: "2025-06-16",
    time: "15:00:00",
    status: "confirmada",
    symptoms: "Recuperação de lesão no tornozelo durante partida de futebol.",
    created_at: "2025-06-09T11:20:00Z",
  },
  {
    id: 6,
    full_name: "Juliana Lima",
    email: "juliana.lima@email.com",
    phone: "(11) 97777-8888",
    service: "Acupuntura",
    date: "2025-06-16",
    time: "16:00:00",
    status: "cancelada",
    symptoms: "Dores de cabeça frequentes e tensão muscular nos ombros.",
    created_at: "2025-06-08T14:10:00Z",
  },
  {
    id: 7,
    full_name: "Roberto Alves",
    email: "roberto.alves@email.com",
    phone: "(11) 96666-5555",
    service: "Fisioterapia Ortopédica",
    date: "2025-06-17",
    time: "09:00:00",
    status: "concluida",
    symptoms: "Pós-operatório de cirurgia no ombro. Limitação de movimento.",
    created_at: "2025-06-07T10:45:00Z",
  },
  {
    id: 8,
    full_name: "Fernanda Gomes",
    email: "fernanda.gomes@email.com",
    phone: "(11) 95555-4444",
    service: "Fisioterapia Neurológica",
    date: "2025-06-17",
    time: "10:00:00",
    status: "concluida",
    symptoms: "Esclerose múltipla. Busca manter mobilidade e força muscular.",
    created_at: "2025-06-06T15:30:00Z",
  },
]

const DashboardFisioterapeuta = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [dashboardData, setDashboardData] = useState({
    consultations: [],
    stats: {},
    chartData: {},
  })
  const [fisioterapeuta, setFisioterapeuta] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("fisioterapeutaToken")
    if (!token) {
      navigate("/login-fisioterapeuta")
      return
    }

    // Get fisioterapeuta data from localStorage
    const storedFisioterapeuta = localStorage.getItem("fisioterapeutaData")
    if (storedFisioterapeuta) {
      setFisioterapeuta(JSON.parse(storedFisioterapeuta))
    } else {
      setFisioterapeuta(MOCK_FISIOTERAPEUTA)
    }

    // Simulate API delay
    setTimeout(() => {
      setDashboardData({
        consultations: MOCK_CONSULTATIONS,
        stats: MOCK_STATS,
        chartData: MOCK_CHART_DATA,
      })
      setLoading(false)
    }, 1000)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("fisioterapeutaToken")
    localStorage.removeItem("fisioterapeutaData")
    navigate("/")
  }

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

  // Filter consultations based on search term
  const filteredConsultations = dashboardData.consultations.filter(
    (consultation) =>
      consultation.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consultation.service.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Chart configurations
  const serviceChartData = {
    labels: Object.keys(dashboardData.chartData.consultationsByService || {}),
    datasets: [
      {
        label: "Consultas por Serviço",
        data: Object.values(dashboardData.chartData.consultationsByService || {}),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)",
          "rgba(236, 72, 153, 0.8)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const statusChartData = {
    labels: Object.keys(dashboardData.chartData.consultationsByStatus || {}),
    datasets: [
      {
        data: Object.values(dashboardData.chartData.consultationsByStatus || {}),
        backgroundColor: [
          "rgba(245, 158, 11, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(239, 68, 68, 0.8)",
        ],
        borderColor: [
          "rgba(245, 158, 11, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(239, 68, 68, 1)",
        ],
        borderWidth: 2,
      },
    ],
  }

  const monthlyChartData = {
    labels: Object.keys(dashboardData.chartData.consultationsByMonth || {}),
    datasets: [
      {
        label: "Consultas por Mês",
        data: Object.values(dashboardData.chartData.consultationsByMonth || {}),
        borderColor: "rgba(59, 130, 246, 1)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
  }

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Stethoscope className="h-8 w-8 text-blue-600 mr-3" />
            <Link to="/" className="text-3xl font-bold text-blue-700">
              Fisio Care - Portal Fisioterapeuta
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {fisioterapeuta && (
              <div className="flex items-center mr-4">
                <img
                  src={fisioterapeuta.foto || "/placeholder.svg"}
                  alt={fisioterapeuta.nome}
                  className="h-10 w-10 rounded-full object-cover mr-2"
                />
                <div>
                  <p className="text-sm font-medium">{fisioterapeuta.nome}</p>
                  <p className="text-xs text-gray-500">{fisioterapeuta.cargo}</p>
                </div>
              </div>
            )}
            <button onClick={handleLogout} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {error && <p className="text-red-500 mb-4">{error}</p>}


        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Pacientes</dt>
                    <dd className="text-lg font-medium text-gray-900">{dashboardData.stats.totalPatients}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Stethoscope className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Fisioterapeutas</dt>
                    <dd className="text-lg font-medium text-gray-900">{dashboardData.stats.totalFisioterapeutas}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Calendar className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total de Consultas</dt>
                    <dd className="text-lg font-medium text-gray-900">{dashboardData.stats.totalConsultations}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Consultas este Mês</dt>
                    <dd className="text-lg font-medium text-gray-900">{dashboardData.stats.consultationsThisMonth}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

                {/* Consultations Table */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">Todas as Consultas</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Lista completa de consultas de todos os pacientes</p>
            </div>
            <div className="mt-4 md:mt-0 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar paciente ou serviço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Paciente
                  </th>
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
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Contato
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredConsultations.map((consultation) => (
                  <tr key={consultation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{consultation.full_name}</div>
                          <div className="text-sm text-gray-500">{consultation.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{consultation.service}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <div className="text-sm text-gray-900">
                          {new Date(consultation.date).toLocaleDateString("pt-BR")}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <div className="text-sm text-gray-900">
                          {new Date(`2000-01-01T${consultation.time}`).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(consultation.status)}
                        <span
                          className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(consultation.status)}`}
                        >
                          {consultation.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{consultation.phone}</div>
                      {consultation.symptoms && (
                        <div className="text-xs text-gray-400 mt-1">
                          Sintomas: {consultation.symptoms.substring(0, 50)}...
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Consultas por Serviço</h3>
            <Bar data={serviceChartData} options={chartOptions} />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status das Consultas</h3>
            <Doughnut data={statusChartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Consultas por Mês</h3>
          <Line data={monthlyChartData} options={chartOptions} />
        </div>


      </main>
    </div>
  )
}

export default DashboardFisioterapeuta
