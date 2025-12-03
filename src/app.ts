import express, { Application } from 'express';
import { userRoutes } from './app/modules/User/user.routes';
import { AdminRoutes } from './app/modules/Admin/admin.routes';

const app: Application = express();

app.use(express.json());

// all routes
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/admin', AdminRoutes)

// main routes
app.get('/', (req, res) => {
  res.send('Hello from app.ts!');
});

export default app;
