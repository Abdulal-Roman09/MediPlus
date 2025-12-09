import express, { Application } from 'express';
import router from './app/routes';

const app: Application = express();

app.use(express.json());

// all routes
app.use('/api/v1/', router)

// main routes
app.get('/', (req, res) => {
  res.send('Hello from app.ts!');
});

export default app;
