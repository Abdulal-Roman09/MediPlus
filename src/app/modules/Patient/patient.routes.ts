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

export const PatientRoutes = router