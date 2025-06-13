"use client"

import { Calendar, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

const RegisterThree = ({ birthDate, setBirthDate, password, setPassword, confirmPassword, setConfirmPassword }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Função para calcular a força da senha
  const calculatePasswordStrength = (password) => {
    if (!password) return 0

    let strength = 0

    // Comprimento
    if (password.length >= 8) strength += 1
    if (password.length >= 12) strength += 1

    // Complexidade
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    return Math.min(strength, 5)
  }

  const passwordStrength = calculatePasswordStrength(password)

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return "Muito fraca"
    if (passwordStrength === 1) return "Fraca"
    if (passwordStrength === 2) return "Razoável"
    if (passwordStrength === 3) return "Média"
    if (passwordStrength === 4) return "Forte"
    return "Muito forte"
  }

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500"
    if (passwordStrength === 2) return "bg-orange-500"
    if (passwordStrength === 3) return "bg-yellow-500"
    if (passwordStrength === 4) return "bg-green-500"
    return "bg-green-600"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <span className="text-lg font-semibold">1</span>
        </div>
        <div className="h-1 w-16 bg-blue-600 mx-2"></div>
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center">
          <span className="text-lg font-semibold">2</span>
        </div>
        <div className="h-1 w-16 bg-blue-600 mx-2"></div>
        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
          <span className="text-lg font-semibold">3</span>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-800 mb-4">Finalize seu Cadastro</h2>

      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
          Data de Nascimento
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
            placeholder="Crie uma senha segura"
            required
            minLength="8"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
          </button>
        </div>

        {password && (
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1">
              <div className="text-xs text-gray-500">Força da senha: {getPasswordStrengthText()}</div>
              <div className="text-xs text-gray-500">{passwordStrength}/5</div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getPasswordStrengthColor()}`}
                style={{ width: `${(passwordStrength / 5) * 100}%` }}
              ></div>
            </div>
            <ul className="mt-2 text-xs text-gray-500 space-y-1">
              <li className={password.length >= 8 ? "text-green-600" : ""}>• Mínimo de 8 caracteres</li>
              <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>• Pelo menos uma letra maiúscula</li>
              <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>• Pelo menos um número</li>
              <li className={/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}>
                • Pelo menos um caractere especial
              </li>
            </ul>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar Senha
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
            placeholder="Confirme sua senha"
            required
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
        {password && confirmPassword && (
          <div className="mt-1">
            {password === confirmPassword ? (
              <p className="text-xs text-green-600">As senhas coincidem</p>
            ) : (
              <p className="text-xs text-red-600">As senhas não coincidem</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default RegisterThree
