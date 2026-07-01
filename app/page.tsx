import type { Metadata } from "next"
import Link from "next/link"
import {
  ShieldAlertIcon,
  UploadIcon,
  GitCompareIcon,
  BoxesIcon,
  LayersIcon,
  FileSpreadsheetIcon,
  GaugeIcon,
  BarChart3Icon,
  HistoryIcon,
  UsersIcon,
  ArrowRightIcon,
  SparklesIcon,
  CheckCircle2Icon,
  InfoIcon,
} from "lucide-react"
import { Particles } from "@/components/magicui/particles"
import { MagicCard } from "@/components/magicui/magic-card"
import { BorderBeam } from "@/components/magicui/border-beam"
import { ThemeToggle } from "@/components/landing/theme-toggle"
import { CATEGORY_LABEL } from "@/lib/category"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "DERANG — Sistem Deteksi Kecurangan Ujian",
  description:
    "DERANG menganalisis pola jawaban peserta ujian dengan Cosine Similarity dan K-Means Clustering untuk menyoroti indikasi kecurangan secara objektif.",
}

/* ---------- Data ---------- */

const STEPS = [
  {
    icon: UploadIcon,
    title: "Unggah Dataset",
    desc: "Impor hasil ujian dalam format CSV atau Excel. Mendukung mode ujian online maupun offline.",
  },
  {
    icon: GitCompareIcon,
    title: "Hitung Kemiripan",
    desc: "Sistem menghitung Cosine Similarity antar pola jawaban peserta untuk menemukan kemiripan tidak wajar.",
  },
  {
    icon: BoxesIcon,
    title: "Klasterisasi K-Means",
    desc: "Peserta dikelompokkan ke dalam 3 klaster (K=3) berdasarkan tingkat kemiripan pola jawaban.",
  },
  {
    icon: ShieldAlertIcon,
    title: "Hasil & Tindak Lanjut",
    desc: "Dapatkan 3 kategori indikasi beserta Silhouette Score sebagai dasar verifikasi manual.",
  },
]

const FEATURES = [
  {
    icon: LayersIcon,
    title: "Mode Online & Offline",
    desc: "Durasi pengerjaan (online) atau posisi kursi (offline) sebagai indikator pendukung.",
  },
  {
    icon: FileSpreadsheetIcon,
    title: "Impor CSV & Excel",
    desc: "Unggah dataset langsung dari spreadsheet tanpa konversi manual.",
  },
  {
    icon: GaugeIcon,
    title: "Silhouette Score",
    desc: "Ukur kualitas klasterisasi secara objektif pada setiap analisis.",
  },
  {
    icon: BarChart3Icon,
    title: "Visualisasi Interaktif",
    desc: "Distribusi kategori dan tren analisis dalam grafik pie & bar.",
  },
  {
    icon: HistoryIcon,
    title: "Riwayat Analisis",
    desc: "Buka kembali hasil analisis kapan saja tanpa memproses ulang dataset.",
  },
  {
    icon: UsersIcon,
    title: "Pasangan Mencurigakan",
    desc: "Daftar pasangan peserta dengan tingkat kemiripan jawaban tertinggi.",
  },
]

const CATEGORIES = [
  {
    label: CATEGORY_LABEL.tidak_terindikasi,
    desc: "Pola jawaban wajar. Tidak ditemukan indikasi kecurangan.",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "border-emerald-500/30",
    glow: "bg-emerald-500/10",
  },
  {
    label: CATEGORY_LABEL.terindikasi_rendah,
    desc: "Terdapat kemiripan sedang yang perlu diperhatikan lebih lanjut.",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    ring: "border-amber-500/30",
    glow: "bg-amber-500/10",
  },
  {
    label: CATEGORY_LABEL.terindikasi_tinggi,
    desc: "Kemiripan tinggi. Sangat disarankan untuk verifikasi manual.",
    dot: "bg-destructive",
    text: "text-destructive",
    ring: "border-destructive/30",
    glow: "bg-destructive/10",
  },
]

