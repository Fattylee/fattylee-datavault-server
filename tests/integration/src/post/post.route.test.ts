import request from "supertest";
import { server } from "../../../../src/config/connection";

describe("post", () => {
  describe("GET /", () => {
    test("should return all posts", async () => {
      const res = await request(server).get("/api/v1/posts");
    });
  });
});
