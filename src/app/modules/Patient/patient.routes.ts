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
    '/delete/:id',
    PatientController.deletePatient
)
router.delete(
    '/soft-delete/:id',
    PatientController.softDeletePatient
)


export const PatientRoutes = router