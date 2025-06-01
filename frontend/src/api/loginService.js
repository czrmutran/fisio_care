import { supabase } from "../lib/supabaseClient"

export async function loginWithUsername({ username, password }) {
  // 1. Buscar email na view pelo username
  const { data: users, error: fetchError } = await supabase
    .from("users_view")
    .select("email")
    .eq("username", username)
    .limit(1)

  if (fetchError) throw new Error("Erro ao buscar usuário.")
  if (!users || users.length === 0) throw new Error("Usuário não encontrado.")

  const email = users[0].email

  // 2. Login com email + senha
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (loginError) throw new Error("Credenciais inválidas.")
}
