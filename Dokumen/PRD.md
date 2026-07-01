# PRD — Sistem Deteksi Kecurangan Ujian Menggunakan K-Means Clustering

| | |
|---|---|
| **Nama Produk** | ExamGuard (nama kerja) — Sistem Deteksi Kecurangan Ujian |
| **Berbasis Skripsi** | *Deteksi Kecurangan Ujian Menggunakan Algoritma K-Means Clustering* |
| **Penulis Skripsi** | Cut Siti Sarah Azkiani (NIM 2022573010007) |
| **Prodi / Institusi** | Teknik Informatika — Politeknik Negeri Lhokseumawe |
| **Stack Web** | Next.js 15 (App Router) · shadcn/ui · Supabase · Flask (ML service) |
| **Aktor** | Administrator (tunggal) |
| **Versi PRD** | 1.0 |
| **Tanggal** | 1 Juli 2026 |

---

## 1. Ringkasan Produk

ExamGuard adalah aplikasi web yang membantu Administrator mendeteksi **indikasi** kecurangan ujian secara otomatis dari dataset hasil ujian. Administrator mengunggah file jawaban peserta (CSV/Excel), sistem menghitung kemiripan jawaban antar peserta memakai **Cosine Similarity**, lalu mengelompokkan peserta dengan **K-Means Clustering (K=3)** ke dalam tiga kategori: **Tidak Terindikasi**, **Terindikasi Rendah**, dan **Terindikasi Tinggi**.

Sistem mendukung dua mode ujian:
- **Online** — memakai *durasi pengerjaan* sebagai indikator pendukung.
- **Offline** — memakai *posisi tempat duduk* sebagai indikator pendukung (bila tersedia).

Penting: sistem **hanya memberi indikasi awal**, bukan keputusan final. Keputusan akhir tetap ada pada pihak berwenang lewat pemeriksaan manual.

---

## 2. Tujuan & Sasaran Produk

**Tujuan produk**
1. Menggantikan pendeteksian kecurangan manual yang lambat dan rawan salah dengan proses otomatis, sistematis, dan objektif.
2. Mengelompokkan peserta berdasarkan pola jawaban dan menandai kelompok berisiko tinggi.
3. Menyajikan hasil dalam bentuk yang mudah dibaca (dashboard, grafik, tabel) dan dapat diarsipkan sebagai riwayat.

**Sasaran terukur (success metrics)**
| Metrik | Target |
|---|---|
| Waktu analisis 1 dataset (±200 peserta) | < 10 detik |
| Silhouette score cluster | Ditampilkan tiap analisis (indikator kualitas cluster) |
| Kelengkapan alur (upload → hasil → unduh) tanpa error | 100% pada pengujian black box |
| Hasil analisis tersimpan & dapat dibuka kembali | Ya (riwayat) |

---

## 3. Ruang Lingkup

**Termasuk (In Scope)**
- Autentikasi Administrator (satu akun).
- Unggah dataset CSV/Excel + validasi format.
- Preprocessing: pembersihan data, konversi jawaban huruf → numerik.
- Perhitungan Cosine Similarity antar peserta.
- Clustering K-Means (K=3) + silhouette score.
- Interpretasi cluster → 3 kategori indikasi.
- Dashboard, pie chart, tabel detail per kategori, daftar pasangan peserta mencurigakan.
- Riwayat analisis tersimpan di Supabase & dapat dibuka lagi.
- Unduh laporan CSV.
- Mode ujian online & offline.

**Tidak Termasuk (Out of Scope)**
- Proctoring real-time / pemantauan kamera/browser saat ujian.
- Pembuatan atau pelaksanaan ujian (sistem hanya menganalisis hasil).
- Multi-role / multi-tenant (hanya satu akun admin).
- Keputusan sanksi otomatis terhadap peserta.
- Deteksi kecurangan pada soal esai/teks (fokus pada pilihan ganda / TRUE-FALSE).

---

## 4. Aktor & Persona

| Aktor | Deskripsi | Hak Akses |
|---|---|---|
| **Administrator** | Panitia ujian / operator sekolah / staf teknisi yang ditunjuk. | Akses penuh: login, unggah data, jalankan analisis, lihat hasil, kelola riwayat, unduh laporan. |

Catatan: `Sistem` (preprocessing, similarity, clustering) bertindak sebagai aktor otomatis di balik layar, bukan pengguna.

