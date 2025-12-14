import express from 'express'
import { PatientController } from './patient.controller'

const router = express.Router()

router.get(
    '/',
    PatientController.getAllPatient
)
router.get(
    '/:id',
    PatientController.getSinglePatient
)
router.delete(
    '/soft-delete/:id',
    PatientController.softDeletePatient
)

export const PatientRoutes = router