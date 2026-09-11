import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createPaymentIntent,
  handleWebhook,
} from '../controllers/payment.controller';

const router = Router();

router.post('/create-intent', authenticate, createPaymentIntent);
router.post('/webhook', handleWebhook);

export default router;
