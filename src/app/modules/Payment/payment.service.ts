import Stripe from "stripe";
import prisma from "../../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

const handleStripeWebhookEvents = async (event: Stripe.Event) => {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const appointmentId = session.metadata?.appointmentId;

      if (!appointmentId) throw new Error("Appointment ID missing in metadata");

      const isPaid = session.payment_status === "paid";

      await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          paymentStatus: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
        },
      });

      await prisma.payment.update({
        where: { appointmentId },
        data: {
          status: isPaid ? PaymentStatus.PAID : PaymentStatus.UNPAID,
          transactionId: session.payment_intent as string,
          paymentGatewayData: session as any,
        },
      });

      break;
    }

    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;

      await prisma.payment.updateMany({
        where: { transactionId: intent.id },
        data: { status: PaymentStatus.UNPAID },
      });

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }
};

export const PaymentServices = {
  handleStripeWebhookEvents,
};