---

## 5. Arsitektur Sistem

```
┌─────────────────────┐     HTTPS      ┌──────────────────────┐
│   Next.js 15         │ ─────────────▶ │   Flask ML Service   │
│   (Frontend + BFF)   │   /analyze     │   (Scikit-Learn)     │
│   shadcn/ui, Recharts│ ◀───────────── │   KMeans + Cosine    │
└─────────┬───────────┘   JSON hasil    └──────────────────────┘
          │
          │ Supabase JS SDK (Auth, DB, Storage)
          ▼
┌───────────────────────────────────────────────┐
│                  Supabase                       │
│  • Auth  (akun admin)                           │
│  • Postgres  (analyses, participants, pairs)    │
│  • Storage  (file dataset mentah)               │
│  • RLS  (row-level security)                    │
└───────────────────────────────────────────────┘
```

**Pembagian tanggung jawab**
- **Next.js** — UI, autentikasi (Supabase Auth), unggah file ke Storage, memanggil Flask, dan **menulis hasil ke database** (Next.js sebagai pemilik persistensi → Flask tetap *stateless*).
- **Flask** — murni komputasi ML: validasi kolom, preprocessing, cosine similarity, K-Means, silhouette, kategorisasi. Tidak menyimpan apa pun.
- **Supabase** — Auth, penyimpanan dataset mentah (Storage), penyimpanan hasil (Postgres).

> Alternatif: Flask menulis langsung ke Supabase memakai *service role key*. Direkomendasikan **tidak**, agar Flask tetap stateless dan lebih mudah diuji (white box).

---

## 6. Tech Stack

| Lapisan | Teknologi |
|---|---|
| Frontend | Next.js 15 (App Router, Server Actions), TypeScript, Tailwind, **shadcn/ui** |
| Grafik | Recharts (Pie Chart, ringkasan cluster) |
| Auth | Supabase Auth (email + password, satu akun admin) |
| Database | Supabase Postgres + RLS |
| Storage | Supabase Storage (bucket `datasets`) |
| ML Service | Flask + Scikit-Learn (`KMeans`, `silhouette_score`), Pandas, NumPy |
| Parsing file | Pandas (CSV/Excel) di sisi Flask |
| Deploy | Next.js → Vercel · Flask → HuggingFace Spaces / Render (pola CitraDetect) |

---

## 7. Kebutuhan Fungsional

Prioritas: **P0** wajib (MVP skripsi), **P1** disarankan, **P2** opsional.

| ID | Fitur | Prioritas | Deskripsi |
|---|---|---|---|
| F-01 | Login Administrator | P0 | Autentikasi email/password via Supabase Auth. Hanya admin berwenang yang bisa masuk. |
| F-02 | Logout | P0 | Keluar & hapus sesi. |
| F-03 | Pilih Mode Ujian | P0 | Admin memilih **Online** atau **Offline** sebelum analisis (menentukan indikator pendukung). |
| F-04 | Unggah Dataset | P0 | Unggah CSV/Excel (.csv/.xlsx). File mentah disimpan ke Supabase Storage. |
| F-05 | Validasi Data | P0 | Cek format & kelengkapan kolom wajib. Jika gagal, tampilkan pesan error yang jelas. |
| F-06 | Pemetaan Kolom (Column Mapping) | P1 | Admin memetakan kolom dataset ke field sistem (ID, nama, kelas, jawaban, dst.) bila nama kolom berbeda. |
| F-07 | Input Kunci Jawaban | P1 | Kunci jawaban dimasukkan/diunggah untuk menghitung skor & total benar (bila belum ada di dataset). |
| F-08 | Preprocessing | P0 | Hapus duplikat, tangani nilai kosong, konversi jawaban (A,B,C,D → 1,2,3,4). |
| F-09 | Hitung Cosine Similarity | P0 | Hitung kemiripan pola jawaban antar peserta (rentang 0–1). |
| F-10 | K-Means Clustering (K=3) | P0 | Kelompokkan peserta berdasarkan fitur (skor, durasi/posisi, kemiripan tertinggi). |
| F-11 | Silhouette Score | P0 | Hitung & tampilkan kualitas cluster. |
| F-12 | Interpretasi Kategori | P0 | Petakan cluster → Tidak Terindikasi / Terindikasi Rendah / Terindikasi Tinggi. |
| F-13 | Dashboard Hasil | P0 | Ringkasan: total peserta, jumlah soal, silhouette score, sebaran kategori. |
| F-14 | Pie Chart | P0 | Visualisasi sebaran 3 kategori. |
| F-15 | Tabel Detail per Kategori | P0 | Daftar peserta per kategori + skor, kemiripan, durasi/posisi. |
| F-16 | Daftar Pasangan Mencurigakan | P1 | Pasangan peserta dengan similarity tinggi (+ durasi mirip/posisi berdekatan). |
| F-17 | Simpan Riwayat | P0 | Setiap analisis tersimpan di Supabase. |
| F-18 | Buka Riwayat | P0 | Daftar analisis lampau, dibuka kembali tanpa proses ulang. |
| F-19 | Hapus Riwayat | P1 | Admin menghapus analisis lama. |
| F-20 | Unduh Laporan CSV | P0 | Ekspor hasil (peserta + kategori + skor) sebagai CSV. |
| F-21 | Unduh Laporan PDF | P2 | Ringkasan hasil sebagai PDF untuk dokumentasi. |

