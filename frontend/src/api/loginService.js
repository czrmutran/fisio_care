// loginService.js
import { supabase } from "../lib/supabaseClient"

export async function loginWithUsername({ username, password, expectedRole }) {
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
        : "Este usuário é um paciente. Faça login na página correta."
    )
  }

  // 2. Login com email e senha
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError) throw new Error("Credenciais inválidas.")

  return { email, role }
}
