'use client'

import React, { useActionState, Suspense } from 'react'
import { loginAction } from './actions'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ShieldAlertIcon, Loader2Icon, CheckCircle2Icon } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

interface ActionState {
  error: string | null
}

// Define the action wrapper for useActionState
async function formActionWrapper(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const result = await loginAction(formData)
  return result || { error: null }
}

function LoginForm() {
  const [state, formAction, isPending] = useActionState(formActionWrapper, { error: null } as ActionState)
  const searchParams = useSearchParams()
  const isRegistered = searchParams.get('registered') === 'true'

  return (
    <Card className="border-border bg-card/75 backdrop-blur-md shadow-lg text-card-foreground">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl font-semibold tracking-tight">Login Admin</CardTitle>
        <CardDescription className="text-muted-foreground">
          Masuk untuk mengelola data dan menganalisis kecurangan ujian
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-4">
          {isRegistered && (
            <div className="rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-600 border border-emerald-500/20 flex items-center gap-2">
              <CheckCircle2Icon className="h-4 w-4 text-emerald-600 shrink-0" />
              <p className="font-medium">Registrasi berhasil! Silakan masuk dengan akun Anda.</p>
            </div>
          )}
          {state?.error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive border border-destructive/20 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse shrink-0" />
              <p className="font-medium">{state.error}</p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@derang.com"
              required
              className="bg-background border-input text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="bg-background border-input text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-primary"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-sm transition-all duration-200"
          >
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Menghubungkan...
              </>
            ) : (
              'Masuk'
            )}
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Belum memiliki akun?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar di sini
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40" />

      {/* Decorative Glows matching primary color */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl -z-10" />

      <div className="w-full max-w-md z-10 space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/20 transition-transform duration-300 hover:scale-105">
            <ShieldAlertIcon className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground mt-3">DERANG</h2>
          <p className="text-sm text-muted-foreground">
            Sistem Deteksi Kecurangan Ujian Lhokseumawe
          </p>
        </div>

        <Suspense fallback={
          <Card className="border-border bg-card/75 backdrop-blur-md shadow-lg text-card-foreground p-6 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
          </Card>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
