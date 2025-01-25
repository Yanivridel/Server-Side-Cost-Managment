import express from 'express'

import {
    createUser,
    getUserById
} from './../controllers/userController.js'

const router = express.Router();

router.post("/create", createUser);

router.get("/:id", getUserById);

export default router;