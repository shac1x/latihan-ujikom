Berikut adalah perbaikan file `README.md` sesuai dengan instruksi yang diberikan:

***

# Aplikasi Penjualan Faktur (UJIKOM)

Aplikasi Penjualan Faktur adalah sistem informasi manajemen faktur penjualan berbasis web yang dibangun menggunakan Node.js, Express.js, Edge Template Engine, dan database MySQL. Proyek ini ditujukan untuk memenuhi persyaratan sistem dalam UJIKOM.

## Ruang Lingkup Sistem
Sistem ini mencakup beberapa modul utama:
1. Modul Master Data: Create, Read, Update, Delete (CRUD) untuk data Perusahaan, Customer, dan Produk.
2. Modul Transaksi Penjualan: Penambahan transaksi baru dan fitur cetak faktur penjualan.
3. Modul Laporan: Laporan data produk (stok) dan laporan riwayat transaksi penjualan berdasarkan rentang tanggal.

## Persyaratan Sistem
Sebelum menjalankan aplikasi, pastikan perangkat lunak berikut telah terinstal pada sistem:
* Node.js (direkomendasikan versi 14 ke atas)
* MySQL Server (bisa menggunakan XAMPP, WAMP, Laragon, atau instalasi mandiri)

## Langkah-langkah Instalasi
Pastikan sudah mengunduh dan menginstall Node.js. Jika belum, bisa mengunduhnya melalui website berikut: https://nodejs.org/en

1. Buka projectnya.
2. Buka terminal di text editor.
3. Jalankan perintah berikut untuk menginstal semua dependensi yang dibutuhkan:
   ```text
   npm install
   ```

## Konfigurasi Database

1. Buka dan jalankan layanan MySQL pada sistem (misalnya dengan menekan tombol Start pada modul MySQL di XAMPP Control Panel).
2. Buat database baru menggunakan phpMyAdmin atau MySQL command line. Beri nama database tersebut:
   ```text
   aplikasi_faktur_penjualan
   ```
3. Konfigurasi kredensial database terletak pada file `config/db.js`. Secara bawaan, pengaturan menggunakan host `localhost`, user `root`, dan password kosong. Sesuaikan pengaturan ini jika layanan MySQL menggunakan kredensial yang berbeda.

## Mengisi Data Awal (Seeding)

Aplikasi ini dilengkapi dengan skrip otomatis untuk membuat tabel dan mengisi data contoh ke dalam database.

Pada terminal, pastikan posisi saat ini masih berada di direktori proyek, lalu jalankan perintah berikut:
```text
node seed.js
```
Tunggu hingga proses selesai. Skrip ini akan secara otomatis membuat struktur tabel dan mengisi data perusahaan, customer, produk, serta beberapa contoh transaksi faktur.

## Menjalankan Aplikasi

Setelah database siap, server aplikasi dapat dinyalakan dengan perintah:
```text
npm start
```

Jika berhasil, terminal akan menampilkan pesan bahwa server telah berjalan. Buka peramban web (browser) dan akses alamat berikut:
```text
http://localhost:1234
```
