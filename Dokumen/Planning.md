# Planning Implementasi — ExamGuard (Web)

Rujukan: [PRD.md](./PRD.md)

**Ruang lingkup dokumen ini:** hanya aplikasi web (Next.js 15 + shadcn/ui + Supabase). Model/pipeline ML (Flask, K-Means, Cosine Similarity) **dikembangkan terpisah** di luar planning ini dan diperlakukan sebagai API eksternal. Web hanya perlu mengikuti **kontrak API §11 PRD** (`GET /health`, `POST /validate`, `POST /analyze`) — selama kontrak itu dipenuhi, implementasi ML service tidak memengaruhi planning ini.

Kondisi awal repo: proyek Next.js 15 masih berupa **template dashboard shadcn/ui** (`app/dashboard`, `components/app-sidebar.tsx`, `components/data-table.tsx`, `components/section-cards.tsx`, `components/chart-area-interactive.tsx`, data dummy `data.json`). Belum ada Supabase client, belum ada auth. Planning ini menata ulang template tersebut menjadi ExamGuard sesuai PRD.

**Strategi ketergantungan ke ML service:** selama service Flask belum siap, gunakan **mock/stub** endpoint (`app/api/mock-analyze` atau fixture JSON sesuai contoh respons §11 PRD) supaya alur upload → hasil → riwayat tetap bisa dibangun dan didemo. Ganti base URL ke service Flask asli via env var (`ML_SERVICE_URL`) begitu tersedia — tidak perlu ubah kode integrasi.

---

## M1 — Fondasi (Setup Project & Auth)

**Tujuan:** proyek terhubung ke Supabase, admin bisa login, kerangka halaman sesuai rute PRD siap (menggantikan sisa-sisa template).

- [x] Setup project Supabase (Auth, Postgres, Storage) — buat satu akun admin.
- [x] Install `@supabase/supabase-js` & `@supabase/ssr`; buat `lib/supabase/client.ts` dan `lib/supabase/server.ts`.
- [x] Buat skema DB awal (`analyses`, `participants`, `similarity_pairs`) sesuai §10 PRD via migration, aktifkan RLS.
- [x] Buat bucket Storage privat `datasets`.
- [x] Halaman `/login` (F-01): form email/password pakai shadcn `Card`, `Input`, `Button`, `Form` — ganti placeholder auth template (jika ada) dengan Supabase Auth.
- [x] Middleware proteksi rute (redirect ke `/login` jika belum autentikasi) + tombol Logout (F-02).
- [x] Bersihkan template: hapus data dummy `app/dashboard/data.json` dan konten contoh di `section-cards.tsx`, `chart-area-interactive.tsx`, `data-table.tsx`; sesuaikan `app-sidebar.tsx` & `nav-*.tsx` supaya menu mengarah ke rute ExamGuard (`/`, `/analyses/new`, `/analyses/[id]`) bukan menu template.
- [x] Susun ulang routing: `/` = Dashboard/Riwayat, `/analyses/new` = Analisis Baru, `/analyses/[id]` = Hasil Analisis (§12 PRD).

**Selesai bila:** admin bisa login/logout, sidebar & layout sudah bertema ExamGuard (bukan template), rute kosong sudah ter-scaffold, skema DB ada di Supabase.

---

## M2 — Klien API ML & Alur Analisis

**Tujuan:** admin bisa menjalankan analisis end-to-end dari UI, terlepas dari apakah ML service asli atau mock yang menjawab di baliknya.

- [x] Buat modul klien `lib/ml-client.ts`: fungsi `validateDataset()` dan `analyzeDataset()` yang memanggil `ML_SERVICE_URL` sesuai kontrak §11 PRD (request/response persis seperti contoh JSON di PRD).
- [x] Buat mock service sementara (route handler Next.js atau fixture statis) yang mengembalikan bentuk respons `/validate` & `/analyze` sesuai §11, dipakai selama Flask asli belum tersedia.
- [x] Halaman `/analyses/new` (F-03, F-04): Tabs pilih mode Online/Offline, Dropzone unggah CSV/Excel.
- [x] Upload file mentah ke Supabase Storage (`datasets/{analysis_id}/{filename}`).
- [x] Panggil `validateDataset()` untuk cek kolom sebelum lanjut (F-05); tampilkan pesan error jelas bila gagal.
- [ ] (Opsional UI) Form column mapping (F-06) & input/upload kunci jawaban (F-07), preview data hasil parsing. *(digeser ke milestone berikutnya, P1 opsional sesuai catatan lintas milestone)*
- [x] Tombol "Jalankan Analisis" → Server Action Next.js memanggil `analyzeDataset()`.
- [x] Simpan hasil response (`analyses`, `participants`, `similarity_pairs`) ke Supabase Postgres — Next.js sebagai pemilik persistensi (§5 PRD).
- [x] Tangani status `processing` / `failed` (keandalan §13): timeout, retry, tampilkan error tanpa crash UI.
- [x] Loading state selama proses (Skeleton, Progress, Toast/Sonner).
- [x] Redirect ke `/analyses/[id]` setelah analisis selesai.

