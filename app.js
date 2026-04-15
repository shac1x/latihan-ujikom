import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import mainRouter from './routers/index.js';

import edgeMiddleware from 'express-edge';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(edgeMiddleware.engine || edgeMiddleware);

app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(mainRouter);

const PORT = 1234;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Aplikasi Penjualan Faktur siap digunakan bosku!');
});