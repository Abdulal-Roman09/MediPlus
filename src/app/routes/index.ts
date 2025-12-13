import express from 'express';
import { UserRoutes } from '../modules/User/user.routes';
import { AdminRoutes } from '../modules/Admin/admin.routes';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { SpecialtiesRoutes } from '../modules/Specialties/specialties.route';


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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;