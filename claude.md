# CLAUDE.md

## Project: Hairdept Mobile App

## Project Context

Project 3 adalah aplikasi Hairdept Management berbasis web.

Mentor memberikan requirement:

> "turn project 3 into react native app. No need all menu."

Project ini akan dibuat menjadi aplikasi **React Native mobile untuk kasir**.

Aplikasi mobile **tidak perlu memindahkan seluruh menu dari versi web**.

Fokus utama mobile adalah:

> **Orders / Antrean — Halaman Utama Kasir**

---

# Tech Stack

Gunakan:

* React Native
* Expo
* TypeScript
* React Navigation
* Existing Project 3 Backend/API

Untuk HTTP client, gunakan `fetch` atau Axios hanya ketika API mulai diintegrasikan.

Jangan menambahkan library yang belum diperlukan.

---

# Mobile Scope

Mobile app hanya berfokus pada tiga kebutuhan utama:

## 1. Orders / Antrean

Ini adalah halaman utama kasir.

Kasir dapat memantau pesanan aktif berdasarkan status:

### Waiting

Pelanggan sudah melakukan check-in tetapi belum mulai dicukur.

### In Service

Pelanggan sedang mendapatkan layanan dari kapster.

### Completed Unpaid

Layanan sudah selesai tetapi pelanggan belum melakukan pembayaran.

### Paid

Pesanan sudah dibayar.

---

## Quick Filter

Orders / Antrean mempunyai filter status:

```text
[ Waiting ] [ In Service ] [ Completed ]
```

Filter `Completed` menampilkan pesanan yang sudah selesai cukur dan menunggu pembayaran.

---

# 2. New Order / Check-in

Tombol utama:

```text
+ NEW ORDER
```

Digunakan kasir ketika pelanggan baru datang.

Form New Order membutuhkan:

### Customer

Input atau pilih nama pelanggan.

### Kapster

Pilih kapster yang bertugas.

### Service

Pilih jenis layanan.

Contoh:

* Haircut
* Shaving
* Haircut + Shaving
* Service lain yang tersedia di backend

Setelah order dibuat, status awal:

```text
WAITING
```

Flow:

```text
+ NEW ORDER
      ↓
Customer
      ↓
Kapster
      ↓
Service
      ↓
Confirm Order
      ↓
WAITING
```

---

# 3. Payment & Invoice

Ketika status order:

```text
COMPLETED_UNPAID
```

kasir dapat melakukan:

```text
BAYAR
```

Payment harus mendukung:

### Total

Menampilkan total harga order.

### Nominal Uang Diterima

Kasir memasukkan jumlah uang yang diterima.

### Kembalian

Sistem menghitung:

```text
Kembalian = Uang Diterima - Total
```

### Payment Method

Pilihan:

```text
Cash
QRIS
```

Setelah pembayaran berhasil:

```text
COMPLETED_UNPAID
        ↓
      PAID
```

### Invoice Preview

Setelah pembayaran berhasil, tersedia opsi:

```text
Invoice Preview
```

Untuk menampilkan informasi struk.

Fitur cetak dapat mengikuti kemampuan device/platform dan tidak menjadi prioritas Day 1.

---

# 4. Customer

Customer merupakan bagian dari flow kasir.

Customer digunakan untuk:

* Input nama pelanggan saat New Order
* Memilih customer yang sudah terdaftar
* Melihat informasi customer
* Mencari customer

Jika backend sudah menyediakan data customer, gunakan data tersebut.

Jangan membuat Customer Management yang terlalu besar.

Customer bukan menu utama mobile.

---

# Main Mobile Navigation

Jangan menyalin sidebar desktop.

Karena aplikasi ini untuk kasir, halaman utama adalah:

```text
Orders / Antrean
```

Struktur navigation:

```text
Orders / Antrean
│
├── Active Orders
│   ├── Waiting
│   ├── In Service
│   └── Completed
│
├── + NEW ORDER
│   ├── Customer
│   ├── Kapster
│   ├── Service
│   └── Confirm Order
│
└── Order Detail
    └── Payment
        └── Invoice Preview
```

---

# Planned Screens

Gunakan TypeScript.

