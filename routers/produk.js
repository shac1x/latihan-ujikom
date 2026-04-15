import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM produk ORDER BY id_produk DESC');
    res.render('produk/index', { produks: rows });
});

router.post('/store', async (req, res) => {
    const { nama_produk, jenis, price, stock } = req.body;
    await db.query(
        'INSERT INTO produk (nama_produk, jenis, price, stock) VALUES (?, ?, ?, ?)',
        [nama_produk, jenis, price, stock]
    );
    res.redirect('/produk');
});

router.post('/update/:id', async (req, res) => {
    const { nama_produk, jenis, price, stock } = req.body;
    await db.query(
        'UPDATE produk SET nama_produk=?, jenis=?, price=?, stock=? WHERE id_produk=?',
        [nama_produk, jenis, price, stock, req.params.id]
    );
    res.redirect('/produk');
});

router.post('/delete/:id', async (req, res) => {
    await db.query('DELETE FROM produk WHERE id_produk=?', [req.params.id]);
    res.redirect('/produk');
});

router.get('/laporan', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM produk ORDER BY stock ASC');
    res.render('produk/laporan', { produks: rows });
});

export default router;