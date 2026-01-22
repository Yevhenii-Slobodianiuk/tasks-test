import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";

export function authRouter(controller: AuthController) {
  const router = Router();

  router.post("/login", controller.login);

  return router;
}
