import express from 'express';
import { corsMiddleware } from './middlewares/corsMiddleware';
import { errorMiddleware } from './middlewares/errorMiddleware';
import router from './routes/index';

const app = express();

app.use(express.json());
app.use(corsMiddleware);
app.use(router);
app.use(errorMiddleware);

export default app;