import { HttpError } from "../errors/http-error.js";

export class AuthService {
  private readonly validEmail = "test@example.com";
  private readonly validPassword = "123456";

  loginUser(email: unknown, password: unknown) {
    if (typeof email !== "string" || typeof password !== "string") {
      throw new HttpError(400, "Email and password must be strings");
    }

    if (email !== this.validEmail || password !== this.validPassword) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = process.env.AUTH_TOKEN || "valid-token";
    return { token };
  }
}
