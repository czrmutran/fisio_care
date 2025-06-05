// loginService.js
import { supabase } from "../lib/supabaseClient"

export const loginWithUsername = async ({ username, password }) => {
  const { data, error } = await supabase
    .from("pacientes")
    .select("id, email")
    .eq("username", username)
    .single()

  if (error || !data) throw new Error("Usuário não encontrado")

  const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
    email: data.email,
    password,
  })

  if (signInError) throw new Error("Email ou senha incorretos")

  return { id: signInData.user.id, email: signInData.user.email }
}

