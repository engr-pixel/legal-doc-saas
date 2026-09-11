import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../app';
import { AuthRequest } from '../middleware/auth';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { planId, amount } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        userId: req.userId,
        planId,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as any;
        // Update subscription or user plan
        await prisma.subscription.updateMany({
          where: {
            userId: paymentIntent.metadata.userId,
          },
          data: {
            status: 'ACTIVE',
            stripePaymentIntentId: paymentIntent.id,
          },
        });
        break;

      case 'payment_intent.payment_failed':
        // Handle payment failure
        break;
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