---

## 8. Alur Utama (User Flow)

**Alur analisis (happy path)**
1. Admin login.
2. Pilih **New Analysis** → pilih mode **Online/Offline**.
3. Unggah file CSV/Excel → file tersimpan di Storage.
4. Sistem **validasi kolom**. Jika error → tampilkan peringatan, minta perbaikan.
5. (Opsional) Admin memetakan kolom & memasukkan kunci jawaban.
6. Admin klik **Jalankan Analisis** → Next.js kirim data ke Flask.
7. Flask: preprocessing → cosine similarity → K-Means (K=3) → silhouette → kategorisasi → kembalikan JSON.
8. Next.js simpan hasil ke Supabase & arahkan ke **Halaman Hasil**.
9. Admin melihat dashboard, pie chart, tabel per kategori, pasangan mencurigakan.
10. Admin **unduh laporan CSV** dan/atau tinggalkan hasil (sudah tersimpan sebagai riwayat).

**Alur login (dari Activity Diagram skripsi)**
Buka halaman login → isi username/password → submit → validasi. Valid → Dashboard. Tidak valid → pesan error, kembali ke login.

---

## 9. Pipeline ML (Inti Sistem)

Dokumentasi ini menerjemahkan metodologi skripsi menjadi pipeline teknis yang dapat diimplementasikan di Flask.

**Langkah:**
1. **Preprocessing** — baca dataset; hapus duplikat & tangani nilai kosong; konversi jawaban huruf → numerik. Bentuk vektor jawaban tiap peserta: `Vᵢ = [j₁, j₂, …, jₙ]`.
2. **Cosine Similarity** — hitung matriks kemiripan antar peserta:

   `similarity(A,B) = (A · B) / (|A| · |B|)`, nilai ∈ [0,1].

   Turunkan fitur per peserta: **`max_similarity`** = kemiripan tertinggi peserta terhadap peserta lain.
3. **Feature Engineering** — susun matriks fitur untuk K-Means:
   - Skor / nilai
   - `max_similarity`
   - **Online:** durasi pengerjaan (dinormalisasi)
   - **Offline:** kedekatan posisi duduk (bila tersedia)
   - Normalisasi fitur (mis. Min-Max / StandardScaler) agar skala seragam.
4. **K-Means (K=3)** — kelompokkan peserta menjadi 3 cluster.
5. **Silhouette Score** — ukur kualitas pemisahan cluster.
6. **Kategorisasi cluster → indikasi** — urutkan 3 cluster berdasarkan **rata-rata `max_similarity`** (dan/atau rata-rata skor):
   - Cluster dengan rata-rata kemiripan **tertinggi** → **Terindikasi Tinggi**
   - Cluster **menengah** → **Terindikasi Rendah**
   - Cluster **terendah** → **Tidak Terindikasi**

> **Catatan riset:** Aturan pemetaan cluster→kategori di langkah 6 adalah rancangan default. Sarah perlu memvalidasi/menyetel aturan ini (threshold, pilihan fitur) sebagai bagian dari hasil skripsi, karena label cluster dari K-Means bersifat *unsupervised* (tanpa label kebenaran).

---

## 10. Skema Database (Supabase Postgres)

