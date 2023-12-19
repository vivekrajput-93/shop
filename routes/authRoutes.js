import express from "express";
import {forgotPasswordController, loginController, registerController, testController} from "../controllers/authControllers.js"
import { isAdmin, requiredSignIn } from "../middlewares/authMiddleware.js";

// routing to authenticate

const router = express.Router();

// Register route
router.post("/register", registerController);

// login route
router.post("/login", loginController)

// forgot password route

router.post("/forgot-password", forgotPasswordController)


// test route
router.get("/test", requiredSignIn, isAdmin, testController);

// proctected route
router.get("/user-auth", requiredSignIn, (req, res) => {
    res.status(200).send({ok: true});
})

export default router;