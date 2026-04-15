import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
    const [rows] = await db.query(`
        SELECT f.*, DATE_FORMAT(f.tgl_faktur, '%Y-%m-%d') as tgl_faktur, c.nama_customer, p.nama_perusahaan
        FROM faktur f
                 LEFT JOIN customer c ON f.id_customer = c.id_customer
                 LEFT JOIN perusahaan p ON f.id_perusahaan = p.id_perusahaan
        ORDER BY f.tgl_faktur DESC
    `);
    res.render('penjualan/index', { fakturs: rows });
});

router.get('/tambah', async (req, res) => {
    const [perusahaans] = await db.query('SELECT * FROM perusahaan');
    const [customers] = await db.query('SELECT * FROM customer');
    const [produks] = await db.query('SELECT * FROM produk WHERE stock > 0');

    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const no_faktur = `PJ${yy}${mm}${dd}${hh}${mi}${ss}`;
    const today = `${now.getFullYear()}-${mm}-${dd}`;

    res.render('penjualan/tambah', { perusahaans, customers, produks, no_faktur, today });
});

router.post('/store', async (req, res) => {
    const { no_faktur, tgl_faktur, due_date, metode_bayar, id_customer, id_perusahaan, user, dp, items } = req.body;
    const parsedItems = JSON.parse(items);

    let subtotal = 0;
    for (const item of parsedItems) {
        subtotal += Number(item.qty) * Number(item.price);
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [[perusahaan]] = await connection.query('SELECT tax FROM perusahaan WHERE id_perusahaan = ?', [id_perusahaan]);
        const taxRate = Number(perusahaan?.tax || 0);
        const ppn = subtotal * (taxRate / 100);
        const dpAmount = parseFloat(dp) || 0;
        const grand_total = subtotal + ppn - dpAmount;

        await connection.query(
            'INSERT INTO faktur (no_faktur, tgl_faktur, due_date, metode_bayar, ppn, dp, grand_total, user, id_customer, id_perusahaan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [no_faktur, tgl_faktur, due_date || null, metode_bayar, ppn, dpAmount, grand_total, user || 'admin', id_customer, id_perusahaan]
        );

        for (const item of parsedItems) {
            await connection.query(
                'INSERT INTO detail_faktur (no_faktur, id_produk, qty, price) VALUES (?, ?, ?, ?)',
                [no_faktur, item.id_produk, item.qty, item.price]
            );
            await connection.query('UPDATE produk SET stock = stock - ? WHERE id_produk = ?', [item.qty, item.id_produk]);
        }

        await connection.commit();
        res.redirect('/penjualan');
    } catch (error) {
        await connection.rollback();
        res.status(500).send("Terjadi kesalahan sistem saat menyimpan transaksi.");
    } finally {
        connection.release();
    }
});

router.get('/faktur/:no_faktur', async (req, res) => {
    const no = req.params.no_faktur;

    const [[header]] = await db.query(`
        SELECT f.*, DATE_FORMAT(f.tgl_faktur, '%d %M %Y %H:%i:%s') as tgl_faktur_fmt,
               c.nama_customer, c.alamat as alamat_cust, c.perusahaan_cust,
               p.nama_perusahaan, p.alamat as alamat_perusahaan, p.no_telp, p.tax
        FROM faktur f
                 LEFT JOIN customer c ON f.id_customer = c.id_customer
                 LEFT JOIN perusahaan p ON f.id_perusahaan = p.id_perusahaan
        WHERE f.no_faktur = ?`, [no]);

    const [items] = await db.query(`
        SELECT df.*, pr.nama_produk, pr.jenis
        FROM detail_faktur df
                 JOIN produk pr ON df.id_produk = pr.id_produk
        WHERE df.no_faktur = ?`, [no]);

    let subtotal = 0;
    items.forEach(d => subtotal += Number(d.qty) * Number(d.price));

    let totalQty = 0;
    items.forEach(d => totalQty += Number(d.qty));

    res.render('faktur', { header, items, subtotal, totalQty });
});

