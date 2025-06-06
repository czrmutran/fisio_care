"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabaseClient"
import { Calendar, Clock, FileText } from "lucide-react"

const Dashboard = () => {
  const { user } = useAuth()
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        if (!user?.id) return

        const { data, error } = await supabase
          .from("consultas")
          .select("id, service, date, time, status, fisioterapeutas!consultas_fisioterapeuta_id_fkey(nome_completo)")
          .eq("cliente_id", user.id)
          .order("date", { ascending: true })

        if (error) throw error
        setConsultations(data || [])
      } catch (err) {
        console.error(err)
        setError("Falha ao carregar consultas")
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [user?.id])

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-blue-700">Fisio Care</Link>
          <Link to="/agendar-consulta" className="px-4 py-2 text-blue-600 hover:text-blue-800">Agendar Consulta</Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Bem-vindo, {user?.nome_completo || "Paciente"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium">Informações Pessoais</h3>
              <p><span className="font-semibold">Nome:</span> {user?.nome_completo}</p>
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
              <p><span className="font-semibold">Telefone:</span> {user?.telefone}</p>
            </div>
            <div>
              <h3 className="text-lg font-medium">Documentos</h3>
              <p><span className="font-semibold">CPF:</span> {user?.cpf}</p>
              <p><span className="font-semibold">RG:</span> {user?.rg}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Minhas Consultas</h3>
            <Link to="/agendar-consulta" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Nova Consulta</Link>
          </div>

          {consultations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Você ainda não tem consultas agendadas.</p>
              <Link to="/agendar-consulta" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Agendar sua primeira consulta
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serviço</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horário</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fisioterapeuta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {consultations.map((consultation) => (
                    <tr key={consultation.id}>
                      <td className="px-6 py-4">{consultation.service}</td>
                      <td className="px-6 py-4">{new Date(consultation.date).toLocaleDateString("pt-BR")}</td>
                      <td className="px-6 py-4">{consultation.time?.slice(0, 5)}</td>
                      <td className="px-6 py-4">{consultation.fisioterapeutas?.nome_completo || "N/A"}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 inline-flex text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {consultation.status || "Confirmada"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard
