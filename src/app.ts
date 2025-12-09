import express, { Application } from 'express';
import router from './app/routes';
import globalErrorHandler from './app/middleWares/globalErrorHandler.ts';
import httpStatus from 'http-status'

const app: Application = express();

app.use(express.json());

// all routes
app.use('/api/v1/', router)

// main routes
app.get('/', (req, res) => {
  res.send('Hello from app.ts!');
});

app.use(globalErrorHandler)

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'Route not found',
    error: {
      path: req.originalUrl,
      method: req.method,
    },
  });
});


export default app;