```sql
-- Satu baris per proses analisis
create table analyses (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users(id),
  created_at      timestamptz default now(),
  title           text,                       -- nama analisis (opsional)
  exam_type       text check (exam_type in ('online','offline')),
  source_filename text,
  storage_path    text,                       -- path file mentah di Storage
  participant_count int,
  question_count  int,
  k_value         int default 3,
  silhouette_score numeric,
  status          text default 'done'         -- processing | done | failed
);

-- Hasil per peserta
create table participants (
  id              uuid primary key default gen_random_uuid(),
  analysis_id     uuid references analyses(id) on delete cascade,
  participant_code text,
  name            text,
  class           text,
  answers         jsonb,                       -- vektor jawaban numerik
  score           numeric,
  correct_count   int,
  duration_seconds int,                        -- online
  seat_position   text,                        -- offline
  max_similarity  numeric,                     -- kemiripan tertinggi
  cluster_id      int,
  category        text check (category in
                    ('tidak_terindikasi','terindikasi_rendah','terindikasi_tinggi'))
);

-- Pasangan peserta mencurigakan (opsional, F-16)
create table similarity_pairs (
  id              uuid primary key default gen_random_uuid(),
  analysis_id     uuid references analyses(id) on delete cascade,
  participant_a   text,
  participant_b   text,
  similarity      numeric,
  supporting_note text                          -- "durasi mirip" / "duduk berdekatan"
);
```

**Storage:** bucket privat `datasets/` menyimpan file mentah `{analysis_id}/{filename}`.

**RLS:** aktifkan Row-Level Security; hanya `user_id = auth.uid()` yang boleh membaca/menulis barisnya. Karena admin tunggal, ini menjaga agar hanya sesi terautentikasi yang dapat mengakses data.

---

## 11. Kontrak API (Flask)

**`GET /health`** → `{ "status": "ok" }`

**`POST /validate`** *(opsional, F-05)*
Cek cepat kolom wajib sebelum analisis penuh.
```json
// response
{ "valid": true, "missing_columns": [], "participant_count": 210, "question_count": 40 }
```

**`POST /analyze`** *(inti)*
```jsonc
// request (multipart: file + JSON params)
{
  "exam_type": "online",           // "online" | "offline"
  "n_clusters": 3,
  "answer_key": ["A","C","B", ...],// opsional
  "column_map": {                  // opsional
    "id": "no_peserta", "name": "nama", "class": "kelas",
    "answers_prefix": "soal_", "duration": "durasi"
  }
}
```
```jsonc
// response
{
  "meta": {
    "participant_count": 210,
    "question_count": 40,
    "k": 3,
    "silhouette_score": 0.62
  },
  "clusters": [
    { "cluster_id": 0, "category": "tidak_terindikasi",  "count": 150, "avg_similarity": 0.31 },
    { "cluster_id": 1, "category": "terindikasi_rendah", "count": 45,  "avg_similarity": 0.68 },
    { "cluster_id": 2, "category": "terindikasi_tinggi", "count": 15,  "avg_similarity": 0.92 }
  ],
  "participants": [
    {
      "participant_code": "P-001", "name": "Budi", "class": "XII-A",
      "score": 80, "correct_count": 32, "duration_seconds": 1450,
      "seat_position": null, "max_similarity": 0.94,
      "cluster_id": 2, "category": "terindikasi_tinggi"
    }
  ],
  "similarity_pairs": [
    { "participant_a": "P-001", "participant_b": "P-014",
      "similarity": 0.96, "supporting_note": "durasi hampir sama" }
  ]
}
```

---

## 12. Spesifikasi Halaman (UI)

| Halaman | Route | Komponen shadcn/ui | Isi |
|---|---|---|---|
| **Login** | `/login` | Card, Input, Button, Form | Form email/password, pesan error. |
| **Dashboard / Riwayat** | `/` | Card, Table, Badge, Button | Statistik ringkas + daftar analisis lampau + tombol *New Analysis*. |
| **Analisis Baru** | `/analyses/new` | Tabs (Online/Offline), Dropzone, Table (preview), Button | Pilih mode, unggah file, preview data, (opsional) column mapping & kunci jawaban, tombol *Jalankan Analisis*. |
| **Hasil Analisis** | `/analyses/[id]` | Card (stat), Recharts Pie, Tabs, Table, Badge, Button | Dashboard (total peserta, silhouette), pie chart 3 kategori, tabel per kategori, pasangan mencurigakan, tombol unduh CSV. |
| **Loading/Proses** | — | Skeleton, Progress, Toast (Sonner) | Indikator saat Flask memproses. |

