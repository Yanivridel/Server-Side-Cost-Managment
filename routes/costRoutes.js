import express from 'express'

import {
    createCost,
    getReport,
} from './../controllers/costController.js'

const router = express.Router();

router.post("/add", createCost);

router.get("/report", getReport);


export default router;