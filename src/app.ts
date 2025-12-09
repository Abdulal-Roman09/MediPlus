import express, { Application } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middleWares/globalErrorHandler.ts';

const app: Application = express();

app.use(express.json());

// all routes
app.use('/api/v1/', router)

// main routes
app.get('/', (req, res) => {
  res.send('Hello from app.ts!');
});

app.use(globalErrorHandler)

export default app;
