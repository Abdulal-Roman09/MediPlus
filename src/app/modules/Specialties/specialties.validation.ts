
import { z } from "zod";


export const createSpecialties = z.object({
  title: z.string("title is required")
});


export const SpecialtiesValidationSchema = {
createSpecialties
};
