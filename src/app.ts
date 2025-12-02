import express, { Application } from 'express';
import { userRoutes } from './app/modules/User/user.routes';

const app: Application = express();

app.use(express.json());

// all routes
app.use('/api/v1/users', userRoutes)

// main routes
app.get('/', (req, res) => {
  res.send('Hello from app.ts!');
});

export default app;
