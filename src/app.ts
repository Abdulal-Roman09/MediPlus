import cors from 'cors'
import router from './app/routes';
import httpStatus from 'http-status'
import cookiParser from 'cookie-parser'
import express, { Application } from 'express';
import globalErrorHandler from './app/middleWares/globalErrorHandler.ts';
import { PaymentController } from './app/modules/Payment/payment.controller';

const app: Application = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.hendelStripeWebhookEvents
);

app.use(express.json());
app.use(cookiParser())

// all routes
app.use('/api/v1/', router)

// main routes
app.get('/', (req, res) => {
  res.send('  🌿 API Service is running smoothly!');
});

app.use(globalErrorHandler)

app.use((req, res, next) => {
  res.status(httpStatus.NOT_FOUND).json({
    success: false,
    message: 'API endpoint not found',
    error: {
      path: req.originalUrl,
      method: req.method,
    },
  });
});


export default app;