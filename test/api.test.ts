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
  await getRepository(ApiRequest).createQueryBuilder().delete().execute();
  await getRepository(Token).createQueryBuilder().delete().execute();
  await getRepository(User).createQueryBuilder().delete().execute();
});

/**
 * Test POST on /api/users
 */
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
 * Test POST on /api/token
 */
describe("POST /api/token", () => {
  describe("Correct params", () => {
    it("should return 200 ok", async () => {
      const result = await request(app)
        .post("/api/token")
        .send({ email: "foo@bar.com", password: "password" });
      expect(result.status).toEqual(200);
      expect(result.body).toEqual({
        token: expect.stringMatching(
          /[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+/
        ),
      });
    });
  });

  it("should return 400 (no body)", async () => {
    const result = await request(app).post("/api/token");
    expect(result.status).toEqual(400);
    expect(result.text).toBe("Invalid email or password.");
  });

  it("should return 400 (missing password)", async () => {
    const result = await request(app)
      .post("/api/token")
      .send({ email: "foo@bar.com" });
    expect(result.status).toEqual(400);
    expect(result.text).toBe("Invalid email or password.");
  });

  it("should return 400 (missing email)", async () => {
    const result = await request(app)
      .post("/api/token")
      .send({ password: "password" });
    expect(result.status).toEqual(400);
    expect(result.text).toBe("Invalid email or password.");
  });

  it("should return 400 (unknown email)", async () => {
    const result = await request(app)
      .post("/api/token")
      .send({ email: "not.registered@bar.com", password: "password" });
    expect(result.status).toEqual(400);
    expect(result.text).toBe("Invalid email or password.");
  });

  describe("Incorrect params", () => {
    it("should return 400 (wrong password)", async () => {
      const result = await request(app)
        .post("/api/token")
        .send({ email: "foo@bar.com", password: "wrong password" });
      expect(result.status).toEqual(400);
      expect(result.text).toBe("Invalid email or password.");
    });
  });
});

/**
 * Test POST on /api/justify
 */
describe("POST /api/justify", () => {
  describe("Correct params", () => {
    it("should return 200 ok", async () => {
      const token = await request(app)
        .post("/api/token")
        .send({ email: "foo@bar.com", password: "password" });

      const result = await request(app)
        .post("/api/justify")
        .set("Authorization", `Bearer ${token.body.token}`)
        .set("Content-Type", "text/plain")
        .send("This is some text");

      expect(result.text).toBe("This is some text");
      expect(result.status).toEqual(200);
    });
  });

  const TOKEN_EXAMPLE =
    "fyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvb0BiYXIuY29tIiwicGFzc3dvcmQiOiJwYXNzd29yZCIsImlhdCI6MTYyMzQzNTU0MX0.XrDEqG-KCt-H72xHMpTkNarMvdaYR5nvgTU2OiMcICU";

  describe("Incorrect params", () => {
    /**
     * Make sure --runInBand option is activated.
     */
    it("should return 400 (missing content-type)", async () => {
      const result = await request(app)
        .post("/api/justify")
        .set("Authorization", `Bearer ${TOKEN_EXAMPLE}`)
        .send("This is some text.");
      expect(result.status).toEqual(400);
      expect(result.text).toBe("Expected MIME type: plain/text.");
    });

    it("should return 403 (missing token)", async () => {
      const result = await request(app)
        .post("/api/justify")
        .set("Content-Type", "text/plain")
        .send("This is some text.");
      expect(result.status).toEqual(403);
      expect(result.text).toBe("Token missing.");
    });

    it("should return 400 (invalid token)", async () => {
      const result = await request(app)
        .post("/api/justify")
        .set("Authorization", `Bearer ${TOKEN_EXAMPLE}`)
        .set("Content-Type", "text/plain")
        .send("This is some text.");
      expect(result.status).toEqual(400);
      expect(result.text).toBe("invalid token");
    });
  });
});

/**
 * Close connection to database when all test are run.
 */
afterAll(async () => {
  await getConnection().close();
});
