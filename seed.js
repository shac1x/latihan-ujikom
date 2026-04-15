import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'aplikasi_faktur_penjualan'
});

async function seed() {
    console.log('🌱 Mulai seeding data...\n');

    // Disable FK checks & truncate
    await db.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.query('TRUNCATE TABLE detail_faktur');
    await db.query('TRUNCATE TABLE faktur');
    await db.query('TRUNCATE TABLE customer');
    await db.query('TRUNCATE TABLE perusahaan');
    await db.query('TRUNCATE TABLE produk');
    await db.query('SET FOREIGN_KEY_CHECKS = 1');

    // ========== PERUSAHAAN (5 rows) ==========
    const perusahaans = [
        ['Apotek Sehat Selalu', 'Jl. Merdeka No. 1, Tangerang', '021-1234567', 10.00],
        ['Apotek Mulia Farma', 'Jl. Sudirman No. 15, Jakarta Selatan', '021-7654321', 10.00],
        ['Apotek Sumber Waras', 'Jl. Ahmad Yani No. 8, Bekasi', '021-8901234', 11.00],
        ['Apotek Medika Jaya', 'Jl. Gatot Subroto No. 22, Depok', '021-5678901', 10.00],
        ['Apotek Indo Farma', 'Jl. Diponegoro No. 5, Bogor', '0251-345678', 11.00]
    ];
    for (const p of perusahaans) {
        await db.query('INSERT INTO perusahaan (nama_perusahaan, alamat, no_telp, tax) VALUES (?, ?, ?, ?)', p);
    }
    console.log('✅ 5 data perusahaan berhasil di-seed');

    // ========== CUSTOMER (5 rows) ==========
    const customers = [
        ['Firman Syah', 'PT Abadi Jaya', 'Jl. Tambak Medokan Ayu 3c No. 23, Surabaya'],
        ['Siti Nurhaliza', 'CV Berkah Mandiri', 'Jl. Pahlawan No. 10, Tangerang'],
        ['Budi Santoso', 'PT Maju Bersama', 'Jl. Kenanga No. 5, Jakarta Timur'],
        ['Dewi Lestari', 'Toko Obat Murah', 'Jl. Melati No. 12, Bekasi'],
        ['Ahmad Rizki', 'RS Harapan Kita', 'Jl. Raya Bogor No. 88, Depok']
    ];
    for (const c of customers) {
        await db.query('INSERT INTO customer (nama_customer, perusahaan_cust, alamat) VALUES (?, ?, ?)', c);
    }
    console.log('✅ 5 data customer berhasil di-seed');

    // ========== PRODUK (5 rows) ==========
    const produks = [
        ['Bodrex Flu', 1000.00, 'Ampul', 100],
        ['Vitamin C 50 MG KF 10 Tablet', 2500.00, 'Strip', 200],
        ['Paracetamol Ekstra 20mg', 12000.00, 'Pcs', 150],
        ['Amoxicillin 500mg', 5000.00, 'Tablet', 80],
        ['Promag Tablet', 3000.00, 'Sachet', 120]
    ];
    for (const p of produks) {
        await db.query('INSERT INTO produk (nama_produk, price, jenis, stock) VALUES (?, ?, ?, ?)', p);
    }
    console.log('✅ 5 data produk berhasil di-seed');

    // ========== FAKTUR / TRANSAKSI (2 rows) ==========

    // Faktur 1: Firman Syah beli di Apotek Sehat Selalu (tax 10%)
    // Items: Bodrex Flu x2 @1000, Vitamin C x3 @2500, Paracetamol x5 @12000
    // Subtotal = 2000 + 7500 + 60000 = 69500
    // PPN 10% = 6950, DP = 0, Grand Total = 76450
    await db.query(
        'INSERT INTO faktur (no_faktur, tgl_faktur, due_date, metode_bayar, ppn, dp, grand_total, user, id_customer, id_perusahaan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ['PJ2604150001', '2026-04-15', '2026-04-30', 'Tunai', 6950.00, 0, 76450.00, 'admin', 1, 1]
    );
    await db.query('INSERT INTO detail_faktur (no_faktur, id_produk, qty, price) VALUES (?, ?, ?, ?)', ['PJ2604150001', 1, 2, 1000.00]);
    await db.query('INSERT INTO detail_faktur (no_faktur, id_produk, qty, price) VALUES (?, ?, ?, ?)', ['PJ2604150001', 2, 3, 2500.00]);
    await db.query('INSERT INTO detail_faktur (no_faktur, id_produk, qty, price) VALUES (?, ?, ?, ?)', ['PJ2604150001', 3, 5, 12000.00]);

    // Update stock for faktur 1
    await db.query('UPDATE produk SET stock = stock - 2 WHERE id_produk = 1');
    await db.query('UPDATE produk SET stock = stock - 3 WHERE id_produk = 2');
    await db.query('UPDATE produk SET stock = stock - 5 WHERE id_produk = 3');

    console.log('✅ Faktur 1 (PJ2604150001) berhasil di-seed — 3 items');

    // Faktur 2: Siti Nurhaliza beli di Apotek Mulia Farma (tax 10%)
    // Items: Amoxicillin x10 @5000, Promag x5 @3000
    // Subtotal = 50000 + 15000 = 65000
    // PPN 10% = 6500, DP = 0, Grand Total = 71500
    await db.query(
        'INSERT INTO faktur (no_faktur, tgl_faktur, due_date, metode_bayar, ppn, dp, grand_total, user, id_customer, id_perusahaan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ['PJ2604150002', '2026-04-15', '2026-05-15', 'Transfer', 6500.00, 0, 71500.00, 'admin', 2, 2]
    );
    await db.query('INSERT INTO detail_faktur (no_faktur, id_produk, qty, price) VALUES (?, ?, ?, ?)', ['PJ2604150002', 4, 10, 5000.00]);
    await db.query('INSERT INTO detail_faktur (no_faktur, id_produk, qty, price) VALUES (?, ?, ?, ?)', ['PJ2604150002', 5, 5, 3000.00]);

    // Update stock for faktur 2
    await db.query('UPDATE produk SET stock = stock - 10 WHERE id_produk = 4');
    await db.query('UPDATE produk SET stock = stock - 5 WHERE id_produk = 5');

    console.log('✅ Faktur 2 (PJ2604150002) berhasil di-seed — 2 items');

    console.log('\n🎉 Seeding selesai! Total: 5 perusahaan, 5 customer, 5 produk, 2 faktur');
    process.exit(0);
}

seed().catch(err => {
    console.error('❌ Seeding gagal:', err.message);
    process.exit(1);
});
