import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

// List
router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM produk ORDER BY id_produk DESC');
    res.render('produk/index', { produks: rows });
});

// Store
router.post('/store', async (req, res) => {
    const { nama_produk, jenis, price, stock } = req.body;
    await db.query(
        'INSERT INTO produk (nama_produk, jenis, price, stock) VALUES (?, ?, ?, ?)',
        [nama_produk, jenis, price, stock]
    );
    res.redirect('/produk');
});

// Update
router.post('/update/:id', async (req, res) => {
    const { nama_produk, jenis, price, stock } = req.body;
    await db.query(
        'UPDATE produk SET nama_produk=?, jenis=?, price=?, stock=? WHERE id_produk=?',
        [nama_produk, jenis, price, stock, req.params.id]
    );
    res.redirect('/produk');
});

// Delete
router.post('/delete/:id', async (req, res) => {
    await db.query('DELETE FROM produk WHERE id_produk=?', [req.params.id]);
    res.redirect('/produk');
});

export default router;