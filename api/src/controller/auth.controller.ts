import { Request, Response } from "express";
import { AuthService } from "../service/auth.service.js";
import { HttpError } from "../errors/http-error.js";

export class AuthController {
  constructor(private readonly authService: AuthService) {}
  login = (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};
    const result = this.authService.loginUser(email, password);
    return res.status(200).json({ token: result.token });
  };
}
