import { Request, Response } from "express";
import httpStatus from "http-status";
import Stripe from "stripe";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";
import { PaymentServices } from "./payment.service";
import { stripe } from "../../../halpers/stripe";
import sendResponse from "../../../shared/sendResponse";


const hendelStripeWebhookEvents = catchAsync(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    let event: Stripe.Event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig as string,
            config.stripe.webhook_secret as string
        );
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    const result = await PaymentServices.handleStripeWebhookEvents(event);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: " Webhooks req send successfully",
        data: result,
    });
});

export const PaymentController = {
    hendelStripeWebhookEvents,
};
