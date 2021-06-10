import bcrypt from "bcryptjs";
const saltRounds = 10;

export class User {
  email: string;
  password: string;
  validated = false;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }

  async register(): Promise<void> {
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}
