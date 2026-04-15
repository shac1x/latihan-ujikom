import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM perusahaan ORDER BY id_perusahaan DESC');
    res.render('perusahaan/index', { data: rows });
});

router.post('/store', async (req, res) => {
    const { nama_perusahaan, alamat, no_telp, tax } = req.body;
    await db.query(
        'INSERT INTO perusahaan (nama_perusahaan, alamat, no_telp, tax) VALUES (?, ?, ?, ?)',
        [nama_perusahaan, alamat, no_telp, tax]
    );
    res.redirect('/perusahaan');
});

router.post('/update/:id', async (req, res) => {
    const { nama_perusahaan, alamat, no_telp, tax } = req.body;
    await db.query(
        'UPDATE perusahaan SET nama_perusahaan=?, alamat=?, no_telp=?, tax=? WHERE id_perusahaan=?',
        [nama_perusahaan, alamat, no_telp, tax, req.params.id]
    );
    res.redirect('/perusahaan');
});

router.post('/delete/:id', async (req, res) => {
    await db.query('DELETE FROM perusahaan WHERE id_perusahaan=?', [req.params.id]);
    res.redirect('/perusahaan');
});

export default router;