**Prinsip UI:** sederhana, sesuai amanat skripsi — admin mudah mengunggah data, menjalankan analisis, dan membaca hasil. Kategori memakai warna badge konsisten (hijau = tidak terindikasi, kuning = rendah, merah = tinggi).

---

## 13. Kebutuhan Non-Fungsional

| Aspek | Kebutuhan |
|---|---|
| **Performa** | Analisis ±200 peserta < 10 detik. Cosine similarity sebaiknya *vectorized* (NumPy) untuk skalabilitas. |
| **Keamanan** | Semua rute dilindungi auth; RLS aktif; file dataset di bucket privat; komunikasi HTTPS. |
| **Kegunaan (Usability)** | Alur ≤ 4 langkah dari unggah ke hasil; pesan error jelas & informatif. |
| **Kompatibilitas** | Mendukung CSV & Excel (.xlsx); responsif desktop (utama) & tablet. |
| **Keandalan** | Kegagalan Flask ditangani (timeout, retry, status `failed`) tanpa membuat UI crash. |
| **Pemeliharaan** | Flask stateless → mudah diuji unit (white box). Kode terpisah frontend/ML. |

---

## 14. Rencana Pengujian

Selaras dengan Bab II skripsi (Black Box & White Box).

**Black Box (fungsional)** — contoh kasus uji:
| Kode | Skenario | Ekspektasi |
|---|---|---|
| BB-01 | Login kredensial benar | Masuk ke Dashboard |
| BB-02 | Login kredensial salah | Pesan error, tetap di login |
| BB-03 | Unggah file format salah | Peringatan validasi |
| BB-04 | Unggah dataset valid & jalankan | Hasil + pie chart tampil |
| BB-05 | Unduh laporan CSV | File terunduh sesuai data |
| BB-06 | Buka riwayat lama | Hasil tampil tanpa proses ulang |

**White Box (logika internal Flask)** — cakupan:
- Fungsi preprocessing (konversi jawaban, penanganan nilai kosong).
- Perhitungan Cosine Similarity (uji dengan vektor yang diketahui hasilnya).
- Proses K-Means & pemetaan cluster→kategori (uji percabangan pengurutan cluster).
- Perhitungan silhouette score.

---

## 15. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Label cluster K-Means tidak konsisten antar-run | Kategori bisa tertukar | Set `random_state` tetap; urutkan cluster berdasarkan `avg_similarity` (bukan indeks cluster). |
| Dataset kotor / kolom tak seragam | Analisis gagal | Validasi ketat + fitur column mapping (F-06). |
| False positive (peserta jujur tertandai) | Tuduhan keliru | Tegaskan di UI: hasil = *indikasi awal*, wajib verifikasi manual. |
| Cold start Flask (serverless) | Analisis pertama lambat | Health-check/ping berkala; tampilkan loading state. |
| Data pribadi peserta | Privasi | Bucket privat, RLS, HTTPS; jangan taruh data sensitif di URL. |

---

## 16. Roadmap / Milestone

| Fase | Fokus | Fitur |
|---|---|---|
| **M1 — Fondasi** | Setup | Next.js + shadcn, Supabase Auth, skema DB, halaman login |
| **M2 — Pipeline ML** | Flask | Endpoint `/analyze`, preprocessing, cosine, K-Means, silhouette |
| **M3 — Alur Analisis** | Integrasi | Upload → Storage → panggil Flask → simpan hasil |
| **M4 — Visualisasi** | Hasil | Dashboard, pie chart, tabel per kategori, pasangan mencurigakan |
| **M5 — Riwayat & Ekspor** | Persistensi | Daftar/buka/hapus riwayat, unduh CSV |
| **M6 — Pengujian** | QA | Black box + white box, perbaikan bug, dokumentasi |

---

## Lampiran A — Kolom Dataset

**Kolom wajib**
`ID Peserta`, `Nama Peserta`, `Kelas`, `Jawaban per soal` (mis. `soal_1 … soal_n`)

**Kolom pendukung (per mode)**
- Online: `Durasi Ujian`, `Skor`, `Total Jawaban Benar`
- Offline: `Posisi Tempat Duduk`, `Skor`, `Total Jawaban Benar`

**Kunci jawaban** — melekat pada dataset atau dimasukkan terpisah (F-07).