import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://yoxhrdkuwjwqzuhcdawm.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlveGhyZGt1d2p3cXp1aGNkYXdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg3ODE5ODEsImV4cCI6MjA2NDM1Nzk4MX0.PQW9wvMvRCAeMuT0T8nCWk3XTUlWyOJFC-wpafUJqq4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