/* ---------- Small building blocks (server-safe, CSS-only) ---------- */

function ShinyLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex h-11 items-center justify-center gap-2 overflow-hidden rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/40 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
        className
      )}
    >
      <span className="absolute inset-0 block h-full w-full bg-[linear-gradient(110deg,transparent,35%,rgba(255,255,255,0.25),45%,rgba(255,255,255,0.25),55%,transparent,65%)] bg-[length:200%_100%] opacity-0 transition-opacity duration-300 group-hover:animate-shimmer group-hover:opacity-100" />
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <span className="relative flex items-center gap-2">{children}</span>
    </Link>
  )
}

function OutlineLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border/70 bg-background/40 px-6 text-sm font-semibold text-foreground backdrop-blur transition-all duration-300 hover:border-primary/40 hover:bg-muted",
        className
      )}
    >
      {children}
    </Link>
  )
}

function SectionHeading({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string
  title: string
  desc: string
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary">
        {eyebrow}
      </span>
      <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground sm:text-base">{desc}</p>
    </div>
  )
}

/* ---------- Page ---------- */

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* ============ NAVBAR ============ */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              <ShieldAlertIcon className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold tracking-wide bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
              DERANG
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#cara-kerja" className="transition-colors hover:text-foreground">
              Cara Kerja
            </a>
            <a href="#fitur" className="transition-colors hover:text-foreground">
              Fitur
            </a>
            <a href="#kategori" className="transition-colors hover:text-foreground">
              Kategori
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="hidden h-9 items-center rounded-lg px-4 text-sm font-semibold text-foreground transition-colors hover:text-primary sm:inline-flex"
            >
              Masuk
            </Link>
            <ShinyLink href="/register" className="h-9 px-4 text-xs">
              Daftar
            </ShinyLink>
          </div>
        </div>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        {/* Particle field */}
        <Particles className="absolute inset-0 -z-10" quantity={60} />
        {/* Grid pattern */}
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_60%,transparent_100%)] opacity-25" />
        {/* Floating glows */}
        <div className="absolute -top-20 left-1/4 -z-20 h-96 w-96 animate-pulse-slow rounded-full bg-primary/10 blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 -z-20 h-96 w-96 animate-pulse-slow rounded-full bg-primary/[0.07] blur-[128px]" style={{ "--duration": "12s" } as React.CSSProperties} />

        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <SparklesIcon className="h-3.5 w-3.5" />
              Skripsi · Politeknik Negeri Lhokseumawe
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Deteksi Indikasi{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent">
                Kecurangan Ujian
              </span>{" "}
              secara Otomatis
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg lg:mx-0">
              DERANG menganalisis pola jawaban peserta menggunakan{" "}
              <span className="font-semibold text-foreground">Cosine Similarity</span> dan pengelompokan{" "}
              <span className="font-semibold text-foreground">K-Means</span> untuk menyoroti indikasi
              kecurangan — cepat, objektif, dan dapat ditindaklanjuti.
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
              <ShinyLink href="/login">
                Mulai Sekarang
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </ShinyLink>
              <OutlineLink href="#cara-kerja">Pelajari Cara Kerja</OutlineLink>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground lg:justify-start">
              {["Mode Online & Offline", "Impor CSV / Excel", "K-Means (K=3)"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2Icon className="h-3.5 w-3.5 text-primary" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Preview card */}
          <div className="relative mx-auto w-full max-w-md">
            <MagicCard
              className="p-6"
              gradientColor="color-mix(in oklch, var(--primary) 14%, transparent)"
            >
              <BorderBeam
                size={220}
                duration={9}
                borderWidth={1.5}
                colorFrom="var(--primary)"
                colorTo="color-mix(in oklch, var(--primary) 12%, transparent)"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldAlertIcon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">Hasil Analisis</span>
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[11px] text-primary">
                  Silhouette 0.71
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  { label: CATEGORY_LABEL.tidak_terindikasi, value: 68, bar: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
                  { label: CATEGORY_LABEL.terindikasi_rendah, value: 24, bar: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
                  { label: CATEGORY_LABEL.terindikasi_tinggi, value: 8, bar: "bg-destructive", text: "text-destructive" },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className={cn("font-mono font-semibold", row.text)}>{row.value}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                      <div className={cn("h-full rounded-full", row.bar)} style={{ width: `${row.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-border/60 bg-muted/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Contoh ilustrasi.</span> Nilai kemiripan
                tertinggi menandai pasangan peserta untuk diverifikasi.
              </div>
            </MagicCard>
          </div>
        </div>
      </section>

      {/* ============ CARA KERJA ============ */}
      <section id="cara-kerja" className="scroll-mt-20 border-t border-border/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Cara Kerja"
            title="Empat langkah dari dataset ke keputusan"
            desc="Alur analisis yang transparan — mulai dari unggah data hingga kategori indikasi yang siap ditindaklanjuti."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <MagicCard key={step.title} className="p-5" gradientColor="color-mix(in oklch, var(--primary) 12%, transparent)">
                <span className="font-mono text-xs font-semibold text-primary/60">
                  0{i + 1}
                </span>
                <span className="mt-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <step.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              </MagicCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FITUR ============ */}
      <section id="fitur" className="scroll-mt-20 border-t border-border/40 bg-muted/20 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Fitur"
            title="Semua yang dibutuhkan untuk analisis integritas ujian"
            desc="Dirancang untuk administrator: cepat diunggah, mudah dibaca, dan dapat dibuka kembali kapan saja."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature) => (
              <MagicCard key={feature.title} className="p-5" gradientColor="color-mix(in oklch, var(--primary) 12%, transparent)">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{feature.desc}</p>
              </MagicCard>
            ))}
          </div>
        </div>
      </section>

      {/* ============ KATEGORI ============ */}
      <section id="kategori" className="scroll-mt-20 border-t border-border/40 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Kategori Risiko"
            title="Tiga tingkat indikasi yang mudah dipahami"
            desc="Setiap peserta dikelompokkan ke salah satu dari tiga kategori berdasarkan pola jawaban dan indikator pendukung."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.label}
                className={cn(
                  "relative overflow-hidden rounded-xl border bg-card/60 p-6 backdrop-blur-sm transition-colors",
                  cat.ring
                )}
              >
                <div className={cn("absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl", cat.glow)} />
                <div className="relative">
                  <span className={cn("inline-block h-3 w-3 rounded-full", cat.dot)} />
                  <h3 className={cn("mt-4 text-lg font-bold", cat.text)}>{cat.label}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Disclaimer */}
          <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <InfoIcon className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Hasil bersifat indikasi awal, bukan keputusan final.</span>{" "}
              Keputusan akhir tetap memerlukan pemeriksaan dan verifikasi manual oleh pihak berwenang.
            </p>
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="border-t border-border/40 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-card p-10 text-center shadow-xl">
            <BorderBeam
              size={300}
              duration={10}
              borderWidth={1.5}
              colorFrom="var(--primary)"
              colorTo="color-mix(in oklch, var(--primary) 12%, transparent)"
            />
            <div className="absolute -top-16 left-1/2 -z-10 h-56 w-56 -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Siap menjaga integritas ujian?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Masuk ke DERANG dan mulai analisis pertama Anda dalam hitungan menit.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ShinyLink href="/login">
                Masuk ke DERANG
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </ShinyLink>
              <OutlineLink href="/register">Buat Akun Admin</OutlineLink>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="border-t border-border/40 py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ShieldAlertIcon className="h-4 w-4" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-foreground">DERANG</p>
              <p className="text-[11px] text-muted-foreground">
                Sistem Deteksi Kecurangan Ujian Lhokseumawe
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Skripsi · Cut Siti Sarah Azkiani · Politeknik Negeri Lhokseumawe
          </p>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="/login" className="text-muted-foreground transition-colors hover:text-primary">
              Masuk
            </Link>
            <Link href="/register" className="text-muted-foreground transition-colors hover:text-primary">
              Daftar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
