'use client'

import React, { useActionState } from 'react'
import { registerAction } from './actions'
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ShieldAlertIcon, Loader2Icon, UserIcon, MailIcon, LockIcon } from 'lucide-react'
import Link from 'next/link'
import { MagicCard } from '@/components/magicui/magic-card'
import { BorderBeam } from '@/components/magicui/border-beam'
import { Particles } from '@/components/magicui/particles'
import { ShinyButton } from '@/components/magicui/shiny-button'

interface ActionState {
  error: string | null
}

// Define the action wrapper for useActionState
async function formActionWrapper(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const result = await registerAction(formData)
  return result || { error: null }
}

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(formActionWrapper, { error: null } as ActionState)

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-8">
      {/* Canvas Particles Background */}
      <Particles className="absolute inset-0 -z-10" quantity={50} />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-25" />

      {/* Floating Decorative Glows matching primary color */}
      <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-primary/8 blur-[128px] -z-20 animate-pulse-slow" style={{ '--duration': '10s' } as React.CSSProperties} />
      <div className="absolute bottom-1/4 right-1/3 h-96 w-96 rounded-full bg-primary/5 blur-[128px] -z-20 animate-pulse-slow" style={{ '--duration': '14s' } as React.CSSProperties} />

      <div className="w-full max-w-[400px] z-10 space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-500 hover:scale-110 hover:rotate-6">
            <ShieldAlertIcon className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-extrabold tracking-wider text-foreground mt-3 bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
            DERANG
          </h2>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
            Sistem Deteksi Kecurangan Ujian Lhokseumawe
          </p>
        </div>

        <MagicCard className="relative overflow-hidden border-border/50 bg-card/65 backdrop-blur-xl shadow-2xl text-card-foreground">
          <BorderBeam size={200} duration={8} borderWidth={1.5} colorFrom="oklch(var(--primary))" colorTo="oklch(var(--primary) / 0.15)" />
          
          <CardHeader className="space-y-1.5 pt-6 px-6">
            <CardTitle className="text-xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
              Registrasi Admin
            </CardTitle>
            <CardDescription className="text-muted-foreground text-xs">
              Daftarkan akun administrator baru untuk mengelola DERANG
            </CardDescription>
          </CardHeader>
          <form action={formAction}>
            <CardContent className="space-y-4 px-6 pb-4">
              {state?.error && (
                <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive animate-pulse shrink-0" />
                  <p className="font-semibold">{state.error}</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold tracking-wide text-muted-foreground">Nama Lengkap</Label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Nama Lengkap Anda"
                    required
                    className="pl-10 h-9 bg-background/50 border-border/60 text-foreground placeholder:text-muted-foreground/45 focus-visible:ring-primary/45 focus-visible:border-primary/40 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold tracking-wide text-muted-foreground">Email</Label>
                <div className="relative">
                  <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@derang.com"
                    required
                    className="pl-10 h-9 bg-background/50 border-border/60 text-foreground placeholder:text-muted-foreground/45 focus-visible:ring-primary/45 focus-visible:border-primary/40 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold tracking-wide text-muted-foreground">Password</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="pl-10 h-9 bg-background/50 border-border/60 text-foreground placeholder:text-muted-foreground/45 focus-visible:ring-primary/45 focus-visible:border-primary/40 transition-all duration-200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold tracking-wide text-muted-foreground">Konfirmasi Password</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="pl-10 h-9 bg-background/50 border-border/60 text-foreground placeholder:text-muted-foreground/45 focus-visible:ring-primary/45 focus-visible:border-primary/40 transition-all duration-200"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 px-6 pb-6 pt-2">
              <ShinyButton
                type="submit"
                disabled={isPending}
                className="w-full h-9 text-xs font-semibold tracking-wide shadow-md hover:scale-[1.01] transition-transform duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
                    Mendaftarkan...
                  </>
                ) : (
                  'Daftar Akun'
                )}
              </ShinyButton>
              <div className="text-center text-xs text-muted-foreground">
                Sudah memiliki akun?{' '}
                <Link href="/login" className="font-semibold text-primary hover:underline hover:text-primary/80 transition-colors">
                  Login di sini
                </Link>
              </div>
            </CardFooter>
          </form>
        </MagicCard>
      </div>
    </div>
  )
}