**Selesai bila:** admin unggah dataset → (via mock atau Flask asli) lihat hasil tersimpan di Supabase → diarahkan ke halaman hasil, alur ≤ 4 langkah (§13). Menukar mock ke Flask asli hanya perlu ganti `ML_SERVICE_URL`.

---

## M3 — Visualisasi Hasil

**Tujuan:** halaman hasil analisis informatif dan sesuai kebutuhan skripsi.

- [x] Ringkasan dashboard (total peserta, jumlah soal, silhouette score, sebaran kategori) — F-13. *(`section-cards.tsx`/`chart-area-interactive.tsx`/`data-table.tsx` template lama dihapus — dummy demo code, sudah tidak dipakai; diganti komponen baru di `components/analysis/` yang memakai primitive shadcn yang sama.)*
- [x] Pie Chart 3 kategori (F-14) via Recharts, warna badge konsisten (hijau/kuning/merah, §12).
- [x] Tabel Detail per Kategori (F-15): skor, kemiripan, durasi/posisi, dengan Tabs per kategori.
- [x] Tabel/Daftar Pasangan Peserta Mencurigakan (F-16): similarity tinggi + catatan pendukung (durasi mirip / posisi berdekatan).
- [x] Badge kategori & indikator "hasil = indikasi awal, perlu verifikasi manual" (mitigasi false positive, §15).

**Selesai bila:** halaman `/analyses/[id]` menampilkan dashboard, pie chart, tabel kategori, dan pasangan mencurigakan dari data hasil analisis (bukan dummy template).

---

## M4 — Riwayat & Ekspor

**Tujuan:** hasil analisis persisten dan bisa diarsipkan/diaudit.

- [ ] Halaman `/` (Dashboard/Riwayat, F-17, F-18): daftar analisis lampau (Table + Badge status), buka kembali tanpa proses ulang.
- [ ] Hapus riwayat (F-19) dengan konfirmasi (cascade delete participants & similarity_pairs).
- [ ] Unduh laporan CSV (F-20): peserta + kategori + skor.
- [ ] (P2, opsional) Unduh laporan PDF (F-21).

**Selesai bila:** admin bisa melihat daftar semua analisis, membuka salah satu tanpa re-run, menghapusnya, dan mengekspor CSV.

---

## M5 — Pengujian & Dokumentasi Web

**Tujuan:** validasi kualitas alur web sesuai Bab II skripsi, siap untuk sidang/demo.

- [ ] Black box testing sesuai kasus uji BB-01 s.d. BB-06 (§14 PRD) — login, upload invalid, upload valid + run, unduh CSV, buka riwayat. Jalankan terhadap mock dan (bila sudah tersedia) terhadap Flask asli.
- [ ] Uji performa sisi web: waktu render dashboard/tabel untuk ±200 peserta, upload & panggilan API tidak memblokir UI.
- [ ] Uji non-fungsional: RLS aktif & teruji, rute terproteksi, HTTPS di deploy, kompatibilitas CSV & Excel.
- [ ] Perbaikan bug hasil temuan pengujian.
- [ ] Dokumentasi akhir: cara deploy web, cara pakai, cara mengganti `ML_SERVICE_URL` ke service Flask produksi, mapping fitur PRD → implementasi (untuk lampiran skripsi).

**Selesai bila:** seluruh kasus uji black box lulus 100% pada alur web, siap didemokan (dengan mock atau ML service asli).

---

## Catatan Lintas Milestone

- Web **tidak mengimplementasikan** logika ML (preprocessing, cosine similarity, K-Means, silhouette) — itu tanggung jawab pengembangan Flask terpisah. Web hanya konsumen API sesuai kontrak §11 PRD.
- Ikuti pembagian tanggung jawab §5 PRD: ML service stateless (tidak menulis DB), Next.js pemilik persistensi.
- Setiap fitur P0 wajib selesai sebelum milestone dianggap tuntas; fitur P1/P2 (F-06, F-07, F-16, F-19, F-21) bisa digeser ke milestone berikutnya bila waktu terbatas, tapi jangan dilewati sama sekali karena disebut eksplisit di PRD.
- Risiko di §15 PRD yang relevan untuk web (dataset kotor sebelum dikirim, false positive di UI, cold start Flask saat memanggil API, privasi data di Storage/DB) dicek ulang di setiap milestone yang relevan, bukan hanya di M5.