```text
OrdersScreen.tsx
NewOrderScreen.tsx
CustomerSelectionScreen.tsx
KapsterSelectionScreen.tsx
ServiceSelectionScreen.tsx
OrderDetailScreen.tsx
PaymentScreen.tsx
InvoicePreviewScreen.tsx
```

Screen tersebut dapat dibuat sebagai placeholder terlebih dahulu.

---

# TypeScript

Gunakan TypeScript sejak awal.

Jangan menggunakan `any` jika tidak diperlukan.

Contoh type status:

```ts
export type OrderStatus =
  | 'WAITING'
  | 'IN_SERVICE'
  | 'COMPLETED_UNPAID'
  | 'PAID';
```

Namun, jika backend Project 3 sudah memiliki enum/status yang berbeda, **ikuti contract backend**.

Jangan mengarang status baru jika backend sudah menentukan statusnya.

---

# Suggested Structure

Sesuaikan dengan struktur repository yang sudah ada.

Contoh:

```text
mobile/
├── src/
│   ├── components/
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   └── OrderNavigator.tsx
│   ├── screens/
│   │   ├── OrdersScreen.tsx
│   │   ├── NewOrderScreen.tsx
│   │   ├── CustomerSelectionScreen.tsx
│   │   ├── KapsterSelectionScreen.tsx
│   │   ├── ServiceSelectionScreen.tsx
│   │   ├── OrderDetailScreen.tsx
│   │   ├── PaymentScreen.tsx
│   │   └── InvoicePreviewScreen.tsx
│   ├── services/
│   ├── types/
│   └── utils/
└── package.json
```

Jangan membuat struktur secara berlebihan jika belum dibutuhkan.

---

# Day 1 Scope

Day 1 hanya mengerjakan:

1. Inspect Project 3.
2. Setup React Native.
3. Setup Expo.
4. Setup TypeScript.
5. Setup React Navigation.
6. Buat Orders / Antrean sebagai halaman utama.
7. Buat navigation menuju New Order.
8. Buat placeholder Customer.
9. Buat placeholder Kapster.
10. Buat placeholder Service.
11. Buat placeholder Order Detail.
12. Buat placeholder Payment.
13. Buat placeholder Invoice Preview.
14. Jalankan dan test aplikasi.

---

# DO NOT IMPLEMENT ON DAY 1

Jangan mengerjakan:

* API integration
* Authentication/Login
* Real order fetching
* Real order creation
* Real customer search
* Real kapster fetching
* Real service fetching
* Payment calculation
* Cash payment
* QRIS integration
* PAID status update
* Invoice generation
* Print receipt
* Customer CRUD
* Dashboard
* Reports
* Order History
* Service & Product
* Invoices menu

Day 1 hanya:

> **Setup + Navigation + Screen Structure**

---

# AI Agent Rules

1. Baca `CLAUDE.md` sebelum bekerja.
2. Inspect repository terlebih dahulu.
3. Jangan langsung mengubah kode sebelum memahami struktur Project 3.
4. Jangan menghapus Project 3.
5. Jangan merusak frontend web yang sudah ada.
6. Jangan mengubah backend.
7. Jangan membuat API palsu.
8. Jangan membuat fitur di luar Day 1.
9. Gunakan TypeScript.
10. Jangan menggunakan `any` tanpa alasan.
11. Install dependency seminimal mungkin.
12. Test aplikasi sebelum commit.
13. Jika terjadi error, perbaiki error yang berhubungan dengan Day 1 saja.
14. Jangan melanjutkan otomatis ke Day 2.

---

# Day 1 Definition of Done

Day 1 selesai apabila:

* Expo React Native berhasil dijalankan.
* TypeScript berhasil digunakan.
* Orders / Antrean tampil sebagai halaman utama.
* Navigation berjalan.
* `+ NEW ORDER` dapat dibuka.
* Customer screen dapat dibuka.
* Kapster screen dapat dibuka.
* Service screen dapat dibuka.
* Order Detail dapat dibuka.
* Payment dapat dibuka.
* Invoice Preview dapat dibuka.
* Back navigation berjalan.
* Tidak ada error navigation/runtime yang menghalangi aplikasi.
* Project 3 yang lama tetap aman.

---

# Git Commit

Setelah aplikasi berhasil ditest:

```bash
git add .
git commit -m "feat: setup mobile app and cashier navigation"
```

Gunakan **satu commit saja untuk Day 1**.
