import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM customer ORDER BY id_customer DESC');
    res.render('customer/index', { customers: rows });
});

router.post('/store', async (req, res) => {
    const { nama_customer, perusahaan_cust, alamat } = req.body;
    await db.query(
        'INSERT INTO customer (nama_customer, perusahaan_cust, alamat) VALUES (?, ?, ?)',
        [nama_customer, perusahaan_cust, alamat]
    );
    res.redirect('/customer');
});

router.post('/update/:id', async (req, res) => {
    const { nama_customer, perusahaan_cust, alamat } = req.body;
    await db.query(
        'UPDATE customer SET nama_customer=?, perusahaan_cust=?, alamat=? WHERE id_customer=?',
        [nama_customer, perusahaan_cust, alamat, req.params.id]
    );
    res.redirect('/customer');
});

router.post('/delete/:id', async (req, res) => {
    await db.query('DELETE FROM customer WHERE id_customer=?', [req.params.id]);
    res.redirect('/customer');
});

router.get('/preview/:id', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM customer WHERE id_customer=?', [req.params.id]);
    const [fakturs] = await db.query(`
        SELECT f.*, p.nama_perusahaan 
        FROM faktur f 
        LEFT JOIN perusahaan p ON f.id_perusahaan = p.id_perusahaan 
        WHERE f.id_customer = ?
        ORDER BY f.tgl_faktur DESC
    `, [req.params.id]);
    res.render('customer/preview', { customer: rows[0], fakturs });
});

export default router;