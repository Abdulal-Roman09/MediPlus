import express from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.routes';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { DoctorRoutes } from '../modules/Doctor/doctor.routes';
import { ReviewsRoutes } from '../modules/reviews/reviews.route';
import { PatientRoutes } from '../modules/Patient/patient.routes';
import { ScheduleRoutes } from '../modules/Schedule/schedule.routes';
import { StatisticsRoutes } from '../modules/Statistics/statistics.routes';
import { SpecialtiesRoutes } from '../modules/Specialties/specialties.route';
import { AppoinmentRoutes } from '../modules/Appointment/appointment.routes';
import { DoctorScheduleRoutes } from '../modules/DoctorSchedule/doctorSchedule.routes';

const router = express.Router();

const moduleRoutes = [
    {
        path: '/user',
        route: UserRoutes,
    },
    {
        path: '/admin',
        route: AdminRoutes,
    },
    {
        path: '/auth',
        route: AuthRoutes
    },
    {
        path: '/specialties',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: DoctorRoutes,
    },
    {
        path: '/patient',
        route: PatientRoutes
    },
    {
        path: '/schedule',
        route: ScheduleRoutes
    },
    {
        path: '/doctor-schedule',
        route: DoctorScheduleRoutes
    },
    {
        path: '/appoinment',
        route: AppoinmentRoutes
    },
    {
        path: '/statistics',
        route: StatisticsRoutes
    },
    {
        path: '/reviews',
        route: ReviewsRoutes
    }
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;