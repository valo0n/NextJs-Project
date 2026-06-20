import type { NextApiRequest, NextApiResponse } from "next";

// Mock-o DB-në që mongoose të mos ngarkohet në test (testojmë vetëm validimin)
jest.mock("@/lib/dbConnect", () => ({ dbConnect: jest.fn() }));
jest.mock("@/models/Contact", () => ({
  __esModule: true,
  default: { create: jest.fn() },
}));

import handler from "@/pages/api/contact";

// Mock i thjeshtë i req/res (pa DB - testojmë validimin)
function mockReqRes(method: string, body: Record<string, unknown> = {}) {
  const req = {
    method,
    body,
    query: {},
    headers: {},
  } as unknown as NextApiRequest;
  const res = {
    statusCode: 0,
    data: undefined as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.data = payload;
      return this;
    },
    setHeader() {
      return this;
    },
  };
  return { req, res: res as unknown as NextApiResponse & typeof res };
}

describe("/api/contact", () => {
  it("kthen 405 për metodë jo-POST", async () => {
    const { req, res } = mockReqRes("GET");
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });

  it("kthen 400 kur mungojnë fushat e detyrueshme", async () => {
    const { req, res } = mockReqRes("POST", { name: "Filan" });
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it("kthen 400 për email të pavlefshëm", async () => {
    const { req, res } = mockReqRes("POST", {
      name: "Filan",
      email: "jo-email",
      message: "Përshëndetje, kjo është një test mesazh.",
    });
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });
});
