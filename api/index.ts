import express from 'express';
import { apiRouter } from '../backend/routes/api.js';

const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount router on both '/api' and '/' to handle all Vercel rewrite patterns
app.use('/api', apiRouter);
app.use('/', apiRouter);

export default app;
