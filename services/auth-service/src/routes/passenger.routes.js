import express from 'express';
import {
login, register
} from "../controllers/passenger.controller"

const router = express.Router();

router.post('/register', registerPassenger);

router.post('/login', loginPassenger);

export default router;