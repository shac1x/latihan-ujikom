import { Router } from 'express';
import db from '../config/db.js';
import perusahaanRouter from './perusahaan.js';
import customerRouter from './customer.js';
import produkRouter from './produk.js';
import penjualanRouter from './penjualan.js';

const router = Router();

router.use('/perusahaan', perusahaanRouter);
router.use('/customer', customerRouter);
router.use('/produk', produkRouter);
router.use('/penjualan', penjualanRouter);

// Dashboard with dynamic counts
router.get('/', async (req, res) => {
    const [[produkCount]] = await db.query('SELECT COUNT(*) as total FROM produk');
    const [[customerCount]] = await db.query('SELECT COUNT(*) as total FROM customer');
    const [[fakturCount]] = await db.query('SELECT COUNT(*) as total FROM faktur');
    const [[perusahaanCount]] = await db.query('SELECT COUNT(*) as total FROM perusahaan');
    const [[totalPenjualan]] = await db.query('SELECT COALESCE(SUM(grand_total), 0) as total FROM faktur');

    res.render('index', {
        totalProduk: produkCount.total,
        totalCustomer: customerCount.total,
        totalFaktur: fakturCount.total,
        totalPerusahaan: perusahaanCount.total,
        totalPenjualan: Number(totalPenjualan.total)
    });
});

export default router;