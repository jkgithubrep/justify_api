import request from "supertest";
import app from "../src/app";
import { User, Token, ApiRequest } from "../src/models";
import { createConnection, getConnection, getRepository } from "typeorm";
import { configDB } from "../src/db/config";

/**
 * Clean test database before running tests.
 */
beforeAll(async () => {
  await createConnection(configDB);
  await getRepository(User).createQueryBuilder().delete().execute();
  await getRepository(Token).createQueryBuilder().delete().execute();
  await getRepository(ApiRequest).createQueryBuilder().delete().execute();
});

describe("POST /api/users", () => {
  describe("Correct params", () => {
    it("should return 200 ok", async () => {
      const result = await request(app)
        .post("/api/users")
        .send({ email: "foo@bar.com", password: "password" });
      expect(result.status).toEqual(200);
      expect(result.text).toBe("User successfully created.");
    });
  });

  describe("Incorrect params", () => {
    /**
     * Make sure --runInBand option is activated.
     */
    it("should return 400 (email already registered)", async () => {
      const result = await request(app)
        .post("/api/users")
        .send({ email: "foo@bar.com", password: "password" });
      expect(result.status).toEqual(400);
      expect(result.text).toBe("Email address already used.");
    });

    it("should return 400 (empty object)", async () => {
      const result = await request(app).post("/api/users").send({});
      expect(result.status).toEqual(400);
      expect(result.text).toBe("Email missing.");
    });

    it("should return 400 (no data sent)", async () => {
      const result = await request(app).post("/api/users");
      expect(result.status).toEqual(400);
      expect(result.text).toBe("Email missing.");
    });

    it("should return 400 (email missing)", async () => {
      const result = await request(app)
        .post("/api/users")
        .send({ password: "password" });
      expect(result.status).toEqual(400);
      expect(result.text).toBe("Email missing.");
    });

    it("should return 400 (invalid email)", async () => {
      const result = await request(app)
        .post("/api/users")
        .send({ email: "foo", password: "password" });
      expect(result.status).toEqual(400);
      expect(result.text).toBe("Invalid email address.");
    });

    it("should return 400 (password missing)", async () => {
      const result = await request(app)
        .post("/api/users")
        .send({ email: "foo2@bar.com" });
      expect(result.status).toEqual(400);
      expect(result.text).toBe("Password missing.");
    });

    it("should return 400 (empty password)", async () => {
      const result = await request(app)
        .post("/api/users")
        .send({ email: "foo2@bar.com", password: "" });
      expect(result.status).toEqual(400);
      expect(result.text).toBe("Password missing.");
    });
  });
});

/**
 * Close connection to database when all test are run.
 */
afterAll(async () => {
  await getConnection().close();
});
