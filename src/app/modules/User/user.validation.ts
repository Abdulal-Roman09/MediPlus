import { z } from "zod";
import { Gender, UserStatus } from "@prisma/client";

const createAdmin = z.object({
  password: z.string().nonempty("Password is required"),

  admin: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    contactNumber: z.string().nonempty("Contact number is required"),
  })
});

const createDoctor = z.object({
  password: z.string().nonempty("Password is required"),
  doctor: z.object({
    name: z.string().nonempty("Name is required!"),
    email: z.string().nonempty("Email is required!"),
    contactNumber: z.string().nonempty("Contact Number is required!"),
    address: z.string().optional(),
    registrationNumber: z.string().nonempty("Reg number is required"),
    experience: z.number().optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z.number().refine(val => val !== undefined, { message: "Appointment fee is required", }),
    qualification: z.string().nonempty("Qualification is required"),
    currentWorkingPlace: z.string().nonempty("Current working place is required!"),
    designation: z.string().nonempty("Designation is required!"),
  }),
});

const createPatient = z.object({
  password: z.string().nonempty("Password is required"),
  patient: z.object({
    name: z.string().nonempty("Name is required!"),
    email: z.string().nonempty("Email is required!"),
    contactNumber: z.string().nonempty("Contact Number is required!"),
    address: z.string().optional(),
  }),
});

export const changeUserStatus = z.object({
  status: z.enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.DELETED]).optional(),
});


export const UserValidationSchema = {
  createAdmin,
  createDoctor,
  createPatient,
  changeUserStatus
};