router.get('/edit/:no_faktur', async (req, res) => {
    const no = req.params.no_faktur;
    const [[faktur]] = await db.query(`
        SELECT *, DATE_FORMAT(tgl_faktur, '%Y-%m-%d') as tgl_faktur, DATE_FORMAT(due_date, '%Y-%m-%d') as due_date 
        FROM faktur WHERE no_faktur = ?
    `, [no]);

    const [details] = await db.query(`
        SELECT df.*, pr.nama_produk
        FROM detail_faktur df
                 JOIN produk pr ON df.id_produk = pr.id_produk
        WHERE df.no_faktur = ?`, [no]);

    const [perusahaans] = await db.query('SELECT * FROM perusahaan');
    const [customers] = await db.query('SELECT * FROM customer');
    const [produks] = await db.query('SELECT * FROM produk');

    const formattedDetails = details.map(d => ({
        id_produk: d.id_produk,
        qty: d.qty,
        price: Number(d.price)
    }));

    res.render('penjualan/edit', { faktur, details: formattedDetails, perusahaans, customers, produks });
});

router.post('/update/:no_faktur', async (req, res) => {
    const oldNo = req.params.no_faktur;
    const { tgl_faktur, due_date, metode_bayar, id_customer, id_perusahaan, user, dp, items } = req.body;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const [oldDetails] = await connection.query('SELECT * FROM detail_faktur WHERE no_faktur = ?', [oldNo]);
        for (const d of oldDetails) {
            await connection.query('UPDATE produk SET stock = stock + ? WHERE id_produk = ?', [d.qty, d.id_produk]);
        }

        await connection.query('DELETE FROM detail_faktur WHERE no_faktur = ?', [oldNo]);

        const parsedItems = JSON.parse(items);
        let subtotal = 0;
        for (const item of parsedItems) {
            subtotal += Number(item.qty) * Number(item.price);
        }

        const [[perusahaan]] = await connection.query('SELECT tax FROM perusahaan WHERE id_perusahaan = ?', [id_perusahaan]);
        const taxRate = Number(perusahaan?.tax || 0);
        const ppn = subtotal * (taxRate / 100);
        const dpAmount = parseFloat(dp) || 0;
        const grand_total = subtotal + ppn - dpAmount;

        await connection.query(
            'UPDATE faktur SET tgl_faktur=?, due_date=?, metode_bayar=?, ppn=?, dp=?, grand_total=?, user=?, id_customer=?, id_perusahaan=? WHERE no_faktur=?',
            [tgl_faktur, due_date || null, metode_bayar, ppn, dpAmount, grand_total, user || 'admin', id_customer, id_perusahaan, oldNo]
        );

        for (const item of parsedItems) {
            await connection.query(
                'INSERT INTO detail_faktur (no_faktur, id_produk, qty, price) VALUES (?, ?, ?, ?)',
                [oldNo, item.id_produk, item.qty, item.price]
            );
            await connection.query('UPDATE produk SET stock = stock - ? WHERE id_produk = ?', [item.qty, item.id_produk]);
        }

        await connection.commit();
        res.redirect('/penjualan');
    } catch (error) {
        await connection.rollback();
        res.status(500).send("Terjadi kesalahan sistem saat mengupdate transaksi.");
    } finally {
        connection.release();
    }
});

router.post('/delete/:no_faktur', async (req, res) => {
    const no = req.params.no_faktur;
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const [details] = await connection.query('SELECT * FROM detail_faktur WHERE no_faktur = ?', [no]);
        for (const d of details) {
            await connection.query('UPDATE produk SET stock = stock + ? WHERE id_produk = ?', [d.qty, d.id_produk]);
        }
        await connection.query('DELETE FROM detail_faktur WHERE no_faktur = ?', [no]);
        await connection.query('DELETE FROM faktur WHERE no_faktur = ?', [no]);
        await connection.commit();
        res.redirect('/penjualan');
    } catch (error) {
        await connection.rollback();
        res.status(500).send("Terjadi kesalahan saat menghapus data.");
    } finally {
        connection.release();
    }
});

router.get('/laporan', async (req, res) => {
    const { dari, sampai } = req.query;
    let query = `
        SELECT f.*, DATE_FORMAT(f.tgl_faktur, '%Y-%m-%d') as tgl_faktur, c.nama_customer, p.nama_perusahaan
        FROM faktur f
                 LEFT JOIN customer c ON f.id_customer = c.id_customer
                 LEFT JOIN perusahaan p ON f.id_perusahaan = p.id_perusahaan
    `;
    const params = [];
    if (dari && sampai) {
        query += ' WHERE f.tgl_faktur BETWEEN ? AND ?';
        params.push(dari, sampai);
    }
    query += ' ORDER BY f.tgl_faktur DESC';

    const [rows] = await db.query(query, params);

    let totalPenjualan = 0;
    rows.forEach(r => totalPenjualan += Number(r.grand_total));

    res.render('penjualan/laporan', { fakturs: rows, totalPenjualan, dari: dari || '', sampai: sampai || '' });
});

export default router;