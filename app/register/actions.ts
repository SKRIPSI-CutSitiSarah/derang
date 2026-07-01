'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (!name || !email || !password || !confirmPassword) {
    return { error: 'Semua kolom wajib diisi.' }
  }

  if (password !== confirmPassword) {
    return { error: 'Konfirmasi password tidak cocok.' }
  }

  if (password.length < 6) {
    return { error: 'Password minimal terdiri dari 6 karakter.' }
  }

  const supabase = await createClient()

  // Sign up using Supabase Auth
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  redirect('/login?registered=true')
}
