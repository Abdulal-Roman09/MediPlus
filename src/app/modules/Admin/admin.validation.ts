import { z } from "zod";

const updateAdminZodSchema = z.object({
    body: z.object({
        name: z.string("Name is required").optional(),
        contactNumber: z.string("Contact number is required").optional(),
    }),
});

export const AdminValidationSchema = {
    updateAdminZodSchema,
};