// loginService.js
import { supabase } from "../lib/supabaseClient"

/**
 * Realiza login com nome de usuário verificando o papel esperado
 * @param {Object} params - Parâmetros de login
 * @param {string} params.username - Nome de usuário
 * @param {string} params.password - Senha
 * @param {string} params.expectedRole - Papel esperado (fisioterapeuta ou paciente)
 * @returns {Promise<Object>} - Dados do usuário autenticado
 */
export async function loginWithUsername({ username, password, expectedRole }) {
  try {
    // 1. Buscar o email e role
    const { data: users, error: fetchError } = await supabase
      .from("users_view")
      .select("email, role")
      .eq("username", username)
      .limit(1)

    if (fetchError) throw new Error("Erro ao buscar usuário.")
    if (!users || users.length === 0) throw new Error("Usuário não encontrado.")

    const { email, role } = users[0]

    if (role !== expectedRole) {
      throw new Error(
        role === "fisioterapeuta"
          ? "Este usuário é um fisioterapeuta. Faça login na página correta."
          : "Este usuário é um paciente. Faça login na página correta.",
      )
    }

    // 2. Login com email e senha
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) throw new Error("Credenciais inválidas.")

    return { user: data?.user, email, role }
  } catch (error) {
    console.error("Erro no login:", error)
    throw error
  }
}

/**
 * Verifica se o usuário está autenticado
 * @returns {Promise<Object|null>} - Dados do usuário ou null
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) return null
    return data.user
  } catch (error) {
    console.error("Erro ao verificar usuário:", error)
    return null
  }
}

/**
 * Realiza logout do usuário
 * @returns {Promise<void>}
 */
export async function logout() {
  try {
    await supabase.auth.signOut()
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
    throw error
  }
}
